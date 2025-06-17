import React from 'react';

// Performance monitoring and optimization service
interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  componentCount: number;
  bundleSize: number;
}

interface PerformanceThresholds {
  maxLoadTime: number; // 3 seconds
  maxRenderTime: number; // 16ms for 60fps
  maxMemoryUsage: number; // 50MB
  maxComponentCount: number; // 100 components
}

class PerformanceService {
  private static instance: PerformanceService;
  private metrics: PerformanceMetrics[] = [];
  private thresholds: PerformanceThresholds = {
    maxLoadTime: 3000,
    maxRenderTime: 16,
    maxMemoryUsage: 50 * 1024 * 1024, // 50MB
    maxComponentCount: 100,
  };

  private constructor() {
    this.setupPerformanceObserver();
    this.trackMemoryUsage();
  }

  static getInstance(): PerformanceService {
    if (!PerformanceService.instance) {
      PerformanceService.instance = new PerformanceService();
    }
    return PerformanceService.instance;
  }

  // Setup Performance Observer for measuring paint and navigation timings
  private setupPerformanceObserver(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        // Observe navigation timing
        const navObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming;
              this.recordMetric({
                loadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
                renderTime: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
                memoryUsage: this.getCurrentMemoryUsage(),
                componentCount: this.getComponentCount(),
                bundleSize: this.estimateBundleSize(),
              });
            }
          });
        });
        navObserver.observe({ entryTypes: ['navigation'] });

        // Observe paint timing
        const paintObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              console.log(`First Contentful Paint: ${entry.startTime}ms`);
            }
            if (entry.name === 'largest-contentful-paint') {
              console.log(`Largest Contentful Paint: ${entry.startTime}ms`);
            }
          });
        });
        paintObserver.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });

                 // Observe layout shift
        const layoutObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          let cls = 0;
          entries.forEach((entry) => {
            const layoutShiftEntry = entry as any;
            if (!layoutShiftEntry.hadRecentInput) {
              cls += layoutShiftEntry.value;
            }
          });
          if (cls > 0.1) {
            console.warn(`Cumulative Layout Shift detected: ${cls}`);
          }
        });
        layoutObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('Performance Observer not fully supported:', error);
      }
    }
  }

  // Track memory usage periodically
  private trackMemoryUsage(): void {
    if (typeof window !== 'undefined' && 'performance' in window && 'memory' in performance) {
      setInterval(() => {
        const memoryUsage = this.getCurrentMemoryUsage();
        if (memoryUsage > this.thresholds.maxMemoryUsage) {
          console.warn(`High memory usage detected: ${(memoryUsage / 1024 / 1024).toFixed(2)}MB`);
          this.triggerGarbageCollection();
        }
      }, 30000); // Check every 30 seconds
    }
  }

  // Get current memory usage (Chrome only)
  private getCurrentMemoryUsage(): number {
    if (typeof window !== 'undefined' && 'performance' in window && 'memory' in performance) {
      return (performance as any).memory.usedJSHeapSize || 0;
    }
    return 0;
  }

  // Estimate bundle size based on script tags
  private estimateBundleSize(): number {
    if (typeof document === 'undefined') return 0;
    
    const scripts = document.querySelectorAll('script[src]');
    let totalSize = 0;
    
    scripts.forEach((script) => {
      // This is an estimation - in production you'd want actual bundle size metrics
      const src = (script as HTMLScriptElement).src;
      if (src.includes('index') || src.includes('vendor')) {
        totalSize += 500 * 1024; // Estimate 500KB per major bundle
      }
    });
    
    return totalSize;
  }

  // Count React components (estimation)
  private getComponentCount(): number {
    if (typeof document === 'undefined') return 0;
    
    // Estimate based on elements with React-like attributes
    const reactElements = document.querySelectorAll('[data-reactroot], [data-testid], .react-component');
    return reactElements.length;
  }

  // Record performance metric
  private recordMetric(metric: PerformanceMetrics): void {
    this.metrics.push({
      ...metric,
      timestamp: Date.now(),
    } as any);

    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    // Check for threshold violations
    this.checkThresholds(metric);
  }

  // Check if metrics exceed thresholds
  private checkThresholds(metric: PerformanceMetrics): void {
    const violations: string[] = [];

    if (metric.loadTime > this.thresholds.maxLoadTime) {
      violations.push(`Load time: ${metric.loadTime}ms (max: ${this.thresholds.maxLoadTime}ms)`);
    }

    if (metric.renderTime > this.thresholds.maxRenderTime) {
      violations.push(`Render time: ${metric.renderTime}ms (max: ${this.thresholds.maxRenderTime}ms)`);
    }

    if (metric.memoryUsage > this.thresholds.maxMemoryUsage) {
      violations.push(`Memory usage: ${(metric.memoryUsage / 1024 / 1024).toFixed(2)}MB (max: ${(this.thresholds.maxMemoryUsage / 1024 / 1024).toFixed(2)}MB)`);
    }

    if (violations.length > 0) {
      console.warn('Performance threshold violations detected:', violations);
      this.optimizePerformance();
    }
  }

  // Trigger garbage collection (if available)
  private triggerGarbageCollection(): void {
    if (typeof window !== 'undefined' && 'gc' in window) {
      (window as any).gc();
    }
  }

  // Auto-optimization strategies
  private optimizePerformance(): void {
    // Remove unused event listeners
    this.cleanupEventListeners();
    
    // Clear old metrics
    if (this.metrics.length > 50) {
      this.metrics = this.metrics.slice(-50);
    }
    
    // Suggest lazy loading
    this.suggestLazyLoading();
  }

  // Cleanup event listeners
  private cleanupEventListeners(): void {
    // This would remove any unused event listeners
    // Implementation depends on your specific event management
  }

  // Suggest lazy loading opportunities
  private suggestLazyLoading(): void {
    if (typeof document === 'undefined') return;
    
    // Check for images that could be lazy loaded
    const images = document.querySelectorAll('img:not([loading="lazy"])');
    if (images.length > 10) {
      console.warn(`Consider lazy loading ${images.length} images for better performance`);
    }

    // Check for heavy components that could be code-split
    const heavyComponents = document.querySelectorAll('[data-heavy-component]');
    if (heavyComponents.length > 0) {
      console.warn('Consider code-splitting heavy components:', heavyComponents);
    }
  }

  // Public API methods
  public getAverageLoadTime(): number {
    if (this.metrics.length === 0) return 0;
    const totalLoadTime = this.metrics.reduce((sum, metric) => sum + metric.loadTime, 0);
    return totalLoadTime / this.metrics.length;
  }

  public getAverageMemoryUsage(): number {
    if (this.metrics.length === 0) return 0;
    const totalMemory = this.metrics.reduce((sum, metric) => sum + metric.memoryUsage, 0);
    return totalMemory / this.metrics.length;
  }

  public getCurrentMetrics(): PerformanceMetrics | null {
    return this.metrics.length > 0 ? this.metrics[this.metrics.length - 1] : null;
  }

  public getMetricHistory(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  public setThresholds(newThresholds: Partial<PerformanceThresholds>): void {
    this.thresholds = { ...this.thresholds, ...newThresholds };
  }

  // Component performance tracking
  public trackComponentRender(componentName: string, renderTime: number): void {
    if (renderTime > this.thresholds.maxRenderTime) {
      console.warn(`Slow component render detected: ${componentName} took ${renderTime}ms`);
    }
  }

  // Bundle analysis
  public analyzeBundleSize(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const entries = performance.getEntriesByType('resource');
        const scripts = entries.filter(entry => entry.name.endsWith('.js'));
        
        let totalSize = 0;
        scripts.forEach((script) => {
          if ('transferSize' in script) {
            totalSize += (script as any).transferSize || 0;
          }
        });

        console.log(`Total JavaScript bundle size: ${(totalSize / 1024).toFixed(2)}KB`);
        
        if (totalSize > 1024 * 1024) { // 1MB
          console.warn('Large bundle size detected. Consider code splitting.');
        }
      }
      resolve();
    });
  }

  // Performance report
  public generateReport(): string {
    const currentMetrics = this.getCurrentMetrics();
    const avgLoadTime = this.getAverageLoadTime();
    const avgMemory = this.getAverageMemoryUsage();

    return `
Performance Report:
- Current Load Time: ${currentMetrics?.loadTime || 0}ms
- Average Load Time: ${avgLoadTime.toFixed(2)}ms
- Current Memory Usage: ${((currentMetrics?.memoryUsage || 0) / 1024 / 1024).toFixed(2)}MB
- Average Memory Usage: ${(avgMemory / 1024 / 1024).toFixed(2)}MB
- Component Count: ${currentMetrics?.componentCount || 0}
- Metrics Collected: ${this.metrics.length}
    `.trim();
  }
}

// Export singleton instance
export const performanceService = PerformanceService.getInstance();

// React Hook for component performance tracking
export const usePerformanceTracking = (componentName: string) => {
  React.useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      performanceService.trackComponentRender(componentName, renderTime);
    };
  }, [componentName]);
};

// Higher-order component for performance tracking
export const withPerformanceTracking = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) => {
  const PerformanceTrackedComponent = (props: P) => {
    const name = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Unknown';
    usePerformanceTracking(name);
    
    return React.createElement(WrappedComponent, props);
  };

  PerformanceTrackedComponent.displayName = `withPerformanceTracking(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return PerformanceTrackedComponent;
};

export default PerformanceService; 