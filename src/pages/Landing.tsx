import { useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { LoginDialog } from "@/components/LoginDialog";
import { RegisterDialog } from "@/components/RegisterDialog";

const Landing = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center p-4 w-screen min-h-screen bg-gradient-to-br transition-colors from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      {/* Toggle de modo oscuro - Ajustado para responsive */}
      <div className="absolute top-4 right-4 z-10 sm:top-6 sm:right-6">
        <ModeToggle />
      </div>

      {/* Contenido centrado - Ajustado padding superior para evitar superposición */}
      <div className="flex flex-col items-center mx-auto max-w-4xl text-center pt-16 sm:pt-8">
        <div className="mb-8">
          <h1 className="mb-6 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to Lingez
          </h1>
          <p className="text-lg font-medium text-slate-600 dark:text-slate-300 sm:text-xl md:text-2xl lg:text-3xl">
            Learn English easily and have fun!
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500 dark:text-slate-400 sm:text-lg">
            Join thousands of learners on an interactive journey to master
            English through games, conversations, and personalized lessons.
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-8 sm:flex-row sm:gap-6">
          <button
            onClick={() => setLoginOpen(true)}
            className="relative px-6 py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg transition-all duration-300 transform group hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 hover:scale-105 hover:shadow-xl sm:px-8 sm:py-4"
          >
            <span className="relative z-10">Sign In</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
          </button>

          <button
            onClick={() => setRegisterOpen(true)}
            className="relative px-6 py-3 font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl shadow-lg transition-all duration-300 transform group hover:from-emerald-700 hover:to-emerald-800 dark:from-emerald-500 dark:to-emerald-600 dark:hover:from-emerald-600 dark:hover:to-emerald-700 hover:scale-105 hover:shadow-xl sm:px-8 sm:py-4"
          >
            <span className="relative z-10">Get Started</span>
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
              Interactive Games
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Learn through fun and engaging games that make language learning
              enjoyable.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border shadow-lg dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <div className="flex justify-center items-center mb-4 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-200">
              Real Conversations
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Practice with AI and connect with other learners worldwide.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border shadow-lg dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <div className="flex justify-center items-center mb-4 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-200">
              Personalized Learning
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Adaptive lessons that adjust to your pace and learning style.
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
