import { lazy } from 'react';

// Type definitions for browser APIs
interface NavigatorConnection {
  effectiveType: '4g' | '3g' | '2g' | 'slow-2g';
  downlink: number;
  rtt: number;
}

interface NavigatorMemory {
  deviceMemory: number;
}

interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

declare global {
  interface Navigator {
    connection?: NavigatorConnection;
    deviceMemory?: number;
  }

  interface Performance {
    memory?: PerformanceMemory;
  }
}

// Vueni Code Splitting Configuration for optimal performance
export const VueniLazyComponents = {
  // Core Pages - Lazy loaded for better performance
  VueniDashboard: lazy(() =>
    import('@/pages/Dashboard').then((module) => ({
      default: module.Dashboard || module.default,
    }))
  ),
  VueniTransactions: lazy(() =>
    import('@/pages/Transactions').then((module) => ({
      default: module.Transactions || module.default,
    }))
  ),
  VueniInsights: lazy(() =>
    import('@/pages/Insights').then((module) => ({
      default: module.Insights || module.default,
    }))
  ),
  VueniSettings: lazy(() =>
    import('@/pages/Settings').then((module) => ({
      default: module.Settings || module.default,
    }))
  ),

  // Vueni Components - Lazy loaded when needed
  VueniUnifiedTransactionList: lazy(() =>
    import('@/features/transactions/components/UnifiedTransactionList').then(
      (module) => ({
        default: module.UnifiedTransactionList || module.default,
      })
    )
  ),

  VueniUnifiedInsightsPage: lazy(() =>
    import('@/components/shared/VueniUnifiedInsightsPage').then((module) => ({
      default: module.VueniUnifiedInsightsPage || module.default,
    }))
  ),

  VueniConsolidationDemo: lazy(() =>
    import('@/components/shared/VueniConsolidationDemo').then((module) => ({
      default: module.VueniConsolidationDemo || module.default,
    }))
  ),

  // Chart Components - Heavy components loaded on demand
  VueniSpendingChart: lazy(() =>
    import('@/components/charts/SpendingChart').then((module) => ({
      default: module.SpendingChart || module.default,
    }))
  ),

  VueniCashFlowChart: lazy(() =>
    import('@/components/charts/CashFlowChart').then((module) => ({
      default: module.CashFlowChart || module.default,
    }))
  ),

  VueniCategoryBreakdown: lazy(() =>
    import('@/components/charts/CategoryBreakdown').then((module) => ({
      default: module.CategoryBreakdown || module.default,
    }))
  ),

  // Feature-specific Components
  VueniExportModal: lazy(() =>
    import('@/components/modals/ExportModal').then((module) => ({
      default: module.ExportModal || module.default,
    }))
  ),

  VueniFilterPanel: lazy(() =>
    import('@/components/filters/FilterPanel').then((module) => ({
      default: module.FilterPanel || module.default,
    }))
  ),

  VueniReportsEngine: lazy(() =>
    import('@/features/reports/components/ReportsEngine').then((module) => ({
      default: module.ReportsEngine || module.default,
    }))
  ),
};

// Preload strategies for different scenarios
export const VueniPreloadStrategies = {
  // Preload critical components on app start
  preloadCritical: () => {
    const criticalComponents = [
      () => import('@/features/transactions/components/UnifiedTransactionList'),
      () => import('@/components/shared/VueniDesignSystem'),
    ];

    criticalComponents.forEach((importFn) => {
      // Use requestIdleCallback for non-blocking preload
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => importFn());
      } else {
        setTimeout(() => importFn(), 100);
      }
    });
  },

  // Preload components based on user navigation
  preloadOnHover: (componentName: keyof typeof VueniLazyComponents) => {
    const importMap: Record<
      string,
      () => Promise<{ default?: React.ComponentType<any> }>
    > = {
      VueniTransactions: () => import('@/pages/Transactions'),
      VueniInsights: () => import('@/pages/Insights'),
      VueniSettings: () => import('@/pages/Settings'),
      VueniSpendingChart: () => import('@/components/charts/SpendingChart'),
      VueniCashFlowChart: () => import('@/components/charts/CashFlowChart'),
    };

    const importFn = importMap[componentName];
    if (importFn) {
      importFn().catch((error) => {
        console.warn(`Failed to preload ${componentName}:`, error);
      });
    }
  },

  // Preload based on viewport intersection
  preloadOnIntersection: (
    componentName: keyof typeof VueniLazyComponents,
    element: Element
  ) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            VueniPreloadStrategies.preloadOnHover(componentName);
            observer.unobserve(element);
          }
        });
      },
      { rootMargin: '100px' } // Preload when element is 100px away from viewport
    );

    observer.observe(element);
  },
};

// Bundle size optimization utilities
export const VueniOptimizationUtils = {
  // Check if component should be loaded
  shouldLoadComponent: (componentName: string, userAgent?: string): boolean => {
    // Don't load heavy components on slow connections
    if ('connection' in navigator) {
      const connection = navigator.connection;
      if (
        connection.effectiveType === 'slow-2g' ||
        connection.effectiveType === '2g'
      ) {
        const heavyComponents = [
          'VueniSpendingChart',
          'VueniCashFlowChart',
          'VueniReportsEngine',
        ];
        return !heavyComponents.includes(componentName);
      }
    }

    // Don't load desktop-specific components on mobile
    if (userAgent && /Mobile|Android|iPhone|iPad/.test(userAgent)) {
      const desktopOnlyComponents = ['VueniReportsEngine'];
      return !desktopOnlyComponents.includes(componentName);
    }

    return true;
  },

  // Get loading priority for components
  getLoadingPriority: (componentName: string): 'high' | 'medium' | 'low' => {
    const highPriority = ['VueniUnifiedTransactionList', 'VueniDesignSystem'];
    const mediumPriority = ['VueniUnifiedInsightsPage', 'VueniDashboard'];

    if (highPriority.includes(componentName)) return 'high';
    if (mediumPriority.includes(componentName)) return 'medium';
    return 'low';
  },

  // Memory optimization for large lists
  optimizeVirtualScrolling: (
    itemCount: number
  ): {
    enableVirtual: boolean;
    windowSize: number;
    bufferSize: number;
  } => {
    if (itemCount < 100) {
      return { enableVirtual: false, windowSize: itemCount, bufferSize: 0 };
    }

    // Calculate optimal window size based on device capabilities
    const deviceMemory = navigator.deviceMemory || 4; // Default to 4GB
    const baseWindowSize = Math.min(50, Math.max(20, deviceMemory * 10));

    return {
      enableVirtual: true,
      windowSize: baseWindowSize,
      bufferSize: Math.floor(baseWindowSize * 0.3),
    };
  },
};

// Performance monitoring for lazy loaded components
export const VueniPerformanceMonitor = {
  // Track component load times
  trackComponentLoad: (componentName: string, startTime: number) => {
    const endTime = performance.now();
    const loadTime = endTime - startTime;

    // Log performance metrics
    console.log(
      `[Vueni Performance] ${componentName} loaded in ${loadTime.toFixed(2)}ms`
    );

    // Send to analytics in production
    if (import.meta.env.PROD && 'sendBeacon' in navigator) {
      navigator.sendBeacon(
        '/api/vueni/performance',
        JSON.stringify({
          component: componentName,
          loadTime,
          timestamp: Date.now(),
        })
      );
    }
  },

  // Monitor memory usage
  trackMemoryUsage: (componentName: string) => {
    if ('memory' in performance) {
      const memory = performance.memory;
      console.log(
        `[Vueni Memory] ${componentName} - Used: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`
      );

      // Warn if memory usage is high
      if (memory.usedJSHeapSize > 100 * 1024 * 1024) {
        // 100MB
        console.warn(
          `[Vueni Memory] High memory usage detected: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`
        );
      }
    }
  },

  // Initialize performance monitoring
  initialize: () => {
    // Monitor overall bundle performance
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            console.log(
              `[Vueni Performance] Page load: ${navEntry.loadEventEnd - navEntry.loadEventStart}ms`
            );
          }
        });
      });

      observer.observe({ entryTypes: ['navigation'] });
    }

    // Preload critical components
    VueniPreloadStrategies.preloadCritical();
  },
};

// Export default optimization configuration
export const vueniOptimizationConfig = {
  lazyComponents: VueniLazyComponents,
  preloadStrategies: VueniPreloadStrategies,
  optimizationUtils: VueniOptimizationUtils,
  performanceMonitor: VueniPerformanceMonitor,

  // Global settings
  settings: {
    enableCodeSplitting: true,
    enablePreloading: true,
    enableVirtualScrolling: true,
    enablePerformanceMonitoring: import.meta.env.PROD,
    maxMemoryUsage: 150 * 1024 * 1024, // 150MB limit
    chunkSizeTarget: 250 * 1024, // 250KB target chunk size
  },
};

export default vueniOptimizationConfig;
