import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Switch } from "@/components/ui/switch";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/50 dark:border-purple-700/50 backdrop-blur-sm transition-all duration-300">
      <div className="p-1.5 rounded-md bg-gradient-to-br from-yellow-400 to-orange-500 shadow-sm">
        <Sun className="h-3 w-3 text-white" />
      </div>
      
      <Switch
        checked={theme === "dark"}
        onCheckedChange={handleToggle}
        className="scale-75 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-blue-500 data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-600 transition-all duration-300"
      />
      
      <div className="p-1.5 rounded-md bg-gradient-to-br from-purple-500 to-blue-600 shadow-sm">
        <Moon className="h-3 w-3 text-white" />
      </div>
    </div>
  );
}
