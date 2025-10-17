import React from "react";
import { Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";

interface WelcomeProps {
  onNavigate: (page: "login" | "register") => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-b from-black via-gray-900 to-black text-white relative overflow-hidden">
      {/* Container principal */}
      <div className="flex flex-col items-center justify-center text-center max-w-md w-full px-6 py-10 bg-transparent rounded-3xl">
        {/* Ícone */}
        <div className="mb-8 flex justify-center animate-fade-in">
          <div className="bg-violet-600 p-6 rounded-2xl shadow-lg shadow-violet-500/40">
            <Wallet className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-4xl font-extrabold text-violet-400 mb-1 drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]">
          {t("welcomeTitle1")}
        </h1>
        <h1 className="text-4xl font-extrabold text-white mb-6 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
          {t("welcomeTitle2")}
        </h1>

        {/* Subtítulo */}
        <p className="text-gray-400 text-lg leading-relaxed mb-10">
          {t("welcomeSubtitle")}
        </p>

        {/* Botões */}
        <div className="space-y-4 w-full">
          <button
            onClick={() => onNavigate("login")}
            className="w-full bg-gradient-to-r from-violet-600 to-violet-800 hover:from-violet-500 hover:to-violet-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-violet-500/30 transition duration-300"
          >
            {t("login")}
          </button>

          <button
            onClick={() => onNavigate("register")}
            className="w-full border-2 border-violet-600 text-violet-400 hover:bg-violet-600 hover:text-white font-bold py-4 px-6 rounded-xl transition duration-300"
          >
            {t("createAccount")}
          </button>
        </div>
      </div>

      {/* Rodapé fixo ajustado */}
      <footer className="w-full text-center text-violet-400 mt-16 pb-6">
        <p className="text-sm sm:text-base">
          {t("footerText")}{" "}
          <span className="font-bold text-violet-300">My GlobyX 🚀</span>
        </p>
      </footer>
    </div>
  );
};

export default Welcome;
