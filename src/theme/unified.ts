/**
 * Vueni Unified Theme System - Single Source of Truth
 *
 * This file replaces all scattered theme sources and provides a unified
 * dark-mode only design system with semantic color aliases and 3-level glass effects.
 *
 * Updated to import from vueniPalette.ts for consistent color management
 */

import {
  vueni,
  VueniSurfaces,
  VueniCharts,
  generateVueniCSSProperties,
} from './colors/vueniPalette';
import { fontSizes, lineHeights } from './typography';

// Typography system - single font family
const typographySystem = {
  fontFamily: {
    primary:
      '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
  },
  fontSize: fontSizes,
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: lineHeights,
} as const;

// Spacing system - 8px grid
const spacingSystem = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
} as const;

// Border radius system
const radiusSystem = {
  sm: '0.25rem', // 4px
  md: '0.5rem', // 8px
  lg: '0.75rem', // 12px - standard card radius
  xl: '1rem', // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px', // Pills/circles
} as const;

// ─── Corner-radius scale (Apple HIG) ───────────────────
export const radius = {
  sm: 4, // Small controls
  md: 6, // Medium controls
  lg: 8, // Large / primary
  pill: 9999, // Capsule (full pill)
  container: 16, // Cards, sheets
  island: 44, // Dynamic-Island-like surfaces
} as const;

// Animation system
const animationSystem = {
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '500ms',
  },
  easing: {
    standard: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    smooth: 'cubic-bezier(0.4, 0.0, 0.2, 1.0)',
  },
} as const;

// Z-index layers
const zIndexSystem = {
  background: -1,
  content: 1,
  navigation: 50,
  overlay: 40,
  modal: 100,
} as const;

// 3-level glass effect system using VueniSurfaces
const glassEffects = {
  subtle: {
    background: VueniSurfaces.glass.subtle,
    border: VueniSurfaces.glass.border,
    backdrop: 'backdrop-blur-sm',
  },
  default: {
    background: VueniSurfaces.glass.default,
    border: VueniSurfaces.glass.border,
    backdrop: 'backdrop-blur-md',
  },
  prominent: {
    background: VueniSurfaces.glass.prominent,
    border: VueniSurfaces.glass.border,
    backdrop: 'backdrop-blur-lg',
  },
} as const;

// Card component system using Vueni tokens
const cardSystem = {
  background: {
    default: 'bg-white/[0.02]', // Maps to VueniSurfaces.glass.subtle
    hover: 'hover:bg-white/[0.06]', // Maps to VueniSurfaces.glass.default
    active: 'bg-white/[0.12]', // Maps to VueniSurfaces.glass.prominent
  },
  border: {
    default: 'border border-white/[0.08]',
    hover: 'hover:border-white/[0.12]',
  },
  padding: {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  },
  radius: {
    sm: 'rounded-vueni-lg',
    md: 'rounded-vueni-lg',
    lg: 'rounded-vueni-container',
  },
  effects: {
    backdrop: 'backdrop-blur-md',
    transition: 'transition-all duration-300',
    hoverScale: 'hover:scale-[1.02]',
    shadow: 'shadow-lg hover:shadow-xl',
  },
} as const;

// Updated Chart & Graph System using VueniCharts 5-color sequence
const chartSystem = {
  // Vueni 5-color sequence as specified
  colors: {
    positive: vueni.semantic.success, // #4ABA70 - Accessible green
    negative: vueni.semantic.error, // #D64545 - Accessible red
    neutral: vueni.core.sapphireDust, // #516AC8 - Sapphire Dust
    warning: vueni.core.caramelEssence, // #E3AF64 - Caramel Essence

    // Extended palette from VueniCharts.primary sequence
    extended: {
      primary: VueniCharts.primary[0], // #516AC8 - Sapphire Dust
      secondary: VueniCharts.primary[1], // #E3AF64 - Caramel Essence
      tertiary: VueniCharts.primary[2], // #26428B - Blue Oblivion
      quaternary: VueniCharts.primary[3], // #4ABA70 - Success Green
      quinary: VueniCharts.primary[4], // #D64545 - Error Red
      senary: VueniCharts.primary[5], // #8B8478 - Neutral 500
    },
  },

  // Series color getter function
  getSeriesColor: (index: number): string => {
    return VueniCharts.primary[index % VueniCharts.primary.length];
  },

  // Apple Spacing System
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
  },

  // Apple Corner Radius System
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    tooltip: '8px',
    legendDot: '2px',
  },

  // Apple Animation System
  animation: {
    standard: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    ios: 'cubic-bezier(0.4, 0.0, 0.2, 1.0)',
    duration: {
      fast: '150ms',
      standard: '300ms',
      chartDrawing: '800ms',
    },
  },

  // Apple Typography System
  typography: {
    fontFamily:
      '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
    fontSize: {
      chartTitle: '20px',
      axisLabel: '12px',
      dataLabel: '12px',
      legend: '12px',
      tooltip: '12px',
    },
    fontWeight: {
      chartTitle: 600,
      axisLabel: 400,
      dataLabel: 500,
      legend: 400,
      tooltip: 500,
    },
  },
};

// Main unified theme export using VueniPalette as source
export const vueniTheme = {
  // Color system from VueniPalette
  colors: {
    palette: {
      primary: vueni.core.sapphireDust,
      success: vueni.semantic.success,
      danger: vueni.semantic.error,
      warning: vueni.core.caramelEssence,
      neutral: vueni.neutral.n500,
    },
    semantic: vueni.semantic,
    surface: VueniSurfaces,
    text: VueniSurfaces.dark.text,
    core: vueni.core,
    neutral: vueni.neutral,
  },

  // Layout systems
  typography: typographySystem,
  spacing: spacingSystem,
  radius: radiusSystem,

  // Effect systems
  glass: glassEffects,
  cards: cardSystem,
  animation: animationSystem,
  zIndex: zIndexSystem,
  charts: chartSystem,
} as const;

// Theme provider context value
export interface VueniThemeContextValue {
  theme: typeof vueniTheme;
  colorMode: 'dark'; // Only dark mode supported
}

// Utility functions for theme access
export const getColor = (path: string) => {
  const keys = path.split('.');
  let value: any = vueniTheme.colors;

  for (const key of keys) {
    value = value?.[key];
  }

  return value || '';
};

export const getSpacing = (size: keyof typeof spacingSystem) => {
  return vueniTheme.spacing[size];
};

export const getGlassEffect = (level: keyof typeof glassEffects) => {
  return vueniTheme.glass[level];
};

// Enhanced CSS custom properties generator using VueniPalette
export const generateCSSProperties = () => {
  const vueniProps = generateVueniCSSProperties();
  
  return {
    ...vueniProps,
    
    // Additional unified theme properties
    '--vueni-font-family': vueniTheme.typography.fontFamily.primary,
    '--vueni-spacing-xs': vueniTheme.spacing.xs,
    '--vueni-spacing-sm': vueniTheme.spacing.sm,
    '--vueni-spacing-md': vueniTheme.spacing.md,
    '--vueni-spacing-lg': vueniTheme.spacing.lg,
    '--vueni-spacing-xl': vueniTheme.spacing.xl,
    '--vueni-spacing-2xl': vueniTheme.spacing['2xl'],
    '--vueni-spacing-3xl': vueniTheme.spacing['3xl'],
    
    // Chart colors
    '--vueni-chart-primary': vueniTheme.charts.colors.extended.primary,
    '--vueni-chart-secondary': vueniTheme.charts.colors.extended.secondary,
    '--vueni-chart-tertiary': vueniTheme.charts.colors.extended.tertiary,
  };
};

// Type exports for TypeScript integration
export type VueniTheme = typeof vueniTheme;
export type GlassEffects = typeof glassEffects;
export type SpacingSystem = typeof spacingSystem;
export type TypographySystem = typeof typographySystem;

// Default export for convenience
export default vueniTheme;

/**
 * Migration Notes:
 *
 * This unified theme now imports from vueniPalette.ts as the single source of truth:
 * - All colors come from VueniCore, VueniSemantic, VueniSurfaces, VueniNeutral
 * - Chart colors use the proper 5-color sequence
 * - Glass effects use Sapphire Dust based opacity
 * - Maintains backward compatibility for existing imports
 * - CSS custom properties include all Vueni tokens
 */
