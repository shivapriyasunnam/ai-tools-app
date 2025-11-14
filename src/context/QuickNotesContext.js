
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const NOTES_KEY = 'quick_notes_data';

export const QuickNotesContext = createContext();

export const QuickNotesProvider = ({ children }) => {
	const [notes, setNotes] = useState([]);

	useEffect(() => {
		loadNotes();
	}, []);

	useEffect(() => {
		saveNotes();
	}, [notes]);

	const loadNotes = async () => {
		try {
			const data = await AsyncStorage.getItem(NOTES_KEY);
			if (data) setNotes(JSON.parse(data));
		} catch (e) {
			console.error('Failed to load notes', e);
		}
	};

	const saveNotes = async () => {
		try {
			await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
		} catch (e) {
			console.error('Failed to save notes', e);
		}
	};

	const addNote = (text) => {
		if (!text.trim()) return;
		setNotes([{ id: Date.now().toString(), text: text.trim() }, ...notes]);
	};

	const editNote = (id, newText) => {
		setNotes(notes.map(note => note.id === id ? { ...note, text: newText } : note));
	};

	const deleteNote = (id) => {
		setNotes(notes.filter(note => note.id !== id));
	};

	return (
		<QuickNotesContext.Provider value={{ notes, addNote, editNote, deleteNote }}>
			{children}
		</QuickNotesContext.Provider>
	);
};

export const useQuickNotes = () => useContext(QuickNotesContext);
