import { LogOut, User, Users, Settings } from "lucide-react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "@/firebase/firebaseconfig";
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirige al usuario a la página principal después de cerrar sesión.
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Menu items.
  const items = [
    {
      title: "Account",
      action: () => navigate("/Account"), // Usar una función de flecha para navegar.
      icon: User,
    },
    {
      title: "Friends",
      action: () => navigate("/Friends"), // Usar una función de flecha para navegar.
      icon: Users,
    },
    {
      title: "Settings",
      action: () => navigate("/Settings"), // Usar una función de flecha para navegar.
      icon: Settings,
    },
    {
      title: "Logout",
      action: handleLogout, // Pasar la referencia a la función.
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
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    onClick={item.action} // Ejecutar la acción al hacer clic.
                  >
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
