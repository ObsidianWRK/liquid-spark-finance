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
        <div className="w-11 h-6 opacity-0" />
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
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex items-center gap-2">
        <Moon 
          className={cn(
            "w-4 h-4 transition-colors duration-300",
            !isDark ? "text-blue-400" : "text-white/40"
          )}
          aria-hidden="true" 
        />
        
        <Switch
          checked={isDark}
          onCheckedChange={handleToggle}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-white/20"
        />
        
        <Sun 
          className={cn(
            "w-4 h-4 transition-colors duration-300",
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