import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@/src/services/apiClient';
import { createContext, useCallback, useEffect, useState } from 'react';

export const ExpenseContext = createContext();

function cacheExpensesForWidget(expenses) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyTotal = expenses
    .filter(e => new Date(e.date) >= startOfMonth)
    .reduce((sum, e) => sum + e.amount, 0);
  const byCategory = expenses
    .filter(e => new Date(e.date) >= startOfMonth)
    .reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});
  AsyncStorage.setItem('widget_expenses', JSON.stringify({ monthlyTotal, byCategory })).catch(() => {});
}

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/api/expenses')
      .then(data => {
        setExpenses(data);
        cacheExpensesForWidget(data);
      })
      .catch(() => setExpenses([]))
      .finally(() => setIsLoading(false));
  }, []);

  const addExpense = useCallback(async (expense) => {
    const created = await apiClient.post('/api/expenses', {
      amount: parseFloat(expense.amount),
      category: expense.category || 'Uncategorized',
      description: expense.description,
      date: expense.date || new Date().toISOString(),
      method: expense.method || 'manual',
      notes: expense.notes || '',
    });
    setExpenses(prev => [created, ...prev]);
    return created;
  }, []);

  const addMultipleExpenses = useCallback(async (expensesList) => {
    const created = await Promise.all(
      expensesList.map(expense =>
        apiClient.post('/api/expenses', {
          amount: parseFloat(expense.amount),
          category: expense.category || 'Uncategorized',
          description: expense.description,
          date: expense.date || new Date().toISOString(),
          method: expense.method || 'csv',
          notes: expense.notes || '',
        })
      )
    );
    setExpenses(prev => [...created, ...prev]);
    return created;
  }, []);

  const deleteExpense = useCallback(async (id) => {
    await apiClient.delete(`/api/expenses/${id}`);
    setExpenses(prev => prev.filter(e => e.id !== id));
  }, []);

  const updateExpense = useCallback(async (id, updates) => {
    const updated = await apiClient.put(`/api/expenses/${id}`, updates);
    setExpenses(prev => prev.map(e => e.id === id ? updated : e));
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

  const clearExpenses = useCallback(async () => {
    await Promise.all(expenses.map(e => apiClient.delete(`/api/expenses/${e.id}`)));
    setExpenses([]);
  }, [expenses]);

  // Keep a slim cache in AsyncStorage so widgets can read it without the RN context
  useEffect(() => {
    cacheExpensesForWidget(expenses);
  }, [expenses]);

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
