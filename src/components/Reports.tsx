import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Wallet,
  FileDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Transaction } from "../types";
import {
  calculateBalance,
  formatCurrency,
  getTransactionsByDate,
} from "../utils/storage";
import { useTranslation } from "react-i18next";

// PDF libs
// @ts-ignore
import jsPDF from "jspdf";
// @ts-ignore
import autoTable from "jspdf-autotable";

interface ReportsProps {
  onBack: () => void;
}

const Reports: React.FC<ReportsProps> = ({ onBack }) => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const start = startDate || "2000-01-01";
      const end = endDate || new Date().toISOString().split("T")[0];

      const data = await getTransactionsByDate(user.id, start, end);
      setTransactions(data);
    };
    fetchData();
  }, [user, startDate, endDate]);

  const totalIncome = transactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpenses = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const balance = calculateBalance(transactions);

  // Exportar CSV
  const handleExportCSV = () => {
    if (transactions.length === 0) return;

    const header = [t("date"), t("categoryLabel"), t("typeLabel"), t("value")];
    const rows = transactions.map((tx) => [
      new Date(tx.date).toLocaleDateString(),
      tx.category,
      tx.type === "income" ? t("income") : t("expense"),
      tx.amount.toFixed(2).replace(".", ","),
    ]);

    const csvContent = [header, ...rows].map((r) => r.join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

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

  // Exportar PDF
  const handleExportPDF = () => {
    if (transactions.length === 0) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${t("financialReport")} - My GlobyX`, 14, 20);

    doc.setFontSize(10);
    doc.text(
      `${t("period")}: ${startDate || t("start")} → ${endDate || t("end")}`,
      14,
      28
    );

    autoTable(doc, {
      startY: 35,
      head: [[t("date"), t("categoryLabel"), t("typeLabel"), t("value")]],
      body: transactions.map((tx) => [
        new Date(tx.date).toLocaleDateString(),
        tx.category,
        tx.type === "income" ? t("income") : t("expense"),
        formatCurrency(tx.amount),
      ]),
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text(
      `${t("income")}: ${formatCurrency(totalIncome)} | ${t("expense")}: ${formatCurrency(
        totalExpenses
      )} | ${t("finalBalance")}: ${formatCurrency(balance)}`,
      14,
      finalY
    );

    doc.save(`relatorio-${startDate || "inicio"}-a-${endDate || "fim"}.pdf`);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Cabeçalho */}
      <div className="flex items-center p-6 border-b border-gray-800">
        <button
          onClick={onBack}
          className="text-brand hover:text-brand-dark transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-brand ml-4">{t("reports")}</h1>
      </div>

      {/* Filtros */}
      <div className="px-6 mt-4 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
        />
        <button
          onClick={handleExportCSV}
          className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-4 py-2 rounded-lg flex items-center justify-center"
        >
          <FileDown className="w-5 h-5 mr-2" />
          {t("exportCSV")}
        </button>
        <button
          onClick={handleExportPDF}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg flex items-center justify-center"
        >
          <FileDown className="w-5 h-5 mr-2" />
          {t("exportPDF")}
        </button>
      </div>

      {/* Cards de resumo */}
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-500/20 border border-green-500 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-500 text-sm font-medium">{t("income")}</p>
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
                <p className="text-white text-sm font-medium">{t("expense")}</p>
                <p className="text-white text-xl font-bold">
                  {formatCurrency(totalExpenses)}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div
            className={`${
              balance >= 0 ? "bg-green-500" : "bg-red-500"
            } rounded-lg p-4`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">{t("finalBalance")}</p>
                <p className="text-white text-xl font-bold">
                  {formatCurrency(balance)}
                </p>
              </div>
              <Wallet className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Histórico */}
      <div className="flex-1 px-6">
        <h2 className="text-lg font-semibold text-brand mb-4">
          {t("transactionHistory")}
        </h2>

        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Wallet className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{t("noTransactions")}</p>
          </div>
        ) : (
          <div className="space-y-3 pb-6">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-gray-900 rounded-lg p-4 flex justify-between items-center"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-white font-medium">{tx.category}</p>
                    <p
                      className={`font-bold text-lg ${
                        tx.type === "income" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </p>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    {new Date(tx.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="text-center text-brand p-6">
        {t("footerText")} <span className="font-bold">My GlobyX 🚀</span>
      </footer>
    </div>
  );
};

export default Reports;
