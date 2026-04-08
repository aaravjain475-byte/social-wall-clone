import { useEffect, useRef, useCallback } from 'react';

export const useInfiniteScroll = (loadMore, loading) => {
  const lastElementRef = useRef(null);
  const observerRef = useRef(null);

  const handleObserver = useCallback((entries) => {
    const [target] = entries;
    if (target.isIntersecting && !loading) {
      loadMore();
    }
  }, [loadMore, loading]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    };

    observerRef.current = new IntersectionObserver(handleObserver, options);

    if (lastElementRef.current) {
      observerRef.current.observe(lastElementRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  return { lastElementRef };
};
