import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { colors, spacing } from '@/src/constants';
import { connectGoogleCalendar, connectOutlookCalendar, disconnectCalendar, getStoredToken } from '@/src/services/calendarAuth';

export default function MeetingsSchedulerScreen() {
  const [connectedCalendars, setConnectedCalendars] = useState({
    googleMeet: false,
    outlookCalendar: false,
  });
  const [loading, setLoading] = useState({
    googleMeet: false,
    outlookCalendar: false,
  });

  useEffect(() => {
    checkStoredTokens();
  }, []);

  const checkStoredTokens = async () => {
    try {
      const googleToken = await getStoredToken('google');
      const outlookToken = await getStoredToken('microsoft');
      
      setConnectedCalendars({
        googleMeet: !!googleToken,
        outlookCalendar: !!outlookToken,
      });
    } catch (error) {
      console.error('Error checking tokens:', error);
    }
  };

  const handleGoogleMeetConnect = async () => {
    if (connectedCalendars.googleMeet) {
      Alert.alert(
        'Disconnect Google Meet',
        'Are you sure you want to disconnect your Google Meet calendar?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disconnect',
            style: 'destructive',
            onPress: async () => {
              setLoading({ ...loading, googleMeet: true });
              const success = await disconnectCalendar('google');
              setLoading({ ...loading, googleMeet: false });
              if (success) {
                setConnectedCalendars({ ...connectedCalendars, googleMeet: false });
                Alert.alert('Success', 'Google Meet calendar disconnected');
              }
            },
          },
        ]
      );
      return;
    }

    setLoading({ ...loading, googleMeet: true });
    try {
      const result = await connectGoogleCalendar();
      setLoading({ ...loading, googleMeet: false });
      
      if (result.success) {
        setConnectedCalendars({ ...connectedCalendars, googleMeet: true });
        Alert.alert('Success', `Connected! Found ${result.meetings.length} upcoming meetings`);
      } else {
        Alert.alert('Error', result.error || 'Failed to connect Google Meet calendar');
      }
    } catch (error) {
      setLoading({ ...loading, googleMeet: false });
      Alert.alert('Error', error.message || 'Failed to connect Google Meet calendar');
    }
  };

  const handleOutlookConnect = async () => {
    if (connectedCalendars.outlookCalendar) {
      Alert.alert(
        'Disconnect Outlook Calendar',
        'Are you sure you want to disconnect your Outlook calendar?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disconnect',
            style: 'destructive',
            onPress: async () => {
              setLoading({ ...loading, outlookCalendar: true });
              const success = await disconnectCalendar('microsoft');
              setLoading({ ...loading, outlookCalendar: false });
              if (success) {
                setConnectedCalendars({ ...connectedCalendars, outlookCalendar: false });
                Alert.alert('Success', 'Outlook calendar disconnected');
              }
            },
          },
        ]
      );
      return;
    }

    setLoading({ ...loading, outlookCalendar: true });
    try {
      const result = await connectOutlookCalendar();
      setLoading({ ...loading, outlookCalendar: false });
      
      if (result.success) {
        setConnectedCalendars({ ...connectedCalendars, outlookCalendar: true });
        Alert.alert('Success', `Connected! Found ${result.meetings.length} upcoming meetings`);
      } else {
        Alert.alert('Error', result.error || 'Failed to connect Outlook calendar');
      }
    } catch (error) {
      setLoading({ ...loading, outlookCalendar: false });
      Alert.alert('Error', error.message || 'Failed to connect Outlook calendar');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>📅 Connect Your Calendar</Text>
        <Text style={styles.subtitle}>Choose a calendar provider to sync your meetings</Text>

        {/* Google Meet Card */}
        <TouchableOpacity
          onPress={handleGoogleMeetConnect}
          disabled={connectedCalendars.googleMeet}
          style={[
            styles.calendarCard,
            connectedCalendars.googleMeet && styles.cardConnected,
          ]}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.calendarIcon}>🔵</Text>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.calendarName}>Google Meet</Text>
              <Text style={styles.calendarDescription}>Sync Google Calendar meetings</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.connectButton,
              {
                backgroundColor: connectedCalendars.googleMeet ? colors.accent : colors.primary,
              },
            ]}
          >
            {loading.googleMeet ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.connectButtonText}>
                {connectedCalendars.googleMeet ? '✓ Connected' : 'Connect'}
              </Text>
            )}
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Outlook Card */}
        <TouchableOpacity
          onPress={handleOutlookConnect}
          disabled={connectedCalendars.outlookCalendar}
          style={[
            styles.calendarCard,
            connectedCalendars.outlookCalendar && styles.cardConnected,
          ]}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.calendarIcon}>🟦</Text>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.calendarName}>Outlook Calendar</Text>
              <Text style={styles.calendarDescription}>Sync Microsoft Outlook meetings</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.connectButton,
              {
                backgroundColor: connectedCalendars.outlookCalendar ? colors.accent : colors.primary,
              },
            ]}
          >
            {loading.outlookCalendar ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.connectButtonText}>
                {connectedCalendars.outlookCalendar ? '✓ Connected' : 'Connect'}
              </Text>
            )}
          </TouchableOpacity>
        </TouchableOpacity>

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
