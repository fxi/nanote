import React, { useState, useEffect, useRef } from 'react';
import { 
  Command,
  CommandInput, 
  CommandList, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem,
} from '@/components/ui/command';
import { CommandAction } from '@/types';

interface CommandBarProps {
  commands: CommandAction[];
  isOpen: boolean;
  onClose: () => void;
}

export function CommandBar({ commands, isOpen, onClose }: CommandBarProps) {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = (command: CommandAction) => {
    command.action();
    onClose();
    setSearch('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-background/80 backdrop-blur-sm">
      <Command className="w-full max-w-md rounded-lg border shadow-md">
        <CommandInput
          ref={inputRef}
          placeholder="Type a command or search..."
          value={search}
          onValueChange={setSearch}
          className="font-mono"
        />
        <CommandList>
          <CommandEmpty>No commands found.</CommandEmpty>
          <CommandGroup heading="Actions">
            {commands.map((command) => (
              <CommandItem
                key={command.id}
                onSelect={() => handleSelect(command)}
                className="flex items-center justify-between"
              >
                <span>{command.name}</span>
                <span className="text-xs text-muted-foreground font-mono">
                  {command.shortcut}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}