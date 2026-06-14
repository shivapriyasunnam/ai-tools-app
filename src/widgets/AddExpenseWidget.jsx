"use no memo";
import {
  FlexWidget,
  TextWidget,
} from 'react-native-android-widget';

export function AddExpenseWidget() {
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#0F172A',
        borderRadius: 20,
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      clickAction="OPEN_URI"
      clickActionData={{ uri: 'daily://add-expense' }}
    >
      <FlexWidget
        style={{
          height: 'match_parent',
          width: 'match_parent',
          backgroundColor: '#4338CA',
          borderRadius: 16,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <FlexWidget style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: '#6366F1',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 6,
        }}>
          <TextWidget
            text="+"
            style={{ fontSize: 28, color: '#FFFFFF', fontWeight: '800' }}
          />
        </FlexWidget>
        <TextWidget
          text="Add Expense"
          style={{ fontSize: 11, color: '#C7D2FE', fontWeight: '700' }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}
