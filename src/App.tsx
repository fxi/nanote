import { useEffect, useCallback, useState } from 'react';
import { Editor } from '@/components/editor';
import { useNotes } from '@/hooks/useNotes';
import { NoteManager } from '@/components/note-manager';
import { Button } from '@/components/ui/button';
import { Download, Plus, List } from 'lucide-react';
import { downloadNote } from '@/lib/storage';

function App() {
  const {
    notes,
    activeNote,
    activeNoteId,
    setActiveNoteId,
    createNote,
    updateNote,
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

  const [title, setTitle] = useState('');

  useEffect(() => {
    setTitle(activeNote?.title || '');
  }, [activeNote]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (activeNoteId) {
      updateNote(activeNoteId, { title: e.target.value });
    }
  };

  const handleExport = () => {
    if (activeNote) {
      downloadNote(activeNote);
    }
  };

  const Controls = () => (
    <>
      <Button size="icon" onClick={() => createNote()} title="New note">
        <Plus className="w-4 h-4" />
      </Button>
      <Button size="icon" onClick={handleExport} title="Export">
        <Download className="w-4 h-4" />
      </Button>
      <NoteManager
        notes={notes}
        onOpenNote={setActiveNoteId}
        onDeleteNotes={deleteNotes}
        trigger={
          <Button size="icon" title="Manage notes">
            <List className="w-4 h-4" />
          </Button>
        }
      />
    </>
  );

  return (
    <div className="h-full flex flex-col">

      <header className="p-2 border-b flex items-center gap-2">
        <input
          className="flex-1 min-w-0 bg-transparent outline-none text-lg font-medium"
          value={title}
          onChange={handleTitleChange}
          placeholder="Untitled"
        />
        <div className="flex gap-2 flex-shrink-0">
          <Controls />
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <Editor note={activeNote} onContentChange={handleContentChange} />
      </main>
    </div>
  );
}

export default App;
