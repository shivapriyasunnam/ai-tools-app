import { useContext } from 'react';

import { BudgetContext } from '@/src/context/BudgetContext';
import { ExpenseContext } from '@/src/context/ExpenseContext';
import { GoalsContext } from '@/src/context/GoalsContext';
import { IncomeContext } from '@/src/context/IncomeContext';
import { useQuickNotes } from '@/src/context/QuickNotesContext';
import { TodoContext } from '@/src/context/TodoContext';

const safeDate = (dateStr) => {
  if (!dateStr) return new Date();
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date() : d;
};

export default function useAllActivities() {
  const { expenses } = useContext(ExpenseContext);
  const { incomes } = useContext(IncomeContext);
  const { todos } = useContext(TodoContext);
  const { budgets } = useContext(BudgetContext);
  const { goals, plans } = useContext(GoalsContext);
  const { notes } = useQuickNotes();

  let sessions = [];
  try {
    const PomodoroContext =
      require('@/src/context/PomodoroContext').default ||
      require('@/src/context/PomodoroContext');
    const pomodoroValue = useContext(PomodoroContext);
    sessions = pomodoroValue?.sessions ?? [];
  } catch {
    sessions = [];
  }

  return [
    ...expenses
      .filter(exp => exp && exp.id)
      .map(exp => ({
        id: `exp-${exp.id}`,
        type: 'expense',
        title: exp.description,
        subtitle: exp.category,
        amount: -exp.amount,
        date: safeDate(exp.date),
        icon: 'wallet',
        iconColor: '#EF4444',
        iconBg: '#FEE2E2',
      })),
    ...incomes.map(inc => ({
      id: `inc-${inc.id}`,
      type: 'income',
      title: inc.description || inc.source || 'Income',
      subtitle: inc.category || 'Income',
      amount: inc.amount,
      date: safeDate(inc.date),
      icon: 'cash',
      iconColor: '#10B981',
      iconBg: '#D1FAE5',
    })),
    ...todos.flatMap(todo => {
      const activities = [];
      if (todo.createdAt) {
        activities.push({
          id: `todo-added-${todo.id}`,
          type: 'todo-added',
          title: todo.title || todo.text || '(No Title)',
          subtitle: 'Task added',
          amount: null,
          date: safeDate(todo.createdAt),
          icon: 'add-circle',
          iconColor: '#3B82F6',
          iconBg: '#DBEAFE',
        });
      }
      if (todo.completed && todo.completedAt) {
        activities.push({
          id: `todo-completed-${todo.id}`,
          type: 'todo-completed',
          title: todo.title || todo.text || '(No Title)',
          subtitle: 'Task completed',
          amount: null,
          date: safeDate(todo.completedAt),
          icon: 'checkmark-circle',
          iconColor: '#8B5CF6',
          iconBg: '#EDE9FE',
        });
      }
      return activities;
    }),
    ...budgets
      .filter(b => b.created_at || b.createdAt)
      .map(budget => ({
        id: `budget-${budget.id}`,
        type: 'budget',
        title: `Budgeted: ${budget.category}`,
        subtitle: `Limit $${budget.limit} (${budget.period})`,
        amount: null,
        date: safeDate(budget.created_at || budget.createdAt),
        icon: 'pie-chart',
        iconColor: '#4ECDC4',
        iconBg: '#E0FCF9',
      })),
    ...(Array.isArray(sessions)
      ? sessions.filter(s => s.completed).map(session => ({
          id: `pomodoro-${session.id}`,
          type: 'pomodoro',
          title: 'Pomodoro Session',
          subtitle: session.type
            ? `${session.type.charAt(0).toUpperCase() + session.type.slice(1)} session`
            : 'Session',
          amount: null,
          date: session.end ? new Date(session.end) : new Date(),
          icon: 'timer',
          iconColor: '#E91E63',
          iconBg: '#FCE7F3',
        }))
      : []),
    ...notes.map(note => ({
      id: `note-${note.id}`,
      type: 'quick-note',
      title: note.text,
      subtitle: 'Quick Note added',
      amount: null,
      date: note.created_at ? new Date(note.created_at) : new Date(),
      icon: 'document-text',
      iconColor: '#6366F1',
      iconBg: '#E0E7FF',
    })),
    ...(Array.isArray(goals)
      ? goals.flatMap(goal => {
          const activities = [];
          if (goal.createdAt) {
            activities.push({
              id: `goal-added-${goal.id}`,
              type: 'goal-added',
              title: goal.title || '(No Title)',
              subtitle: 'Goal added',
              amount: null,
              date: safeDate(goal.createdAt),
              icon: 'flag',
              iconColor: '#F59E0B',
              iconBg: '#FEF3C7',
            });
          }
          if (goal.completed && goal.completedAt) {
            activities.push({
              id: `goal-completed-${goal.id}`,
              type: 'goal-completed',
              title: goal.title || '(No Title)',
              subtitle: 'Goal completed',
              amount: null,
              date: safeDate(goal.completedAt),
              icon: 'flag',
              iconColor: '#10B981',
              iconBg: '#D1FAE5',
            });
          }
          return activities;
        })
      : []),
    ...(Array.isArray(plans)
      ? plans.filter(p => p.created_at).map(plan => ({
          id: `plan-added-${plan.id}`,
          type: 'plan-added',
          title: plan.title || '(No Title)',
          subtitle: 'Plan created',
          amount: null,
          date: safeDate(plan.created_at),
          icon: 'map',
          iconColor: '#8B5CF6',
          iconBg: '#EDE9FE',
        }))
      : []),
  ].sort((a, b) => b.date - a.date);
}
