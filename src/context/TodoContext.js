import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';

const TODO_STORAGE_KEY = 'TODO_ITEMS';

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);

  // Load todos from storage on mount
  useEffect(() => {
    loadTodos();
  }, []);

  // Save todos to storage whenever they change
  useEffect(() => {
    if (todos.length > 0 || todos.length === 0) {
      saveTodos();
    }
  }, [todos]);

  const loadTodos = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem(TODO_STORAGE_KEY);
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  };

  const saveTodos = async () => {
    try {
      await AsyncStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  };

  const addTodo = (todo) => {
    const newTodo = {
      id: Date.now().toString(),
      title: todo.title,
      description: todo.description || '',
      completed: false,
      priority: todo.priority || 'medium', // low, medium, high
      category: todo.category || 'general',
      dueDate: todo.dueDate || null,
      createdAt: new Date().toISOString(),
    };
    setTodos([newTodo, ...todos]);
  };

  const updateTodo = (id, updates) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, ...updates } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const getTotalTodos = () => todos.length;

  const getCompletedCount = () => todos.filter(t => t.completed).length;

  const getPendingCount = () => todos.filter(t => !t.completed).length;

  const getTodosByCategory = () => {
    const categories = {};
    todos.forEach(todo => {
      if (!categories[todo.category]) {
        categories[todo.category] = 0;
      }
      if (!todo.completed) {
        categories[todo.category]++;
      }
    });
    return categories;
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
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
