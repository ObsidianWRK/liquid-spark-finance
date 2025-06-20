/**
 * React Hook for Scroll Controller Integration
 * 
 * Provides a clean React API for the ScrollController with:
 * - Automatic lifecycle management
 * - State synchronization
 * - Performance optimizations
 * - TypeScript support
 */

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import {
  ScrollController,
  ScrollState,
  NavigationVisibilityState,
  ScrollControllerOptions,
  ScrollControllerCallbacks,
  createScrollController,
} from '../utils/scroll-controller';

// Re-export types for the hook
export interface UseScrollControllerOptions extends ScrollControllerOptions {
  enabled?: boolean;
}

export interface UseScrollControllerReturn {
  scrollState: ScrollState;
  visibilityState: NavigationVisibilityState;
  controller: ScrollController | null;
  setVisibility: (isVisible: boolean, force?: boolean) => void;
  updateOptions: (options: Partial<ScrollControllerOptions>) => void;
}

const DEFAULT_SCROLL_STATE: ScrollState = {
  scrollY: 0,
  previousScrollY: 0,
  velocity: 0,
  direction: 'none',
  isScrolling: false,
  timestamp: performance.now(),
};

const DEFAULT_VISIBILITY_STATE: NavigationVisibilityState = {
  isVisible: true,
  shouldAnimate: true,
  transform: 'translateY(0px)',
  safeAreaPadding: {
    top: 0,
    bottom: 0,
  },
};

export const useScrollController = (
  options: Partial<UseScrollControllerOptions> = {},
  callbacks: ScrollControllerCallbacks = {}
): UseScrollControllerReturn => {
  const { enabled = true, ...controllerOptions } = options;
  
  // State management
  const [scrollState, setScrollState] = useState<ScrollState>(DEFAULT_SCROLL_STATE);
  const [visibilityState, setVisibilityState] = useState<NavigationVisibilityState>(DEFAULT_VISIBILITY_STATE);
  
  // Refs for stable references
  const controllerRef = useRef<ScrollController | null>(null);
  const callbacksRef = useRef<ScrollControllerCallbacks>(callbacks);
  const optionsRef = useRef<ScrollControllerOptions>(controllerOptions);
  
  // Update refs when callbacks or options change
  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);
  
  useEffect(() => {
    optionsRef.current = controllerOptions;
  }, [controllerOptions]);
  
  // Enhanced callbacks that update React state
  const enhancedCallbacks = useMemo((): ScrollControllerCallbacks => ({
    onScrollStateChange: (state: ScrollState) => {
      setScrollState(state);
      callbacksRef.current.onScrollStateChange?.(state);
    },
    onVisibilityChange: (isVisible: boolean) => {
      setVisibilityState(prev => ({ ...prev, isVisible }));
      callbacksRef.current.onVisibilityChange?.(isVisible);
    },
    onVirtualKeyboardToggle: (isVisible: boolean, height: number) => {
      callbacksRef.current.onVirtualKeyboardToggle?.(isVisible, height);
    },
  }), []);
  
  // Initialize and cleanup scroll controller
  useEffect(() => {
    if (!enabled) {
      // Cleanup existing controller if disabled
      if (controllerRef.current) {
        controllerRef.current.destroy();
        controllerRef.current = null;
      }
      return;
    }
    
    // Create new controller
    const controller = new ScrollController(optionsRef.current, enhancedCallbacks);
    controllerRef.current = controller;
    
    // Initialize states from controller
    setScrollState(controller.getScrollState());
    setVisibilityState(controller.getVisibilityState());
    
    // Cleanup on unmount or when enabled changes
    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, [enabled, enhancedCallbacks]);
  
  // Update controller options when they change
  useEffect(() => {
    if (controllerRef.current && enabled) {
      controllerRef.current.updateOptions(optionsRef.current);
      
      // Update visibility state after options change
      setVisibilityState(controllerRef.current.getVisibilityState());
    }
  }, [controllerOptions, enabled]);
  
  // Memoized API functions
  const setVisibility = useCallback((isVisible: boolean, force = false) => {
    if (controllerRef.current) {
      controllerRef.current.setVisibility(isVisible, force);
    }
  }, []);
  
  const updateOptions = useCallback((newOptions: Partial<ScrollControllerOptions>) => {
    if (controllerRef.current) {
      controllerRef.current.updateOptions(newOptions);
      setVisibilityState(controllerRef.current.getVisibilityState());
    }
  }, []);
  
  return {
    scrollState,
    visibilityState,
    controller: controllerRef.current,
    setVisibility,
    updateOptions,
  };
};

// Specialized hook for navigation bar visibility only
export interface UseNavigationVisibilityOptions {
  hideThreshold?: number;
  showThreshold?: number;
  velocityThreshold?: number;
  enabled?: boolean;
  respectReducedMotion?: boolean;
}

export interface UseNavigationVisibilityReturn {
  isVisible: boolean;
  transform: string;
  shouldAnimate: boolean;
  isScrolling: boolean;
  scrollDirection: 'up' | 'down' | 'none';
  setVisibility: (isVisible: boolean, force?: boolean) => void;
}

export const useNavigationVisibility = (
  options: UseNavigationVisibilityOptions = {}
): UseNavigationVisibilityReturn => {
  const {
    hideThreshold = 48,
    showThreshold = 4,
    velocityThreshold = 0.1,
    enabled = true,
    respectReducedMotion = true,
  } = options;
  
  const { scrollState, visibilityState, setVisibility } = useScrollController({
    hideThreshold,
    showThreshold,
    velocityThreshold,
    respectReducedMotion,
    enabled,
    debounceMs: 150,
    // Disable features not needed for basic navigation visibility
    enableVirtualKeyboardDetection: false,
    enableSafeAreaDetection: false,
  });
  
  return {
    isVisible: visibilityState.isVisible,
    transform: visibilityState.transform,
    shouldAnimate: visibilityState.shouldAnimate,
    isScrolling: scrollState.isScrolling,
    scrollDirection: scrollState.direction,
    setVisibility,
  };
};

// Hook for virtual keyboard detection
export interface UseVirtualKeyboardOptions {
  enabled?: boolean;
  threshold?: number; // Height difference threshold in pixels
}

export interface UseVirtualKeyboardReturn {
  isVisible: boolean;
  height: number;
  viewportHeight: number;
}

export const useVirtualKeyboard = (
  options: UseVirtualKeyboardOptions = {}
): UseVirtualKeyboardReturn => {
  const { enabled = true, threshold = 150 } = options;
  
  const [keyboardState, setKeyboardState] = useState({
    isVisible: false,
    height: 0,
    viewportHeight: window.innerHeight,
  });
  
  useScrollController({
    enabled,
    enableVirtualKeyboardDetection: enabled,
    enableSafeAreaDetection: false,
    hideThreshold: Number.MAX_SAFE_INTEGER, // Disable scroll hiding
    showThreshold: 4,
    velocityThreshold: 0.1,
    debounceMs: 150,
    respectReducedMotion: true,
  }, {
    onVirtualKeyboardToggle: (isVisible, height) => {
      setKeyboardState(prev => ({
        ...prev,
        isVisible,
        height,
      }));
    },
  });
  
  // Also listen to window resize for fallback detection
  useEffect(() => {
    if (!enabled || 'visualViewport' in window) return;
    
    const initialHeight = window.innerHeight;
    
    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const heightDiff = initialHeight - currentHeight;
      
      setKeyboardState(prev => ({
        isVisible: heightDiff > threshold,
        height: Math.max(0, heightDiff),
        viewportHeight: currentHeight,
      }));
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [enabled, threshold]);
  
  return keyboardState;
};

// Hook for scroll performance monitoring
export interface UseScrollPerformanceOptions {
  enabled?: boolean;
  updateInterval?: number; // How often to update metrics (ms)
}

export interface UseScrollPerformanceReturn {
  fps: number;
  isSmooth: boolean;
  averageVelocity: number;
  maxVelocity: number;
  scrollEvents: number;
  isOptimal: boolean; // True if performance is good
}

export const useScrollPerformance = (
  options: UseScrollPerformanceOptions = {}
): UseScrollPerformanceReturn => {
  const { enabled = true, updateInterval = 1000 } = options;
  
  const [performance, setPerformance] = useState<UseScrollPerformanceReturn>({
    fps: 60,
    isSmooth: true,
    averageVelocity: 0,
    maxVelocity: 0,
    scrollEvents: 0,
    isOptimal: true,
  });
  
  const metricsRef = useRef({
    frameCount: 0,
    velocities: [] as number[],
    scrollEventCount: 0,
    lastFrameTime: performance.now(),
    intervalId: null as number | null,
  });
  
  useScrollController({
    enabled,
    debounceMs: 0, // Don't debounce for performance monitoring
    hideThreshold: 48,
    showThreshold: 4,
    velocityThreshold: 0.1,
    respectReducedMotion: true,
    enableVirtualKeyboardDetection: false,
    enableSafeAreaDetection: false,
  }, {
    onScrollStateChange: (state) => {
      const metrics = metricsRef.current;
      
      // Track velocity
      metrics.velocities.push(state.velocity);
      if (metrics.velocities.length > 60) { // Keep last 60 measurements
        metrics.velocities.shift();
      }
      
      // Track scroll events
      metrics.scrollEventCount++;
    },
  });
  
  useEffect(() => {
    if (!enabled) return;
    
    const metrics = metricsRef.current;
    
    // FPS monitoring
    const measureFPS = () => {
      const now = performance.now();
      const delta = now - metrics.lastFrameTime;
      
      if (delta >= updateInterval) {
        const fps = Math.round((metrics.frameCount * 1000) / delta);
        const avgVelocity = metrics.velocities.length > 0
          ? metrics.velocities.reduce((sum, v) => sum + v, 0) / metrics.velocities.length
          : 0;
        const maxVelocity = metrics.velocities.length > 0
          ? Math.max(...metrics.velocities)
          : 0;
        
        setPerformance({
          fps,
          isSmooth: fps >= 55, // Consider smooth if close to 60fps
          averageVelocity: avgVelocity,
          maxVelocity: maxVelocity,
          scrollEvents: metrics.scrollEventCount,
          isOptimal: fps >= 55 && avgVelocity < 2, // Good FPS and not too fast scrolling
        });
        
        // Reset counters
        metrics.frameCount = 0;
        metrics.scrollEventCount = 0;
        metrics.lastFrameTime = now;
        metrics.velocities = [];
      }
      
      metrics.frameCount++;
      metrics.intervalId = requestAnimationFrame(measureFPS);
    };
    
    metrics.intervalId = requestAnimationFrame(measureFPS);
    
    return () => {
      if (metrics.intervalId) {
        cancelAnimationFrame(metrics.intervalId);
        metrics.intervalId = null;
      }
    };
  }, [enabled, updateInterval]);
  
  return performance;
};

// Export all hooks
export default useScrollController;