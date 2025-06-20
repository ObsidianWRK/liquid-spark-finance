/**
 * Utility functions for formatting values in the insights system
 */

import { usePrivacyStore } from "@/features/privacy-hide-amounts/store";
import { vueniTheme } from '@/theme/unified';

/**
 * Safe ratio calculation that handles division by zero
 * @param numerator - The numerator value
 * @param denominator - The denominator value (can be 0)
 * @returns Number ratio or null if denominator is 0
 */
export const safeRatio = (numerator: number, denominator: number | 0): number | null => {
  if (denominator === 0 || !isFinite(denominator) || !isFinite(numerator)) {
    return null;
  }
  
  const ratio = numerator / denominator;
  return isFinite(ratio) ? ratio : null;
};

/**
 * Format percentage with clamping to prevent extreme values
 * @param value - The percentage value to format (as decimal, e.g., 0.25 for 25%)
 * @param decimals - Number of decimal places (default: 1)
 * @param clampTo - Optional clamping range (default: ±999%)
 * @returns Formatted percentage string with % sign
 */
export const formatPercent = (
  value: number | null, 
  decimals: number = 1, 
  clampTo: number = 999
): string => {
  if (value === null || !isFinite(value)) {
    return '--';
  }
  
  // Convert to percentage and clamp to prevent extreme values
  const percentage = value * 100;
  const clampedPercentage = Math.max(Math.min(percentage, clampTo), -clampTo);
  
  return `${clampedPercentage.toFixed(decimals)}%`;
};

/**
 * Format score with configurable precision (0-2 decimal places)
 * @param value - The score value to format
 * @param precision - Number of decimal places (0, 1, or 2). Default is 0 for integer display
 * @param locale - Locale for formatting. Default is 'en-US'
 * @returns Formatted score string (e.g., "79", "79.4", "79.37")
 */
export const formatScore = (value: number, precision: 0 | 1 | 2 = 0, locale: string = 'en-US'): string => {
  // Clamp precision to valid range
  const validPrecision = Math.max(0, Math.min(2, precision)) as 0 | 1 | 2;
  
  // Round the value appropriately for the precision
  const roundedValue = validPrecision === 0 ? Math.round(value) : value;
  
  // Use Intl.NumberFormat for locale-safe formatting
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: validPrecision,
    maximumFractionDigits: validPrecision,
    useGrouping: false // No thousands separators for scores
  }).format(roundedValue);
};

/**
 * Format financial score specifically (always integer for consistency)
 * @param value - The financial score value to format
 * @returns Formatted integer score string
 */
export const formatFinancialScore = (value: number): string => {
  return formatScore(value, 0);
};

/**
 * Format percentage with consistent decimal places (legacy function - use formatPercent for new code)
 * @param value - The percentage value to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string with % sign
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format currency with proper locale and currency symbol
 * @param value - The currency value to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number, 
  options?: { 
    decimals?: number; 
    currency?: string;
    locale?: string;
  }
): string => {
  const { 
    decimals, 
    currency = 'USD', 
    locale = 'en-US' 
  } = options || {};
  
  // Round the value when decimals is explicitly set to 0
  const processedValue = decimals === 0 ? Math.round(value) : value;
  
  // Determine decimal places
  const shouldShowDecimals = decimals !== undefined ? decimals > 0 : processedValue % 1 !== 0;
  
  const hide = (usePrivacyStore as any)?.getState?.()?.setting?.hideAmounts;

  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: shouldShowDecimals ? (decimals ?? 2) : 0,
    maximumFractionDigits: shouldShowDecimals ? (decimals ?? 2) : 0,
  }).format(processedValue);

  if (hide) {
    return formatted.replace(/\d/g, '•');
  }

  return formatted;
};

/**
 * Format large numbers with appropriate suffixes (K, M, B)
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted number string with suffix
 */
export const formatLargeNumber = (value: number, decimals: number = 1): string => {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(decimals)}B`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(decimals)}M`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(decimals)}K`;
  }
  return value.toString();
};

/**
 * Format compact number for display (e.g., 1.2K, 3.4M)
 * @param value - The number to format
 * @returns Compact formatted string
 */
export const formatCompactNumber = (value: number): string => {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (absValue >= 1e9) {
    return `${sign}${(absValue / 1e9).toFixed(1)}B`;
  }
  if (absValue >= 1e6) {
    return `${sign}${(absValue / 1e6).toFixed(1)}M`;
  }
  if (absValue >= 1e3) {
    return `${sign}${(absValue / 1e3).toFixed(1)}K`;
  }
  return value.toFixed(0);
};

/**
 * Format decimal numbers with consistent decimal places
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted number string
 */
export const formatDecimal = (value: number, decimals: number = 1): string => {
  return value.toFixed(decimals);
};

/**
 * Calculate and format score grade based on value
 * @param score - Score value (0-100)
 * @returns Grade string
 */
export const getScoreGrade = (score: number): string => {
  if (score >= 90) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'A-';
  if (score >= 75) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 65) return 'B-';
  if (score >= 60) return 'C+';
  if (score >= 55) return 'C';
  if (score >= 50) return 'C-';
  if (score >= 40) return 'D';
  return 'F';
};

/**
 * Get color class based on score value
 * @param score - Score value (0-100)
 * @returns Tailwind CSS color class
 */
export const getScoreColorClass = (score: number): string => {
  if (score >= 80) return 'text-green-400';
  if (score >= 70) return 'text-blue-400';
  if (score >= 60) return 'text-yellow-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-red-400';
};

/**
 * Get background color for score visualization
 * @param score - Score value (0-100)
 * @returns Color hex string
 */
export const getScoreColor = (score: number): string => {
  if (score >= 80) return vueniTheme.colors.palette.success; // Green
  if (score >= 70) return vueniTheme.colors.palette.primary; // Blue  
  if (score >= 60) return vueniTheme.colors.palette.warning; // Yellow
  if (score >= 40) return vueniTheme.colors.palette.warning; // Orange (map to warning)
  return vueniTheme.colors.palette.danger; // Red
}; 