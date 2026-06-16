import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@/src/services/apiClient';
import { DEFAULT_CATEGORIES } from '@/src/constants/categories';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ExpenseContext } from './ExpenseContext';

export const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [budgets, setBudgets] = useState([]);
  const { expenses } = useContext(ExpenseContext);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [unbudgetedCategories, setUnbudgetedCategories] = useState([]);
  const seeded = useRef(false);

  useEffect(() => {
    apiClient.get('/api/budgets')
      .then(async (fetched) => {
        if (seeded.current) {
          setBudgets(fetched);
          return;
        }
        seeded.current = true;

        const existingLower = new Set(fetched.map(b => b.category.toLowerCase()));
        const missing = DEFAULT_CATEGORIES.filter(cat => !existingLower.has(cat.name.toLowerCase()));

        if (missing.length === 0) {
          setBudgets(fetched);
          return;
        }

        const created = await Promise.all(
          missing.map(cat =>
            apiClient.post('/api/budgets', {
              category: cat.name,
              limit: 0,
              period: 'monthly',
              color: cat.color,
            })
          )
        );
        setBudgets([...fetched, ...created]);
      })
      .catch(() => setBudgets([]));
  }, []);

  useEffect(() => {
    const expenseCategories = expenses.map(e => e.category?.trim()).filter(Boolean);
    const budgetCategories = budgets.map(b => b.category?.trim()).filter(Boolean);
    const merged = [...expenseCategories, ...budgetCategories].filter(c => c.length > 0);
    const dedupMap = new Map();
    merged.forEach(cat => {
      const key = cat.toLowerCase();
      if (!dedupMap.has(key)) dedupMap.set(key, cat);
    });
    const finalList = Array.from(dedupMap.values()).sort((a, b) => a.localeCompare(b));
    setAvailableCategories(finalList);

    const budgetCategoryLower = new Set(budgetCategories.map(c => c.toLowerCase()));
    const unbudgeted = expenseCategories
      .filter(c => !budgetCategoryLower.has(c.toLowerCase()))
      .reduce((acc, c) => {
        if (!acc.some(x => x.toLowerCase() === c.toLowerCase())) acc.push(c);
        return acc;
      }, [])
      .sort((a, b) => a.localeCompare(b));
    setUnbudgetedCategories(unbudgeted);
  }, [expenses, budgets]);

  const addBudget = async (budget) => {
    const created = await apiClient.post('/api/budgets', {
      category: budget.category,
      limit: parseFloat(budget.limit),
      period: budget.period || 'monthly',
      color: budget.color || '#6366F1',
    });
    setBudgets(prev => [...prev, created]);
  };

  const updateBudget = async (id, updates) => {
    const updated = await apiClient.put(`/api/budgets/${id}`, updates);
    setBudgets(prev => prev.map(b => b.id === id ? updated : b));
  };

  const deleteBudget = async (id) => {
    await apiClient.delete(`/api/budgets/${id}`);
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  const getCategorySpending = (category, period = 'monthly') => {
    const now = new Date();
    let startDate = new Date();
    if (period === 'daily') {
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'weekly') {
      startDate.setDate(now.getDate() - 7);
    } else {
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
    }
    return expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expense.category.toLowerCase() === category.toLowerCase() && expenseDate >= startDate;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getBudgetStatus = () => {
    return budgets.map(budget => {
      const spent = getCategorySpending(budget.category, budget.period);
      const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
      return {
        ...budget,
        spent,
        remaining: budget.limit - spent,
        percentage: Math.min(percentage, 100),
        status: percentage >= 100 ? 'exceeded' : percentage >= 80 ? 'warning' : 'good',
      };
    });
  };

  const getCategorySpendForMonth = (category, month) => {
    return expenses
      .filter(e =>
        e.category?.toLowerCase() === category.toLowerCase() &&
        e.date?.substring(0, 7) === month
      )
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const getTotalSpentForMonth = (month) => {
    const budgetCats = new Set(budgets.map(b => b.category.toLowerCase()));
    return expenses
      .filter(e =>
        budgetCats.has(e.category?.toLowerCase()) &&
        e.date?.substring(0, 7) === month
      )
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const getBudgetStatusForMonth = (month) => {
    return budgets.map(budget => {
      const spent = getCategorySpendForMonth(budget.category, month);
      const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
      return {
        ...budget,
        spent,
        remaining: budget.limit - spent,
        percentage: Math.min(percentage, 100),
        status: percentage >= 100 ? 'exceeded' : percentage >= 80 ? 'warning' : 'good',
      };
    });
  };

  const getUnbudgetedForMonth = (month) => {
    const budgetCatLower = new Set(budgets.map(b => b.category.toLowerCase()));
    return expenses
      .filter(e => e.date?.substring(0, 7) === month && e.category?.trim())
      .map(e => e.category.trim())
      .filter(cat => !budgetCatLower.has(cat.toLowerCase()))
      .reduce((acc, cat) => {
        if (!acc.some(x => x.toLowerCase() === cat.toLowerCase())) acc.push(cat);
        return acc;
      }, [])
      .sort((a, b) => a.localeCompare(b));
  };

  const getTotalBudget = () => budgets.reduce((sum, b) => sum + b.limit, 0);

  const getTotalSpent = () => {
    const budgetCategories = budgets.map(b => b.category.toLowerCase());
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return expenses
      .filter(e => {
        const d = new Date(e.date);
        return budgetCategories.includes(e.category.toLowerCase()) && d >= startOfMonth;
      })
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const getTotalRemaining = () => getTotalBudget() - getTotalSpent();

  // Cache budget summary for widgets whenever budgets or expenses change
  useEffect(() => {
    const totalBudget = getTotalBudget();
    const totalSpent = getTotalSpent();
    AsyncStorage.setItem('widget_budgets', JSON.stringify({
      totalBudget,
      totalSpent,
      totalRemaining: totalBudget - totalSpent,
    })).catch(() => {});
  }, [budgets, expenses]);

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
        getCategorySpendForMonth,
        getTotalSpentForMonth,
        getBudgetStatusForMonth,
        getUnbudgetedForMonth,
        getTotalBudget,
        getTotalSpent,
        getTotalRemaining,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};
