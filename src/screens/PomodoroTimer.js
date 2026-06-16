import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Alert, Animated, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import colors from '../constants/colors';
import spacing from '../constants/spacing';
import { PomodoroContext } from '../context/PomodoroContext';
import { useHeaderAction } from '../context/HeaderContext';
import { useTheme } from '../context/ThemeContext';

export default function PomodoroTimerScreen() {
  const { theme } = useTheme();
  const { setRightAction } = useHeaderAction();
  const { timer, isRunning, startTimer, pauseTimer, resumeTimer, resetTimer, logPartialSession, sessions, updateSession, removeSession, resetSessions, defaultDurations, updateDefaultDurations } = useContext(PomodoroContext);
  const [mode, setMode] = useState(timer.type || 'work');
  const [customMinutes, setCustomMinutes] = useState('25');
  const [customSeconds, setCustomSeconds] = useState('0');
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [cardHeight, setCardHeight] = useState(0);
  const [isDefaultsModalVisible, setIsDefaultsModalVisible] = useState(false);
  const [defaultWorkMinutes, setDefaultWorkMinutes] = useState(String(defaultDurations.work / 60));
  const [defaultShortBreakMinutes, setDefaultShortBreakMinutes] = useState(String(defaultDurations.shortBreak / 60));
  const [defaultLongBreakMinutes, setDefaultLongBreakMinutes] = useState(String(defaultDurations.longBreak / 60));
  const fillAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      setRightAction({
        onPress: () => {
          setDefaultWorkMinutes(String(defaultDurations.work / 60));
          setDefaultShortBreakMinutes(String(defaultDurations.shortBreak / 60));
          setDefaultLongBreakMinutes(String(defaultDurations.longBreak / 60));
          setIsDefaultsModalVisible(true);
        },
        element: <Ionicons name="time-outline" size={24} color={theme.colors.textSecondary} />,
      });
      return () => setRightAction(null);
    }, [theme.colors.textSecondary, defaultDurations])
  );

  const handleSaveDefaultDurations = () => {
    const work = parseInt(defaultWorkMinutes) || 0;
    const shortBreak = parseInt(defaultShortBreakMinutes) || 0;
    const longBreak = parseInt(defaultLongBreakMinutes) || 0;

    if (work <= 0 || shortBreak <= 0 || longBreak <= 0) {
      Alert.alert('Invalid Time', 'Please enter a valid number of minutes greater than 0 for each session type');
      return;
    }

    updateDefaultDurations({ work: work * 60, shortBreak: shortBreak * 60, longBreak: longBreak * 60 });
    setIsDefaultsModalVisible(false);
  };

  // Animate the fill to track elapsed time as the timer ticks down.
  // Drives a translateY transform (native driver) instead of a percentage
  // height, since percentage-height animations inside an overflow:hidden +
  // borderRadius view don't reliably repaint to 100% on Android.
  useEffect(() => {
    const progress = timer.totalSeconds > 0 ? 1 - timer.secondsLeft / timer.totalSeconds : 0;
    if (isRunning) {
      Animated.timing(fillAnim, {
        toValue: 1,
        duration: timer.secondsLeft * 1000,
        useNativeDriver: true,
      }).start();
    } else {
      fillAnim.stopAnimation();
      fillAnim.setValue(progress);
    }
  }, [timer.secondsLeft, timer.totalSeconds, isRunning, fillAnim]);

  // Format secondsLeft as mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Format duration for session history (e.g., "25 min 30 sec")
  const formatDuration = (startTime, endTime) => {
    const durationMs = new Date(endTime).getTime() - new Date(startTime).getTime();
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

  // Label a date as Today, Yesterday, or a formatted date
  const getDateLabel = (dateValue) => {
    const date = new Date(dateValue);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (a, b) =>
      a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

    if (isSameDay(date, today)) return 'Today';
    if (isSameDay(date, yesterday)) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Group sessions (most recent first) into sections by date label
  const groupSessionsByDate = (sessionList) => {
    const groups = [];
    const groupsByLabel = {};
    [...sessionList].reverse().forEach((item) => {
      const label = getDateLabel(item.start);
      if (!groupsByLabel[label]) {
        groupsByLabel[label] = { label, items: [] };
        groups.push(groupsByLabel[label]);
      }
      groupsByLabel[label].items.push(item);
    });
    return groups;
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
    const totalSeconds = defaultDurations[newMode];
    resetTimer();
    startTimer(newMode, totalSeconds);
    setCustomMinutes(String(Math.floor(totalSeconds / 60)));
    setCustomSeconds(String(totalSeconds % 60));
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
      { text: 'Delete', style: 'destructive', onPress: () => removeSession(id) },
    ]);
  };

  const handleEditSessionType = (id, newType) => {
    updateSession(id, { type: newType });
    setEditingSessionId(null);
  };

  const handleStart = () => {
    if (isRunning) {
      pauseTimer();
    } else if (timer.startedAt) {
      resumeTimer();
    } else {
      startTimer(mode, timer.secondsLeft);
    }
  };

  const handleLog = () => {
    if (!timer.sessionStart || timer.totalSeconds === timer.secondsLeft) {
      Alert.alert('Nothing to Log', 'Start the timer before logging a session.');
      return;
    }
    logPartialSession();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Timer Display Card */}
        <View
          style={styles.summaryCard}
          onLayout={(e) => setCardHeight(e.nativeEvent.layout.height)}
        >
          {cardHeight > 0 && (
            <Animated.View
              style={[
                styles.summaryFill,
                {
                  height: cardHeight,
                  transform: [{
                    translateY: fillAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [cardHeight, 0],
                    }),
                  }],
                },
              ]}
            />
          )}
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
          <View style={[styles.customTimeCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.customTimeTitle, { color: theme.colors.text }]}>Set Custom Time</Text>
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
            style={[styles.modeButton, mode === 'work' && { backgroundColor: theme.colors.primary }]}
            onPress={() => switchMode('work')}
          >
            <Text style={styles.modeButtonText}>Work</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'shortBreak' && { backgroundColor: theme.colors.primary }]}
            onPress={() => switchMode('shortBreak')}
          >
            <Text style={styles.modeButtonText}>Short Break</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'longBreak' && { backgroundColor: theme.colors.primary }]}
            onPress={() => switchMode('longBreak')}
          >
            <Text style={styles.modeButtonText}>Long Break</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleStart}
          >
            <Text style={styles.actionButtonText}>{isRunning ? '❙❙ Pause' : timer.startedAt ? '▶︎ Resume' : '▶︎ Start'}</Text>
          </TouchableOpacity>
          <View style={styles.actionButtonSplit}>
            <TouchableOpacity
              style={[styles.actionButtonHalf, { backgroundColor: colors.accent }]}
              onPress={resetTimer}
            >
              <Text style={styles.actionButtonHalfText} numberOfLines={1}>↻ Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButtonHalf, { backgroundColor: colors.accent }]}
              onPress={handleLog}
            >
              <Text style={styles.actionButtonHalfText} numberOfLines={1}>Log</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Session History */}
        <View style={styles.historySection}>
          <Text style={[styles.historyTitle, { color: theme.colors.text }]}>📊 Session History</Text>
          {sessions.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
              <Text style={styles.emptyIcon}>⏱️</Text>
              <Text style={[styles.emptyText, { color: theme.colors.text }]}>No sessions yet</Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>Start a timer session to track your progress</Text>
            </View>
          ) : (
            <View>
              {groupSessionsByDate(sessions).map((group) => (
                <View key={group.label} style={styles.dateGroup}>
                  <Text style={[styles.dateGroupLabel, { color: theme.colors.textSecondary }]}>{group.label}</Text>
                  {group.items.map((item) => (
                    <View key={item.id} style={[styles.sessionItem, { backgroundColor: theme.colors.surface }]}>
                      {editingSessionId === item.id ? (
                        <View style={styles.sessionEditRow}>
                          {['work', 'shortBreak', 'longBreak'].map((typeOption) => (
                            <TouchableOpacity
                              key={typeOption}
                              style={[styles.sessionTypeOption, item.type === typeOption && { backgroundColor: theme.colors.primary }]}
                              onPress={() => handleEditSessionType(item.id, typeOption)}
                            >
                              <Text style={styles.sessionTypeOptionText}>{getSessionLabel(typeOption)}</Text>
                            </TouchableOpacity>
                          ))}
                          <TouchableOpacity onPress={() => setEditingSessionId(null)}>
                            <Text style={styles.cancelText}>✕</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <>
                          <View style={styles.sessionInfo}>
                            <Text style={[styles.sessionLabel, { color: theme.colors.text }]}>{getSessionLabel(item.type)}</Text>
                            <Text style={[styles.sessionDuration, { color: theme.colors.textSecondary }]}>{formatDuration(item.start, item.end)}</Text>
                          </View>
                          <View style={styles.sessionActions}>
                            <TouchableOpacity style={styles.iconButtonEdit} onPress={() => setEditingSessionId(item.id)}>
                              <Ionicons name="pencil-outline" size={16} color={colors.gray[600]} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButtonDelete} onPress={() => handleDeleteSession(item.id)}>
                              <Ionicons name="trash-outline" size={16} color={colors.error} />
                            </TouchableOpacity>
                          </View>
                        </>
                      )}
                    </View>
                  ))}
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

      {/* Default Durations Modal */}
      <Modal
        visible={isDefaultsModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDefaultsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Default Session Lengths</Text>

            <View style={styles.defaultDurationRow}>
              <Text style={[styles.defaultDurationLabel, { color: theme.colors.text }]}>Work</Text>
              <TextInput
                style={[styles.defaultDurationInput, { color: theme.colors.text, borderColor: theme.colors.border }]}
                value={defaultWorkMinutes}
                onChangeText={setDefaultWorkMinutes}
                keyboardType="number-pad"
                maxLength={3}
              />
              <Text style={[styles.defaultDurationUnit, { color: theme.colors.textSecondary }]}>min</Text>
            </View>

            <View style={styles.defaultDurationRow}>
              <Text style={[styles.defaultDurationLabel, { color: theme.colors.text }]}>Short Break</Text>
              <TextInput
                style={[styles.defaultDurationInput, { color: theme.colors.text, borderColor: theme.colors.border }]}
                value={defaultShortBreakMinutes}
                onChangeText={setDefaultShortBreakMinutes}
                keyboardType="number-pad"
                maxLength={3}
              />
              <Text style={[styles.defaultDurationUnit, { color: theme.colors.textSecondary }]}>min</Text>
            </View>

            <View style={styles.defaultDurationRow}>
              <Text style={[styles.defaultDurationLabel, { color: theme.colors.text }]}>Long Break</Text>
              <TextInput
                style={[styles.defaultDurationInput, { color: theme.colors.text, borderColor: theme.colors.border }]}
                value={defaultLongBreakMinutes}
                onChangeText={setDefaultLongBreakMinutes}
                keyboardType="number-pad"
                maxLength={3}
              />
              <Text style={[styles.defaultDurationUnit, { color: theme.colors.textSecondary }]}>min</Text>
            </View>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.gray[300] }]}
                onPress={() => setIsDefaultsModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleSaveDefaultDurations}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    overflow: 'hidden',
    position: 'relative',
  },
  summaryFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
  actionButtonSplit: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButtonHalf: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  actionButtonHalfText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 13,
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
  dateGroup: {
    marginBottom: spacing.sm,
  },
  dateGroupLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
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
    fontSize: 16,
  },
  sessionActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  editText: {
    color: colors.gray[600],
    fontWeight: '600',
    fontSize: 16,
  },
  iconButtonEdit: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonDelete: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDE8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionEditRow: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  sessionTypeOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: 6,
    backgroundColor: colors.gray[300],
    alignItems: 'center',
  },
  sessionTypeOptionText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 11,
  },
  cancelText: {
    color: colors.gray[600],
    fontWeight: '600',
    fontSize: 16,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  defaultDurationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  defaultDurationLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray[900],
  },
  defaultDurationInput: {
    width: 64,
    padding: spacing.sm,
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    marginRight: spacing.sm,
  },
  defaultDurationUnit: {
    fontSize: 13,
    color: colors.gray[600],
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  modalButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
});

