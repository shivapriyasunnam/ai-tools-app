"use no memo";
import {
  FlexWidget,
  TextWidget,
} from 'react-native-android-widget';

const PRIORITY_COLOR = { high: '#EF4444', medium: '#F59E0B', low: '#10B981' };

function formatRelativeDate(dateStr) {
  if (!dateStr) return '';
  const due = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.round((due - now) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  return `In ${diffDays}d`;
}

export function UpcomingTasksWidget({ todos = [], reminders = [] }) {
  const pendingTodos = todos
    .filter(t => !t.completed)
    .sort((a, b) => {
      if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return 0;
    })
    .slice(0, 3)
    .map(t => ({ id: `todo_${t.id}`, title: t.title, date: t.dueDate, priority: t.priority || 'medium' }));

  const activeReminders = reminders
    .filter(r => !r.completed)
    .sort((a, b) => {
      if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
      return 0;
    })
    .slice(0, 2)
    .map(r => ({ id: `rem_${r.id}`, title: r.title, date: r.dueDate, priority: r.priority || 'medium' }));

  const items = [...pendingTodos, ...activeReminders].slice(0, 4);

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#1E1B4B',
        borderRadius: 16,
        padding: 12,
        flexDirection: 'column',
      }}
      clickAction="OPEN_URI"
      clickActionData={{ uri: 'daily://todo-list' }}
    >
      <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <TextWidget
          text="Tasks & Reminders"
          style={{ fontSize: 13, color: '#A5B4FC', fontWeight: '700', flex: 1 }}
        />
        <TextWidget
          text={`${items.length}`}
          style={{ fontSize: 11, color: '#6366F1', fontWeight: '600' }}
        />
      </FlexWidget>

      {items.length === 0 && (
        <TextWidget
          text="All clear!"
          style={{ fontSize: 13, color: '#6B7280', marginTop: 8 }}
        />
      )}

      {items.map((item, i) => (
        <FlexWidget
          key={item.id}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 6,
            borderTopWidth: i === 0 ? 0 : 1,
            borderTopColor: '#312E81',
          }}
          clickAction="OPEN_URI"
          clickActionData={{ uri: 'daily://todo-list' }}
        >
          <FlexWidget
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: PRIORITY_COLOR[item.priority] || '#6366F1',
              marginRight: 8,
            }}
          />
          <TextWidget
            text={item.title}
            style={{ fontSize: 12, color: '#E5E7EB', flex: 1 }}
            maxLines={1}
          />
          {item.date ? (
            <TextWidget
              text={formatRelativeDate(item.date)}
              style={{ fontSize: 10, color: '#6B7280', marginLeft: 4 }}
            />
          ) : null}
        </FlexWidget>
      ))}
    </FlexWidget>
  );
}
