// src/utils/storage.ts
import { Transaction } from '../types';
import { supabase } from '../lib/supabase';

// 🔹 Buscar todas as transações do usuário
export const getTransactions = async (userId: string): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error("Erro ao buscar transações:", error.message);
    return [];
  }

  return data as Transaction[];
};

// 🔹 Buscar transações por intervalo de datas
export const getTransactionsByDate = async (
  userId: string,
  startDate: string,
  endDate: string
): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .gte('date', `${startDate}T00:00:00`)
    .lte('date', `${endDate}T23:59:59`)
    .order('date', { ascending: true });

  if (error) {
    console.error("Erro ao buscar transações por data:", error.message);
    return [];
  }

  return data as Transaction[];
};

// 🔹 Salvar uma nova transação
export const saveTransaction = async (
  transaction: Omit<Transaction, 'id' | 'createdAt'>
): Promise<boolean> => {
  const { error } = await supabase.from('transactions').insert([
    {
      user_id: transaction.userId,
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      date: transaction.date || new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("Erro ao salvar transação:", error.message);
    return false;
  }

  return true;
};

// 🔹 Deletar transação por ID
export const deleteTransaction = async (userId: string, id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('user_id', userId)
    .eq('id', id);

  if (error) {
    console.error("Erro ao deletar transação:", error.message);
    return false;
  }

  return true;
};

// 🔹 Atualizar transação
export const updateTransaction = async (userId: string, updated: Transaction): Promise<boolean> => {
  const { error } = await supabase
    .from('transactions')
    .update({
      type: updated.type,
      category: updated.category,
      amount: updated.amount,
      date: updated.date,
    })
    .eq('user_id', userId)
    .eq('id', updated.id);

  if (error) {
    console.error("Erro ao atualizar transação:", error.message);
    return false;
  }

  return true;
};

// 🔹 Calcular saldo
export const calculateBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((total, transaction) => {
    return transaction.type === 'income'
      ? total + transaction.amount
      : total - transaction.amount;
  }, 0);
};

// 🔹 Formatar moeda
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
