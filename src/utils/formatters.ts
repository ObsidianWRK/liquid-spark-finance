/**
 * Utility functions for formatting values in the insights system
 */

/**
 * Format percentage with consistent decimal places
 * @param value - The percentage value to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return (Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(decimals);
};

/**
 * Format currency with proper locale and currency symbol
 * @param value - The currency value to format
 * @param currency - Currency code (default: 'USD')
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number, 
  currency: string = 'USD', 
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: value >= 1000 ? 0 : 2,
    maximumFractionDigits: value >= 1000 ? 0 : 2,
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
    return `${formatPercentage(value / 1e9, decimals)}B`;
  }
  if (value >= 1e6) {
    return `${formatPercentage(value / 1e6, decimals)}M`;
  }
  if (value >= 1e3) {
    return `${formatPercentage(value / 1e3, decimals)}K`;
  }
  return value.toString();
};

/**
 * Format decimal numbers with consistent decimal places
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted number string
 */
export const formatDecimal = (value: number, decimals: number = 1): string => {
  return (Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(decimals);
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