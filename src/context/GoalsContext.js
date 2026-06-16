import { apiClient } from '@/src/services/apiClient';
import { createContext, useEffect, useState } from 'react';

export const GoalsContext = createContext();

export const GoalsProvider = ({ children }) => {
  const [goals, setGoals] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get('/api/goals/plans'),
      apiClient.get('/api/goals'),
    ])
      .then(([plansData, goalsData]) => {
        setPlans(plansData);
        setGoals(goalsData.map(normalizeGoal));
      })
      .catch(() => {
        setPlans([]);
        setGoals([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Plans ───────────────────────────────────────────────────────────────────

  const addPlan = async (data) => {
    const created = await apiClient.post('/api/goals/plans', data);
    setPlans(prev => [created, ...prev]);
    return created;
  };

  const updatePlan = async (id, data) => {
    const updated = await apiClient.put(`/api/goals/plans/${id}`, data);
    setPlans(prev => prev.map(p => p.id === id ? updated : p));
    return updated;
  };

  const deletePlan = async (id) => {
    await apiClient.delete(`/api/goals/plans/${id}`);
    setPlans(prev => prev.filter(p => p.id !== id));
    // Detach goals locally (server already cleared plan_id)
    setGoals(prev => prev.map(g => g.plan_id === id ? { ...g, plan_id: null } : g));
  };

  // ── Goals ───────────────────────────────────────────────────────────────────

  const addGoal = async (data) => {
    const payload = buildPayload(data);
    const created = await apiClient.post('/api/goals', payload);
    setGoals(prev => [normalizeGoal(created), ...prev]);
    return created;
  };

  const updateGoal = async (id, data) => {
    const payload = buildPayload(data);
    const updated = await apiClient.put(`/api/goals/${id}`, payload);
    setGoals(prev => prev.map(g => g.id === id ? normalizeGoal(updated) : g));
    return updated;
  };

  const deleteGoal = async (id) => {
    await apiClient.delete(`/api/goals/${id}`);
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const toggleGoalComplete = async (id) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;
    const nowCompleted = !goal.completed;
    const updated = await apiClient.put(`/api/goals/${id}`, {
      completed: nowCompleted,
      completed_at: nowCompleted ? new Date().toISOString() : null,
    });
    setGoals(prev => prev.map(g => g.id === id ? normalizeGoal(updated) : g));
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const getGoalsByPeriod = (period) =>
    period === 'all' ? goals : goals.filter(g => g.period === period);

  const getGoalsByPlan = (planId) =>
    goals.filter(g => g.plan_id === planId);

  const getGoalsByCategory = (category) =>
    category === 'all' ? goals : goals.filter(g => g.category === category);

  const getActiveGoalsCount = () => goals.filter(g => !g.completed).length;

  const getPlanById = (id) => plans.find(p => p.id === id) || null;

  return (
    <GoalsContext.Provider
      value={{
        goals,
        plans,
        loading,
        addPlan,
        updatePlan,
        deletePlan,
        addGoal,
        updateGoal,
        deleteGoal,
        toggleGoalComplete,
        getGoalsByPeriod,
        getGoalsByPlan,
        getGoalsByCategory,
        getActiveGoalsCount,
        getPlanById,
      }}
    >
      {children}
    </GoalsContext.Provider>
  );
};

function normalizeGoal(g) {
  return {
    ...g,
    linked_todo_ids: Array.isArray(g.linked_todo_ids) ? g.linked_todo_ids : [],
    completedAt: g.completed_at ?? null,
    createdAt: g.created_at,
  };
}

function buildPayload(data) {
  const payload = { ...data };
  // linked_todo_ids is already a list — backend expects list, sends list back
  if (!payload.linked_todo_ids) payload.linked_todo_ids = [];
  return payload;
}
