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
import { colors, spacing } from '../constants';

export const CSVUpload = ({ onExpensesLoaded, onCancel, loading }) => {
  const [csvText, setCSVText] = useState('');
  const [preview, setPreview] = useState(null);

  const previewCSV = (text) => {
    const lines = text.trim().split('\n').filter(l => l.trim());
    const previewLines = lines.slice(0, 4);
    setPreview(previewLines);
  };

  const handlePasteCSV = () => {
    if (!csvText.trim()) {
      Alert.alert('Error', 'Please paste CSV data');
      return;
    }
    previewCSV(csvText);
  };

  const handleImport = () => {
    if (!csvText.trim()) {
      Alert.alert('Error', 'Please provide CSV data');
      return;
    }
    onExpensesLoaded(csvText);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📤 Upload Bank Statement (CSV)</Text>

      {/* Info */}
      <View style={[styles.infoBox, { backgroundColor: colors.secondary + '20' }]}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.secondary, marginBottom: spacing.sm }}>
          📝 Expected CSV Format
        </Text>
        <Text style={{ fontSize: 11, color: colors.gray[700], marginBottom: spacing.xs }}>
          Your CSV must have these columns:
        </Text>
        <Text style={{ fontSize: 11, color: colors.gray[600], fontFamily: 'monospace', marginBottom: spacing.xs }}>
          Date, Description, Amount
        </Text>
        <Text style={{ fontSize: 10, color: colors.gray[500], fontStyle: 'italic' }}>
          Example: 2025-01-15, Coffee Shop, 5.50
        </Text>
      </View>

      {/* CSV Input */}
      <Text style={styles.label}>Paste your CSV data:</Text>
      <TextInput
        multiline
        numberOfLines={6}
        placeholder="Date,Description,Amount&#10;2025-01-15,Coffee,5.50&#10;2025-01-15,Groceries,45.00"
        value={csvText}
        onChangeText={setCSVText}
        placeholderTextColor={colors.gray[400]}
        style={styles.textInput}
      />

      {/* Preview Button */}
      <TouchableOpacity
        onPress={handlePasteCSV}
        style={[styles.button, { backgroundColor: colors.primary }]}
      >
        <Text style={styles.buttonText}>👁️ Preview</Text>
      </TouchableOpacity>

      {/* Preview */}
      {preview && (
        <View style={[styles.previewBox, { backgroundColor: colors.gray[100] }]}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.text, marginBottom: spacing.sm }}>
            📋 Preview ({preview.length} rows)
          </Text>
          {preview.map((line, idx) => (
            <Text
              key={idx}
              style={{
                fontSize: 10,
                color: colors.text,
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
      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={handleImport}
          disabled={loading}
          style={[styles.button, { backgroundColor: colors.accent, flex: 1, opacity: loading ? 0.6 : 1 }]}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>✓ Import</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onCancel}
          disabled={loading}
          style={[styles.button, { backgroundColor: colors.gray[300], flex: 1, marginLeft: spacing.md }]}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.gray[50],
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  infoBox: {
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
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
    gap: spacing.md,
  },
  buttonText: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
