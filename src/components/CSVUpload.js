import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../constants';
import { useTheme } from '../context/ThemeContext';

export const CSVUpload = ({ onExpensesLoaded, onCancel, loading }) => {
  const { theme } = useTheme();
  const [csvText, setCSVText] = useState('');
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState(null);

  const previewCSV = (text) => {
    const lines = text.trim().split('\n').filter(l => l.trim());
    const previewLines = lines.slice(0, 4);
    setPreview(previewLines);
  };

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'text/plain', 'application/vnd.ms-excel'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      setFileName(file.name);

      // Read file content
      const fileContent = await fetch(file.uri);
      const text = await fileContent.text();
      
      if (!text.trim()) {
        Alert.alert('Error', 'CSV file is empty');
        return;
      }

      setCSVText(text);
      previewCSV(text);
    } catch (error) {
      console.error('File picker error:', error);
      Alert.alert('Error', 'Failed to read file: ' + error.message);
    }
  };

  const handleImport = () => {
    if (!csvText.trim()) {
      Alert.alert('Error', 'Please provide CSV data');
      return;
    }
    onExpensesLoaded(csvText);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>📤 Upload Bank Statement (CSV)</Text>

      {/* Info */}
      <View style={[styles.infoBox, { backgroundColor: colors.secondary + '20' }]}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.secondary, marginBottom: spacing.sm }}>
          📝 Expected CSV Format
        </Text>
        <Text style={{ fontSize: 11, color: theme.colors.text, marginBottom: spacing.xs }}>
          Your CSV must have these columns:
        </Text>
        <Text style={{ fontSize: 11, color: theme.colors.textSecondary, fontFamily: 'monospace', marginBottom: spacing.xs }}>
          Date, Description, Amount
        </Text>
        <Text style={{ fontSize: 10, color: theme.colors.textSecondary, fontStyle: 'italic' }}>
          Example: 2025-01-15, Coffee Shop, 5.50
        </Text>
      </View>

      {/* File Upload Section */}
      <TouchableOpacity
        onPress={handlePickFile}
        style={[styles.uploadButton, { backgroundColor: theme.colors.primary }]}
      >
        <Text style={styles.uploadButtonText}>📁 Upload Bank Statement</Text>
      </TouchableOpacity>

      {fileName && (
        <View style={[styles.fileNameBox, { backgroundColor: colors.accent + '20' }]}>
          <Text style={{ fontSize: 12, color: theme.colors.text }}>
            ✓ <Text style={{ fontWeight: 'bold' }}>{fileName}</Text>
          </Text>
        </View>
      )}

      {/* Preview Button */}
      {csvText && (
        <TouchableOpacity
          onPress={() => previewCSV(csvText)}
          style={[styles.button, { backgroundColor: theme.colors.primary, marginTop: spacing.lg }]}
        >
          <Text style={styles.buttonText}>👁️ Preview</Text>
        </TouchableOpacity>
      )}

      {/* Preview */}
      {preview && (
        <View style={[styles.previewBox, { backgroundColor: theme.colors.surface, marginTop: spacing.lg }]}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', color: theme.colors.text, marginBottom: spacing.sm }}>
            📋 Preview ({preview.length} rows)
          </Text>
          {preview.map((line, idx) => (
            <Text
              key={idx}
              style={{
                fontSize: 10,
                color: theme.colors.text,
                fontFamily: 'monospace',
                marginBottom: spacing.xs,
              }}
            >
              {line}
            </Text>
          ))}
        </View>
      )}

      {/* Action Buttons */}
      <View style={[styles.buttonRow, { marginTop: spacing.lg }]}>
        <TouchableOpacity
          onPress={onCancel}
          disabled={loading}
          style={[styles.iconButton, { backgroundColor: theme.colors.border }]}
        >
          <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleImport}
          disabled={loading}
          style={[styles.iconButton, { backgroundColor: colors.accent, opacity: loading ? 0.6 : 1, marginLeft: spacing.md }]}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Ionicons name="checkmark" size={20} color={colors.white} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  infoBox: {
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  uploadSection: {
    marginBottom: spacing.md,
  },
  uploadButton: {
    padding: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonText: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fileNameBox: {
    padding: spacing.md,
    borderRadius: 8,
    marginTop: spacing.sm,
  },
  divider: {
    height: 1,
    marginVertical: spacing.md,
  },
  orText: {
    textAlign: 'center',
    color: colors.gray[500],
    fontSize: 12,
    marginVertical: spacing.sm,
    fontWeight: '500',
  },
  label: {
    fontSize: 12,
    color: colors.gray[600],
    marginBottom: spacing.sm,
    fontWeight: '500',
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    padding: spacing.md,
    borderRadius: 8,
    color: colors.text,
    fontFamily: 'monospace',
    marginBottom: spacing.md,
    minHeight: 120,
    backgroundColor: colors.white,
  },
  previewBox: {
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  button: {
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
