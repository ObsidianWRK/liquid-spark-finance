import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';
import typography from "./src/theme/typography";

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

        // NEW: Vueni Brand Color System
        vueni: {
          // Core brand colors
          'sapphire-dust': '#516AC8',      // Primary
          'cosmic-odyssey': '#0F1939',     // Dark background
          'caramel-essence': '#E3AF64',    // Accent/warning
          'blue-oblivion': '#26428B',      // Secondary blue
          'raptures-light': '#F6F3E7',     // Light background
          'milk-tooth': '#FAEBD7',         // Light secondary

          // Semantic colors
          primary: '#516AC8',
          secondary: '#E3AF64',
          success: '#4ABA70',
          error: '#D64545',
          warning: '#E3AF64',
          info: '#516AC8',

          // Surface system
          surface: {
            primary: '#0F1939',
            secondary: '#1A2547',
            tertiary: '#253655',
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
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
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
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    require('./src/plugins/liquid-glass-nav-plugin.js'),
  ],
} satisfies Config;
