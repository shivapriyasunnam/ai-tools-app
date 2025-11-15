import { colors } from '@/src/constants';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ToolsBottomSheet = forwardRef((props, ref) => {
  const snapPoints = useMemo(() => ['60%', '90%'], []);
  const router = useRouter();
  const sheetRef = useRef(null);
  const scrollRef = useRef(null);

  console.log('ToolsBottomSheet rendered');

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
      id: 'pomodoro',
      name: 'Pomodoro Timer',
      icon: 'timer',
      description: 'Stay focused with time management',
      color: '#E91E63',
      route: '/(tabs)/pomodoro-timer',
    },
    {
      id: 'notes',
      name: 'Quick Notes',
      icon: 'document-text',
      description: 'Jot down your thoughts',
      color: '#5B7FFF',
      route: '/(tabs)/quick-notes',
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
      id: 'meetings',
      name: 'Meetings Scheduler',
      icon: 'calendar',
      description: 'Schedule and organize meetings',
      color: '#6366F1',
      route: '/(tabs)/meetings-scheduler',
    },
    {
      id: 'reminders',
      name: 'Reminders',
      icon: 'notifications',
      description: 'Set important reminders',
      color: '#F59E0B',
      route: '/(tabs)/reminders',
    },
    {
      id: 'calculator',
      name: 'Calculator',
      icon: 'calculator',
      description: 'Quick calculations',
      color: '#10B981',
      route: '/(tabs)/calculator',
    },
  ];

  const handleToolPress = (tool) => {
    console.log('Tool pressed:', tool.id);
    // Close the bottom sheet via internal ref
    sheetRef.current?.close();
    
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
    // If closed (-1) ensure scroll resets so next open starts at top
    if (index === -1) {
      resetScroll(false);
    }
  }, []);

  // Expose imperative methods to parent
  useImperativeHandle(ref, () => ({
    snapToIndex: (i) => sheetRef.current?.snapToIndex(i),
    close: () => sheetRef.current?.close(),
    resetScroll: () => resetScroll(false),
  }));

  const resetScroll = (animated = false) => {
    // Support both ScrollView (scrollTo) and FlatList (scrollToOffset)
    scrollRef.current?.scrollTo?.({ y: 0, animated });
    scrollRef.current?.scrollToOffset?.({ offset: 0, animated });
  };

  // Custom backdrop composed of a blurred layer + the library backdrop that handles press/visibility
  const CustomBackdrop = useCallback((props) => {
    return (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        opacity={0.5}
      />
    );
  }, []);

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={CustomBackdrop}
      backgroundStyle={{ backgroundColor: 'transparent', borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
      handleIndicatorStyle={styles.handleIndicator}
      onChange={handleSheetChanges}
      enableDynamicSizing={false}
      animateOnMount={true}
    >
      <View style={styles.bottomSheetBackground}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Tools</Text>
          <Text style={styles.subtitle}>Boost your productivity</Text>
        </View>
        <BottomSheetScrollView 
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
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
        </BottomSheetScrollView>
      </View>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
    // Removed flex: 1 to allow scroll view to expand
    overflow: 'hidden',
  },
  handleIndicator: {
    backgroundColor: colors.gray[300],
    width: 40,
    height: 4,
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 8,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 150, // Increased to ensure last tool is visible
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
    marginBottom: 16,
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
