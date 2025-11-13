import { useContext, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import colors from '../constants/colors';
import spacing from '../constants/spacing';
import { PomodoroContext } from '../context/PomodoroContext';

export default function PomodoroTimerScreen() {
  const { timer, isRunning, startTimer, resetTimer, sessions, resetSessions } = useContext(PomodoroContext);
  const [mode, setMode] = useState(timer.type || 'work');
  const [customMinutes, setCustomMinutes] = useState('25');
  const [customSeconds, setCustomSeconds] = useState('0');
  const [isEditingTime, setIsEditingTime] = useState(false);

  // Format secondsLeft as mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Format duration for session history (e.g., "25 min 30 sec")
  const formatDuration = (startTime, endTime) => {
    const durationMs = endTime - startTime;
    const totalSeconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    if (minutes === 0) {
      return `${seconds} sec`;
    } else if (seconds === 0) {
      return `${minutes} min`;
    } else {
      return `${minutes} min ${seconds} sec`;
    }
  };

  // Get session type label
  const getSessionLabel = (type) => {
    switch(type) {
      case 'work':
        return 'Work Session';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return type || 'Session';
    }
  };

  // Switch mode handler
  const switchMode = (newMode) => {
    setMode(newMode);
    let defaultMinutes, defaultSeconds;
    if (newMode === 'work') {
      defaultMinutes = '25';
      defaultSeconds = '0';
      resetTimer();
      startTimer('work', 1500);
    } else if (newMode === 'shortBreak') {
      defaultMinutes = '5';
      defaultSeconds = '0';
      resetTimer();
      startTimer('shortBreak', 300);
    } else if (newMode === 'longBreak') {
      defaultMinutes = '15';
      defaultSeconds = '0';
      resetTimer();
      startTimer('longBreak', 900);
    }
    setCustomMinutes(defaultMinutes);
    setCustomSeconds(defaultSeconds);
    setIsEditingTime(false);
  };

  const handleSetCustomTime = () => {
    const minutes = parseInt(customMinutes) || 0;
    const seconds = parseInt(customSeconds) || 0;
    
    if (minutes === 0 && seconds === 0) {
      Alert.alert('Invalid Time', 'Please enter a valid time greater than 0');
      return;
    }
    
    if (minutes > 180) {
      Alert.alert('Time Too Long', 'Please enter a time less than 180 minutes');
      return;
    }
    
    const totalSeconds = (minutes * 60) + seconds;
    resetTimer();
    startTimer(mode, totalSeconds);
    setIsEditingTime(false);
    Alert.alert('Success', `Timer set to ${minutes}m ${seconds}s`);
  };

  const handleDeleteSession = (id) => {
    Alert.alert('Delete Session', 'Are you sure you want to delete this session?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => resetSessions(id) },
    ]);
  };

  const handleStart = () => {
    if (!isRunning) {
      startTimer();
    } else {
      resetTimer();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <Text style={styles.title}>⏱️ Pomodoro Timer</Text>

        {/* Timer Display Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>
            {mode === 'work' ? 'Work Session' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
          </Text>
          <Text style={styles.summaryAmount}>{formatTime(timer.secondsLeft)}</Text>
          <TouchableOpacity 
            onPress={() => setIsEditingTime(!isEditingTime)}
            style={styles.editTimeButton}
          >
            <Text style={styles.editTimeButtonText}>
              {isEditingTime ? '✓ Done Editing' : 'Edit Time'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Custom Time Input */}
        {isEditingTime && (
          <View style={styles.customTimeCard}>
            <Text style={styles.customTimeTitle}>Set Custom Time</Text>
            <View style={styles.timeInputRow}>
              <View style={styles.timeInputGroup}>
                <Text style={styles.timeInputLabel}>Minutes</Text>
                <TextInput
                  style={styles.timeInput}
                  value={customMinutes}
                  onChangeText={setCustomMinutes}
                  keyboardType="number-pad"
                  placeholder="25"
                  placeholderTextColor={colors.gray[400]}
                  maxLength={3}
                />
              </View>
              <Text style={styles.timeSeparator}>:</Text>
              <View style={styles.timeInputGroup}>
                <Text style={styles.timeInputLabel}>Seconds</Text>
                <TextInput
                  style={styles.timeInput}
                  value={customSeconds}
                  onChangeText={setCustomSeconds}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor={colors.gray[400]}
                  maxLength={2}
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.setTimeButton}
              onPress={handleSetCustomTime}
            >
              <Text style={styles.setTimeButtonText}>Set Timer</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Mode Selection Buttons */}
        <View style={styles.modeSelector}>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'work' && { backgroundColor: colors.primary }]}
            onPress={() => switchMode('work')}
          >
            <Text style={styles.modeButtonText}>Work</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'shortBreak' && { backgroundColor: colors.primary }]}
            onPress={() => switchMode('shortBreak')}
          >
            <Text style={styles.modeButtonText}>Short Break</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'longBreak' && { backgroundColor: colors.primary }]}
            onPress={() => switchMode('longBreak')}
          >
            <Text style={styles.modeButtonText}>Long Break</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={handleStart}
          >
            <Text style={styles.actionButtonText}>{isRunning ? '⏸ Pause' : '▶ Start'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.accent }]}
            onPress={resetTimer}
          >
            <Text style={styles.actionButtonText}>🔄 Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Session History */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>📊 Session History</Text>
          {sessions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>⏱️</Text>
              <Text style={styles.emptyText}>No sessions yet</Text>
              <Text style={styles.emptySubtext}>Start a timer session to track your progress</Text>
            </View>
          ) : (
            <View>
              {sessions.map((item) => (
                <View key={item.id} style={styles.sessionItem}>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionLabel}>{getSessionLabel(item.type)}</Text>
                    <Text style={styles.sessionDuration}>{formatDuration(item.start, item.end)}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDeleteSession(item.id)}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  Alert.alert(
                    'Clear All Sessions',
                    'Are you sure you want to clear all session history?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Clear All', style: 'destructive', onPress: () => resetSessions() },
                    ]
                  );
                }}
              >
                <Text style={styles.clearButtonText}>Clear All History</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  scrollContent: {
    padding: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: spacing.lg,
  },
  summaryCard: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.gray[100],
    marginBottom: spacing.sm,
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.white,
  },
  editTimeButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
  },
  editTimeButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  customTimeCard: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  customTimeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  timeInputGroup: {
    alignItems: 'center',
  },
  timeInputLabel: {
    fontSize: 12,
    color: colors.gray[600],
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  timeInput: {
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 24,
    fontWeight: '700',
    color: colors.gray[900],
    textAlign: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  timeSeparator: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.gray[900],
    marginHorizontal: spacing.md,
  },
  setTimeButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  setTimeButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  timerType: {
    fontSize: 12,
    color: colors.gray[200],
    marginTop: spacing.xs,
  },
  modeSelector: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  modeButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: colors.gray[300],
  },
  modeButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  actionButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  historySection: {
    marginTop: spacing.md,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 4,
  },
  sessionDuration: {
    fontSize: 13,
    color: colors.gray[600],
  },
  deleteText: {
    color: colors.error,
    fontWeight: '600',
    fontSize: 13,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: 8,
    marginTop: spacing.sm,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: 13,
    color: colors.gray[500],
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  clearButton: {
    backgroundColor: colors.error,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  clearButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
});

