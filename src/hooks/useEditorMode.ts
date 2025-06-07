import { useState, useEffect, useCallback } from 'react';
import { EditorMode } from '@/types';

export function useEditorMode() {
  const [mode, setMode] = useState<EditorMode>('normal');
  const [statusMessage, setStatusMessage] = useState<string>('-- NORMAL --');
  
  // Update status message when mode changes
  useEffect(() => {
    switch (mode) {
      case 'normal':
        setStatusMessage('-- NORMAL --');
        break;
      case 'insert':
        setStatusMessage('-- INSERT --');
        break;
      case 'visual':
        setStatusMessage('-- VISUAL --');
        break;
      default:
        setStatusMessage('-- NORMAL --');
    }
  }, [mode]);

  // Handle Escape key to return to normal mode from any other mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMode('normal');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Helper function to switch to insert mode
  const enterInsertMode = useCallback(() => {
    setMode('insert');
  }, []);

  // Helper function to switch to normal mode
  const enterNormalMode = useCallback(() => {
    setMode('normal');
  }, []);

  // Helper function to switch to visual mode
  const enterVisualMode = useCallback(() => {
    setMode('visual');
  }, []);

  return {
    mode,
    statusMessage,
    enterInsertMode,
    enterNormalMode,
    enterVisualMode,
  };
}
