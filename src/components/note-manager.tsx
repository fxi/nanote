import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { Note } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { downloadNote } from '@/lib/storage';
import { Trash2, Download } from 'lucide-react';

interface NoteManagerProps {
  notes: Note[];
  onOpenNote: (id: string) => void;
  onDeleteNotes: (ids: string[]) => void;
  trigger: React.ReactNode;
}

export function NoteManager({ notes, onOpenNote, onDeleteNotes, trigger }: NoteManagerProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [confirm, setConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fuse = useMemo(() => new Fuse(notes, {
    keys: ['title', 'content'],
    threshold: 0.3,
  }), [notes]);

  const filteredNotes = searchQuery
    ? fuse.search(searchQuery).map(result => result.item)
    : notes;

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleBatchDelete = () => {
    onDeleteNotes(selected);
    setSelected([]);
    setConfirm(false);
  };

  const handleBatchExport = () => {
    selected.forEach(id => {
      const note = notes.find(n => n.id === id);
      if (note) downloadNote(note);
    });
    setSelected([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Notes</DialogTitle>
        </DialogHeader>
        <div className="p-2">
          <Input
            placeholder="Filter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <ScrollArea className="h-[45vh]">
          <div className="space-y-2 p-2">
            {filteredNotes.map(note => (
              <div key={note.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                <Checkbox checked={selected.includes(note.id)} onCheckedChange={() => toggle(note.id)} />
                <div className="flex-1 truncate cursor-pointer" onClick={() => onOpenNote(note.id)}>
                  {note.title || 'Untitled'} - <span className="text-sm text-muted-foreground">{note.content.slice(0, 20)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" onClick={() => downloadNote(note)} title="Download">
                    <Download className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="ghost" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete note?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDeleteNotes([note.id])}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        {selected.length > 0 && (
          <div className="flex justify-between mt-4">
            <Button variant="destructive" onClick={() => setConfirm(true)}>
              Delete Selected
            </Button>
            <Button onClick={handleBatchExport}>Export Selected</Button>
          </div>
        )}
        <AlertDialog open={confirm} onOpenChange={setConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {selected.length} notes?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleBatchDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}
