import { useState } from 'react';
import { Note } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { downloadNote } from '@/lib/storage';
import { Trash2, ExternalLink } from 'lucide-react';

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8" />
              <TableHead>Title</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notes.map(note => (
              <TableRow key={note.id}>
                <TableCell className="w-8">
                  <Checkbox checked={selected.includes(note.id)} onCheckedChange={() => toggle(note.id)} />
                </TableCell>
                <TableCell className="truncate">
                  {note.title || 'Untitled'} - {note.content.slice(0, 20)}
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button size="icon" variant="ghost" onClick={() => onOpenNote(note.id)} title="Open">
                    <ExternalLink className="w-4 h-4" />
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
