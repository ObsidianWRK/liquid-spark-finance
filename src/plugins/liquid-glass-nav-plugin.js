/**
 * Liquid Glass Navigation Tailwind Plugin
 * Extends Tailwind CSS with custom utilities for iOS 26 navigation system
 */

const plugin = require('tailwindcss/plugin');

const liquidGlassNavPlugin = plugin(
  function ({ addUtilities, addComponents, theme, e }) {
    // Custom Navigation Components
    addComponents({
      '.liquid-nav': {
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        zIndex: '50',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.15)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.16)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform, opacity',
        contain: 'layout style paint',
      },

      '.liquid-nav-item': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.25rem',
        minWidth: '44px',
        minHeight: '44px',
        padding: '0.5rem 0.75rem',
        background: 'transparent',
        border: '1px solid transparent',
        borderRadius: theme('borderRadius.vueni-lg'),
        color: 'rgba(255, 255, 255, 0.7)',
        cursor: 'pointer',
        touchAction: 'manipulation',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        outline: 'none',
        willChange: 'transform, background-color, color',
        contain: 'style paint',

        '&:hover': {
          background: 'rgba(255, 255, 255, 0.08)',
          color: 'rgba(255, 255, 255, 0.95)',
          transform: 'translateY(-1px) scale(1.02)',
          borderColor: 'rgba(255, 255, 255, 0.15)',
        },

        '&.active': {
          background: 'rgba(255, 255, 255, 0.12)',
          color: 'rgba(255, 255, 255, 0.95)',
          borderColor: 'rgba(255, 255, 255, 0.25)',
          transform: 'scale(1.05)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
        },

        '&:focus-visible': {
          outline: '2px solid rgba(0, 122, 255, 0.5)',
          outlineOffset: '2px',
          boxShadow: '0 0 0 4px rgba(0, 122, 255, 0.2)',
        },
      },

      '.liquid-nav-icon': {
        width: '1.25rem',
        height: '1.25rem',
        flexShrink: '0',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform',
      },

      '.liquid-nav-label': {
        fontSize: '0.75rem',
        fontWeight: '500',
        lineHeight: '1',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        letterSpacing: '-0.01em',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
      },
    });

    // Navigation State Utilities
    addUtilities({
      '.nav-hidden': {
        transform: 'translateY(100%)',
        opacity: '0',
      },

      '.nav-revealed': {
        transform: 'translateY(0)',
        opacity: '1',
      },

      '.nav-slide-up': {
        animation: 'nav-slide-up 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      },

      '.nav-slide-down': {
        animation: 'nav-slide-down 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      },
    });

    // Glass Effect Utilities
    addUtilities({
      '.glass-light': {
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
      },

      '.glass-medium': {
        background: 'rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      },

      '.glass-strong': {
        background: 'rgba(255, 255, 255, 0.16)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      },

      '.glass-intense': {
        background: 'rgba(255, 255, 255, 0.20)',
        backdropFilter: 'blur(32px) saturate(200%)',
        WebkitBackdropFilter: 'blur(32px) saturate(200%)',
      },
    });

    // Safe Area Utilities
    addUtilities({
      '.safe-bottom': {
        paddingBottom: 'env(safe-area-inset-bottom)',
      },

      '.safe-left': {
        paddingLeft: 'env(safe-area-inset-left)',
      },

      '.safe-right': {
        paddingRight: 'env(safe-area-inset-right)',
      },

      '.safe-top': {
        paddingTop: 'env(safe-area-inset-top)',
      },

      '.safe-all': {
        paddingTop: 'env(safe-area-inset-top)',
        paddingRight: 'env(safe-area-inset-right)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
      },
    });

    // Hit Target Utilities
    addUtilities({
      '.hit-target-sm': {
        minWidth: '44px',
        minHeight: '44px',
      },

      '.hit-target-md': {
        minWidth: '48px',
        minHeight: '48px',
      },

      '.hit-target-lg': {
        minWidth: '52px',
        minHeight: '52px',
      },
    });

    // Performance Optimization Utilities
    addUtilities({
      '.gpu-accelerated': {
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        perspective: '1000px',
      },

      '.contained-layout': {
        contain: 'layout style paint',
      },

      '.contained-paint': {
        contain: 'style paint',
      },

      '.will-change-transform': {
        willChange: 'transform',
      },

      '.will-change-opacity': {
        willChange: 'opacity',
      },

      '.will-change-colors': {
        willChange: 'background-color, color',
      },
    });

    // Accessibility Utilities
    addUtilities({
      '.focus-ring-blue': {
        '&:focus-visible': {
          outline: '2px solid rgba(0, 122, 255, 0.5)',
          outlineOffset: '2px',
          boxShadow: '0 0 0 4px rgba(0, 122, 255, 0.2)',
        },
      },

      '.tap-highlight-none': {
        WebkitTapHighlightColor: 'transparent',
      },

      '.touch-manipulation': {
        touchAction: 'manipulation',
      },

      '.user-select-none': {
        userSelect: 'none',
      },
    });
  },
  {
    // Plugin configuration
    theme: {
      extend: {
        // Custom animation keyframes
        keyframes: {
          'nav-slide-up': {
            from: {
              transform: 'translateY(100%)',
              opacity: '0',
            },
            to: {
              transform: 'translateY(0)',
              opacity: '1',
            },
          },
          'nav-slide-down': {
            from: {
              transform: 'translateY(0)',
              opacity: '1',
            },
            to: {
              transform: 'translateY(100%)',
              opacity: '0',
            },
          },
          'nav-badge-pulse': {
            '0%, 100%': {
              transform: 'scale(1)',
              opacity: '1',
            },
            '50%': {
              transform: 'scale(1.2)',
              opacity: '0.8',
            },
          },
        },

        // Custom animation definitions
        animation: {
          'nav-slide-up': 'nav-slide-up 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          'nav-slide-down': 'nav-slide-down 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          'nav-badge-pulse': 'nav-badge-pulse 2s ease-in-out infinite',
        },

        // Custom backdrop blur values
        backdropBlur: {
          'nav-sm': '16px',
          'nav-md': '20px',
          'nav-lg': '24px',
          'nav-xl': '32px',
        },

        // Custom box shadow values
        boxShadow: {
          'nav-sm': '0 2px 8px rgba(0, 0, 0, 0.08)',
          'nav-md': '0 4px 16px rgba(0, 0, 0, 0.12)',
          'nav-lg': '0 8px 32px rgba(0, 0, 0, 0.16)',
          'nav-xl': '0 12px 48px rgba(0, 0, 0, 0.20)',
        },

        // Custom glass background colors
        backgroundColor: {
          'glass-light': 'rgba(255, 255, 255, 0.08)',
          'glass-medium': 'rgba(255, 255, 255, 0.12)',
          'glass-strong': 'rgba(255, 255, 255, 0.16)',
          'glass-intense': 'rgba(255, 255, 255, 0.20)',
        },

        // Custom border colors
        borderColor: {
          'glass-light': 'rgba(255, 255, 255, 0.15)',
          'glass-medium': 'rgba(255, 255, 255, 0.25)',
          'glass-focus': 'rgba(0, 122, 255, 0.5)',
        },

        // Custom text colors
        textColor: {
          'glass-primary': 'rgba(255, 255, 255, 0.95)',
          'glass-secondary': 'rgba(255, 255, 255, 0.7)',
          'glass-tertiary': 'rgba(255, 255, 255, 0.5)',
        },
      },
    },
  }
);

module.exports = liquidGlassNavPlugin;
