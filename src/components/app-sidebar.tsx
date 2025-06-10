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
import { useLanguage } from "@/contexts/language-provider";
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
import { LanguageToggle } from "./language-toggle";

export function AppSidebar() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Navigation items - Solo en desktop
  const navigationItems = [
    {
      title: t("sidebar.account"),
      action: () => navigate("/account"),
      icon: User,
    },
    {
      title: t("sidebar.play"),
      action: () => navigate("/lobby"),
      icon: LucideGamepad2,
    },
    {
      title: t("sidebar.environment"),
      action: () => navigate("/environment"),
      icon: MapPin,
    },
    {
      title: t("sidebar.messages"),
      action: () => navigate("/messages"),
      icon: MessageCircle,
    },
  ];

  // Menu items.
  const menuItems = [
    {
      title: t("sidebar.friends"),
      action: () => navigate("/friends"),
      icon: Users,
    },
    {
      title: t("sidebar.settings"),
      action: () => navigate("/settings"),
      icon: Settings,
    },
    {
      title: t("sidebar.logout"),
      action: handleLogout,
      icon: LogOut,
    },
  ];

  return (
    <Sidebar side="right">
      <SidebarContent>
        <SidebarGroup className="pt-10">
          <LevelProgress />

          {/* Navigation Section - Solo en desktop */}
          {!isMobile && (
            <>
              <SidebarGroupLabel>{t("sidebar.navigation")}</SidebarGroupLabel>
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
          <SidebarGroupLabel>{t("sidebar.application")}</SidebarGroupLabel>
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
