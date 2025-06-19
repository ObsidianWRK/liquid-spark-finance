/**
 * Unified Vueni Theme System
 * Consolidates all theme tokens into a single source of truth
 * Replaces: colors.ts, tokens.ts, unified-card-tokens.ts, and components/shared/VueniDesignSystem tokens
 */

import { colors } from './colors';
import { themeTokens } from './tokens';
import { unifiedCardTokens } from './unified-card-tokens';
import { appleGraphTokens } from './graph-tokens';

// Unified Theme Architecture
export const vueniTheme = {
  // Core Colors (consolidated from colors.ts)
  colors: {
    // Background system
    background: {
      primary: '#0A0A0B',      // Deep black
      secondary: '#12121A',    // Slightly lighter
      card: '#1A1A24',        // Card backgrounds
      hover: '#22222E',       // Hover states
      glass: {
        subtle: 'rgba(255, 255, 255, 0.02)',
        default: 'rgba(255, 255, 255, 0.06)',
        medium: 'rgba(255, 255, 255, 0.08)',
        heavy: 'rgba(255, 255, 255, 0.12)',
        border: 'rgba(255, 255, 255, 0.08)'
      }
    },
    
    // Text hierarchy
    text: {
      primary: '#FFFFFF',      // Primary text
      secondary: '#A0A0B8',    // Secondary text
      muted: '#606074',        // Muted text
      accent: '#4A9EFF'        // Accent text
    },
    
    // Accent colors
    accent: {
      blue: '#4A9EFF',        // Primary accent
      green: '#4AFF88',       // Success/positive
      pink: '#FF69B4',        // Health score
      orange: '#FF9F4A',      // Warning
      purple: '#9F4AFF'       // Secondary accent
    },
    
    // Status indicators
    status: {
      success: '#4AFF88',     // Success states
      warning: '#FFD700',     // Warning states
      error: '#FF4A6A',       // Error states
      info: '#4A9EFF'         // Info states
    },
    
    // Financial colors
    financial: {
      positive: '#4AFF88',    // Positive amounts
      negative: '#FF4A6A',    // Negative amounts
      neutral: '#A0A0B8'      // Neutral amounts
    }
  },

  // Spacing system (consolidated from tokens.ts)
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
  },

  // Border radius system
  radius: {
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px - standard card radius
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',   // Pill shape
  },

  // Unified Card System (from unified-card-tokens.ts)
  cards: {
    background: {
      default: 'bg-white/[0.02]',
      hover: 'hover:bg-white/[0.03]',
      solid: 'bg-black/80',
    },
    border: {
      default: 'border border-white/[0.08]',
      hover: 'hover:border-white/[0.12]',
    },
    padding: {
      sm: 'p-3',
      md: 'p-4', 
      lg: 'p-6',
      xl: 'p-8'
    },
    effects: {
      backdrop: 'backdrop-blur-md',
      transition: 'transition-all duration-300',
      hoverScale: 'hover:scale-[1.02]',
      shadow: 'shadow-lg hover:shadow-xl'
    }
  },

  // Animation system
  animation: {
    duration: {
      fast: '150ms',
      normal: '250ms',
      slow: '500ms',
    },
    easing: {
      standard: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      smooth: 'cubic-bezier(0.4, 0.0, 0.2, 1.0)',
    }
  },

  // Effects system
  effects: {
    blur: {
      sm: 'blur(8px)',
      md: 'blur(16px)',
      lg: 'blur(24px)',
      xl: 'blur(40px)',
    },
    backdrop: {
      sm: 'backdrop-blur-sm',
      md: 'backdrop-blur-md',
      lg: 'backdrop-blur-lg',
    }
  },

  // Navigation system
  navigation: {
    height: {
      mobile: '4rem',     // 64px
      tablet: '5rem',     // 80px
      desktop: '6rem',    // 96px
      large: '7rem',      // 112px
    },
    iconSize: {
      mobile: '1.25rem',  // 20px
      desktop: '1.75rem', // 28px
    }
  },

  // Z-index layers
  zIndex: {
    background: -1,
    content: 1,
    navigation: 50,
    overlay: 40,
    modal: 100,
  }
} as const;

// Chart-specific theme system (reference to graph-tokens.ts)
export const chartTheme = appleGraphTokens;

// Legacy compatibility exports
export { colors } from './colors';
export { themeTokens } from './tokens';
export { unifiedCardTokens } from './unified-card-tokens';
export { appleGraphTokens } from './graph-tokens';

// Type exports
export type VueniTheme = typeof vueniTheme;
export type ChartTheme = typeof chartTheme;

// Default export - unified theme
export default vueniTheme; 