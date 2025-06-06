import { useCallback } from 'react';
import { CommandAction } from '@/types';

interface UseCommandsProps {
  createNote: () => void;
  archiveNote: () => void;
  saveNote: () => void;
  enterInsertMode: () => void;
  enterNormalMode: () => void;
  enterVisualMode: () => void;
  toggleTheme: () => void;
}

export function useCommands({
  createNote,
  archiveNote,
  saveNote,
  enterInsertMode,
  enterNormalMode,
  enterVisualMode,
  toggleTheme,
}: UseCommandsProps) {
  
  const commands: CommandAction[] = [
    {
      id: 'new-note',
      name: 'New Note',
      shortcut: 'n',
      description: 'Create a new note',
      action: createNote,
    },
    {
      id: 'archive-note',
      name: 'Archive Note',
      shortcut: 'dd',
      description: 'Archive the current note',
      action: archiveNote,
    },
    {
      id: 'save-note',
      name: 'Save Note',
      shortcut: ':w',
      description: 'Save the current note',
      action: saveNote,
    },
    {
      id: 'insert-mode',
      name: 'Insert Mode',
      shortcut: 'i',
      description: 'Enter insert mode',
      action: enterInsertMode,
    },
    {
      id: 'normal-mode',
      name: 'Normal Mode',
      shortcut: 'Esc',
      description: 'Enter normal mode',
      action: enterNormalMode,
    },
    {
      id: 'visual-mode',
      name: 'Visual Mode',
      shortcut: 'v',
      description: 'Enter visual mode',
      action: enterVisualMode,
    },
    {
      id: 'toggle-theme',
      name: 'Toggle Theme',
      shortcut: ':theme',
      description: 'Toggle between light and dark theme',
      action: toggleTheme,
    },
  ];

  const handleShortcut = useCallback(
    (key: string) => {
      const command = commands.find((cmd) => cmd.shortcut === key);
      if (command) {
        command.action();
        return true;
      }
      return false;
    },
    [commands]
  );

  return {
    commands,
    handleShortcut,
  };
}