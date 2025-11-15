import { spacing } from '@/src/constants';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SettingsScreen() {
  const { isDarkMode, setDarkMode, theme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(false);

  // Sync local state with theme context
  useEffect(() => {
    // No need to do anything, just read from context
  }, [isDarkMode]);

  const showComingSoon = (feature) => {
    Alert.alert('Coming Soon', `${feature} feature will be available in a future update!`);
  };

  const handleToggleNotifications = (value) => {
    showComingSoon('Push Notifications');
  };

  const handleToggleSound = (value) => {
    showComingSoon('Sound Settings');
  };

  const handleToggleDarkMode = (value) => {
    showComingSoon('Dark Mode');
  };

  const handleToggleAutoBackup = (value) => {
    showComingSoon('Auto Backup');
  };

  const handleClearData = () => {
    showComingSoon('Clear All Data');
  };

  const handleExportData = () => {
    showComingSoon('Export Data');
  };

  const handleImportData = () => {
    showComingSoon('Import Data');
  };

  const handleAbout = () => {
    Alert.alert(
      'About',
      'AI Tools App v1.0.0\n\nA productivity suite to help you manage your daily tasks, finances, and time.',
      [{ text: 'OK' }]
    );
  };

  const renderSettingItem = (icon, title, subtitle, rightComponent) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '15' }]}>
          <Ionicons name={icon} size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: theme.colors.text }]}>{title}</Text>
          {subtitle && <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent}
    </View>
  );

  const renderToggleItem = (icon, title, subtitle, value, onValueChange) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '15' }]}>
          <Ionicons name={icon} size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: theme.colors.text }]}>{title}</Text>
          {subtitle && <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text>}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.colors.gray[300], true: theme.colors.primary + '40' }}
        thumbColor={value ? theme.colors.primary : theme.colors.gray[400]}
      />
    </View>
  );

  const renderButtonItem = (icon, title, subtitle, onPress, danger = false) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.settingLeft}>
        <View style={[
          styles.iconContainer,
          { backgroundColor: danger ? (theme.colors.error + '15') : (theme.colors.primary + '15') }
        ]}>
          <Ionicons name={icon} size={24} color={danger ? theme.colors.error : theme.colors.primary} />
        </View>
        <View style={styles.settingText}>
          <Text style={[
            styles.settingTitle,
            { color: danger ? theme.colors.error : theme.colors.text }
          ]}>{title}</Text>
          {subtitle && <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text>}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.gray[400]} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Notifications Section */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Notifications</Text>
          {renderToggleItem(
            'notifications-outline',
            'Push Notifications',
            'Receive notifications for reminders and tasks',
            notificationsEnabled,
            handleToggleNotifications
          )}
          {renderToggleItem(
            'volume-high-outline',
            'Sound',
            'Play sound with notifications',
            soundEnabled,
            handleToggleSound
          )}
        </View>

        {/* Appearance Section */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Appearance</Text>
          {renderToggleItem(
            'moon-outline',
            'Dark Mode',
            'Enable dark theme',
            isDarkMode,
            handleToggleDarkMode
          )}
        </View>

        {/* Data & Storage Section */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Data & Storage</Text>
          {renderToggleItem(
            'cloud-upload-outline',
            'Auto Backup',
            'Automatically backup your data',
            autoBackupEnabled,
            handleToggleAutoBackup
          )}
          {renderButtonItem(
            'download-outline',
            'Export Data',
            'Export all your data to a file',
            handleExportData
          )}
          {renderButtonItem(
            'cloud-download-outline',
            'Import Data',
            'Import data from a file',
            handleImportData
          )}
        </View>

        {/* About Section */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>About</Text>
          {renderButtonItem(
            'information-circle-outline',
            'About App',
            'Version and app information',
            handleAbout
          )}
          {renderButtonItem(
            'document-text-outline',
            'Privacy Policy',
            'Read our privacy policy',
            () => showComingSoon('Privacy Policy')
          )}
          {renderButtonItem(
            'shield-checkmark-outline',
            'Terms of Service',
            'Read our terms of service',
            () => showComingSoon('Terms of Service')
          )}
        </View>

        {/* Danger Zone */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Danger Zone</Text>
          {renderButtonItem(
            'trash-outline',
            'Clear All Data',
            'Delete all app data permanently',
            handleClearData,
            true
          )}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>AI Tools App v1.0.0</Text>
          <Text style={[styles.footerSubtext, { color: theme.colors.textSecondary }]}>Made with ❤️ for productivity</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  section: {
    marginBottom: spacing.lg,
    borderRadius: 12,
    padding: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
    marginTop: spacing.xs,
    marginLeft: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
  },
});
