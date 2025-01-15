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
import { Copy } from "lucide-react";

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

const Room = () => {
  const { roomId } = useParams();
  const [roomData, setRoomData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const navigate = useNavigate();

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
        alert("Room ID copied to clipboard!");
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          Room:{" "}
          <span className="text-indigo-600 dark:text-indigo-400">{roomId}</span>
          <button
            onClick={handleCopyRoomId}
            className="ml-2 text-indigo-500 transition hover:text-indigo-700 focus:ring-2 focus:ring-indigo-300 dark:text-indigo-400 dark:hover:text-indigo-600"
            aria-label="Copy Room ID"
          >
            <Copy />
          </button>
        </h2>

        <div className="p-4 rounded-md shadow-inner bg-gray-50 dark:bg-gray-700">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Players
          </h3>
          <ul className="mt-2 space-y-2">
            {roomData?.players?.map(
              (player: {
                nickname: string;
                joinedAt: { toDate: () => Date };
              }) => (
                <li
                  key={player.nickname}
                  className="p-2 bg-white border-l-4 border-indigo-500 rounded-md shadow-sm dark:bg-gray-800 dark:border-indigo-400 dark:text-white"
                >
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {player.nickname}
                  </span>{" "}
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    (Joined: {player.joinedAt.toDate().toLocaleTimeString()})
                  </span>
                </li>
              )
            )}
          </ul>
        </div>

        {roomData?.creator?.id === user?.uid &&
          roomData?.status === "waiting" && (
            <button
              onClick={handleStartGame}
              className="w-full px-4 py-2 font-semibold text-white transition bg-green-500 rounded-lg hover:bg-green-600 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-400"
            >
              Start Game
            </button>
          )}

        <button
          onClick={handleLeaveRoom}
          className="w-full px-4 py-2 font-semibold text-white transition bg-red-500 rounded-lg hover:bg-red-600 focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-400"
        >
          Leave Room
        </button>
      </div>
    </div>
  );
};

export default Room;
