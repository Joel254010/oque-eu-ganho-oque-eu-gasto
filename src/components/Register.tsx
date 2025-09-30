// src/pages/Register.tsx
import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface RegisterProps {
  onNavigate: (page: 'welcome' | 'login') => void;
}

const Register: React.FC<RegisterProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    // 🔹 Inclui também o nome no cadastro
    const result = await register(formData.email, formData.password, formData.name);

    if (result.success) {
      alert('Conta criada com sucesso! Agora você já pode fazer login.');
      onNavigate('login');
    } else {
      setError(result.error || 'Este e-mail já está cadastrado');
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
        <h1 className="text-2xl font-bold text-brand ml-4">Criar Conta</h1>
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
              <User className="w-4 h-4 inline mr-2" />
              Nome
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-brand focus:outline-none transition-colors"
              placeholder="Digite seu nome"
            />
          </div>

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

          <div>
            <label className="block text-brand mb-2 font-medium">
              <Lock className="w-4 h-4 inline mr-2" />
              Confirmar Senha
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-brand focus:outline-none transition-colors"
              placeholder="Confirme sua senha"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-4 px-6 rounded-lg mt-8 transition-colors duration-300"
        >
          Criar Conta
        </button>

        <p className="text-center mt-6 text-gray-400">
          Já tem uma conta?{' '}
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="text-brand hover:text-brand-dark font-medium"
          >
            Fazer login
          </button>
        </p>
      </form>

      <footer className="text-center text-brand mt-6">
        Mais um produto exclusivo da My GlobyX 🚀
      </footer>
    </div>
  );
};

export default Register;
