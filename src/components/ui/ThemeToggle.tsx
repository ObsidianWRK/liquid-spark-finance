import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'p-2 rounded-lg',
  md: 'p-3 rounded-xl',
  lg: 'p-4 rounded-2xl',
};

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className, size = 'md' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      className={cn(
        'bg-white/[0.05] hover:bg-white/[0.08] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400/50',
        sizeMap[size],
        className
      )}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-white/80" />
      ) : (
        <Sun className="w-5 h-5 text-white/80" />
      )}
    </button>
  );
};

export default ThemeToggle; 