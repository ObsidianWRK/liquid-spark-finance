import { useState, useEffect } from 'react';

interface PerformanceSettings {
  shouldReduceMotion: boolean;
  isLowPerformanceDevice: boolean;
  liquidSettings: {
    intensity: number;
    animated: boolean;
    interactive: boolean;
  };
}

/**
 * Hook for performance optimization and adaptive rendering
 * Detects user preferences and device capabilities to optimize the experience
 */
export const usePerformanceOptimization = (): PerformanceSettings => {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [isLowPerformanceDevice, setIsLowPerformanceDevice] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setShouldReduceMotion(prefersReducedMotion);

    // Simple performance detection
    const startTime = performance.now();
    requestAnimationFrame(() => {
      const endTime = performance.now();
      const frameTime = endTime - startTime;
      const isLowPerf = frameTime > 16.67; // More than 1 frame at 60fps
      setIsLowPerformanceDevice(isLowPerf);
    });

    // Listen for changes in motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setShouldReduceMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Calculate liquid effect settings based on performance
  const liquidSettings = {
    intensity: isLowPerformanceDevice ? 0.1 : 0.3,
    animated: !shouldReduceMotion && !isLowPerformanceDevice,
    interactive: !isLowPerformanceDevice
  };

  return {
    shouldReduceMotion,
    isLowPerformanceDevice,
    liquidSettings
  };
};

/**
 * Hook for responsive breakpoint detection
 */
export const useResponsiveBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop' | 'large'>('mobile');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= 1440) setBreakpoint('large');
      else if (width >= 1024) setBreakpoint('desktop');
      else if (width >= 768) setBreakpoint('tablet');
      else setBreakpoint('mobile');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
};

/**
 * Hook for calculating responsive animation delays
 */
export const useAnimationDelay = () => {
  const breakpoint = useResponsiveBreakpoint();

  const getAnimationDelay = (index: number): number => {
    switch (breakpoint) {
      case 'large':
      case 'desktop': return index * 150; // Faster for desktop
      case 'tablet': return index * 200;
      default: return index * 100; // Fastest for mobile
    }
  };

  return { getAnimationDelay, breakpoint };
};

/**
 * Hook for layout debugging in development
 */
export const useLayoutDebug = (componentName: string) => {
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log(`${componentName} mounted:`, {
        viewport: { width: window.innerWidth, height: window.innerHeight },
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
    }
  }, [componentName]);
};

/**
 * Hook for performance tracking
 */
export const usePerformanceTracking = (componentName: string) => {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      if (renderTime > 16.67) { // Longer than 1 frame at 60fps
        console.warn(`${componentName} render took ${renderTime}ms`);
      }
    };
  }, [componentName]);
}; 