        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            href: null, // Hidden tab - doesn't appear in tab bar
          }}
        />
  // The income-tracker tab has been removed as it was not present in the file.
import ToolsBottomSheet from '@/src/components/ToolsBottomSheet';
import { colors } from '@/src/constants';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function TabsLayout() {
  const bottomSheetRef = useRef(null);

  const handleOpenBottomSheet = () => {
    console.log('🔵 Button pressed! Opening bottom sheet...');
    console.log('Bottom sheet ref:', bottomSheetRef.current);
    if (bottomSheetRef.current) {
      console.log('✅ Ref exists, calling snapToIndex');
      // Reset scroll to top before opening so user always starts at beginning
      bottomSheetRef.current.resetScroll?.();
      bottomSheetRef.current.snapToIndex(0);
    } else {
      console.error('❌ Bottom sheet ref is null!');
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.gray[400],
          tabBarStyle: {
            backgroundColor: colors.white,
            borderTopColor: colors.gray[200],
            borderTopWidth: 1,
            height: 70,
            paddingBottom: 10,
            paddingTop: 5,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.primary,
            borderBottomColor: colors.primaryDark,
            borderBottomWidth: 1,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="hub"
          options={{
            title: 'Hub',
            tabBarLabel: 'Hub',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="grid" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: 'Tools',
            headerShown: false,
            tabBarLabel: '',
            tabBarIcon: () => null,
            tabBarButton: (props) => (
              <TouchableOpacity
                style={styles.floatingButton}
                onPress={(e) => {
                  e.preventDefault();
                  handleOpenBottomSheet();
                }}
                activeOpacity={0.8}
              >
                <View style={styles.floatingButtonInner}>
                  <Ionicons name="arrow-up" size={24} color={colors.white} />
                </View>
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="recent-activity"
          options={{
            title: 'Recent Activity',
            tabBarLabel: 'Activity',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="time" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="meetings-scheduler"
          options={{
            title: 'Meetings Scheduler',
            href: null, // Hidden tab - only accessible via bottom sheet
            // tabBarLabel: 'Meetings',
            // tabBarIcon: ({ color, size }) => (
            //   <Ionicons name="calendar" size={size} color={color} />
            // ),
          }}
        />
        <Tabs.Screen
          name="budget-planner"
          options={{
            title: 'Budget Planner',
            href: null, // Hidden tab - only accessible via bottom sheet
          }}
        />
         <Tabs.Screen
          name="expense-tracker"
          options={{
            title: 'Expense Tracker',
            // tabBarLabel: 'Expenses',
            // tabBarIcon: ({ color, size }) => (
            //   <Ionicons name="wallet" size={size} color={color} />
            // ),
            href: null, // Hidden tab - doesn't appear in tab bar
          }}
        />
        <Tabs.Screen
          name="pomodoro-timer"
          options={{
            title: 'Pomodoro Timer',
            href: null, // Hidden tab - doesn't appear in tab bar
          }}
        />
        <Tabs.Screen
          name="income-tracker"
          options={{
            title: 'Income Tracker',
            href: null, // Hidden tab - doesn't appear in tab bar
          }}
        />
        <Tabs.Screen
          name="todo-list"
          options={{
            title: 'To-Do List',
            href: null, // Hidden tab - doesn't appear in tab bar
          }}
        />
        <Tabs.Screen
          name="quick-notes"
          options={{
            title: 'Quick Notes',
            href: null, // Hidden tab - doesn't appear in tab bar
          }}
        />
        <Tabs.Screen
          name="index_old"
          options={{
            href: null,
          }}
        />
      </Tabs>
      <ToolsBottomSheet ref={bottomSheetRef} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: -10,
  },
  floatingButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});
