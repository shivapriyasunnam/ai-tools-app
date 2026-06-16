import { createContext, useState } from 'react';
import { BudgetProvider } from './BudgetContext';
import { ExpenseProvider } from './ExpenseContext';
import { GoalsProvider } from './GoalsContext';
import { HeaderProvider } from './HeaderContext';
import { IncomeProvider } from './IncomeContext';
import { MeetingsProvider } from './MeetingsContext';
import { PomodoroProvider } from './PomodoroContext';
import { QuickNotesProvider } from './QuickNotesContext';
import { ThemeProvider } from './ThemeContext';
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
    <HeaderProvider>
    <ThemeProvider>
      <UserProvider>
        <MeetingsProvider>
          <TodoProvider>
            <GoalsProvider>
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
            </GoalsProvider>
          </TodoProvider>
        </MeetingsProvider>
      </UserProvider>
    </ThemeProvider>
    </HeaderProvider>
  );
};
