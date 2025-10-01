import React from 'react';
import { Wallet } from 'lucide-react';

interface WelcomeProps {
  onNavigate: (page: 'login' | 'register') => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-md w-full">
        
        {/* Ícone em destaque */}
        <div className="mb-8 flex justify-center">
          <div className="bg-violet-600 p-6 rounded-2xl shadow-lg shadow-violet-500/30">
            <Wallet className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Headline estilo Nubank */}
        <h1 className="text-4xl font-extrabold text-violet-400 mb-2">
          O que eu ganho,
        </h1>
        <h1 className="text-4xl font-extrabold text-white mb-4">
          o que eu gasto!
        </h1>

        <p className="text-gray-400 text-lg leading-relaxed mb-8">
          Controle suas finanças de forma simples, moderna e eficiente.
        </p>

        {/* Botões */}
        <div className="space-y-4">
          <button
            onClick={() => onNavigate('login')}
            className="w-full bg-gradient-to-r from-violet-600 to-violet-800 hover:opacity-90 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-violet-500/30 transition duration-300"
          >
            Entrar
          </button>
          
          <button
            onClick={() => onNavigate('register')}
            className="w-full border-2 border-violet-600 text-violet-400 hover:bg-violet-600 hover:text-white font-bold py-4 px-6 rounded-xl transition duration-300"
          >
            Criar Conta
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-center text-violet-400">
        Mais um produto exclusivo da <span className="font-bold">My GlobyX 🚀</span>
      </footer>
    </div>
  );
};

export default Welcome;
