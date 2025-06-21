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
  
  // Status sub-object for API compatibility
  status: {
    success: '#4ABA70',          // Accessible green
    error: '#D64545',            // Accessible red  
    warning: VueniCore.secondary.caramelEssence,
    info: VueniCore.primary.sapphireDust,
  },
  
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

// Component-Specific Color Mappings (following your style guide)
export const VueniComponents = {
  // Button System (following your style guide)
  buttons: {
    primary: {
      default: VueniCore.primary.sapphireDust,        // #516AC8
      hover: VueniCore.secondary.blueOblivion,        // #26428B
      disabled: `${VueniCore.primary.sapphireDust}66`, // 40% opacity
      text: '#FFFFFF',
    },
    secondary: {
      default: 'transparent',
      hover: `${VueniCore.primary.sapphireDust}1A`,   // 10% fill
      border: VueniCore.primary.sapphireDust,
      text: VueniCore.primary.sapphireDust,
      disabled: VueniNeutral[300],
    },
    accent: {
      default: VueniCore.secondary.caramelEssence,    // #E3AF64
      hover: '#D09E4A',                               // 10% darker
      text: VueniCore.primary.cosmicOdyssey,
    },
    success: {
      default: VueniSemantic.success,                 // #4ABA70
      hover: '#3EA65C',
      text: '#FFFFFF',
    },
    danger: {
      default: VueniSemantic.error,                   // #D64545
      hover: '#C13B3B',
      text: '#FFFFFF',
    },
  },

  // Navigation System
  navigation: {
    light: {
      background: VueniCore.background.rapturesLight, // #F6F3E7
      text: VueniCore.primary.cosmicOdyssey,         // #0F1939
      active: VueniCore.primary.sapphireDust,        // #516AC8
      border: VueniNeutral[300],                      // #E2DED4
    },
    dark: {
      background: VueniCore.primary.cosmicOdyssey,   // #0F1939
      text: VueniCore.background.rapturesLight,      // #F6F3E7
      active: VueniCore.secondary.caramelEssence,    // #E3AF64
      border: `${VueniCore.secondary.blueOblivion}33`, // 20% opacity
    },
  },

  // Form Elements
  forms: {
    input: {
      light: {
        background: '#FFFFFF',
        border: VueniNeutral[300],                    // #E2DED4
        focus: VueniCore.primary.sapphireDust,        // #516AC8
        error: VueniSemantic.error,                   // #D64545
        placeholder: VueniNeutral[500],               // #8B8478
      },
      dark: {
        background: '#0A0D1F',
        border: VueniNeutral[700],
        focus: VueniCore.primary.sapphireDust,
        error: VueniSemantic.error,
        placeholder: VueniNeutral[500],
      },
    },
    label: {
      default: VueniNeutral[700],                     // #4A453E
      required: VueniSemantic.error,                  // #D64545
    },
  },

  // Cards & Surfaces
  cards: {
    light: {
      background: '#FFFFFF',
      border: VueniCore.background.milkTooth,         // #FAEBD7
      shadow: `${VueniCore.primary.cosmicOdyssey}1A`, // 10% opacity
      hover: `${VueniCore.primary.sapphireDust}0D`,   // 5% hover
    },
    dark: {
      background: VueniSurfaces.background.tertiary,  // #253655
      border: VueniSurfaces.glass.border,             // rgba(81, 106, 200, 0.08)
      shadow: `${VueniCore.primary.cosmicOdyssey}4D`, // 30% opacity
      hover: VueniSurfaces.glass.subtle,              // rgba(81, 106, 200, 0.03)
    },
  },

  // Status Indicators
  status: {
    success: {
      background: `${VueniSemantic.success}1A`,       // 10% opacity
      border: `${VueniSemantic.success}33`,           // 20% opacity
      text: VueniSemantic.success,
    },
    error: {
      background: `${VueniSemantic.error}1A`,
      border: `${VueniSemantic.error}33`,
      text: VueniSemantic.error,
    },
    warning: {
      background: `${VueniSemantic.warning}1A`,
      border: `${VueniSemantic.warning}33`,
      text: VueniSemantic.warning,
    },
    info: {
      background: `${VueniSemantic.info}1A`,
      border: `${VueniSemantic.info}33`,
      text: VueniSemantic.info,
    },
  },
} as const;

// Theme Mode System
export const VueniThemeModes = {
  light: {
    background: {
      primary: VueniCore.background.rapturesLight,    // #F6F3E7
      secondary: VueniCore.background.milkTooth,      // #FAEBD7
      tertiary: '#FFFFFF',
    },
    text: {
      primary: VueniCore.primary.cosmicOdyssey,       // #0F1939
      secondary: VueniNeutral[700],                   // #4A453E
      tertiary: VueniNeutral[500],                    // #8B8478
      muted: VueniNeutral[400],                       // #C7BFB0
    },
    border: {
      default: VueniNeutral[300],                     // #E2DED4
      light: VueniNeutral[200],                       // #F1EFE8
      strong: VueniNeutral[400],                      // #C7BFB0
    },
  },
  dark: {
    background: {
      primary: VueniCore.primary.cosmicOdyssey,       // #0F1939
      secondary: VueniSurfaces.background.secondary,  // #1A2547
      tertiary: VueniSurfaces.background.tertiary,    // #253655
    },
    text: {
      primary: VueniSurfaces.text.primary,            // #FFFFFF
      secondary: VueniSurfaces.text.secondary,        // rgba(255, 255, 255, 0.8)
      tertiary: VueniSurfaces.text.tertiary,          // rgba(255, 255, 255, 0.6)
      muted: VueniSurfaces.text.muted,                // rgba(255, 255, 255, 0.4)
    },
    border: {
      default: VueniSurfaces.glass.border,            // rgba(81, 106, 200, 0.08)
      light: VueniSurfaces.glass.subtle,              // rgba(81, 106, 200, 0.03)
      strong: `${VueniCore.secondary.blueOblivion}33`, // 20% opacity
    },
  },
} as const;

// Enhanced CSS Custom Properties Generator with Theme Support
export const generateVueniCSSPropertiesWithTheme = (mode: 'light' | 'dark' = 'dark') => {
  const themeColors = VueniThemeModes[mode];
  const components = VueniComponents;
  
  return {
    // Core colors (mode-aware)
    '--vueni-primary': VueniCore.primary.sapphireDust,
    '--vueni-primary-dark': VueniCore.primary.cosmicOdyssey,
    '--vueni-secondary': VueniCore.secondary.caramelEssence,
    '--vueni-secondary-dark': VueniCore.secondary.blueOblivion,
    
    // Theme-specific backgrounds
    '--vueni-background-primary': themeColors.background.primary,
    '--vueni-background-secondary': themeColors.background.secondary,
    '--vueni-background-tertiary': themeColors.background.tertiary,
    
    // Theme-specific text
    '--vueni-text-primary': themeColors.text.primary,
    '--vueni-text-secondary': themeColors.text.secondary,
    '--vueni-text-tertiary': themeColors.text.tertiary,
    '--vueni-text-muted': themeColors.text.muted,
    
    // Theme-specific borders
    '--vueni-border-default': themeColors.border.default,
    '--vueni-border-light': themeColors.border.light,
    '--vueni-border-strong': themeColors.border.strong,
    
    // Component-specific colors
    '--vueni-button-primary': components.buttons.primary.default,
    '--vueni-button-primary-hover': components.buttons.primary.hover,
    '--vueni-button-secondary-border': components.buttons.secondary.border,
    '--vueni-button-accent': components.buttons.accent.default,
    '--vueni-button-success': components.buttons.success.default,
    '--vueni-button-danger': components.buttons.danger.default,
    
    // Navigation colors
    '--vueni-nav-background': components.navigation[mode].background,
    '--vueni-nav-text': components.navigation[mode].text,
    '--vueni-nav-active': components.navigation[mode].active,
    '--vueni-nav-border': components.navigation[mode].border,
    
    // Card colors
    '--vueni-card-background': components.cards[mode].background,
    '--vueni-card-border': components.cards[mode].border,
    '--vueni-card-shadow': components.cards[mode].shadow,
    '--vueni-card-hover': components.cards[mode].hover,
    
    // Semantic colors (consistent across themes)
    '--vueni-success': VueniSemantic.success,
    '--vueni-error': VueniSemantic.error,
    '--vueni-warning': VueniSemantic.warning,
    '--vueni-info': VueniSemantic.info,
    
    // Status indicators
    '--vueni-status-success-bg': components.status.success.background,
    '--vueni-status-error-bg': components.status.error.background,
    '--vueni-status-warning-bg': components.status.warning.background,
    '--vueni-status-info-bg': components.status.info.background,
    
    // Glass effects (always from dark theme for consistency)
    '--vueni-glass-subtle': VueniSurfaces.glass.subtle,
    '--vueni-glass-default': VueniSurfaces.glass.default,
    '--vueni-glass-prominent': VueniSurfaces.glass.prominent,
    '--vueni-glass-border': VueniSurfaces.glass.border,
    
    // Neutral scale
    '--vueni-neutral-100': VueniNeutral[100],
    '--vueni-neutral-300': VueniNeutral[300],
    '--vueni-neutral-500': VueniNeutral[500],
    '--vueni-neutral-700': VueniNeutral[700],
    '--vueni-neutral-900': VueniNeutral[900],
  };
};

// Default export
export default vueniColorTheme; 