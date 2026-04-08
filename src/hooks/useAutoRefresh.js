import { useEffect, useRef } from 'react';

export const useAutoRefresh = (callback, interval) => {
  const intervalRef = useRef(null);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (interval <= 0) return;

    intervalRef.current = setInterval(() => {
      callbackRef.current();
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [interval]);

  // Cleanup function
  const clearAutoRefresh = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  return { clearAutoRefresh };
};
