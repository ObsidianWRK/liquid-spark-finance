/**
 * Chart components barrel export
 * Apple-style financial chart components for Liquid Spark Finance
 */

// Main GraphBase component
export { default as GraphBase } from './GraphBase';

// Specialized chart components
export { default as LineChart } from './LineChart';
export { default as AreaChart } from './AreaChart';
export { default as StackedBarChart } from './StackedBarChart';
export { default as ScatterPlot } from './ScatterPlot';

// Time range components
export { default as TimeRangeToggle } from './TimeRangeToggle';
export { default as TimeRangeToggleRadix } from './TimeRangeToggleRadix';

// Type definitions
export type {
  GraphBaseProps,
  ChartType,
  TimeRangeOption,
  LoadingState,
  ChartDataPoint,
  ChartSeries,
  TimeControlConfig,
  ChartDimensions,
  AccessibilityConfig,
  ErrorConfig,
  AnimationConfig,
  LegendConfig,
  TooltipConfig,
  GridConfig,
  AxisConfig,
  TimeControlProps,
  ChartHeaderProps,
  ChartSkeletonProps,
  ChartErrorProps,
  ThemeColors,
  ChartThemeContext,
  ChartComponent,
  ChartRef,
} from './types';

// LineChart-specific types
export type { LineChartProps, LineChartConfig } from './LineChart';

// AreaChart-specific types
export type { AreaChartProps, AreaChartConfig } from './AreaChart';

// StackedBarChart-specific types
export type {
  StackedBarChartProps,
  StackedBarConfig,
  StackedBarDataPoint,
} from './StackedBarChart';

// TimeRangeToggle-specific types
export type {
  TimeRangeToggleProps,
  TimeRangeToggleRef,
} from './TimeRangeToggle';

export type {
  TimeRangeToggleRadixProps,
  TimeRangeToggleRadixRef,
} from './TimeRangeToggleRadix';

// Re-export commonly used types for convenience
export type { ChartConfig } from '@/shared/ui/chart';

// Utility constants
export const CHART_TYPES = ['line', 'area', 'bar', 'stackedBar', 'scatter'] as const;
export const TIME_RANGES = ['1W', '1M', '3M', '6M', '1Y', 'ALL'] as const;

// Default configurations
export const DEFAULT_CHART_CONFIG = {
  dimensions: {
    height: 300,
    responsive: true,
  },
  animation: {
    enable: true,
    duration: 800,
  },
  accessibility: {
    keyboardNavigation: true,
  },
  grid: {
    show: true,
    horizontal: true,
    vertical: false,
  },
  tooltip: {
    show: true,
  },
  legend: {
    show: false,
  },
} as const;

// Default time control configuration
export const DEFAULT_TIME_CONTROLS = {
  show: true,
  options: ['1W', '1M', '3M', '6M', '1Y', 'ALL'] as TimeRangeOption[],
  defaultRange: '1M' as TimeRangeOption,
  position: 'top' as const,
};

// Performance thresholds
export const PERFORMANCE_THRESHOLDS = {
  dataPoints: 1000,
  animationReduction: 500,
  virtualizationThreshold: 2000,
} as const;
