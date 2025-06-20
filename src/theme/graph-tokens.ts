/**
 * Apple HIG-compliant design tokens for charts and graphs
 *
 * TEMPORARY FILE: Re-exports chart system from unified.ts
 * This file exists to maintain backward compatibility with existing chart imports
 * while the unified theme system is being rolled out.
 */

import { vueniTheme } from './unified';

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

// Utility functions for backward compatibility

/**
 * Get a graph color based on type and theme
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
      return chartColors.positive;
    case 'spending':
    case 'negative':
      return chartColors.negative;
    case 'savings':
    case 'neutral':
      return chartColors.neutral;
    case 'investments':
      return chartColors.extended.purple;
    case 'debt':
    case 'warning':
      return chartColors.warning;
    default:
      return chartColors.neutral;
  }
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
      return surface.card;
    case 'secondary':
      return surface.overlay;
    case 'surface':
    default:
      return surface.background;
  }
};

/**
 * Generate CSS custom properties for charts
 */
export const generateGraphCSSProperties = (
  theme: 'light' | 'dark' = 'dark'
): Record<string, string> => {
  const chartTokens = vueniTheme.charts;
  const colors = vueniTheme.colors;

  return {
    // Chart colors
    '--chart-color-positive': chartTokens.colors.positive,
    '--chart-color-negative': chartTokens.colors.negative,
    '--chart-color-neutral': chartTokens.colors.neutral,
    '--chart-color-warning': chartTokens.colors.warning,

    // Extended colors
    '--chart-color-teal': chartTokens.colors.extended.teal,
    '--chart-color-mint': chartTokens.colors.extended.mint,
    '--chart-color-pink': chartTokens.colors.extended.pink,
    '--chart-color-yellow': chartTokens.colors.extended.yellow,
    '--chart-color-purple': chartTokens.colors.extended.purple,

    // Background colors
    '--chart-background': colors.surface.background,
    '--chart-card-background': colors.surface.card,
    '--chart-overlay-background': colors.surface.overlay,

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
 * TODO: Once all chart components are migrated to use unified theme directly,
 * this file can be removed and imports updated to:
 * import { vueniTheme } from '@/theme/unified';
 * const chartTokens = vueniTheme.charts;
 */
