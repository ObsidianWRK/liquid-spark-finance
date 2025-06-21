/**
 * LazyChartWrapper - Optimized chart loading with IntersectionObserver
 * Reduces vendor-charts bundle by loading charts only when visible
 * Target: vendor-charts ≤ 300KB
 */

import React, {
  useState,
  useEffect,
  useRef,
  lazy,
  Suspense,
  ReactNode,
} from 'react';
import { cn } from '@/shared/lib/utils';

// Chart skeleton with theme-aware styling
const ChartSkeleton: React.FC<{
  height?: number;
  className?: string;
  showTitle?: boolean;
  title?: string;
}> = ({ height = 180, className, showTitle = false, title }) => (
  <div
    className={cn(
      'bg-white/[0.02] rounded-vueni-lg border border-white/[0.08] animate-pulse',
      'flex flex-col justify-center items-center p-6',
      className
    )}
    style={{ height }}
  >
    {showTitle && title && (
      <div className="w-full mb-4">
        <div className="h-5 bg-white/[0.05] rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-white/[0.03] rounded w-1/2"></div>
      </div>
    )}

    <div className="flex-1 w-full flex items-center justify-center">
      <div className="flex items-center space-x-2 text-white/60">
        <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-vueni-pill animate-spin"></div>
        <span className="text-sm">Loading chart...</span>
      </div>
    </div>

    {/* Chart-like skeleton elements */}
    <div className="w-full flex items-end justify-center space-x-1 mt-4">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="bg-white/[0.05] rounded-t-vueni-sm"
          style={{
            width: '12px',
            height: `${Math.random() * 30 + 10}px`,
            animationDelay: `${i * 100}ms`,
          }}
        />
      ))}
    </div>
  </div>
);

// Intersection Observer hook for lazy loading
const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before visible
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, hasIntersected, options]);

  return { isIntersecting, hasIntersected };
};

// Main lazy chart wrapper component
interface LazyChartWrapperProps {
  children: ReactNode;
  height?: number;
  title?: string;
  className?: string;
  preload?: boolean; // Force immediate loading
  threshold?: number; // Intersection threshold
}

export const LazyChartWrapper: React.FC<LazyChartWrapperProps> = ({
  children,
  height = 180,
  title,
  className,
  preload = false,
  threshold = 0.1,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { hasIntersected } = useIntersectionObserver(containerRef, {
    threshold,
  });

  const shouldLoad = preload || hasIntersected;

  return (
    <div ref={containerRef} className={cn('w-full', className)}>
      {shouldLoad ? (
        <Suspense
          fallback={
            <ChartSkeleton
              height={height}
              showTitle={!!title}
              title={title}
              className={className}
            />
          }
        >
          {children}
        </Suspense>
      ) : (
        <ChartSkeleton
          height={height}
          showTitle={!!title}
          title={title}
          className={className}
        />
      )}
    </div>
  );
};

// Performance utilities
export const chartPerformance = {
  // Preload charts for better UX on fast connections
  preloadCharts: (): void => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection?.effectiveType === '4g' && !connection?.saveData) {
        // Preload on fast connections only
        import('recharts');
      }
    }
  },

  // Get optimal loading strategy based on device capabilities
  getLoadingStrategy: (): 'immediate' | 'intersection' | 'defer' => {
    // Check device capabilities
    if ('deviceMemory' in navigator) {
      const memory = (navigator as any).deviceMemory;
      if (memory <= 2) return 'defer';
      if (memory >= 8) return 'immediate';
    }

    return 'intersection';
  },

  // Monitor chart loading performance
  trackChartLoad: (chartType: string, startTime: number): void => {
    const loadTime = performance.now() - startTime;
    console.log(
      `[Chart Performance] ${chartType} loaded in ${loadTime.toFixed(2)}ms`
    );

    // Send to analytics in production
    if (import.meta.env.PROD && 'sendBeacon' in navigator) {
      navigator.sendBeacon(
        '/api/performance/chart',
        JSON.stringify({
          chartType,
          loadTime,
          timestamp: Date.now(),
        })
      );
    }
  },
};

export default LazyChartWrapper;
