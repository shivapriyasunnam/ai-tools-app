

import { useQuickNotes } from '@/src/context/QuickNotesContext';
import { useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


export default function QuickNotesScreen() {
  const { notes, addNote, editNote, deleteNote } = useQuickNotes();
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const handleAddNote = () => {
    if (!input.trim()) return;
    addNote(input);
    setInput('');
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const handleSaveEdit = () => {
    if (editingId && editingText.trim()) {
      editNote(editingId, editingText.trim());
    }
    setEditingId(null);
    setEditingText('');
  };

  const handleDeleteNote = (id) => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteNote(id) },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.noteItem}>
      {editingId === item.id ? (
        <>
          <TextInput
            style={styles.noteInput}
            value={editingText}
            onChangeText={setEditingText}
            autoFocus
            onSubmitEditing={handleSaveEdit}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveEdit}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.noteText}>{item.text}</Text>
          <View style={styles.noteActions}>
            <TouchableOpacity onPress={() => startEdit(item.id, item.text)}>
              <Text style={styles.editBtn}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteNote(item.id)}>
              <Text style={styles.deleteBtn}>Delete</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type a note..."
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleAddNote}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addBtn} onPress={handleAddNote}>
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
        {notes.length === 0 ? (
          <Text style={styles.placeholder}>No notes yet. Add your first note!</Text>
        ) : (
          <FlatList
            data={notes}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  addBtn: {
    marginLeft: 8,
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  placeholder: {
    fontSize: 16,
    color: '#888',
    alignSelf: 'center',
    marginTop: 32,
  },
  noteItem: {
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  noteText: {
    fontSize: 16,
    color: '#222',
  },
  noteActions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  editBtn: {
    color: '#6C63FF',
    fontWeight: 'bold',
    marginRight: 16,
    fontSize: 15,
  },
  deleteBtn: {
    color: '#E53935',
    fontWeight: 'bold',
    fontSize: 15,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  saveBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
