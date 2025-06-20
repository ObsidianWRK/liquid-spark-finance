import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface BackButtonProps {
  /** Fallback path when no history is available */
  fallbackPath?: string;
  /** Custom className for styling */
  className?: string;
  /** Button label for accessibility */
  label?: string;
  /** Icon component to use instead of default ArrowLeft */
  icon?: React.ComponentType<{ className?: string }>;
  /** Additional click handler */
  onClick?: () => void;
  /** Button variant */
  variant?: 'default' | 'ghost' | 'minimal';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * BackButton Component
 * 
 * Implements proper back navigation that pops from browser history.
 * Falls back to a specified path when no history is available (e.g., deep links).
 * 
 * @example
 * ```tsx
 * // Basic usage with default fallback to dashboard
 * <BackButton />
 * 
 * // Custom fallback for account pages
 * <BackButton fallbackPath="/accounts" label="Back to Accounts" />
 * 
 * // Minimal styling for headers
 * <BackButton variant="minimal" size="sm" />
 * ```
 */
export const BackButton: React.FC<BackButtonProps> = ({
  fallbackPath = '/',
  className,
  label = 'Back',
  icon: IconComponent = ArrowLeft,
  onClick,
  variant = 'default',
  size = 'md',
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Call custom onClick handler if provided
    onClick?.();

    // Check if there's navigation history available
    // window.history.length > 2 means user has navigated within the app
    // (initial load creates 1 entry, first navigation creates 2)
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      // No history available (direct link, page refresh), use fallback
      navigate(fallbackPath);
    }
  };

  // Style variants
  const variants = {
    default: 'flex items-center gap-2 px-3 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/[0.05] transition-colors',
    ghost: 'flex items-center gap-2 px-3 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/[0.05] transition-colors border border-white/10',
    minimal: 'flex items-center gap-2 text-white/80 hover:text-white transition-colors',
  };

  const sizes = {
    sm: 'p-2 text-sm min-h-[36px]',
    md: 'px-3 py-2 min-h-[44px]',
    lg: 'px-4 py-3 text-lg min-h-[48px]',
  };

  return (
    <button
      onClick={handleBack}
      className={cn(
        variants[variant],
        sizes[size],
        'focus:outline-none focus:ring-2 focus:ring-blue-400/50',
        'touch-manipulation', // Optimize for touch devices
        className
      )}
      aria-label={label}
      type="button"
    >
      <IconComponent className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
      <span className="font-medium">{label}</span>
    </button>
  );
};

/**
 * IconBackButton Component
 * 
 * Simplified version with just the icon for compact layouts
 */
export const IconBackButton: React.FC<Omit<BackButtonProps, 'label'> & { 
  ariaLabel?: string;
}> = ({
  fallbackPath = '/',
  className,
  icon: IconComponent = ArrowLeft,
  onClick,
  ariaLabel = 'Go back',
  size = 'md',
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    onClick?.();
    
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  const sizes = {
    sm: 'p-2 w-8 h-8',
    md: 'p-2 w-10 h-10',
    lg: 'p-3 w-12 h-12',
  };

  return (
    <button
      onClick={handleBack}
      className={cn(
        'flex items-center justify-center rounded-xl',
        'text-white/80 hover:text-white hover:bg-white/[0.05] transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-blue-400/50',
        'touch-manipulation',
        sizes[size],
        className
      )}
      aria-label={ariaLabel}
      type="button"
    >
      <IconComponent className="w-4 h-4" aria-hidden="true" />
    </button>
  );
};

export default BackButton; 