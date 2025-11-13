import AsyncStorage from '@react-native-async-storage/async-storage';

const EXPENSES_KEY = 'expenses_data';
const INCOMES_KEY = 'incomes_data';
const BUDGETS_KEY = 'budgets_data';
const MEETINGS_KEY = 'meetings_data';

export const storageService = {
  // Expenses
  saveExpenses: async (expenses) => {
    try {
      await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
      return true;
    } catch (error) {
      console.error('Error saving expenses:', error);
      return false;
    }
  },

  // Incomes
  saveIncomes: async (incomes) => {
    try {
      await AsyncStorage.setItem(INCOMES_KEY, JSON.stringify(incomes));
      return true;
    } catch (error) {
      console.error('Error saving incomes:', error);
      return false;
    }
  },

  getExpenses: async () => {
    try {
      const data = await AsyncStorage.getItem(EXPENSES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error retrieving expenses:', error);
      return [];
    }
  },

  getIncomes: async () => {
    try {
      const data = await AsyncStorage.getItem(INCOMES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error retrieving incomes:', error);
      return [];
    }
  },

  // Budgets
  saveBudgets: async (budgets) => {
    try {
      await AsyncStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
      return true;
    } catch (error) {
      console.error('Error saving budgets:', error);
      return false;
    }
  },

  getBudgets: async () => {
    try {
      const data = await AsyncStorage.getItem(BUDGETS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error retrieving budgets:', error);
      return [];
    }
  },

  // Clear all data
  clearAllData: async () => {
    try {
      await AsyncStorage.multiRemove([EXPENSES_KEY, BUDGETS_KEY, MEETINGS_KEY]);
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  },

  // Delete single expense
  deleteExpense: async (expenses) => {
    try {
      await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
      return true;
    } catch (error) {
      console.error('Error deleting expense:', error);
      return false;
    }
  },
};
