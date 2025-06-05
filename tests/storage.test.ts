import { createNote, updateNote, deleteNote, saveNotes, loadNotes } from '../src/lib/storage';
import { Note } from '../src/types';

describe('storage utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('createNote adds a new note to the beginning', () => {
    const notes: Note[] = [];
    const result = createNote(notes, 'Test note');
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Test note');
  });

  test('updateNote updates matching note', () => {
    const notes: Note[] = createNote([], 'First');
    const id = notes[0].id;
    const updated = updateNote(notes, id, { title: 'Updated' });
    expect(updated[0].title).toBe('Updated');
  });

  test('deleteNote removes matching note', () => {
    let notes: Note[] = createNote([], 'First');
    const id = notes[0].id;
    notes = deleteNote(notes, id);
    expect(notes.length).toBe(0);
  });

  test('saveNotes and loadNotes round trip', () => {
    const notes: Note[] = createNote([], 'Round trip');
    saveNotes(notes);
    const loaded = loadNotes();
    expect(loaded.length).toBe(1);
    expect(loaded[0].title).toBe('Round trip');
  });
});
