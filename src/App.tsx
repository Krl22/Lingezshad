// import 'react-beautiful-dnd/dist/react-beautiful-dnd.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Landing from "./pages/Landing";
import TopNavBar from "./components/TopNavBar";
import BottomNavBar from "./components/BottomNavBar";

import Learning from "./pages/Learning"; // Ahora será el componente para /home
import { Environment } from "./pages/Environment";
import { ThemeProvider } from "@/components/theme-provider";
import Account from "./pages/Account";
import Game from "./pages/Game";
import Lobby from "./pages/Lobby";
import Room from "./pages/Room";
import Search from "./pages/Search";
import { Friends } from "./pages/Friends";
import { Messages } from "./pages/Messages";
import { FriendChat } from "./pages/Friendchat";
import Restaurant from "./pages/locations/Restaurant";
import Scene from "./pages/locations/Restaurant/scene";
import Animals from "./pages/Topics/Animals/Animals";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
          <ConditionalTopNavBar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/home" element={<Learning />} />
              <Route path="/environment" element={<Environment />} />
              <Route path="/account" element={<Account />} />
              <Route path="/game/:roomId" element={<Game />} />
              <Route path="/lobby" element={<Lobby />} />
              <Route path="/room/:roomId" element={<Room />} />
              <Route path="/search-rooms" element={<Search />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/Messages" element={<Messages />} />
              <Route path="/friendchat" element={<FriendChat />} />
              <Route path="/Restaurant" element={<Restaurant />} />
              <Route path="/Restaurant/Scene" element={<Scene />} />
              <Route path="/topic/animals/exercises" element={<Animals />} />
            </Routes>
          </div>
          <ConditionalBottomNavBar />
        </div>
      </Router>
    </ThemeProvider>
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
  ];
  return !hiddenRoutes.includes(location.pathname) ? <TopNavBar /> : null;
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
  ];
  return !hiddenRoutes.includes(location.pathname) ? <BottomNavBar /> : null;
};

export default App;
