import { colors, spacing } from '@/src/constants';
import { TodoContext } from '@/src/context/TodoContext';
import { useContext, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Form component for adding/editing todos
function TodoForm({ onSubmit, onCancel, initialValues = {}, isEdit }) {
  const [title, setTitle] = useState(initialValues.title || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [priority, setPriority] = useState(initialValues.priority || 'medium');
  const [category, setCategory] = useState(initialValues.category || 'general');

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    onSubmit({
      ...initialValues,
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
    });

    if (!isEdit) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('general');
    }
  };

  return (
    <View style={formStyles.formContainer}>
      <Text style={formStyles.formTitle}>{isEdit ? '✎ Edit Task' : '➕ Add New Task'}</Text>
      
      <TextInput
        placeholder="Task title *"
        value={title}
        onChangeText={setTitle}
        style={formStyles.input}
        placeholderTextColor={colors.gray[400]}
      />

      <TextInput
        placeholder="Description (optional)"
        value={description}
        onChangeText={setDescription}
        style={[formStyles.input, { minHeight: 60 }]}
        placeholderTextColor={colors.gray[400]}
        multiline
      />

      {/* Priority Selection */}
      <Text style={formStyles.label}>Priority</Text>
      <View style={formStyles.optionsRow}>
        <TouchableOpacity
          style={[formStyles.optionButton, priority === 'low' && { backgroundColor: colors.success, borderColor: colors.success }]}
          onPress={() => setPriority('low')}
        >
          <Text style={[formStyles.optionText, priority === 'low' && { color: colors.white }]}>Low</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[formStyles.optionButton, priority === 'medium' && { backgroundColor: colors.primary, borderColor: colors.primary }]}
          onPress={() => setPriority('medium')}
        >
          <Text style={[formStyles.optionText, priority === 'medium' && { color: colors.white }]}>Medium</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[formStyles.optionButton, priority === 'high' && { backgroundColor: colors.error, borderColor: colors.error }]}
          onPress={() => setPriority('high')}
        >
          <Text style={[formStyles.optionText, priority === 'high' && { color: colors.white }]}>High</Text>
        </TouchableOpacity>
      </View>

      {/* Category Selection */}
      <Text style={formStyles.label}>Category</Text>
      <View style={formStyles.optionsRow}>
        <TouchableOpacity
          style={[formStyles.optionButton, category === 'general' && { backgroundColor: colors.primary, borderColor: colors.primary }]}
          onPress={() => setCategory('general')}
        >
          <Text style={[formStyles.optionText, category === 'general' && { color: colors.white }]}>General</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[formStyles.optionButton, category === 'work' && { backgroundColor: colors.primary, borderColor: colors.primary }]}
          onPress={() => setCategory('work')}
        >
          <Text style={[formStyles.optionText, category === 'work' && { color: colors.white }]}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[formStyles.optionButton, category === 'personal' && { backgroundColor: colors.primary, borderColor: colors.primary }]}
          onPress={() => setCategory('personal')}
        >
          <Text style={[formStyles.optionText, category === 'personal' && { color: colors.white }]}>Personal</Text>
        </TouchableOpacity>
      </View>

      <View style={formStyles.buttonRow}>
        <TouchableOpacity
          onPress={handleSubmit}
          style={[formStyles.button, { backgroundColor: colors.primary }]}
        >
          <Text style={formStyles.buttonText}>{isEdit ? 'Save Changes' : 'Add Task'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onCancel}
          style={[formStyles.button, { backgroundColor: colors.gray[300], marginLeft: spacing.sm }]}
        >
          <Text style={[formStyles.buttonText, { color: colors.gray[700] }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const formStyles = StyleSheet.create({
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.md,
    color: colors.gray[900],
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.gray[50],
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  optionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.gray[300],
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray[700],
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  button: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default function TodoListScreen() {
  const [mode, setMode] = useState('view'); // 'view', 'add', 'edit'
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [editTodo, setEditTodo] = useState(null);

  const {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    getCompletedCount,
    getPendingCount,
    clearCompleted,
  } = useContext(TodoContext);

  const completedCount = getCompletedCount();
  const pendingCount = getPendingCount();

  // Filter todos based on current filter and search query
  const filteredTodos = todos
    .filter(todo => {
      if (filter === 'pending') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    })
    .filter(todo => 
      searchQuery === '' ||
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const handleAddTodo = (todo) => {
    addTodo(todo);
    setMode('view');
    Alert.alert('Success', 'Task added successfully!');
  };

  const handleEditTodo = (todo) => {
    setEditTodo(todo);
    setMode('edit');
  };

  const handleUpdateTodo = (updated) => {
    updateTodo(updated.id, updated);
    setEditTodo(null);
    setMode('view');
    Alert.alert('Success', 'Task updated!');
  };

  const handleDeleteTodo = (id) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTodo(id) },
      ]
    );
  };

  const handleClearCompleted = () => {
    if (completedCount === 0) {
      Alert.alert('No Tasks', 'No completed tasks to clear');
      return;
    }
    Alert.alert(
      'Clear Completed',
      `Delete ${completedCount} completed task${completedCount > 1 ? 's' : ''}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearCompleted },
      ]
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return colors.error;
      case 'medium': return colors.primary;
      case 'low': return colors.success;
      default: return colors.gray[500];
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        {mode === 'view' && (
          <View>
            <Text style={styles.title}>✅ To-Do List</Text>

            {/* Summary Card */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Tasks Overview</Text>
              <View style={styles.summaryStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{pendingCount}</Text>
                  <Text style={styles.statLabel}>Pending</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{completedCount}</Text>
                  <Text style={styles.statLabel}>Completed</Text>
                </View>
              </View>
            </View>

            {/* Add Button */}
            <TouchableOpacity
              onPress={() => setMode('add')}
              style={[styles.addButton, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.addButtonText}>➕ Add New Task</Text>
            </TouchableOpacity>

            {/* Filter Buttons */}
            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
                onPress={() => setFilter('all')}
              >
                <Text style={[styles.filterButtonText, filter === 'all' && styles.filterButtonTextActive]}>
                  All ({todos.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, filter === 'pending' && styles.filterButtonActive]}
                onPress={() => setFilter('pending')}
              >
                <Text style={[styles.filterButtonText, filter === 'pending' && styles.filterButtonTextActive]}>
                  Pending ({pendingCount})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, filter === 'completed' && styles.filterButtonActive]}
                onPress={() => setFilter('completed')}
              >
                <Text style={[styles.filterButtonText, filter === 'completed' && styles.filterButtonTextActive]}>
                  Done ({completedCount})
                </Text>
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={{ marginBottom: spacing.md }}>
              <TextInput
                placeholder="Search tasks..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{
                  backgroundColor: colors.gray[100],
                  borderRadius: 8,
                  padding: spacing.md,
                  fontSize: 14,
                  color: colors.text,
                }}
                placeholderTextColor={colors.gray[400]}
              />
            </View>

            {/* Todo List */}
            {filteredTodos.length > 0 ? (
              <View>
                <View style={styles.listHeader}>
                  <Text style={styles.listTitle}>📝 Tasks ({filteredTodos.length})</Text>
                  {completedCount > 0 && (
                    <TouchableOpacity onPress={handleClearCompleted}>
                      <Text style={styles.clearText}>Clear Completed</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {filteredTodos.map(todo => (
                  <View key={todo.id} style={styles.todoItem}>
                    <TouchableOpacity
                      onPress={() => toggleComplete(todo.id)}
                      style={styles.checkbox}
                    >
                      <Text style={styles.checkboxIcon}>
                        {todo.completed ? '✓' : ''}
                      </Text>
                    </TouchableOpacity>
                    <View style={styles.todoContent}>
                      <View style={styles.todoHeader}>
                        <Text style={[
                          styles.todoTitle,
                          todo.completed && styles.todoTitleCompleted
                        ]}>
                          {todo.title}
                        </Text>
                        <Text style={styles.priorityIcon}>
                          {getPriorityIcon(todo.priority)}
                        </Text>
                      </View>
                      {todo.description ? (
                        <Text style={[
                          styles.todoDescription,
                          todo.completed && styles.todoDescriptionCompleted
                        ]}>
                          {todo.description}
                        </Text>
                      ) : null}
                      <View style={styles.todoFooter}>
                        <View style={styles.categoryBadge}>
                          <Text style={styles.categoryText}>{todo.category}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.todoActions}>
                      <TouchableOpacity onPress={() => handleEditTodo(todo)} style={styles.actionButton}>
                        <Text style={styles.editText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteTodo(todo.id)} style={styles.actionButton}>
                        <Text style={styles.deleteText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📋</Text>
                <Text style={styles.emptyText}>
                  {searchQuery ? 'No tasks found' : filter === 'completed' ? 'No completed tasks' : 'No tasks yet'}
                </Text>
                <Text style={styles.emptySubtext}>
                  {searchQuery ? 'Try a different search' : 'Add your first task to get started'}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Add Todo Form */}
        {mode === 'add' && (
          <TodoForm
            onSubmit={handleAddTodo}
            onCancel={() => setMode('view')}
          />
        )}

        {/* Edit Todo Form */}
        {mode === 'edit' && editTodo && (
          <TodoForm
            onSubmit={handleUpdateTodo}
            onCancel={() => { setEditTodo(null); setMode('view'); }}
            initialValues={editTodo}
            isEdit
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  scrollContent: {
    padding: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: spacing.lg,
  },
  summaryCard: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.gray[100],
    marginBottom: spacing.md,
  },
  summaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray[100],
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  addButton: {
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray[700],
  },
  filterButtonTextActive: {
    color: colors.white,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[900],
  },
  clearText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.error,
  },
  todoItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  checkboxIcon: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  todoContent: {
    flex: 1,
  },
  todoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  todoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray[900],
    flex: 1,
  },
  todoTitleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.gray[500],
  },
  priorityIcon: {
    fontSize: 14,
    marginLeft: spacing.xs,
  },
  todoDescription: {
    fontSize: 13,
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  todoDescriptionCompleted: {
    color: colors.gray[400],
  },
  todoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  categoryBadge: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.gray[600],
    textTransform: 'capitalize',
  },
  todoActions: {
    marginLeft: spacing.sm,
  },
  actionButton: {
    paddingVertical: 2,
    marginBottom: 4,
  },
  editText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  deleteText: {
    fontSize: 13,
    color: colors.error,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: 8,
    marginTop: spacing.sm,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: 13,
    color: colors.gray[500],
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
});
