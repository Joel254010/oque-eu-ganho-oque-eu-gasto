import { Transaction } from '../types';

export const getTransactions = (userId: string): Transaction[] => {
  const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
  return transactions.filter((t: Transaction) => t.userId === userId);
};

export const saveTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>): void => {
  const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
  
  const newTransaction: Transaction = {
    ...transaction,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };

  transactions.push(newTransaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));
};

export const calculateBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((total, transaction) => {
    return transaction.type === 'income' 
      ? total + transaction.amount 
      : total - transaction.amount;
  }, 0);
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};