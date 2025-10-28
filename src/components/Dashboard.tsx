// src/components/Dashboard.tsx
import React, { useState, useEffect } from "react";
import {
  LogOut,
  Plus,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Transaction } from "../types";
import {
  getTransactions,
  calculateBalance,
  formatCurrency, // mantém para o saldo (BRL, como já era)
  deleteTransaction,
  updateTransaction,
} from "../utils/storage";
import AddTransaction from "./AddTransaction";
import Reports from "./Reports";
import { useTranslation } from "react-i18next";

/** Tipagem local para permitir description/currency opcionais sem quebrar o projeto */
type TxWithExtras = Transaction & {
  description?: string;
  currency?: string;
};

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();

  const [currentView, setCurrentView] = useState<
    "dashboard" | "add-income" | "add-expense" | "reports"
  >("dashboard");
  const [transactions, setTransactions] = useState<TxWithExtras[]>([]);
  const [balance, setBalance] = useState(0);
  const [editingTransaction, setEditingTransaction] =
    useState<TxWithExtras | null>(null);
  const [newAmount, setNewAmount] = useState<string>("");
  const [showBalance, setShowBalance] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      refreshTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const refreshTransactions = async () => {
    if (!user) return;
    const userTransactions = (await getTransactions(user.id)) as TxWithExtras[];
    const sortedTransactions = userTransactions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setTransactions(sortedTransactions);
    setBalance(calculateBalance(userTransactions));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t("confirmDelete"))) {
      const ok = await deleteTransaction(user!.id, id);
      if (ok) await refreshTransactions();
    }
  };

  const handleEdit = (transaction: TxWithExtras) => {
    setEditingTransaction(transaction);
    setNewAmount(transaction.amount.toString());
  };

  const handleSaveEdit = async () => {
    if (editingTransaction && newAmount) {
      const ok = await updateTransaction(user!.id, {
        ...editingTransaction,
        amount: parseFloat(newAmount),
      } as Transaction);
      if (ok) await refreshTransactions();
      setEditingTransaction(null);
      setNewAmount("");
    }
  };

  /** Formatação por moeda/idioma para os itens (mantém saldo como antes em BRL) */
  const localeMap: Record<string, string> = {
    "pt-BR": "pt-BR",
    pt: "pt-BR",
    en: "en-US",
    "en-US": "en-US",
    es: "es-ES",
    "es-ES": "es-ES",
    fr: "fr-FR",
    "fr-FR": "fr-FR",
  };
  const currentLocale = localeMap[i18n.language] || "pt-BR";
  const formatByTxCurrency = (value: number, currency?: string) =>
    new Intl.NumberFormat(currentLocale, {
      style: "currency",
      currency: currency || "BRL",
    }).format(value);

  if (currentView === "add-income") {
    return (
      <AddTransaction
        type="income"
        onBack={() => setCurrentView("dashboard")}
        onSave={refreshTransactions}
      />
    );
  }

  if (currentView === "add-expense") {
    return (
      <AddTransaction
        type="expense"
        onBack={() => setCurrentView("dashboard")}
        onSave={refreshTransactions}
      />
    );
  }

  if (currentView === "reports") {
    return <Reports onBack={() => setCurrentView("dashboard")} />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-800">
        <div>
          <h1 className="text-xl font-bold text-brand">
            {t("hello")}, {user?.name || user?.email || t("guest")}!
          </h1>
          <p className="text-gray-400 text-sm">{t("yourFinanceControl")}</p>
        </div>
        <button
          onClick={logout}
          className="text-gray-400 hover:text-white transition-colors p-2"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </div>

      {/* Balance */}
      <div className="p-6">
        <div className="bg-brand rounded-2xl p-6 text-center relative">
          <p className="text-white/80 text-sm uppercase tracking-wide mb-2">
            {t("currentBalance")}
          </p>
          <p className="text-white text-3xl font-bold">
            {showBalance ? formatCurrency(balance) : "********"}
          </p>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="absolute top-4 right-4 text-white/70 hover:text-white"
            aria-label="Toggle saldo"
          >
            {showBalance ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="px-6 space-y-4">
        <button
          onClick={() => setCurrentView("add-income")}
          className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-4 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
        >
          <TrendingUp className="w-5 h-5 mr-2" /> {t("addIncome")}
        </button>
        <button
          onClick={() => setCurrentView("add-expense")}
          className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-4 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
        >
          <TrendingDown className="w-5 h-5 mr-2" /> {t("addExpense")}
        </button>
        <button
          onClick={() => setCurrentView("reports")}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
        >
          <BarChart3 className="w-5 h-5 mr-2" /> {t("viewReports")}
        </button>
      </div>

      {/* Transactions list */}
      <div className="p-6">
        <h2 className="text-lg font-semibold text-brand mb-4">
          {t("recentTransactions")}
        </h2>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Plus className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{t("noTransactions")}</p>
            <p className="text-sm">{t("addFirstTransaction")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 5).map((tx) => (
              <div
                key={tx.id}
                className="bg-gray-900 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  {/* Categoria */}
                  <p className="text-white font-medium">{tx.category}</p>

                  {/* ✅ Observação (se houver) */}
                  {tx.description && (
                    <p className="text-gray-400 text-sm mt-1">
                      {tx.description}
                    </p>
                  )}

                  {/* Data */}
                  <p className="text-gray-500 text-xs mt-1">
                    {new Date(tx.date).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <p
                    className={`font-bold ${
                      tx.type === "income" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {tx.type === "income" ? "+ " : "- "}
                    {formatByTxCurrency(tx.amount, tx.currency)}
                  </p>

                  <button
                    onClick={() => handleEdit(tx)}
                    className="text-blue-400 hover:text-blue-600"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(tx.id)}
                    className="text-red-400 hover:text-red-600"
                  >
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
            <h2 className="text-xl font-bold mb-4">
              {t("editTransaction")}
            </h2>
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
                {t("cancel")}
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-brand text-white rounded"
              >
                {t("save")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-brand p-6">
        {t("footerText")} <span className="font-bold">My GlobyX 🚀</span>
      </footer>
    </div>
  );
};

export default Dashboard;
