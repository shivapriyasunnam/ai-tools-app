import React, { createContext, useState, useCallback, useEffect } from 'react';
import { storageService } from '@/src/services/storageService';

export const IncomeContext = createContext();

export const IncomeProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadIncomes();
  }, []);

  useEffect(() => {
    if (!isLoading && incomes.length >= 0) {
      storageService.saveIncomes(incomes);
    }
  }, [incomes, isLoading]);

  const loadIncomes = async () => {
    try {
      setIsLoading(true);
      const savedIncomes = await storageService.getIncomes();
      setIncomes(savedIncomes);
    } catch (error) {
      console.error('Error loading incomes:', error);
      setIncomes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addIncome = useCallback((income) => {
    const newIncome = {
      id: Date.now() + Math.random(),
      createdAt: new Date().toISOString(),
      date: income.date || new Date().toISOString().split('T')[0],
      description: income.description,
      amount: parseFloat(income.amount),
      notes: income.notes || '',
    };
    setIncomes(prev => [newIncome, ...prev]);
    return newIncome;
  }, []);

  const deleteIncome = useCallback((id) => {
    setIncomes(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateIncome = useCallback((id, updates) => {
    setIncomes(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  }, []);

  const getTotalIncome = useCallback(() => {
    return incomes.reduce((sum, i) => sum + i.amount, 0);
  }, [incomes]);

  const clearIncomes = useCallback(() => {
    setIncomes([]);
  }, []);

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
