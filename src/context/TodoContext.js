import { apiClient } from '@/src/services/apiClient';
import { createContext, useEffect, useState } from 'react';

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    apiClient.get('/api/todos')
      .then(data => setTodos(data.map(normalizeTodo)))
      .catch(() => setTodos([]));
  }, []);

  const addTodo = async (todo) => {
    const created = await apiClient.post('/api/todos', {
      title: todo.title,
      description: todo.description || '',
      completed: false,
      priority: todo.priority || 'medium',
      category: todo.category || 'general',
      due_date: todo.dueDate || null,
    });
    setTodos(prev => [normalizeTodo(created), ...prev]);
  };

  const updateTodo = async (id, updates) => {
    const payload = { ...updates };
    if (updates.dueDate !== undefined) { payload.due_date = updates.dueDate; delete payload.dueDate; }
    if (updates.completedAt !== undefined) { payload.completed_at = updates.completedAt; delete payload.completedAt; }
    const updated = await apiClient.put(`/api/todos/${id}`, payload);
    setTodos(prev => prev.map(t => t.id === id ? normalizeTodo(updated) : t));
  };

  const deleteTodo = async (id) => {
    await apiClient.delete(`/api/todos/${id}`);
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const toggleComplete = async (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    const nowCompleted = !todo.completed;
    const updated = await apiClient.put(`/api/todos/${id}`, {
      completed: nowCompleted,
      completed_at: nowCompleted ? new Date().toISOString() : null,
    });
    setTodos(prev => prev.map(t => t.id === id ? normalizeTodo(updated) : t));
  };

  const clearCompleted = async () => {
    const completed = todos.filter(t => t.completed);
    await Promise.all(completed.map(t => apiClient.delete(`/api/todos/${t.id}`)));
    setTodos(prev => prev.filter(t => !t.completed));
  };

  const getTotalTodos = () => todos.length;
  const getCompletedCount = () => todos.filter(t => t.completed).length;
  const getPendingCount = () => todos.filter(t => !t.completed).length;
  const getTodosByCategory = () => {
    const categories = {};
    todos.forEach(todo => {
      if (!categories[todo.category]) categories[todo.category] = 0;
      if (!todo.completed) categories[todo.category]++;
    });
    return categories;
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleComplete,
        getTotalTodos,
        getCompletedCount,
        getPendingCount,
        getTodosByCategory,
        clearCompleted,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

// Map server snake_case to app camelCase
function normalizeTodo(t) {
  return {
    ...t,
    dueDate: t.due_date ?? t.dueDate ?? null,
    completedAt: t.completed_at ?? t.completedAt ?? null,
    createdAt: t.created_at ?? t.createdAt,
  };
}
