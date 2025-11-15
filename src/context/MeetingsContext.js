import { createContext, useContext, useEffect, useState } from 'react';
import { storageService } from '../services/storageService';

const MeetingsContext = createContext(undefined);

export const MeetingsProvider = ({ children }) => {
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load meetings on mount
  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      const storedMeetings = await storageService.getMeetings();
      setMeetings(storedMeetings);
    } catch (error) {
      console.error('Error loading meetings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveMeetings = async (newMeetings) => {
    try {
      await storageService.saveMeetings(newMeetings);
      setMeetings(newMeetings);
      return true;
    } catch (error) {
      console.error('Error saving meetings:', error);
      return false;
    }
  };

  const addMeeting = async (meeting) => {
    try {
      const newMeetings = [...meetings, { ...meeting, id: Date.now().toString() }];
      await storageService.saveMeetings(newMeetings);
      setMeetings(newMeetings);
      return true;
    } catch (error) {
      console.error('Error adding meeting:', error);
      return false;
    }
  };

  const deleteMeeting = async (meetingId) => {
    try {
      const filteredMeetings = meetings.filter(m => m.id !== meetingId);
      await storageService.saveMeetings(filteredMeetings);
      setMeetings(filteredMeetings);
      return true;
    } catch (error) {
      console.error('Error deleting meeting:', error);
      return false;
    }
  };

  // Get meetings for today
  const getTodayMeetings = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return meetings.filter(meeting => {
      const meetingDate = new Date(meeting.start);
      return meetingDate >= today && meetingDate < tomorrow;
    });
  };

  // Get meetings for this week
  const getWeekMeetings = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return meetings.filter(meeting => {
      const meetingDate = new Date(meeting.start);
      return meetingDate >= today && meetingDate < nextWeek;
    });
  };

  const value = {
    meetings,
    isLoading,
    saveMeetings,
    addMeeting,
    deleteMeeting,
    getTodayMeetings,
    getWeekMeetings,
    loadMeetings,
  };

  return <MeetingsContext.Provider value={value}>{children}</MeetingsContext.Provider>;
};

export const useMeetings = () => {
  const context = useContext(MeetingsContext);
  if (context === undefined) {
    throw new Error('useMeetings must be used within a MeetingsProvider');
  }
  return context;
};

export default MeetingsContext;
