import { useContext, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../constants/colors';
import spacing from '../constants/spacing';
import { PomodoroContext } from '../context/PomodoroContext';

export default function PomodoroTimerScreen() {
  const { timer, isRunning, startTimer, resetTimer, sessions, resetSessions } = useContext(PomodoroContext);
  const [mode, setMode] = useState(timer.type || 'work');

  // Format secondsLeft as mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Switch mode handler
  const switchMode = (newMode) => {
    setMode(newMode);
    if (newMode === 'work') {
      resetTimer();
      startTimer('work', 1500);
    } else if (newMode === 'shortBreak') {
      resetTimer();
      startTimer('shortBreak', 300);
    } else if (newMode === 'longBreak') {
      resetTimer();
      startTimer('longBreak', 900);
    }
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
          <Text style={styles.timerType}>{mode === 'work' ? '25:00' : mode === 'shortBreak' ? '5:00' : '15:00'}</Text>
        </View>

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
                    <Text style={styles.sessionLabel}>{item.label}</Text>
                    <Text style={styles.sessionDuration}>{item.duration} min</Text>
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

