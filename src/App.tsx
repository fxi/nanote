import { useState, useEffect, useCallback } from 'react';
import { Editor } from '@/components/editor';
import { NoteList } from '@/components/note-list';
import { useNotes } from '@/hooks/useNotes';

function App() {
  const { 
    notes, 
    activeNote, 
    activeNoteId, 
    setActiveNoteId, 
    createNote,
    updateNote,
    archiveNote,
    deleteNotes
  } = useNotes();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('dark', e.matches);
    };
    
    document.documentElement.classList.toggle('dark', mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleContentChange = useCallback((content: string) => {
    if (activeNoteId) {
      updateNote(activeNoteId, { content });
    }
  }, [activeNoteId, updateNote]);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 h-full">
          <NoteList
            notes={notes}
            activeNoteId={activeNoteId}
            onNoteSelect={setActiveNoteId}
            onCreateNote={createNote}
            onArchiveNote={archiveNote}
            onDeleteArchived={deleteNotes}
          />
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto">
            <Editor 
              note={activeNote}
              onContentChange={handleContentChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;