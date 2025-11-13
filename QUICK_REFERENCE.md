# 🚀 Quick Reference Guide

## Start Here

```bash
cd /Users/priya/Desktop/priya/app/ai-tools-app
npm start              # Start dev server
npm run ios            # Run on iOS
npm run android        # Run on Android
```

## Project Layout

```
📁 ai-tools-app/
  📁 src/
    📁 screens/           → App screens (Home, ExpenseTracker, etc.)
    📁 components/ui/     → Button, Card components
    📁 navigation/        → RootNavigator.tsx
    📁 constants/         → colors.ts, spacing.ts
    📁 context/          → AppContext.tsx (global state)
    📁 types/            → TypeScript interfaces
    📁 utils/            → Helper functions
    📁 services/         → API calls (to implement)
    📁 hooks/            → Custom React hooks
  📄 App.tsx            → Entry point
  📄 app.json           → Expo config
```

## Key Files to Edit

### Add New Screen
Create file: `src/screens/YourFeature/YourFeatureScreen.tsx`
```typescript
import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { colors, spacing } from '../../constants';

export const YourFeatureScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Your Feature</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
});
```

Then add to `src/navigation/RootNavigator.tsx`:
```typescript
<Stack.Screen
  name="your-feature"
  component={YourFeatureScreen}
  options={{ title: 'Your Feature' }}
/>
```

### Use Colors
```typescript
import { colors } from '@/src/constants';

backgroundColor: colors.primary      // Indigo
backgroundColor: colors.secondary    // Pink
backgroundColor: colors.accent       // Emerald
backgroundColor: colors.gray[50]     // Light gray
```

### Use Spacing
```typescript
import { spacing } from '@/src/constants';

padding: spacing.md        // 16px
margin: spacing.lg         // 24px
marginBottom: spacing.sm   // 8px
```

### Create Reusable Component
Create file: `src/components/ui/YourComponent.tsx`
```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '../../constants';

interface YourComponentProps {
  // Define props
}

export const YourComponent: React.FC<YourComponentProps> = (props) => {
  return <View style={styles.container}>{/* content */}</View>;
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.white,
  },
});
```

## Navigation Routes Available

- `home` - Home screen
- `expense-tracker` - Expense tracker
- `budget-planner` - Budget planner
- `meetings-scheduler` - Meetings scheduler

Navigate: `navigation.navigate('expense-tracker')`

## Global State (Context)

Access global state:
```typescript
import { useAppContext } from '@/src/context/AppContext';

const MyComponent = () => {
  const { isDarkMode, setIsDarkMode } = useAppContext();
  // Use state here
};
```

Add to context: Edit `src/context/AppContext.tsx`

## Useful Commands

```bash
npm start              # Start dev server
npm run ios            # Run on iOS simulator
npm run android        # Run on Android emulator
npm run web            # Run on web
npm run lint           # Check code quality
npm install [package]  # Add dependency
```

## Common Patterns

### Create UI Card
```typescript
import { Card } from '@/src/components/ui';

<Card
  title="Title"
  description="Description"
  color={colors.primary}
  onPress={() => navigation.navigate('screen')}
/>
```

### Create Button
```typescript
import { Button } from '@/src/components/ui';

<Button
  title="Click me"
  onPress={() => { /* action */ }}
  variant="primary"
  size="medium"
/>
```

### Format Currency
```typescript
import { formatCurrency } from '@/src/utils';

const priceText = formatCurrency(99.99); // "$99.99"
```

### Format Date
```typescript
import { formatDate, formatDateTime } from '@/src/utils';

const dateText = formatDate(new Date());          // "Nov 12, 2025"
const dateTimeText = formatDateTime(new Date());  // "Nov 12, 2025 2:30 PM"
```

## Important Notes

✅ All platforms supported: iOS, Android, Web
✅ TypeScript enabled for type safety
✅ Project passes linting
✅ Ready to run: `npm start`

⚠️ API service needs implementation in `src/services/api.ts`
⚠️ No backend connected yet - add API endpoints

## Next Level

1. Connect to backend API
2. Add authentication
3. Implement each tool feature
4. Add unit/integration tests
5. Deploy to TestFlight/Google Play
