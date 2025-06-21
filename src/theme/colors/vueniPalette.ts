/**
 * Vueni Color System - Single Source of Truth
 * 
 * This palette replaces all existing color systems and provides the new
 * Vueni brand identity colors with semantic mapping for financial applications.
 * 
 * Colors from Vueni brand specification:
 * - Rapture's Light: #F6F3E7 (contrast ref 18.9 : 1)
 * - Cosmic Odyssey: #0F1939 (contrast ref 17.2 : 1)
 * - Milk Tooth: #FAEBD7 (contrast ref 17.9 : 1)
 * - Caramel Essence: #E3AF64 (contrast ref 10.6 : 1)
 * - Sapphire Dust: #516AC8 (contrast ref 4.95 : 1)
 * - Blue Oblivion: #26428B (contrast ref 9.4 : 1)
 */

// Core Vueni Brand Colors
export const vueni = {
  core: {
    rapturesLight: '#F6F3E7',     // Light mode background
    cosmicOdyssey: '#0F1939',     // Dark mode background
    milkTooth: '#FAEBD7',         // Light mode secondary
    caramelEssence: '#E3AF64',    // Accent/warning color
    sapphireDust: '#516AC8',      // Primary action color
    blueOblivion: '#26428B',      // Secondary blue variant
  },
  semantic: {
    success: '#4ABA70',           // Accessible green
    error: '#D64545',             // Accessible red
    warning: '#E3AF64',           // Caramel Essence
    info: '#516AC8',              // Sapphire Dust
  },
  neutral: {
    n100: '#F9F8F6',             // Lightest - near white
    n300: '#E2DED4',             // Light
    n500: '#8B8478',             // Medium
    n700: '#4A453E',             // Dark
    n900: '#1C1A17',             // Darkest - near black
  },
} as const;

// Chart Color Palette (data visualization)
export const VueniCharts = {
  // Primary sequence for multi-series charts
  primary: [
    vueni.core.sapphireDust,      // #516AC8 (Sapphire Dust)
    vueni.core.caramelEssence,    // #E3AF64 (Caramel Essence)
    vueni.core.blueOblivion,      // #26428B (Blue Oblivion)
    vueni.semantic.success,       // #4ABA70 (Success)
    vueni.semantic.error,         // #D64545 (Error)
    vueni.neutral.n500,           // #8B8478 (Neutral)
  ],
  
  // Financial-specific mappings
  financial: {
    income: vueni.semantic.success,                // #4ABA70 (Success)
    expenses: vueni.semantic.error,                // #D64545 (Error)
    savings: vueni.core.sapphireDust,             // #516AC8 (Sapphire Dust)
    investments: vueni.core.blueOblivion,         // #26428B (Blue Oblivion)
    debt: vueni.core.caramelEssence,              // #E3AF64 (Caramel Essence)
  },
  
  // Trend indicators
  trends: {
    positive: vueni.semantic.success,
    negative: vueni.semantic.error,
    neutral: vueni.neutral.n500,
  },
} as const;

// Surface System (for both light and dark modes)
export const VueniSurfaces = {
  light: {
    background: vueni.core.rapturesLight,        // #F6F3E7
    secondary: vueni.core.milkTooth,             // #FAEBD7
    card: vueni.neutral.n100,                    // #F9F8F6
    text: {
      primary: vueni.core.cosmicOdyssey,         // #0F1939
      secondary: vueni.neutral.n700,             // #4A453E
      muted: vueni.neutral.n500,                 // #8B8478
    },
  },
  dark: {
    background: vueni.core.cosmicOdyssey,        // #0F1939
    secondary: '#1A2547',                        // Lighter variant
    card: '#253655',                             // Card backgrounds
    text: {
      primary: '#FFFFFF',                        // High contrast
      secondary: 'rgba(255, 255, 255, 0.8)',    // Medium contrast
      muted: 'rgba(255, 255, 255, 0.6)',        // Low contrast
    },
  },
  
  // Glass morphism effects with Vueni undertones
  glass: {
    subtle: 'rgba(81, 106, 200, 0.03)',          // Sapphire dust at 3%
    default: 'rgba(81, 106, 200, 0.06)',         // Sapphire dust at 6%
    prominent: 'rgba(81, 106, 200, 0.12)',       // Sapphire dust at 12%
    border: 'rgba(81, 106, 200, 0.08)',          // Sapphire dust at 8%
  },
} as const;


// CSS Custom Properties Generator
export const generateVueniCSSProperties = () => {
  return {
    // Core colors
    '--vueni-primary': vueni.core.sapphireDust,
    '--vueni-primary-dark': vueni.core.cosmicOdyssey,
    '--vueni-secondary': vueni.core.caramelEssence,
    '--vueni-secondary-dark': vueni.core.blueOblivion,
    '--vueni-background-light': vueni.core.rapturesLight,
    '--vueni-background-secondary': vueni.core.milkTooth,
    
    // Semantic colors
    '--vueni-success': vueni.semantic.success,
    '--vueni-error': vueni.semantic.error,
    '--vueni-warning': vueni.semantic.warning,
    '--vueni-info': vueni.semantic.info,
    
    // Light surfaces
    '--vueni-surface-light-bg': VueniSurfaces.light.background,
    '--vueni-surface-light-secondary': VueniSurfaces.light.secondary,
    '--vueni-surface-light-card': VueniSurfaces.light.card,
    
    // Dark surfaces
    '--vueni-surface-dark-bg': VueniSurfaces.dark.background,
    '--vueni-surface-dark-secondary': VueniSurfaces.dark.secondary,
    '--vueni-surface-dark-card': VueniSurfaces.dark.card,
    
    // Glass effects
    '--vueni-glass-subtle': VueniSurfaces.glass.subtle,
    '--vueni-glass-default': VueniSurfaces.glass.default,
    '--vueni-glass-prominent': VueniSurfaces.glass.prominent,
    '--vueni-glass-border': VueniSurfaces.glass.border,
    
    // Neutral scale
    '--vueni-neutral-100': vueni.neutral.n100,
    '--vueni-neutral-300': vueni.neutral.n300,
    '--vueni-neutral-500': vueni.neutral.n500,
    '--vueni-neutral-700': vueni.neutral.n700,
    '--vueni-neutral-900': vueni.neutral.n900,
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
    vueni.core.cosmicOdyssey,
    vueni.core.blueOblivion,
    VueniSurfaces.dark.background,
    VueniSurfaces.dark.secondary,
  ];
  
  return darkBackgrounds.includes(backgroundColor) 
    ? VueniSurfaces.dark.text.primary 
    : vueni.neutral.n900;
};

// Theme object for easy consumption
export const vueniColorTheme = {
  ...vueni,
  surfaces: VueniSurfaces,
  charts: VueniCharts,
  css: generateVueniCSSProperties(),
  scss: generateVueniSCSSVariables(),
  getContrastColor,
} as const;

// Type exports
export type VueniColors = typeof vueni;
export type VueniSurfaceColors = typeof VueniSurfaces;
export type VueniChartColors = typeof VueniCharts;

// Default export
export default vueniColorTheme; 