import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseconfig";
import {
  ArrowLeft,
  Users,
  Search as SearchIcon,
  Gamepad2,
  RefreshCw,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-provider";

// Definir los tipos para las salas
interface Room {
  id: string;
  players: { id: string; nickname: string }[]; // Asumiendo que cada jugador tiene un id y un nickname
  maxPlayers: number;
  status: string;
  gameType?: string;
  createdAt?: any;
}

const Search = () => {
  // Tipar el estado
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Mover fetchRooms fuera del useEffect
  const fetchRooms = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

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
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setError("There was an error fetching rooms.");
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleJoinRoom = (roomId: string) => {
    // Redirigir a la sala seleccionada
    navigate(`/room/${roomId}`);
  };

  const handleBackToLobby = () => {
    navigate("/lobby");
  };

  const handleRefresh = () => {
    fetchRooms(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center px-4 min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="p-8 space-y-6 w-full max-w-md bg-white rounded-2xl shadow-xl dark:bg-slate-800">
          <div className="text-center">
            <div className="inline-block w-12 h-12 rounded-full border-4 border-indigo-500 animate-spin border-t-transparent"></div>
            <p className="mt-4 text-lg font-medium text-slate-600 dark:text-slate-300">
              {t("search.loadingRooms") || "Cargando salas..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center px-4 mt-20 min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="p-8 space-y-6 w-full max-w-md bg-white rounded-2xl shadow-xl dark:bg-slate-800">
          <div className="text-center">
            <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full dark:bg-red-900/20">
              <SearchIcon className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
              {t("search.error") || "Error"}
            </h3>
            <p className="mb-6 text-slate-600 dark:text-slate-400">{error}</p>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                className="flex justify-center items-center px-4 py-3 text-indigo-600 bg-indigo-50 rounded-xl shadow-lg transition-all duration-300 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/40"
              >
                <RefreshCw className="mr-2 w-5 h-5" />
                {t("search.refresh")}
              </button>
              <button
                onClick={handleBackToLobby}
                className="flex flex-1 justify-center items-center px-4 py-3 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg transition-all duration-300 transform hover:from-indigo-700 hover:to-purple-700 hover:scale-105 dark:from-indigo-500 dark:to-purple-500"
              >
                <ArrowLeft className="mr-2 w-5 h-5" />
                {t("search.backToLobby") || "Volver al Lobby"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 mt-20 min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handleBackToLobby}
              className="flex items-center px-4 py-2 bg-white rounded-xl shadow-md transition-all duration-300 text-slate-600 hover:bg-slate-50 hover:shadow-lg dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <ArrowLeft className="mr-2 w-5 h-5" />
              {t("search.backToLobby") || "Volver"}
            </button>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-4 py-2 text-indigo-600 bg-indigo-50 rounded-xl shadow-md transition-all duration-300 hover:bg-indigo-100 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/40"
            >
              <RefreshCw
                className={`mr-2 w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? t("search.refreshing") : t("search.refresh")}
            </button>
          </div>

          <div className="mb-4">
            <div className="inline-flex justify-center items-center mb-4 w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-lg">
              <SearchIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 md:text-4xl dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
              {t("search.title") || "Salas Disponibles"}
            </h1>
            <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
              {t("search.subtitle") || "Únete a una partida en curso"}
            </p>
          </div>
        </div>

        {/* Rooms List */}
        {rooms.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="p-6 bg-white rounded-2xl border shadow-xl transition-all duration-300 border-slate-200 hover:shadow-2xl hover:scale-105 dark:bg-slate-800 dark:border-slate-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex justify-center items-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
                      <Gamepad2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                        {t("search.room") || "Sala"} #
                        {room.id.slice(-6).toUpperCase()}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {room.gameType || "Speed Race"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {t("search.players") || "Jugadores"}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {room.players.length}/{room.maxPlayers}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          (room.players.length / room.maxPlayers) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Players list */}
                {room.players.length > 0 && (
                  <div className="mb-4">
                    <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                      {t("search.currentPlayers") || "Jugadores actuales:"}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {room.players.slice(0, 3).map((player, index) => (
                        <span
                          key={player.id}
                          className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                        >
                          {player.nickname}
                        </span>
                      ))}
                      {room.players.length > 3 && (
                        <span className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                          +{room.players.length - 3} más
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleJoinRoom(room.id)}
                  disabled={room.players.length >= room.maxPlayers}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform ${
                    room.players.length >= room.maxPlayers
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-slate-600 dark:text-slate-400"
                      : "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg hover:from-green-600 hover:to-blue-600 hover:scale-105 hover:shadow-xl"
                  }`}
                >
                  {room.players.length >= room.maxPlayers
                    ? t("search.roomFull") || "Sala Llena"
                    : t("search.joinRoom") || "Unirse a la Sala"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="inline-flex justify-center items-center mb-6 w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800">
              <SearchIcon className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-slate-800 dark:text-slate-100">
              {t("search.noRooms") || "No hay salas disponibles"}
            </h3>
            <p className="mb-8 text-slate-600 dark:text-slate-400">
              {t("search.noRoomsDescription") ||
                "No hay salas esperando jugadores en este momento."}
            </p>
            <button
              onClick={handleBackToLobby}
              className="inline-flex items-center px-6 py-3 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg transition-all duration-300 transform hover:from-indigo-700 hover:to-purple-700 hover:scale-105 dark:from-indigo-500 dark:to-purple-500"
            >
              <ArrowLeft className="mr-2 w-5 h-5" />
              {t("search.backToLobby") || "Volver al Lobby"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
