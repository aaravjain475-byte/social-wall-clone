import { useEffect, useRef } from 'react';

export const useAutoScroll = (enabled = true, speed = 1) => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const scrollPositionRef = useRef(0);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    let scrollSpeed = speed;

    const animate = (currentTime) => {
      if (!container) return;

      // Calculate delta time for smooth scrolling
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      // Smooth scrolling based on delta time
      scrollPositionRef.current += scrollSpeed * (deltaTime / 16); // Normalize to 60fps

      // Reset to top when reaching bottom
      if (scrollPositionRef.current >= container.scrollHeight - container.clientHeight) {
        scrollPositionRef.current = 0;
      }

      container.scrollTop = scrollPositionRef.current;
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    lastTimeRef.current = performance.now();
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
      lastTimeRef.current = performance.now();
      const animate = (currentTime) => {
        if (!containerRef.current) return;

        const deltaTime = currentTime - lastTimeRef.current;
        lastTimeRef.current = currentTime;

        scrollPositionRef.current += speed * (deltaTime / 16);

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
