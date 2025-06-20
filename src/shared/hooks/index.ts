/**
 * Hooks barrel export
 * Custom React hooks for Liquid Spark Finance
 */

// Existing hooks
export { default as useMobile } from './use-mobile';
export { useToast } from './use-toast';
export { default as useFinancialMetrics } from './useFinancialMetrics';
export { default as useLiquidGlass } from './useLiquidGlass';
export { default as usePerformanceOptimization } from './usePerformanceOptimization';

// TimeRange hooks
export {
  useTimeRange,
  useTimeRangeFilter,
  useTimeRangeValidator,
  useOptimizedTimeRange,
} from './useTimeRange';

export type { UseTimeRangeOptions, UseTimeRangeReturn } from './useTimeRange';

// Download Hook
export { useDownload } from './useDownload';

// Viewport Management Hooks
export {
  useViewport,
  useSafeArea,
  useVirtualKeyboard,
  useOrientation,
  useViewportDimensions,
  useResponsiveBreakpoint,
  useViewportCSSProperties,
  useDeviceType,
} from './useViewport';

export type { ViewportState } from './useViewport';
