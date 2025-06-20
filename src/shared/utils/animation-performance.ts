/**
 * Animation Performance Utilities
 * Centralized performance monitoring and optimization for chart animations
 * Based on Apple Human Interface Guidelines 2025
 */

import {
  appleGraphTokens,
  shouldReduceMotion,
  getChartAnimationPreset,
} from '@/theme/graph-tokens';

// Performance monitoring state
interface AnimationMetrics {
  frameDrops: number;
  averageFPS: number;
  animationCount: number;
  lastMeasurement: number;
  performanceScore: number;
}

let performanceState: AnimationMetrics = {
  frameDrops: 0,
  averageFPS: 60,
  animationCount: 0,
  lastMeasurement: Date.now(),
  performanceScore: 100,
};

// Frame rate monitoring
let frameCount = 0;
let lastFrameTime = Date.now();
let frameRateCallbacks: ((fps: number) => void)[] = [];

/**
 * Start monitoring frame rate performance
 */
export const startFrameRateMonitoring = (): void => {
  if (typeof window === 'undefined') return;

  const measureFrameRate = () => {
    const now = Date.now();
    frameCount++;

    // Measure FPS every second
    if (now - lastFrameTime >= 1000) {
      const fps = Math.round((frameCount * 1000) / (now - lastFrameTime));
      performanceState.averageFPS = fps;

      // Detect frame drops (below 55 FPS)
      if (fps < 55) {
        performanceState.frameDrops++;
      }

      // Update performance score
      performanceState.performanceScore = Math.min(100, (fps / 60) * 100);

      // Notify callbacks
      frameRateCallbacks.forEach((callback) => callback(fps));

      frameCount = 0;
      lastFrameTime = now;
    }

    requestAnimationFrame(measureFrameRate);
  };

  requestAnimationFrame(measureFrameRate);
};

/**
 * Subscribe to frame rate updates
 */
export const onFrameRateUpdate = (
  callback: (fps: number) => void
): (() => void) => {
  frameRateCallbacks.push(callback);

  return () => {
    const index = frameRateCallbacks.indexOf(callback);
    if (index > -1) {
      frameRateCallbacks.splice(index, 1);
    }
  };
};

/**
 * Get current performance metrics
 */
export const getPerformanceMetrics = (): AnimationMetrics => {
  return { ...performanceState };
};

/**
 * Optimized animation configuration based on current performance
 */
export const getOptimizedAnimationConfig = (
  chartType: 'line' | 'area' | 'bar' | 'stacked' | 'hover' | 'selection',
  forceOptimization = false
) => {
  const basePreset = getChartAnimationPreset(chartType);
  const reducedMotion = shouldReduceMotion();
  const lowPerformance =
    performanceState.performanceScore < 80 || forceOptimization;

  // Disable animations for reduced motion
  if (reducedMotion) {
    return {
      duration: 0,
      easing: 'ease',
      delay: 0,
      enabled: false,
    };
  }

  // Optimize for low performance
  if (lowPerformance) {
    return {
      duration: Math.min(basePreset.duration, 300), // Cap at 300ms
      easing: 'ease-out', // Use simpler easing
      delay: 0, // Remove delays
      enabled: true,
    };
  }

  // Full quality for good performance
  return {
    duration: basePreset.duration,
    easing: basePreset.easing,
    delay: basePreset.delay,
    enabled: true,
  };
};

/**
 * Animation scheduler to prevent too many concurrent animations
 */
class AnimationScheduler {
  private activeAnimations = new Set<string>();
  private queue: Array<{ id: string; callback: () => void; priority: number }> =
    [];
  private maxConcurrent: number;

  constructor() {
    this.maxConcurrent =
      appleGraphTokens.animation.performance.maxConcurrentAnimations;
  }

  /**
   * Schedule an animation with priority
   */
  schedule(id: string, callback: () => void, priority = 0): Promise<void> {
    return new Promise((resolve) => {
      const execute = () => {
        this.activeAnimations.add(id);

        // Wrap callback to clean up when done
        const wrappedCallback = () => {
          try {
            callback();
          } finally {
            this.activeAnimations.delete(id);
            this.processQueue();
            resolve();
          }
        };

        // Execute immediately or queue
        if (this.activeAnimations.size < this.maxConcurrent) {
          wrappedCallback();
        } else {
          this.queue.push({ id, callback: wrappedCallback, priority });
          this.queue.sort((a, b) => b.priority - a.priority); // Higher priority first
        }
      };

      execute();
    });
  }

  /**
   * Process queued animations
   */
  private processQueue(): void {
    while (
      this.queue.length > 0 &&
      this.activeAnimations.size < this.maxConcurrent
    ) {
      const next = this.queue.shift();
      if (next) {
        next.callback();
      }
    }
  }

  /**
   * Cancel an animation
   */
  cancel(id: string): void {
    this.activeAnimations.delete(id);
    this.queue = this.queue.filter((item) => item.id !== id);
    this.processQueue();
  }

  /**
   * Cancel all animations
   */
  cancelAll(): void {
    this.activeAnimations.clear();
    this.queue = [];
  }

  /**
   * Get current animation count
   */
  getActiveCount(): number {
    return this.activeAnimations.size;
  }
}

// Global animation scheduler instance
export const animationScheduler = new AnimationScheduler();

/**
 * Performance-aware CSS animation helper
 */
export const createPerformantAnimation = (
  element: HTMLElement,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions,
  chartType:
    | 'line'
    | 'area'
    | 'bar'
    | 'stacked'
    | 'hover'
    | 'selection' = 'hover'
): Animation | null => {
  if (typeof window === 'undefined') return null;

  const config = getOptimizedAnimationConfig(chartType);

  if (!config.enabled) {
    return null;
  }

  // Add will-change for GPU acceleration
  if (appleGraphTokens.animation.performance.enableWillChange) {
    element.style.willChange = 'transform, opacity';
  }

  // Create optimized animation
  const animation = element.animate(keyframes, {
    ...options,
    duration: config.duration,
    easing: config.easing,
  });

  // Clean up will-change when done
  animation.addEventListener('finish', () => {
    element.style.willChange = 'auto';
  });

  return animation;
};

/**
 * React hook for performance-aware animations
 */
export const usePerformantAnimation = () => {
  const metrics = getPerformanceMetrics();

  return {
    metrics,
    shouldOptimize: metrics.performanceScore < 80,
    getConfig: getOptimizedAnimationConfig,
    schedule: animationScheduler.schedule.bind(animationScheduler),
    cancel: animationScheduler.cancel.bind(animationScheduler),
  };
};

/**
 * Initialize performance monitoring
 */
export const initializeAnimationPerformance = (): void => {
  if (typeof window !== 'undefined') {
    startFrameRateMonitoring();

    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      onFrameRateUpdate((fps) => {
        if (fps < 55) {
          console.warn(`Chart animation performance warning: ${fps} FPS`);
        }
      });
    }
  }
};

// Auto-initialize in browser environment
if (typeof window !== 'undefined') {
  initializeAnimationPerformance();
}
