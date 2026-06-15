import { useQuickNotes } from '@/src/context/QuickNotesContext';
import { useTheme } from '@/src/context/ThemeContext';
import { answerFromNotes, initLLM } from '@/src/services/ai/ragAnswer';
import { embed } from '@/src/services/ai/embeddings';
import { queryNotes } from '@/src/services/ai/vectorStore';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const PRIMARY = '#6C63FF';

export default function QuickNotesScreen() {
  const { theme } = useTheme();
  const { notes, addNote, editNote, deleteNote } = useQuickNotes();
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Search / Ask state
  const [searchQuery, setSearchQuery] = useState('');
  const [mode, setMode] = useState('notes'); // 'notes' | 'search' | 'ai'
  const [searchResults, setSearchResults] = useState([]);
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiSources, setAiSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');

  // ── actions ────────────────────────────────────────────────────────────────

  const handleAddNote = () => {
    if (!input.trim()) return;
    addNote(input);
    setInput('');
  };

  const startEdit = (id, text) => { setEditingId(id); setEditingText(text); };

  const handleSaveEdit = () => {
    if (editingId && editingText.trim()) editNote(editingId, editingText.trim());
    setEditingId(null);
    setEditingText('');
  };

  const handleDeleteNote = (id) => {
    Alert.alert('Delete Note', 'Delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteNote(id) },
    ]);
  };

  const handleSemanticSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setLoadingMsg('Searching...');
    setMode('search');
    setAiAnswer('');
    setAiSources([]);
    try {
      const qVector = await embed(searchQuery);
      const hits = await queryNotes(qVector, 5);
      setSearchResults(hits.filter(h => h.score > 0.2));
    } catch (e) {
      Alert.alert('Search error', e.message);
    } finally {
      setLoading(false);
      setLoadingMsg('');
    }
  };

  const handleAskAI = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setLoadingMsg('Loading AI...');
    setMode('ai');
    setAiAnswer('');
    setAiSources([]);
    setSearchResults([]);
    try {
      await initLLM(p => setLoadingMsg(`Downloading AI: ${Math.round(p * 100)}%`));
      setLoadingMsg('Thinking...');
      let streaming = '';
      const result = await answerFromNotes(searchQuery, token => {
        streaming += token;
        setAiAnswer(streaming);
      });
      setAiAnswer(result.answer);
      setAiSources(result.sources ?? []);
    } catch (e) {
      Alert.alert('AI error', e.message);
    } finally {
      setLoading(false);
      setLoadingMsg('');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setMode('notes');
    setSearchResults([]);
    setAiAnswer('');
    setAiSources([]);
  };

  // ── render helpers ─────────────────────────────────────────────────────────

  const renderNote = ({ item }) => (
    <View style={[styles.noteItem, { backgroundColor: theme.colors.surface }, editingId === item.id && styles.noteItemEditing]}>
      {editingId === item.id ? (
        <>
          <TextInput
            style={[styles.noteInput, { backgroundColor: theme.colors.background, color: theme.colors.text, borderColor: theme.colors.border }]}
            value={editingText}
            onChangeText={setEditingText}
            autoFocus
            onSubmitEditing={handleSaveEdit}
            returnKeyType="done"
            multiline
          />
          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveEdit}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={[styles.noteText, { color: theme.colors.text }]}>{item.text}</Text>
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

  const renderSearchResult = (hit, i) => (
    <TouchableOpacity
      key={hit.id}
      style={styles.searchResult}
      onPress={() => {
        // find the note and start editing it
        const note = notes.find(n => n.id === hit.id);
        if (note) { clearSearch(); startEdit(note.id, note.text); }
      }}
    >
      <Text style={styles.searchResultText}>{hit.text}</Text>
      <Text style={styles.searchResultScore}>{(hit.score * 100).toFixed(0)}% match</Text>
    </TouchableOpacity>
  );

  // ── layout ─────────────────────────────────────────────────────────────────

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

        {/* Search / Ask bar */}
        <View style={[styles.searchBar, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search or ask your notes…"
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSemanticSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={18} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.searchActions}>
          <TouchableOpacity style={[styles.searchBtn, styles.askBtn]} onPress={handleAskAI} disabled={loading}>
            <Ionicons name="sparkles" size={15} color="#fff" />
            <Text style={styles.searchBtnText}>Ask AI</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={PRIMARY} />
            <Text style={styles.loadingText}>{loadingMsg}</Text>
          </View>
        )}

        {/* Search results */}
        {mode === 'search' && !loading && (
          <View style={styles.resultsSection}>
            <Text style={styles.sectionLabel}>RESULTS FOR "{searchQuery}"</Text>
            {searchResults.length === 0
              ? <Text style={styles.noResults}>No matching notes found.</Text>
              : searchResults.map(renderSearchResult)}
          </View>
        )}

        {/* AI answer */}
        {mode === 'ai' && (aiAnswer || loading) && (
          <View style={styles.aiSection}>
            {aiAnswer ? (
              <>
                <Text style={styles.aiAnswer} numberOfLines={4}>{aiAnswer}</Text>
                {aiSources.length > 0 && (
                  <View style={styles.sourcesRow}>
                    <Text style={styles.sourcesLabel}>SOURCES</Text>
                    <View style={styles.sourcesChips}>
                      {aiSources.slice(0, 4).map((s, i) => (
                        <TouchableOpacity
                          key={i}
                          style={styles.sourceChip}
                          onPress={() => {
                            const note = notes.find(n => n.id === s.id);
                            if (note) { clearSearch(); startEdit(note.id, note.text); }
                          }}
                        >
                          <Text style={styles.sourceChipText} numberOfLines={1}>{s.text}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </>
            ) : null}
          </View>
        )}

        {/* Add note input */}
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]}
            placeholder="Type a note..."
            placeholderTextColor={theme.colors.textSecondary}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleAddNote}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addBtn} onPress={handleAddNote}>
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Notes list */}
        {mode === 'notes' && (
          notes.length === 0
            ? <Text style={styles.placeholder}>No notes yet. Add your first note!</Text>
            : <FlatList
                data={notes}
                keyExtractor={item => item.id}
                renderItem={renderNote}
                contentContainerStyle={{ paddingBottom: 40 }}
              />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 15 },
  clearBtn: { padding: 4 },

  searchActions: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  searchBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#555',
    borderRadius: 8,
    paddingVertical: 8,
  },
  askBtn: { backgroundColor: PRIMARY },
  searchBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },

  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  loadingText: { fontSize: 13, color: '#666' },

  resultsSection: { marginBottom: 12 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#999', marginBottom: 6, letterSpacing: 0.5 },
  searchResult: {
    backgroundColor: '#f0eeff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: PRIMARY,
  },
  searchResultText: { fontSize: 15, color: '#222' },
  searchResultScore: { fontSize: 11, color: '#888', marginTop: 4 },
  noResults: { fontSize: 14, color: '#999', textAlign: 'center', marginTop: 8 },

  aiSection: { marginBottom: 12 },
  aiAnswer: { fontSize: 15, color: '#222', lineHeight: 22 },
  sourcesRow: { marginTop: 8 },
  sourcesLabel: { fontSize: 11, fontWeight: '700', color: '#999', marginBottom: 6, letterSpacing: 0.5 },
  sourcesChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  sourceChip: {
    backgroundColor: '#f0eeff',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    maxWidth: '48%',
  },
  sourceChipText: { fontSize: 12, color: PRIMARY, fontWeight: '500' },

  inputRow: { flexDirection: 'row', marginBottom: 12 },
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
    backgroundColor: PRIMARY,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  placeholder: { fontSize: 16, color: '#888', alignSelf: 'center', marginTop: 32 },

  noteItem: { backgroundColor: '#f4f4f4', borderRadius: 8, padding: 12, marginBottom: 12 },
  noteItemEditing: { backgroundColor: '#fff', borderWidth: 1, borderColor: PRIMARY },
  noteText: { fontSize: 16, color: '#222' },
  noteActions: { flexDirection: 'row', marginTop: 8 },
  editBtn: { color: PRIMARY, fontWeight: 'bold', marginRight: 16, fontSize: 15 },
  deleteBtn: { color: '#E53935', fontWeight: 'bold', fontSize: 15 },
  noteInput: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 8, fontSize: 16, backgroundColor: '#fff', marginBottom: 8,
  },
  saveBtn: {
    backgroundColor: PRIMARY, borderRadius: 8,
    paddingVertical: 6, paddingHorizontal: 16, alignSelf: 'flex-start',
  },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
