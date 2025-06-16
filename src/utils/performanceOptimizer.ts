// Performance Optimization Utilities for Vueni - Consolidated Version
import React from 'react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  isLowEndDevice: boolean;
  isMobile: boolean;
  supportsWebGL: boolean;
  prefersReducedMotion: boolean;
}

/**
 * Singleton Performance Monitor
 * Provides centralized performance tracking and optimization
 */
class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics;
  private frameCount = 0;
  private lastTime = performance.now();
  private animationId: number | null = null;
  private callbacks: Array<(metrics: PerformanceMetrics) => void> = [];

  private constructor() {
    this.metrics = this.detectCapabilities();
    this.startMonitoring();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private detectCapabilities(): PerformanceMetrics {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    const isLowEndDevice = navigator.hardwareConcurrency 
      ? navigator.hardwareConcurrency < 4 
      : isMobile;

    const supportsWebGL = (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      } catch {
        return false;
      }
    })();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    return {
      fps: 60,
      memoryUsage: 0,
      isLowEndDevice,
      isMobile,
      supportsWebGL,
      prefersReducedMotion
    };
  }

  private startMonitoring() {
    const updateMetrics = () => {
      this.frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - this.lastTime >= 1000) {
        const fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
        this.metrics.fps = fps;
        this.frameCount = 0;
        this.lastTime = currentTime;

        // Notify subscribers
        this.callbacks.forEach(callback => callback(this.metrics));
      }

      this.animationId = requestAnimationFrame(updateMetrics);
    };

    this.animationId = requestAnimationFrame(updateMetrics);
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  subscribe(callback: (metrics: PerformanceMetrics) => void) {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.callbacks = [];
  }
}

/**
 * React Hooks for Performance Optimization
 */

// Hook for performance monitoring
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>(
    PerformanceMonitor.getInstance().getMetrics()
  );
  
  React.useEffect(() => {
    const monitor = PerformanceMonitor.getInstance();
    const unsubscribe = monitor.subscribe(setMetrics);
    
    return unsubscribe;
  }, []);
  
  return metrics;
};

// Performance-aware useEffect
export const usePerformanceAwareEffect = (
  effect: React.EffectCallback,
  deps?: React.DependencyList,
  highPriority: boolean = false
) => {
  React.useEffect(() => {
    const metrics = PerformanceMonitor.getInstance().getMetrics();
    
    if (!highPriority && metrics.fps < 30) {
      // Defer non-critical effects when performance is poor
      const timer = setTimeout(effect, 100);
      return () => clearTimeout(timer);
    } else {
      return effect();
    }
  }, deps);
};

// Debounced state updates for performance
export const useDebouncedState = <T>(
  initialValue: T,
  delay: number = 300
): [T, (value: T) => void] => {
  const [state, setState] = React.useState(initialValue);
  const [debouncedState, setDebouncedState] = React.useState(initialValue);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedState(state);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [state, delay]);
  
  return [debouncedState, setState];
};

// Memory-efficient memoization with expiry
export const useOptimizedMemo = <T>(
  factory: () => T,
  deps: React.DependencyList,
  expiry: number = 5000
) => {
  const memoRef = React.useRef<{ value: T; timestamp: number; deps: React.DependencyList } | null>(null);
  
  return React.useMemo(() => {
    const now = Date.now();
    
    if (
      !memoRef.current ||
      now - memoRef.current.timestamp > expiry ||
      !deps.every((dep, index) => dep === memoRef.current!.deps[index])
    ) {
      memoRef.current = {
        value: factory(),
        timestamp: now,
        deps
      };
    }
    
    return memoRef.current.value;
  }, deps);
};

// Lazy loading utility
export const createLazyComponent = (
  importFn: () => Promise<{ default: React.ComponentType<any> }>
) => {
  return React.lazy(() => {
    const metrics = PerformanceMonitor.getInstance().getMetrics();
    
    if (metrics.isLowEndDevice) {
      // Delay loading on low-end devices
      return new Promise(resolve => {
        setTimeout(() => resolve(importFn()), 100);
      });
    } else {
      return importFn();
    }
  });
};

/**
 * Layout debugging hook for development
 */
export const useLayoutDebug = (componentName: string) => {
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const startTime = performance.now();
      
      return () => {
        const renderTime = performance.now() - startTime;
        if (renderTime > 16.67) { // Longer than 1 frame at 60fps
          console.warn(`${componentName} render took ${renderTime.toFixed(2)}ms`);
        }
      };
    }
  }, [componentName]);
};

export default PerformanceMonitor; 