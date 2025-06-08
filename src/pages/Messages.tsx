import { useState, useEffect } from "react";
import { Loader } from "@/components/uiverse/Loader"; // Asegúrate de que el loader esté disponible en la ruta correcta
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useMediaQuery } from "react-responsive";
import AIChat from "./chat";
import { ArrowLeft, EllipsisVertical, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { fetchFriends, Friend } from "@/firebase/friendsService";
import { getAuth } from "firebase/auth";
import { getOrCreateChat } from "@/firebase/messages";
import { useNavigate } from "react-router-dom";

export function Messages() {
  const navigate = useNavigate();
  const [patternNumber, setPatternNumber] = useState(1);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Friend | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true); // Estado para controlar la carga
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const auth = getAuth();
  const userUID = auth.currentUser ? auth.currentUser.uid : null;

  const changePattern = () => {
    setPatternNumber((prev) => (prev % 7) + 1); // Cambia entre 1 y 7
  };

  // const handleOpenChat = async (friendEmail: string) => {
  //   try {
  //     const chat = await getOrCreateChat(
  //       auth.currentUser?.email || "",
  //       friendEmail
  //     );
  //     navigate("/friendchat", { state: { friendEmail } });
  //   } catch (error) {
  //     console.error("Error opening chat:", error);
  //   }
  // };

  useEffect(() => {
    if (userUID) {
      setLoading(true); // Inicia el loader antes de obtener los datos
      fetchFriends(userUID)
        .then((data) => {
          setFriends(data);
        })
        .finally(() => {
          setLoading(false); // Termina el loader una vez los datos hayan sido cargados
        });
    }
  }, [userUID]);

  // Si los datos aún están cargando, mostrar un array vacío
  const filteredFriends = loading
    ? []
    : friends.filter((friend) =>
        friend.email.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="flex flex-col w-full h-screen md:flex-row">
      {/* Sidebar (Friends List) */}
      <div
        className={`w-full md:w-72 dark:bg-gray-950  dark:text-gray-100 h-full ${
          isMobile ? "block" : "hidden md:block"
        } ${selectedConversation ? "hidden" : ""}`}
      >
        <div className="p-2 py-4 w-full bg-gradient-to-r from-purple-400 to-indigo-600 dark:from-sky-950 dark:to-sky-900">
          <div className="flex justify-between w-24">
            <ArrowLeft
              className="cursor-pointer dark:text-gray-300 hover:text-gray-500"
              onClick={() => window.history.back()}
            />
            <h2 className="text-xl font-semibold">Friends</h2>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative px-2 my-4 w-full">
          <span className="absolute left-4 top-2.5 text-gray-400">
            <Search size={18} />
          </span>
          <Input
            type="text"
            placeholder="Search friends..."
            className="pl-10 h-10 bg-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-full">
          {loading ? (
            // Mostrar loader mientras se obtienen los datos
            <div className="flex justify-center items-center h-32">
              <Loader />
            </div>
          ) : (
            <ul className="space-y-4">
              {filteredFriends.map((friend, index) => (
                <div key={index}>
                  <li
                    className="flex items-center p-2 space-x-4 rounded-lg cursor-pointer dark:hover:bg-gray-700"
                    onClick={() => setSelectedConversation(friend)}
                    aria-selected={
                      selectedConversation === friend ? "true" : "false"
                    }
                  >
                    <Avatar>
                      <AvatarFallback>
                        {friend.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{friend.email}</span>
                  </li>
                  {index < filteredFriends.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Conversational Area */}
      <div
        className={`flex-1 h-screen dark:bg-gray-900 flex flex-col bg-gray-200 ${
          isMobile && !selectedConversation ? "hidden" : ""
        }`}
      >
        {selectedConversation && (
          <>
            <div className="flex justify-start items-center px-2 py-4 bg-gradient-to-r from-purple-400 to-indigo-600 dark:from-sky-950 dark:to-sky-900">
              <button
                onClick={() => setSelectedConversation(null)}
                className={`dark:text-gray-300 dark:hover:text-gray-500 ${
                  isMobile ? "" : "hidden"
                }`}
              >
                <ArrowLeft size={24} />
              </button>
              <Avatar>
                <AvatarFallback>
                  {selectedConversation.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="ml-2 text-xl font-semibold">
                {selectedConversation.email}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger className="ml-auto">
                  <EllipsisVertical className="dark:text-gray-300" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="dark:bg-gray-800 dark:text-gray-300">
                  <DropdownMenuLabel className="flex justify-center w-full">
                    <ModeToggle />
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel onClick={changePattern}>
                    Change Background
                  </DropdownMenuLabel>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="overflow-y-auto flex-1">
              <AIChat patternNumber={patternNumber} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
