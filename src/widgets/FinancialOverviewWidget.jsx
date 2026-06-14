"use no memo";
import {
  FlexWidget,
  TextWidget,
} from 'react-native-android-widget';

function fmt(amount) {
  if (amount === undefined || amount === null) return '$0';
  const abs = Math.abs(amount);
  if (abs >= 1000) return `$${(abs / 1000).toFixed(1)}k`;
  return `$${abs.toFixed(0)}`;
}

export function FinancialOverviewWidget({ expenses = {}, budgets = {} }) {
  const income = expenses.monthlyIncome ?? 0;
  const spent = expenses.monthlyTotal ?? 0;
  const net = income - spent;
  const netPositive = net >= 0;

  const totalBudget = budgets.totalBudget ?? 0;
  const totalSpent = budgets.totalSpent ?? 0;
  const budgetPct = totalBudget > 0 ? Math.min(Math.round((totalSpent / totalBudget) * 100), 100) : 0;
  const budgetStatus = budgetPct >= 100 ? 'Exceeded' : budgetPct >= 80 ? 'Warning' : 'On Track';
  const budgetColor = budgetPct >= 100 ? '#EF4444' : budgetPct >= 80 ? '#F59E0B' : '#10B981';

  const now = new Date();
  const monthLabel = now.toLocaleDateString([], { month: 'short', year: 'numeric' });

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#111827',
        borderRadius: 16,
        padding: 14,
        flexDirection: 'column',
      }}
      clickAction="OPEN_URI"
      clickActionData={{ uri: 'daily://expense-tracker' }}
    >
      <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <TextWidget
          text="💰 Finances"
          style={{ fontSize: 13, color: '#A5B4FC', fontWeight: '700', flex: 1 }}
        />
        <TextWidget
          text={monthLabel}
          style={{ fontSize: 10, color: '#6B7280' }}
        />
      </FlexWidget>

      <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
        <FlexWidget style={{ flex: 1, alignItems: 'center' }}>
          <TextWidget text="Income" style={{ fontSize: 10, color: '#6B7280', marginBottom: 3 }} />
          <TextWidget text={fmt(income)} style={{ fontSize: 15, color: '#10B981', fontWeight: '700' }} />
        </FlexWidget>

        <FlexWidget style={{ width: 1, backgroundColor: '#1F2937' }} />

        <FlexWidget style={{ flex: 1, alignItems: 'center' }}>
          <TextWidget text="Spent" style={{ fontSize: 10, color: '#6B7280', marginBottom: 3 }} />
          <TextWidget text={fmt(spent)} style={{ fontSize: 15, color: '#EF4444', fontWeight: '700' }} />
        </FlexWidget>

        <FlexWidget style={{ width: 1, backgroundColor: '#1F2937' }} />

        <FlexWidget style={{ flex: 1, alignItems: 'center' }}>
          <TextWidget text="Net" style={{ fontSize: 10, color: '#6B7280', marginBottom: 3 }} />
          <TextWidget
            text={`${netPositive ? '' : '-'}${fmt(net)}`}
            style={{ fontSize: 15, color: netPositive ? '#10B981' : '#EF4444', fontWeight: '700' }}
          />
        </FlexWidget>
      </FlexWidget>

      {totalBudget > 0 && (
        <FlexWidget style={{ flexDirection: 'column' }}>
          <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            <TextWidget text="Budget" style={{ fontSize: 10, color: '#6B7280' }} />
            <TextWidget
              text={`${budgetPct}% — ${budgetStatus}`}
              style={{ fontSize: 10, color: budgetColor, fontWeight: '600' }}
            />
          </FlexWidget>
          <FlexWidget
            style={{ height: 4, backgroundColor: '#1F2937', borderRadius: 2 }}
          >
            <FlexWidget
              style={{
                height: 4,
                width: `${budgetPct}%`,
                backgroundColor: budgetColor,
                borderRadius: 2,
              }}
            />
          </FlexWidget>
        </FlexWidget>
      )}
    </FlexWidget>
  );
}
