import React, { createContext, useState, useCallback, useEffect } from 'react';
import { storageService } from '@/src/services/storageService';

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load expenses from storage on app start
  useEffect(() => {
    loadExpenses();
  }, []);

  // Save expenses to storage whenever they change
  useEffect(() => {
    if (!isLoading && expenses.length >= 0) {
      storageService.saveExpenses(expenses);
    }
  }, [expenses, isLoading]);

  const loadExpenses = async () => {
    try {
      setIsLoading(true);
      const savedExpenses = await storageService.getExpenses();
      setExpenses(savedExpenses);
    } catch (error) {
      console.error('Error loading expenses:', error);
      setExpenses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addExpense = useCallback((expense) => {
    const newExpense = {
      id: Date.now() + Math.random(),
      createdAt: new Date().toISOString(),
      date: expense.date || new Date().toISOString().split('T')[0],
      description: expense.description,
      amount: parseFloat(expense.amount),
      category: expense.category || 'Uncategorized',
      method: expense.method || 'manual',
      notes: expense.notes || '',
    };
    setExpenses(prev => [newExpense, ...prev]);
    return newExpense;
  }, []);

  const addMultipleExpenses = useCallback((expensesList) => {
    const newExpenses = expensesList.map(expense => ({
      id: Date.now() + Math.random(),
      createdAt: new Date().toISOString(),
      date: expense.date || new Date().toISOString().split('T')[0],
      description: expense.description,
      amount: parseFloat(expense.amount),
      category: expense.category || 'Uncategorized',
      method: expense.method || 'csv',
      notes: expense.notes || '',
    }));
    setExpenses(prev => [...newExpenses, ...prev]);
    return newExpenses;
  }, []);

  const deleteExpense = useCallback((id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  }, []);

  const updateExpense = useCallback((id, updates) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  }, []);

  const getTotalByCategory = useCallback(() => {
    return expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});
  }, [expenses]);

  const getTotalByMonth = useCallback(() => {
    return expenses.reduce((acc, exp) => {
      const month = exp.date.substring(0, 7);
      acc[month] = (acc[month] || 0) + exp.amount;
      return acc;
    }, {});
  }, [expenses]);

  const getTotal = useCallback(() => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  const clearExpenses = useCallback(() => {
    setExpenses([]);
  }, []);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        addMultipleExpenses,
        deleteExpense,
        updateExpense,
        getTotalByCategory,
        getTotalByMonth,
        getTotal,
        clearExpenses,
        isLoading,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};
