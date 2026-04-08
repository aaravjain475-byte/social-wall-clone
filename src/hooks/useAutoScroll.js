import { useEffect, useRef } from 'react';

export const useAutoScroll = (enabled = true, speed = 1) => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    let scrollSpeed = speed;

    const animate = () => {
      if (!container) return;

      scrollPositionRef.current += scrollSpeed;

      // Reset to top when reaching bottom
      if (scrollPositionRef.current >= container.scrollHeight - container.clientHeight) {
        scrollPositionRef.current = 0;
      }

      container.scrollTop = scrollPositionRef.current;
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [enabled, speed]);

  const handleMouseEnter = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (enabled && containerRef.current) {
      const animate = () => {
        if (!containerRef.current) return;

        scrollPositionRef.current += scrollSpeed;

        if (scrollPositionRef.current >= containerRef.current.scrollHeight - containerRef.current.clientHeight) {
          scrollPositionRef.current = 0;
        }

        containerRef.current.scrollTop = scrollPositionRef.current;
        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    }
  };

  return {
    containerRef,
    handleMouseEnter,
    handleMouseLeave
  };
};
