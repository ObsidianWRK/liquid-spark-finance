/**
 * Vueni Color System - Single Source of Truth
 * 
 * This palette replaces all existing color systems and provides the new
 * Vueni brand identity colors with semantic mapping for financial applications.
 * 
 * Colors extracted from Vueni brand specification:
 * - Rapture's Light: #F6F3E7 (Light cream)
 * - Milk Tooth: #FAEBD7 (Light beige)
 * - Caramel Essence: #E3AF64 (Warm amber)
 * - Sapphire Dust: #516AC8 (Deep blue)
 * - Blue Oblivion: #26428B (Navy blue)
 * - Cosmic Odyssey: #0F1939 (Dark navy)
 */

// Core Vueni Brand Colors
export const VueniCore = {
  primary: {
    sapphireDust: '#516AC8',      // Primary action color
    cosmicOdyssey: '#0F1939',     // Primary dark background
  },
  secondary: {
    caramelEssence: '#E3AF64',    // Secondary accent/warning
    blueOblivion: '#26428B',      // Secondary blue variant
  },
  background: {
    rapturesLight: '#F6F3E7',     // Light mode background
    milkTooth: '#FAEBD7',         // Light mode secondary
  },
} as const;

// Semantic Color Assignments for Financial App
export const VueniSemantic = {
  // Primary system colors
  primary: VueniCore.primary.sapphireDust,
  secondary: VueniCore.secondary.blueOblivion,
  accent: VueniCore.secondary.caramelEssence,
  
  // Status colors (keeping good accessibility)
  success: '#4ABA70',            // Accessible green
  error: '#D64545',              // Accessible red  
  warning: VueniCore.secondary.caramelEssence,
  info: VueniCore.primary.sapphireDust,
  
  // Financial semantic colors
  financial: {
    positive: '#4ABA70',          // Income/gains
    negative: '#D64545',          // Expenses/losses
    neutral: VueniCore.primary.sapphireDust,
    growth: VueniCore.secondary.caramelEssence,
  },
} as const;

// Neutral Scale (grayscale with Vueni undertones)
export const VueniNeutral = {
  100: '#F9F8F6',               // Lightest - near white
  200: '#F1EFE8',               // Very light
  300: '#E2DED4',               // Light
  400: '#C7BFB0',               // Light medium
  500: '#8B8478',               // Medium
  600: '#6B604F',               // Medium dark
  700: '#4A453E',               // Dark
  800: '#2D2A25',               // Very dark
  900: '#1C1A17',               // Darkest - near black
} as const;

// Dark Mode Surface System (primary for Vueni)
export const VueniSurfaces = {
  background: {
    primary: VueniCore.primary.cosmicOdyssey,      // #0F1939
    secondary: '#1A2547',                          // Lighter variant
    tertiary: '#253655',                           // Card backgrounds
  },
  
  // Glass morphism effects with Vueni undertones
  glass: {
    subtle: 'rgba(81, 106, 200, 0.03)',          // Sapphire dust at 3%
    default: 'rgba(81, 106, 200, 0.06)',         // Sapphire dust at 6%
    prominent: 'rgba(81, 106, 200, 0.12)',       // Sapphire dust at 12%
    border: 'rgba(81, 106, 200, 0.08)',          // Sapphire dust at 8%
  },
  
  // Text hierarchy
  text: {
    primary: '#FFFFFF',                           // High contrast
    secondary: 'rgba(255, 255, 255, 0.8)',       // Medium contrast
    tertiary: 'rgba(255, 255, 255, 0.6)',        // Low contrast
    muted: 'rgba(255, 255, 255, 0.4)',           // Very low contrast
  },
} as const;

// Chart Color Palette (data visualization)
export const VueniCharts = {
  // Primary sequence for multi-series charts
  primary: [
    VueniCore.primary.sapphireDust,    // #516AC8
    VueniCore.secondary.caramelEssence, // #E3AF64
    VueniCore.secondary.blueOblivion,   // #26428B
    VueniSemantic.success,              // #4ABA70
    VueniSemantic.error,                // #D64545
    VueniNeutral[500],                  // #8B8478
  ],
  
  // Financial-specific mappings
  financial: {
    income: VueniSemantic.success,                // Green for income
    expenses: VueniSemantic.error,                // Red for expenses  
    savings: VueniCore.primary.sapphireDust,      // Blue for savings
    investments: VueniCore.secondary.blueOblivion, // Navy for investments
    debt: VueniSemantic.warning,                  // Amber for debt
  },
  
  // Trend indicators
  trends: {
    positive: VueniSemantic.financial.positive,
    negative: VueniSemantic.financial.negative,
    neutral: VueniNeutral[500],
  },
} as const;

// CSS Custom Properties Generator
export const generateVueniCSSProperties = () => {
  return {
    // Core colors
    '--vueni-primary': VueniCore.primary.sapphireDust,
    '--vueni-primary-dark': VueniCore.primary.cosmicOdyssey,
    '--vueni-secondary': VueniCore.secondary.caramelEssence,
    '--vueni-secondary-dark': VueniCore.secondary.blueOblivion,
    '--vueni-background-light': VueniCore.background.rapturesLight,
    '--vueni-background-secondary': VueniCore.background.milkTooth,
    
    // Semantic colors
    '--vueni-success': VueniSemantic.success,
    '--vueni-error': VueniSemantic.error,
    '--vueni-warning': VueniSemantic.warning,
    '--vueni-info': VueniSemantic.info,
    
    // Surfaces
    '--vueni-surface-primary': VueniSurfaces.background.primary,
    '--vueni-surface-secondary': VueniSurfaces.background.secondary,
    '--vueni-surface-tertiary': VueniSurfaces.background.tertiary,
    
    // Glass effects
    '--vueni-glass-subtle': VueniSurfaces.glass.subtle,
    '--vueni-glass-default': VueniSurfaces.glass.default,
    '--vueni-glass-prominent': VueniSurfaces.glass.prominent,
    '--vueni-glass-border': VueniSurfaces.glass.border,
    
    // Text
    '--vueni-text-primary': VueniSurfaces.text.primary,
    '--vueni-text-secondary': VueniSurfaces.text.secondary,
    '--vueni-text-tertiary': VueniSurfaces.text.tertiary,
    '--vueni-text-muted': VueniSurfaces.text.muted,
    
    // Neutral scale
    '--vueni-neutral-100': VueniNeutral[100],
    '--vueni-neutral-300': VueniNeutral[300],
    '--vueni-neutral-500': VueniNeutral[500],
    '--vueni-neutral-700': VueniNeutral[700],
    '--vueni-neutral-900': VueniNeutral[900],
  };
};

// SCSS Variables Generator (for legacy support)
export const generateVueniSCSSVariables = () => {
  const cssProps = generateVueniCSSProperties();
  const scssVars = Object.entries(cssProps)
    .map(([key, value]) => `$${key.replace('--vueni-', '')}: ${value};`)
    .join('\n');
    
  return `// Vueni SCSS Variables\n// Auto-generated from vueniPalette.ts\n\n${scssVars}`;
};

// Accessibility helpers
export const getContrastColor = (backgroundColor: string): string => {
  // Simple contrast helper - returns white or dark based on background
  const darkBackgrounds: string[] = [
    VueniCore.primary.cosmicOdyssey,
    VueniCore.secondary.blueOblivion,
    VueniSurfaces.background.primary,
    VueniSurfaces.background.secondary,
  ];
  
  return darkBackgrounds.includes(backgroundColor) 
    ? VueniSurfaces.text.primary 
    : VueniNeutral[900];
};

// Theme object for easy consumption
export const vueniColorTheme = {
  core: VueniCore,
  semantic: VueniSemantic,
  neutral: VueniNeutral,
  surfaces: VueniSurfaces,
  charts: VueniCharts,
  css: generateVueniCSSProperties(),
  scss: generateVueniSCSSVariables(),
  getContrastColor,
} as const;

// Type exports
export type VueniCoreColors = typeof VueniCore;
export type VueniSemanticColors = typeof VueniSemantic;
export type VueniNeutralColors = typeof VueniNeutral;
export type VueniSurfaceColors = typeof VueniSurfaces;
export type VueniChartColors = typeof VueniCharts;

// Default export
export default vueniColorTheme; 