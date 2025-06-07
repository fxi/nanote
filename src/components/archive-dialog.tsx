import { useState } from 'react';
import { Note } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

interface ArchiveDialogProps {
  notes: Note[];
  onDelete: (ids: string[]) => void;
}

export function ArchiveDialog({ notes, onDelete }: ArchiveDialogProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const toggleSelect = (id: string) => {
    setSelected((curr) =>
      curr.includes(id) ? curr.filter((s) => s !== id) : [...curr, id]
    );
  };

  const handleDelete = () => {
    onDelete(selected);
    setSelected([]);
    setConfirmOpen(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">Archive</Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col h-96">
        <DialogHeader>
          <DialogTitle>Archived Notes</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1">
          <ul className="space-y-2 px-2 py-2">
            {notes.map((note) => (
              <li key={note.id} className="flex items-center gap-2">
                <Checkbox
                  checked={selected.includes(note.id)}
                  onCheckedChange={() => toggleSelect(note.id)}
                />
                <span className="truncate flex-1 text-sm">{note.title}</span>
              </li>
            ))}
          </ul>
        </ScrollArea>
        <div className="pt-2">
          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogTrigger asChild>
              <Button disabled={selected.length === 0} className="w-full">
                Delete Selected
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {`Are you sure you want to delete ${selected.length} notes ?`}
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button variant="outline">Cancel</Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button onClick={handleDelete}>Delete</Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
}
