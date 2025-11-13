import { createContext, useState } from 'react';
import { ExpenseProvider } from './ExpenseContext';
import { IncomeProvider } from './IncomeContext';
import { PomodoroProvider } from './PomodoroContext';

export const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const value = {
    isDarkMode,
    setIsDarkMode,
  };

  return (
    <PomodoroProvider>
      <IncomeProvider>
        <ExpenseProvider>
          <AppContext.Provider value={value}>{children}</AppContext.Provider>
        </ExpenseProvider>
      </IncomeProvider>
    </PomodoroProvider>
  );
};
