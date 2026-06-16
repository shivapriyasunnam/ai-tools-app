// storageService is replaced by apiClient calls in each context.
// Kept as a stub so any remaining references don't break during migration.
import { apiClient } from './apiClient';

export const storageService = {
  saveExpenses: async () => true,
  getExpenses: async () => apiClient.get('/api/expenses').catch(() => []),
  saveIncomes: async () => true,
  getIncomes: async () => apiClient.get('/api/income').catch(() => []),
  saveBudgets: async () => true,
  getBudgets: async () => apiClient.get('/api/budgets').catch(() => []),
  saveMeetings: async () => true,
  getMeetings: async () => apiClient.get('/api/meetings').catch(() => []),
  deleteExpense: async () => true,
  clearAllData: async () => true,
  saveUserProfile: async (profile) => apiClient.put('/api/user/profile', profile).catch(() => null),
  getUserProfile: async () => apiClient.get('/api/user/profile').catch(() => ({ name: '' })),
};
