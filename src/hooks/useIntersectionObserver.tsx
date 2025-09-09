import { useEffect, useRef, useCallback } from 'react';

interface UseIntersectionObserverProps {
  onIntersect: () => void;
  enabled?: boolean;
  rootMargin?: string;
  threshold?: number;
}

/**
 * Custom hook for IntersectionObserver
 */
export const useIntersectionObserver = ({
  onIntersect,
  enabled = true,
  rootMargin = '0px 0px 200px 0px',
  threshold = 1,
}: UseIntersectionObserverProps) => {
  const targetRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && enabled) {
      onIntersect();
    }
  }, [onIntersect, enabled]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      threshold,
      rootMargin,
    });

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [handleIntersect, threshold, rootMargin]);

  return targetRef;
};
