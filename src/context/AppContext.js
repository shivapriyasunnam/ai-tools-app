import { createContext, useState } from 'react';
import { ExpenseProvider } from './ExpenseContext';
import { IncomeProvider } from './IncomeContext';
import { PomodoroProvider } from './PomodoroContext';
import { TodoProvider } from './TodoContext';

export const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const value = {
    isDarkMode,
    setIsDarkMode,
  };

  return (
    <TodoProvider>
      <PomodoroProvider>
        <IncomeProvider>
          <ExpenseProvider>
            <AppContext.Provider value={value}>{children}</AppContext.Provider>
          </ExpenseProvider>
        </IncomeProvider>
      </PomodoroProvider>
    </TodoProvider>
  );
};
