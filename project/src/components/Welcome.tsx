import React from 'react';
import { Wallet } from 'lucide-react';

interface WelcomeProps {
  onNavigate: (page: 'login' | 'register') => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-md w-full">
        <div className="mb-8">
          <Wallet className="w-16 h-16 text-pink-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-pink-500 mb-2">
            O que eu ganho,
          </h1>
          <h1 className="text-3xl font-bold text-white">
            o que eu gasto!
          </h1>
          <p className="text-gray-400 mt-4">
            Controle suas finanças de forma simples e eficiente
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onNavigate('login')}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-300"
          >
            Entrar
          </button>
          
          <button
            onClick={() => onNavigate('register')}
            className="w-full bg-transparent border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white font-bold py-4 px-6 rounded-lg transition-colors duration-300"
          >
            Criar Conta
          </button>
        </div>
      </div>

      <footer className="absolute bottom-6 text-center text-pink-500">
        Mais um produto exclusivo da My GlobyX 🚀
      </footer>
    </div>
  );
};

export default Welcome;