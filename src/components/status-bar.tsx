import React from 'react';
import { cn } from '@/lib/utils';
import { EditorMode } from '@/types';

interface StatusBarProps {
  mode: EditorMode;
  noteTitle: string;
  className?: string;
}

export function StatusBar({ mode, noteTitle, className }: StatusBarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-2 text-xs font-mono",
        "bg-secondary text-secondary-foreground border-t",
        className
      )}
    >
      <div className="flex items-center space-x-4">
        <div className={cn(
          "px-2 py-0.5 rounded",
          mode === 'normal' && "bg-blue-600 text-white",
          mode === 'insert' && "bg-green-600 text-white",
          mode === 'visual' && "bg-purple-600 text-white"
        )}>
          {mode.toUpperCase()}
        </div>
        <div className="text-muted-foreground">
          {noteTitle || 'Untitled'}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-muted-foreground">
          Press <kbd className="px-1 py-0.5 bg-muted rounded text-muted-foreground">?</kbd> for help
        </div>
      </div>
    </div>
  );
}
