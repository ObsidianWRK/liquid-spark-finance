import { getCLS, getFID, getFCP, getLCP, getTTFB, Metric } from 'web-vitals';

export interface VueniPerformanceMetrics {
  cls: number | null;
  fid: number | null;
  fcp: number | null;
  lcp: number | null;
  ttfb: number | null;
  componentLoadTimes: Record<string, number>;
  memoryUsage: {
    used: number;
    total: number;
    limit: number;
  } | null;
  bundleSize: number | null;
  timestamp: number;
}

export class VueniPerformanceMonitor {
  private static metrics: VueniPerformanceMetrics = {
    cls: null,
    fid: null,
    fcp: null,
    lcp: null,
    ttfb: null,
    componentLoadTimes: {},
    memoryUsage: null,
    bundleSize: null,
    timestamp: Date.now()
  };

  private static observers: PerformanceObserver[] = [];
  private static thresholds = {
    cls: 0.1,      // Good: ≤ 0.1
    fid: 100,      // Good: ≤ 100ms
    fcp: 1800,     // Good: ≤ 1.8s
    lcp: 2500,     // Good: ≤ 2.5s
    ttfb: 800,     // Good: ≤ 800ms
    componentLoad: 200, // Component should load within 200ms
    memoryUsage: 100 * 1024 * 1024 // 100MB warning threshold
  };

  static initialize(): void {
    if (typeof window === 'undefined') return;

    // Initialize Web Vitals monitoring
    this.initWebVitals();
    
    // Initialize component performance monitoring
    this.initComponentMonitoring();
    
    // Initialize memory monitoring
    this.initMemoryMonitoring();
    
    // Initialize bundle analysis
    this.initBundleAnalysis();

    console.log('[Vueni Performance] Performance monitoring initialized');
  }

  private static initWebVitals(): void {
    getCLS(this.handleMetric.bind(this));
    getFID(this.handleMetric.bind(this));
    getFCP(this.handleMetric.bind(this));
    getLCP(this.handleMetric.bind(this));
    getTTFB(this.handleMetric.bind(this));
  }

  private static handleMetric(metric: Metric): void {
    const { name, value } = metric;
    
    switch (name) {
      case 'CLS':
        this.metrics.cls = value;
        break;
      case 'FID':
        this.metrics.fid = value;
        break;
      case 'FCP':
        this.metrics.fcp = value;
        break;
      case 'LCP':
        this.metrics.lcp = value;
        break;
      case 'TTFB':
        this.metrics.ttfb = value;
        break;
    }

    this.logMetric(name, value);
    this.evaluateMetric(name, value);
    this.sendMetricToAnalytics(metric);
  }

  private static logMetric(name: string, value: number): void {
    const threshold = this.thresholds[name.toLowerCase() as keyof typeof this.thresholds];
    const status = value <= threshold ? '✅' : '⚠️';
    
    console.log(`[Vueni Performance] ${status} ${name}: ${value.toFixed(2)}${name === 'CLS' ? '' : 'ms'}`);
  }

  private static evaluateMetric(name: string, value: number): void {
    const threshold = this.thresholds[name.toLowerCase() as keyof typeof this.thresholds];
    
    if (value > threshold) {
      console.warn(`[Vueni Performance] ${name} exceeds threshold: ${value} > ${threshold}`);
      
      // Provide specific recommendations
      this.provideOptimizationRecommendations(name, value);
    }
  }

  private static provideOptimizationRecommendations(metric: string, value: number): void {
    const recommendations: Record<string, string[]> = {
      CLS: [
        'Add explicit dimensions to images and embeds',
        'Reserve space for dynamically injected content',
        'Use CSS containment for layout stability'
      ],
      FID: [
        'Break up long-running JavaScript tasks',
        'Use React.memo() for expensive components',
        'Implement virtualization for large lists'
      ],
      FCP: [
        'Optimize critical resource loading',
        'Use resource hints (preload, prefetch)',
        'Minimize render-blocking resources'
      ],
      LCP: [
        'Optimize largest element loading',
        'Use appropriate image formats (WebP, AVIF)',
        'Implement lazy loading for below-fold content'
      ],
      TTFB: [
        'Optimize server response times',
        'Use CDN for static assets',
        'Implement proper caching strategies'
      ]
    };

    const metricRecommendations = recommendations[metric];
    if (metricRecommendations) {
      console.group(`[Vueni Performance] Optimization recommendations for ${metric}:`);
      metricRecommendations.forEach(rec => console.log(`• ${rec}`));
      console.groupEnd();
    }
  }

  private static initComponentMonitoring(): void {
    // Monitor long tasks that might affect component rendering
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) { // Tasks longer than 50ms
            console.warn(`[Vueni Performance] Long task detected: ${entry.duration.toFixed(2)}ms`);
          }
        });
      });

      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.push(longTaskObserver);
      } catch (error) {
        console.warn('[Vueni Performance] Long task monitoring not supported');
      }
    }
  }

  private static initMemoryMonitoring(): void {
    // Monitor memory usage every 30 seconds
    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        
        this.metrics.memoryUsage = {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        };

        const usedMB = memory.usedJSHeapSize / 1024 / 1024;
        
        if (memory.usedJSHeapSize > this.thresholds.memoryUsage) {
          console.warn(`[Vueni Performance] High memory usage: ${usedMB.toFixed(2)}MB`);
          this.suggestMemoryOptimizations();
        }

        console.log(`[Vueni Performance] Memory usage: ${usedMB.toFixed(2)}MB`);
      }
    };

    checkMemory();
    setInterval(checkMemory, 30000); // Check every 30 seconds
  }

  private static suggestMemoryOptimizations(): void {
    console.group('[Vueni Performance] Memory optimization suggestions:');
    console.log('• Use React.memo() for components that re-render frequently');
    console.log('• Implement proper cleanup in useEffect hooks');
    console.log('• Consider virtualization for large transaction lists');
    console.log('• Clear unused data from state management');
    console.log('• Use lazy loading for heavy components');
    console.groupEnd();
  }

  private static initBundleAnalysis(): void {
    // Analyze bundle size by tracking resource loading
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        let totalJSSize = 0;
        
        list.getEntries().forEach((entry) => {
          const resourceEntry = entry as PerformanceResourceTiming;
          
          if (resourceEntry.name.includes('.js')) {
            totalJSSize += resourceEntry.transferSize || 0;
          }
        });

        if (totalJSSize > 0) {
          this.metrics.bundleSize = totalJSSize;
          const sizeMB = totalJSSize / 1024 / 1024;
          
          console.log(`[Vueni Performance] Total JS bundle size: ${sizeMB.toFixed(2)}MB`);
          
          if (sizeMB > 1.5) { // Warn if bundle is larger than 1.5MB
            console.warn('[Vueni Performance] Large bundle size detected. Consider code splitting.');
          }
        }
      });

      try {
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      } catch (error) {
        console.warn('[Vueni Performance] Resource monitoring not supported');
      }
    }
  }

  static trackComponentLoad(componentName: string, loadTime: number): void {
    this.metrics.componentLoadTimes[componentName] = loadTime;
    
    const status = loadTime <= this.thresholds.componentLoad ? '✅' : '⚠️';
    console.log(`[Vueni Performance] ${status} Component ${componentName} loaded in ${loadTime.toFixed(2)}ms`);

    if (loadTime > this.thresholds.componentLoad) {
      console.warn(`[Vueni Performance] Slow component load: ${componentName} (${loadTime.toFixed(2)}ms)`);
      this.suggestComponentOptimizations(componentName);
    }

    // Send component performance to analytics
    this.sendComponentMetricToAnalytics(componentName, loadTime);
  }

  private static suggestComponentOptimizations(componentName: string): void {
    console.group(`[Vueni Performance] Optimization suggestions for ${componentName}:`);
    console.log('• Use React.memo() to prevent unnecessary re-renders');
    console.log('• Implement code splitting with React.lazy()');
    console.log('• Consider memoizing expensive calculations with useMemo()');
    console.log('• Use useCallback() for event handlers');
    console.log('• Implement virtualization for large lists');
    console.groupEnd();
  }

  private static sendMetricToAnalytics(metric: Metric): void {
    if (!import.meta.env.PROD) return;

    // Send to Vueni analytics endpoint
    if ('sendBeacon' in navigator) {
      const data = {
        type: 'web-vital',
        name: metric.name,
        value: metric.value,
        rating: this.getRating(metric.name, metric.value),
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      };

      navigator.sendBeacon('/api/vueni/analytics/performance', JSON.stringify(data));
    }
  }

  private static sendComponentMetricToAnalytics(componentName: string, loadTime: number): void {
    if (!import.meta.env.PROD) return;

    if ('sendBeacon' in navigator) {
      const data = {
        type: 'component-performance',
        component: componentName,
        loadTime,
        rating: loadTime <= this.thresholds.componentLoad ? 'good' : 'poor',
        timestamp: Date.now(),
        url: window.location.href
      };

      navigator.sendBeacon('/api/vueni/analytics/component', JSON.stringify(data));
    }
  }

  private static getRating(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds: Record<string, [number, number]> = {
      CLS: [0.1, 0.25],
      FID: [100, 300],
      FCP: [1800, 3000],
      LCP: [2500, 4000],
      TTFB: [800, 1800]
    };

    const [goodThreshold, poorThreshold] = thresholds[metricName] || [0, Infinity];
    
    if (value <= goodThreshold) return 'good';
    if (value <= poorThreshold) return 'needs-improvement';
    return 'poor';
  }

  static getMetrics(): VueniPerformanceMetrics {
    return { ...this.metrics, timestamp: Date.now() };
  }

  static generatePerformanceReport(): string {
    const metrics = this.getMetrics();
    
    let report = '\n🚀 Vueni Performance Report\n';
    report += '═══════════════════════════════\n\n';
    
    // Web Vitals
    report += '📊 Core Web Vitals:\n';
    report += `• CLS: ${metrics.cls?.toFixed(3) || 'N/A'} ${this.getStatusEmoji('CLS', metrics.cls)}\n`;
    report += `• FID: ${metrics.fid?.toFixed(2) || 'N/A'}ms ${this.getStatusEmoji('FID', metrics.fid)}\n`;
    report += `• FCP: ${metrics.fcp?.toFixed(2) || 'N/A'}ms ${this.getStatusEmoji('FCP', metrics.fcp)}\n`;
    report += `• LCP: ${metrics.lcp?.toFixed(2) || 'N/A'}ms ${this.getStatusEmoji('LCP', metrics.lcp)}\n`;
    report += `• TTFB: ${metrics.ttfb?.toFixed(2) || 'N/A'}ms ${this.getStatusEmoji('TTFB', metrics.ttfb)}\n\n`;

    // Component Performance
    if (Object.keys(metrics.componentLoadTimes).length > 0) {
      report += '🧩 Component Load Times:\n';
      Object.entries(metrics.componentLoadTimes).forEach(([component, time]) => {
        const status = time <= this.thresholds.componentLoad ? '✅' : '⚠️';
        report += `• ${component}: ${time.toFixed(2)}ms ${status}\n`;
      });
      report += '\n';
    }

    // Memory Usage
    if (metrics.memoryUsage) {
      const usedMB = metrics.memoryUsage.used / 1024 / 1024;
      const status = metrics.memoryUsage.used <= this.thresholds.memoryUsage ? '✅' : '⚠️';
      report += `💾 Memory Usage: ${usedMB.toFixed(2)}MB ${status}\n\n`;
    }

    // Bundle Size
    if (metrics.bundleSize) {
      const sizeMB = metrics.bundleSize / 1024 / 1024;
      const status = sizeMB <= 1.5 ? '✅' : '⚠️';
      report += `📦 Bundle Size: ${sizeMB.toFixed(2)}MB ${status}\n\n`;
    }

    report += `⏰ Report generated: ${new Date(metrics.timestamp).toLocaleString()}`;
    
    return report;
  }

  private static getStatusEmoji(metric: string, value: number | null): string {
    if (value === null) return '❓';
    
    const threshold = this.thresholds[metric.toLowerCase() as keyof typeof this.thresholds];
    return value <= threshold ? '✅' : '⚠️';
  }

  static cleanup(): void {
    // Clean up observers
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers = [];
    
    console.log('[Vueni Performance] Performance monitoring cleanup completed');
  }
}

// Auto-initialize in production
if (import.meta.env.PROD && typeof window !== 'undefined') {
  // Initialize after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      VueniPerformanceMonitor.initialize();
    });
  } else {
    VueniPerformanceMonitor.initialize();
  }
}

export default VueniPerformanceMonitor;