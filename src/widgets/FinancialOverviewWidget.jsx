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
  const budgetStatus = budgetPct >= 100 ? 'Over budget' : budgetPct >= 80 ? 'Near limit' : 'On track';
  const budgetColor = budgetPct >= 100 ? '#F87171' : budgetPct >= 80 ? '#FBBF24' : '#34D399';

  const now = new Date();
  const monthLabel = now.toLocaleDateString([], { month: 'short', year: 'numeric' });

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#0F172A',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'column',
      }}
      clickAction="OPEN_URI"
      clickActionData={{ uri: 'daily://expense-tracker' }}
    >
      {/* Header */}
      <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
        <TextWidget
          text="💰"
          style={{ fontSize: 16, marginRight: 7 }}
        />
        <TextWidget
          text="Finances"
          style={{ fontSize: 15, color: '#F8FAFC', fontWeight: '800', flex: 1 }}
        />
        <FlexWidget style={{ flexDirection: 'row', backgroundColor: '#1E293B', borderRadius: 8, paddingLeft: 7, paddingRight: 7, paddingTop: 3, paddingBottom: 3 }}>
          <TextWidget text={monthLabel} style={{ fontSize: 10, color: '#64748B', fontWeight: '500' }} />
        </FlexWidget>
      </FlexWidget>

      {/* Stat Cards */}
      <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
        <FlexWidget style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#052E16',
          borderRadius: 12,
          paddingTop: 10,
          paddingBottom: 10,
          marginRight: 6,
        }}>
          <TextWidget text="INCOME" style={{ fontSize: 8, color: '#4ADE80', fontWeight: '700', marginBottom: 5 }} />
          <TextWidget text={fmt(income)} style={{ fontSize: 17, color: '#4ADE80', fontWeight: '800' }} />
        </FlexWidget>

        <FlexWidget style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#2D0A0A',
          borderRadius: 12,
          paddingTop: 10,
          paddingBottom: 10,
          marginRight: 6,
        }}>
          <TextWidget text="SPENT" style={{ fontSize: 8, color: '#F87171', fontWeight: '700', marginBottom: 5 }} />
          <TextWidget text={fmt(spent)} style={{ fontSize: 17, color: '#F87171', fontWeight: '800' }} />
        </FlexWidget>

        <FlexWidget style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: netPositive ? '#052E16' : '#2D0A0A',
          borderRadius: 12,
          paddingTop: 10,
          paddingBottom: 10,
        }}>
          <TextWidget text="NET" style={{ fontSize: 8, color: netPositive ? '#4ADE80' : '#F87171', fontWeight: '700', marginBottom: 5 }} />
          <TextWidget
            text={`${netPositive ? '' : '-'}${fmt(net)}`}
            style={{ fontSize: 17, color: netPositive ? '#4ADE80' : '#F87171', fontWeight: '800' }}
          />
        </FlexWidget>
      </FlexWidget>

      {/* Budget Progress */}
      {totalBudget > 0 && (
        <FlexWidget style={{ flexDirection: 'column', backgroundColor: '#1E293B', borderRadius: 12, paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10 }}>
          <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <TextWidget text="Budget" style={{ fontSize: 11, color: '#94A3B8', fontWeight: '600' }} />
            <TextWidget
              text={`${budgetPct}%  •  ${budgetStatus}`}
              style={{ fontSize: 11, color: budgetColor, fontWeight: '700' }}
            />
          </FlexWidget>
          <FlexWidget style={{ height: 6, backgroundColor: '#334155', borderRadius: 3 }}>
            <FlexWidget
              style={{ height: 6, width: `${budgetPct}%`, backgroundColor: budgetColor, borderRadius: 3 }}
            />
          </FlexWidget>
        </FlexWidget>
      )}
    </FlexWidget>
  );
}
