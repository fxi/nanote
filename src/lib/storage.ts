import { Note } from '@/types';
import { format } from 'date-fns';

const STORAGE_KEY = 'nanote-data';

export const saveNotes = (notes: Note[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Failed to save notes to localStorage:', error);
  }
};

export const loadNotes = (): Note[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load notes from localStorage:', error);
    return [];
  }
};

export const createNote = (notes: Note[], title?: string): Note[] => {
  const defaultTitle = `untitled ${format(new Date(), 'yyyy_MM_dd_HH_mm_ss')}`;
  const newNote: Note = {
    id: crypto.randomUUID(),
    title: title || defaultTitle,
    content: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  return [newNote, ...notes];
};

export const updateNote = (notes: Note[], id: string, updates: Partial<Note>): Note[] => {
  return notes.map((note) => {
    if (note.id === id) {
      return {
        ...note,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    }
    return note;
  });
};

export const deleteNote = (notes: Note[], id: string): Note[] => {
  return notes.filter((note) => note.id !== id);
};

export const downloadNote = (note: Note) => {
  const blob = new Blob([note.content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${note.title || 'note'}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};