import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import tailwindcssAnimate from 'tailwindcss-animate';
import typography from "./src/theme/typography";
import { vueni } from './src/theme/colors/vueniPalette';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
    './shared/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: false,
      padding: '0',
      screens: {
        sm: '100%',
        md: '100%',
        lg: '100%',
        xl: '100%',
        '2xl': '100%',
      },
    },
    extend: {
      fontFamily: {
        sans: [
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        'sf-pro-display': [
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
      },
      fontSize: {
        body: typography.fontSizes.base,
        bodySmall: typography.fontSizes.sm,
        bodyLarge: typography.fontSizes.lg,
        heading1: typography.fontSizes['3xl'],
        heading2: typography.fontSizes['2xl'],
        heading3: typography.fontSizes.xl,
        heading4: typography.fontSizes.lg,
        heading5: typography.fontSizes.base,
        heading6: typography.fontSizes.sm,
      },
      colors: {
        // Preserve default Tailwind colors
        ...require('tailwindcss/colors'),
        
        // Base shadcn colors (keeping for compatibility)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },

        // Vueni Brand Color System
        vueni: {
          // Core brand colors with semantic naming
          ...vueni.core,
          ...vueni.semantic,
          ...vueni.neutral,
          
          // Surface system
          surface: {
            'light-bg': vueni.core.rapturesLight,
            'light-card': vueni.neutral.n100,
            'dark-bg': vueni.core.cosmicOdyssey,
            'dark-card': '#253655',
          },

          // Glass effects (using CSS custom properties)
          glass: {
            subtle: 'var(--vueni-glass-subtle)',
            default: 'var(--vueni-glass-default)',
            prominent: 'var(--vueni-glass-prominent)',
            border: 'var(--vueni-glass-border)',
          },
        },
      },
      borderRadius: {
        ...defaultTheme.borderRadius,
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        'vueni-sm': '4px',
        'vueni-md': '6px',
        'vueni-lg': '8px',
        'vueni-pill': '9999px',
        'vueni-container': '16px',
        'vueni-island': '44px',
        // Viz-specific radius
        'lg-24': '24px',
      },
      boxShadow: {
        // Viz-specific shadows (2dp and 4dp)
        'dp2': '0 2px 4px rgba(0,0,0,.05)',
        'dp4': '0 4px 12px rgba(0,0,0,.08)',
      },
      transitionProperty: {
        // Viz depth transitions
        'depth': 'box-shadow, transform',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        // Viz-specific animations
        'pulse-scale': {
          '0%, 100%': { 
            transform: 'scale(1)', 
            opacity: '1' 
          },
          '50%': { 
            transform: 'scale(1.05)', 
            opacity: '0.8' 
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-scale': 'pulse-scale 2s ease-in-out infinite',
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    require('./src/plugins/liquid-glass-nav-plugin.js'),
    // Viz utilities plugin
    function({ addUtilities }: any) {
      addUtilities({
        '.rounded-viz': {
          borderRadius: '24px',
        },
        '.shadow-card': {
          boxShadow: '0 2px 4px rgba(0,0,0,.05)',
        },
        '.shadow-card-hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,.08)',
        },
        '.transition-depth': {
          transitionProperty: 'box-shadow, transform',
          transitionDuration: '200ms',
          transform: 'translateY(0)',
        },
        '.transition-depth:hover': {
          transform: 'translateY(-0.125rem)',
        },
      });
    },
  ],
} satisfies Config;
