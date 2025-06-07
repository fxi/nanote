import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { Note } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import {
  Plus,
  Archive,
  ArchiveRestore,
  Download,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { downloadNote } from '@/lib/storage';

interface NoteListProps {
  notes: Note[];
  activeNoteId: string | null;
  onNoteSelect: (id: string) => void;
  onCreateNote: () => void;
  onArchiveNote: (id: string) => void;
  onUnarchiveNote: (id: string) => void;
}

export function NoteList({
  notes,
  activeNoteId,
  onNoteSelect,
  onCreateNote,
  onArchiveNote,
  onUnarchiveNote
}: NoteListProps) {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [notesOpen, setNotesOpen] = useState(true);
  const [archivedOpen, setArchivedOpen] = useState(false);
  const lastSelected = useRef<string | null>(null);

  const activeNotes = notes.filter(n => !n.archived);
  const archivedNotes = notes.filter(n => n.archived);

  useEffect(() => {
    if (editingNoteId && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [editingNoteId]);

  const handleNoteSelect = (id: string, archived = false) => (
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    if (!archived) {
      onNoteSelect(id);
    }
  };

  const handleCheckbox = (id: string, list: Note[], e: React.MouseEvent) => {
    e.stopPropagation();
    const { shiftKey, metaKey, ctrlKey } = e;
    const multiKey = metaKey || ctrlKey;
    if (shiftKey && lastSelected.current) {
      const ids = list.map(n => n.id);
      const start = ids.indexOf(lastSelected.current);
      const end = ids.indexOf(id);
      if (start !== -1 && end !== -1) {
        const [from, to] = start < end ? [start, end] : [end, start];
        const range = ids.slice(from, to + 1);
        setSelected(prev => Array.from(new Set([...prev, ...range])));
        return;
      }
    }
    if (multiKey) {
      setSelected(prev =>
        prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
      );
      lastSelected.current = id;
    } else {
      setSelected(prev => (prev.length === 1 && prev[0] === id ? [] : [id]));
      lastSelected.current = id;
    }
  };


  const archiveSelected = () => {
    selected.forEach(id => onArchiveNote(id));
    setSelected([]);
  };

  const restoreSelected = () => {
    selected.forEach(id => onUnarchiveNote(id));
    setSelected([]);
  };

  const downloadSelected = () => {
    selected
      .map(id => notes.find(n => n.id === id))
      .filter((n): n is Note => !!n)
      .forEach(downloadNote);
    setSelected([]);
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

  const selectedActive = selected.filter(id =>
    activeNotes.some(n => n.id === id)
  );
  const selectedArchived = selected.filter(id =>
    archivedNotes.some(n => n.id === id)
  );

  return (
    <div className="h-full flex flex-col border-r">
      <div className="p-4 border-b flex justify-between items-center gap-2">
        <h2 className="font-semibold text-sm">nanote</h2>
        <div className="flex items-center gap-2">
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
      </div>

      <div className="flex-1 overflow-hidden">
        <Collapsible open={notesOpen} onOpenChange={setNotesOpen} className="flex flex-col">
          <div className="flex items-center justify-between px-2 py-2 border-b">
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-1 font-semibold text-sm">
                {notesOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                Notes [{activeNotes.length}]
              </button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="flex-1 flex flex-col">
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
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={selected.includes(note.id)}
                                onClick={(e) => handleCheckbox(note.id, activeNotes, e)}
                              />
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
            {selectedActive.length > 0 && (
              <div className="p-2 border-t flex gap-2">
                <Button size="sm" onClick={archiveSelected}>
                  <Archive className="h-4 w-4 mr-1" /> Archive
                </Button>
                <Button size="sm" onClick={downloadSelected}>
                  <Download className="h-4 w-4 mr-1" /> Download
                </Button>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={archivedOpen} onOpenChange={setArchivedOpen} className="flex flex-col">
          <div className="flex items-center justify-between px-2 py-2 border-b">
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-1 font-semibold text-sm">
                {archivedOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                Archived [{archivedNotes.length}]
              </button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1">
              <div className="px-2 py-2">
                {archivedNotes.length === 0 ? (
                  <p className="text-center text-muted-foreground text-sm p-4">No archived notes.</p>
                ) : (
                  <ul className="space-y-1">
                    {archivedNotes.map(note => (
                      <li key={note.id} className="group">
                        <button
                          onClick={handleNoteSelect(note.id, true)}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-md text-sm flex flex-col",
                            "transition-colors duration-200 ease-in-out",
                            "hover:bg-accent hover:text-accent-foreground",
                            activeNoteId === note.id
                              ? "bg-accent text-accent-foreground"
                              : "text-foreground"
                          )}
                        >
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={selected.includes(note.id)}
                                onClick={(e) => handleCheckbox(note.id, archivedNotes, e)}
                              />
                              <div className="font-medium truncate">
                                {note.title || 'Untitled'}
                              </div>
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
            {selectedArchived.length > 0 && (
              <div className="p-2 border-t flex gap-2">
                <Button size="sm" onClick={restoreSelected}>
                  <ArchiveRestore className="h-4 w-4 mr-1" /> Restore
                </Button>
                <Button size="sm" onClick={downloadSelected}>
                  <Download className="h-4 w-4 mr-1" /> Download
                </Button>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
