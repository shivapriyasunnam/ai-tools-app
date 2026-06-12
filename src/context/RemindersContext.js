import { apiClient } from '@/src/services/apiClient';
import { createContext, useContext, useEffect, useState } from 'react';
import { notificationService } from '../services/notificationService';

const RemindersContext = createContext(undefined);

export const RemindersProvider = ({ children }) => {
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastNotificationCheck, setLastNotificationCheck] = useState(null);

  useEffect(() => {
    apiClient.get('/api/reminders')
      .then(data => setReminders(data.map(normalizeReminder)))
      .catch(() => setReminders([]))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const checkInterval = setInterval(checkDueReminders, 60000);
    checkDueReminders();
    return () => clearInterval(checkInterval);
  }, [reminders]);

  const checkDueReminders = () => {
    const dueReminders = notificationService.getDueReminders(reminders);
    if (dueReminders.length > 0) {
      const now = Date.now();
      if (!lastNotificationCheck || (now - lastNotificationCheck) > 5 * 60 * 1000) {
        const shown = notificationService.showDueRemindersAlert(dueReminders, async (dismissed) => {
          for (const r of dismissed) await toggleReminderComplete(r.id);
        });
        if (shown) setLastNotificationCheck(now);
      }
    }
  };

  const addReminder = async (reminder) => {
    try {
      const created = await apiClient.post('/api/reminders', {
        title: reminder.title,
        description: reminder.description,
        completed: false,
        due_date: reminder.dueDate || reminder.due_date || null,
        priority: reminder.priority,
      });
      setReminders(prev => [...prev, normalizeReminder(created)]);
      return true;
    } catch (error) {
      console.error('Error adding reminder:', error);
      return false;
    }
  };

  const updateReminder = async (id, updates) => {
    try {
      const payload = { ...updates };
      if (updates.dueDate !== undefined) { payload.due_date = updates.dueDate; delete payload.dueDate; }
      const updated = await apiClient.put(`/api/reminders/${id}`, payload);
      setReminders(prev => prev.map(r => r.id === id ? normalizeReminder(updated) : r));
      return true;
    } catch (error) {
      console.error('Error updating reminder:', error);
      return false;
    }
  };

  const deleteReminder = async (id) => {
    try {
      await apiClient.delete(`/api/reminders/${id}`);
      setReminders(prev => prev.filter(r => r.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting reminder:', error);
      return false;
    }
  };

  const toggleReminderComplete = async (id) => {
    try {
      const reminder = reminders.find(r => r.id === id);
      const updated = await apiClient.put(`/api/reminders/${id}`, { completed: !reminder?.completed });
      setReminders(prev => prev.map(r => r.id === id ? normalizeReminder(updated) : r));
      return true;
    } catch (error) {
      console.error('Error toggling reminder:', error);
      return false;
    }
  };

  const getTotalReminders = () => reminders.length;
  const getActiveReminders = () => reminders.filter(r => !r.completed);
  const getCompletedReminders = () => reminders.filter(r => r.completed);
  const getDueReminders = () => notificationService.getDueReminders(reminders);
  const getDueSoonReminders = () => notificationService.getDueSoonReminders(reminders);

  return (
    <RemindersContext.Provider
      value={{
        reminders,
        isLoading,
        addReminder,
        updateReminder,
        deleteReminder,
        toggleReminderComplete,
        loadReminders: () => {},
        getTotalReminders,
        getActiveReminders,
        getCompletedReminders,
        getDueReminders,
        getDueSoonReminders,
        checkDueReminders,
      }}
    >
      {children}
    </RemindersContext.Provider>
  );
};

export const useReminders = () => {
  const context = useContext(RemindersContext);
  if (context === undefined) throw new Error('useReminders must be used within a RemindersProvider');
  return context;
};

export default RemindersContext;

function normalizeReminder(r) {
  return { ...r, dueDate: r.due_date ?? r.dueDate ?? null, createdAt: r.created_at ?? r.createdAt };
}
