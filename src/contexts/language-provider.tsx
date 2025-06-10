import { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "es";

type LanguageProviderProps = {
  children: React.ReactNode;
  defaultLanguage?: Language;
  storageKey?: string;
};

type LanguageProviderState = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const initialState: LanguageProviderState = {
  language: "en",
  setLanguage: () => null,
  t: (key: string) => key,
};

const LanguageProviderContext = createContext<LanguageProviderState>(initialState);

// Define the translation keys type
type TranslationKeys = {
  // Landing Page
  "landing.title": string;
  "landing.subtitle": string;
  "landing.description": string;
  "landing.signin": string;
  "landing.getstarted": string;
  "landing.features.games.title": string;
  "landing.features.games.description": string;
  "landing.features.conversations.title": string;
  "landing.features.conversations.description": string;
  "landing.features.personalized.title": string;
  "landing.features.personalized.description": string;
  
  // Messages & Chat
  "chat.online": string;
  "chat.startconversation": string;
  "chat.sendmessage": string;
  "chat.placeholder": string;
  "chat.recording": string;
  "chat.stoprecording": string;
  "chat.startrecording": string;
  "chat.friendplaceholder": string;
  
  // Game
  "game.loading": string;
  "game.finished": string;
  
  // Audio Exercise
  "audio.play": string;
  "audio.remove": string;
  
  // Fill in the Blank
  "exercise.perfect": string;
  "exercise.success.compact": string;
  
  // Sidebar
  "sidebar.account": string;
  "sidebar.play": string;
  "sidebar.environment": string;
  "sidebar.messages": string;
  "sidebar.friends": string;
  "sidebar.settings": string;
  "sidebar.logout": string;
  "sidebar.navigation": string;
  "sidebar.application": string;
  
  // Language Selector
  "language.english": string;
  "language.spanish": string;
  "language.select": string;
};

// Traducciones with proper typing
const translations: Record<Language, TranslationKeys> = {
  en: {
    // Landing Page
    "landing.title": "Welcome to Lingez",
    "landing.subtitle": "Learn English easily and have fun!",
    "landing.description": "Join thousands of learners on an interactive journey to master English through games, conversations, and personalized lessons.",
    "landing.signin": "Sign In",
    "landing.getstarted": "Get Started",
    "landing.features.games.title": "Interactive Games",
    "landing.features.games.description": "Learn through fun and engaging games that make language learning enjoyable.",
    "landing.features.conversations.title": "Real Conversations",
    "landing.features.conversations.description": "Practice with AI and connect with other learners worldwide.",
    "landing.features.personalized.title": "Personalized Learning",
    "landing.features.personalized.description": "Adaptive lessons that adjust to your pace and learning style.",
    
    // Messages & Chat
    "chat.online": "Online",
    "chat.startconversation": "Start a conversation",
    "chat.sendmessage": "Send a message to start chatting with",
    "chat.placeholder": "Type your message here... (Press Enter to send)",
    "chat.recording": "Recording audio...",
    "chat.stoprecording": "Stop recording",
    "chat.startrecording": "Start recording",
    "chat.friendplaceholder": "Write a message...",
    
    // Game
    "game.loading": "Loading game...",
    "game.finished": "Game Over!",
    
    // Audio Exercise
    "audio.play": "Play audio",
    "audio.remove": "Remove audio",
    
    // Fill in the Blank
    "exercise.perfect": "Perfect!",
    "exercise.success.compact": "Compact success message",
    
    // Sidebar
    "sidebar.account": "Account",
    "sidebar.play": "Play",
    "sidebar.environment": "Environment",
    "sidebar.messages": "Messages",
    "sidebar.friends": "Friends",
    "sidebar.settings": "Settings",
    "sidebar.logout": "Logout",
    "sidebar.navigation": "Navigation",
    "sidebar.application": "Application",
    
    // Language Selector
    "language.english": "English",
    "language.spanish": "Español",
    "language.select": "Select Language",
  },
  es: {
    // Landing Page
    "landing.title": "Bienvenido a Lingez",
    "landing.subtitle": "¡Aprende inglés fácilmente y diviértete!",
    "landing.description": "Únete a miles de estudiantes en un viaje interactivo para dominar el inglés a través de juegos, conversaciones y lecciones personalizadas.",
    "landing.signin": "Iniciar Sesión",
    "landing.getstarted": "Comenzar",
    "landing.features.games.title": "Juegos Interactivos",
    "landing.features.games.description": "Aprende a través de juegos divertidos y atractivos que hacen que el aprendizaje de idiomas sea agradable.",
    "landing.features.conversations.title": "Conversaciones Reales",
    "landing.features.conversations.description": "Practica con IA y conéctate con otros estudiantes de todo el mundo.",
    "landing.features.personalized.title": "Aprendizaje Personalizado",
    "landing.features.personalized.description": "Lecciones adaptativas que se ajustan a tu ritmo y estilo de aprendizaje.",
    
    // Messages & Chat
    "chat.online": "En línea",
    "chat.startconversation": "Inicia una conversación",
    "chat.sendmessage": "Envía un mensaje para comenzar a chatear con",
    "chat.placeholder": "Escribe tu mensaje aquí... (Presiona Enter para enviar)",
    "chat.recording": "Grabando audio...",
    "chat.stoprecording": "Detener grabación",
    "chat.startrecording": "Iniciar grabación",
    "chat.friendplaceholder": "Escribe un mensaje...",
    
    // Game
    "game.loading": "Cargando juego...",
    "game.finished": "¡Juego Terminado!",
    
    // Audio Exercise
    "audio.play": "Reproducir audio",
    "audio.remove": "Quitar audio",
    
    // Fill in the Blank
    "exercise.perfect": "¡Perfecto!",
    "exercise.success.compact": "Mensaje de éxito compacto",
    
    // Sidebar
    "sidebar.account": "Cuenta",
    "sidebar.play": "Jugar",
    "sidebar.environment": "Entorno",
    "sidebar.messages": "Mensajes",
    "sidebar.friends": "Amigos",
    "sidebar.settings": "Configuración",
    "sidebar.logout": "Cerrar Sesión",
    "sidebar.navigation": "Navegación",
    "sidebar.application": "Aplicación",
    
    // Language Selector
    "language.english": "English",
    "language.spanish": "Español",
    "language.select": "Seleccionar Idioma",
  },
};

export function LanguageProvider({
  children,
  defaultLanguage = "en",
  storageKey = "lingez-language",
  ...props
}: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem(storageKey) as Language) || defaultLanguage
  );

  useEffect(() => {
    localStorage.setItem(storageKey, language);
    // Actualizar el atributo lang del documento
    document.documentElement.lang = language;
  }, [language, storageKey]);

  const t = (key: string): string => {
    const translationObj = translations[language] as Record<string, string>;
    return translationObj[key] || key;
  };

  const value = {
    language,
    setLanguage: (language: Language) => {
      localStorage.setItem(storageKey, language);
      setLanguage(language);
    },
    t,
  };

  return (
    <LanguageProviderContext.Provider {...props} value={value}>
      {children}
    </LanguageProviderContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageProviderContext);

  if (context === undefined)
    throw new Error("useLanguage must be used within a LanguageProvider");

  return context;
};