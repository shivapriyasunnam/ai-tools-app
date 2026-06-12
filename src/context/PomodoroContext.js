import { apiClient } from '@/src/services/apiClient';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export const PomodoroContext = createContext();

export function PomodoroProvider({ children }) {
  const [sessions, setSessions] = useState([]);
  const [timer, setTimer] = useState({
    isRunning: false,
    secondsLeft: 1500,
    type: 'work',
    startedAt: null,
    pausedAt: null,
  });

  useEffect(() => {
    apiClient.get('/api/pomodoro')
      .then(setSessions)
      .catch(() => setSessions([]));
  }, []);

  const addSession = useCallback(async (session) => {
    const created = await apiClient.post('/api/pomodoro', {
      start: new Date(session.start).toISOString(),
      end: session.end ? new Date(session.end).toISOString() : null,
      type: session.type,
      completed: session.completed,
    });
    setSessions(prev => [...prev, created]);
  }, []);

  const removeSession = useCallback(async (id) => {
    await apiClient.delete(`/api/pomodoro/${id}`).catch(() => {});
    setSessions(prev => prev.filter(s => s.id !== id));
  }, []);

  const resetSessions = useCallback(async () => {
    await Promise.all(sessions.map(s => apiClient.delete(`/api/pomodoro/${s.id}`).catch(() => {})));
    setSessions([]);
  }, [sessions]);

  const startTimer = useCallback((type = 'work', seconds = 1500) => {
    setTimer({ isRunning: true, secondsLeft: seconds, type, startedAt: Date.now(), pausedAt: null });
  }, []);

  const pauseTimer = useCallback(() => {
    setTimer(t => ({ ...t, isRunning: false, pausedAt: Date.now() }));
  }, []);

  const resumeTimer = useCallback(() => {
    setTimer(t => ({ ...t, isRunning: true, startedAt: Date.now() }));
  }, []);

  const resetTimer = useCallback(() => {
    setTimer({ isRunning: false, secondsLeft: 1500, type: 'work', startedAt: null, pausedAt: null });
  }, []);

  useEffect(() => {
    let interval;
    if (timer.isRunning && timer.secondsLeft > 0) {
      interval = setInterval(() => {
        setTimer(t => {
          if (t.secondsLeft > 0 && t.isRunning) return { ...t, secondsLeft: t.secondsLeft - 1 };
          clearInterval(interval);
          return t;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer.isRunning, timer.secondsLeft]);

  useEffect(() => {
    if (timer.secondsLeft === 0 && timer.isRunning) {
      addSession({ id: Date.now().toString(), start: timer.startedAt, end: Date.now(), type: timer.type, completed: true });
      setTimer(t => ({ ...t, isRunning: false }));
    }
  }, [timer.secondsLeft, timer.isRunning, timer.type, timer.startedAt, addSession]);

  return (
    <PomodoroContext.Provider
      value={{ sessions, addSession, removeSession, resetSessions, timer, isRunning: timer.isRunning, setTimer, startTimer, pauseTimer, resumeTimer, resetTimer }}
    >
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  return useContext(PomodoroContext);
}
