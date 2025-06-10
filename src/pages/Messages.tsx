import { useState, useEffect, useRef } from "react";
import { Loader } from "@/components/uiverse/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMediaQuery } from "react-responsive";
import AIChat from "./chat";
import {
  ArrowLeft,
  EllipsisVertical,
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

      {/* Conversational Area */}
      <div
        className={`flex-1 h-screen dark:bg-gray-900 flex flex-col bg-gray-200 ${
          isMobile && !selectedConversation ? "hidden" : ""
        }`}
      >
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className={`dark:text-gray-300 dark:hover:text-gray-500 p-2 ${
                    isMobile ? "" : "hidden"
                  }`}
                >
                  <ArrowLeft size={20} />
                </button>
                <Avatar
                  className={`w-10 h-10 ${
                    isTutor(selectedConversation) ? "ring-2 ring-blue-400" : ""
                  }`}
                >
                  {!isTutor(selectedConversation) && (
                    <AvatarImage
                      src="https://t4.ftcdn.net/jpg/05/57/19/43/360_F_557194315_OGvi1AdKHGr9P1PpPx7wThwy0mOW022C.jpg"
                      alt="Friend Avatar"
                    />
                  )}
                  <AvatarFallback
                    className={
                      isTutor(selectedConversation)
                        ? "text-white bg-blue-500"
                        : "text-white bg-blue-500"
                    }
                  >
                    {isTutor(selectedConversation) ? (
                      <Bot size={20} />
                    ) : (
                      getAvatarInitial(selectedConversation)
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {getConversationName(selectedConversation)}
                  </h3>
                  {isTutor(selectedConversation) ? (
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      AI English Tutor
                    </p>
                  ) : (
                    <p className="text-sm text-green-500">En línea</p>
                  )}
                </div>
              </div>

              {/* Menú de opciones - para TODOS los chats */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <MoreVertical size={24} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Opciones del Chat</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={changePattern}
                    className="cursor-pointer"
                  >
                    <Palette className="mr-2 w-4 h-4" />
                    Cambiar fondo (Patrón {patternNumber})
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
                {/* Friend Chat Messages */}
                <div className="overflow-hidden flex-1">
                  <div
                    className={`overflow-y-auto p-4 space-y-4 h-full bg-pattern-${patternNumber}`}
                  >
                    {messages.length === 0 ? (
                      <div className="flex flex-col justify-center items-center h-full text-center">
                        <div className="flex justify-center items-center mb-4 w-16 h-16 bg-gray-200 rounded-full dark:bg-gray-700">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="text-white bg-blue-500">
                              {getAvatarInitial(selectedConversation)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                          Inicia una conversación
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Envía un mensaje para comenzar a chatear con{" "}
                          {getConversationName(selectedConversation)}
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
                            className={`flex items-end space-x-2 z-10 ${
                              isCurrentUser ? "justify-end" : "justify-start"
                            }`}
                          >
                            {!isCurrentUser && (
                              <Avatar
                                className={`w-8 h-8 z-10 ${
                                  showAvatar ? "" : "invisible"
                                }`}
                              >
                                <AvatarImage
                                  src="https://t4.ftcdn.net/jpg/05/57/19/43/360_F_557194315_OGvi1AdKHGr9P1PpPx7wThwy0mOW022C.jpg"
                                  alt="Friend Avatar"
                                />
                                <AvatarFallback className="text-xs text-white bg-gray-500">
                                  {getAvatarInitial(selectedConversation)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl text-sm shadow-sm z-10 ${
                                isCurrentUser
                                  ? "text-white bg-blue-500 rounded-br-md"
                                  : "text-gray-900 bg-white rounded-bl-md border border-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                              }`}
                            >
                              <p className="break-words">{message.content}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef}></div>
                  </div>
                </div>

                {/* Friend Chat Input */}
                <div className="p-4 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex items-end space-x-3">
                    <div className="relative flex-1">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Escribe un mensaje..."
                        className="py-3 pr-12 rounded-full border-gray-300 resize-none dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                        maxLength={1000}
                      />
                      <Button
                        variant="ghost"
                        onClick={() => setIsRecording((prev) => !prev)}
                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${
                          isRecording
                            ? "text-red-500 bg-red-50 dark:bg-red-900/20"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        <Mic size={18} />
                      </Button>
                    </div>
                    <Button
                      onClick={() => handleSendMessage(input)}
                      disabled={!input.trim()}
                      className="p-0 w-12 h-12 bg-blue-500 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                  {isRecording && (
                    <div className="flex justify-center items-center mt-2 text-sm text-red-500">
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
