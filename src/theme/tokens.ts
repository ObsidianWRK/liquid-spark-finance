// Theme tokens for consistent design system
export const themeTokens = {
  // Spacing tokens
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
  },
  
  // Navigation specific tokens
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
    },
    fontSize: {
      mobile: '0.75rem',  // 12px
      desktop: '0.875rem', // 14px
    },
    borderRadius: {
      bubble: '9999px',
      card: '1.5rem',
      button: '0.75rem',
    },
  },
  
  // Color tokens
  colors: {
    glass: {
      bg: 'rgba(255, 255, 255, 0.03)',
      bgHover: 'rgba(255, 255, 255, 0.05)',
      bgActive: 'rgba(99, 102, 241, 0.15)',
      border: 'rgba(255, 255, 255, 0.06)',
      borderHover: 'rgba(255, 255, 255, 0.1)',
    },
    dark: {
      glass: {
        bg: 'rgba(255, 255, 255, 0.02)',
        bgHover: 'rgba(255, 255, 255, 0.04)',
        bgActive: 'rgba(99, 102, 241, 0.12)',
        border: 'rgba(255, 255, 255, 0.04)',
        borderHover: 'rgba(255, 255, 255, 0.08)',
      }
    }
  },
  
  // Blur effects
  blur: {
    sm: 'blur(8px)',
    md: 'blur(16px)',
    lg: 'blur(24px)',
    xl: 'blur(40px)',
  },
  
  // Animation durations
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '500ms',
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

export type ThemeTokens = typeof themeTokens; 