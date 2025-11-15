        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            href: null, // Hidden tab - doesn't appear in tab bar
          }}
        />
  // The income-tracker tab has been removed as it was not present in the file.
import CustomHeader from '@/components/ui/CustomHeader';
import ToolsBottomSheet from '@/src/components/ToolsBottomSheet';
import { colors } from '@/src/constants';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useRef } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

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

  // Pan gesture for swipe up to open bottom sheet
  const swipeUpGesture = Gesture.Pan()
    .activeOffsetY(-10) // Start recognizing after 10px vertical movement
    .failOffsetY(10) // Fail if moving down
    .failOffsetX([-20, 20]) // Fail if moving too much horizontally
    .onEnd((event) => {
      // Check if swipe is upward and has sufficient velocity
      if (event.translationY < -50 && event.velocityY < -500) {
        console.log('👆 Swipe up detected! Opening bottom sheet...');
        handleOpenBottomSheet();
      }
    })
    .runOnJS(true);

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
          header: () => <CustomHeader />,
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
          name="reminders"
          options={{
            title: 'Reminders',
            href: null, // Hidden tab - doesn't appear in tab bar
          }}
        />
        <Tabs.Screen
          name="calculator"
          options={{
            title: 'Calculator',
            href: null, // Hidden tab - doesn't appear in tab bar
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
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
      
      {/* Swipe-up gesture zone just above the tab bar */}
      <GestureDetector gesture={swipeUpGesture}>
        <View style={styles.swipeZone} />
      </GestureDetector>
      
      <ToolsBottomSheet ref={bottomSheetRef} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  // Global font for all text
  text: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  swipeZone: {
    position: 'absolute',
    bottom: 70, // Position just above the 70px tab bar
    left: 0,
    right: 0,
    height: 80, // Larger swipe zone for easier detection
    backgroundColor: 'transparent',
    pointerEvents: 'box-only', // Only this view receives touch events, not its children
  },
  floatingButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: 1, // Reduced offset for better alignment
  },
  floatingButtonInner: {
    width: 52, // Slightly smaller for better fit
    height: 52,
    borderRadius: 26,
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
