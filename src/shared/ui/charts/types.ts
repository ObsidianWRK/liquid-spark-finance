/**
 * TypeScript interfaces for the Apple-style GraphBase component system
 * Based on Apple Human Interface Guidelines 2025
 */

import { ComponentProps } from 'react';

// Core chart types supported by GraphBase
export type ChartType = 'line' | 'area' | 'bar' | 'stackedBar' | 'scatter';

// Time range options for financial charts
export type TimeRangeOption = '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL';

// Loading states for charts
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Chart data point interface - flexible for different chart types
export interface ChartDataPoint {
  [key: string]: any;
  // Common fields that most financial charts will have
  date?: string | Date;
  value?: number;
  label?: string;
}

// Configuration for chart series/lines
export interface ChartSeries {
  dataKey: string;
  label: string;
  color?: string;
  type?: ChartType;
  strokeWidth?: number;
  fillOpacity?: number;
  connectNulls?: boolean;
  hide?: boolean;
}

// Time control configuration
export interface TimeControlConfig {
  show: boolean;
  options: TimeRangeOption[];
  defaultRange: TimeRangeOption;
  position?: 'top' | 'bottom';
}

// Chart dimensions and responsive behavior
export interface ChartDimensions {
  height?: number;
  minHeight?: number;
  maxHeight?: number;
  aspectRatio?: number;
  responsive?: boolean;
}

// Accessibility configuration
export interface AccessibilityConfig {
  title?: string;
  description?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  keyboardNavigation?: boolean;
  highContrast?: boolean;
  reducedMotion?: boolean;
  // Enhanced accessibility features
  screenReaderSupport?: boolean;
  dataTableAlternative?: boolean;
  liveRegion?: boolean;
  voiceOverSupport?: boolean;
  touchTargetSize?: number;
}

// Error handling configuration
export interface ErrorConfig {
  showRetry?: boolean;
  retryText?: string;
  errorMessage?: string;
  onRetry?: () => void;
}

// Animation configuration
export interface AnimationConfig {
  enable?: boolean;
  duration?: number;
  easing?: string;
  delay?: number;
  staggerDelay?: number;
}

// Legend configuration
export interface LegendConfig {
  show?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  layout?: 'horizontal' | 'vertical';
  interactive?: boolean;
}

// Tooltip configuration
export interface TooltipConfig {
  show?: boolean;
  trigger?: 'hover' | 'click';
  position?: 'auto' | 'top' | 'bottom' | 'left' | 'right';
  formatter?: (value: any, name: string, props: any) => React.ReactNode;
  labelFormatter?: (label: string) => React.ReactNode;
  contentStyle?: React.CSSProperties;
}

// Grid configuration
export interface GridConfig {
  show?: boolean;
  horizontal?: boolean;
  vertical?: boolean;
  strokeDasharray?: string;
  strokeWidth?: number;
  opacity?: number;
}

// Axis configuration
export interface AxisConfig {
  show?: boolean;
  dataKey?: string;
  type?: 'category' | 'number';
  tickCount?: number;
  tickSize?: number;
  tickFormatter?: (value: any) => string;
  domain?: [number | string, number | string];
  type?: 'number' | 'category';
  scale?: 'auto' | 'linear' | 'log';
}

// Main GraphBase component props interface
export interface GraphBaseProps {
  // Core data and configuration
  data: ChartDataPoint[];
  type: ChartType;
  series?: ChartSeries[];

  // Header configuration
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;

  // Time controls
  timeRange?: TimeRangeOption;
  timeControls?: TimeControlConfig;
  onTimeRangeChange?: (range: TimeRangeOption) => void;
  useGlobalTimeRange?: boolean; // Use TimeRangeContext for global state

  // Dimensions and styling
  dimensions?: ChartDimensions;
  className?: string;
  style?: React.CSSProperties;

  // Chart-specific configurations
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
  grid?: GridConfig;
  legend?: LegendConfig;
  tooltip?: TooltipConfig;
  animation?: AnimationConfig;

  // State management
  loading?: boolean;
  loadingState?: LoadingState;
  error?: string | Error;
  errorConfig?: ErrorConfig;

  // Accessibility
  accessibility?: AccessibilityConfig;

  // Performance
  virtualization?: boolean;
  dataThreshold?: number;

  // Event handlers
  onDataPointClick?: (data: ChartDataPoint, index: number) => void;
  onDataPointHover?: (data: ChartDataPoint | null, index: number) => void;
  onChartReady?: () => void;
  onChartError?: (error: Error) => void;

  // Advanced configuration
  customTooltip?: React.ComponentType<any>;
  customLegend?: React.ComponentType<any>;
  children?: React.ReactNode;
}

// Props for the time control component
export interface TimeControlProps {
  currentRange: TimeRangeOption;
  options: TimeRangeOption[];
  onChange: (range: TimeRangeOption) => void;
  position?: 'top' | 'bottom';
  className?: string;
}

// Props for the chart header component
export interface ChartHeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

// Props for the loading skeleton component
export interface ChartSkeletonProps {
  type: ChartType;
  height?: number;
  showTitle?: boolean;
  showLegend?: boolean;
  className?: string;
}

// Props for the error state component
export interface ChartErrorProps {
  error: string | Error;
  onRetry?: () => void;
  showRetry?: boolean;
  retryText?: string;
  className?: string;
}

// Utility type for theme colors
export interface ThemeColors {
  primary: string;
  secondary: string;
  positive: string;
  negative: string;
  neutral: string;
  warning: string;
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  background: {
    primary: string;
    secondary: string;
  };
  border: string;
  grid: string;
}

// Context type for chart theme
export interface ChartThemeContext {
  colors: ThemeColors;
  darkMode: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
}

// Export utility types
export type ChartComponent = React.ComponentType<GraphBaseProps>;
export type ChartRef = HTMLDivElement;
