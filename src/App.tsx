import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Landing from "./pages/Landing";
import TopNavBar from "./components/TopNavBar";
import BottomNavBar from "./components/BottomNavBar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Actions from "./pages/Topics/Actions/Actions";
import FiveSenses from "./pages/Topics/FiveSenses/FiveSenses";
import Learning from "./pages/Learning";
import { Environment } from "./pages/Environment";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/language-provider";
import { AuthProvider } from "@/contexts/auth-provider";
import Account from "./pages/Account";
import Game from "./pages/Game";
import Lobby from "./pages/Lobby";
import Room from "./pages/Room";
import Search from "./pages/Search";
import { Friends } from "./pages/Friends";
import { Messages } from "./pages/Messages";
import Restaurant from "./pages/locations/Restaurant";
import Scene from "./pages/locations/Restaurant/scene";
import Animals from "./pages/Topics/Animals/Animals";
import Settings from "./pages/Settings";
import Body from "./pages/Topics/Body/Body";
import { useEffect } from "react";
import { startRoomCleanupScheduler } from "@/firebase/roomCleanupService";

function App() {
  // Inicializar el servicio de limpieza al cargar la app
  useEffect(() => {
    startRoomCleanupScheduler();
  }, []);
  return (
    <AuthProvider>
      <LanguageProvider defaultLanguage="en" storageKey="lingez-language">
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Router>
            <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
              <ConditionalTopNavBar />
              <div className="flex-grow">
                <Routes>
                  {/* Ruta pública - Landing page */}
                  <Route path="/" element={<Landing />} />
                  {/* Todas las demás rutas están protegidas */}
                  <Route
                    path="/home"
                    element={
                      <ProtectedRoute>
                        <Learning />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/environment"
                    element={
                      <ProtectedRoute>
                        <Environment />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/account"
                    element={
                      <ProtectedRoute>
                        <Account />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/game/:roomId"
                    element={
                      <ProtectedRoute>
                        <Game />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/lobby"
                    element={
                      <ProtectedRoute>
                        <Lobby />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/room/:roomId"
                    element={
                      <ProtectedRoute>
                        <Room />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/search-rooms"
                    element={
                      <ProtectedRoute>
                        <Search />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/friends"
                    element={
                      <ProtectedRoute>
                        <Friends />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/Messages"
                    element={
                      <ProtectedRoute>
                        <Messages />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/Restaurant"
                    element={
                      <ProtectedRoute>
                        <Restaurant />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/Restaurant/Scene"
                    element={
                      <ProtectedRoute>
                        <Scene />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/topic/animals/exercises"
                    element={
                      <ProtectedRoute>
                        <Animals />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  // Agregar esta ruta dentro de las Routes:
                  <Route
                    path="/topic/actions/exercises"
                    element={
                      <ProtectedRoute>
                        <Actions />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/topic/fivesenses/exercises"
                    element={
                      <ProtectedRoute>
                        <FiveSenses />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/topic/body/exercises"
                    element={
                      <ProtectedRoute>
                        <Body />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </div>
              <ConditionalBottomNavBar />
            </div>
          </Router>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

const ConditionalTopNavBar = () => {
  const location = useLocation();
  const hiddenRoutes = [
    "/",
    "/login",
    "/register",
    "/aichat",
    "/avatar",
    "/game",
    "/chatgptclone",
    "/messages",
    "/friendchat",
    "/search-rooms",
    "/lobby",
  ];
  
  const isHidden = hiddenRoutes.includes(location.pathname) || location.pathname.startsWith('/room/');
  return !isHidden ? <TopNavBar /> : null;
};

const ConditionalBottomNavBar = () => {
  const location = useLocation();
  const hiddenRoutes = [
    "/",
    "/login",
    "/register",
    "/game",
    "/aichat",
    "/chatgptclone",
    "/messages",
    "/friendchat",
    "/search-rooms",
    "/lobby",
  ];
  
  const isHidden = hiddenRoutes.includes(location.pathname) || location.pathname.startsWith('/room/');
  return !isHidden ? <BottomNavBar /> : null;
};

export default App;
