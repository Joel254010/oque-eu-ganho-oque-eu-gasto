import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
  onNavigate: (page: 'welcome' | 'register') => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    try {
      // login agora retorna { success, user?, status? }
      const result = await login(formData.email, formData.password);

      if (!result.success) {
        if (result.status === 'pending') {
          setError('Sua conta ainda não foi aprovada. Aguarde a liberação.');
        } else {
          setError('E-mail ou senha incorretos');
        }
        return;
      }

      if (result.status !== 'approved') {
        setError('Sua conta ainda não foi aprovada. Aguarde a liberação.');
        return;
      }

      // ✅ Se chegou aqui, usuário aprovado
      // O AuthContext cuida de salvar sessão e redirecionar
    } catch (err) {
      console.error(err);
      setError('Erro inesperado. Tente novamente mais tarde.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col p-6">
      <div className="flex items-center mb-8">
        <button
          onClick={() => onNavigate('welcome')}
          className="text-brand hover:text-brand-dark transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-brand ml-4">Entrar</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 max-w-md mx-auto w-full">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-500 p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-brand mb-2 font-medium">
              <Mail className="w-4 h-4 inline mr-2" />
              E-mail
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-brand focus:outline-none transition-colors"
              placeholder="Digite seu e-mail"
            />
          </div>

          <div>
            <label className="block text-brand mb-2 font-medium">
              <Lock className="w-4 h-4 inline mr-2" />
              Senha
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-brand focus:outline-none transition-colors"
              placeholder="Digite sua senha"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-4 px-6 rounded-lg mt-8 transition-colors duration-300"
        >
          Entrar
        </button>

        <p className="text-center mt-6 text-gray-400">
          Não tem uma conta?{' '}
          <button
            type="button"
            onClick={() => onNavigate('register')}
            className="text-brand hover:text-brand-dark font-medium"
          >
            Criar conta
          </button>
        </p>
      </form>

      <footer className="text-center text-brand mt-6">
        Mais um produto exclusivo da My GlobyX 🚀
      </footer>
    </div>
  );
};

export default Login;
