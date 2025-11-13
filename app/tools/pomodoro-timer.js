import React from 'react';
import PomodoroTimerScreen from '../../src/screens/PomodoroTimer';
import PomodoroProviderWrapper from './_PomodoroProvider';

export default function PomodoroTimerToolScreen(props) {
	return (
		<PomodoroProviderWrapper>
			<PomodoroTimerScreen {...props} />
		</PomodoroProviderWrapper>
	);
}
