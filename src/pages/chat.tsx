import { useState, useEffect, useRef } from "react";
import OpenAI from "openai";
import { Mic, Send } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  patternNumber: number; // Número del patrón dinámico
}

const AIChat: React.FC<AIChatProps> = ({ patternNumber }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I am your English tutor. I can help you with writing, speaking, and listening. How can I assist you today?",
      avatar: "https://via.placeholder.com/50",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Inicializar OpenAI
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  // Variables de grabación de audio
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const handleSendMessage = async (messageContent: string) => {
    if (messageContent.trim() !== "") {
      const newMessage: Message = {
        role: "user",
        content: messageContent,
        avatar: "https://via.placeholder.com/50",
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInput(""); // Limpiar el input después de enviar el mensaje

      try {
        const chatCompletion = await openai.chat.completions.create({
          messages: [...messages, newMessage],
          model: "gpt-3.5-turbo",
        });

        const assistantMessage: Message = {
          role: "assistant",
          content: chatCompletion.choices[0].message?.content || "",
          avatar: "https://via.placeholder.com/50",
        };

        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      } catch (error) {
        console.error("Error al obtener respuesta del chat:", error);
      }
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.start();
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        audioChunks.current = [];
      };
    });
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <Card className="flex flex-col mx-auto w-full h-full rounded-none border-0 shadow-md">
        {/* Chat Messages */}
        <ScrollArea
          className={`overflow-auto flex-1 p-4 bg-pattern-${patternNumber}`}
        >
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <Avatar className="z-10">
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
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="flex gap-2 justify-between items-center p-4 bg-white border-t border-gray-300 dark:border-gray-700 dark:bg-gray-800">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
            placeholder="Type your message here..."
            className="flex-1"
          />
          <Button
            variant="ghost"
            onClick={isRecording ? stopRecording : startRecording}
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
};

export default AIChat;
