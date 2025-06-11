import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "@/firebase/firebaseconfig";
import {
  doc,
  updateDoc,
  onSnapshot,
  runTransaction,
  getDoc,
} from "firebase/firestore";
import { questions } from "./utils/questions";
import { generateAvatarUrl, getDefaultAvatar } from "@/firebase/avatarService";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Clock, Zap, Target } from "lucide-react";

const MAX_QUESTIONS = 10;
// const TRACK_LENGTH = 90;

// Colores de respaldo para las pelotas
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
  avatarUrl?: string;
}

interface GameSettings {
  timeLimit: boolean;
  timeLimitSeconds: number;
  specialQuestions: boolean;
  rapidBonus: boolean;
  rapidBonusSeconds: number;
}

interface RoomData {
  players: Player[];
  status: string;
  dashboardVisible?: boolean;
  gameSettings?: GameSettings;
}

const Game = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState("");
  const [winner, setWinner] = useState<string | null>(null);
  const [dashboardVisible, setDashboardVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(
    null
  );
  const [isSpecialQuestion, setIsSpecialQuestion] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Obtener el usuario actual
  const user = auth.currentUser;

  // Determinar si la pregunta actual es especial
  const checkIfSpecialQuestion = () => {
    if (!roomData?.gameSettings?.specialQuestions) return false;
    // 20% de probabilidad de pregunta especial
    return Math.random() < 0.2;
  };

  // Función para obtener el avatar de un jugador
  const getPlayerAvatar = async (playerId: string): Promise<string> => {
    try {
      const userRef = doc(db, "users", playerId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        return (
          userData.photoURL ||
          (userData.avatarSeed
            ? generateAvatarUrl(
                userData.avatarSeed,
                userData.avatarStyle || "avataaars"
              )
            : getDefaultAvatar(playerId))
        );
      }
      return getDefaultAvatar(playerId);
    } catch (error) {
      console.error("Error getting player avatar:", error);
      return getDefaultAvatar(playerId);
    }
  };

  // Iniciar temporizador para la pregunta
  const startQuestionTimer = () => {
    if (!roomData?.gameSettings?.timeLimit) return;

    const timeLimit = roomData.gameSettings.timeLimitSeconds;
    setTimeLeft(timeLimit);
    setQuestionStartTime(Date.now());

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Limpiar temporizador
  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimeLeft(null);
  };

  // Manejar cuando se acaba el tiempo
  const handleTimeUp = () => {
    clearTimer();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption("");
      setIsSpecialQuestion(checkIfSpecialQuestion());
      startQuestionTimer();
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
          clearTimer();
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

    return () => {
      unsubscribe();
      clearTimer();
    };
  }, [roomId]);

  // Inicializar pregunta especial y temporizador cuando cambia la pregunta
  useEffect(() => {
    if (roomData && !loading) {
      setIsSpecialQuestion(checkIfSpecialQuestion());
      startQuestionTimer();
    }

    return () => clearTimer();
  }, [currentQuestionIndex, roomData?.gameSettings]);

  const handleAnswerSubmit = async () => {
    const isCorrect = checkAnswer(selectedOption);
    const responseTime = questionStartTime ? Date.now() - questionStartTime : 0;
    const isRapidResponse =
      roomData?.gameSettings?.rapidBonus &&
      responseTime <= roomData.gameSettings.rapidBonusSeconds * 1000;

    clearTimer();
    setSelectedOption("");

    if (roomData && roomData.players) {
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
            const currentProgress = isNaN(player.progress)
              ? 0
              : player.progress;

            if (player.id === user.uid && isCorrect) {
              // Jugador actual respondió correctamente
              let progressIncrease = 1;

              // Bonificación por respuesta rápida
              if (isRapidResponse) {
                progressIncrease = 2;
              }

              return {
                ...player,
                progress: currentProgress + progressIncrease,
              };
            } else if (
              player.id !== user.uid &&
              isCorrect &&
              isSpecialQuestion
            ) {
              // Pregunta especial: otros jugadores retroceden
              return { ...player, progress: Math.max(0, currentProgress - 1) };
            }

            return player;
          });

          transaction.update(roomRef, { players: updatedPlayers });
        });

        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setIsSpecialQuestion(checkIfSpecialQuestion());
          startQuestionTimer();
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
                      <AvatarFallback
                        className={ballColors[index % ballColors.length]}
                      >
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
        {/* Header con indicadores de modo de juego */}
        <div className="mb-4 text-center">
          <h1 className="mb-2 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 md:text-3xl dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
            🏁 ¡Carrera al Final!
          </h1>
          <div className="flex justify-center items-center mb-2 space-x-2">
            <div className="inline-flex items-center px-3 py-1 bg-white rounded-full border shadow-lg dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <span className="mr-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                Sala:
              </span>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                {roomId}
              </span>
            </div>
          </div>

          {/* Indicadores de modos activos */}
          <div className="flex justify-center space-x-2">
            {roomData?.gameSettings?.timeLimit && (
              <div className="flex items-center px-2 py-1 bg-blue-100 rounded-full dark:bg-blue-900">
                <Clock className="mr-1 w-3 h-3 text-blue-600 dark:text-blue-400" />
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  Tiempo Límite
                </span>
              </div>
            )}
            {roomData?.gameSettings?.specialQuestions && (
              <div className="flex items-center px-2 py-1 bg-red-100 rounded-full dark:bg-red-900">
                <Target className="mr-1 w-3 h-3 text-red-600 dark:text-red-400" />
                <span className="text-xs text-red-600 dark:text-red-400">
                  Preguntas Especiales
                </span>
              </div>
            )}
            {roomData?.gameSettings?.rapidBonus && (
              <div className="flex items-center px-2 py-1 bg-yellow-100 rounded-full dark:bg-yellow-900">
                <Zap className="mr-1 w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                <span className="text-xs text-yellow-600 dark:text-yellow-400">
                  Bonificación Rápida
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Track */}
        <div className="p-3 mb-4 bg-white rounded-2xl border shadow-xl dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Progreso
            </h3>
            <div className="flex items-center space-x-2">
              {timeLeft !== null && (
                <div
                  className={`flex items-center px-2 py-1 rounded-full ${
                    timeLeft <= 3
                      ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                      : timeLeft <= 5
                      ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400"
                      : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                  }`}
                >
                  <Clock className="mr-1 w-3 h-3" />
                  <span className="text-xs font-bold">{timeLeft}s</span>
                </div>
              )}
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Pregunta {currentQuestionIndex + 1}/{questions.length}
              </span>
            </div>
          </div>

          {/* Pista de carrera */}
          <div className="relative p-4 bg-gradient-to-r from-green-100 via-yellow-50 to-red-100 rounded-xl border-2 border-dashed dark:from-green-900/20 dark:via-yellow-900/20 dark:to-red-900/20 border-slate-300 dark:border-slate-600">
            {/* Línea de meta */}
            <div className="absolute top-0 bottom-0 right-2 w-1 bg-gradient-to-b from-red-500 to-red-600 rounded-full opacity-80"></div>
            <div className="absolute right-0 top-1/2 text-xs font-bold text-red-600 transform -translate-y-1/2 dark:text-red-400">
              🏁
            </div>

            {/* Marcadores de progreso */}
            <div className="relative h-16">
              {Array.from({ length: MAX_QUESTIONS + 1 }, (_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 w-px opacity-50 bg-slate-300 dark:bg-slate-600"
                  style={{ left: `${(i / MAX_QUESTIONS) * 100}%` }}
                >
                  <div className="absolute -bottom-6 left-1/2 text-xs transform -translate-x-1/2 text-slate-500 dark:text-slate-400">
                    {i}
                  </div>
                </div>
              ))}

              {/* Pelotas de jugadores con avatares */}
              {roomData?.players?.map((player, index) => {
                const progressPercentage =
                  (player.progress / MAX_QUESTIONS) * 100;
                const isCurrentUser = player.id === user?.uid;

                return (
                  <div
                    key={player.id}
                    className={`absolute transition-all duration-1000 ease-out transform ${
                      isCurrentUser ? "z-10 scale-110" : "z-0"
                    }`}
                    style={{
                      left: `${Math.min(progressPercentage, 95)}%`,
                      top: `${index * 12 + 4}px`,
                      transform: `translateX(-50%) ${
                        isCurrentUser ? "scale(1.1)" : ""
                      }`,
                    }}
                  >
                    {/* Pelota con avatar */}
                    <div
                      className={`relative group ${
                        isCurrentUser ? "animate-bounce" : ""}`}
                    >
                      {/* Sombra de la pelota */}
                      <div className="absolute -bottom-1 left-1/2 w-8 h-2 rounded-full blur-sm transform -translate-x-1/2 bg-black/20"></div>

                      {/* Pelota principal */}
                      <div
                        className={`relative w-10 h-10 rounded-full border-3 shadow-lg transition-all duration-300 ${
                          isCurrentUser
                            ? "border-yellow-400 ring-2 ring-yellow-300 shadow-yellow-400/50"
                            : "border-white/80 shadow-slate-400/30"
                        }`}
                      >
                        <Avatar className="w-full h-full">
                          <AvatarImage
                            src={player.avatarUrl}
                            className="object-cover"
                          />
                          <AvatarFallback
                            className={`${
                              ballColors[index % ballColors.length]
                            } text-white font-bold text-sm`}
                          >
                            {player.nickname.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        {/* Efecto de brillo para el jugador actual */}
                        {isCurrentUser && (
                          <div className="absolute inset-0 bg-gradient-to-tr to-transparent rounded-full animate-pulse from-yellow-400/30"></div>
                        )}
                      </div>

                      {/* Tooltip con información del jugador */}
                      <div className="absolute -top-12 left-1/2 opacity-0 transition-opacity duration-200 transform -translate-x-1/2 pointer-events-none group-hover:opacity-100">
                        <div className="px-2 py-1 text-xs text-white whitespace-nowrap rounded-lg shadow-lg bg-slate-800">
                          <div className="font-semibold">{player.nickname}</div>
                          <div className="text-slate-300">
                            {player.progress}/{MAX_QUESTIONS}
                          </div>
                        </div>
                        <div className="absolute top-full left-1/2 w-0 h-0 border-t-4 border-r-2 border-l-2 border-transparent transform -translate-x-1/2 border-t-slate-800"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Estadísticas horizontales compactas */}
          <div className="flex justify-between items-center mt-3 space-x-2">
            {roomData?.players?.map((player, index) => {
              const isCurrentUser = player.id === user?.uid;
              return (
                <div
                  key={player.id}
                  className={`flex items-center space-x-2 px-2 py-1 rounded-lg transition-all duration-300 ${
                    isCurrentUser
                      ? "bg-yellow-100 ring-1 ring-yellow-300 dark:bg-yellow-900/30 dark:ring-yellow-600"
                      : "bg-slate-100 dark:bg-slate-700"
                  }`}
                >
                  <Avatar className="w-6 h-6 border border-white/50">
                    <AvatarImage src={player.avatarUrl} />
                    <AvatarFallback
                      className={`${
                        ballColors[index % ballColors.length]
                      } text-white text-xs`}
                    >
                      {player.nickname.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-xs">
                    <div
                      className={`font-semibold truncate max-w-16 ${
                        isCurrentUser
                          ? "text-yellow-800 dark:text-yellow-200"
                          : "text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      {player.nickname}
                    </div>
                    <div
                      className={`text-xs ${
                        isCurrentUser
                          ? "text-yellow-600 dark:text-yellow-300"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {player.progress}/{MAX_QUESTIONS}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question Card con indicadores especiales */}
        <div className="p-4 bg-white rounded-2xl border shadow-xl dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          {/* Indicador de pregunta especial */}
          {isSpecialQuestion && (
            <div className="p-3 mb-4 bg-red-50 rounded-lg border border-red-200 dark:bg-red-900/20 dark:border-red-800">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="text-sm font-bold text-red-600 dark:text-red-400">
                  ¡Pregunta Especial!
                </span>
              </div>
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                Si respondes correctamente, los demás jugadores retrocederán un
                paso.
              </p>
            </div>
          )}

          {/* Indicador de bonificación rápida */}
          {roomData?.gameSettings?.rapidBonus && questionStartTime && (
            <div className="p-3 mb-4 bg-yellow-50 rounded-lg border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                  Bonificación Rápida Activa
                </span>
              </div>
              <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
                Responde en los primeros{" "}
                {roomData.gameSettings.rapidBonusSeconds} segundos para obtener
                2 pasos.
              </p>
            </div>
          )}

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
