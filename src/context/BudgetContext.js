import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { ExpenseContext } from './ExpenseContext';

const BUDGET_STORAGE_KEY = 'BUDGET_CATEGORIES';

export const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [budgets, setBudgets] = useState([]);
  const { expenses } = useContext(ExpenseContext);
  // Derived categories (from expenses + existing budgets) for UI selection
  const [availableCategories, setAvailableCategories] = useState([]);
  const [unbudgetedCategories, setUnbudgetedCategories] = useState([]);

  // Load budgets from storage on mount
  useEffect(() => {
    loadBudgets();
  }, []);

  // Save budgets to storage whenever they change
  useEffect(() => {
    if (budgets.length > 0 || budgets.length === 0) {
      saveBudgets();
    }
  }, [budgets]);

  // Recompute available categories whenever expenses or budgets change
  useEffect(() => {
    const expenseCategories = expenses
      .map(e => e.category?.trim())
      .filter(Boolean);
    const budgetCategories = budgets.map(b => b.category?.trim()).filter(Boolean);
    const merged = [...expenseCategories, ...budgetCategories]
      .map(c => c.trim())
      .filter(c => c.length > 0);
    // normalize casing by keeping original but dedup case-insensitive
    const dedupMap = new Map();
    merged.forEach(cat => {
      const key = cat.toLowerCase();
      if (!dedupMap.has(key)) dedupMap.set(key, cat);
    });
    const finalList = Array.from(dedupMap.values()).sort((a, b) => a.localeCompare(b));
    setAvailableCategories(finalList);

    // Categories with expenses but no budget yet
    const budgetCategoryLower = new Set(budgetCategories.map(c => c.toLowerCase()));
    const unbudgeted = expenseCategories
      .filter(c => !budgetCategoryLower.has(c.toLowerCase()))
      .reduce((acc, c) => { // dedup again
        const key = c.toLowerCase();
        if (!acc.some(x => x.toLowerCase() === key)) acc.push(c);
        return acc;
      }, [])
      .sort((a, b) => a.localeCompare(b));
    setUnbudgetedCategories(unbudgeted);
  }, [expenses, budgets]);

  const loadBudgets = async () => {
    try {
      const storedBudgets = await AsyncStorage.getItem(BUDGET_STORAGE_KEY);
      if (storedBudgets) {
        setBudgets(JSON.parse(storedBudgets));
      }
    } catch (error) {
      console.error('Error loading budgets:', error);
    }
  };

  const saveBudgets = async () => {
    try {
      await AsyncStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(budgets));
    } catch (error) {
      console.error('Error saving budgets:', error);
    }
  };

  const addBudget = (budget) => {
    const newBudget = {
      id: Date.now().toString(),
      category: budget.category,
      limit: parseFloat(budget.limit),
      period: budget.period || 'monthly', // monthly, weekly, daily
      color: budget.color || '#6366F1',
      createdAt: new Date().toISOString(),
    };
    setBudgets([...budgets, newBudget]);
  };

  const updateBudget = (id, updates) => {
    setBudgets(budgets.map(budget => 
      budget.id === id ? { ...budget, ...updates } : budget
    ));
  };

  const deleteBudget = (id) => {
    setBudgets(budgets.filter(budget => budget.id !== id));
  };

  // Calculate spending for a specific category
  const getCategorySpending = (category, period = 'monthly') => {
    const now = new Date();
    let startDate = new Date();

    if (period === 'daily') {
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'weekly') {
      startDate.setDate(now.getDate() - 7);
    } else {
      // monthly
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
    }

    return expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expense.category.toLowerCase() === category.toLowerCase() &&
               expenseDate >= startDate;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  // Get budget status with spending
  const getBudgetStatus = () => {
    return budgets.map(budget => {
      const spent = getCategorySpending(budget.category, budget.period);
      const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
      const remaining = budget.limit - spent;
      
      return {
        ...budget,
        spent,
        remaining,
        percentage: Math.min(percentage, 100),
        status: percentage >= 100 ? 'exceeded' : percentage >= 80 ? 'warning' : 'good',
      };
    });
  };

  // Get total budget and spending
  const getTotalBudget = () => {
    return budgets.reduce((sum, budget) => sum + budget.limit, 0);
  };

  const getTotalSpent = () => {
    const budgetCategories = budgets.map(b => b.category.toLowerCase());
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return budgetCategories.includes(expense.category.toLowerCase()) &&
               expenseDate >= startOfMonth;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getTotalRemaining = () => {
    return getTotalBudget() - getTotalSpent();
  };

  return (
    <BudgetContext.Provider
      value={{
        budgets,
        availableCategories,
  unbudgetedCategories,
        addBudget,
        updateBudget,
        deleteBudget,
        getBudgetStatus,
        getCategorySpending,
        getTotalBudget,
        getTotalSpent,
        getTotalRemaining,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};
