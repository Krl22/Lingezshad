import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "@/firebase/firebaseconfig";
import { doc, updateDoc, onSnapshot, runTransaction } from "firebase/firestore";
import { questions } from "./utils/questions";

const MAX_QUESTIONS = 10;
const TRACK_LENGTH = 90; // Longitud de la pista adaptada para que funcione mejor en pantallas pequeñas

// Asignación de colores a cada jugador
const ballColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
];

interface Player {
  id: string;
  nickname: string;
  progress: number;
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

  useEffect(() => {
    if (!roomId) {
      console.log("Missing data, skipping handleAnswerSubmit");
      return;
    }
    const roomRef = doc(db, "rooms", roomId);

    const unsubscribe = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as RoomData;
        setRoomData(data);

        // Verificar el estado del dashboard
        const winningPlayer = data.players.find(
          (player) => player.progress >= MAX_QUESTIONS
        );
        if (winningPlayer) {
          setWinner(winningPlayer.nickname);
          setDashboardVisible(true);
        } else {
          setDashboardVisible(data.dashboardVisible || false);
        }

        data.players.forEach((player) => {
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

          // Buscar al jugador actual
          const updatedPlayers = roomData.players.map((player) => {
            if (player.id === user.uid) {
              // Si el progreso no existe o no es un número, inicializarlo en 0
              const currentProgress = isNaN(player.progress)
                ? 0
                : player.progress;

              // Incrementar el progreso en 1 si la respuesta es correcta
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
    return <div>Loading...</div>;
  }

  if (dashboardVisible) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Game Over!</h1>
        <h2 className="mt-4">Winner: {winner}</h2>

        <div className="p-4 mt-4 bg-white rounded shadow">
          <h3 className="text-lg font-semibold">Final Scores:</h3>
          <ul>
            {roomData?.players?.map((player) => (
              <li key={player.id} className="mt-2">
                {player.nickname}: {player.progress} points
              </li>
            ))}
          </ul>
        </div>

        <button onClick={handleReturnToRoom} className="mt-4 btn btn-primary">
          Return to Room
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 text-gray-800 bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400 dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-900 dark:to-gray-950">
      <h1 className="mt-8 text-4xl font-extrabold text-center dark:text-gray-100">
        Race to the Finish Line!
      </h1>
      <h2 className="mt-2 text-lg font-medium text-gray-800 dark:text-gray-200">
        Room: {roomId}
      </h2>

      <div className="w-full max-w-md p-6 mt-8 bg-white rounded-lg shadow-2xl dark:bg-gray-800 dark:shadow-2xl">
        <h3 className="mb-4 text-2xl font-semibold text-center text-gray-800 dark:text-gray-100">
          Players' Progress
        </h3>

        <div className="relative w-full overflow-hidden bg-gray-300 rounded-lg shadow-lg h-28 dark:bg-gray-600 dark:border-gray-700">
          {roomData?.players?.map((player, index) => (
            <div
              key={player.id}
              className={`absolute rounded-full h-10 w-10 flex items-center justify-center ${
                ballColors[index % ballColors.length]
              }`}
              style={{
                left: `${(player.progress / MAX_QUESTIONS) * TRACK_LENGTH}%`,
                top: `${index * 50}px`, // Aumento la separación vertical entre las pelotas
                transition: "left 0.5s ease",
              }}
            >
              <span className="text-xs font-semibold text-black dark:text-white">
                {player.nickname}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-md p-6 mt-8 bg-white rounded-lg shadow-2xl dark:bg-gray-800 dark:shadow-2xl">
        <h3 className="mb-4 text-2xl font-semibold text-center text-gray-800 dark:text-gray-200">
          Question: {questions[currentQuestionIndex].question}
        </h3>

        {questions[currentQuestionIndex].options.map((option, idx) => (
          <label
            key={idx}
            className="block mt-4 text-lg text-gray-800 dark:text-gray-300"
          >
            <input
              type="radio"
              name="option"
              value={option}
              checked={selectedOption === option}
              onChange={() => setSelectedOption(option)}
              className="mr-4 accent-blue-500"
            />
            {option}
          </label>
        ))}

        <button
          onClick={handleAnswerSubmit}
          disabled={!selectedOption}
          className="w-full py-3 mt-6 font-semibold text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:bg-gradient-to-l disabled:opacity-50 dark:from-blue-500 dark:to-indigo-500 dark:hover:bg-gradient-to-r dark:disabled:opacity-40"
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
};

export default Game;
