/**
 * Theme Color Mapper - Maps hardcoded chart colors to unified theme tokens
 * Part of Pass 3 theme cleanup - systematically replace hardcoded colors
 */

import { vueniTheme } from '@/theme/unified';

// Common hardcoded colors and their unified theme replacements
export const HARDCODED_COLOR_MAP = {
  // Chart color violations - most frequent
  '#3b82f6': vueniTheme.colors.palette.primary, // Blue -> Primary
  '#10b981': vueniTheme.colors.palette.success, // Green -> Success
  '#ef4444': vueniTheme.colors.palette.danger, // Red -> Danger
  '#f59e0b': vueniTheme.colors.palette.warning, // Orange -> Warning
  '#8b5cf6': vueniTheme.colors.semantic.chart.investments, // Purple -> Investments

  // Secondary violations
  '#22c55e': vueniTheme.colors.palette.success, // Green variant -> Success
  '#dc2626': vueniTheme.colors.palette.danger, // Red variant -> Danger
  '#6366f1': vueniTheme.colors.palette.primary, // Blue variant -> Primary
  '#a855f7': vueniTheme.colors.semantic.chart.investments, // Purple variant -> Investments

  // Legacy theme colors (exact matches from colors.ts)
  '#4A9EFF': vueniTheme.colors.palette.primary, // Legacy blue -> Primary
  '#4AFF88': vueniTheme.colors.palette.success, // Legacy green -> Success
  '#FF4A6A': vueniTheme.colors.palette.danger, // Legacy red -> Danger
  '#FFD700': vueniTheme.colors.palette.warning, // Legacy gold -> Warning
  '#A0A0B8': vueniTheme.colors.palette.neutral, // Legacy gray -> Neutral

  // Apple System Colors (for chart consistency)
  '#007AFF': vueniTheme.colors.palette.primary, // Apple blue -> Primary
  '#32D74B': vueniTheme.colors.palette.success, // Apple green -> Success
  '#FF453A': vueniTheme.colors.palette.danger, // Apple red -> Danger
  '#FF9F0A': vueniTheme.colors.palette.warning, // Apple orange -> Warning
  '#AF52DE': vueniTheme.colors.semantic.chart.investments, // Apple purple -> Investments
} as const;

// Utility function to replace hardcoded color with theme token
export const mapColorToTheme = (hardcodedColor: string): string => {
  const upperColor = hardcodedColor.toUpperCase();
  const mappedColor =
    HARDCODED_COLOR_MAP[hardcodedColor as keyof typeof HARDCODED_COLOR_MAP];

  if (mappedColor) {
    console.warn(
      `[Theme Cleanup] Replaced hardcoded color ${hardcodedColor} with theme token`
    );
    return mappedColor;
  }

  // Return original if no mapping found (might be intentional brand colors)
  return hardcodedColor;
};

// Chart-specific color mapping for financial data
export const getFinancialChartColor = (
  category:
    | 'income'
    | 'spending'
    | 'savings'
    | 'investments'
    | 'debt'
    | 'neutral'
): string => {
  const colorMap = {
    income: vueniTheme.colors.semantic.chart.income,
    spending: vueniTheme.colors.semantic.chart.spending,
    savings: vueniTheme.colors.semantic.chart.savings,
    investments: vueniTheme.colors.semantic.chart.investments,
    debt: vueniTheme.colors.semantic.chart.debt,
    neutral: vueniTheme.colors.palette.neutral,
  };

  return colorMap[category];
};

// Status color mapping for UI components
export const getStatusColor = (
  status: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
): string => {
  const statusMap = {
    success: vueniTheme.colors.semantic.status.success,
    warning: vueniTheme.colors.semantic.status.warning,
    danger: vueniTheme.colors.semantic.status.error,
    info: vueniTheme.colors.semantic.status.info,
    neutral: vueniTheme.colors.palette.neutral,
  };

  return statusMap[status];
};

// Score-based color mapping (common in financial apps)
export const getScoreColor = (score: number): string => {
  if (score >= 80) return vueniTheme.colors.palette.success; // Excellent
  if (score >= 70) return vueniTheme.colors.palette.primary; // Good
  if (score >= 60) return vueniTheme.colors.palette.warning; // Fair
  return vueniTheme.colors.palette.danger; // Poor
};

// Trend-based color mapping
export const getTrendColor = (
  trend: 'up' | 'down' | 'stable' | 'neutral'
): string => {
  const trendMap = {
    up: vueniTheme.colors.semantic.financial.positive,
    down: vueniTheme.colors.semantic.financial.negative,
    stable: vueniTheme.colors.semantic.financial.neutral,
    neutral: vueniTheme.colors.palette.neutral,
  };

  return trendMap[trend];
};

// Export a comprehensive replacement function for bulk operations
export const replaceHardcodedColors = (content: string): string => {
  let updatedContent = content;

  // Replace each hardcoded color with theme token access
  Object.entries(HARDCODED_COLOR_MAP).forEach(([hardcoded, themeToken]) => {
    // Replace hex colors in quotes
    updatedContent = updatedContent.replace(
      new RegExp(`['"]${hardcoded}['"]`, 'gi'),
      `vueniTheme.colors.palette.primary /* replaced ${hardcoded} */`
    );

    // Replace hex colors without quotes (in object literals)
    updatedContent = updatedContent.replace(
      new RegExp(`:\\s*${hardcoded}`, 'gi'),
      `: ${themeToken} /* replaced ${hardcoded} */`
    );
  });

  return updatedContent;
};

export default {
  mapColorToTheme,
  getFinancialChartColor,
  getStatusColor,
  getScoreColor,
  getTrendColor,
  replaceHardcodedColors,
  HARDCODED_COLOR_MAP,
};
