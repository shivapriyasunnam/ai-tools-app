import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/src/constants';

// This is a placeholder screen that won't be directly navigated to
// The tab button triggers the bottom sheet instead
export default function MoreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tools</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: {
    fontSize: 18,
    color: colors.gray[600],
  },
});
