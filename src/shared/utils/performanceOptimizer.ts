// Performance Optimization Utilities for Vueni
import React from 'react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  isLowEndDevice: boolean;
  isMobile: boolean;
  supportsWebGL: boolean;
  prefersReducedMotion: boolean;
}

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
    const monitor = () => {
      this.frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - this.lastTime >= 1000) {
        this.metrics.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
        this.frameCount = 0;
        this.lastTime = currentTime;

        // Update memory usage if available
        if ('memory' in performance) {
          this.metrics.memoryUsage = (performance as any).memory.usedJSHeapSize / 1048576; // MB
        }

        // Notify callbacks
        this.callbacks.forEach(callback => callback(this.metrics));
      }

      this.animationId = requestAnimationFrame(monitor);
    };

    this.animationId = requestAnimationFrame(monitor);
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

// Performance-aware settings
export const getOptimizedSettings = (metrics: PerformanceMetrics) => {
  const settings = {
    liquidGlass: {
      enabled: true,
      intensity: 0.6,
      distortion: 0.4,
      animated: true,
      interactive: true
    },
    animations: {
      enabled: true,
      duration: 300,
      stagger: 100
    },
    rendering: {
      lazyLoad: false,
      virtualization: false,
      batchUpdates: false
    }
  };

  // Performance-based optimizations
  if (metrics.fps < 30) {
    settings.liquidGlass.animated = false;
    settings.liquidGlass.intensity *= 0.5;
    settings.animations.duration *= 0.5;
    settings.rendering.batchUpdates = true;
  }

  if (metrics.isLowEndDevice) {
    settings.liquidGlass.intensity *= 0.6;
    settings.liquidGlass.distortion *= 0.6;
    settings.liquidGlass.interactive = false;
    settings.rendering.lazyLoad = true;
  }

  if (metrics.isMobile) {
    settings.liquidGlass.intensity *= 0.7;
    settings.liquidGlass.animated = false;
    settings.animations.duration *= 0.7;
    settings.rendering.lazyLoad = true;
  }

  if (!metrics.supportsWebGL) {
    settings.liquidGlass.enabled = false;
  }

  if (metrics.prefersReducedMotion) {
    settings.liquidGlass.animated = false;
    settings.animations.enabled = false;
  }

  return settings;
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

// Batch state updates for better performance
export const useBatchedUpdates = () => {
  const [updates, setUpdates] = React.useState<Array<() => void>>([]);
  
  const batchUpdate = React.useCallback((updateFn: () => void) => {
    setUpdates(prev => [...prev, updateFn]);
  }, []);
  
  React.useEffect(() => {
    if (updates.length > 0) {
      const timer = setTimeout(() => {
        React.startTransition(() => {
          updates.forEach(update => update());
          setUpdates([]);
        });
      }, 16); // Next frame
      
      return () => clearTimeout(timer);
    }
  }, [updates]);
  
  return batchUpdate;
};

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

// Memory-efficient memoization
export const useOptimizedMemo = <T>(
  factory: () => T,
  deps: React.DependencyList,
  expiry: number = 5000 // 5 seconds
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
        deps: [...deps] // Create a copy to avoid mutations
      };
    }
    
    return memoRef.current.value;
  }, [factory, expiry, ...deps]); // Add all missing dependencies
};

export default PerformanceMonitor; 