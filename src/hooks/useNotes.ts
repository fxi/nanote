import { useState, useEffect } from 'react';
import { Note } from '@/types';
import { loadNotes, saveNotes, createNote, updateNote, deleteNote } from '@/lib/storage';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const activeNote = activeNoteId 
    ? notes.find(note => note.id === activeNoteId) 
    : notes.length > 0 ? notes[0] : null;

  useEffect(() => {
    const loadedNotes = loadNotes();
    setNotes(loadedNotes);
    
    if (loadedNotes.length > 0 && !activeNoteId) {
      setActiveNoteId(loadedNotes[0].id);
    } else if (loadedNotes.length === 0) {
      const initialNotes = createNote([], 'Welcome to nanote');
      setNotes(initialNotes);
      setActiveNoteId(initialNotes[0].id);
      saveNotes(initialNotes);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveNotes(notes);
    }
  }, [notes, isLoading]);

  const handleCreateNote = (title?: string) => {
    const updatedNotes = createNote(notes, title);
    setNotes(updatedNotes);
    setActiveNoteId(updatedNotes[0].id);
    return updatedNotes[0];
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setNotes((currentNotes) => updateNote(currentNotes, id, updates));
  };

  const handleDeleteNote = (id: string) => {
    setNotes((currentNotes) => deleteNote(currentNotes, id));
    
    if (activeNoteId === id && notes.length > 1) {
      const nextNoteId = notes.find(note => note.id !== id)?.id;
      setActiveNoteId(nextNoteId || null);
    } else if (notes.length <= 1) {
      const newNotes = createNote([], 'Untitled Note');
      setNotes(newNotes);
      setActiveNoteId(newNotes[0].id);
    }
  };

  return {
    notes,
    activeNote,
    activeNoteId,
    setActiveNoteId,
    createNote: handleCreateNote,
    updateNote: handleUpdateNote,
    deleteNote: handleDeleteNote,
    isLoading,
  };
}