import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = 'liquid_spark_theme';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    // Load theme from localStorage or system preference
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (storedTheme) {
      setThemeState(storedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setThemeState('light');
    }
  }, []);

  useEffect(() => {
    // Persist theme and update class
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    // Remove both classes first to avoid conflicts
    document.documentElement.classList.remove('light', 'dark');
    // Add the appropriate class (shadcn/ui expects 'dark' class for dark mode)
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 