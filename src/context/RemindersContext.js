import { createContext, useContext, useEffect, useState } from 'react';
import { notificationService } from '../services/notificationService';
import { storageService } from '../services/storageService';

const RemindersContext = createContext(undefined);

export const RemindersProvider = ({ children }) => {
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastNotificationCheck, setLastNotificationCheck] = useState(null);

  useEffect(() => {
    loadReminders();
  }, []);

  // Check for due reminders every minute
  useEffect(() => {
    const checkInterval = setInterval(() => {
      checkDueReminders();
    }, 60000); // Check every minute

    // Initial check
    checkDueReminders();

    return () => clearInterval(checkInterval);
  }, [reminders]);

  const checkDueReminders = () => {
    const dueReminders = notificationService.getDueReminders(reminders);
    
    if (dueReminders.length > 0) {
      const now = Date.now();
      // Only show notification if we haven't checked in the last 5 minutes
      if (!lastNotificationCheck || (now - lastNotificationCheck) > 5 * 60 * 1000) {
        // Show alert and mark as completed only after user dismisses
        const shownReminders = notificationService.showDueRemindersAlert(
          dueReminders, 
          async (dismissedReminders) => {
            // This callback runs ONLY after user dismisses the alert
            for (const reminder of dismissedReminders) {
              await toggleReminderComplete(reminder.id);
            }
          }
        );
        
        // Only update last check if alert was actually shown
        if (shownReminders) {
          setLastNotificationCheck(now);
        }
      }
    }
  };

  const loadReminders = async () => {
    try {
      const storedReminders = await storageService.getReminders();
      setReminders(storedReminders);
    } catch (error) {
      console.error('Error loading reminders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addReminder = async (reminder) => {
    try {
      const newReminder = {
        ...reminder,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        completed: false,
      };
      const updatedReminders = [...reminders, newReminder];
      await storageService.saveReminders(updatedReminders);
      setReminders(updatedReminders);
      return true;
    } catch (error) {
      console.error('Error adding reminder:', error);
      return false;
    }
  };

  const updateReminder = async (id, updates) => {
    try {
      const updatedReminders = reminders.map((reminder) =>
        reminder.id === id ? { ...reminder, ...updates } : reminder
      );
      await storageService.saveReminders(updatedReminders);
      setReminders(updatedReminders);
      return true;
    } catch (error) {
      console.error('Error updating reminder:', error);
      return false;
    }
  };

  const deleteReminder = async (id) => {
    try {
      const filteredReminders = reminders.filter((reminder) => reminder.id !== id);
      await storageService.saveReminders(filteredReminders);
      setReminders(filteredReminders);
      return true;
    } catch (error) {
      console.error('Error deleting reminder:', error);
      return false;
    }
  };

  const toggleReminderComplete = async (id) => {
    try {
      const updatedReminders = reminders.map((reminder) =>
        reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
      );
      await storageService.saveReminders(updatedReminders);
      setReminders(updatedReminders);
      return true;
    } catch (error) {
      console.error('Error toggling reminder:', error);
      return false;
    }
  };

  const getTotalReminders = () => reminders.length;
  const getActiveReminders = () => reminders.filter((r) => !r.completed);
  const getCompletedReminders = () => reminders.filter((r) => r.completed);
  const getDueReminders = () => notificationService.getDueReminders(reminders);
  const getDueSoonReminders = () => notificationService.getDueSoonReminders(reminders);

  const value = {
    reminders,
    isLoading,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleReminderComplete,
    loadReminders,
    getTotalReminders,
    getActiveReminders,
    getCompletedReminders,
    getDueReminders,
    getDueSoonReminders,
    checkDueReminders,
  };

  return <RemindersContext.Provider value={value}>{children}</RemindersContext.Provider>;
};

export const useReminders = () => {
  const context = useContext(RemindersContext);
  if (context === undefined) {
    throw new Error('useReminders must be used within a RemindersProvider');
  }
  return context;
};

export default RemindersContext;
