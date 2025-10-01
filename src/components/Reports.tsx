import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Wallet, FileDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Transaction } from '../types';
import { calculateBalance, formatCurrency, getTransactionsByDate } from '../utils/storage';

// PDF libs (forçando ignorar TS)
// @ts-ignore
import jsPDF from "jspdf";
// @ts-ignore
import autoTable from "jspdf-autotable";

interface ReportsProps {
  onBack: () => void;
}

const Reports: React.FC<ReportsProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // 🔹 Buscar transações (com ou sem filtro de datas)
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const start = startDate || "2000-01-01"; // fallback: início remoto
      const end = endDate || new Date().toISOString().split("T")[0]; // fallback: hoje

      const data = await getTransactionsByDate(user.id, start, end);
      setTransactions(data);
    };
    fetchData();
  }, [user, startDate, endDate]);

  // 🔹 Cálculos
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = calculateBalance(transactions);

  // 🔹 Exporta CSV
  const handleExportCSV = () => {
    if (transactions.length === 0) return;

    const header = ["Data", "Categoria", "Tipo", "Valor"];
    const rows = transactions.map(t => [
      new Date(t.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }),
      t.category,
      t.type === "income" ? "Receita" : "Despesa",
      t.amount.toFixed(2).replace(".", ",")
    ]);

    const csvContent = [header, ...rows]
      .map(e => e.join(";"))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute(
      "download",
      `relatorio-${startDate || "inicio"}-a-${endDate || "fim"}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 🔹 Exporta PDF
  const handleExportPDF = () => {
    if (transactions.length === 0) return;

    const doc = new jsPDF();

    // Título
    doc.setFontSize(16);
    doc.text("Relatório Financeiro - My GlobyX", 14, 20);

    // Período
    doc.setFontSize(10);
    doc.text(
      `Período: ${startDate || "início"} até ${endDate || "fim"}`,
      14,
      28
    );

    // Tabela
    autoTable(doc, {
      startY: 35,
      head: [["Data", "Categoria", "Tipo", "Valor"]],
      body: transactions.map((t) => [
        new Date(t.date).toLocaleDateString("pt-BR"),
        t.category,
        t.type === "income" ? "Receita" : "Despesa",
        formatCurrency(t.amount),
      ]),
    });

    // Totais (usando cast para ignorar TS)
    doc.text(
      `Receitas: ${formatCurrency(totalIncome)} | Despesas: ${formatCurrency(totalExpenses)} | Saldo: ${formatCurrency(balance)}`,
      14,
      (doc as any).lastAutoTable.finalY + 10
    );

    // Baixar
    doc.save(`relatorio-${startDate || "inicio"}-a-${endDate || "fim"}.pdf`);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex items-center p-6 border-b border-gray-800">
        <button
          onClick={onBack}
          className="text-brand hover:text-brand-dark transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-brand ml-4">Relatórios</h1>
      </div>

      {/* Filtros */}
      <div className="px-6 mt-4 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
        />
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
        />
        <button
          onClick={handleExportCSV}
          className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-4 py-2 rounded-lg flex items-center justify-center"
        >
          <FileDown className="w-5 h-5 mr-2" />
          Exportar CSV
        </button>
        <button
          onClick={handleExportPDF}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg flex items-center justify-center"
        >
          <FileDown className="w-5 h-5 mr-2" />
          Exportar PDF
        </button>
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

          <div className={`${balance >= 0 ? 'bg-green-500' : 'bg-red-500'} rounded-lg p-4`}>
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
        <h2 className="text-lg font-semibold text-brand mb-4">Histórico de Transações</h2>
        
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Wallet className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Nenhuma transação encontrada</p>
          </div>
        ) : (
          <div className="space-y-3 pb-6">
            {transactions.map((transaction) => (
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
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
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

      <footer className="text-center text-brand p-6">
        Mais um produto exclusivo da My GlobyX 🚀
      </footer>
    </div>
  );
};

export default Reports;
