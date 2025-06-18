/**
 * Utility functions for formatting values in the insights system
 */

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
  
  // Use Intl.NumberFormat for locale-safe formatting
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: validPrecision,
    maximumFractionDigits: validPrecision,
    useGrouping: false // No thousands separators for scores
  }).format(value);
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
 * Format percentage with consistent decimal places
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
  
  // Determine decimal places
  const shouldShowDecimals = decimals !== undefined ? decimals > 0 : value % 1 !== 0;
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: shouldShowDecimals ? (decimals ?? 2) : 0,
    maximumFractionDigits: shouldShowDecimals ? (decimals ?? 2) : 0,
  }).format(value);
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
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(1)}B`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(1)}M`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(1)}K`;
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
  if (score >= 80) return '#10B981'; // Green
  if (score >= 70) return '#3B82F6'; // Blue
  if (score >= 60) return '#F59E0B'; // Yellow
  if (score >= 40) return '#F97316'; // Orange
  return '#EF4444'; // Red
}; 