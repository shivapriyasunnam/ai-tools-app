import { useContext, useMemo } from 'react';
import { PomodoroContext } from '../context/PomodoroContext';

export default function usePomodoroStats() {
  const { sessions } = useContext(PomodoroContext);

  // Total sessions
  const totalSessions = sessions.length;

  // Total focused time in seconds (work sessions only)
  const totalFocusedSeconds = useMemo(() => {
    const workSessions = sessions.filter(s => s.type === 'work' && s.completed);
    
    const total = workSessions.reduce((sum, s) => {
      // Calculate actual duration from start and end timestamps
      const durationMs = s.end - s.start;
      const durationSeconds = Math.floor(durationMs / 1000);
      return sum + durationSeconds;
    }, 0);
    
    return total;
  }, [sessions]);

  // Total focused time formatted as "X.X hours" or "X min Y sec"
  const totalFocusedHours = useMemo(() => {
    const hours = Math.floor(totalFocusedSeconds / 3600);
    const minutes = Math.floor((totalFocusedSeconds % 3600) / 60);
    const seconds = totalFocusedSeconds % 60;

    if (totalFocusedSeconds < 60) {
      return `${seconds} sec`;
    } else if (totalFocusedSeconds < 3600) {
      if (seconds === 0) {
        return `${minutes} min`;
      }
      return `${minutes} min ${seconds} sec`;
    } else {
      if (minutes === 0 && seconds === 0) {
        return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
      } else if (seconds === 0) {
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${minutes} min`;
      }
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${minutes} min ${seconds} sec`;
    }
  }, [totalFocusedSeconds]);

  // For backward compatibility, also provide numeric hours value
  const totalFocusedHoursNumeric = (totalFocusedSeconds / 3600).toFixed(2);

  return {
    totalSessions,
    totalFocusedSeconds,
    totalFocusedHours,
    totalFocusedHoursNumeric,
  };
}
