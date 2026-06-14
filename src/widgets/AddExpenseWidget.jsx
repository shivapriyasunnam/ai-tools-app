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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#6366F1',
        borderRadius: 16,
      }}
      clickAction="OPEN_URI"
      clickActionData={{ uri: 'daily://add-expense' }}
    >
      <TextWidget
        text="+"
        style={{
          fontSize: 32,
          color: '#FFFFFF',
          fontWeight: 'bold',
        }}
      />
      <TextWidget
        text="Add Expense"
        style={{
          fontSize: 13,
          color: '#FFFFFF',
          fontWeight: '600',
          marginTop: 2,
        }}
      />
    </FlexWidget>
  );
}
