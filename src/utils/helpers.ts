/**
 * Creates a debounced version of a function
 * @param func - The function to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Extracts the ID from a Pokemon API URL
 * @param url - The Pokemon API URL
 * @returns The Pokemon ID
 */
export const extractIdFromUrl = (url: string): number => {
  const segments = url.split('/');
  return parseInt(segments[segments.length - 2], 10);
};
