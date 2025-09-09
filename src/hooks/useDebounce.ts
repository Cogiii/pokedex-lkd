import { useState, useEffect } from 'react';
import { API_CONFIG } from '../constants/pokemon';

/**
 * Custom hook for debouncing search input
 */
export const useDebounce = <T>(value: T, delay: number = API_CONFIG.SEARCH_DEBOUNCE_MS): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
