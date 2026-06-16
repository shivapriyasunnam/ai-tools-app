"use no memo";
import {
  FlexWidget,
  OverlapWidget,
  TextWidget,
} from 'react-native-android-widget';

function formatMeetingTime(dateStr) {
  if (!dateStr) return { label: '', time: '', isToday: false };
  const d = new Date(dateStr);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isToday = d.toDateString() === now.toDateString();
  const isTomorrow = d.toDateString() === tomorrow.toDateString();
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (isToday) return { label: 'Today', time, isToday: true };
  if (isTomorrow) return { label: 'Tomorrow', time, isToday: false };
  return { label: d.toLocaleDateString([], { month: 'short', day: 'numeric' }), time, isToday: false };
}

export function UpcomingMeetingsWidget({ meetings = [] }) {
  const upcoming = meetings
    .filter(m => new Date(m.start) >= new Date())
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 4);

  return (
    <OverlapWidget style={{ height: 'match_parent', width: 'match_parent' }}>
      {/* Card */}
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
        clickActionData={{ uri: 'daily://meetings-scheduler' }}
      >
        {/* Header */}
        <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', width: 'match_parent', marginBottom: 14 }}>
          <TextWidget
            text="📅"
            style={{ fontSize: 16, marginRight: 7 }}
          />
          <TextWidget
            text="Upcoming Meetings"
            style={{ fontSize: 15, color: '#F8FAFC', fontWeight: '800' }}
          />
        </FlexWidget>

        {upcoming.length === 0 ? (
          <TextWidget text="No upcoming meetings" style={{ fontSize: 13, color: '#475569', fontWeight: '500', marginTop: 8 }} />
        ) : (
          upcoming.map((meeting, i) => {
            const { label, time, isToday } = formatMeetingTime(meeting.start);
            return (
              <FlexWidget
                key={meeting.id}
                style={{
                  flexDirection: 'column',
                  width: 'match_parent',
                  backgroundColor: '#1E293B',
                  borderRadius: 10,
                  paddingLeft: 12,
                  paddingRight: 10,
                  paddingTop: 9,
                  paddingBottom: 9,
                  marginBottom: i < upcoming.length - 1 ? 6 : 0,
                  borderLeftWidth: 3,
                  borderLeftColor: '#38BDF8',
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
                  text={`${label} · ${time}`}
                  style={{ fontSize: 10, color: isToday ? '#38BDF8' : '#64748B', marginTop: 3, fontWeight: '500' }}
                />
              </FlexWidget>
            );
          })
        )}
      </FlexWidget>

      {/* Badge — top-right corner */}
      {upcoming.length > 0 && (
        <FlexWidget
          style={{
            height: 'match_parent',
            width: 'match_parent',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
          }}
        >
          <FlexWidget
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: '#0369A1',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
              marginRight: 10,
            }}
          >
            <TextWidget text={`${upcoming.length}`} style={{ fontSize: 11, color: '#FFFFFF', fontWeight: '700' }} />
          </FlexWidget>
        </FlexWidget>
      )}
    </OverlapWidget>
  );
}
