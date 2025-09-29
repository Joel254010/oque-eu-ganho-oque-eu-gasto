import React, { useMemo } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Transaction } from '../types';
import { calculateBalance, formatCurrency } from '../utils/storage';

interface ReportsProps {
  transactions: Transaction[];
  onBack: () => void;
}

const Reports: React.FC<ReportsProps> = ({ transactions, onBack }) => {
  const { totalIncome, totalExpenses, balance, groupedTransactions } = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income');
    const expenses = transactions.filter(t => t.type === 'expense');
    
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const balance = calculateBalance(transactions);

    const sorted = [...transactions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return {
      totalIncome,
      totalExpenses,
      balance,
      groupedTransactions: sorted
    };
  }, [transactions]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex items-center p-6 border-b border-gray-800">
        <button
          onClick={onBack}
          className="text-pink-500 hover:text-pink-400 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-pink-500 ml-4">Relatórios</h1>
      </div>

      {/* Summary Cards */}
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-500/20 border border-green-500 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-500 text-sm font-medium">Receitas</p>
                <p className="text-green-500 text-xl font-bold">
                  {formatCurrency(totalIncome)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Despesas</p>
                <p className="text-white text-xl font-bold">
                  {formatCurrency(totalExpenses)}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className={`${
            balance >= 0 ? 'bg-green-500' : 'bg-red-500'
          } rounded-lg p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Saldo Final</p>
                <p className="text-white text-xl font-bold">
                  {formatCurrency(balance)}
                </p>
              </div>
              <Wallet className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="flex-1 px-6">
        <h2 className="text-lg font-semibold text-pink-500 mb-4">Histórico de Transações</h2>
        
        {groupedTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Wallet className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Nenhuma transação encontrada</p>
          </div>
        ) : (
          <div className="space-y-3 pb-6">
            {groupedTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-gray-900 rounded-lg p-4 flex justify-between items-center"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-white font-medium">{transaction.category}</p>
                    <p
                      className={`font-bold text-lg ${
                        transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    {new Date(transaction.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="text-center text-pink-500 p-6">
        Mais um produto exclusivo da My GlobyX 🚀
      </footer>
    </div>
  );
};

export default Reports;