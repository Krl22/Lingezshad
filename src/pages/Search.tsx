import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseconfig";

// Definir los tipos para las salas
interface Room {
  id: string;
  players: { id: string; nickname: string }[]; // Asumiendo que cada jugador tiene un id y un nickname
  maxPlayers: number;
  status: string;
}

const Search = () => {
  // Tipar el estado
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // Consulta a Firestore para obtener las salas que están "waiting"
        const q = query(
          collection(db, "rooms"),
          where("status", "==", "waiting")
        );
        const querySnapshot = await getDocs(q);

        const availableRooms: Room[] = [];
        querySnapshot.forEach((doc) => {
          availableRooms.push({ id: doc.id, ...doc.data() } as Room);
        });

        setRooms(availableRooms);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setError("There was an error fetching rooms.");
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleJoinRoom = (roomId: string) => {
    // Redirigir a la sala seleccionada
    navigate(`/room/${roomId}`);
  };

  if (loading) {
    return <div>Loading rooms...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
        Available Rooms
      </h1>
      {rooms.length > 0 ? (
        <ul className="w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-800 dark:border dark:border-gray-700">
          {rooms.map((room) => (
            <li
              key={room.id}
              className="p-4 border-b border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    Room ID: {room.id}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Players: {room.players.length}/{room.maxPlayers}
                  </p>
                </div>
                <button
                  onClick={() => handleJoinRoom(room.id)}
                  className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-500"
                >
                  Join Room
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-600 dark:text-gray-400">
          No rooms available at the moment.
        </div>
      )}
    </div>
  );
};

export default Search;
