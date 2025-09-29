import React, { useState, useEffect } from 'react';
import { LogOut, Plus, TrendingUp, TrendingDown, BarChart3, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Transaction } from '../types';
import { getTransactions, calculateBalance, formatCurrency, deleteTransaction, updateTransaction } from '../utils/storage';
import AddTransaction from './AddTransaction';
import Reports from './Reports';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'add-income' | 'add-expense' | 'reports'>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [newAmount, setNewAmount] = useState<string>("");

  useEffect(() => {
    if (user) {
      const userTransactions = getTransactions(user.id);
      setTransactions(userTransactions);
      setBalance(calculateBalance(userTransactions));
    }
  }, [user]);

  const refreshTransactions = () => {
    if (user) {
      const userTransactions = getTransactions(user.id);
      setTransactions(userTransactions);
      setBalance(calculateBalance(userTransactions));
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja apagar esta transação?")) {
      deleteTransaction(user!.id, id);
      refreshTransactions();
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setNewAmount(transaction.amount.toString());
  };

  const handleSaveEdit = () => {
    if (editingTransaction && newAmount) {
      updateTransaction(user!.id, {
        ...editingTransaction,
        amount: parseFloat(newAmount),
      });
      refreshTransactions();
      setEditingTransaction(null);
      setNewAmount("");
    }
  };

  if (currentView === 'add-income') {
    return (
      <AddTransaction
        type="income"
        onBack={() => setCurrentView('dashboard')}
        onSave={refreshTransactions}
      />
    );
  }

  if (currentView === 'add-expense') {
    return (
      <AddTransaction
        type="expense"
        onBack={() => setCurrentView('dashboard')}
        onSave={refreshTransactions}
      />
    );
  }

  if (currentView === 'reports') {
    return (
      <Reports
        transactions={transactions}
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-800">
        <div>
          <h1 className="text-xl font-bold text-brand">Olá, {user?.name}!</h1>
          <p className="text-gray-400 text-sm">Seu controle financeiro</p>
        </div>
        <button
          onClick={logout}
          className="text-gray-400 hover:text-white transition-colors p-2"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </div>

      {/* Balance Card */}
      <div className="p-6">
        <div className="bg-brand rounded-2xl p-6 text-center">
          <p className="text-white/80 text-sm uppercase tracking-wide mb-2">
            Saldo Atual
          </p>
          <p className="text-white text-3xl font-bold">
            {formatCurrency(balance)}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 space-y-4">
        <button
          onClick={() => setCurrentView('add-income')}
          className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-4 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
        >
          <TrendingUp className="w-5 h-5 mr-2" />
          Adicionar Receita
        </button>

        <button
          onClick={() => setCurrentView('add-expense')}
          className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-4 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
        >
          <TrendingDown className="w-5 h-5 mr-2" />
          Adicionar Despesa
        </button>

        <button
          onClick={() => setCurrentView('reports')}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
        >
          <BarChart3 className="w-5 h-5 mr-2" />
          Ver Relatórios
        </button>
      </div>

      {/* Recent Transactions */}
      <div className="p-6">
        <h2 className="text-lg font-semibold text-brand mb-4">Últimas Transações</h2>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Plus className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Nenhuma transação encontrada</p>
            <p className="text-sm">Comece adicionando uma receita ou despesa</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.slice(-5).reverse().map((transaction) => (
              <div
                key={transaction.id}
                className="bg-gray-900 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="text-white font-medium">{transaction.category}</p>
                  <p className="text-gray-400 text-sm">
                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <p
                    className={`font-bold ${
                      transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                  <button onClick={() => handleEdit(transaction)} className="text-blue-400 hover:text-blue-600">
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(transaction.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 text-black">
            <h2 className="text-xl font-bold mb-4">Editar Transação</h2>
            <input
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              className="w-full border p-2 mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditingTransaction(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-brand text-white rounded"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="text-center text-brand p-6">
        Mais um produto exclusivo da My GlobyX 🚀
      </footer>
    </div>
  );
};

export default Dashboard;
