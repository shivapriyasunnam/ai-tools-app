# d.ai.ly Logo Component

A beautiful, scalable SVG-based logo component for the d.ai.ly app.

## 📦 Components

### 1. **DailyLogo** (Default Export)
The full horizontal logo, perfect for splash screens, headers, and branding.

```jsx
import DailyLogo from '@/components/ui/DailyLogo';

<DailyLogo width={120} height={40} variant="default" />
```

**Props:**
- `width` (number): Width of the logo. Default: `120`
- `height` (number): Height of the logo. Default: `40`
- `variant` (string): Color variant - `'default'`, `'white'`, or `'dark'`. Default: `'default'`

### 2. **DailyLogoIcon**
Square icon version, ideal for app icons, profile pictures, or compact displays.

```jsx
import { DailyLogoIcon } from '@/components/ui/DailyLogo';

<DailyLogoIcon size={60} variant="default" />
```

**Props:**
- `size` (number): Size of the square icon. Default: `60`
- `variant` (string): Color variant. Default: `'default'`

### 3. **DailyLogoCompact**
Compact horizontal version for tight spaces like navigation headers.

```jsx
import { DailyLogoCompact } from '@/components/ui/DailyLogo';

<DailyLogoCompact height={30} variant="white" />
```

**Props:**
- `height` (number): Height of the logo. Default: `30`
- `variant` (string): Color variant. Default: `'default'`

## 🎨 Variants

### Default
Colorful branding with indigo (#6366f1) and green (#10b981) accent for "ai"
- Use on light backgrounds
- Best for general app usage

### White
All-white logo
- Use on dark or colored backgrounds
- Perfect for headers with dark themes

### Dark
Dark gray logo
- Use on light backgrounds when you need high contrast
- Good for print materials

## 📱 Usage Examples

### In a Header
```jsx
import { DailyLogoCompact } from '@/components/ui/DailyLogo';

function Header() {
  return (
    <View style={styles.header}>
      <DailyLogoCompact height={28} variant="white" />
    </View>
  );
}
```

### On Home Screen
```jsx
import DailyLogo from '@/components/ui/DailyLogo';

function HomeScreen() {
  return (
    <View style={styles.welcome}>
      <DailyLogo width={180} height={60} variant="default" />
      <Text>Welcome to your daily companion</Text>
    </View>
  );
}
```

### As Profile Icon
```jsx
import { DailyLogoIcon } from '@/components/ui/DailyLogo';

function ProfileAvatar() {
  return (
    <DailyLogoIcon size={50} variant="default" />
  );
}
```

### In Settings
```jsx
import { DailyLogoIcon } from '@/components/ui/DailyLogo';

function SettingsAbout() {
  return (
    <View style={styles.aboutSection}>
      <DailyLogoIcon size={80} variant="default" />
      <Text>d.ai.ly v1.0.0</Text>
    </View>
  );
}
```

## 🎯 Best Practices

1. **Maintain Aspect Ratio**: When resizing, keep the proportions consistent
2. **Choose Appropriate Variant**: Use white on dark backgrounds, default on light
3. **Size Guidelines**:
   - Header: 24-30px height (use Compact)
   - Home screen: 50-60px height (use Full)
   - Icons: 40-80px (use Icon)
4. **Accessibility**: Ensure sufficient contrast between logo and background

## 🖼️ Demo

View all variants in the Logo Demo screen:
```bash
# Navigate to Logo Demo in your app
# File: app/(tabs)/logo-demo.js
```

## 🎨 Color Palette

The logo uses colors from the app's design system:

- **Primary Indigo**: `#6366f1`
- **Light Indigo**: `#818cf8`
- **Green Accent**: `#10b981` (for "ai")
- **Light Green**: `#34d399`

## 📝 Notes

- Built with `react-native-svg` (already installed)
- Fully scalable without quality loss
- No external image files needed
- Works on iOS, Android, and Web
- Supports light and dark themes

## 🔧 Customization

To customize colors, edit the `colors` object in `DailyLogo.js`:

```jsx
const colors = {
  default: {
    d: '#6366f1',   // Change primary color
    ai: '#10b981',  // Change accent color
    ly: '#6366f1',  // Change secondary color
  },
  // ... other variants
};
```

---

Made with ❤️ for d.ai.ly
