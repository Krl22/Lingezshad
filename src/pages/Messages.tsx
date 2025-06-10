import { useState, useEffect, useRef } from "react";
import { Loader } from "@/components/uiverse/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMediaQuery } from "react-responsive";
import AIChat from "./chat";
import {
  ArrowLeft,
  Moon,
  Search,
  Bot,
  Pin,
  Mic,
  Send,
  MoreVertical,
  Palette,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchFriends, Friend } from "@/firebase/friendsService";
import { getAuth } from "firebase/auth";
import {
  getOrCreateChat,
  listenToMessages,
  sendMessage,
} from "@/firebase/messages";
import { useLocation } from "react-router-dom";

// Tipo para el English tutor
type EnglishTutor = {
  id: string;
  name: string;
  type: "tutor";
};

// Tipo unión para conversaciones
type Conversation = Friend | EnglishTutor;

export function Messages() {
  const [patternNumber, setPatternNumber] = useState(1);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Estados para el chat de amigos
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const location = useLocation();

  const auth = getAuth();
  const userUID = auth.currentUser ? auth.currentUser.uid : null;
  const userEmail = auth.currentUser?.email || "";

  // English tutor predeterminado
  const englishTutor: EnglishTutor = {
    id: "english-tutor",
    name: "English Tutor",
    type: "tutor",
  };

  const changePattern = () => {
    setPatternNumber((prev) => (prev % 7) + 1);
  };

  useEffect(() => {
    if (userUID) {
      setLoading(true);
      fetchFriends(userUID)
        .then((data) => {
          setFriends(data);

          // Verificar si se pasó un amigo específico desde FriendList
          const selectedFriendEmail = location.state?.selectedFriendEmail;
          if (selectedFriendEmail) {
            const selectedFriend = data.find(
              (friend) => friend.email === selectedFriendEmail
            );
            if (selectedFriend) {
              setSelectedConversation(selectedFriend);
            }
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userUID, location.state]);

  // Filtrar amigos y siempre incluir el English tutor al principio
  const filteredConversations = loading
    ? []
    : [
        englishTutor,
        ...friends.filter((friend) =>
          friend.email.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      ];

  // Función para verificar si es el tutor
  const isTutor = (
    conversation: Conversation
  ): conversation is EnglishTutor => {
    return "type" in conversation && conversation.type === "tutor";
  };

  // Función para obtener el nombre de la conversación
  const getConversationName = (conversation: Conversation) => {
    return isTutor(conversation) ? conversation.name : conversation.email;
  };

  // Función para obtener el avatar inicial
  const getAvatarInitial = (conversation: Conversation) => {
    if (isTutor(conversation)) {
      return "ET";
    }
    return conversation.email.charAt(0).toUpperCase();
  };

  // Función para manejar el envío de mensajes
  const handleSendMessage = async (messageContent: string) => {
    if (
      messageContent.trim() !== "" &&
      selectedConversation &&
      !isTutor(selectedConversation)
    ) {
      try {
        const chat = await getOrCreateChat(
          userEmail,
          selectedConversation.email
        );
        await sendMessage(chat.id, userEmail, messageContent);
        setInput("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  // Escuchar mensajes cuando se selecciona una conversación de amigo
  useEffect(() => {
    if (selectedConversation && !isTutor(selectedConversation)) {
      const fetchMessages = async () => {
        try {
          const chat = await getOrCreateChat(
            userEmail,
            selectedConversation.email
          );
          listenToMessages(chat.id, (newMessages) => {
            setMessages(newMessages);
          });
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [selectedConversation, userEmail]);

  // Auto-scroll para nuevos mensajes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col w-full h-screen md:flex-row">
      {/* Sidebar (Friends List) */}
      <div
        className={`w-full md:w-72 dark:bg-gray-950 dark:text-gray-100 h-full ${
          isMobile ? "block" : "hidden md:block"
        } ${selectedConversation ? "hidden" : ""}`}
      >
        <div className="p-2 py-4 w-full bg-gradient-to-r from-purple-400 to-indigo-600 dark:from-sky-950 dark:to-sky-900">
          <div className="flex justify-between w-24">
            <ArrowLeft
              size={28}
              className="cursor-pointer dark:text-gray-300 hover:text-gray-500"
              onClick={() => window.history.back()}
            />
            <div className="flex gap-4 items-center">
              <ArrowLeft
                size={32}
                className="cursor-pointer dark:text-gray-300 hover:text-gray-500"
                onClick={() => window.history.back()}
              />
              <h2 className="text-xl font-semibold">Messages</h2>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative px-2 my-4 w-full">
          <span className="absolute left-4 top-2.5 text-gray-400">
            <Search size={18} />
          </span>
          <Input
            type="text"
            placeholder="Search conversations..."
            className="pl-10 h-10 bg-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-full">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader />
            </div>
          ) : (
            <ul className="space-y-4">
              {filteredConversations.map((conversation, index) => (
                <div
                  key={
                    isTutor(conversation) ? conversation.id : conversation.email
                  }
                >
                  <li
                    className={`flex items-center p-2 space-x-4 rounded-lg cursor-pointer dark:hover:bg-gray-700 ${
                      isTutor(conversation)
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-800"
                        : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                    aria-selected={
                      selectedConversation === conversation ? "true" : "false"
                    }
                  >
                    <div className="relative">
                      <Avatar
                        className={
                          isTutor(conversation) ? "ring-2 ring-blue-400" : ""
                        }
                      >
                        <AvatarFallback
                          className={
                            isTutor(conversation)
                              ? "text-white bg-blue-500"
                              : ""
                          }
                        >
                          {isTutor(conversation) ? (
                            <Bot size={20} />
                          ) : (
                            getAvatarInitial(conversation)
                          )}
                        </AvatarFallback>
                      </Avatar>
                      {isTutor(conversation) && (
                        <Pin
                          size={12}
                          className="absolute -top-1 -right-1 text-blue-500 bg-white dark:bg-gray-900 rounded-full p-0.5"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <span
                        className={`font-medium ${
                          isTutor(conversation)
                            ? "text-blue-700 dark:text-blue-300"
                            : ""
                        }`}
                      >
                        {getConversationName(conversation)}
                      </span>
                      {isTutor(conversation) && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                          AI English Tutor • Always available
                        </p>
                      )}
                    </div>
                  </li>
                  {index < filteredConversations.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Conversational Area con gradiente de fondo */}
      <div
        className={`flex-1 h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950 ${isMobile && !selectedConversation ? "hidden" : ""}`}
      >
        {selectedConversation ? (
          <>
            {/* Header con gradiente y efectos */}
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 backdrop-blur-md border-b border-blue-200/50 shadow-lg dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 dark:border-blue-800/30">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className={`text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 p-2 rounded-full hover:bg-blue-100/50 dark:hover:bg-blue-900/30 transition-all ${isMobile ? "" : "hidden"}`}
                >
                  <ArrowLeft size={20} />
                </button>
                <Avatar
                  className={`w-12 h-12 ring-2 ring-blue-400/50 shadow-lg ${isTutor(selectedConversation) ? "ring-blue-500" : "ring-indigo-400"}`}
                >
                  {!isTutor(selectedConversation) && (
                    <AvatarImage
                      src="https://t4.ftcdn.net/jpg/05/57/19/43/360_F_557194315_OGvi1AdKHGr9P1PpPx7wThwy0mOW022C.jpg"
                      alt="Friend Avatar"
                    />
                  )}
                  <AvatarFallback
                    className={isTutor(selectedConversation)
                      ? "text-white bg-gradient-to-br from-blue-500 to-blue-600 font-bold"
                      : "text-white bg-gradient-to-br from-indigo-500 to-purple-600 font-bold"
                    }
                  >
                    {isTutor(selectedConversation) ? (
                      <Bot size={24} />
                    ) : (
                      getAvatarInitial(selectedConversation)
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-lg bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent dark:from-blue-300 dark:to-indigo-300">
                    {getConversationName(selectedConversation)}
                  </h3>
                  {isTutor(selectedConversation) ? (
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      AI English Tutor
                    </p>
                  ) : (
                    <p className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      En línea
                    </p>
                  )}
                </div>
              </div>

              {/* Menú con estilo mejorado */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2 hover:bg-blue-100/50 dark:hover:bg-blue-900/30 rounded-full">
                    <MoreVertical size={24} className="text-blue-600 dark:text-blue-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-blue-200/50 dark:border-blue-800/50 shadow-xl">
                  <DropdownMenuLabel className="text-blue-700 dark:text-blue-300 font-semibold">Opciones del Chat</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-blue-200/30 dark:bg-blue-800/30" />
                  <DropdownMenuItem
                    onClick={changePattern}
                    className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                  >
                    <Palette className="mr-2 w-4 h-4 text-purple-500" />
                    Cambiar fondo (Patrón {patternNumber})
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-blue-200/30 dark:bg-blue-800/30" />
                  <DropdownMenuItem className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/50">
                    <div className="flex items-center justify-between w-full">
                      <span className="flex items-center text-blue-700 dark:text-blue-300">
                        <Moon className="mr-2 w-4 h-4 text-indigo-500" />
                        Modo oscuro
                      </span>
                      <ModeToggle />
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Chat Content */}
            {isTutor(selectedConversation) ? (
              <div className="overflow-y-auto flex-1">
                <AIChat patternNumber={patternNumber} />
              </div>
            ) : (
              <>
                {/* Friend Chat Messages con overlay colorido */}
                <div className="overflow-hidden flex-1">
                  <div
                    className={`overflow-y-auto p-4 space-y-4 h-full bg-pattern-${patternNumber} relative`}>
                    {/* Overlay colorido para dar más esencia */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 dark:from-blue-900/10 dark:via-indigo-900/10 dark:to-purple-900/10 pointer-events-none"></div>
                    
                    {messages.length === 0 ? (
                      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center">
                        <div className="flex justify-center items-center mb-6 w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-full border-2 border-blue-200/50 dark:border-blue-700/50 shadow-lg">
                          <Avatar className="w-14 h-14">
                            <AvatarFallback className="text-white bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-bold">
                              {getAvatarInitial(selectedConversation)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <h3 className="mb-3 text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent dark:from-blue-300 dark:to-indigo-300">
                          Inicia una conversación
                        </h3>
                        <p className="text-blue-600/80 dark:text-blue-400/80 max-w-sm font-medium">
                          Envía un mensaje para comenzar a chatear con{" "}
                          <span className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
                            {getConversationName(selectedConversation)}
                          </span>
                        </p>
                      </div>
                    ) : (
                      messages.map((message, index) => {
                        const isCurrentUser = message.sender === userEmail;
                        const showAvatar =
                          !isCurrentUser &&
                          (index === 0 ||
                            messages[index - 1]?.sender !== message.sender);

                        return (
                          <div
                            key={index}
                            className={`relative z-10 flex items-end space-x-3 ${isCurrentUser ? "justify-end" : "justify-start"}`}
                          >
                            {!isCurrentUser && (
                              <Avatar
                                className={`w-8 h-8 ring-2 ring-white/70 dark:ring-gray-800/70 shadow-lg ${showAvatar ? "" : "invisible"}`}
                              >
                                <AvatarImage
                                  src="https://t4.ftcdn.net/jpg/05/57/19/43/360_F_557194315_OGvi1AdKHGr9P1PpPx7wThwy0mOW022C.jpg"
                                  alt="Friend Avatar"
                                />
                                <AvatarFallback className="text-xs text-white bg-gradient-to-br from-indigo-500 to-purple-600 font-bold">
                                  {getAvatarInitial(selectedConversation)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl text-sm shadow-xl backdrop-blur-sm border-2 font-medium ${isCurrentUser
                                ? "text-white bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-300/30 rounded-br-md shadow-blue-200/50"
                                : "text-gray-800 bg-gradient-to-br from-white to-blue-50/80 border-blue-200/50 rounded-bl-md shadow-indigo-200/50 dark:from-gray-800 dark:to-blue-950/80 dark:text-gray-100 dark:border-blue-700/50"
                              }`}
                            >
                              <p className="break-words leading-relaxed">{message.content}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef}></div>
                  </div>
                </div>

                {/* Friend Chat Input con gradiente */}
                <div className="p-4 bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-purple-50/80 dark:from-gray-900/80 dark:via-blue-950/80 dark:to-indigo-950/80 backdrop-blur-md border-t border-blue-200/50 dark:border-blue-800/30">
                  <div className="flex items-end space-x-3">
                    <div className="relative flex-1">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Escribe un mensaje..."
                        className="py-3 pr-12 rounded-2xl border-2 border-blue-200/50 bg-white/80 dark:bg-gray-800/80 dark:border-blue-700/50 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 dark:focus:ring-blue-800/50 backdrop-blur-sm shadow-lg font-medium"
                        maxLength={1000}
                      />
                      <Button
                        variant="ghost"
                        onClick={() => setIsRecording((prev) => !prev)}
                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all ${isRecording
                          ? "text-red-500 bg-red-100/80 dark:bg-red-950/30 hover:bg-red-200/80 dark:hover:bg-red-950/50"
                          : "text-blue-500 hover:text-blue-700 hover:bg-blue-100/50 dark:hover:bg-blue-900/30"
                        }`}
                      >
                        <Mic size={18} />
                      </Button>
                    </div>
                    <Button
                      onClick={() => handleSendMessage(input)}
                      disabled={!input.trim()}
                      className="p-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                  {isRecording && (
                    <div className="flex justify-center items-center mt-3 text-sm text-red-500 font-medium">
                      <div className="mr-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      Grabando audio...
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex flex-1 justify-center items-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Bot size={64} className="mx-auto mb-4 opacity-50" />
              <h3 className="mb-2 text-lg font-medium">Welcome to Messages</h3>
              <p className="text-sm">
                Select a conversation to start chatting or talk with your
                English Tutor
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
