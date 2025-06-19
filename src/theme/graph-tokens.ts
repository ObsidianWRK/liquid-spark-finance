/**
 * Apple HIG-compliant design tokens for charts and graphs
 * Based on Apple Human Interface Guidelines 2025
 * Designed for Liquid Spark Finance financial visualization components
 */

// Apple System Colors - Semantic color system with light/dark mode support
export const appleGraphTokens = {
  colors: {
    // Primary Financial Colors (Apple System Colors)
    positive: {
      light: '#30D158', // systemGreen light
      dark: '#32D74B',  // systemGreen dark
    },
    negative: {
      light: '#FF3B30', // systemRed light  
      dark: '#FF453A',  // systemRed dark
    },
    neutral: {
      light: '#007AFF', // systemBlue light
      dark: '#0A84FF',  // systemBlue dark
    },
    warning: {
      light: '#FF9500', // systemOrange light
      dark: '#FF9F0A',  // systemOrange dark
    },
    
    // Text Colors (Apple Label Hierarchy)
    text: {
      primary: {
        light: '#000000',  // 100% opacity
        dark: '#FFFFFF',   // 100% opacity
      },
      secondary: {
        light: 'rgba(60, 60, 67, 0.6)',   // 60% opacity
        dark: 'rgba(235, 235, 245, 0.6)',  // 60% opacity
      },
      tertiary: {
        light: 'rgba(60, 60, 67, 0.3)',   // 30% opacity
        dark: 'rgba(235, 235, 245, 0.3)',  // 30% opacity
      },
      quaternary: {
        light: 'rgba(60, 60, 67, 0.18)',  // 18% opacity
        dark: 'rgba(235, 235, 245, 0.18)', // 18% opacity
      },
    },
    
    // Background Colors (Apple System Backgrounds)
    background: {
      system: {
        primary: {
          light: '#FFFFFF',
          dark: '#000000',
        },
        secondary: {
          light: '#F2F2F7',
          dark: '#1C1C1E',
        },
      },
      grouped: {
        primary: {
          light: '#F2F2F7',
          dark: '#000000',
        },
        secondary: {
          light: '#FFFFFF',
          dark: '#1C1C1E',
        },
      },
    },
    
    // Grid and Separator Colors
    separator: {
      light: 'rgba(60, 60, 67, 0.12)',
      dark: 'rgba(235, 235, 245, 0.12)',
    },
    
    // Chart-specific semantic colors with better hue differentiation
    chart: {
      income: {
        light: '#30D158',  // Apple systemGreen
        dark: '#32D74B',
      },
      spending: {
        light: '#FF3B30',  // Apple systemRed
        dark: '#FF453A',
      },
      savings: {
        light: '#007AFF',  // Apple systemBlue
        dark: '#0A84FF',
      },
      investments: {
        light: '#AF52DE',  // Apple systemPurple
        dark: '#BF5AF2',
      },
      debt: {
        light: '#FF9500',  // Apple systemOrange
        dark: '#FF9F0A',
      },
      // Extended palette for complex charts
      extended: {
        teal: {
          light: '#5AC8FA',
          dark: '#64D2FF',
        },
        mint: {
          light: '#00C7BE',
          dark: '#63E6E2',
        },
        pink: {
          light: '#FF2D92',
          dark: '#FF375F',
        },
        yellow: {
          light: '#FFCC00',
          dark: '#FFD60A',
        },
      },
    },
  },

  // Apple Spacing System (hardware-inspired bezel consistency)
  spacing: {
    xs: 4,   // 0.25rem - Micro spacing
    sm: 8,   // 0.5rem  - Small spacing
    md: 12,  // 0.75rem - Medium spacing
    lg: 16,  // 1rem    - Large spacing
    xl: 24,  // 1.5rem  - XLarge spacing
    xxl: 32, // 2rem    - XXLarge spacing
    
    // Chart-specific spacing
    chart: {
      padding: 16,        // Chart container padding
      titleGap: 12,       // Title to chart gap
      legendGap: 8,       // Chart to legend gap
      legendItemGap: 16,  // Between legend items
      tickSpacing: 8,     // Minimum tick spacing
      axisGap: 4,         // Axis to labels gap
    },
  },

  // Apple Corner Radius System (concentric patterns)
  borderRadius: {
    sm: 8,   // Small elements
    md: 12,  // Standard elements (Apple standard)
    lg: 16,  // Large elements
    tooltip: 8,    // Tooltip radius
    legendDot: 2,  // Legend marker radius
  },

  // Apple Animation System (Apple Human Interface Guidelines 2025)
  animation: {
    // Apple-standard easing curves
    standard: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',     // Standard ease-out
    ios: 'cubic-bezier(0.4, 0.0, 0.2, 1.0)',              // iOS ease-out  
    bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',    // Gentle bounce
    drawOn: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',       // Chart drawing entrance
    drawOff: 'cubic-bezier(0.55, 0.06, 0.68, 0.19)',      // Chart drawing exit
    dataTransition: 'cubic-bezier(0.4, 0.0, 0.2, 1.0)',   // Data value changes
    hoverState: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',   // Interactive hover
    selection: 'cubic-bezier(0.4, 0.0, 0.2, 1.0)',        // Selection feedback
    
    // Apple-standard durations (milliseconds)
    duration: {
      micro: 100,           // Micro interactions (selection feedback)
      fast: 150,            // Fast interactions (hover states)
      standard: 300,        // Standard transitions
      medium: 400,          // Standard chart transitions
      chartDrawing: 800,    // Line/Area chart drawing
      slowDrawing: 1200,    // Complex chart animations
      barStagger: 400,      // Staggered bar appearances
      areaFill: 600,        // Area chart fill coordination
    },
    
    // Animation timing (deprecated, use duration instead)
    timing: {
      fast: 150,    // Updated to match Apple standards
      medium: 400,  // Data transitions
      slow: 800,    // Draw on/off animations
    },
    
    // Reduced motion support
    reducedMotion: {
      enableTransitions: false, // Disable when user prefers reduced motion
      fallbackDuration: 0,      // Instant for reduced motion
      respectSystemSetting: true,
    },
    
    // Performance optimization
    performance: {
      preferTransform: true,     // Use transform/opacity for GPU acceleration
      avoidLayoutProperties: true, // Avoid animating width, height, etc.
      enableWillChange: true,    // Add will-change for animations
      maxConcurrentAnimations: 6, // Limit concurrent animations
    },
  },

  // Apple Typography System (San Francisco)
  typography: {
    fontFamily: {
      primary: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      fallback: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
    },
    
    // Chart typography hierarchy
    fontSize: {
      chartTitle: 20,    // 20pt - Main chart heading
      axisLabel: 12,     // 12pt - X/Y axis labels
      dataLabel: 11,     // 11pt - Value annotations
      legend: 11,        // 11pt - Chart legends
      tooltip: 11,       // 11pt - Interactive data display
    },
    
    fontWeight: {
      chartTitle: 600,   // Semibold
      axisLabel: 400,    // Regular
      dataLabel: 500,    // Medium
      legend: 400,       // Regular
      tooltip: 500,      // Medium
    },
    
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
    },
  },

  // Chart Dimensions and Aspect Ratios
  dimensions: {
    aspectRatio: {
      wide: 16 / 9,      // Wide charts
      standard: 4 / 3,   // Standard charts
      square: 1,         // Square charts
      tall: 3 / 4,       // Tall charts
    },
    
    minHeight: {
      small: 200,        // Small charts
      medium: 300,       // Medium charts
      large: 400,        // Large charts
    },
    
    strokeWidth: {
      thin: 1,           // Grid lines, axes
      medium: 2,         // Data lines
      thick: 3,          // Emphasized lines
      bold: 4,           // Primary data lines
    },
  },

  // Accessibility and Interaction
  accessibility: {
    // High contrast mode adjustments
    highContrast: {
      strokeWidth: 3,    // Increased stroke width
      fontSize: 13,      // Increased font size
      spacing: 20,       // Increased spacing
    },
    
    // Touch target sizes (iOS minimum 44pt)
    touchTarget: {
      minimum: 44,       // Minimum touch target
      comfortable: 48,   // Comfortable touch target
    },
    
    // Focus indicators
    focus: {
      outlineWidth: 2,
      outlineOffset: 2,
      outlineColor: '#007AFF', // systemBlue
    },
  },

  // Performance and Rendering
  performance: {
    // Optimization thresholds
    dataPointThreshold: 1000,  // When to start optimizing
    animationThreshold: 500,   // When to reduce animations
    
    // Rendering preferences
    preferHardwareAcceleration: true,
    maxFrameRate: 60,
    
    // Memory management
    maxCachedCharts: 5,
    cacheExpirationMs: 300000, // 5 minutes
  },
} as const;

// Type definitions for type safety
export interface GraphColorVariant {
  light: string;
  dark: string;
}

export interface ChartColors {
  positive: GraphColorVariant;
  negative: GraphColorVariant;
  neutral: GraphColorVariant;
  warning: GraphColorVariant;
}

export interface SpacingTokens {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface AnimationTokens {
  drawOn: string;
  drawOff: string;
  dataTransition: string;
  hoverState: string;
  timing: {
    fast: number;
    medium: number;
    slow: number;
  };
}

// Utility functions for theme access
export const getGraphColor = (
  type: keyof typeof appleGraphTokens.colors.chart,
  theme: 'light' | 'dark' = 'dark'
): string => {
  const colorPath = appleGraphTokens.colors.chart[type];
  if (typeof colorPath === 'object' && 'light' in colorPath && 'dark' in colorPath) {
    return colorPath[theme];
  }
  // Fallback for extended colors
  if (type in appleGraphTokens.colors.chart.extended) {
    return appleGraphTokens.colors.chart.extended[type as keyof typeof appleGraphTokens.colors.chart.extended][theme];
  }
  return appleGraphTokens.colors.neutral[theme];
};

export const getGraphSpacing = (size: keyof Omit<typeof appleGraphTokens.spacing, 'chart'>): string => {
  const value = appleGraphTokens.spacing[size];
  return `${value}px`;
};

export const getChartSpacing = (size: keyof typeof appleGraphTokens.spacing.chart): string => {
  return `${appleGraphTokens.spacing.chart[size]}px`;
};

export const getAnimationTiming = (type: keyof typeof appleGraphTokens.animation.timing): string => {
  return `${appleGraphTokens.animation.timing[type]}ms`;
};

export const getAnimationCurve = (type: keyof Pick<typeof appleGraphTokens.animation, 'standard' | 'ios' | 'bounce' | 'drawOn' | 'drawOff' | 'dataTransition' | 'hoverState' | 'selection'>): string => {
  return appleGraphTokens.animation[type];
};

// Reduced motion support utilities
export const shouldReduceMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const getAnimationDuration = (durationType: keyof typeof appleGraphTokens.animation.duration): string => {
  const duration = shouldReduceMotion() 
    ? appleGraphTokens.animation.reducedMotion.fallbackDuration
    : appleGraphTokens.animation.duration[durationType];
  return `${duration}ms`;
};

export const getOptimalAnimationDuration = (durationType: keyof typeof appleGraphTokens.animation.duration): number => {
  return shouldReduceMotion() 
    ? appleGraphTokens.animation.reducedMotion.fallbackDuration
    : appleGraphTokens.animation.duration[durationType];
};

// Performance-optimized animation configuration
export const getPerformantAnimationConfig = (durationType: keyof typeof appleGraphTokens.animation.duration) => {
  const duration = getOptimalAnimationDuration(durationType);
  const reducedMotion = shouldReduceMotion();
  
  return {
    duration,
    easing: reducedMotion ? 'ease' : appleGraphTokens.animation.ios,
    willChange: appleGraphTokens.animation.performance.enableWillChange ? 'transform, opacity' : 'auto',
    transformGPU: appleGraphTokens.animation.performance.preferTransform,
  };
};

// Chart-specific animation presets
export const getChartAnimationPreset = (chartType: 'line' | 'area' | 'bar' | 'stacked' | 'hover' | 'selection') => {
  const reducedMotion = shouldReduceMotion();
  
  if (reducedMotion) {
    return {
      duration: 0,
      easing: 'ease',
      delay: 0,
    };
  }
  
  switch (chartType) {
    case 'line':
      return {
        duration: appleGraphTokens.animation.duration.chartDrawing,
        easing: appleGraphTokens.animation.ios,
        delay: 0,
      };
    case 'area':
      return {
        duration: appleGraphTokens.animation.duration.areaFill,
        easing: appleGraphTokens.animation.ios,
        delay: 100, // Slight delay for stroke-then-fill coordination
      };
    case 'bar':
    case 'stacked':
      return {
        duration: appleGraphTokens.animation.duration.barStagger,
        easing: appleGraphTokens.animation.ios,
        delay: 0,
      };
    case 'hover':
      return {
        duration: appleGraphTokens.animation.duration.fast,
        easing: appleGraphTokens.animation.hoverState,
        delay: 0,
      };
    case 'selection':
      return {
        duration: appleGraphTokens.animation.duration.micro,
        easing: appleGraphTokens.animation.selection,
        delay: 0,
      };
    default:
      return {
        duration: appleGraphTokens.animation.duration.standard,
        easing: appleGraphTokens.animation.standard,
        delay: 0,
      };
  }
};

export const getTextColor = (
  level: keyof typeof appleGraphTokens.colors.text,
  theme: 'light' | 'dark' = 'dark'
): string => {
  return appleGraphTokens.colors.text[level][theme];
};

export const getBackgroundColor = (
  type: 'system' | 'grouped',
  level: 'primary' | 'secondary',
  theme: 'light' | 'dark' = 'dark'
): string => {
  return appleGraphTokens.colors.background[type][level][theme];
};

// CSS Custom Properties Generator
export const generateGraphCSSProperties = (theme: 'light' | 'dark' = 'dark') => {
  const tokens = appleGraphTokens;
  
  return {
    // Colors
    '--graph-color-positive': getGraphColor('income', theme),
    '--graph-color-negative': getGraphColor('spending', theme),
    '--graph-color-neutral': getGraphColor('savings', theme),
    '--graph-color-warning': getGraphColor('debt', theme),
    
    // Text colors
    '--graph-text-primary': getTextColor('primary', theme),
    '--graph-text-secondary': getTextColor('secondary', theme),
    '--graph-text-tertiary': getTextColor('tertiary', theme),
    '--graph-text-quaternary': getTextColor('quaternary', theme),
    
    // Backgrounds
    '--graph-bg-primary': getBackgroundColor('system', 'primary', theme),
    '--graph-bg-secondary': getBackgroundColor('system', 'secondary', theme),
    
    // Spacing
    '--graph-spacing-xs': getGraphSpacing('xs'),
    '--graph-spacing-sm': getGraphSpacing('sm'),
    '--graph-spacing-md': getGraphSpacing('md'),
    '--graph-spacing-lg': getGraphSpacing('lg'),
    '--graph-spacing-xl': getGraphSpacing('xl'),
    '--graph-spacing-xxl': getGraphSpacing('xxl'),
    
    // Chart-specific spacing
    '--graph-chart-padding': getChartSpacing('padding'),
    '--graph-title-gap': getChartSpacing('titleGap'),
    '--graph-legend-gap': getChartSpacing('legendGap'),
    
    // Border radius
    '--graph-radius-sm': `${tokens.borderRadius.sm}px`,
    '--graph-radius-md': `${tokens.borderRadius.md}px`,
    '--graph-radius-lg': `${tokens.borderRadius.lg}px`,
    '--graph-radius-tooltip': `${tokens.borderRadius.tooltip}px`,
    
    // Typography
    '--graph-font-family': tokens.typography.fontFamily.primary,
    '--graph-font-size-title': `${tokens.typography.fontSize.chartTitle}px`,
    '--graph-font-size-axis': `${tokens.typography.fontSize.axisLabel}px`,
    '--graph-font-size-data': `${tokens.typography.fontSize.dataLabel}px`,
    '--graph-font-size-legend': `${tokens.typography.fontSize.legend}px`,
    '--graph-font-size-tooltip': `${tokens.typography.fontSize.tooltip}px`,
    
    // Animation - Apple Standard Easing
    '--graph-timing-standard': tokens.animation.standard,
    '--graph-timing-ios': tokens.animation.ios,
    '--graph-timing-bounce': tokens.animation.bounce,
    '--graph-timing-draw-on': tokens.animation.drawOn,
    '--graph-timing-draw-off': tokens.animation.drawOff,
    '--graph-timing-data-transition': tokens.animation.dataTransition,
    '--graph-timing-hover': tokens.animation.hoverState,
    '--graph-timing-selection': tokens.animation.selection,
    
    // Animation - Apple Standard Durations
    '--graph-duration-micro': `${tokens.animation.duration.micro}ms`,
    '--graph-duration-fast': `${tokens.animation.duration.fast}ms`,
    '--graph-duration-standard': `${tokens.animation.duration.standard}ms`,
    '--graph-duration-medium': `${tokens.animation.duration.medium}ms`,
    '--graph-duration-chart-drawing': `${tokens.animation.duration.chartDrawing}ms`,
    '--graph-duration-slow-drawing': `${tokens.animation.duration.slowDrawing}ms`,
    '--graph-duration-bar-stagger': `${tokens.animation.duration.barStagger}ms`,
    '--graph-duration-area-fill': `${tokens.animation.duration.areaFill}ms`,
    
    // Legacy duration support
    '--graph-duration-hover': `${tokens.animation.duration.fast}ms`,
  } as const;
};

// Compatibility with existing Liquid Spark theme
export const liquidSparkGraphIntegration = {
  // Map Apple colors to existing Liquid Spark structure
  financial: {
    positive: appleGraphTokens.colors.positive.dark,    // Use dark theme as default
    negative: appleGraphTokens.colors.negative.dark,
    neutral: appleGraphTokens.colors.neutral.dark,
  },
  
  // Enhanced glass effects with Apple backgrounds
  glass: {
    chartBackground: 'rgba(28, 28, 30, 0.8)',          // Based on Apple dark secondary
    chartBorder: 'rgba(235, 235, 245, 0.12)',          // Apple separator dark
    tooltipBackground: 'rgba(28, 28, 30, 0.95)',       // Semi-opaque for tooltips
    tooltipBorder: 'rgba(235, 235, 245, 0.2)',         // Stronger border for tooltips
  },
  
  // Maintain compatibility with existing dark theme
  darkTheme: {
    background: '#0b0d11',  // Existing app background
    cardBackground: 'rgba(28, 28, 30, 0.6)', // Apple-inspired card background
    textPrimary: appleGraphTokens.colors.text.primary.dark,
    textSecondary: appleGraphTokens.colors.text.secondary.dark,
  },
} as const;

// Export type for the entire token system
export type AppleGraphTokens = typeof appleGraphTokens;
export type LiquidSparkGraphIntegration = typeof liquidSparkGraphIntegration;

// Default export
export default appleGraphTokens;