# AI Tools App

A cross-platform React Native application with AI-powered tools for managing your productivity and finances. Built with Expo for seamless Android and iOS development.

## Features (In Development)

- **Expense Tracker**: AI-powered expense tracking and categorization
- **Budget Planner**: Smart budget management and planning
- **Meetings Scheduler**: Intelligent meeting scheduling and management
- More AI tools coming soon...

## Project Structure

```
ai-tools-app/
├── src/
│   ├── screens/           # App screens
│   │   ├── Home/         # Home screen
│   │   ├── ExpenseTracker/
│   │   ├── BudgetPlanner/
│   │   └── MeetingsScheduler/
│   ├── components/        # Reusable components
│   │   └── ui/           # UI components (Card, Button, etc.)
│   ├── navigation/        # Navigation configuration
│   ├── context/          # React Context for state management
│   ├── services/         # API and external service calls
│   ├── utils/            # Utility functions
│   ├── hooks/            # Custom React hooks
│   ├── constants/        # App constants (colors, spacing)
│   └── types/            # TypeScript type definitions
├── assets/               # Images and media files
├── App.tsx              # Main app entry point
├── app.json             # Expo configuration
└── package.json         # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js (v20+)
- npm or yarn
- Expo CLI (optional but recommended)

### Installation

1. **Clone the repository**
   ```bash
   cd ai-tools-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

### Running on Different Platforms

#### iOS
```bash
npm run ios
```

#### Android
```bash
npm run android
```

#### Web
```bash
npm run web
```

## Development

### Project Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State Management**: React Context API
- **Styling**: React Native StyleSheet

### Adding New Features

1. Create a new screen in `src/screens/`
2. Add navigation route in `src/navigation/RootNavigator.tsx`
3. Create reusable components in `src/components/ui/`
4. Update types in `src/types/index.ts` as needed

### Styling Guidelines

- Use the color palette from `src/constants/colors.ts`
- Use spacing system from `src/constants/spacing.ts`
- Keep components modular and reusable
- Use TypeScript for type safety

## Scripts

```bash
npm start      # Start development server
npm run ios    # Build and run on iOS simulator/device
npm run android # Build and run on Android emulator/device
npm run web    # Run web version
npm run lint   # Run ESLint
```

## Configuration

### App Permissions (Android & iOS)

The app requests the following permissions:
- Camera (for AI features)
- Microphone (for meeting scheduling)
- Calendar (for meeting integration)

See `app.json` for platform-specific configurations.

## Contributing

1. Create a feature branch
2. Make your changes
3. Test on both iOS and Android
4. Submit a pull request

## License

MIT

## Support

For issues and questions, please open an issue in the repository.

---

**Note**: This is a foundation project. Features are currently placeholders and ready for development.
