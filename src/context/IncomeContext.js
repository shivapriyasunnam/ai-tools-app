import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@/src/services/apiClient';
import { createContext, useCallback, useEffect, useState } from 'react';

export const IncomeContext = createContext();

function cacheIncomeForWidget(incomes) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyIncome = incomes
    .filter(i => new Date(i.date) >= startOfMonth)
    .reduce((sum, i) => sum + i.amount, 0);
  AsyncStorage.setItem('widget_income', JSON.stringify({ monthlyIncome })).catch(() => {});
}

export const IncomeProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/api/income')
      .then(data => {
        setIncomes(data);
        cacheIncomeForWidget(data);
      })
      .catch(() => setIncomes([]))
      .finally(() => setIsLoading(false));
  }, []);

  const addIncome = useCallback(async (income) => {
    const created = await apiClient.post('/api/income', {
      amount: parseFloat(income.amount),
      date: income.date || new Date().toISOString(),
      description: income.description,
    });
    setIncomes(prev => [created, ...prev]);
    return created;
  }, []);

  const deleteIncome = useCallback(async (id) => {
    await apiClient.delete(`/api/income/${id}`);
    setIncomes(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateIncome = useCallback(async (id, updates) => {
    const updated = await apiClient.put(`/api/income/${id}`, updates);
    setIncomes(prev => prev.map(i => i.id === id ? updated : i));
  }, []);

  const getTotalIncome = useCallback(() => {
    return incomes.reduce((sum, i) => sum + i.amount, 0);
  }, [incomes]);

  const clearIncomes = useCallback(async () => {
    await Promise.all(incomes.map(i => apiClient.delete(`/api/income/${i.id}`)));
    setIncomes([]);
  }, [incomes]);

  return (
    <IncomeContext.Provider
      value={{
        incomes,
        addIncome,
        deleteIncome,
        updateIncome,
        getTotalIncome,
        clearIncomes,
        isLoading,
      }}
    >
      {children}
    </IncomeContext.Provider>
  );
};
