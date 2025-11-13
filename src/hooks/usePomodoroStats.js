import { useContext, useMemo } from 'react';
import { PomodoroContext } from '../context/PomodoroContext';

export default function usePomodoroStats() {
  const { sessions } = useContext(PomodoroContext);

  // Total sessions
  const totalSessions = sessions.length;

  // Total focused time in seconds (work sessions only)
  const totalFocusedSeconds = useMemo(() =>
    sessions.filter(s => s.type === 'work' && s.completed).reduce((sum, s) => sum + 1500, 0),
    [sessions]
  );

  // Total focused time in hours
  const totalFocusedHours = (totalFocusedSeconds / 3600).toFixed(1);

  return {
    totalSessions,
    totalFocusedSeconds,
    totalFocusedHours,
  };
}
