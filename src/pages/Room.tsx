import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "@/firebase/firebaseconfig";
import {
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  setDoc,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { Copy, Settings, Clock, Zap, Target } from "lucide-react";
import { useLanguage } from "@/contexts/language-provider";

// Función para obtener el nickname del usuario desde Firestore
const getUserNickname = async (userId: string): Promise<string | null> => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.nickname;
    } else {
      console.log("No such user document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user nickname: ", error);
    return null;
  }
};

// Configuraciones del juego
interface GameSettings {
  timeLimit: boolean;
  timeLimitSeconds: number;
  specialQuestions: boolean;
  rapidBonus: boolean;
  rapidBonusSeconds: number;
}

const Room = () => {
  const { roomId } = useParams();
  const [roomData, setRoomData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [showGameSettings, setShowGameSettings] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        console.log("No user is authenticated");
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomId || !user) {
        console.error("Room ID or user is missing");
        return;
      }

      const roomRef = doc(db, "rooms", roomId);

      try {
        const roomSnap = await getDoc(roomRef);
        if (roomSnap.exists()) {
          setRoomData(roomSnap.data());
          setLoading(false);
        } else {
          console.log("Room does not exist, creating it...");

          const nickname = await getUserNickname(user.uid);
          if (!nickname) {
            console.error("Nickname not found for user");
            return;
          }

          await setDoc(roomRef, {
            creator: {
              id: user.uid,
              nickname: nickname,
            },
            players: [
              {
                id: user.uid,
                nickname: nickname,
                joinedAt: Timestamp.now(),
              },
            ],
            status: "waiting",
            createdAt: Timestamp.now(),
          });

          const newRoomSnap = await getDoc(roomRef);
          setRoomData(newRoomSnap.data());
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching room data: ", error);
      }
    };

    fetchRoomData();
  }, [roomId, user]);

  useEffect(() => {
    if (!roomId) return;

    const roomRef = doc(db, "rooms", roomId);
    const unsubscribe = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        const updatedRoomData = docSnap.data();
        setRoomData(updatedRoomData);

        if (updatedRoomData.status === "in_progress") {
          navigate(`/game/${roomId}`);
        }
      }
    });

    return () => unsubscribe();
  }, [roomId, navigate]);

  useEffect(() => {
    const joinRoom = async () => {
      // Verificar que 'user', 'roomId' y 'roomData' estén disponibles antes de proceder
      if (!user || !roomId || !roomData || !roomData.players) {
        console.log("Missing data, skipping join");
        return;
      }

      const roomRef = doc(db, "rooms", roomId);

      // Verificar si el jugador ya está en la sala
      const isPlayerInRoom = roomData.players.some(
        (player: { id: string }) => player.id === user.uid
      );

      if (isPlayerInRoom) {
        console.log("Player already in the room, skipping join");
        return;
      }

      // Obtener el apodo del usuario
      const nickname = await getUserNickname(user.uid);
      if (!nickname) {
        console.error("Nickname not found for user");
        return;
      }

      // Intentar agregar el jugador a la sala
      try {
        await updateDoc(roomRef, {
          players: arrayUnion({
            id: user.uid,
            nickname: nickname,
            joinedAt: Timestamp.now(),
          }),
        });
        console.log("Player successfully joined the room");
      } catch (error) {
        console.error("Error joining room: ", error);
      }
    };

    // Solo ejecutar si 'roomId', 'user' y 'roomData' están disponibles
    if (roomId && user && roomData) {
      joinRoom();
    } else {
      console.log("Waiting for required data...");
    }
  }, [roomId, user, roomData]);

  const handleStartGame = async () => {
    // Verificar que 'roomId' no es undefined
    if (!roomId) {
      console.error("Room ID is undefined");
      return;
    }

    const roomRef = doc(db, "rooms", roomId);

    // Intentar cambiar el estado de la sala a 'in_progress'
    try {
      await updateDoc(roomRef, {
        status: "in_progress",
      });
      navigate(`/game/${roomId}`);
    } catch (error) {
      console.error("Error starting the game: ", error);
    }
  };

  const handleCopyRoomId = async () => {
    try {
      if (roomId) {
        await navigator.clipboard.writeText(roomId);
        alert(t("room.roomIdCopied"));
      } else {
        console.error("Room ID is undefined");
      }
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleLeaveRoom = async () => {
    if (!roomData || !user || !roomId) return;

    const roomRef = doc(db, "rooms", roomId);

    try {
      const updatedPlayers = roomData.players.filter(
        (player: { id: string }) => player.id !== user.uid
      );

      await updateDoc(roomRef, {
        players:
          updatedPlayers.length > 0
            ? updatedPlayers
            : arrayRemove({
                id: user.uid,
                nickname: user.displayName || "Unknown",
              }),
      });

      console.log("Player removed successfully");
      if (updatedPlayers.length === 0) {
        await updateDoc(roomRef, {
          status: "empty",
        });
      }

      navigate("/lobby");
    } catch (error) {
      console.error("Error removing player from room: ", error);
    }
  };

  // Función para actualizar configuraciones del juego
  const updateGameSettings = async (newSettings: Partial<GameSettings>) => {
    if (!roomId || !roomData) return;

    const roomRef = doc(db, "rooms", roomId);
    try {
      await updateDoc(roomRef, {
        gameSettings: { ...roomData.gameSettings, ...newSettings },
      });
    } catch (error) {
      console.error("Error updating game settings: ", error);
    }
  };

  // Mostrar estado de carga mientras se obtienen los datos
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center px-4 min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900">
        <div className="p-8 space-y-6 w-full max-w-md bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:shadow-2xl">
          <div className="text-center">
            <div className="inline-block w-8 h-8 rounded-full border-4 border-indigo-500 animate-spin border-t-transparent"></div>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              {t("room.loadingRoom")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center px-4 min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900">
      <div className="p-8 space-y-6 w-full max-w-md bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          {t("room.title")}:{" "}
          <span className="text-indigo-600 dark:text-indigo-400">{roomId}</span>
          <button
            onClick={handleCopyRoomId}
            className="ml-2 text-indigo-500 transition hover:text-indigo-700 focus:ring-2 focus:ring-indigo-300 dark:text-indigo-400 dark:hover:text-indigo-600"
            aria-label={t("room.copyId")}
          >
            <Copy />
          </button>
        </h2>

        {/* Panel de Configuraciones del Juego */}
        {roomData?.creator?.id === user?.uid && roomData?.status === "waiting" && (
          <div className="p-4 bg-gray-50 rounded-md shadow-inner dark:bg-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {t("room.gameSettings")}
              </h3>
              <button
                onClick={() => setShowGameSettings(!showGameSettings)}
                className="p-2 text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-600"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {showGameSettings && (
              <div className="space-y-4">
                {/* Tiempo Límite */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg dark:bg-gray-800">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("room.timeLimit")}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={roomData?.gameSettings?.timeLimit || false}
                      onChange={(e) =>
                        updateGameSettings({ timeLimit: e.target.checked })
                      }
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    {roomData?.gameSettings?.timeLimit && (
                      <input
                        type="number"
                        min="5"
                        max="30"
                        value={roomData?.gameSettings?.timeLimitSeconds || 10}
                        onChange={(e) =>
                          updateGameSettings({
                            timeLimitSeconds: parseInt(e.target.value),
                          })
                        }
                        className="w-16 px-2 py-1 text-xs border rounded dark:bg-gray-700 dark:border-gray-600"
                      />
                    )}
                  </div>
                </div>

                {/* Preguntas Especiales */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg dark:bg-gray-800">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("room.specialQuestions")}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={roomData?.gameSettings?.specialQuestions || false}
                    onChange={(e) =>
                      updateGameSettings({ specialQuestions: e.target.checked })
                    }
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                </div>

                {/* Bonificación Rápida */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg dark:bg-gray-800">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("room.rapidBonus")}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={roomData?.gameSettings?.rapidBonus || false}
                      onChange={(e) =>
                        updateGameSettings({ rapidBonus: e.target.checked })
                      }
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    {roomData?.gameSettings?.rapidBonus && (
                      <input
                        type="number"
                        min="2"
                        max="8"
                        value={roomData?.gameSettings?.rapidBonusSeconds || 4}
                        onChange={(e) =>
                          updateGameSettings({
                            rapidBonusSeconds: parseInt(e.target.value),
                          })
                        }
                        className="w-16 px-2 py-1 text-xs border rounded dark:bg-gray-700 dark:border-gray-600"
                      />
                    )}
                  </div>
                </div>

                <div className="p-2 text-xs text-gray-600 dark:text-gray-400 bg-blue-50 rounded dark:bg-blue-900/20">
                  <p><strong>{t("room.timeLimit")}:</strong> {t("room.timeLimitDescription")}</p>
                  <p><strong>{t("room.specialQuestions")}:</strong> {t("room.specialQuestionsDescription")}</p>
                  <p><strong>{t("room.rapidBonus")}:</strong> {t("room.rapidBonusDescription")}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Lista de Jugadores */}
        <div className="p-4 bg-gray-50 rounded-md shadow-inner dark:bg-gray-700">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            {t("room.players")}
          </h3>
          <ul className="mt-2 space-y-2">
            {roomData?.players?.map(
              (player: {
                nickname: string;
                joinedAt: { toDate: () => Date };
              }) => (
                <li
                  key={player.nickname}
                  className="p-2 bg-white rounded-md border-l-4 border-indigo-500 shadow-sm dark:bg-gray-800 dark:border-indigo-400 dark:text-white"
                >
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {player.nickname}
                  </span>{" "}
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({t("room.joined")}: {player.joinedAt.toDate().toLocaleTimeString()})
                  </span>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Botones de acción */}
        {roomData?.creator?.id === user?.uid &&
          roomData?.status === "waiting" && (
            <button
              onClick={handleStartGame}
              className="px-4 py-2 w-full font-semibold text-white bg-green-500 rounded-lg transition hover:bg-green-600 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-400"
            >
              {t("room.startGame")}
            </button>
          )}

        <button
          onClick={handleLeaveRoom}
          className="px-4 py-2 w-full font-semibold text-white bg-red-500 rounded-lg transition hover:bg-red-600 focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-400"
        >
          {t("room.leaveRoom")}
        </button>
      </div>
    </div>
  );
};

export default Room;
