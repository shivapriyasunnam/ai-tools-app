import React, { useRef } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, StyleSheet, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from '@/src/constants';
import ToolsBottomSheet from '@/src/components/ToolsBottomSheet';

export default function TabsLayout() {
  const bottomSheetRef = useRef(null);

  const handleOpenBottomSheet = () => {
    console.log('🔵 Button pressed! Opening bottom sheet...');
    console.log('Bottom sheet ref:', bottomSheetRef.current);
    if (bottomSheetRef.current) {
      console.log('✅ Ref exists, calling snapToIndex');
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
          name="expense-tracker"
          options={{
            title: 'Expense Tracker',
            tabBarLabel: 'Expenses',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="wallet" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: 'More Tools',
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
          name="budget-planner"
          options={{
            title: 'Budget Planner',
            tabBarLabel: 'Budget',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="pie-chart" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="meetings-scheduler"
          options={{
            title: 'Meetings Scheduler',
            tabBarLabel: 'Meetings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar" size={size} color={color} />
            ),
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
