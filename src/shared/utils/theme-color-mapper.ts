/**
 * Theme Color Mapper - Maps hardcoded chart colors to unified theme tokens
 * Part of Pass 3 theme cleanup - systematically replace hardcoded colors
 */

import { vueniTheme } from '@/theme/unified';

// UPDATED: Hardcoded color mappings to new Vueni palette
export const HARDCODED_COLOR_MAP = {
  // Chart color violations - most frequent (mapped to Vueni colors)
  '#3b82f6': '#516AC8', // Blue -> Sapphire Dust (Vueni primary)
  '#10b981': '#4ABA70', // Green -> Vueni success
  '#ef4444': '#D64545', // Red -> Vueni error
  '#f59e0b': '#E3AF64', // Orange -> Caramel Essence (Vueni warning)
  '#8b5cf6': '#26428B', // Purple -> Blue Oblivion (Vueni investments)

  // Secondary violations
  '#22c55e': '#4ABA70', // Green variant -> Vueni success
  '#dc2626': '#D64545', // Red variant -> Vueni error
  '#6366f1': '#516AC8', // Blue variant -> Sapphire Dust
  '#a855f7': '#26428B', // Purple variant -> Blue Oblivion

  // Legacy theme colors (direct replacements with Vueni)
  '#4A9EFF': '#516AC8', // Legacy blue -> Sapphire Dust
  '#4AFF88': '#4ABA70', // Legacy green -> Vueni success
  '#FF4A6A': '#D64545', // Legacy red -> Vueni error
  '#FFD700': '#E3AF64', // Legacy gold -> Caramel Essence
  '#A0A0B8': '#8B8478', // Legacy gray -> Vueni neutral

  // Apple System Colors (mapped to Vueni equivalents)
  '#007AFF': '#516AC8', // Apple blue -> Sapphire Dust
  '#32D74B': '#4ABA70', // Apple green -> Vueni success
  '#FF453A': '#D64545', // Apple red -> Vueni error
  '#FF9F0A': '#E3AF64', // Apple orange -> Caramel Essence
  '#AF52DE': '#26428B', // Apple purple -> Blue Oblivion
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
