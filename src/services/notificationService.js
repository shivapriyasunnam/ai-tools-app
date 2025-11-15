import { Alert } from 'react-native';

export const notificationService = {
  // Check if a reminder is due based on its dueDateTime
  isReminderDue: (reminder) => {
    if (!reminder.dueDateTime || reminder.completed) {
      return false;
    }

    const now = new Date();
    const dueDate = new Date(reminder.dueDateTime);
    
    // Check if due time has passed
    return dueDate <= now;
  },

  // Check if reminder is due within the next hour
  isReminderDueSoon: (reminder) => {
    if (!reminder.dueDateTime || reminder.completed) {
      return false;
    }

    const now = new Date();
    const dueDate = new Date(reminder.dueDateTime);
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    
    return dueDate <= oneHourFromNow && dueDate > now;
  },

  // Get all due reminders
  getDueReminders: (reminders) => {
    return reminders.filter(reminder => notificationService.isReminderDue(reminder));
  },

  // Get reminders due soon
  getDueSoonReminders: (reminders) => {
    return reminders.filter(reminder => notificationService.isReminderDueSoon(reminder));
  },

  // Show alert for due reminders
  showDueRemindersAlert: (reminders, onDismiss) => {
    const dueReminders = notificationService.getDueReminders(reminders);
    
    if (dueReminders.length === 0) {
      return null;
    }

    const titles = dueReminders.map(r => `• ${r.title}`).join('\n');
    const message = dueReminders.length === 1 
      ? `You have 1 reminder that's due:\n\n${titles}`
      : `You have ${dueReminders.length} reminders that are due:\n\n${titles}`;

    Alert.alert(
      '🔔 Reminder Alert',
      message,
      [
        { 
          text: 'Dismiss', 
          style: 'cancel',
          onPress: () => {
            // Mark reminders as completed after user dismisses
            if (onDismiss) {
              onDismiss(dueReminders);
            }
          }
        },
        { 
          text: 'View Reminders', 
          style: 'default',
          onPress: () => {
            // Mark reminders as completed after user dismisses
            if (onDismiss) {
              onDismiss(dueReminders);
            }
          }
        }
      ]
    );
    
    return dueReminders;
  },

  // Format datetime for display
  formatDateTime: (dateTimeString) => {
    if (!dateTimeString) return '';
    
    const date = new Date(dateTimeString);
    const now = new Date();
    
    // Check if it's today
    const isToday = date.toDateString() === now.toDateString();
    
    // Check if it's tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    
    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    if (isToday) {
      return `Today at ${timeStr}`;
    } else if (isTomorrow) {
      return `Tomorrow at ${timeStr}`;
    } else {
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  },

  // Parse date and time strings to ISO datetime
  createDateTime: (dateStr, timeStr) => {
    if (!dateStr) return null;
    
    try {
      // Try to parse the date string
      const date = new Date(dateStr);
      
      if (isNaN(date.getTime())) {
        return null;
      }
      
      // If time is provided, set it
      if (timeStr) {
        const timeParts = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
        if (timeParts) {
          let hours = parseInt(timeParts[1]);
          const minutes = parseInt(timeParts[2]);
          const meridiem = timeParts[3]?.toUpperCase();
          
          if (meridiem === 'PM' && hours !== 12) {
            hours += 12;
          } else if (meridiem === 'AM' && hours === 12) {
            hours = 0;
          }
          
          date.setHours(hours, minutes, 0, 0);
        }
      }
      
      return date.toISOString();
    } catch (error) {
      console.error('Error creating datetime:', error);
      return null;
    }
  }
};
