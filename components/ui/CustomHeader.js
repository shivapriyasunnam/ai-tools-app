import { colors } from '@/src/constants';
import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TOOLS = [
  { name: 'Hub', route: '/(tabs)/hub', icon: 'grid' },
  { name: 'Activity', route: '/(tabs)/recent-activity', icon: 'time' },
  { name: 'Profile', route: '/(tabs)/profile', icon: 'person' },
  { name: 'Budget Planner', route: '/(tabs)/budget-planner', icon: 'pie-chart' },
  { name: 'Expense Tracker', route: '/(tabs)/expense-tracker', icon: 'wallet' },
  { name: 'Pomodoro Timer', route: '/(tabs)/pomodoro-timer', icon: 'timer' },
  { name: 'Income Tracker', route: '/(tabs)/income-tracker', icon: 'cash' },
  { name: 'To-Do List', route: '/(tabs)/todo-list', icon: 'checkbox' },
  { name: 'Quick Notes', route: '/(tabs)/quick-notes', icon: 'document-text' },
  { name: 'Reminders', route: '/(tabs)/reminders', icon: 'notifications' },
  { name: 'Calculator', route: '/(tabs)/calculator', icon: 'calculator' },
  { name: 'Meetings Scheduler', route: '/(tabs)/meetings-scheduler', icon: 'calendar' },
];

const PAGE_TITLES = {
  '/(tabs)/hub': 'Hub',
  '/(tabs)/recent-activity': 'Activity',
  '/(tabs)/profile': 'Profile',
  '/(tabs)/index': 'Home',
  '/(tabs)/settings': 'Settings',
};

function getPageTitle(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  // Fallback: use last segment, capitalize
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0) {
    const last = segments[segments.length - 1].replace(/-/g, ' ');
    return last.charAt(0).toUpperCase() + last.slice(1);
  }
  return '';
}

export default function CustomHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [modalVisible, setModalVisible] = useState(false);
  const { theme } = useTheme();
  const { signOut } = useAuth();

  // Close modal when route changes
  useEffect(() => {
    setModalVisible(false);
  }, [pathname]);

  // Find the tool in the dropdown list
  const currentTool = TOOLS.find(tool => pathname.endsWith(tool.route.replace('/(tabs)', '')) || pathname === tool.route);
  const currentTitle = currentTool ? currentTool.name : getPageTitle(pathname);

  const handleSelectTool = (route) => {
    setModalVisible(false);
    if (pathname !== route) {
      router.push(route);
    }
  };

  const isSettingsPage = pathname.endsWith('/settings');

  const goToSettings = () => {
    router.push('/(tabs)/settings');
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.surface }}>
      <View style={[styles.header, { paddingTop: statusBarHeight, backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          style={[styles.dropdown, { backgroundColor: theme.colors.primary }]}
          onPress={() => currentTool && setModalVisible(true)}
          disabled={!currentTool}
        >
          <Text style={styles.dropdownText}>{currentTitle}</Text>
          {currentTool && <Ionicons name="chevron-down" size={15} color="#fff" />}
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        {isSettingsPage ? (
          <TouchableOpacity onPress={handleLogout} style={styles.settingsBtn}>
            <Ionicons name="log-out-outline" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={goToSettings} style={styles.settingsBtn}>
            <Ionicons name="settings-outline" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)} activeOpacity={1}>
            <View style={[styles.menuContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <FlatList
                data={TOOLS}
                keyExtractor={item => item.route}
                key="tools-grid-3"
                numColumns={3}
                scrollEnabled={false}
                contentContainerStyle={styles.gridContent}
                renderItem={({ item }) => {
                  const isActive = pathname.endsWith(item.route.replace('/(tabs)', ''));
                  return (
                    <TouchableOpacity
                      style={styles.gridItem}
                      onPress={() => handleSelectTool(item.route)}
                      activeOpacity={0.7}
                    >
                      <View style={[
                        styles.gridIconBox,
                        { backgroundColor: isActive ? theme.colors.primary : theme.colors.primary + '15' },
                      ]}>
                        <Ionicons
                          name={item.icon}
                          size={28}
                          color={isActive ? '#fff' : theme.colors.primary}
                        />
                      </View>
                      <Text style={[styles.gridItemText, { color: theme.colors.text }]} numberOfLines={2}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    elevation: 0,
    shadowOpacity: 0,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  dropdownText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginRight: 6,
  },
  settingsBtn: {
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 24,
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: '#B6E3FA',
    overflow: 'hidden',
  },
  gridContent: {
    padding: 12,
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  gridIconBox: {
    width: 62,
    height: 62,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 7,
  },
  gridItemText: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 14,
  },
});
