import DailyLogo, { DailyLogoCompact, DailyLogoIcon } from '@/components/ui/DailyLogo';
import { colors } from '@/src/constants';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Logo Demo Screen
 * Showcases all variants of the d.ai.ly logo
 */
export default function LogoDemoScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>d.ai.ly Logo Variants</Text>
        
        {/* Full Logo - Default */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Full Logo - Default</Text>
          <View style={styles.logoContainer}>
            <DailyLogo width={150} height={50} variant="default" />
          </View>
        </View>

        {/* Full Logo - White */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Full Logo - White</Text>
          <View style={[styles.logoContainer, styles.darkBg]}>
            <DailyLogo width={150} height={50} variant="white" />
          </View>
        </View>

        {/* Icon Versions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Icon Versions</Text>
          <View style={styles.row}>
            <View style={styles.iconWrapper}>
              <DailyLogoIcon size={80} variant="default" />
              <Text style={styles.caption}>Default</Text>
            </View>
            <View style={styles.iconWrapper}>
              <View style={[styles.iconBg, { backgroundColor: '#1f2937' }]}>
                <DailyLogoIcon size={80} variant="white" />
              </View>
              <Text style={styles.caption}>White</Text>
            </View>
          </View>
        </View>

        {/* Compact Versions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compact Logo (for headers)</Text>
          <View style={styles.logoContainer}>
            <DailyLogoCompact height={35} variant="default" />
          </View>
          <View style={[styles.logoContainer, styles.darkBg, { marginTop: 16 }]}>
            <DailyLogoCompact height={35} variant="white" />
          </View>
        </View>

        {/* Size Variations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Size Variations</Text>
          <View style={styles.logoContainer}>
            <DailyLogo width={100} height={33} variant="default" />
            <View style={{ height: 16 }} />
            <DailyLogo width={150} height={50} variant="default" />
            <View style={{ height: 16 }} />
            <DailyLogo width={200} height={66} variant="default" />
          </View>
        </View>

        {/* Usage Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Usage</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>
              {`import DailyLogo from '@/components/ui/DailyLogo';

// Basic usage
<DailyLogo />

// With props
<DailyLogo 
  width={150} 
  height={50} 
  variant="default" 
/>

// Icon version
<DailyLogoIcon size={60} />

// Compact version
<DailyLogoCompact height={30} />`}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: 16,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.gray[50],
    borderRadius: 12,
  },
  darkBg: {
    backgroundColor: '#1f2937',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
  },
  iconBg: {
    padding: 10,
    borderRadius: 12,
  },
  caption: {
    marginTop: 8,
    fontSize: 12,
    color: colors.gray[600],
  },
  codeBlock: {
    backgroundColor: colors.gray[900],
    borderRadius: 8,
    padding: 16,
  },
  codeText: {
    fontFamily: 'Courier',
    fontSize: 12,
    color: '#10b981',
    lineHeight: 18,
  },
});
