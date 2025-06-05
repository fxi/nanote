import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Note } from '@/types';

interface EditorProps {
  note: Note | null;
  onContentChange: (content: string) => void;
}

export function Editor({ note, onContentChange }: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    if (note) {
      setContent(note.content);
    } else {
      setContent('');
    }
  }, [note]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [note]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onContentChange(newContent);
  };

  return (
    <div className="relative h-full flex flex-col">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        className={cn(
          "flex-1 p-4 resize-none outline-none",
          "bg-background text-foreground",
          "font-mono text-base leading-relaxed",
          "border-none focus:ring-0 focus:outline-none"
        )}
        placeholder="Start typing..."
      />
    </div>
  );
}