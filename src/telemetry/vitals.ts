/**
 * Web Vitals Telemetry System
 * Real-time performance monitoring for Vueni
 * Tracks LCP, CLS, FCP, and TTFB for optimization insights
 */

import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals';

// Performance thresholds for alerts
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 }
};

// Simple vital data interface
interface VitalData {
  name: string;
  value: number;
  rating: string;
  url: string;
  timestamp: number;
  deviceType: string;
  connectionType: string;
  userAgent: string;
  viewportSize: string;
}

class VitalsCollector {
  private metrics: VitalData[] = [];
  private isDev = import.meta.env.DEV;
  private endpoint = '/api/analytics/vitals';

  constructor() {
    this.setupVitalsCollection();
    this.setupDevConsoleLogging();
  }

  private setupVitalsCollection(): void {
    const collectMetric = (metric: any) => {
      const vitalData: VitalData = {
        name: metric.name,
        value: metric.value,
        rating: metric.rating || 'good',
        url: window.location.href,
        timestamp: Date.now(),
        deviceType: this.getDeviceType(),
        connectionType: this.getConnectionType(),
        userAgent: navigator.userAgent,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`
      };

      this.metrics.push(vitalData);
      this.logMetric(vitalData);
      this.sendTelemetry(vitalData);
    };

    // Collect all Core Web Vitals
    onLCP(collectMetric);
    onCLS(collectMetric);
    onFCP(collectMetric);
    onTTFB(collectMetric);
  }

  private setupDevConsoleLogging(): void {
    if (!this.isDev) return;

    // Dev console logging enabled
  }

  private getDeviceType(): string {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private getConnectionType(): string {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return connection?.effectiveType || 'unknown';
    }
    return 'unknown';
  }

  private logMetric(vital: VitalData): void {
    const { name, value } = vital;
    const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
    
    if (!threshold) return;

    let status = '✅ Good';
    let color = '#00ff00';
    
    if (value > threshold.poor) {
      status = '❌ Poor';
      color = '#ff0000';
    } else if (value > threshold.good) {
      status = '⚠️ Needs Improvement';
      color = '#ffaa00';
    }

    const message = `%c[${name}] ${value.toFixed(2)}${name === 'CLS' ? '' : 'ms'} - ${status}`;
    
    if (this.isDev) {
      // Output metric details in development console
    }

    // Alert for poor performance
    if (value > threshold.poor && this.isDev) {
      console.warn(`🚨 Performance Alert: ${name} is ${value.toFixed(2)}${name === 'CLS' ? '' : 'ms'}, exceeding the ${threshold.poor}${name === 'CLS' ? '' : 'ms'} threshold`);
    }
  }

  private async sendTelemetry(vital: VitalData): Promise<void> {
    // Don't send in development
    if (this.isDev) return;

    try {
      // Use sendBeacon for reliability
      if ('sendBeacon' in navigator) {
        const success = navigator.sendBeacon(
          this.endpoint,
          JSON.stringify(vital)
        );
        
        if (!success) {
          // Fallback to fetch
          await this.fallbackSend(vital);
        }
      } else {
        await this.fallbackSend(vital);
      }
    } catch (error) {
      console.error('Failed to send performance telemetry:', error);
    }
  }

  private async fallbackSend(vital: VitalData): Promise<void> {
    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vital),
        keepalive: true
      });
    } catch (error) {
      // Silent fail in production
      if (this.isDev) {
        console.error('Telemetry fallback failed:', error);
      }
    }
  }

  // Public API for manual metrics
  public trackCustomMetric(name: string, value: number): void {
    const customMetric: VitalData = {
      name,
      value,
      rating: value > 1000 ? 'poor' : value > 500 ? 'needs-improvement' : 'good',
      url: window.location.href,
      timestamp: Date.now(),
      deviceType: this.getDeviceType(),
      connectionType: this.getConnectionType(),
      userAgent: navigator.userAgent,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`
    };

    this.metrics.push(customMetric);
    this.logMetric(customMetric);
    this.sendTelemetry(customMetric);
  }

  // Get current performance summary
  public getPerformanceSummary(): Record<string, any> {
    const summary: Record<string, any> = {};
    
    Object.keys(THRESHOLDS).forEach(metricName => {
      const metric = this.metrics.find(m => m.name === metricName);
      if (metric) {
        const threshold = THRESHOLDS[metricName as keyof typeof THRESHOLDS];
        summary[metricName] = {
          value: metric.value,
          rating: metric.rating,
          timestamp: metric.timestamp,
          isGood: metric.value <= threshold.good,
          isPoor: metric.value > threshold.poor
        };
      }
    });

    return summary;
  }

  // Export data for debugging
  public exportMetrics(): VitalData[] {
    return [...this.metrics];
  }
}

// Global instance
const vitalsCollector = new VitalsCollector();

// Export utilities
export const trackCustomMetric = (name: string, value: number) => {
  vitalsCollector.trackCustomMetric(name, value);
};

export const getPerformanceSummary = () => {
  return vitalsCollector.getPerformanceSummary();
};

export const exportVitalsData = () => {
  return vitalsCollector.exportMetrics();
};

// Development helpers
if (import.meta.env.DEV) {
  // Make available in dev tools console
  (window as any).__vitals = {
    summary: getPerformanceSummary,
    export: exportVitalsData,
    track: trackCustomMetric,
    thresholds: THRESHOLDS
  };

  // Expose vitals object for debugging
}

// Chart loading performance tracker
export const trackChartPerformance = (chartType: string) => {
  const startTime = performance.now();
  
  return () => {
    const loadTime = performance.now() - startTime;
    trackCustomMetric(`chart-load-${chartType}`, loadTime);
  };
};

// Route change performance tracker
export const trackRouteChange = (routeName: string) => {
  const startTime = performance.now();
  
  return () => {
    const navigationTime = performance.now() - startTime;
    trackCustomMetric(`route-change-${routeName}`, navigationTime);
  };
};

export default vitalsCollector; 