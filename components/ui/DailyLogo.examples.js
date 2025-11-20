/**
 * d.ai.ly Logo Component Usage Examples
 * 
 * This file demonstrates how to use the DailyLogo components throughout the app
 */

import { StyleSheet, View } from 'react-native';
import DailyLogo, { DailyLogoCompact, DailyLogoIcon } from './DailyLogo';

// Example 1: Default Logo (Full size)
export function LogoExample1() {
  return (
    <View style={styles.container}>
      <DailyLogo width={120} height={40} variant="default" />
    </View>
  );
}

// Example 2: White Logo (for dark backgrounds)
export function LogoExample2() {
  return (
    <View style={[styles.container, { backgroundColor: '#1f2937' }]}>
      <DailyLogo width={120} height={40} variant="white" />
    </View>
  );
}

// Example 3: Icon Version (Square)
export function LogoExample3() {
  return (
    <View style={styles.container}>
      <DailyLogoIcon size={60} variant="default" />
    </View>
  );
}

// Example 4: Compact Version (for headers)
export function LogoExample4() {
  return (
    <View style={styles.container}>
      <DailyLogoCompact height={30} variant="default" />
    </View>
  );
}

// Example 5: In a Header
export function HeaderWithLogo() {
  return (
    <View style={styles.header}>
      <DailyLogoCompact height={24} variant="white" />
    </View>
  );
}

// Example 6: As App Icon Preview
export function AppIconPreview() {
  return (
    <View style={styles.container}>
      <DailyLogoIcon size={80} variant="default" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: '#6366f1',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/**
 * USAGE IN YOUR APP:
 * 
 * 1. Import the logo:
 *    import DailyLogo from '@/components/ui/DailyLogo';
 * 
 * 2. Use in your component:
 *    <DailyLogo width={120} height={40} variant="default" />
 * 
 * PROPS:
 * 
 * DailyLogo:
 *   - width: number (default: 120)
 *   - height: number (default: 40)
 *   - variant: 'default' | 'white' | 'dark' (default: 'default')
 * 
 * DailyLogoIcon:
 *   - size: number (default: 60)
 *   - variant: 'default' | 'white' | 'dark' (default: 'default')
 * 
 * DailyLogoCompact:
 *   - height: number (default: 30)
 *   - variant: 'default' | 'white' | 'dark' (default: 'default')
 * 
 * VARIANTS:
 *   - 'default': Colorful logo with indigo and green
 *   - 'white': All white (for dark backgrounds)
 *   - 'dark': Dark colors (for light backgrounds with high contrast)
 */
