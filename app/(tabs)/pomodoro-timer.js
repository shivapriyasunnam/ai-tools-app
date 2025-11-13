import PomodoroTimerScreen from '../../src/screens/PomodoroTimer';
import PomodoroProviderWrapper from '../tools/_PomodoroProvider';

export default function PomodoroTimerToolScreen(props) {
	return (
		<PomodoroProviderWrapper>
			<PomodoroTimerScreen {...props} />
		</PomodoroProviderWrapper>
	);
}
