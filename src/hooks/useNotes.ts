import { useState, useEffect } from 'react';
import { Note } from '@/types';
import { loadNotes, saveNotes, createNote, updateNote, deleteNotes } from '@/lib/storage';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const activeNote = activeNoteId
    ? notes.find(note => note.id === activeNoteId) || null
    : notes[0] || null;

  useEffect(() => {
    const loadedNotes = loadNotes();
    setNotes(loadedNotes);

    if (loadedNotes.length > 0) {
      if (!activeNoteId) {
        setActiveNoteId(loadedNotes[0].id);
      }
    } else {
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


  const handleDeleteNotes = (ids: string[]) => {
    setNotes(currentNotes => {
      const updated = deleteNotes(currentNotes, ids);
      if (ids.includes(activeNoteId || '')) {
        setActiveNoteId(updated[0] ? updated[0].id : null);
      }
      return updated.length > 0 ? updated : createNote([], 'Untitled Note');
    });
  };

  return {
    notes,
    activeNote,
    activeNoteId,
    setActiveNoteId,
    createNote: handleCreateNote,
    updateNote: handleUpdateNote,
    deleteNotes: handleDeleteNotes,
    isLoading,
  };
}
