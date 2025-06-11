import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "@/firebase/firebaseconfig";
import { doc, updateDoc, onSnapshot, runTransaction, getDoc } from "firebase/firestore";
import { questions } from "./utils/questions";
import { generateAvatarUrl, getDefaultAvatar } from "@/firebase/avatarService";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const MAX_QUESTIONS = 10;
const TRACK_LENGTH = 90;

// Colores de respaldo para las pelotas (en caso de que no cargue el avatar)
const ballColors = [
  "bg-gradient-to-br from-red-400 to-red-600 shadow-lg",
  "bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg",
  "bg-gradient-to-br from-green-400 to-green-600 shadow-lg",
  "bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg",
];

interface Player {
  id: string;
  nickname: string;
  progress: number;
  avatarUrl?: string; // Nuevo campo para el avatar
}

interface RoomData {
  players: Player[];
  status: string;
  dashboardVisible?: boolean;
}

const Game = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState("");
  const [winner, setWinner] = useState<string | null>(null);
  const [dashboardVisible, setDashboardVisible] = useState(false);
  const navigate = useNavigate();

  // Función para obtener el avatar de un jugador
  const getPlayerAvatar = async (playerId: string): Promise<string> => {
    try {
      const userRef = doc(db, "users", playerId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.photoURL || 
               (userData.avatarSeed ? 
                generateAvatarUrl(userData.avatarSeed, userData.avatarStyle || 'avataaars') : 
                getDefaultAvatar(playerId));
      }
      return getDefaultAvatar(playerId);
    } catch (error) {
      console.error("Error getting player avatar:", error);
      return getDefaultAvatar(playerId);
    }
  };

  useEffect(() => {
    if (!roomId) {
      console.log("Missing data, skipping handleAnswerSubmit");
      return;
    }
    const roomRef = doc(db, "rooms", roomId);

    const unsubscribe = onSnapshot(roomRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as RoomData;
        
        // Obtener avatares para todos los jugadores
        const playersWithAvatars = await Promise.all(
          data.players.map(async (player) => {
            const avatarUrl = await getPlayerAvatar(player.id);
            return { ...player, avatarUrl };
          })
        );
        
        const updatedData = { ...data, players: playersWithAvatars };
        setRoomData(updatedData);

        const winningPlayer = updatedData.players.find(
          (player) => player.progress >= MAX_QUESTIONS
        );
        if (winningPlayer) {
          setWinner(winningPlayer.nickname);
          setDashboardVisible(true);
        } else {
          setDashboardVisible(updatedData.dashboardVisible || false);
        }

        updatedData.players.forEach((player) => {
          if (isNaN(player.progress)) {
            player.progress = 0;
          }
        });

        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  const handleAnswerSubmit = async () => {
    const isCorrect = checkAnswer(selectedOption);
    setSelectedOption("");

    if (isCorrect && roomData && roomData.players) {
      const user = auth.currentUser;
      if (!user || !roomId) {
        console.log("Missing data, skipping handleAnswerSubmit");
        return;
      }

      const roomRef = doc(db, "rooms", roomId);

      try {
        await runTransaction(db, async (transaction) => {
          const roomSnap = await transaction.get(roomRef);

          if (!roomSnap.exists()) {
            throw new Error("Room does not exist!");
          }

          const roomData = roomSnap.data() as RoomData;

          const updatedPlayers = roomData.players.map((player) => {
            if (player.id === user.uid) {
              const currentProgress = isNaN(player.progress)
                ? 0
                : player.progress;

              return { ...player, progress: currentProgress + 1 };
            }
            return player;
          });

          transaction.update(roomRef, { players: updatedPlayers });
        });

        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
      } catch (error) {
        console.error("Error updating player progress in transaction: ", error);
      }
    }
  };

  const checkAnswer = (selectedOption: string) => {
    const correctAnswer = questions[currentQuestionIndex].answer;
    return selectedOption === correctAnswer;
  };

  const updateRoomStatus = async (roomId: string, status: string) => {
    const roomRef = doc(db, "rooms", roomId);
    try {
      await updateDoc(roomRef, {
        status: status,
      });
      console.log("Room status updated successfully");
    } catch (error) {
      console.error("Error updating room status: ", error);
    }
  };

  const handleReturnToRoom = async () => {
    const user = auth.currentUser;
    if (!user || !roomData || !roomId) return;

    try {
      await updateRoomStatus(roomId, "waiting");

      const updatedPlayers = roomData.players.map((player) => ({
        ...player,
        progress: 0,
      }));

      try {
        await updateDoc(doc(db, "rooms", roomId), {
          players: updatedPlayers,
        });

        setCurrentQuestionIndex(0);
        setWinner(null);
        setDashboardVisible(false);
        navigate(`/room/${roomId}`);
        setSelectedOption("");
      } catch (error) {
        console.error("Error updating player progress: ", error);
      }
    } catch (error) {
      console.error("Error returning to room:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-blue-500 animate-spin border-t-transparent"></div>
          <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
            Loading game...
          </p>
        </div>
      </div>
    );
  }

  if (dashboardVisible) {
    return (
      <div className="flex flex-col justify-center items-center px-4 min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="p-8 w-full max-w-md bg-white rounded-3xl border shadow-2xl dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <div className="mb-6 text-center">
            <div className="flex justify-center items-center mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full">
              <span className="text-3xl">🏆</span>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400">
              Game Over!
            </h1>
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">
              Ganador:{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                {winner}
              </span>
            </h2>
          </div>

          <div className="p-6 mb-6 rounded-2xl bg-slate-50 dark:bg-slate-700">
            <h3 className="mb-4 text-lg font-semibold text-center text-slate-800 dark:text-slate-200">
              Puntuaciones Finales
            </h3>
            <div className="space-y-3">
              {roomData?.players?.map((player, index) => (
                <div
                  key={player.id}
                  className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm dark:bg-slate-600"
                >
                  <div className="flex items-center space-x-3">
                    {/* Avatar del jugador en lugar de pelota de color */}
                    <Avatar className="w-8 h-8 border-2 border-white/20">
                      <AvatarImage src={player.avatarUrl} />
                      <AvatarFallback className={ballColors[index % ballColors.length]}>
                        {player.nickname.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {player.nickname}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    {player.progress}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleReturnToRoom}
            className="py-4 w-full font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg transition-all duration-300 transform hover:from-blue-700 hover:to-purple-700 hover:scale-105 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600"
          >
            Volver a la Sala
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 py-4 mt-16 min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="mx-auto max-w-4xl">
        {/* Header Compacto */}
        <div className="mb-4 text-center">
          <h1 className="mb-2 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 md:text-3xl dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
            🏁 ¡Carrera al Final!
          </h1>
          <div className="inline-flex items-center px-3 py-1 bg-white rounded-full border shadow-lg dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <span className="mr-2 text-xs font-medium text-slate-600 dark:text-slate-300">
              Sala:
            </span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
              {roomId}
            </span>
          </div>
        </div>

        {/* Progress Track Compacto */}
        <div className="p-3 mb-4 bg-white rounded-2xl border shadow-xl dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Progreso
            </h3>
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Pregunta {currentQuestionIndex + 1}/{questions.length}
            </span>
          </div>

          <div className="overflow-hidden relative w-full h-20 bg-gradient-to-r rounded-xl border shadow-inner from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 border-slate-300 dark:border-slate-600">
            {/* Finish Line */}
            <div className="absolute top-0 bottom-0 right-1 w-0.5 bg-gradient-to-b from-yellow-400 to-red-500 rounded-full"></div>
            <div className="absolute right-0 top-1/2 text-lg transform -translate-y-1/2">
              🏁
            </div>

            {/* Avatares de los jugadores en lugar de pelotas */}
            {roomData?.players?.map((player, index) => (
              <div
                key={player.id}
                className="absolute transform transition-all duration-700 ease-out"
                style={{
                  left: `${Math.min(
                    (player.progress / MAX_QUESTIONS) * TRACK_LENGTH,
                    TRACK_LENGTH
                  )}%`,
                  top: `${index * 20 + 4}px`,
                }}
              >
                <Avatar className="w-8 h-8 border-2 border-white shadow-lg">
                  <AvatarImage src={player.avatarUrl} />
                  <AvatarFallback className={ballColors[index % ballColors.length]}>
                    {player.nickname.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
            ))}
          </div>

          {/* Progress Stats Horizontal */}
          <div className="flex justify-between mt-3 space-x-2">
            {roomData?.players?.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center space-x-1 p-2 text-center rounded-lg bg-slate-50 dark:bg-slate-700 flex-1"
              >
                {/* Avatar en las estadísticas también */}
                <Avatar className="w-4 h-4">
                  <AvatarImage src={player.avatarUrl} />
                  <AvatarFallback className={ballColors[index % ballColors.length]}>
                    {player.nickname.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate text-slate-700 dark:text-slate-200">
                    {player.nickname.length > 8
                      ? player.nickname.substring(0, 8) + "..."
                      : player.nickname}
                  </p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {player.progress}/{MAX_QUESTIONS}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Question Card Compacto - permanece igual */}
        <div className="p-4 bg-white rounded-2xl border shadow-xl dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <div className="mb-4 text-center">
            <h3 className="text-lg font-bold leading-relaxed md:text-xl text-slate-800 dark:text-slate-100">
              {questions[currentQuestionIndex].question}
            </h3>
          </div>

          <div className="mb-4 space-y-2">
            {questions[currentQuestionIndex].options.map((option, idx) => (
              <label
                key={idx}
                className={`block p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                  selectedOption === option
                    ? "border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-900/30 shadow-md"
                    : "border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="option"
                    value={option}
                    checked={selectedOption === option}
                    onChange={() => setSelectedOption(option)}
                    className="w-4 h-4 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {option}
                  </span>
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={handleAnswerSubmit}
            disabled={!selectedOption}
            className="py-3 w-full text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg transition-all duration-300 transform hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 dark:disabled:from-slate-600 dark:disabled:to-slate-700"
          >
            {selectedOption ? "Enviar Respuesta" : "Selecciona una opción"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Game;
