import { apiClient } from '@/src/services/apiClient';
import { updateMeetingsWidget } from '@/src/services/widgetService';
import { createContext, useContext, useEffect, useState } from 'react';

const MeetingsContext = createContext(undefined);

export const MeetingsProvider = ({ children }) => {
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/api/meetings')
      .then(data => {
        setMeetings(data);
        updateMeetingsWidget(data).catch(() => {});
      })
      .catch(() => setMeetings([]))
      .finally(() => setIsLoading(false));
  }, []);

  const addMeeting = async (meeting) => {
    try {
      const created = await apiClient.post('/api/meetings', {
        title: meeting.title,
        start: meeting.start,
        end: meeting.end,
        organizer: meeting.organizer,
        description: meeting.description,
      });
      const newMeetings = [...meetings, created];
      setMeetings(newMeetings);
      updateMeetingsWidget(newMeetings).catch(() => {});
      return true;
    } catch (error) {
      console.error('Error adding meeting:', error);
      return false;
    }
  };

  const deleteMeeting = async (meetingId) => {
    try {
      await apiClient.delete(`/api/meetings/${meetingId}`);
      const newMeetings = meetings.filter(m => m.id !== meetingId);
      setMeetings(newMeetings);
      updateMeetingsWidget(newMeetings).catch(() => {});
      return true;
    } catch (error) {
      console.error('Error deleting meeting:', error);
      return false;
    }
  };

  const saveMeetings = async (newMeetings) => {
    // Used by calendar sync — replaces all meetings
    try {
      await Promise.all(meetings.map(m => apiClient.delete(`/api/meetings/${m.id}`)));
      const created = await Promise.all(newMeetings.map(m => apiClient.post('/api/meetings', m)));
      setMeetings(created);
      updateMeetingsWidget(created).catch(() => {});
      return true;
    } catch (error) {
      console.error('Error saving meetings:', error);
      return false;
    }
  };

  const getTodayMeetings = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return meetings.filter(m => {
      const d = new Date(m.start);
      return d >= today && d < tomorrow;
    });
  };

  const getWeekMeetings = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return meetings.filter(m => {
      const d = new Date(m.start);
      return d >= today && d < nextWeek;
    });
  };

  return (
    <MeetingsContext.Provider
      value={{
        meetings,
        isLoading,
        saveMeetings,
        addMeeting,
        deleteMeeting,
        getTodayMeetings,
        getWeekMeetings,
        loadMeetings: () => {},
      }}
    >
      {children}
    </MeetingsContext.Provider>
  );
};


export const useMeetings = () => {
  const context = useContext(MeetingsContext);
  if (context === undefined) throw new Error('useMeetings must be used within a MeetingsProvider');
  return context;
};

export default MeetingsContext;
