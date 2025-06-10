import { useState, useEffect, useRef } from "react";
import OpenAI from "openai";
import { Mic, Send, MicOff } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";

//Initialize css style classes so they load with the page

const _ = [
  "bg-pattern-1",
  "bg-pattern-2",
  "bg-pattern-3",
  "bg-pattern-4",
  "bg-pattern-5",
  "bg-pattern-6",
  "bg-pattern-7",
] as const;

// Usar void para indicar que intencionalmente no usamos la variable
void _;

// Definición de tipos para los mensajes
interface Message {
  role: "system" | "user" | "assistant";
  content: string;
  avatar?: string;
}

interface AIChatProps {
  patternNumber: number;
  // Eliminar onPatternChange ya que se maneja desde Messages.tsx
}

const AIChat: React.FC<AIChatProps> = ({ patternNumber }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content:
        "You are an experienced English tutor. Your role is to help students improve their English skills through conversation, grammar correction, vocabulary building, and pronunciation guidance. Always be encouraging, patient, and provide constructive feedback. Correct mistakes gently and explain grammar rules when needed. Ask follow-up questions to keep the conversation engaging and educational.",
    },
    {
      role: "assistant",
      content:
        "Hello! I'm your English tutor. I'm here to help you improve your English skills through conversation, grammar, vocabulary, and pronunciation. What would you like to work on today? We can have a casual conversation, practice specific grammar topics, or work on any English skills you'd like to improve!",
      avatar:
        "https://t4.ftcdn.net/jpg/05/57/19/43/360_F_557194315_OGvi1AdKHGr9P1PpPx7wThwy0mOW022C.jpg",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Inicializar OpenAI con configuración mejorada
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  // Variables de grabación de audio
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const handleSendMessage = async (messageContent: string) => {
    if (messageContent.trim() === "") return;

    setError(null);
    setIsLoading(true);

    const newMessage: Message = {
      role: "user",
      content: messageContent.trim(),
      avatar: "https://via.placeholder.com/50",
    };

    // Actualizar mensajes con el mensaje del usuario
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput(""); // Limpiar el input inmediatamente

    try {
      // Verificar si la API key está configurada
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        throw new Error(
          "OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your environment variables."
        );
      }

      const chatCompletion = await openai.chat.completions.create({
        messages: updatedMessages,
        model: "gpt-3.5-turbo",
        max_tokens: 500,
        temperature: 0.7,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content:
          chatCompletion.choices[0].message?.content ||
          "I'm sorry, I couldn't generate a response. Please try again.",
        avatar:
          "https://t4.ftcdn.net/jpg/05/57/19/43/360_F_557194315_OGvi1AdKHGr9P1PpPx7wThwy0mOW022C.jpg",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error al obtener respuesta del chat:", error);

      let errorMessage = "Sorry, I encountered an error. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes("API key")) {
          errorMessage = "OpenAI API key is not configured properly.";
        } else if (error.message.includes("quota")) {
          errorMessage = "API quota exceeded. Please try again later.";
        } else if (error.message.includes("network")) {
          errorMessage = "Network error. Please check your connection.";
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunks.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });

        // Aquí podrías implementar la transcripción de audio usando OpenAI Whisper
        // Por ahora, mostramos un mensaje indicando que la funcionalidad está en desarrollo
        setError(
          "Audio transcription feature is coming soon! Please use text input for now."
        );

        // Limpiar el stream
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setError("Could not access microphone. Please check your permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Filtrar mensajes del sistema para la visualización
  const visibleMessages = messages.filter((msg) => msg.role !== "system");

  return (
    <div className="flex flex-col h-full">
      <Card className="flex flex-col mx-auto w-full h-full rounded-none border-0 shadow-none bg-transparent">
        {/* Error Alert con gradiente */}
        {error && (
          <Alert className="m-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 border-2 border-red-200/50 dark:border-red-800/50 backdrop-blur-sm shadow-lg">
            <AlertDescription className="text-red-700 dark:text-red-300 font-medium">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Chat Messages con overlay colorido */}
        <ScrollArea className={`overflow-auto flex-1 p-4 bg-pattern-${patternNumber} relative`}>
          {/* Overlay colorido para dar más esencia */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 dark:from-blue-900/10 dark:via-indigo-900/10 dark:to-purple-900/10 pointer-events-none"></div>
          
          <div className="relative z-10 space-y-6">
            {visibleMessages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <Avatar className="ring-2 ring-white/70 dark:ring-gray-800/70 shadow-xl">
                    <AvatarImage src="https://t4.ftcdn.net/jpg/05/57/19/43/360_F_557194315_OGvi1AdKHGr9P1PpPx7wThwy0mOW022C.jpg" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg">
                      AI
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-xs md:max-w-md p-4 rounded-2xl text-sm shadow-xl backdrop-blur-sm border-2 leading-relaxed font-medium ${message.role === "user"
                    ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-blue-300/30 rounded-br-md shadow-blue-200/50"
                    : "bg-gradient-to-br from-white to-blue-50/80 text-gray-800 border-blue-200/50 rounded-bl-md shadow-indigo-200/50 dark:from-gray-800 dark:to-blue-950/80 dark:text-gray-100 dark:border-blue-700/50"
                  }`}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <Avatar className="ring-2 ring-white/70 dark:ring-gray-800/70 shadow-xl">
                    <AvatarImage src="https://via.placeholder.com/50" />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold">
                      Tú
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {/* Loading indicator con gradiente */}
            {isLoading && (
              <div className="flex justify-start items-start space-x-3">
                <Avatar className="ring-2 ring-white/70 dark:ring-gray-800/70 shadow-xl">
                  <AvatarImage src="https://t4.ftcdn.net/jpg/05/57/19/43/360_F_557194315_OGvi1AdKHGr9P1PpPx7wThwy0mOW022C.jpg" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div className="p-4 max-w-xs bg-gradient-to-br from-white to-blue-50/80 dark:from-gray-800 dark:to-blue-950/80 backdrop-blur-sm border-2 border-blue-200/50 dark:border-blue-700/50 rounded-2xl rounded-bl-md shadow-xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef}></div>
          </div>
        </ScrollArea>

        {/* Chat Input con gradiente */}
        <div className="flex gap-3 justify-between items-center p-4 bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-purple-50/80 dark:from-gray-900/80 dark:via-blue-950/80 dark:to-indigo-950/80 backdrop-blur-md border-t border-blue-200/50 dark:border-blue-800/30">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Escribe tu mensaje aquí... (Presiona Enter para enviar)"
            className="flex-1 bg-white/80 dark:bg-gray-800/80 border-2 border-blue-200/50 dark:border-blue-700/50 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 dark:focus:ring-blue-800/50 rounded-2xl backdrop-blur-sm shadow-lg font-medium"
            disabled={isLoading}
          />
          <Button
            variant="ghost"
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-3 rounded-full transition-all ${isRecording 
              ? "text-red-500 bg-red-100/80 dark:bg-red-950/30 hover:bg-red-200/80 dark:hover:bg-red-950/50" 
              : "text-blue-500 hover:text-blue-700 hover:bg-blue-100/50 dark:hover:bg-blue-900/30"
            }`}
            disabled={isLoading}
            title={isRecording ? "Detener grabación" : "Iniciar grabación"}
          >
            {isRecording ? (
              <MicOff className="w-5 h-5 animate-pulse" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </Button>
          <Button
            onClick={() => handleSendMessage(input)}
            disabled={isLoading || input.trim() === ""}
            className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full hover:from-blue-600 hover:to-indigo-700 shadow-lg transition-all hover:shadow-xl hover:scale-105"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AIChat;
