import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mic, Send, ArrowLeft, MoreVertical } from "lucide-react";
import { getAuth } from "firebase/auth";
import {
  getOrCreateChat,
  listenToMessages,
  sendMessage,
} from "@/firebase/messages";
import { useLocation, useNavigate } from "react-router-dom";

export function FriendChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const auth = getAuth();
  const userEmail = auth.currentUser?.email || "";

  const location = useLocation();
  const friendEmail = location.state?.friendEmail || "";

  // Función para manejar el envío de mensajes
  const handleSendMessage = async (messageContent: string) => {
    if (messageContent.trim() !== "") {
      try {
        // Obtener o crear el chat
        const chat = await getOrCreateChat(userEmail, friendEmail);
        await sendMessage(chat.id, userEmail, messageContent);
        setInput(""); // Limpiar el input después de enviar el mensaje
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  // Escuchar mensajes en tiempo real
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Obtener o crear el chat
        const chat = await getOrCreateChat(userEmail, friendEmail);
        listenToMessages(chat.id, (newMessages) => {
          setMessages(newMessages);
        });
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [userEmail, friendEmail]);

  useEffect(() => {
    // Desplazar hacia abajo cuando lleguen nuevos mensajes
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <Avatar className="w-10 h-10">
            <AvatarImage
              src="https://t4.ftcdn.net/jpg/05/57/19/43/360_F_557194315_OGvi1AdKHGr9P1PpPx7wThwy0mOW022C.jpg"
              alt="Friend Avatar"
            />
            <AvatarFallback className="text-white bg-blue-500">
              {friendEmail.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {friendEmail}
            </h3>
            <p className="text-sm text-green-500">En línea</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="p-2">
          <MoreVertical size={20} />
        </Button>
      </div>

      {/* Chat Messages */}
      <div className="overflow-hidden flex-1">
        <div className="overflow-y-auto p-4 space-y-4 h-full bg-gradient-to-b from-blue-50/30 to-purple-50/30 dark:from-gray-800/30 dark:to-gray-900/30">
          {messages.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-full text-center">
              <div className="flex justify-center items-center mb-4 w-16 h-16 bg-gray-200 rounded-full dark:bg-gray-700">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="text-white bg-blue-500">
                    {friendEmail.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                Inicia una conversación
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Envía un mensaje para comenzar a chatear con {friendEmail}
              </p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isCurrentUser = message.sender === userEmail;
              const showAvatar =
                !isCurrentUser &&
                (index === 0 || messages[index - 1]?.sender !== message.sender);

              return (
                <div
                  key={index}
                  className={`flex items-end space-x-2 ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isCurrentUser && (
                    <Avatar
                      className={`w-8 h-8 ${showAvatar ? "" : "invisible"}`}
                    >
                      <AvatarImage
                        src="https://t4.ftcdn.net/jpg/05/57/19/43/360_F_557194315_OGvi1AdKHGr9P1PpPx7wThwy0mOW022C.jpg"
                        alt="Friend Avatar"
                      />
                      <AvatarFallback className="text-xs text-white bg-gray-500">
                        {friendEmail.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl text-sm shadow-sm ${
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

      {/* Chat Input */}
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
    </div>
  );
}
