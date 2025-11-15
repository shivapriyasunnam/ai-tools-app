import { colors, spacing } from '@/src/constants';
import { useReminders } from '@/src/context/RemindersContext';
import { notificationService } from '@/src/services/notificationService';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
    Alert,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RemindersScreen() {
  const [mode, setMode] = useState('view'); // 'view', 'add', 'edit'
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [dueTime, setDueTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [priority, setPriority] = useState('medium'); // 'low', 'medium', 'high'
  const [editReminder, setEditReminder] = useState(null);

  const {
    reminders,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleReminderComplete,
    getActiveReminders,
    getCompletedReminders,
  } = useReminders();

  const activeReminders = getActiveReminders();
  const completedReminders = getCompletedReminders();

  const handleAddReminder = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for the reminder');
      return;
    }

    // Combine date and time
    const combinedDateTime = new Date(dueDate);
    combinedDateTime.setHours(dueTime.getHours(), dueTime.getMinutes(), 0, 0);

    const success = await addReminder({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      dueTime: dueTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      dueDateTime: combinedDateTime.toISOString(),
      priority,
    });

    if (success) {
      Alert.alert('Success', 'Reminder added successfully!');
      resetForm();
      setMode('view');
    } else {
      Alert.alert('Error', 'Failed to add reminder');
    }
  };

  const handleEditReminder = (reminder) => {
    setEditReminder(reminder);
    setTitle(reminder.title);
    setDescription(reminder.description || '');
    
    // Parse the stored dates
    if (reminder.dueDateTime) {
      const dateTime = new Date(reminder.dueDateTime);
      setDueDate(dateTime);
      setDueTime(dateTime);
    } else {
      setDueDate(new Date());
      setDueTime(new Date());
    }
    
    setPriority(reminder.priority || 'medium');
    setMode('edit');
  };

  const handleUpdateReminder = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for the reminder');
      return;
    }

    // Combine date and time
    const combinedDateTime = new Date(dueDate);
    combinedDateTime.setHours(dueTime.getHours(), dueTime.getMinutes(), 0, 0);

    const success = await updateReminder(editReminder.id, {
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      dueTime: dueTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      dueDateTime: combinedDateTime.toISOString(),
      priority,
    });

    if (success) {
      Alert.alert('Success', 'Reminder updated successfully!');
      resetForm();
      setMode('view');
    } else {
      Alert.alert('Error', 'Failed to update reminder');
    }
  };

  const handleDeleteReminder = (id) => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteReminder(id);
            if (success) {
              Alert.alert('Success', 'Reminder deleted');
            }
          },
        },
      ]
    );
  };

  const handleToggleComplete = async (id) => {
    await toggleReminderComplete(id);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate(new Date());
    setDueTime(new Date());
    setPriority('medium');
    setEditReminder(null);
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return colors.error;
      case 'medium':
        return colors.warning || '#F59E0B';
      case 'low':
        return colors.success || '#10B981';
      default:
        return colors.gray[400];
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high':
        return '🔴 High';
      case 'medium':
        return '🟡 Medium';
      case 'low':
        return '🟢 Low';
      default:
        return priority;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        {mode === 'view' && (
          <View>
            <Text style={styles.title}>🔔 Reminders</Text>

            {/* Summary Cards */}
            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Active</Text>
                <Text style={styles.summaryAmount}>{activeReminders.length}</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Completed</Text>
                <Text style={styles.summaryAmount}>{completedReminders.length}</Text>
              </View>
            </View>

            {/* Add Button */}
            <TouchableOpacity
              onPress={() => setMode('add')}
              style={[styles.addButton, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.addButtonText}>➕ Add New Reminder</Text>
            </TouchableOpacity>

            {/* Active Reminders */}
            {activeReminders.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📝 Active Reminders</Text>
                {activeReminders.map((reminder) => (
                  <View key={reminder.id} style={styles.reminderCard}>
                    <TouchableOpacity
                      onPress={() => handleToggleComplete(reminder.id)}
                      style={styles.checkbox}
                    >
                      <Text style={styles.checkboxText}>⭕</Text>
                    </TouchableOpacity>
                    <View style={styles.reminderContent}>
                      <Text style={styles.reminderTitle}>{reminder.title}</Text>
                      {reminder.description && (
                        <Text style={styles.reminderDescription}>{reminder.description}</Text>
                      )}
                      <View style={styles.reminderMeta}>
                        <Text style={[styles.reminderPriority, { color: getPriorityColor(reminder.priority) }]}>
                          {getPriorityLabel(reminder.priority)}
                        </Text>
                        {reminder.dueDateTime && (
                          <Text style={styles.reminderDate}>
                            📅 {notificationService.formatDateTime(reminder.dueDateTime)}
                          </Text>
                        )}
                        {!reminder.dueDateTime && reminder.dueDate && (
                          <Text style={styles.reminderDate}>📅 {reminder.dueDate}</Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.reminderActions}>
                      <TouchableOpacity onPress={() => handleEditReminder(reminder)}>
                        <Text style={styles.actionButton}>✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteReminder(reminder.id)}>
                        <Text style={styles.actionButton}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Completed Reminders */}
            {completedReminders.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>✅ Completed</Text>
                {completedReminders.map((reminder) => (
                  <View key={reminder.id} style={[styles.reminderCard, styles.completedCard]}>
                    <TouchableOpacity
                      onPress={() => handleToggleComplete(reminder.id)}
                      style={styles.checkbox}
                    >
                      <Text style={styles.checkboxText}>✅</Text>
                    </TouchableOpacity>
                    <View style={styles.reminderContent}>
                      <Text style={[styles.reminderTitle, styles.completedText]}>{reminder.title}</Text>
                      {reminder.description && (
                        <Text style={[styles.reminderDescription, styles.completedText]}>
                          {reminder.description}
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteReminder(reminder.id)}>
                      <Text style={styles.actionButton}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {reminders.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No reminders yet!</Text>
                <Text style={styles.emptySubtext}>Tap the button above to add your first reminder.</Text>
              </View>
            )}
          </View>
        )}

        {/* Add/Edit Form */}
        {(mode === 'add' || mode === 'edit') && (
          <View>
            <Text style={styles.title}>{mode === 'add' ? '➕ Add Reminder' : '✏️ Edit Reminder'}</Text>

            <View style={styles.form}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter reminder title"
                placeholderTextColor={colors.gray[400]}
                value={title}
                onChangeText={setTitle}
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter description (optional)"
                placeholderTextColor={colors.gray[400]}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />

              <Text style={styles.label}>Due Date</Text>
              <TouchableOpacity 
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateTimeIcon}>📅</Text>
                <Text style={styles.dateTimeText}>
                  {dueDate.toLocaleDateString('en-US', { 
                    weekday: 'short',
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </Text>
              </TouchableOpacity>
              
              {showDatePicker && (
                <DateTimePicker
                  value={dueDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(Platform.OS === 'ios');
                    if (selectedDate) {
                      setDueDate(selectedDate);
                    }
                  }}
                />
              )}

              <Text style={styles.label}>Due Time</Text>
              <TouchableOpacity 
                style={styles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.dateTimeIcon}>⏰</Text>
                <Text style={styles.dateTimeText}>
                  {dueTime.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </Text>
              </TouchableOpacity>
              
              {showTimePicker && (
                <DateTimePicker
                  value={dueTime}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedTime) => {
                    setShowTimePicker(Platform.OS === 'ios');
                    if (selectedTime) {
                      setDueTime(selectedTime);
                    }
                  }}
                />
              )}

              <Text style={styles.label}>Priority</Text>
              <View style={styles.priorityButtons}>
                <TouchableOpacity
                  style={[
                    styles.priorityButton,
                    priority === 'low' && styles.priorityButtonActiveLow,
                  ]}
                  onPress={() => setPriority('low')}
                  activeOpacity={0.7}
                >
                  <View style={styles.priorityContent}>
                    <Text style={styles.priorityIcon}>🟢</Text>
                    <Text style={[
                      styles.priorityButtonText, 
                      priority === 'low' && styles.priorityButtonTextActive
                    ]}>
                      Low
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.priorityButton,
                    priority === 'medium' && styles.priorityButtonActiveMedium,
                  ]}
                  onPress={() => setPriority('medium')}
                  activeOpacity={0.7}
                >
                  <View style={styles.priorityContent}>
                    <Text style={styles.priorityIcon}>🟡</Text>
                    <Text style={[
                      styles.priorityButtonText, 
                      priority === 'medium' && styles.priorityButtonTextActive
                    ]}>
                      Medium
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.priorityButton,
                    priority === 'high' && styles.priorityButtonActiveHigh,
                  ]}
                  onPress={() => setPriority('high')}
                  activeOpacity={0.7}
                >
                  <View style={styles.priorityContent}>
                    <Text style={styles.priorityIcon}>🔴</Text>
                    <Text style={[
                      styles.priorityButtonText, 
                      priority === 'high' && styles.priorityButtonTextActive
                    ]}>
                      High
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.formActions}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    resetForm();
                    setMode('view');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={mode === 'add' ? handleAddReminder : handleUpdateReminder}
                >
                  <Text style={styles.saveButtonText}>{mode === 'add' ? 'Add' : 'Update'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },
  addButton: {
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: spacing.md,
  },
  reminderCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  completedCard: {
    opacity: 0.7,
  },
  checkbox: {
    marginRight: spacing.md,
  },
  checkboxText: {
    fontSize: 24,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  reminderDescription: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  reminderMeta: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  reminderPriority: {
    fontSize: 12,
    fontWeight: '600',
  },
  reminderDate: {
    fontSize: 12,
    color: colors.gray[500],
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.gray[500],
  },
  reminderActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    fontSize: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[600],
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.gray[500],
    textAlign: 'center',
  },
  form: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
    gap: spacing.sm,
  },
  dateTimeIcon: {
    fontSize: 20,
  },
  dateTimeText: {
    fontSize: 16,
    color: colors.gray[900],
    fontWeight: '500',
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  priorityButton: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gray[300],
    backgroundColor: colors.white,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  priorityButtonActiveLow: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    shadowColor: '#10B981',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  priorityButtonActiveMedium: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  priorityButtonActiveHigh: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  priorityContent: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  priorityIcon: {
    fontSize: 24,
  },
  priorityButtonText: {
    fontSize: 14,
    color: colors.gray[700],
    fontWeight: '500',
  },
  priorityButtonTextActive: {
    color: colors.gray[900],
    fontWeight: '700',
  },
  formActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  button: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.gray[200],
  },
  cancelButtonText: {
    color: colors.gray[700],
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
