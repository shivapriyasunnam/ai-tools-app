import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const POMODORO_KEY = 'POMODORO_SESSIONS';

export const PomodoroContext = createContext();

export function PomodoroProvider({ children }) {
  const [sessions, setSessions] = useState([]); // {id, start, end, type, completed}
  const [timer, setTimer] = useState({
    isRunning: false,
    secondsLeft: 1500, // 25 min default
    type: 'work', // 'work' | 'break' | 'longBreak'
    startedAt: null,
    pausedAt: null,
  });

  // Load sessions from storage
  useEffect(() => {
    AsyncStorage.getItem(POMODORO_KEY).then(data => {
      if (data) setSessions(JSON.parse(data));
    });
  }, []);

  // Save sessions to storage
  useEffect(() => {
    AsyncStorage.setItem(POMODORO_KEY, JSON.stringify(sessions));
  }, [sessions]);

  // Add a session
  const addSession = useCallback((session) => {
    setSessions(prev => [...prev, session]);
  }, []);

  // Remove a session
  const removeSession = useCallback((id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  }, []);

  // Reset all sessions
  const resetSessions = useCallback(() => {
    setSessions([]);
  }, []);

  // Timer controls
  const startTimer = useCallback((type = 'work', seconds = 1500) => {
    setTimer({
      isRunning: true,
      secondsLeft: seconds,
      type,
      startedAt: Date.now(),
      pausedAt: null,
    });
  }, []);

  const pauseTimer = useCallback(() => {
    setTimer(t => ({ ...t, isRunning: false, pausedAt: Date.now() }));
  }, []);

  const resumeTimer = useCallback(() => {
    setTimer(t => ({ ...t, isRunning: true, startedAt: Date.now() }));
  }, []);

  const resetTimer = useCallback(() => {
    setTimer({
      isRunning: false,
      secondsLeft: 1500,
      type: 'work',
      startedAt: null,
      pausedAt: null,
    });
  }, []);

  // Decrement timer
  useEffect(() => {
    let interval;
    if (timer.isRunning && timer.secondsLeft > 0) {
      interval = setInterval(() => {
        setTimer(t => {
          if (t.secondsLeft > 0 && t.isRunning) {
            return { ...t, secondsLeft: t.secondsLeft - 1 };
          } else {
            clearInterval(interval);
            return t;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer.isRunning, timer.secondsLeft]);

  // When timer hits zero, add session
  useEffect(() => {
    if (timer.secondsLeft === 0 && timer.isRunning) {
      addSession({
        id: Date.now().toString(),
        start: timer.startedAt,
        end: Date.now(),
        type: timer.type,
        completed: true,
      });
      setTimer(t => ({ ...t, isRunning: false }));
    }
  }, [timer.secondsLeft, timer.isRunning, timer.type, timer.startedAt, addSession]);

  return (
    <PomodoroContext.Provider
      value={{
        sessions,
        addSession,
        removeSession,
        resetSessions,
        timer,
        isRunning: timer.isRunning,
        setTimer,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  return useContext(PomodoroContext);
}
