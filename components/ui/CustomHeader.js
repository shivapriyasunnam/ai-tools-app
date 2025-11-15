import { colors } from '@/src/constants';
import { Ionicons } from '@expo/vector-icons';
// removed duplicate import
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Modal, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

  const goToSettings = () => {
    router.push('/(tabs)/settings');
  };

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
  return (
    <SafeAreaView style={{ backgroundColor: '#fff' }}>
      <View style={[styles.header, { paddingTop: statusBarHeight }]}>  
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => currentTool && setModalVisible(true)}
          disabled={!currentTool}
        >
          <Text style={styles.dropdownText}>{currentTitle}</Text>
          {currentTool && <Ionicons name="chevron-down" size={15} color="#fff" />}
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={goToSettings} style={styles.settingsBtn}>
          <Ionicons name="settings-outline" size={24} color={colors.gray[700]} />
        </TouchableOpacity>
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)} activeOpacity={1}>
            <View style={styles.menuContainer}>
              <FlatList
                data={TOOLS}
                keyExtractor={item => item.route}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={({ pressed }) => [
                      styles.menuItem,
                      pressed && styles.menuItemActive,
                    ]}
                    onPress={() => handleSelectTool(item.route)}
                  >
                    <View style={{ flexDirection: 'row',
                        paddingLeft: 15,
                        padding: 8,
                         alignItems: 'center', flex: 1 }}>
                      <Ionicons
                        name={item.icon}
                        size={35}
                        color={colors.gray[400]}
                        style={styles.menuIcon}
                      />
                      <Text style={styles.menuItemText} numberOfLines={1}>
                        {item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
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
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'flex-start',
    paddingTop: 60,
  },
  menuContainer: {
    backgroundColor: '#fff',
    minWidth: 290,
    maxWidth: 450,
    marginHorizontal: 32,
    borderRadius: 16,
    paddingVertical: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: '#B6E3FA', // light blue border
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: 'transparent',
    marginBottom: 2,
  },
  menuItemActive: {
    backgroundColor: '#F5F7FA',
  },
  menuIcon: {
    marginRight: 14,
    marginLeft: 2,
  },
  menuItemText: {
    fontSize: 20,
    color: colors.gray[600],
    fontWeight: '400',
    letterSpacing: 0.1,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Nunito',
  },
});
