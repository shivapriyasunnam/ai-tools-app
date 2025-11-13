import React from 'react';
import { PomodoroProvider } from '../../src/context/PomodoroContext';

export default function PomodoroProviderWrapper({ children }) {
  return <PomodoroProvider>{children}</PomodoroProvider>;
}
