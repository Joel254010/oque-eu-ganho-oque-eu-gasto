import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveTransaction } from '../utils/storage';
import { INCOME_TYPES, EXPENSE_CATEGORIES } from '../types';

interface AddTransactionProps {
  type: 'income' | 'expense';
  onBack: () => void;
  onSave: () => void;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ type, onBack, onSave }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
  });
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = type === 'income' ? INCOME_TYPES : EXPENSE_CATEGORIES;
  const title = type === 'income' ? 'Adicionar Receita' : 'Adicionar Despesa';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.amount || !formData.category || !formData.date) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Digite um valor válido');
      return;
    }

    if (!user) return;

    const normalizedDate = `${formData.date}T12:00:00`;

    const ok = await saveTransaction({
      userId: user.id,
      type,
      amount,
      category: formData.category,
      date: normalizedDate,
    });

    if (!ok) {
      setError('Erro ao salvar transação');
      return;
    }

    await onSave();
    onBack();
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col p-6">
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="text-violet-500 hover:text-violet-400 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-violet-500 ml-4">{title}</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 max-w-md mx-auto w-full">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-500 p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Valor */}
          <div>
            <label className="block text-violet-500 mb-2 font-medium">
              Valor (R$)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              step="0.01"
              min="0"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-violet-500 focus:outline-none transition-colors"
              placeholder="0,00"
            />
          </div>

          {/* Categoria com barra de busca */}
          <div className="relative">
            <label className="block text-violet-500 mb-2 font-medium">
              {type === 'income' ? 'Tipo' : 'Categoria'}
            </label>
            <input
              type="text"
              value={searchTerm || formData.category}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar ou selecionar categoria..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-violet-500 focus:outline-none transition-colors"
              autoComplete="off"
            />
            {searchTerm && (
              <ul className="absolute z-10 w-full bg-gray-800 border border-gray-700 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                {categories
                  .filter((cat) =>
                    cat.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((cat) => (
                    <li
                      key={cat}
                      onClick={() => {
                        setFormData({ ...formData, category: cat });
                        setSearchTerm('');
                      }}
                      className="px-4 py-2 cursor-pointer hover:bg-violet-600 transition-colors"
                    >
                      {cat}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          {/* Data */}
          <div>
            <label className="block text-violet-500 mb-2 font-medium">
              Data
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-violet-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Botão Salvar */}
        <button
          type="submit"
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 px-6 rounded-lg mt-8 transition-colors duration-300 flex items-center justify-center"
        >
          <Save className="w-5 h-5 mr-2" />
          Salvar {type === 'income' ? 'Receita' : 'Despesa'}
        </button>
      </form>

      <footer className="text-center text-violet-500 mt-6">
        Mais um produto exclusivo da My GlobyX 🚀
      </footer>
    </div>
  );
};

export default AddTransaction;
