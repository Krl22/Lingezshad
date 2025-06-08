import { SidebarTrigger, SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { NavLink } from "react-router-dom";
import "./util.css";

const TopNavBar = () => {
  return (
    <div className="fixed top-0 z-30 w-full h-16 bg-gradient-to-r from-purple-400 to-indigo-600 shadow-lg backdrop-blur-sm dark:from-sky-950 dark:to-sky-900">
      <div className="flex justify-between items-center px-4 py-2 h-full">
        {/* Logo Section */}
        <NavLink to="/home" className="group">
          <div className="relative">
            {/* Glow effect behind logo */}
            <div className="absolute inset-0 rounded-full opacity-0 blur-md transition-opacity duration-300 scale-110 bg-white/10 group-hover:opacity-100"></div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              width="45"
              height="45"
              className="relative z-10 transition-transform duration-200 transform group-hover:scale-105"
            >
              {/* Gradient background for the circle */}
              <defs>
                <linearGradient
                  id="logoGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1e40af" />
                </linearGradient>
                <filter
                  id="shadow"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feDropShadow
                    dx="0"
                    dy="2"
                    stdDeviation="3"
                    floodColor="rgba(0,0,0,0.3)"
                  />
                </filter>
              </defs>

              <circle
                cx="50"
                cy="50"
                r="48"
                fill="url(#logoGradient)"
                filter="url(#shadow)"
                className="transition-all duration-200 group-hover:r-49"
              />

              {/* Inner highlight circle */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
              />

              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dy=".35em"
                fontFamily="Arial, sans-serif"
                fontSize="60"
                fill="#eaeaea"
                fontWeight="bold"
                className="drop-shadow-sm"
              >
                L
              </text>
            </svg>
          </div>
        </NavLink>

        <div className="flex items-center space-x-3">
          {/* Sidebar */}
          <div className="h-6">
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
