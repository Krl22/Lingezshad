import { useLanguage } from "@/contexts/language-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings2, Palette, Globe, User, Shield } from "lucide-react";

export default function Settings() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <div className="container p-6 mx-auto mt-16 max-w-5xl">
        <div className="space-y-8">
          {/* Header con gradiente elegante */}
          <div className="text-center space-y-4 py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white mb-4">
              <Settings2 className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {t("settings.title")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("settings.description")}
            </p>
          </div>

          {/* Grid de configuraciones */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Appearance Settings */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Palette className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{t("settings.appearance.title")}</CardTitle>
                    <CardDescription className="text-sm">
                      {t("settings.appearance.description")}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme Toggle */}
                <div className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                  <div className="space-y-1">
                    <div className="font-medium flex items-center gap-2">
                      {t("settings.theme.title")}
                      <Badge variant="secondary" className="text-xs">Auto</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t("settings.theme.description")}
                    </div>
                  </div>
                  <ModeToggle />
                </div>

                {/* Language Toggle */}
                <div className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                  <div className="space-y-1">
                    <div className="font-medium flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      {t("settings.language.title")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t("settings.language.description")}
                    </div>
                  </div>
                  <LanguageToggle />
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{t("settings.account.title")}</CardTitle>
                    <CardDescription className="text-sm">
                      {t("settings.account.description")}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-6 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      {t("settings.account.comingSoon")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm md:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{t("settings.privacy.title")}</CardTitle>
                    <CardDescription className="text-sm">
                      {t("settings.privacy.description")}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-6 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      {t("settings.privacy.comingSoon")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer elegante */}
          <div className="text-center py-8">
            <Separator className="mb-6" />
            <p className="text-sm text-muted-foreground">
              Lingez Settings • Personaliza tu experiencia de aprendizaje
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
