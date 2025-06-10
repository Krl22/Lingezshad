import { useState, useEffect } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/contexts/language-provider";
import { useAuth } from "@/contexts/auth-provider";
import { useNavigate } from "react-router-dom";
import { LoginDialog } from "@/components/LoginDialog";
import { RegisterDialog } from "@/components/RegisterDialog";

const Landing = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const { t } = useLanguage();
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Redirigir a home si el usuario ya está autenticado
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Solo mostrar el landing si el usuario NO está autenticado
  if (isAuthenticated) {
    return null; // No mostrar nada mientras se redirige
  }

  return (
    <div className="flex flex-col justify-center items-center p-4 w-screen min-h-screen bg-gradient-to-br transition-colors from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      {/* Toggle de modo oscuro y selector de idioma */}
      <div className="flex absolute top-4 right-4 z-10 items-center space-x-2 sm:top-6 sm:right-6">
        <LanguageToggle />
        <ModeToggle />
      </div>

      {/* Contenido centrado */}
      <div className="flex flex-col items-center pt-16 mx-auto max-w-4xl text-center sm:pt-8">
        <div className="mb-8">
          <h1 className="mb-6 h-24 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 sm:text-5xl md:text-6xl lg:text-7xl">
            {t("landing.title")}
          </h1>
          <p className="text-lg font-medium text-slate-600 dark:text-slate-300 sm:text-xl md:text-2xl lg:text-3xl">
            {t("landing.subtitle")}
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500 dark:text-slate-400 sm:text-lg">
            {t("landing.description")}
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-8 sm:flex-row sm:gap-6">
          <button
            onClick={() => setLoginOpen(true)}
            className="relative px-6 py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg transition-all duration-300 transform group hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 hover:scale-105 hover:shadow-xl sm:px-8 sm:py-4"
          >
            <span className="relative z-10">{t("landing.signin")}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
          </button>

          <button
            onClick={() => setRegisterOpen(true)}
            className="relative px-6 py-3 font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl shadow-lg transition-all duration-300 transform group hover:from-emerald-700 hover:to-emerald-800 dark:from-emerald-500 dark:to-emerald-600 dark:hover:from-emerald-600 dark:hover:to-emerald-700 hover:scale-105 hover:shadow-xl sm:px-8 sm:py-4"
          >
            <span className="relative z-10">{t("landing.getstarted")}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
          </button>
        </div>

        {/* Features section */}
        <div className="grid grid-cols-1 gap-6 mt-16 w-full max-w-4xl md:grid-cols-3">
          <div className="p-6 bg-white rounded-2xl border shadow-lg dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <div className="flex justify-center items-center mb-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <span className="text-2xl">🎮</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-200">
              {t("landing.features.games.title")}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {t("landing.features.games.description")}
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border shadow-lg dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <div className="flex justify-center items-center mb-4 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-200">
              {t("landing.features.conversations.title")}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {t("landing.features.conversations.description")}
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border shadow-lg dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <div className="flex justify-center items-center mb-4 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-200">
              {t("landing.features.personalized.title")}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {t("landing.features.personalized.description")}
            </p>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      <RegisterDialog open={registerOpen} onOpenChange={setRegisterOpen} />
    </div>
  );
};

export default Landing;
