import { colors, spacing } from '@/src/constants';
import { useMeetings } from '@/src/context/MeetingsContext';
import { useTheme } from '@/src/context/ThemeContext';
import {
  connectGoogleCalendar,
  disconnectGoogleCalendar,
  fetchGoogleCalendarEvents,
  getValidCalendarToken,
} from '@/src/services/calendarAuth';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// ─── Google Calendar Icon ────────────────────────────────────────────────────

function GoogleCalendarIcon({ size = 44 }) {
  return (
    <View style={[gcIcon.wrapper, { width: size, height: size, borderRadius: size * 0.23 }]}>
      <View style={gcIcon.topBar} />
      <Text style={[gcIcon.dateText, { fontSize: size * 0.34 }]}>31</Text>
      <View style={gcIcon.dotsRow}>
        <View style={[gcIcon.dot, { backgroundColor: '#4285F4' }]} />
        <View style={[gcIcon.dot, { backgroundColor: '#EA4335' }]} />
        <View style={[gcIcon.dot, { backgroundColor: '#FBBC05' }]} />
        <View style={[gcIcon.dot, { backgroundColor: '#34A853' }]} />
      </View>
    </View>
  );
}

const gcIcon = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '25%',
    backgroundColor: '#EA4335',
  },
  dateText: {
    fontWeight: '700',
    color: '#1A73E8',
    marginTop: '12%',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 3,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatEventTime(isoString, isAllDay) {
  if (isAllDay) return 'All day';
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatDayHeader(isoString) {
  const d = new Date(isoString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(d, today)) return 'Today';
  if (isSameDay(d, tomorrow)) return 'Tomorrow';
  return `${DAY_NAMES[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
}

function groupEventsByDay(events) {
  const groups = {};
  for (const event of events) {
    const dateKey = (event.start ?? '').slice(0, 10);
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(event);
  }
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function MeetingsSchedulerScreen() {
  const { theme } = useTheme();
  const { saveMeetings } = useMeetings();

  const [status, setStatus] = useState('checking'); // 'checking' | 'disconnected' | 'expired' | 'connected'
  const [events, setEvents] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Re-check every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      checkAndLoadEvents();
    }, [])
  );

  const checkAndLoadEvents = async () => {
    setStatus('checking');
    const token = await getValidCalendarToken();
    if (!token) {
      // If we have cached events it means we were connected before — show expired state
      setStatus(events.length > 0 ? 'expired' : 'disconnected');
      return;
    }
    await syncEvents(token);
    setStatus('connected');
  };

  const syncEvents = async (token) => {
    try {
      const fetched = await fetchGoogleCalendarEvents(token);
      setEvents(fetched);
      await saveMeetings(fetched);
    } catch (err) {
      console.error('Sync error:', err);
      Alert.alert('Sync failed', 'Could not fetch calendar events. Please try again.');
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const result = await connectGoogleCalendar();
      if (result.success) {
        setEvents(result.events);
        await saveMeetings(result.events);
        setStatus('connected');
      } else if (result.error !== 'Cancelled') {
        Alert.alert('Connection failed', result.error ?? 'Could not connect to Google Calendar.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const token = await getValidCalendarToken();
      if (!token) {
        setStatus('expired');
        return;
      }
      await syncEvents(token);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnect = () => {
    Alert.alert(
      'Disconnect Google Calendar',
      'Your synced events will be removed. You can reconnect at any time.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            await disconnectGoogleCalendar();
            await saveMeetings([]);
            setEvents([]);
            setStatus('disconnected');
          },
        },
      ]
    );
  };

  // ── Render states ──────────────────────────────────────────────────────────

  if (status === 'checking') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.checkingText}>Loading calendar…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (status === 'expired') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Session Expired</Text>
          <Text style={styles.subtitle}>Your calendar session expired. Reconnect to keep syncing.</Text>

          <View style={styles.calendarCard}>
            <View style={styles.cardHeader}>
              <GoogleCalendarIcon size={44} />
              <View style={styles.cardTitleContainer}>
                <Text style={styles.calendarName}>Google Calendar</Text>
                <Text style={[styles.calendarDescription, { color: '#F59E0B' }]}>Session expired</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.connectButton, { backgroundColor: theme.colors.primary }, isConnecting && styles.connectButtonDisabled]}
              onPress={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.connectButtonText}>Reconnect</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (status === 'disconnected') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Connect Your Calendar</Text>
          <Text style={styles.subtitle}>Sync your Google Calendar to see upcoming meetings</Text>

          <View style={styles.calendarCard}>
            <View style={styles.cardHeader}>
              <GoogleCalendarIcon size={44} />
              <View style={styles.cardTitleContainer}>
                <Text style={styles.calendarName}>Google Calendar</Text>
                <Text style={styles.calendarDescription}>Sync your Google Calendar events</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.connectButton, { backgroundColor: theme.colors.primary }, isConnecting && styles.connectButtonDisabled]}
              onPress={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.connectButtonText}>Connect</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={[styles.infoBox, { backgroundColor: theme.colors.primary + '10', borderLeftColor: theme.colors.primary }]}>
            <Text style={styles.infoText}>
              🔒 Your calendar data is secure and only used to sync your meetings.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Connected view ─────────────────────────────────────────────────────────

  const dayGroups = groupEventsByDay(events);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isSyncing}
            onRefresh={handleSync}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Connected header */}
        <View style={[styles.connectedHeader, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.connectedLeft}>
            <GoogleCalendarIcon size={40} />
            <View style={{ marginLeft: 12 }}>
              <Text style={[styles.connectedTitle, { color: theme.colors.text }]}>Google Calendar</Text>
              <View style={styles.connectedBadge}>
                <View style={styles.connectedDot} />
                <Text style={styles.connectedBadgeText}>Connected</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={handleDisconnect}>
            <Text style={styles.disconnectText}>Disconnect</Text>
          </TouchableOpacity>
        </View>

        {/* Sync row */}
        <View style={styles.syncRow}>
          <Text style={[styles.upcomingLabel, { color: theme.colors.text }]}>
            {events.length === 0
              ? 'No upcoming events'
              : `${events.length} event${events.length !== 1 ? 's' : ''} in the next 2 weeks`}
          </Text>
          <TouchableOpacity onPress={handleSync} disabled={isSyncing} style={[styles.syncButton, { borderColor: theme.colors.primary }]}>
            {isSyncing ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <Text style={[styles.syncButtonText, { color: theme.colors.primary }]}>Sync</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Events list */}
        {dayGroups.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📅</Text>
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>All clear!</Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>No events in the next 2 weeks.</Text>
          </View>
        ) : (
          dayGroups.map(([dateKey, dayEvents]) => (
            <View key={dateKey}>
              <Text style={[styles.dayHeader, { color: theme.colors.textSecondary }]}>{formatDayHeader(dayEvents[0].start)}</Text>
              {dayEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </View>
          ))
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Pull down to refresh · Events shown for the next 2 weeks
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function EventCard({ event }) {
  const { theme } = useTheme();
  const startTime = formatEventTime(event.start, event.isAllDay);
  const endTime = event.isAllDay ? null : formatEventTime(event.end, false);

  return (
    <View style={[styles.eventCard, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.eventAccent} />
      <View style={styles.eventBody}>
        <Text style={[styles.eventTitle, { color: theme.colors.text }]} numberOfLines={2}>{event.title}</Text>
        <View style={styles.eventMeta}>
          <Text style={[styles.eventTime, { color: theme.colors.textSecondary }]}>
            {endTime ? `${startTime} – ${endTime}` : startTime}
          </Text>
          {event.organizer ? (
            <View style={styles.organizerChip}>
              <Text style={styles.organizerText} numberOfLines={1}>{event.organizer}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  checkingText: {
    fontSize: 14,
    color: colors.gray[500],
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 40,
  },

  // ── Disconnected ──
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray[500],
    marginBottom: spacing.lg,
  },
  calendarCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  cardTitleContainer: {
    flex: 1,
  },
  calendarName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 2,
  },
  calendarDescription: {
    fontSize: 12,
    color: colors.gray[500],
  },
  connectButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  connectButtonDisabled: {
    opacity: 0.6,
  },
  connectButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },

  // ── Connected header ──
  connectedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  connectedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectedTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 4,
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  connectedDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  connectedBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#16A34A',
  },
  disconnectText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray[400],
  },

  // ── Sync row ──
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  upcomingLabel: {
    fontSize: 13,
    color: colors.gray[500],
    flex: 1,
  },
  syncButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    minWidth: 60,
    alignItems: 'center',
  },
  syncButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },

  // ── Day header ──
  dayHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 8,
  },

  // ── Event card ──
  eventCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  eventAccent: {
    width: 4,
    backgroundColor: '#1A73E8',
  },
  eventBody: {
    flex: 1,
    padding: 12,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 6,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  eventTime: {
    fontSize: 12,
    color: colors.gray[500],
  },
  organizerChip: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    maxWidth: 180,
  },
  organizerText: {
    fontSize: 11,
    color: '#4F46E5',
    fontWeight: '500',
  },

  // ── Empty state ──
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.gray[500],
  },

  // ── Info box ──
  infoBox: {
    backgroundColor: colors.primary + '10',
    borderRadius: 8,
    padding: spacing.md,
    marginTop: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  infoText: {
    fontSize: 12,
    color: colors.gray[700],
    fontWeight: '500',
  },
});
