import React, { FC, PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

export interface CardShellProps extends PropsWithChildren {
  accent: 'green' | 'yellow' | 'blue' | 'red' | 'purple';
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

/**
 * Unified card component with glass morphism and gradient accents
 * Based on Eco Impact & Wellness Score card design
 */
export const CardShell: FC<CardShellProps> = ({ 
  accent, 
  children, 
  className,
  onClick,
  hoverable = false 
}) => {
  // Base classes for glass morphism effect
  const baseClasses = cn(
    // Core glass effect
    'relative overflow-hidden rounded-xl',
    'bg-zinc-800/40 backdrop-blur',
    'ring-1 ring-zinc-700/60',
    'shadow-[inset_0_0_0_1px_rgba(255,255,255,.05)]',
    
    // Hover states
    hoverable && 'transition-all duration-300',
    hoverable && onClick && 'cursor-pointer',
    hoverable && 'hover:scale-[1.02] hover:ring-zinc-600/60',
    
    // Custom classes
    className
  );

  // Gradient overlay classes based on accent
  const gradientClasses = {
    green: 'gradient-green',
    yellow: 'gradient-yellow',
    blue: 'gradient-blue',
    red: 'gradient-red',
    purple: 'gradient-purple'
  };

  return (
    <div 
      className={baseClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {/* Gradient overlay */}
      <div 
        className={cn(
          'absolute inset-0 opacity-30 pointer-events-none',
          gradientClasses[accent]
        )} 
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Re-export for convenience
export default CardShell; 