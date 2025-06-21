/**
 * Typography design tokens derived from the Vueni design specification.
 * Defines the core font size scale and line height scale used across
 * the application.
 */

export const fontSizes = {
  xs: '0.75rem', // 12px
  sm: '0.875rem', // 14px
  base: '1rem', // 16px
  lg: '1.125rem', // 18px
  xl: '1.25rem', // 20px
  '2xl': '1.5rem', // 24px
  '3xl': '2rem', // 32px
} as const;

export const lineHeights = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
} as const;

export type FontSize = keyof typeof fontSizes;
export type LineHeight = keyof typeof lineHeights;

const typography = {
  fontSizes,
  lineHeights,
} as const;

export default typography;
