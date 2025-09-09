import { useEffect, useCallback } from 'react';
import { KEYBOARD_SHORTCUTS } from '../constants/pokemon';

interface UseKeyboardShortcutsProps {
  searchTerm: string;
  onClearSearch: () => void;
}

/**
 * Custom hook for keyboard shortcuts
 */
export const useKeyboardShortcuts = ({ searchTerm, onClearSearch }: UseKeyboardShortcutsProps) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Focus search on '/' key
    if (e.key === KEYBOARD_SHORTCUTS.FOCUS_SEARCH && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
      searchInput?.focus();
    }
    
    // Clear search on Escape key
    if (e.key === KEYBOARD_SHORTCUTS.CLEAR_SEARCH && searchTerm) {
      onClearSearch();
      const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
      searchInput?.blur();
    }
  }, [searchTerm, onClearSearch]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};
