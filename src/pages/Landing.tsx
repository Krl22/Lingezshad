import { NavLink } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";

const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen p-4 transition-colors bg-gray-100 dark:bg-[#0D1117]">
      {/* Toggle de modo oscuro en la parte superior */}
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      {/* Contenido centrado */}
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
          Welcome to Lingez
        </h1>
        <p className="mt-4 text-center text-gray-700 dark:text-gray-400 sm:text-lg lg:text-xl">
          Learn English easily and have fun!
        </p>

        <div className="flex flex-col mt-8 space-y-4 text-center sm:flex-row sm:space-y-0 sm:space-x-8">
          <NavLink to="/login">
            <button className="px-6 py-3 font-semibold text-white transition-transform transform bg-blue-500 rounded shadow-md hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500 dark:shadow-blue-800 hover:scale-105">
              Login
            </button>
          </NavLink>
          <NavLink to="/register">
            <button className="px-6 py-3 font-semibold text-white transition-transform transform bg-green-500 rounded shadow-md hover:bg-green-600 dark:bg-green-400 dark:hover:bg-green-500 dark:shadow-green-800 hover:scale-105">
              Register
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Landing;
