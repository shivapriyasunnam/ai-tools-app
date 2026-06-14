"use no memo";
import {
  FlexWidget,
  TextWidget,
} from 'react-native-android-widget';

function formatMeetingTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow = d.toDateString() === tomorrow.toDateString();
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (isToday) return `Today ${time}`;
  if (isTomorrow) return `Tomorrow ${time}`;
  return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} ${time}`;
}

export function UpcomingMeetingsWidget({ meetings = [] }) {
  const upcoming = meetings
    .filter(m => new Date(m.start) >= new Date())
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 4);

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#0F172A',
        borderRadius: 16,
        padding: 12,
        flexDirection: 'column',
      }}
      clickAction="OPEN_URI"
      clickActionData={{ uri: 'daily://meetings-scheduler' }}
    >
      <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <TextWidget
          text="Upcoming Meetings"
          style={{ fontSize: 13, color: '#7DD3FC', fontWeight: '700', flex: 1 }}
        />
        <TextWidget
          text={`${upcoming.length}`}
          style={{ fontSize: 11, color: '#0EA5E9', fontWeight: '600' }}
        />
      </FlexWidget>

      {upcoming.length === 0 && (
        <TextWidget
          text="No upcoming meetings"
          style={{ fontSize: 12, color: '#6B7280', marginTop: 8 }}
        />
      )}

      {upcoming.map((meeting, i) => (
        <FlexWidget
          key={meeting.id}
          style={{
            flexDirection: 'column',
            paddingVertical: 7,
            borderTopWidth: i === 0 ? 0 : 1,
            borderTopColor: '#1E293B',
          }}
          clickAction="OPEN_URI"
          clickActionData={{ uri: 'daily://meetings-scheduler' }}
        >
          <TextWidget
            text={meeting.title}
            style={{ fontSize: 12, color: '#F1F5F9', fontWeight: '600' }}
            maxLines={1}
          />
          <TextWidget
            text={formatMeetingTime(meeting.start)}
            style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}
          />
        </FlexWidget>
      ))}
    </FlexWidget>
  );
}
