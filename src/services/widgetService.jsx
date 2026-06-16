"use no memo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestWidgetUpdate } from 'react-native-android-widget';
import { UpcomingMeetingsWidget, UpcomingTasksWidget } from '../widgets';

export async function updateTodosWidget(todos) {
  const slim = todos
    .filter(t => !t.completed)
    .map(t => ({ id: t.id, title: t.title, priority: t.priority, dueDate: t.dueDate }));
  await AsyncStorage.setItem('widget_todos', JSON.stringify(slim)).catch(() => {});
  requestWidgetUpdate({
    widgetName: 'UpcomingTasksWidget',
    renderWidget: async () => <UpcomingTasksWidget todos={slim} />,
    widgetNotFound: () => {},
  }).catch(() => {});
}

export async function updateMeetingsWidget(meetings) {
  const now = new Date();
  const upcoming = meetings
    .filter(m => new Date(m.start) >= now)
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 5)
    .map(m => ({ id: m.id, title: m.title, start: m.start, end: m.end }));
  await AsyncStorage.setItem('widget_meetings', JSON.stringify(upcoming)).catch(() => {});
  requestWidgetUpdate({
    widgetName: 'UpcomingMeetingsWidget',
    renderWidget: async () => <UpcomingMeetingsWidget meetings={upcoming} />,
    widgetNotFound: () => {},
  }).catch(() => {});
}
