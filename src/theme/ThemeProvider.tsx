/**
 * Vueni Theme Provider - React Context for Unified Theme System
 *
 * Provides the unified theme to all components throughout the app.
 * Now supports both light and dark modes with toggle functionality.
 */

import React, { createContext, useContext, useMemo, ReactNode, useState, useEffect } from 'react';
import {
  vueniTheme,
  generateCSSProperties,
} from './unified';
import {
  VueniComponents,
  VueniThemeModes,
  generateVueniCSSPropertiesWithTheme,
} from './colors/vueniPalette';

// Theme mode type
export type ThemeMode = 'light' | 'dark';

// Enhanced theme context value
export interface VueniThemeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
  theme: typeof vueniTheme;
  colors: typeof VueniComponents;
  themeModeColors: typeof VueniThemeModes;
}

// Theme context
const VueniThemeContext = createContext<VueniThemeContextValue | undefined>(
  undefined
);

// Hook for accessing theme
export const useVueniTheme = () => {
  const context = useContext(VueniThemeContext);
  if (!context) {
    throw new Error('useVueniTheme must be used within a VueniThemeProvider');
  }
  return context;
};

// Theme provider props
interface VueniThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
}

// Local storage key for theme preference
const THEME_STORAGE_KEY = 'vueni-theme-mode';

// Theme provider component
export const VueniThemeProvider: React.FC<VueniThemeProviderProps> = ({
  children,
  defaultMode = 'dark', // Vueni primarily dark mode by design
}) => {
  // Initialize theme mode from localStorage or default
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode;
      if (savedMode === 'light' || savedMode === 'dark') {
        return savedMode;
      }
    }
    return defaultMode;
  });

  // Theme mode management functions
  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, newMode);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };

  // Generate CSS custom properties for current mode
  const cssProperties = useMemo(() => {
    return {
      ...generateCSSProperties(),
      ...generateVueniCSSPropertiesWithTheme(mode),
    };
  }, [mode]);

  // Theme context value
  const contextValue: VueniThemeContextValue = useMemo(
    () => ({
      mode,
      toggleMode,
      setMode,
      theme: vueniTheme,
      colors: VueniComponents,
      themeModeColors: VueniThemeModes,
    }),
    [mode]
  );

  // Apply CSS custom properties and mode classes to document root
  React.useEffect(() => {
    const rootElement = document.documentElement;

    // Apply all theme CSS properties
    Object.entries(cssProperties).forEach(([property, value]) => {
      rootElement.style.setProperty(property, value);
    });

    // Apply theme mode classes
    rootElement.classList.remove('light', 'dark');
    rootElement.classList.add(mode);

    // Set data attribute for easier CSS targeting
    rootElement.setAttribute('data-theme', mode);

    // Set primary font family on body
    document.body.style.fontFamily = vueniTheme.typography.fontFamily.primary;

    // Clean up function
    return () => {
      Object.keys(cssProperties).forEach((property) => {
        rootElement.style.removeProperty(property);
      });
    };
  }, [cssProperties, mode]);

  return (
    <VueniThemeContext.Provider value={contextValue}>
      {children}
    </VueniThemeContext.Provider>
  );
};

// Convenience hooks for specific theme parts
export const useThemeColors = () => {
  const { theme } = useVueniTheme();
  return theme.colors;
};

export const useThemeTypography = () => {
  const { theme } = useVueniTheme();
  return theme.typography;
};

export const useThemeSpacing = () => {
  const { theme } = useVueniTheme();
  return theme.spacing;
};

export const useThemeGlass = () => {
  const { theme } = useVueniTheme();
  return theme.glass;
};

export const useThemeCards = () => {
  const { theme } = useVueniTheme();
  return theme.cards;
};

// Utility hook for semantic colors
export const useSemanticColors = () => {
  const { theme } = useVueniTheme();

  return {
    // Semantic aliases
    primary: theme.colors.palette.primary,
    success: theme.colors.palette.success,
    danger: theme.colors.palette.danger,
    warning: theme.colors.palette.warning,
    neutral: theme.colors.palette.neutral,

    // Financial colors
    financial: theme.colors.semantic.financial,

    // Status colors
    status: theme.colors.semantic.status,

    // Chart colors (from chart system)
    chart: theme.charts.colors,
  };
};

// Utility hook for glass effects with Tailwind classes
export const useGlassClasses = () => {
  const { theme } = useVueniTheme();

  return {
    subtle: `${theme.cards.background.default} ${theme.cards.border.default} ${theme.glass.subtle.backdrop}`,
    default: `${theme.cards.background.hover} ${theme.cards.border.default} ${theme.glass.default.backdrop}`,
    prominent: `${theme.cards.background.active} ${theme.cards.border.hover} ${theme.glass.prominent.backdrop}`,
  };
};

// HOC for automatically providing theme to components
export function withVueniTheme<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  const WrappedComponent = (props: P) => (
    <VueniThemeProvider>
      <Component {...props} />
    </VueniThemeProvider>
  );

  WrappedComponent.displayName = `withVueniTheme(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Re-export theme for direct access when needed
export { vueniTheme } from './unified';

// Default export
export default VueniThemeProvider;
