import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const ThemeToggle = ({ className = '' }: { className?: string }) => {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before accessing DOM
  useEffect(() => {
    setMounted(true);
    // Check current theme from document
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  // Render loading state instead of early return to maintain hook consistency
  if (!mounted) {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className="w-12 h-7 opacity-0" />
      </div>
    );
  }

  const handleToggle = (checked: boolean) => {
    setIsDark(checked);
    
    // Update document class
    if (checked) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className={cn("flex items-center gap-2 sm:gap-3", className)}>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Moon 
          className={cn(
            "w-3 h-3 sm:w-4 sm:h-4 transition-colors duration-300",
            !isDark ? "text-blue-400" : "text-white/40"
          )}
          aria-hidden="true" 
        />
        
        <Switch
          checked={isDark}
          onCheckedChange={handleToggle}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          className={cn(
            // Enhanced iOS26 styling with proper background colors
            "data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-600/60",
            "dark:data-[state=checked]:bg-blue-500 dark:data-[state=unchecked]:bg-gray-500/40",
            // Additional shadow and border for definition
            "shadow-inner border border-white/10",
            // Smooth transitions
            "transition-all duration-300 ease-out"
          )}
        />
        
        <Sun 
          className={cn(
            "w-3 h-3 sm:w-4 sm:h-4 transition-colors duration-300",
            isDark ? "text-yellow-400" : "text-white/40"
          )}
          aria-hidden="true" 
        />
      </div>
      
      <span className="sr-only">
        {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      </span>
    </div>
  );
};

export default ThemeToggle;