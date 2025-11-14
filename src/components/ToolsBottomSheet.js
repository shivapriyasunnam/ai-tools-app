import { colors } from '@/src/constants';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { forwardRef, useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ToolsBottomSheet = forwardRef((props, ref) => {
  const snapPoints = useMemo(() => ['60%', '85%'], []);
  const router = useRouter();

  console.log('ToolsBottomSheet rendered');

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    []
  );

  const tools = [
    {
      id: 'income-tracker',
      name: 'Income Tracker',
      icon: 'cash',
      description: 'Track and analyze income',
      color: '#10B981',
      route: '/(tabs)/income-tracker',
    },
    {
      id: 'pomodoro',
      name: 'Pomodoro Timer',
      icon: 'timer',
      description: 'Stay focused with time management',
      color: '#E91E63',
      route: '/(tabs)/pomodoro-timer',
    },
    {
      id: 'expense-tracker',
      name: 'Expense Tracker',
      icon: 'wallet',
      description: 'Track and analyze expenses',
      color: '#FF6B6B',
      route: '/(tabs)/expense-tracker',
    },
    {
      id: 'budget-planner',
      name: 'Budget Planner',
      icon: 'pie-chart',
      description: 'Plan and manage your budget',
      color: '#4ECDC4',
      route: '/(tabs)/budget-planner',
    },
    {
      id: 'meetings',
      name: 'Meetings Scheduler',
      icon: 'calendar',
      description: 'Schedule and organize meetings',
      color: '#6366F1',
      route: '/(tabs)/meetings-scheduler',
    },
    {
      id: 'notes',
      name: 'Quick Notes',
      icon: 'document-text',
      description: 'Jot down your thoughts',
      color: '#5B7FFF',
      route: null, // Will be implemented later
    },
    {
      id: 'todo',
      name: 'To-Do List',
      icon: 'checkbox',
      description: 'Manage your tasks',
      color: '#8B5CF6',
      route: '/(tabs)/todo-list',
    },
    {
      id: 'reminders',
      name: 'Reminders',
      icon: 'notifications',
      description: 'Set important reminders',
      color: '#F59E0B',
      route: null, // Will be implemented later
    },
    {
      id: 'calculator',
      name: 'Calculator',
      icon: 'calculator',
      description: 'Quick calculations',
      color: '#10B981',
      route: null, // Will be implemented later
    },
  ];

  const handleToolPress = (tool) => {
    console.log('Tool pressed:', tool.id);
    
    // Close the bottom sheet
    ref?.current?.close();
    
    // Navigate to the route if available
    if (tool.route) {
      router.push(tool.route);
    } else {
      // TODO: Show a "Coming Soon" message or implement the feature
      console.log(`${tool.name} feature coming soon!`);
    }
  };

  const handleSheetChanges = useCallback((index) => {
    console.log('Bottom sheet index changed to:', index);
  }, []);

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      onChange={handleSheetChanges}
      enableDynamicSizing={false}
    >
      <BottomSheetView style={styles.contentContainer}>
        <Text style={styles.title}>More Tools</Text>
        <Text style={styles.subtitle}>Boost your productivity</Text>
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.toolsGrid}>
            {tools.map((tool) => (
              <TouchableOpacity
                key={tool.id}
                style={styles.toolCard}
                onPress={() => handleToolPress(tool)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, { backgroundColor: tool.color + '20' }]}>
                  <Ionicons name={tool.icon} size={32} color={tool.color} />
                </View>
                <Text style={styles.toolName}>{tool.name}</Text>
                <Text style={styles.toolDescription}>{tool.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicator: {
    backgroundColor: colors.gray[300],
    width: 40,
    height: 4,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray[500],
    marginBottom: 24,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  toolCard: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[200],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  toolName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
    textAlign: 'center',
    marginBottom: 4,
  },
  toolDescription: {
    fontSize: 12,
    color: colors.gray[500],
    textAlign: 'center',
  },
});

export default ToolsBottomSheet;
