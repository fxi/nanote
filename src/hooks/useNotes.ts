import { useState, useEffect } from 'react';
import { Note } from '@/types';
import { loadNotes, saveNotes, createNote, updateNote, deleteNotes, archiveNote } from '@/lib/storage';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const activeNote = activeNoteId
    ? notes.find(note => note.id === activeNoteId && !note.archived) || null
    : notes.find(note => !note.archived) || null;

  useEffect(() => {
    const loadedNotes = loadNotes();
    setNotes(loadedNotes);

    const firstActive = loadedNotes.find(n => !n.archived);
    if (firstActive && !activeNoteId) {
      setActiveNoteId(firstActive.id);
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

  const handleArchiveNote = (id: string) => {
    setNotes((currentNotes) => {
      const updated = archiveNote(currentNotes, id);
      if (activeNoteId === id) {
        const next = updated.find(n => n.id !== id && !n.archived);
        if (next) {
          setActiveNoteId(next.id);
        } else {
          const newList = createNote(updated, 'Untitled Note');
          setActiveNoteId(newList[0].id);
          return newList;
        }
      }
      return updated;
    });
  };

  const handleDeleteNotes = (ids: string[]) => {
    setNotes((currentNotes) => {
      const updated = deleteNotes(currentNotes, ids);
      if (ids.includes(activeNoteId || '')) {
        const next = updated.find(n => !n.archived);
        setActiveNoteId(next ? next.id : null);
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
    archiveNote: handleArchiveNote,
    deleteNotes: handleDeleteNotes,
    isLoading,
  };
}