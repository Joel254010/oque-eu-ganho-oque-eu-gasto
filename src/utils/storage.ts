import { Transaction } from '../types';

export const getTransactions = (userId: string): Transaction[] => {
  const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
  return transactions.filter((t: Transaction) => t.userId === userId);
};

export const saveTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>): void => {
  const transactions: Transaction[] = JSON.parse(localStorage.getItem('transactions') || '[]');
  
  const newTransaction: Transaction = {
    ...transaction,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };

  transactions.push(newTransaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));
};

export const deleteTransaction = (userId: string, id: string): void => {
  let transactions: Transaction[] = JSON.parse(localStorage.getItem('transactions') || '[]');
  // mantém apenas as que NÃO têm o id informado
  transactions = transactions.filter((t) => !(t.userId === userId && t.id === id));
  localStorage.setItem('transactions', JSON.stringify(transactions));
};

export const updateTransaction = (userId: string, updated: Transaction): void => {
  const transactions: Transaction[] = JSON.parse(localStorage.getItem('transactions') || '[]');
  const index = transactions.findIndex((t) => t.userId === userId && t.id === updated.id);

  if (index !== -1) {
    transactions[index] = { ...transactions[index], ...updated };
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }
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
