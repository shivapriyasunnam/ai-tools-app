import { useUser } from '@/src/context/UserContext';
import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/context/ThemeContext';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const BANNER_AD_UNIT_ID = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : 'ca-app-pub-7933176628735047/5587939995';

export default function ProfileScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { userName, saveUserName } = useUser();
  const { session, signOut } = useAuth();
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setName(userName);
  }, [userName]);

  const handleSaveName = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    setIsSaving(true);
    const success = await saveUserName(name.trim());
    setIsSaving(false);
    if (success) {
      Alert.alert('Success', 'Your name has been saved!', [
        { text: 'OK', onPress: () => router.push('/(tabs)/') },
      ]);
    } else {
      Alert.alert('Error', 'Failed to save your name. Please try again.');
    }
  };

  const handleSignOut = async () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch (e) {
            Alert.alert('Error', e.message);
          }
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.accountCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.accountEmail, { color: theme.colors.text }]}>{session?.user?.email}</Text>
          <Text style={[styles.accountLabel, { color: theme.colors.textSecondary }]}>Signed in with Google</Text>
        </View>

        <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Display Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.gray[100], color: theme.colors.text, borderColor: theme.colors.border }]}
            placeholder="Enter your name"
            placeholderTextColor={theme.colors.textSecondary}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveName}
            disabled={isSaving}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Saving...' : 'Save Name'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      <BannerAd
        unitId={BANNER_AD_UNIT_ID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 24,
    paddingTop: 60,
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  accountEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  accountLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  signOutButton: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  signOutButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
});
