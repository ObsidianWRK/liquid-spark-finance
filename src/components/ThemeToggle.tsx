import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ className = '' }: { className?: string }) => {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before accessing DOM
  useEffect(() => {
    setMounted(true);
    // Check current theme from document
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  if (!mounted) return null;

  const handleToggle = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    // Update document class
    if (newTheme) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  };

  return (
    <button
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={!isDark}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`p-2 rounded-full transition-all duration-300 flex items-center justify-center hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 active:scale-95 ${className}`}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      type="button"
    >
      {isDark ? (
        <Sun 
          className="w-5 h-5 text-yellow-400 transition-transform duration-300 hover:rotate-12" 
          aria-hidden="true" 
        />
      ) : (
        <Moon 
          className="w-5 h-5 text-blue-600 transition-transform duration-300 hover:-rotate-12" 
          aria-hidden="true" 
        />
      )}
      <span className="sr-only">
        {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      </span>
    </button>
  );
};

export default ThemeToggle;