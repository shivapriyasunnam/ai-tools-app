import { colors, spacing } from '@/src/constants';
import { GoalsContext } from '@/src/context/GoalsContext';
import { TodoContext } from '@/src/context/TodoContext';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useContext, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const PERIODS = [
  { key: 'all', label: 'All' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'quarterly', label: 'Quarterly' },
  { key: 'half_yearly', label: 'Half-Yearly' },
  { key: 'yearly', label: 'Yearly' },
];

const CATEGORIES = [
  { key: 'all', label: 'All', color: colors.gray[500] },
  { key: 'finance', label: 'Finance', color: '#10b981' },
  { key: 'education', label: 'Education', color: '#6366f1' },
  { key: 'career', label: 'Career', color: '#f59e0b' },
  { key: 'family', label: 'Family', color: '#ec4899' },
  { key: 'wellbeing', label: 'Wellbeing', color: '#ef4444' },
  { key: 'health', label: 'Health', color: '#14b8a6' },
];

const DURATIONS = [
  { key: '5_year', label: '5-Year' },
  { key: '10_year', label: '10-Year' },
  { key: 'custom', label: 'Custom' },
];

function getCategoryColor(cat) {
  return CATEGORIES.find(c => c.key === cat)?.color || colors.gray[500];
}

function getPeriodLabel(period) {
  return PERIODS.find(p => p.key === period)?.label || period;
}

function getDurationLabel(duration) {
  return DURATIONS.find(d => d.key === duration)?.label || duration;
}

// ── Goal Form ────────────────────────────────────────────────────────────────

function GoalForm({ onSubmit, onCancel, initialValues = {}, plans = [], todos = [] }) {
  const { theme } = useTheme();
  const [title, setTitle] = useState(initialValues.title || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [period, setPeriod] = useState(initialValues.period || 'monthly');
  const [category, setCategory] = useState(initialValues.category || 'finance');
  const [planId, setPlanId] = useState(initialValues.plan_id || null);
  const [linkedTodoIds, setLinkedTodoIds] = useState(initialValues.linked_todo_ids || []);
  const [showTodos, setShowTodos] = useState(false);
  const [showPlanPicker, setShowPlanPicker] = useState(false);

  const pendingTodos = todos.filter(t => !t.completed);

  const toggleTodo = (id) => {
    setLinkedTodoIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a goal title');
      return;
    }
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      period,
      category,
      plan_id: planId,
      linked_todo_ids: linkedTodoIds,
    });
  };

  const selectedPlan = plans.find(p => p.id === planId);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={{ backgroundColor: theme.colors.background }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[fStyles.formContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[fStyles.formTitle, { color: theme.colors.text }]}>
            {initialValues.id ? 'Edit Goal' : 'New Goal'}
          </Text>

          <TextInput
            placeholder="Goal title *"
            value={title}
            onChangeText={setTitle}
            style={[fStyles.input, { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: theme.colors.background }]}
            placeholderTextColor={theme.colors.textSecondary}
          />

          <TextInput
            placeholder="Description (optional)"
            value={description}
            onChangeText={setDescription}
            style={[fStyles.input, { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: theme.colors.background, minHeight: 60, textAlignVertical: 'top' }]}
            placeholderTextColor={theme.colors.textSecondary}
            multiline
          />

          <Text style={[fStyles.label, { color: theme.colors.textSecondary }]}>Period</Text>
          <View style={fStyles.optionsWrap}>
            {PERIODS.filter(p => p.key !== 'all').map(p => {
              const active = period === p.key;
              return (
                <TouchableOpacity
                  key={p.key}
                  style={[fStyles.optBtn, { borderColor: theme.colors.border }, active && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]}
                  onPress={() => setPeriod(p.key)}
                >
                  <Text style={[fStyles.optText, { color: theme.colors.text }, active && { color: colors.white }]}>{p.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[fStyles.label, { color: theme.colors.textSecondary }]}>Category</Text>
          <View style={fStyles.optionsWrap}>
            {CATEGORIES.filter(c => c.key !== 'all').map(c => {
              const active = category === c.key;
              return (
                <TouchableOpacity
                  key={c.key}
                  style={[fStyles.optBtn, { borderColor: theme.colors.border }, active && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]}
                  onPress={() => setCategory(c.key)}
                >
                  <View style={[fStyles.catDotOpt, { backgroundColor: active ? colors.white : c.color }]} />
                  <Text style={[fStyles.optText, { color: theme.colors.text }, active && { color: colors.white }]}>{c.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[fStyles.label, { color: theme.colors.textSecondary }]}>Attach to Plan (optional)</Text>
          <TouchableOpacity
            style={[fStyles.pickerBtn, { borderColor: theme.colors.border, backgroundColor: theme.colors.background }]}
            onPress={() => setShowPlanPicker(!showPlanPicker)}
          >
            <Text style={[fStyles.pickerText, { color: selectedPlan ? theme.colors.text : theme.colors.textSecondary }]}>
              {selectedPlan ? selectedPlan.title : 'Select a plan…'}
            </Text>
            <Ionicons name={showPlanPicker ? 'chevron-up' : 'chevron-down'} size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          {showPlanPicker && (
            <View style={[fStyles.pickerDropdown, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
              <TouchableOpacity style={fStyles.pickerItem} onPress={() => { setPlanId(null); setShowPlanPicker(false); }}>
                <Text style={{ color: theme.colors.textSecondary, fontSize: 14 }}>— None —</Text>
              </TouchableOpacity>
              {plans.map(p => (
                <TouchableOpacity
                  key={p.id}
                  style={[fStyles.pickerItem, planId === p.id && { backgroundColor: theme.colors.primary + '15' }]}
                  onPress={() => { setPlanId(p.id); setShowPlanPicker(false); }}
                >
                  <Ionicons name="map-outline" size={14} color={theme.colors.primary} style={{ marginRight: 6 }} />
                  <Text style={{ color: theme.colors.text, fontSize: 14, flex: 1 }}>{p.title}</Text>
                  {planId === p.id && <Ionicons name="checkmark" size={14} color={theme.colors.primary} />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity style={fStyles.linkToggle} onPress={() => setShowTodos(!showTodos)}>
            <Ionicons name="link-outline" size={16} color={theme.colors.primary} />
            <Text style={[fStyles.linkToggleText, { color: theme.colors.primary }]}>
              Link To-Dos{linkedTodoIds.length > 0 ? ` (${linkedTodoIds.length} selected)` : ' (optional)'}
            </Text>
            <Ionicons name={showTodos ? 'chevron-up' : 'chevron-down'} size={14} color={theme.colors.primary} />
          </TouchableOpacity>
          {showTodos && (
            <View style={[fStyles.todoList, { borderColor: theme.colors.border }]}>
              {pendingTodos.length === 0 ? (
                <Text style={{ color: theme.colors.textSecondary, fontSize: 13, padding: spacing.sm }}>No pending to-dos</Text>
              ) : (
                pendingTodos.map(t => {
                  const checked = linkedTodoIds.includes(t.id);
                  return (
                    <TouchableOpacity key={t.id} style={fStyles.todoRow} onPress={() => toggleTodo(t.id)}>
                      <View style={[fStyles.checkbox, { borderColor: theme.colors.primary, backgroundColor: checked ? theme.colors.primary : 'transparent' }]}>
                        {checked && <Ionicons name="checkmark" size={12} color={colors.white} />}
                      </View>
                      <Text style={[fStyles.todoRowText, { color: theme.colors.text }]} numberOfLines={1}>{t.title}</Text>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          )}

          <View style={fStyles.buttonRow}>
            <TouchableOpacity
              style={[fStyles.iconButton, { backgroundColor: theme.colors.border }]}
              onPress={onCancel}
            >
              <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[fStyles.iconButton, { backgroundColor: theme.colors.primary, marginLeft: spacing.sm }]}
              onPress={handleSubmit}
            >
              <Ionicons name="checkmark" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Plan Form ────────────────────────────────────────────────────────────────

function PlanForm({ onSubmit, onCancel, initialValues = {}, theme, goals = [], onAttachGoal, onDetachGoal }) {
  const [title, setTitle] = useState(initialValues.title || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [duration, setDuration] = useState(initialValues.duration || '5_year');
  const [startDate, setStartDate] = useState(initialValues.start_date || '');
  const [endDate, setEndDate] = useState(initialValues.end_date || '');
  const [showAttachPicker, setShowAttachPicker] = useState(false);

  const planGoals = goals.filter(g => g.plan_id === initialValues.id);
  const attachable = goals.filter(g => g.plan_id !== initialValues.id);

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a plan title');
      return;
    }
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      duration,
      start_date: startDate || null,
      end_date: endDate || null,
    });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={{ backgroundColor: theme.colors.background }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[fStyles.formContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[fStyles.formTitle, { color: theme.colors.text }]}>
            {initialValues.id ? 'Edit Plan' : 'New Plan'}
          </Text>

          <TextInput
            placeholder="Plan title *"
            value={title}
            onChangeText={setTitle}
            style={[fStyles.input, { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: theme.colors.background }]}
            placeholderTextColor={theme.colors.textSecondary}
          />

          <TextInput
            placeholder="Description (optional)"
            value={description}
            onChangeText={setDescription}
            style={[fStyles.input, { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: theme.colors.background, minHeight: 60, textAlignVertical: 'top' }]}
            placeholderTextColor={theme.colors.textSecondary}
            multiline
          />

          <Text style={[fStyles.label, { color: theme.colors.textSecondary }]}>Duration</Text>
          <View style={fStyles.optionsWrap}>
            {DURATIONS.map(d => {
              const active = duration === d.key;
              return (
                <TouchableOpacity
                  key={d.key}
                  style={[fStyles.optBtn, { borderColor: theme.colors.border }, active && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]}
                  onPress={() => setDuration(d.key)}
                >
                  <Text style={[fStyles.optText, { color: theme.colors.text }, active && { color: colors.white }]}>{d.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[fStyles.label, { color: theme.colors.textSecondary }]}>Start Date (optional)</Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            value={startDate}
            onChangeText={setStartDate}
            style={[fStyles.input, { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: theme.colors.background }]}
            placeholderTextColor={theme.colors.textSecondary}
          />

          <Text style={[fStyles.label, { color: theme.colors.textSecondary }]}>End Date (optional)</Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            value={endDate}
            onChangeText={setEndDate}
            style={[fStyles.input, { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: theme.colors.background }]}
            placeholderTextColor={theme.colors.textSecondary}
          />

          {/* Goals section — only shown when editing an existing plan */}
          {initialValues.id && (
            <>
              <Text style={[fStyles.label, { color: theme.colors.textSecondary, marginTop: spacing.sm }]}>Goals</Text>

              {planGoals.map(g => (
                <View key={g.id} style={[fStyles.goalRow, { borderColor: theme.colors.border, backgroundColor: theme.colors.background }]}>
                  <View style={[fStyles.catDotOpt, { backgroundColor: getCategoryColor(g.category), marginRight: 6 }]} />
                  <Text style={{ flex: 1, fontSize: 14, color: theme.colors.text }} numberOfLines={1}>{g.title}</Text>
                  <TouchableOpacity onPress={() => onDetachGoal(g)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="close-circle" size={18} color={colors.gray[400]} />
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity
                style={[fStyles.pickerBtn, { borderColor: theme.colors.border, backgroundColor: theme.colors.background, marginBottom: showAttachPicker ? 0 : spacing.md }]}
                onPress={() => setShowAttachPicker(v => !v)}
              >
                <Text style={[fStyles.pickerText, { color: theme.colors.textSecondary }]}>Attach a goal…</Text>
                <Ionicons name={showAttachPicker ? 'chevron-up' : 'chevron-down'} size={16} color={theme.colors.textSecondary} />
              </TouchableOpacity>
              {showAttachPicker && (
                <View style={[fStyles.pickerDropdown, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface, marginBottom: spacing.md }]}>
                  {attachable.length === 0 ? (
                    <Text style={{ color: theme.colors.textSecondary, fontSize: 13, padding: spacing.md }}>
                      All goals are already attached
                    </Text>
                  ) : (
                    attachable.map(g => (
                      <TouchableOpacity
                        key={g.id}
                        style={fStyles.pickerItem}
                        onPress={() => { onAttachGoal(g, initialValues.id); setShowAttachPicker(false); }}
                      >
                        <View style={[fStyles.catDotOpt, { backgroundColor: getCategoryColor(g.category), marginRight: 6 }]} />
                        <Text style={{ flex: 1, fontSize: 14, color: theme.colors.text }} numberOfLines={1}>{g.title}</Text>
                        <Ionicons name="add" size={16} color={theme.colors.primary} />
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              )}
            </>
          )}

          <View style={fStyles.buttonRow}>
            <TouchableOpacity
              style={[fStyles.iconButton, { backgroundColor: theme.colors.border }]}
              onPress={onCancel}
            >
              <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[fStyles.iconButton, { backgroundColor: theme.colors.primary, marginLeft: spacing.sm }]}
              onPress={handleSubmit}
            >
              <Ionicons name="checkmark" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Shared form styles ───────────────────────────────────────────────────────

const fStyles = StyleSheet.create({
  formTitle: { fontSize: 18, fontWeight: '700', marginBottom: spacing.md },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    fontSize: 14,
    backgroundColor: colors.gray[50],
  },
  label: { fontSize: 13, fontWeight: '600', marginBottom: spacing.sm, marginTop: spacing.xs },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    marginBottom: spacing.sm,
  },
  optionsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  optBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.gray[300],
    backgroundColor: colors.white,
  },
  optText: { fontSize: 12, fontWeight: '600', color: colors.gray[700] },
  catDotOpt: { width: 8, height: 8, borderRadius: 4, marginRight: 4 },
  pickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    marginBottom: spacing.xs,
  },
  pickerText: { fontSize: 14, flex: 1 },
  pickerDropdown: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  linkToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
    paddingVertical: spacing.sm,
  },
  linkToggleText: { fontSize: 13, fontWeight: '600', flex: 1 },
  todoList: { borderWidth: 1, borderRadius: 8, marginBottom: spacing.md, overflow: 'hidden' },
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  todoRowText: { fontSize: 13, flex: 1 },
  formContainer: {
    borderRadius: 12,
    padding: spacing.md,
    margin: spacing.md,
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.sm },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: { flex: 1, padding: spacing.md, borderRadius: 8, alignItems: 'center' },
  btnText: { color: colors.white, fontWeight: '600', fontSize: 14 },
});

// ── Main Screen ──────────────────────────────────────────────────────────────

export default function GoalsScreen() {
  const { theme } = useTheme();
  const {
    goals, plans,
    addGoal, updateGoal, deleteGoal, toggleGoalComplete,
    addPlan, updatePlan, deletePlan,
    getPlanById,
  } = useContext(GoalsContext);
  const { todos } = useContext(TodoContext);

  const [activeTab, setActiveTab] = useState('goals');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [mode, setMode] = useState('view'); // 'view' | 'goal' | 'plan'
  const [editingGoal, setEditingGoal] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [expandedPlans, setExpandedPlans] = useState(new Set());

  const filteredGoals = goals.filter(g => {
    if (periodFilter !== 'all' && g.period !== periodFilter) return false;
    if (categoryFilter !== 'all' && g.category !== categoryFilter) return false;
    return true;
  });

  const getGoalTodoProgress = (goal) => {
    if (!goal.linked_todo_ids || goal.linked_todo_ids.length === 0) return null;
    const linked = goal.linked_todo_ids.map(id => todos.find(t => t.id === id)).filter(Boolean);
    const done = linked.filter(t => t.completed).length;
    return { done, total: linked.length };
  };

  // ── Goal handlers ───────────────────────────────────────────────────────────
  const handleAddGoal = async (data) => {
    try {
      await addGoal(data);
      setMode('view');
    } catch {
      Alert.alert('Error', 'Could not save goal');
    }
  };

  const handleUpdateGoal = async (data) => {
    try {
      await updateGoal(editingGoal.id, data);
      setMode('view');
      setEditingGoal(null);
    } catch {
      Alert.alert('Error', 'Could not update goal');
    }
  };

  const handleDeleteGoal = (id) => {
    Alert.alert('Delete Goal', 'Are you sure you want to delete this goal?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteGoal(id) },
    ]);
  };

  // ── Plan handlers ───────────────────────────────────────────────────────────
  const handleAddPlan = async (data) => {
    try {
      await addPlan(data);
      setMode('view');
    } catch {
      Alert.alert('Error', 'Could not save plan');
    }
  };

  const handleUpdatePlan = async (data) => {
    try {
      await updatePlan(editingPlan.id, data);
      setMode('view');
      setEditingPlan(null);
    } catch {
      Alert.alert('Error', 'Could not update plan');
    }
  };

  const handleDeletePlan = (id) => {
    Alert.alert('Delete Plan', 'Goals in this plan will not be deleted.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deletePlan(id) },
    ]);
  };

  const handleAttachGoal = async (goal, planId) => {
    try {
      await updateGoal(goal.id, { ...goal, plan_id: planId });
    } catch {
      Alert.alert('Error', 'Could not attach goal');
    }
  };

  const handleDetachGoal = async (goal) => {
    try {
      await updateGoal(goal.id, { ...goal, plan_id: null });
    } catch {
      Alert.alert('Error', 'Could not detach goal');
    }
  };

  const toggleExpand = (id) => {
    setExpandedPlans(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (mode === 'goal') {
    return (
      <GoalForm
        onSubmit={editingGoal ? handleUpdateGoal : handleAddGoal}
        onCancel={() => { setMode('view'); setEditingGoal(null); }}
        initialValues={editingGoal || {}}
        plans={plans}
        todos={todos}
        theme={theme}
      />
    );
  }

  if (mode === 'plan') {
    return (
      <PlanForm
        onSubmit={editingPlan ? handleUpdatePlan : handleAddPlan}
        onCancel={() => { setMode('view'); setEditingPlan(null); }}
        initialValues={editingPlan || {}}
        theme={theme}
        goals={goals}
        onAttachGoal={handleAttachGoal}
        onDetachGoal={handleDetachGoal}
      />
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Top tab row */}
      <View style={[styles.tabRow, { borderBottomColor: theme.colors.border }]}>
        {[
          { key: 'goals', label: `Goals (${goals.length})` },
          { key: 'plans', label: `Plans (${plans.length})` },
        ].map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.topTab, activeTab === tab.key && { borderBottomColor: theme.colors.primary, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.topTabText, { color: activeTab === tab.key ? theme.colors.primary : theme.colors.textSecondary }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Goals tab */}
      {activeTab === 'goals' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Period pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {PERIODS.map(p => {
              const active = periodFilter === p.key;
              return (
                <TouchableOpacity
                  key={p.key}
                  style={[styles.pill, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }, active && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]}
                  onPress={() => setPeriodFilter(p.key)}
                >
                  <Text style={[styles.pillText, { color: active ? colors.white : colors.gray[600] }]}>{p.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Category pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {CATEGORIES.map(c => {
              const active = categoryFilter === c.key;
              return (
                <TouchableOpacity
                  key={c.key}
                  style={[styles.pill, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }, active && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]}
                  onPress={() => setCategoryFilter(c.key)}
                >
                  {c.key !== 'all' && (
                    <View style={[styles.catDotPill, { backgroundColor: active ? colors.white : c.color }]} />
                  )}
                  <Text style={[styles.pillText, { color: active ? colors.white : colors.gray[600] }]}>{c.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {filteredGoals.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
              <Ionicons name="flag-outline" size={48} color={colors.gray[300]} />
              <Text style={[styles.emptyText, { color: theme.colors.text }]}>No goals yet</Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
                Tap + to add your first goal
              </Text>
            </View>
          ) : (
            filteredGoals.map(goal => {
              const catColor = getCategoryColor(goal.category);
              const plan = goal.plan_id ? getPlanById(goal.plan_id) : null;
              const progress = getGoalTodoProgress(goal);
              return (
                <View key={goal.id} style={[styles.goalCard, { backgroundColor: theme.colors.surface }]}>
                  <View style={styles.goalCardTop}>
                    <View style={[styles.catDotLg, { backgroundColor: catColor }]} />
                    <Text
                      style={[styles.goalTitle, { color: theme.colors.text }, goal.completed && styles.strikethrough]}
                      numberOfLines={2}
                    >
                      {goal.title}
                    </Text>
                    <TouchableOpacity onPress={() => toggleGoalComplete(goal.id)}>
                      <Ionicons
                        name={goal.completed ? 'checkmark-circle' : 'checkmark-circle-outline'}
                        size={24}
                        color={goal.completed ? theme.colors.primary : colors.gray[300]}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.badgeRow}>
                    <View style={styles.periodBadge}>
                      <Text style={styles.periodBadgeText}>{getPeriodLabel(goal.period)}</Text>
                    </View>
                    {plan && (
                      <View style={[styles.planTag, { backgroundColor: theme.colors.primary + '20' }]}>
                        <Ionicons name="map-outline" size={10} color={theme.colors.primary} style={{ marginRight: 3 }} />
                        <Text style={[styles.planTagText, { color: theme.colors.primary }]} numberOfLines={1}>{plan.title}</Text>
                      </View>
                    )}
                  </View>

                  {!!goal.description && (
                    <Text style={[styles.goalDesc, { color: theme.colors.textSecondary }]}>{goal.description}</Text>
                  )}

                  {progress && (
                    <View style={styles.progressSection}>
                      <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>
                        {progress.done}/{progress.total} todos done
                      </Text>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%`,
                              backgroundColor: progress.done === progress.total ? colors.success : theme.colors.primary,
                            },
                          ]}
                        />
                      </View>
                    </View>
                  )}

                  <View style={styles.cardActions}>
                    <TouchableOpacity onPress={() => { setEditingGoal(goal); setMode('goal'); }}>
                      <Text style={[styles.actionEdit, { color: theme.colors.primary }]}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteGoal(goal.id)}>
                      <Text style={styles.actionDelete}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
          <View style={{ height: 80 }} />
        </ScrollView>
      )}

      {/* Plans tab */}
      {activeTab === 'plans' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {plans.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
              <Ionicons name="map-outline" size={48} color={colors.gray[300]} />
              <Text style={[styles.emptyText, { color: theme.colors.text }]}>No plans yet</Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
                Tap + to create a multi-year plan
              </Text>
            </View>
          ) : (
            plans.map(plan => {
              const planGoals = goals.filter(g => g.plan_id === plan.id);
              const expanded = expandedPlans.has(plan.id);
              return (
                <View key={plan.id} style={[styles.planCard, { backgroundColor: theme.colors.surface }]}>
                  <TouchableOpacity
                    style={styles.planCardTop}
                    onPress={() => toggleExpand(plan.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.planIconWrap, { backgroundColor: theme.colors.primary + '20' }]}>
                      <Ionicons name="map-outline" size={32} color={theme.colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.planTitle, { color: theme.colors.text }]}>{plan.title}</Text>
                      <View style={styles.planMeta}>
                        <View style={[styles.durationBadge, { backgroundColor: theme.colors.primary + '20' }]}>
                          <Text style={[styles.durationBadgeText, { color: theme.colors.primary }]}>{getDurationLabel(plan.duration)}</Text>
                        </View>
                        <Text style={[styles.planGoalCount, { color: theme.colors.textSecondary }]}>
                          {planGoals.length} {planGoals.length === 1 ? 'goal' : 'goals'}
                        </Text>
                      </View>
                      {(plan.start_date || plan.end_date) && (
                        <Text style={[styles.planDates, { color: theme.colors.textSecondary }]}>
                          {plan.start_date || '?'} → {plan.end_date || '?'}
                        </Text>
                      )}
                    </View>
                    <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.gray[400]} />
                  </TouchableOpacity>

                  {!!plan.description && (
                    <Text style={[styles.planDesc, { color: theme.colors.textSecondary }]}>{plan.description}</Text>
                  )}

                  {expanded && (
                    <View style={[styles.planGoalsList, { borderTopColor: theme.colors.border }]}>
                      {planGoals.length === 0 ? (
                        <Text style={{ color: theme.colors.textSecondary, fontSize: 13, paddingVertical: spacing.sm }}>
                          No goals attached yet
                        </Text>
                      ) : (
                        planGoals.map(g => (
                          <View key={g.id} style={styles.planGoalRow}>
                            <View style={[styles.catDotSm, { backgroundColor: getCategoryColor(g.category) }]} />
                            <Text
                              style={[styles.planGoalTitle, { color: theme.colors.text }, g.completed && styles.strikethrough]}
                              numberOfLines={1}
                            >
                              {g.title}
                            </Text>
                            <View style={styles.periodBadgeSm}>
                              <Text style={styles.periodBadgeSmText}>{getPeriodLabel(g.period)}</Text>
                            </View>
                            {g.completed && (
                              <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                            )}
                          </View>
                        ))
                      )}

                    </View>
                  )}

                  <View style={styles.cardActions}>
                    <TouchableOpacity onPress={() => { setEditingPlan(plan); setMode('plan'); }}>
                      <Text style={[styles.actionEdit, { color: theme.colors.primary }]}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeletePlan(plan.id)}>
                      <Text style={styles.actionDelete}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
          <View style={{ height: 80 }} />
        </ScrollView>
      )}

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => {
          if (activeTab === 'plans') {
            setEditingPlan(null);
            setMode('plan');
          } else {
            setEditingGoal(null);
            setMode('goal');
          }
        }}
      >
        <Ionicons name="add" size={28} color={colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Tabs
  tabRow: { flexDirection: 'row', borderBottomWidth: 1 },
  topTab: { flex: 1, alignItems: 'center', paddingVertical: 14, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  topTabActive: { borderBottomWidth: 2 },
  topTabText: { fontSize: 14, fontWeight: '600' },

  scrollContent: { padding: spacing.md },

  // Filter pills
  filterScroll: { marginBottom: spacing.sm },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  pillText: { fontSize: 13, fontWeight: '600' },
  catDotPill: { width: 8, height: 8, borderRadius: 4, marginRight: 4 },

  // Goal cards
  goalCard: {
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  goalCardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginBottom: spacing.sm },
  catDotLg: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  goalTitle: { flex: 1, fontSize: 15, fontWeight: '700' },
  strikethrough: { textDecorationLine: 'line-through', opacity: 0.5 },
  badgeRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xs, flexWrap: 'wrap' },
  periodBadge: {
    backgroundColor: colors.gray[100],
    borderRadius: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  periodBadgeText: { fontSize: 11, fontWeight: '600', color: colors.gray[600] },
  planTag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    maxWidth: 160,
  },
  planTagText: { fontSize: 11, fontWeight: '600' },
  goalDesc: { fontSize: 13, marginTop: spacing.xs, marginBottom: spacing.xs },
  progressSection: { marginTop: spacing.sm },
  progressLabel: { fontSize: 12, marginBottom: 4 },
  progressBar: { height: 8, backgroundColor: colors.gray[200], borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 4 },
  cardActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm, justifyContent: 'flex-end' },
  actionEdit: { fontSize: 13, fontWeight: '600' },
  actionDelete: { fontSize: 13, fontWeight: '600', color: colors.error },

  // Plan cards
  planCard: {
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  planCardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  planIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  planMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 4 },
  durationBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  durationBadgeText: { fontSize: 12, fontWeight: '600' },
  planGoalCount: { fontSize: 12, fontWeight: '600' },
  planDates: { fontSize: 13 },
  planDesc: { fontSize: 13, marginTop: spacing.sm },
  planGoalsList: { borderTopWidth: 1, marginTop: spacing.md, paddingTop: spacing.sm },
  planGoalRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 6 },
  catDotSm: { width: 8, height: 8, borderRadius: 4 },
  planGoalTitle: { flex: 1, fontSize: 13 },
  periodBadgeSm: {
    backgroundColor: colors.gray[100],
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  periodBadgeSmText: { fontSize: 10, fontWeight: '600', color: colors.gray[600] },
  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  // Modal
  modalContainer: { flex: 1 },
  modalInner: {
    flex: 1,
    margin: spacing.md,
    marginTop: spacing.lg,
    borderRadius: 16,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    borderRadius: 16,
    marginTop: spacing.sm,
  },
  emptyText: { fontSize: 16, fontWeight: '600', marginTop: spacing.md },
  emptySubtext: { fontSize: 13, marginTop: spacing.sm },
});
