/**
 * Apple HIG-compliant design tokens for charts and graphs
 *
 * Updated to use Vueni 5-color sequence from unified theme system
 * 1. #516AC8 (Sapphire Dust)
 * 2. #E3AF64 (Caramel Essence)  
 * 3. #26428B (Blue Oblivion)
 * 4. #4ABA70 (Success Green)
 * 5. #8B8478 (Neutral 500)
 */

import { vueniTheme } from './unified';
import { VueniCharts } from './colors/vueniPalette';

// Re-export chart system from unified theme
export const appleGraphTokens = vueniTheme.charts;

// Individual exports for backward compatibility
export const {
  colors: appleChartColors,
  spacing: appleChartSpacing,
  borderRadius: appleChartRadius,
  animation: appleChartAnimation,
  typography: appleChartTypography,
} = vueniTheme.charts;

// Animation presets for charts
export const chartAnimationPreset = {
  standard: vueniTheme.charts.animation.standard,
  ios: vueniTheme.charts.animation.ios,
};

// Animation durations
export const {
  fast: fastAnimationDuration,
  standard: standardAnimationDuration,
  chartDrawing: optimalAnimationDuration,
} = vueniTheme.charts.animation.duration;

// Utility functions for enhanced chart color management

/**
 * Get series color by index using Vueni 5-color sequence
 */
export const getSeriesColor = (index: number): string => {
  return VueniCharts.primary[index % VueniCharts.primary.length];
};

/**
 * Get multiple series colors for multi-series charts
 */
export const getSeriesColors = (count: number): string[] => {
  return Array.from({ length: count }, (_, i) => getSeriesColor(i));
};

/**
 * Get a graph color based on type and theme (updated with Vueni colors)
 */
export const getGraphColor = (
  type:
    | 'income'
    | 'spending'
    | 'savings'
    | 'investments'
    | 'debt'
    | 'positive'
    | 'negative'
    | 'neutral'
    | 'warning',
  theme: 'light' | 'dark' = 'dark'
): string => {
  const chartColors = vueniTheme.charts.colors;

  switch (type) {
    case 'income':
    case 'positive':
      return chartColors.positive; // #4ABA70
    case 'spending':
    case 'negative':
      return chartColors.negative; // #D64545
    case 'savings':
    case 'neutral':
      return chartColors.neutral; // #516AC8
    case 'investments':
      return chartColors.extended.tertiary; // #26428B - Blue Oblivion
    case 'debt':
    case 'warning':
      return chartColors.warning; // #E3AF64
    default:
      return chartColors.neutral; // #516AC8
  }
};

/**
 * Get chart color by semantic meaning
 */
export const getChartColorSemantic = (
  semantic: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary' | 'senary'
): string => {
  return vueniTheme.charts.colors.extended[semantic];
};

/**
 * Get text color based on context
 */
export const getTextColor = (
  variant: 'primary' | 'secondary' | 'muted' = 'primary'
): string => {
  const textColors = vueniTheme.colors.text;
  return textColors[variant];
};

/**
 * Get chart animation preset
 */
export const getChartAnimationPreset = (
  type: 'standard' | 'ios' | 'line' | 'hover' = 'standard'
) => {
  const animation = vueniTheme.charts.animation;

  const presets = {
    standard: {
      duration: parseInt(animation.duration.standard),
      easing: animation.standard,
      delay: 0,
    },
    ios: {
      duration: parseInt(animation.duration.standard),
      easing: animation.ios,
      delay: 0,
    },
    line: {
      duration: parseInt(animation.duration.chartDrawing),
      easing: animation.standard,
      delay: 100,
    },
    hover: {
      duration: parseInt(animation.duration.fast),
      easing: animation.ios,
      delay: 0,
    },
  };

  return presets[type] || presets.standard;
};

/**
 * Check if reduced motion is preferred
 */
export const shouldReduceMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get optimal animation duration based on user preferences
 */
export const getOptimalAnimationDuration = (baseMs: number = 300): number => {
  return shouldReduceMotion() ? 0 : baseMs;
};

/**
 * Get background color for chart elements
 */
export const getBackgroundColor = (
  variant: 'primary' | 'secondary' | 'surface' = 'surface'
): string => {
  const surface = vueniTheme.colors.surface;

  switch (variant) {
    case 'primary':
      return surface.dark.secondary; // #1A2547
    case 'secondary':
      return surface.dark.card; // #253655
    case 'surface':
    default:
      return surface.dark.background; // #0F1939
  }
};

/**
 * Generate CSS custom properties for charts using Vueni tokens
 */
export const generateGraphCSSProperties = (
  theme: 'light' | 'dark' = 'dark'
): Record<string, string> => {
  const chartTokens = vueniTheme.charts;
  const colors = vueniTheme.colors;

  return {
    // Vueni 5-color sequence
    '--chart-color-series-0': getSeriesColor(0), // #516AC8 - Sapphire Dust
    '--chart-color-series-1': getSeriesColor(1), // #E3AF64 - Caramel Essence
    '--chart-color-series-2': getSeriesColor(2), // #26428B - Blue Oblivion
    '--chart-color-series-3': getSeriesColor(3), // #4ABA70 - Success Green
    '--chart-color-series-4': getSeriesColor(4), // #D64545 - Error Red
    '--chart-color-series-5': getSeriesColor(5), // #8B8478 - Neutral 500

    // Semantic chart colors
    '--chart-color-positive': chartTokens.colors.positive,
    '--chart-color-negative': chartTokens.colors.negative,
    '--chart-color-neutral': chartTokens.colors.neutral,
    '--chart-color-warning': chartTokens.colors.warning,

    // Extended colors
    '--chart-color-primary': chartTokens.colors.extended.primary,
    '--chart-color-secondary': chartTokens.colors.extended.secondary,
    '--chart-color-tertiary': chartTokens.colors.extended.tertiary,
    '--chart-color-quaternary': chartTokens.colors.extended.quaternary,
    '--chart-color-quinary': chartTokens.colors.extended.quinary,
    '--chart-color-senary': chartTokens.colors.extended.senary,

    // Background colors
    '--chart-background': colors.surface.dark.background,
    '--chart-card-background': colors.surface.dark.secondary,
    '--chart-overlay-background': colors.surface.dark.card,

    // Text colors
    '--chart-text-primary': colors.text.primary,
    '--chart-text-secondary': colors.text.secondary,
    '--chart-text-muted': colors.text.muted,

    // Animation
    '--chart-animation-standard': chartTokens.animation.standard,
    '--chart-animation-ios': chartTokens.animation.ios,
    '--chart-animation-duration-fast': chartTokens.animation.duration.fast,
    '--chart-animation-duration-standard':
      chartTokens.animation.duration.standard,
    '--chart-animation-duration-chart-drawing':
      chartTokens.animation.duration.chartDrawing,

    // Spacing
    '--chart-spacing-xs': chartTokens.spacing.xs,
    '--chart-spacing-sm': chartTokens.spacing.sm,
    '--chart-spacing-md': chartTokens.spacing.md,
    '--chart-spacing-lg': chartTokens.spacing.lg,
    '--chart-spacing-xl': chartTokens.spacing.xl,
    '--chart-spacing-xxl': chartTokens.spacing.xxl,

    // Border radius
    '--chart-border-radius-sm': chartTokens.borderRadius.sm,
    '--chart-border-radius-md': chartTokens.borderRadius.md,
    '--chart-border-radius-lg': chartTokens.borderRadius.lg,
    '--chart-border-radius-tooltip': chartTokens.borderRadius.tooltip,

    // Typography
    '--chart-font-family': chartTokens.typography.fontFamily,
    '--chart-font-size-title': chartTokens.typography.fontSize.chartTitle,
    '--chart-font-size-axis-label': chartTokens.typography.fontSize.axisLabel,
    '--chart-font-size-data-label': chartTokens.typography.fontSize.dataLabel,
    '--chart-font-size-legend': chartTokens.typography.fontSize.legend,
    '--chart-font-size-tooltip': chartTokens.typography.fontSize.tooltip,
    '--chart-font-weight-title':
      chartTokens.typography.fontWeight.chartTitle.toString(),
    '--chart-font-weight-axis-label':
      chartTokens.typography.fontWeight.axisLabel.toString(),
    '--chart-font-weight-data-label':
      chartTokens.typography.fontWeight.dataLabel.toString(),
    '--chart-font-weight-legend':
      chartTokens.typography.fontWeight.legend.toString(),
    '--chart-font-weight-tooltip':
      chartTokens.typography.fontWeight.tooltip.toString(),
  };
};

// Default export
export default appleGraphTokens;

/**
 * Vueni Chart Migration Notes:
 * 
 * Updated to use the official Vueni 5-color sequence:
 * 1. #516AC8 (Sapphire Dust) - Primary brand color
 * 2. #E3AF64 (Caramel Essence) - Secondary accent
 * 3. #26428B (Blue Oblivion) - Secondary blue
 * 4. #4ABA70 (Success Green) - Positive values
 * 5. #8B8478 (Neutral 500) - Neutral values
 * 
 * New helper functions:
 * - getSeriesColor(index) - Get color by series index
 * - getSeriesColors(count) - Get array of colors for multi-series
 * - getChartColorSemantic() - Get color by semantic meaning
 */
