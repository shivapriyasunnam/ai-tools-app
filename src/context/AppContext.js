import React, { createContext, useState } from 'react';
import { ExpenseProvider } from './ExpenseContext';

export const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const value = {
    isDarkMode,
    setIsDarkMode,
  };

  return (
    <ExpenseProvider>
      <AppContext.Provider value={value}>{children}</AppContext.Provider>
    </ExpenseProvider>
  );
};
