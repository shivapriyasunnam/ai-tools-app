import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@/src/services/apiClient';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export const PomodoroContext = createContext();

const DEFAULT_DURATIONS_KEY = '@pomodoro_default_durations';
const DEFAULT_DURATIONS = { work: 1500, shortBreak: 300, longBreak: 900 };
const VALID_TYPES = ['work', 'shortBreak', 'longBreak'];
const sanitizeType = (type) => VALID_TYPES.includes(type) ? type : 'work';

export function PomodoroProvider({ children }) {
  const [sessions, setSessions] = useState([]);
  const [defaultDurations, setDefaultDurations] = useState(DEFAULT_DURATIONS);
  const [timer, setTimer] = useState({
    isRunning: false,
    secondsLeft: 1500,
    totalSeconds: 1500,
    type: 'work',
    startedAt: null,
    pausedAt: null,
    sessionStart: null,
  });

  useEffect(() => {
    apiClient.get('/api/pomodoro')
      .then(setSessions)
      .catch(() => setSessions([]));
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(DEFAULT_DURATIONS_KEY)
      .then(saved => {
        if (saved) {
          const parsed = JSON.parse(saved);
          setDefaultDurations(prev => ({ ...prev, ...parsed }));
          setTimer(t => {
            if (!t.startedAt) {
              const seconds = parsed[t.type] ?? parsed.work ?? DEFAULT_DURATIONS.work;
              return { ...t, secondsLeft: seconds, totalSeconds: seconds };
            }
            return t;
          });
        }
      })
      .catch(() => {});
  }, []);

  const updateDefaultDurations = useCallback(async (durations) => {
    setDefaultDurations(prev => {
      const next = { ...prev, ...durations };
      AsyncStorage.setItem(DEFAULT_DURATIONS_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
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

  const updateSession = useCallback(async (id, updates) => {
    const updated = await apiClient.put(`/api/pomodoro/${id}`, updates);
    setSessions(prev => prev.map(s => (s.id === id ? updated : s)));
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
    setTimer({ isRunning: true, secondsLeft: seconds, totalSeconds: seconds, type: sanitizeType(type), startedAt: Date.now(), pausedAt: null, sessionStart: Date.now() });
  }, []);

  const pauseTimer = useCallback(() => {
    setTimer(t => ({ ...t, isRunning: false, pausedAt: Date.now() }));
  }, []);

  const resumeTimer = useCallback(() => {
    setTimer(t => ({ ...t, isRunning: true, startedAt: Date.now() }));
  }, []);

  const resetTimer = useCallback((type, seconds) => {
    setTimer(t => {
      const resolvedType = sanitizeType(type ?? t.type);
      const resolvedSeconds = seconds ?? defaultDurations[resolvedType] ?? defaultDurations.work;
      return { isRunning: false, secondsLeft: resolvedSeconds, totalSeconds: resolvedSeconds, type: resolvedType, startedAt: null, pausedAt: null, sessionStart: null };
    });
  }, [defaultDurations]);

  const logPartialSession = useCallback(() => {
    setTimer(t => {
      const elapsed = t.totalSeconds - t.secondsLeft;
      if (t.sessionStart && elapsed > 0) {
        addSession({ start: t.sessionStart, end: t.sessionStart + elapsed * 1000, type: t.type, completed: false });
      }
      const seconds = defaultDurations.work;
      return { isRunning: false, secondsLeft: seconds, totalSeconds: seconds, type: 'work', startedAt: null, pausedAt: null, sessionStart: null };
    });
  }, [addSession, defaultDurations]);

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
      addSession({ id: Date.now().toString(), start: timer.sessionStart, end: timer.sessionStart + timer.totalSeconds * 1000, type: timer.type, completed: true });
      setTimer(t => ({ ...t, isRunning: false, secondsLeft: t.totalSeconds, startedAt: null, sessionStart: null }));
    }
  }, [timer.secondsLeft, timer.isRunning, timer.type, timer.sessionStart, addSession]);

  return (
    <PomodoroContext.Provider
      value={{ sessions, addSession, updateSession, removeSession, resetSessions, timer, isRunning: timer.isRunning, setTimer, startTimer, pauseTimer, resumeTimer, resetTimer, logPartialSession, defaultDurations, updateDefaultDurations }}
    >
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  return useContext(PomodoroContext);
}
