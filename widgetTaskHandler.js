"use no memo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AddExpenseWidget,
  FinancialOverviewWidget,
  UpcomingMeetingsWidget,
  UpcomingTasksWidget,
} from './src/widgets';

async function getWidgetData(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export async function widgetTaskHandler({ widgetInfo, widgetAction, renderWidget }) {
  // OPEN_URI / OPEN_APP click actions are handled natively by Android and never reach here
  if (widgetAction === 'WIDGET_CLICK' || widgetAction === 'WIDGET_DELETED') {
    return;
  }

  const { widgetName } = widgetInfo;

  switch (widgetName) {
    case 'AddExpenseWidget':
      renderWidget(<AddExpenseWidget />);
      break;

    case 'UpcomingTasksWidget': {
      const [todos, reminders] = await Promise.all([
        getWidgetData('widget_todos', []),
        getWidgetData('widget_reminders', []),
      ]);
      renderWidget(<UpcomingTasksWidget todos={todos} reminders={reminders} />);
      break;
    }

    case 'UpcomingMeetingsWidget': {
      const meetings = await getWidgetData('widget_meetings', []);
      renderWidget(<UpcomingMeetingsWidget meetings={meetings} />);
      break;
    }

    case 'FinancialOverviewWidget': {
      const [expenses, income, budgets] = await Promise.all([
        getWidgetData('widget_expenses', {}),
        getWidgetData('widget_income', {}),
        getWidgetData('widget_budgets', {}),
      ]);
      const expensesWithIncome = { ...expenses, monthlyIncome: income.monthlyIncome ?? 0 };
      renderWidget(<FinancialOverviewWidget expenses={expensesWithIncome} budgets={budgets} />);
      break;
    }

    default:
      break;
  }
}
