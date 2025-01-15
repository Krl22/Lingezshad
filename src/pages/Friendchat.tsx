import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mic, Send } from "lucide-react";
import { getAuth } from "firebase/auth";
import {
  getOrCreateChat,
  listenToMessages,
  sendMessage,
} from "@/firebase/messages";
import { useLocation } from "react-router-dom";

export function FriendChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex flex-col h-full">
      <Card className="flex flex-col w-full h-full mx-auto border-0 rounded-none shadow-md">
        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-auto bg-pattern-1">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === userEmail ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender !== userEmail && (
                  <Avatar className="z-10">
                    <AvatarImage
                      src="https://t4.ftcdn.net/jpg/05/57/19/43/360_F_557194315_OGvi1AdKHGr9P1PpPx7wThwy0mOW022C.jpg"
                      alt="Friend Avatar"
                    />
                    <AvatarFallback>FR</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-xs md:max-w-md p-3 rounded-lg text-sm z-10 ${
                    message.sender === userEmail
                      ? "bg-blue-500 text-white dark:bg-blue-600"
                      : "bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="flex items-center justify-between gap-2 p-4 bg-white border-t border-gray-300 dark:border-gray-700 dark:bg-gray-800">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
            placeholder="Type your message here..."
            className="flex-1"
          />
          <Button
            variant="ghost"
            onClick={() => setIsRecording((prev) => !prev)} // Simulación de grabación
            className="p-2"
          >
            <Mic
              className={`w-6 h-6 ${
                isRecording ? "text-red-500" : "text-blue-500"
              }`}
            />
          </Button>
          <Button
            onClick={() => {
              handleSendMessage(input);
              setInput(""); // Limpiar el input después de enviar el mensaje
            }}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
