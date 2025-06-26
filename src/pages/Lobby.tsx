import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "@/firebase/firebaseconfig";
import { collection, doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Gamepad2, Trophy, Users, Zap, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/language-provider";

// Definir el tipo de datos para el usuario
interface User {
  nickname: string;
}

// Configuraciones del juego
interface GameSettings {
  timeLimit: boolean;
  timeLimitSeconds: number;
  specialQuestions: boolean;
  rapidBonus: boolean;
  rapidBonusSeconds: number;
}

// Tipos de juego
type GameType = "classic" | "party";

const Lobby = () => {
  const [roomId, setRoomId] = useState<string>("");
  const [selectedGame, setSelectedGame] = useState<GameType>("classic");
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Función para obtener el nickname del usuario desde Firestore
  const getUserNickname = async (userId: string): Promise<string | null> => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
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

  // Función para crear una sala
  const handleCreateRoom = async () => {
    const newRoomId = generateRoomId();
    const creatorId = auth.currentUser?.uid;
  
    if (!creatorId) {
      console.error("No user is authenticated");
      return;
    }
  
    try {
      const nickname = await getUserNickname(creatorId);
  
      if (!nickname) {
        console.error("Nickname not found for user");
        return;
      }
  
      // Configuraciones por defecto del juego
      const defaultGameSettings: GameSettings = {
        timeLimit: false,
        timeLimitSeconds: 10,
        specialQuestions: false,
        rapidBonus: false,
        rapidBonusSeconds: 4,
      };
  
      await setDoc(doc(collection(db, "rooms"), newRoomId), {
        roomId: newRoomId,
        gameType: selectedGame, // Nuevo campo para el tipo de juego
        maxPlayers: 8, // Agregar límite de 8 jugadores para clases
        creator: {
          id: creatorId,
          nickname: nickname,
        },
        players: [
          {
            id: creatorId,
            nickname: nickname,
            joinedAt: Timestamp.now(),
          },
        ],
        status: "waiting",
        createdAt: Timestamp.now(),
        gameSettings: defaultGameSettings,
      });
  
      console.log(`${selectedGame} room created with ID: `, newRoomId);
      navigate(`/room/${newRoomId}`);
    } catch (error) {
      console.error("Error creating room: ", error);
    }
  };

  // Función para unirse a una sala
  const handleJoinRoom = () => {
    if (roomId) {
      navigate(`/room/${roomId}`);
    } else {
      alert(t("lobby.enterValidRoomId"));
    }
  };

  // Función para buscar salas disponibles
  const handleSearchRooms = () => {
    navigate("/search-rooms");
  };

  // Función para generar un ID aleatorio de sala (4 dígitos alfanuméricos)
const generateRoomId = (): string => {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
};

  // Función para regresar al home
  const handleBackToHome = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen pt-20 px-4 py-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl p-6 md:p-8 space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 dark:bg-gray-800/80 dark:border-gray-700/50">
          {/* Botón de regresar */}
          <div className="flex justify-start">
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t("lobby.backToHome") || "Regresar"}</span>
            </button>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400 leading-tight py-2">
              {t("lobby.title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              {t("lobby.subtitle")}
            </p>
          </div>

          <Tabs value={selectedGame} onValueChange={(value) => setSelectedGame(value as GameType)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 h-12 bg-gray-100 dark:bg-gray-700 p-1">
              <TabsTrigger 
                value="classic" 
                className="flex items-center justify-center gap-2 text-sm md:text-base h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-800 data-[state=active]:flex data-[state=active]:items-center data-[state=active]:justify-center"
              >
                <Zap className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline leading-none">{t("lobby.raceTab")}</span>
                <span className="sm:hidden leading-none">{t("lobby.raceTabShort")}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="party" 
                className="flex items-center justify-center gap-2 text-sm md:text-base h-10 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-800 data-[state=active]:flex data-[state=active]:items-center data-[state=active]:justify-center"
              >
                <Trophy className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline leading-none">{t("lobby.partyTab")}</span>
                <span className="sm:hidden leading-none">{t("lobby.partyTabShort")}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="classic" className="space-y-6 mt-0">
              <div className="text-center space-y-3 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex justify-center">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {t("lobby.raceMode.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {t("lobby.raceMode.description")}
                </p>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={handleCreateRoom}
                  className="w-full px-6 py-4 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl hover:from-indigo-700 hover:to-blue-700 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-400 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Gamepad2 className="w-5 h-5" />
                    {t("lobby.createRaceRoom")}
                  </div>
                </button>
              </div>
            </TabsContent>

            <TabsContent value="party" className="space-y-6 mt-0">
              <div className="text-center space-y-3 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl border border-purple-200 dark:border-purple-800">
                <div className="flex justify-center">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                    <Trophy className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {t("lobby.partyMode.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {t("lobby.partyMode.description")}
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  <span className="px-3 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full">
                    {t("lobby.partyMode.tag1")}
                  </span>
                  <span className="px-3 py-1 text-xs bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 rounded-full">
                    {t("lobby.partyMode.tag2")}
                  </span>
                  <span className="px-3 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-full">
                    {t("lobby.partyMode.tag3")}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={handleCreateRoom}
                  className="w-full px-6 py-4 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-400 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Trophy className="w-5 h-5" />
                    {t("lobby.createPartyRoom")}
                  </div>
                </button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Sección para unirse a una sala */}
          <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                {t("lobby.hasRoomCode")}
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  placeholder={t("lobby.enterRoomCode")}
                  className="w-full px-4 py-3 text-center text-lg font-mono tracking-wider transition-all duration-200 border-2 border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none focus:border-indigo-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                  maxLength={8}
                />
              </div>
              
              <button
                onClick={handleJoinRoom}
                className="w-full px-6 py-3 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:from-green-700 hover:to-emerald-700 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-400 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-center gap-2">
                  <Users className="w-5 h-5" />
                  {t("lobby.joinRoom")}
                </div>
              </button>
            </div>
          </div>

          {/* Botón para buscar salas */}
          <div className="pt-4">
            <button
              onClick={handleSearchRooms}
              className="w-full px-6 py-3 font-semibold text-gray-700 dark:text-gray-200 transition-all duration-200 bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-500 shadow-md hover:shadow-lg"
            >
              <div className="flex items-center justify-center gap-2">
                <Users className="w-5 h-5" />
                {t("lobby.explorePublicRooms")}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
