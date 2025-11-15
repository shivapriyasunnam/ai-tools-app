import { colors, spacing } from '@/src/constants';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MeetingsSchedulerScreen() {
  const handleGoogleMeetConnect = async () => {
    Alert.alert('Coming Soon', 'Google Meet calendar integration will be available soon!');
  };

  const handleOutlookConnect = async () => {
    Alert.alert('Coming Soon', 'Outlook calendar integration will be available soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>📅 Connect Your Calendar</Text>
        <Text style={styles.subtitle}>Choose a calendar provider to sync your meetings</Text>

        {/* Google Meet Card */}
        <View style={styles.calendarCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.calendarIcon}>🔵</Text>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.calendarName}>Google Meet</Text>
              <Text style={styles.calendarDescription}>Sync Google Calendar meetings</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.connectButton, { backgroundColor: colors.primary }]}
            onPress={handleGoogleMeetConnect}
          >
            <Text style={styles.connectButtonText}>Connect</Text>
          </TouchableOpacity>
        </View>

        {/* Outlook Card */}
        <View style={styles.calendarCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.calendarIcon}>🟦</Text>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.calendarName}>Outlook Calendar</Text>
              <Text style={styles.calendarDescription}>Sync Microsoft Outlook meetings</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.connectButton, { backgroundColor: colors.primary }]}
            onPress={handleOutlookConnect}
          >
            <Text style={styles.connectButtonText}>Connect</Text>
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            🔒 Your calendar data is secure and only used to sync your meetings.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray[500],
    marginBottom: spacing.lg,
  },
  calendarCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  cardConnected: {
    borderColor: colors.accent,
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  calendarIcon: {
    fontSize: 32,
  },
  cardTitleContainer: {
    flex: 1,
  },
  calendarName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  calendarDescription: {
    fontSize: 12,
    color: colors.gray[500],
  },
  connectButton: {
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
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
