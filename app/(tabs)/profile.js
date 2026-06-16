import { useUser } from '@/src/context/UserContext';
import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/context/ThemeContext';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { Ionicons } from '@expo/vector-icons';

const BANNER_AD_UNIT_ID = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : 'ca-app-pub-7933176628735047/5587939995';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { userName, saveUserName } = useUser();
  const { session } = useAuth();
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);
  const isDirty = name.trim() !== (userName || '').trim();

  useEffect(() => {
    setName(userName);
  }, [userName]);

  const handleEditPress = () => {
    setIsEditing(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleSaveName = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    if (!isDirty) {
      Alert.alert('No changes', 'You have not changed your name.');
      return;
    }
    setIsSaving(true);
    const success = await saveUserName(name.trim());
    setIsSaving(false);
    if (success) {
      setIsEditing(false);
    } else {
      Alert.alert('Error', 'Failed to save your name. Please try again.');
    }
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
          <View style={styles.inputRow}>
            <TextInput
              ref={inputRef}
              style={[styles.input, { backgroundColor: theme.colors.gray[100], color: theme.colors.text, borderColor: theme.colors.border }]}
              placeholder="Enter your name"
              placeholderTextColor={theme.colors.textSecondary}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              editable={isEditing}
              onSubmitEditing={handleSaveName}
              returnKeyType="done"
            />
            {isSaving ? (
              <View style={[styles.iconButton, { backgroundColor: theme.colors.gray[100] }]}>
                <ActivityIndicator size="small" color={theme.colors.textSecondary} />
              </View>
            ) : isEditing ? (
              <TouchableOpacity
                style={[styles.iconButton, styles.saveIconButton]}
                onPress={handleSaveName}
                disabled={!name.trim()}
              >
                <Ionicons name="checkmark" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: theme.colors.gray[100] }]}
                onPress={handleEditPress}
              >
                <Ionicons name="pencil" size={18} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveIconButton: {
    backgroundColor: '#10B981',
  },
});
