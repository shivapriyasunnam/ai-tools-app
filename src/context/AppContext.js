import { createContext, useState } from 'react';
import { BudgetProvider } from './BudgetContext';
import { ExpenseProvider } from './ExpenseContext';
import { IncomeProvider } from './IncomeContext';

import { PomodoroProvider } from './PomodoroContext';
import { QuickNotesProvider } from './QuickNotesContext';
import { TodoProvider } from './TodoContext';
import { UserProvider } from './UserContext';

export const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const value = {
    isDarkMode,
    setIsDarkMode,
  };

  return (
    <UserProvider>
      <TodoProvider>
        <PomodoroProvider>
          <IncomeProvider>
            <ExpenseProvider>
              <BudgetProvider>
                <QuickNotesProvider>
                  <AppContext.Provider value={value}>{children}</AppContext.Provider>
                </QuickNotesProvider>
              </BudgetProvider>
            </ExpenseProvider>
          </IncomeProvider>
        </PomodoroProvider>
      </TodoProvider>
    </UserProvider>
  );
};
