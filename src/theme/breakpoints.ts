/**
 * Unified Vueni Breakpoint System
 * Replaces magic number breakpoints throughout the codebase
 * Provides consistent viewport definitions across components
 */

// Breakpoint definitions aligned with Tailwind defaults but extended for ultra-wide
export const breakpoints = {
  mobile: {
    max: 767,
    description: 'Mobile devices (phones)',
    mediaQuery: '(max-width: 767px)',
    tailwind: 'max-md:',
  },
  tablet: {
    min: 768,
    max: 1023,
    description: 'Tablet devices',
    mediaQuery: '(min-width: 768px) and (max-width: 1023px)',
    tailwind: 'md:',
  },
  desktop: {
    min: 1024,
    max: 1439,
    description: 'Desktop screens',
    mediaQuery: '(min-width: 1024px) and (max-width: 1439px)',
    tailwind: 'lg:',
  },
  large: {
    min: 1440,
    max: 1919,
    description: 'Large desktop screens',
    mediaQuery: '(min-width: 1440px) and (max-width: 1919px)',
    tailwind: 'xl:',
  },
  ultrawide: {
    min: 1920,
    description: 'Ultra-wide screens (gaming monitors, etc)',
    mediaQuery: '(min-width: 1920px)',
    tailwind: '2xl:',
  },
} as const;

// CSS Custom Properties for direct CSS usage
export const cssBreakpoints = {
  '--mobile-max': '767px',
  '--tablet-min': '768px',
  '--tablet-max': '1023px',
  '--desktop-min': '1024px',
  '--desktop-max': '1439px',
  '--large-min': '1440px',
  '--large-max': '1919px',
  '--ultrawide-min': '1920px',
} as const;

// Responsive navigation heights (mobile-first)
export const navigationHeights = {
  mobile: '4rem', // 64px
  tablet: '5rem', // 80px
  desktop: '6rem', // 96px
  large: '7rem', // 112px
  ultrawide: '8rem', // 128px
} as const;

// Touch target sizes for accessibility (WCAG 2.5.5)
export const touchTargets = {
  minimum: 44, // WCAG minimum
  comfortable: 48, // Recommended
  large: 56, // iOS recommended
} as const;

// Grid column configurations for responsive layouts
export const gridConfigs = {
  minimal: {
    mobile: 'grid-cols-1',
    tablet: 'md:grid-cols-2',
    desktop: 'lg:grid-cols-3',
    large: 'xl:grid-cols-4',
    ultrawide: '2xl:grid-cols-5',
  },
  standard: {
    mobile: 'grid-cols-1',
    tablet: 'md:grid-cols-2',
    desktop: 'lg:grid-cols-3',
    large: 'xl:grid-cols-4',
    ultrawide: '2xl:grid-cols-6',
  },
  dense: {
    mobile: 'grid-cols-2',
    tablet: 'md:grid-cols-3',
    desktop: 'lg:grid-cols-4',
    large: 'xl:grid-cols-5',
    ultrawide: '2xl:grid-cols-6',
  },
} as const;

// Performance optimization: prefers-reduced-motion media query
export const reduceMotion = '(prefers-reduced-motion: reduce)';

// High contrast media query
export const highContrast = '(prefers-contrast: high)';

// Dark mode detection
export const darkMode = '(prefers-color-scheme: dark)';

// Type exports for TypeScript
export type Breakpoint = keyof typeof breakpoints;
export type NavigationHeight = keyof typeof navigationHeights;
export type GridConfig = keyof typeof gridConfigs;

// Utility functions
export const getBreakpoint = (width: number): Breakpoint => {
  if (width >= breakpoints.ultrawide.min) return 'ultrawide';
  if (width >= breakpoints.large.min) return 'large';
  if (width >= breakpoints.desktop.min) return 'desktop';
  if (width >= breakpoints.tablet.min) return 'tablet';
  return 'mobile';
};

export const isMobile = (width: number): boolean =>
  width <= breakpoints.mobile.max;
export const isTablet = (width: number): boolean =>
  width >= breakpoints.tablet.min && width <= breakpoints.tablet.max;
export const isDesktop = (width: number): boolean =>
  width >= breakpoints.desktop.min;

// Default export
export default breakpoints;
