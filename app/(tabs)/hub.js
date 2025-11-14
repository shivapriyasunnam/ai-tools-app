import { StyleSheet, Text, View } from 'react-native';

export default function HubScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hub</Text>
      <Text style={styles.subtitle}>This is your Hub. More features coming soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#6366F1',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});
