import { NavLink } from "react-router-dom";
import { Home, Globe, MessageCircle, LucideGamepad2, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const BottomNavBar = () => {
  const isMobile = useIsMobile();

  // Solo mostrar en mobile
  if (!isMobile) {
    return null;
  }

  return (
    <div className="fixed bottom-0 z-10 p-4 w-full bg-gradient-to-r from-purple-400 to-indigo-600 shadow-lg dark:from-sky-950 dark:to-sky-900">
      <div className="flex justify-around items-center">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `flex flex-col items-center transition-transform duration-300 ease-in-out transform hover:scale-110 ${
              isActive ? "text-gray-100" : "text-gray-200"
            }`
          }
        >
          <Home className="w-6 h-6" />
        </NavLink>

        <NavLink
          to="/lobby"
          className={({ isActive }) =>
            `flex flex-col items-center transition-transform duration-300 ease-in-out transform hover:scale-110 ${
              isActive ? "text-gray-100" : "text-gray-200"
            }`
          }
        >
          <LucideGamepad2 className="w-6 h-6" />
        </NavLink>

        <NavLink
          to="/messages"
          className={({ isActive }) =>
            `flex flex-col items-center transition-transform duration-300 ease-in-out transform hover:scale-110 ${
              isActive ? "text-gray-100" : "text-gray-200"
            }`
          }
        >
          <MessageCircle className="w-6 h-6" />
        </NavLink>
        <NavLink
          to="/environment"
          className={({ isActive }) =>
            `flex flex-col items-center transition-transform duration-300 ease-in-out transform hover:scale-110 ${
              isActive ? "text-gray-100" : "text-gray-200"
            }`
          }
        >
          <Globe className="w-6 h-6" />
        </NavLink>
        <NavLink
          to="/account"
          className={({ isActive }) =>
            `flex flex-col items-center transition-transform duration-300 ease-in-out transform hover:scale-110 ${
              isActive ? "text-gray-100" : "text-gray-200"
            }`
          }
        >
          <User className="w-6 h-6" />
        </NavLink>
      </div>
    </div>
  );
};

export default BottomNavBar;
