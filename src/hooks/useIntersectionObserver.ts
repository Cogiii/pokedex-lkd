import { useEffect, useRef } from 'react';
import { API_CONFIG } from '../constants/pokemon';

interface UseIntersectionObserverProps {
  onIntersect: () => void;
  loading: boolean;
  hasMore: boolean;
  searchTerm: string;
  filteredCount: number;
  totalLoaded: number;
}

/**
 * Custom hook for intersection observer with smart loading logic
 */
export const useIntersectionObserver = ({
  onIntersect,
  loading,
  hasMore,
  searchTerm,
  filteredCount,
  totalLoaded,
}: UseIntersectionObserverProps) => {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          // During search: load more data if current results are limited and might have more matches
          // During normal browsing: standard infinite scroll
          if (searchTerm) {
            // If searching and we have fewer results than loaded data, or if we haven't loaded much data yet
            const shouldLoadMoreDuringSearch = 
              filteredCount < API_CONFIG.MAX_SEARCH_RESULTS || 
              totalLoaded < API_CONFIG.MAX_LOADED_DURING_SEARCH;
              
            if (shouldLoadMoreDuringSearch) {
              onIntersect();
            }
          } else {
            // Normal infinite scroll when not searching
            onIntersect();
          }
        }
      },
      {
        root: null,
        threshold: 1,
        rootMargin: "0px 0px 200px 0px",
      }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      observer.disconnect();
    };
  }, [onIntersect, loading, hasMore, searchTerm, filteredCount, totalLoaded]);

  return loaderRef;
};
