# AI Tools App - Setup & Development Guide

## 🚀 Quick Start

Your React Native AI Tools app is ready to go! This project is configured to run on both Android and iOS platforms using Expo.

### Installation & Running

```bash
# Install dependencies (already done)
npm install

# Start the development server
npm start

# In another terminal, run on your platform:
npm run ios      # iOS simulator/device
npm run android  # Android emulator/device
npm run web      # Web browser
```

## 📁 Project Structure Overview

### Core Directories

- **`src/screens/`** - Main application screens
  - `Home/` - Dashboard/home screen
  - `ExpenseTracker/` - Expense tracking screen
  - `BudgetPlanner/` - Budget management screen
  - `MeetingsScheduler/` - Meeting scheduling screen

- **`src/components/ui/`** - Reusable UI components
  - `Button.tsx` - Custom button component
  - `Card.tsx` - Card component for lists

- **`src/navigation/`** - Navigation setup
  - `RootNavigator.tsx` - Stack navigation configuration

- **`src/constants/`** - Global constants
  - `colors.ts` - Color palette (primary, secondary, accent, etc.)
  - `spacing.ts` - Spacing scale for consistent layouts

- **`src/context/`** - React Context for state management
  - `AppContext.tsx` - Global app context (dark mode, user info)

- **`src/types/`** - TypeScript interfaces
  - `index.ts` - All app data types (Expense, Budget, Meeting, etc.)

- **`src/utils/`** - Utility functions
  - `formatting.ts` - Currency, date, and time formatters

- **`src/services/`** - API and external services
  - `api.ts` - HTTP requests and API calls (to be implemented)

- **`src/hooks/`** - Custom React hooks
  - Add custom hooks here as needed

## 🎨 Styling System

### Colors
Located in `src/constants/colors.ts`:
- **Primary**: Indigo (#6366f1) - Main brand color
- **Secondary**: Pink (#ec4899) - Accent color
- **Accent**: Emerald (#10b981) - Success/highlight
- **Status**: Success, Warning, Error, Info colors
- **Grayscale**: Complete gray palette (50-900)

### Spacing
Located in `src/constants/spacing.ts`:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px

Use these constants for consistent spacing throughout the app.

## 🛠️ Next Steps - What You Can Do

### 1. Add More Screens
Create new screens in `src/screens/`:
```typescript
// Example: NewFeatureScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors, spacing } from '../../constants';

export const NewFeatureScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Your content here */}
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

### 2. Create More UI Components
Add to `src/components/ui/`:
- TextInput component
- Loading spinner
- Empty state component
- etc.

### 3. Set Up State Management
The `AppContext` is ready for expansion:
- Add user authentication state
- Theme switching
- Global notifications

### 4. Implement API Integration
Update `src/services/api.ts` with:
- API endpoints
- Authentication
- Error handling

### 5. Add More Screens to Navigation
Edit `src/navigation/RootNavigator.tsx` to add more routes.

## 📱 Platform-Specific Configuration

### iOS
- Bundle Identifier: `com.aitools.app`
- Minimum deployment target: Configured in app.json
- Permissions: Microphone, Camera, Calendar (in app.json)

### Android
- Package: `com.aitools.app`
- Permissions: Camera, Microphone, Calendar read/write
- Edge-to-edge UI enabled

See `app.json` for all platform configurations.

## 🧪 Testing & Development

### Lint Code
```bash
npm run lint
```

### Development Tips
- **Hot Reload**: Expo automatically reloads on file changes
- **Debug**: Press `d` in Expo CLI to open debug menu
- **Logs**: Check console output for debugging
- **Device Testing**: Scan QR code with Expo Go app

## 📦 Dependencies

Core dependencies already included:
- `react-native` - Core framework
- `@react-navigation/native` - Routing
- `@react-navigation/native-stack` - Stack navigation
- `expo` - Build system and SDK
- `typescript` - Type safety

## 🔐 Security Considerations

- Sensitive data should be stored using `expo-secure-store`
- API keys should be in environment variables
- Consider using `expo-auth-session` for OAuth

## 🚢 Deployment

### iOS
```bash
eas build --platform ios
eas submit --platform ios
```

### Android
```bash
eas build --platform android
eas submit --platform android
```

(Requires EAS account setup)

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 💡 Architecture Decisions

- **Expo**: For maximum code reuse between iOS and Android
- **React Navigation**: Standard routing solution for React Native
- **Context API**: Simple state management (can upgrade to Redux/Zustand if needed)
- **TypeScript**: Type safety and better developer experience
- **Custom UI Components**: Consistent styling and easy customization

---

You're all set! Start building your AI tools app! 🎉
