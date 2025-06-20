import { useState, useEffect } from 'react';
import { getBreakpoint, type Breakpoint } from '@/theme/breakpoints';

/**
 * useBreakpoint Hook
 * Maps window.innerWidth to sm | md | lg | xl | 2xl breakpoint names
 * Provides real-time breakpoint detection for adaptive navigation
 */
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => {
    if (typeof window === 'undefined') return 'mobile';
    return getBreakpoint(window.innerWidth);
  });

  useEffect(() => {
    const handleResize = () => {
      const newBreakpoint = getBreakpoint(window.innerWidth);
      setBreakpoint(newBreakpoint);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Utility functions for convenience
  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';
  const isDesktop =
    breakpoint === 'desktop' ||
    breakpoint === 'large' ||
    breakpoint === 'ultrawide';
  const isLargeDesktop = breakpoint === 'large' || breakpoint === 'ultrawide';

  return {
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
  };
};
