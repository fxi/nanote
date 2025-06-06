import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Note } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Plus, Archive, Download } from 'lucide-react';
import { ArchiveDialog } from '@/components/archive-dialog';
import { downloadNote } from '@/lib/storage';

interface NoteListProps {
  notes: Note[];
  activeNoteId: string | null;
  onNoteSelect: (id: string) => void;
  onCreateNote: () => void;
  onArchiveNote: (id: string) => void;
  onDeleteArchived: (ids: string[]) => void;
}

export function NoteList({
  notes,
  activeNoteId,
  onNoteSelect,
  onCreateNote,
  onArchiveNote,
  onDeleteArchived
}: NoteListProps) {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);

  const activeNotes = notes.filter(n => !n.archived);
  const archivedNotes = notes.filter(n => n.archived);

  useEffect(() => {
    if (editingNoteId && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [editingNoteId]);

  const handleNoteSelect = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNoteSelect(id);
  };

  const handleDownload = (note: Note) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    downloadNote(note);
  };

  const handleArchive = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onArchiveNote(id);
  };

  const startEditing = (note: Note) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingNoteId(note.id);
    setEditingTitle(note.title);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(e.target.value);
  };

  const handleTitleKeyDown = (note: Note) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      finishEditing(note);
    } else if (e.key === 'Escape') {
      setEditingNoteId(null);
    }
  };

  const finishEditing = (note: Note) => {
    if (editingNoteId) {
      const newTitle = editingTitle.trim();
      if (newTitle && newTitle !== note.title) {
        note.title = newTitle;
        // Trigger a re-render by creating a new array
        const updatedNotes = [...notes];
        const index = updatedNotes.findIndex(n => n.id === note.id);
        if (index !== -1) {
          updatedNotes[index] = { ...note };
        }
      }
      setEditingNoteId(null);
    }
  };

  const handleTitleBlur = (note: Note) => () => {
    finishEditing(note);
  };

  return (
    <div className="h-full flex flex-col border-r">
      <div className="p-4 border-b flex justify-between items-center gap-2">
        <h2 className="font-semibold text-sm">Notes</h2>
        <ArchiveDialog notes={archivedNotes} onDelete={onDeleteArchived} />
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            onCreateNote();
          }}
          title="New Note"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="px-2 py-2">
          {activeNotes.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm p-4">
              No notes yet. Create one to get started.
            </p>
          ) : (
            <ul className="space-y-1">
              {activeNotes.map((note) => (
                <li key={note.id} className="group">
                  <button
                    onClick={handleNoteSelect(note.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md text-sm flex flex-col",
                      "transition-colors duration-200 ease-in-out",
                      "hover:bg-accent hover:text-accent-foreground",
                      activeNoteId === note.id
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground"
                    )}
                  >
                      {editingNoteId === note.id ? (
                        <input
                          ref={titleInputRef}
                          type="text"
                          value={editingTitle}
                          onChange={handleTitleChange}
                          onKeyDown={handleTitleKeyDown(note)}
                          onBlur={handleTitleBlur(note)}
                          className="w-full bg-transparent border-none p-0 focus:ring-0 font-medium"
                          onClick={e => e.stopPropagation()}
                        />
                      ) : (
                        <div 
                          className="font-medium truncate"
                          onDoubleClick={startEditing(note)}
                        >
                          {note.title || 'Untitled'}
                        </div>
                      )}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 mt-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={handleDownload(note)}
                          title="Download note"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={handleArchive(note.id)}
                          title="Archive note"
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground truncate mt-1">
                        {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                      </div>
                    </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}