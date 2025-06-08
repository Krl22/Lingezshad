import {
  LogOut,
  User,
  Users,
  Settings,
  MessageCircle,
  MapPin,
  LucideGamepad2,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "@/firebase/firebaseconfig";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LevelProgress } from "./level-progress";
import { ModeToggle } from "./mode-toggle";

export function AppSidebar() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirige al usuario a la página principal después de cerrar sesión.
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Navigation items - Solo en desktop
  const navigationItems = [
    {
      title: "Account",
      action: () => navigate("/account"),
      icon: User,
    },
    {
      title: "Play",
      action: () => navigate("/lobby"),
      icon: LucideGamepad2,
    },
    {
      title: "Environment",
      action: () => navigate("/environment"),
      icon: MapPin,
    },
    {
      title: "Messages",
      action: () => navigate("/messages"),
      icon: MessageCircle,
    },
  ];

  // Menu items.
  const menuItems = [
    {
      title: "Friends",
      action: () => navigate("/friends"),
      icon: Users,
    },
    {
      title: "Settings",
      action: () => navigate("/settings"),
      icon: Settings,
    },
    {
      title: "Logout",
      action: handleLogout,
      icon: LogOut,
    },
  ];

  return (
    <Sidebar side="right">
      <SidebarContent>
        <SidebarGroup className="pt-10">
          <LevelProgress />
          <div className="flex justify-center py-4">
            <ModeToggle />
          </div>

          {/* Navigation Section - Solo en desktop */}
          {!isMobile && (
            <>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild onClick={item.action}>
                        <button className="flex items-center space-x-2">
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </>
          )}

          {/* Application Section */}
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild onClick={item.action}>
                    <button className="flex items-center space-x-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
