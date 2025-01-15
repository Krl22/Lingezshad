import { NavLink } from "react-router-dom";
import { Home, Book, Globe, MessageCircle, LucideGamepad2 } from "lucide-react";

const BottomNavBar = () => {
  return (
    <div className="fixed bottom-0 z-10 w-full p-4 shadow-lg bg-gradient-to-r from-purple-400 to-indigo-600 dark:from-sky-950 dark:to-sky-900">
      <div className="flex items-center justify-around">
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
          to="/learning"
          className={({ isActive }) =>
            `flex flex-col items-center transition-transform duration-300 ease-in-out transform hover:scale-110 ${
              isActive ? "text-gray-100" : "text-gray-200"
            }`
          }
        >
          <Book className="w-6 h-6" />
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
      </div>
    </div>
  );
};

export default BottomNavBar;
