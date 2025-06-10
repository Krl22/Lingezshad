import { useState, useEffect, useRef } from "react";
import OpenAI from "openai";
import { Mic, Send, MicOff, MoreVertical, Palette } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

//Initialize css style classes so they load with the page
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      content: "You are an experienced English tutor. Your role is to help students improve their English skills through conversation, grammar correction, vocabulary building, and pronunciation guidance. Always be encouraging, patient, and provide constructive feedback. Correct mistakes gently and explain grammar rules when needed. Ask follow-up questions to keep the conversation engaging and educational.",
    },
    {
      role: "assistant",
      content: "Hello! I'm your English tutor. I'm here to help you improve your English skills through conversation, grammar, vocabulary, and pronunciation. What would you like to work on today? We can have a casual conversation, practice specific grammar topics, or work on any English skills you'd like to improve!",
      avatar: "https://t4.ftcdn.net/jpg/05/57/19/43/360_F_557194315_OGvi1AdKHGr9P1PpPx7wThwy0mOW022C.jpg",
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
        throw new Error("OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your environment variables.");
      }

      const chatCompletion = await openai.chat.completions.create({
        messages: updatedMessages,
        model: "gpt-3.5-turbo",
        max_tokens: 500,
        temperature: 0.7,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: chatCompletion.choices[0].message?.content || "I'm sorry, I couldn't generate a response. Please try again.",
        avatar: "https://t4.ftcdn.net/jpg/05/57/19/43/360_F_557194315_OGvi1AdKHGr9P1PpPx7wThwy0mOW022C.jpg",
      };

      setMessages(prev => [...prev, assistantMessage]);
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
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        
        // Aquí podrías implementar la transcripción de audio usando OpenAI Whisper
        // Por ahora, mostramos un mensaje indicando que la funcionalidad está en desarrollo
        setError("Audio transcription feature is coming soon! Please use text input for now.");
        
        // Limpiar el stream
        stream.getTracks().forEach(track => track.stop());
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
  const visibleMessages = messages.filter(msg => msg.role !== "system");

  return (
    <div className="flex flex-col h-full">
      <Card className="flex flex-col mx-auto w-full h-full rounded-none border-0 shadow-md">
        {/* Eliminar completamente el header con menú de opciones */}
        
        {/* Error Alert */}
        {error && (
          <Alert className="m-4 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <AlertDescription className="text-red-800 dark:text-red-200">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Chat Messages */}
        <ScrollArea
          className={`overflow-auto flex-1 p-4 bg-pattern-${patternNumber}`}
        >
          <div className="space-y-4">
            {visibleMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <Avatar className="z-10 mr-2">
                    <AvatarImage src="https://t4.ftcdn.net/jpg/05/57/19/43/360_F_557194315_OGvi1AdKHGr9P1PpPx7wThwy0mOW022C.jpg" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-xs md:max-w-md p-3 rounded-lg text-sm z-10 ${
                    message.role === "user"
                      ? "bg-blue-500 text-white dark:bg-blue-600"
                      : "bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <Avatar className="z-10 ml-2">
                    <AvatarImage src="https://via.placeholder.com/50" />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <Avatar className="z-10 mr-2">
                  <AvatarImage src="https://t4.ftcdn.net/jpg/05/57/19/43/360_F_557194315_OGvi1AdKHGr9P1PpPx7wThwy0mOW022C.jpg" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="max-w-xs md:max-w-md p-3 rounded-lg text-sm z-10 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef}></div>
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="flex gap-2 justify-between items-center p-4 bg-white border-t border-gray-300 dark:border-gray-700 dark:bg-gray-800">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message here... (Press Enter to send)"
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            variant="ghost"
            onClick={isRecording ? stopRecording : startRecording}
            className="p-2"
            disabled={isLoading}
            title={isRecording ? "Stop recording" : "Start recording"}
          >
            {isRecording ? (
              <MicOff className="w-6 h-6 text-red-500 animate-pulse" />
            ) : (
              <Mic className="w-6 h-6 text-blue-500" />
            )}
          </Button>
          <Button
            onClick={() => handleSendMessage(input)}
            disabled={isLoading || input.trim() === ""}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AIChat;
