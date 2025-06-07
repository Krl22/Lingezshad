import { Bell } from "lucide-react";
import { SidebarTrigger, SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { NavLink } from "react-router-dom";
import "./util.css";

const TopNavBar = () => {
  return (
    <div className="fixed top-0 z-30 px-4 py-2 w-full h-16 bg-gradient-to-r from-purple-400 to-indigo-600 shadow-md dark:from-sky-950 dark:to-sky-900">
      <div className="flex justify-between items-center">
        <NavLink to="/home">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            width="45"
            height="45"
          >
            <circle cx="50" cy="50" r="48" fill="#2b63a9" />
            <text
              x="50%"
              y="50%"
              text-anchor="middle"
              dy=".35em"
              font-family="Arial, sans-serif"
              font-size="60"
              fill="#eaeaea"
              font-weight="bold"
            >
              L
            </text>
          </svg>
        </NavLink>

        <div className="flex relative pr-2">
          <span className="inline-flex absolute left-0 z-10 justify-center items-center w-6 h-6 text-xs font-semibold text-white bg-red-500 rounded-full -translate-x-1/4 -translate-y-1/4">
            99+
          </span>
          <NavLink to="/notifications">
            <button
              className="relative p-2 bg-indigo-600 rounded-full transition-all duration-200 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-500"
              aria-label="Notifications"
            >
              <Bell className="w-7 h-7 text-white dark:text-gray-300" />
            </button>
          </NavLink>

          <div className="pt-2 ml-4 h-3">
            <SidebarProvider defaultOpen={false}>
              <SidebarTrigger />
              <AppSidebar />
            </SidebarProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavBar;
