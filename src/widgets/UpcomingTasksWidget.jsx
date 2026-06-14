"use no memo";
import {
  FlexWidget,
  TextWidget,
} from 'react-native-android-widget';

const PRIORITY_COLORS = {
  high:   { dot: '#F87171' },
  medium: { dot: '#FBBF24' },
  low:    { dot: '#34D399' },
};

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
        backgroundColor: '#0F172A',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'column',
      }}
      clickAction="OPEN_URI"
      clickActionData={{ uri: 'daily://todo-list' }}
    >
      {/* Header */}
      <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
        <TextWidget
          text="✓"
          style={{ fontSize: 15, color: '#818CF8', fontWeight: '800', marginRight: 7 }}
        />
        <TextWidget
          text="Tasks & Reminders"
          style={{ fontSize: 15, color: '#F8FAFC', fontWeight: '800', flex: 1 }}
        />
        {items.length > 0 && (
          <FlexWidget style={{ flexDirection: 'row', backgroundColor: '#312E81', borderRadius: 10, paddingLeft: 8, paddingRight: 8, paddingTop: 3, paddingBottom: 3 }}>
            <TextWidget text={`${items.length}`} style={{ fontSize: 11, color: '#A5B4FC', fontWeight: '700' }} />
          </FlexWidget>
        )}
      </FlexWidget>

      {items.length === 0 ? (
        <TextWidget
          text="All clear!"
          style={{ fontSize: 13, color: '#475569', fontWeight: '500', marginTop: 8 }}
        />
      ) : (
        items.map((item, i) => {
          const p = PRIORITY_COLORS[item.priority] || PRIORITY_COLORS.medium;
          const dateLabel = item.date ? formatRelativeDate(item.date) : null;
          const isOverdue = dateLabel === 'Overdue';
          return (
            <FlexWidget
              key={item.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#1E293B',
                borderRadius: 10,
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 9,
                paddingBottom: 9,
                marginBottom: i < items.length - 1 ? 6 : 0,
              }}
              clickAction="OPEN_URI"
              clickActionData={{ uri: 'daily://todo-list' }}
            >
              <FlexWidget
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: p.dot,
                  marginRight: 9,
                }}
              />
              <TextWidget
                text={item.title}
                style={{ fontSize: 12, color: '#E2E8F0', flex: 1, fontWeight: '500' }}
                maxLines={1}
              />
              {dateLabel ? (
                <FlexWidget style={{
                  flexDirection: 'row',
                  backgroundColor: isOverdue ? '#3B0F0F' : '#0F172A',
                  borderRadius: 6,
                  paddingLeft: 5,
                  paddingRight: 5,
                  paddingTop: 2,
                  paddingBottom: 2,
                  marginLeft: 6,
                }}>
                  <TextWidget
                    text={dateLabel}
                    style={{ fontSize: 9, color: isOverdue ? '#F87171' : '#64748B', fontWeight: '600' }}
                  />
                </FlexWidget>
              ) : null}
            </FlexWidget>
          );
        })
      )}
    </FlexWidget>
  );
}
