/**
 * Vueni Theme Provider - React Context for Unified Theme System
 * 
 * Provides the unified theme to all components throughout the app.
 * Only supports dark mode as per design requirements.
 */

import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { vueniTheme, type VueniThemeContextValue, generateCSSProperties } from './unified';

// Theme context
const VueniThemeContext = createContext<VueniThemeContextValue | undefined>(undefined);

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
}

// Theme provider component
export const VueniThemeProvider: React.FC<VueniThemeProviderProps> = ({ children }) => {
  // Generate CSS custom properties
  const cssProperties = useMemo(() => generateCSSProperties(), []);
  
  // Theme context value
  const contextValue: VueniThemeContextValue = useMemo(() => ({
    theme: vueniTheme,
    colorMode: 'dark',
  }), []);

  // Apply CSS custom properties to document root
  React.useEffect(() => {
    const rootElement = document.documentElement;
    
    // Apply all theme CSS properties
    Object.entries(cssProperties).forEach(([property, value]) => {
      rootElement.style.setProperty(property, value);
    });
    
    // Ensure dark mode class is applied
    rootElement.classList.add('dark');
    rootElement.classList.remove('light'); // Remove any light mode remnants
    
    // Set primary font family on body
    document.body.style.fontFamily = vueniTheme.typography.fontFamily.primary;
    
    // Clean up function
    return () => {
      Object.keys(cssProperties).forEach((property) => {
        rootElement.style.removeProperty(property);
      });
    };
  }, [cssProperties]);

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
    
    // Chart colors
    chart: theme.colors.semantic.chart,
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
export type { VueniTheme, VueniThemeContextValue } from './unified';

// Default export
export default VueniThemeProvider; 