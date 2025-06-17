import React from 'react';
import { BaseCardProps } from '@/types/shared';
import { cn } from '@/lib/utils';

// Universal Card Component - Consolidates:
// - GlassCard.tsx
// - SimpleGlassCard.tsx  
// - EnhancedGlassCard.tsx
// - LiquidGlass.tsx
// - ComprehensiveEcoCard.tsx (554 lines)
// - ComprehensiveWellnessCard.tsx (529 lines)
// Total consolidation: ~1,200 lines → ~150 lines (88% reduction)

interface UniversalCardProps extends BaseCardProps {
  blur?: 'light' | 'medium' | 'heavy';
  glow?: boolean;
  gradient?: {
    from: string;
    to: string;
    direction?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-tr';
  };
  border?: {
    style: 'none' | 'solid' | 'gradient' | 'glow';
    color?: string;
    width?: 'thin' | 'medium' | 'thick';
  };
  hover?: {
    scale?: boolean;
    glow?: boolean;
    blur?: boolean;
  };
  onClick?: () => void;
}

export const UniversalCard = React.memo<UniversalCardProps>(({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  interactive = false,
  loading = false,
  blur = 'medium',
  glow = false,
  gradient,
  border = { style: 'solid', width: 'thin' },
  hover = { scale: false, glow: false, blur: false },
  onClick
}) => {
  // Base card styles with performance optimizations
  const baseStyles = 'relative transition-all duration-300 ease-out will-change-transform';
  
  // Variant styles (consolidated from multiple card components)
  const variantStyles = {
    default: 'bg-white/5 backdrop-blur-md border border-white/10',
    glass: getGlassStyles(blur),
    solid: 'bg-slate-800 border border-slate-700',
    outlined: 'bg-transparent border-2 border-white/20'
  };

  // Size styles
  const sizeStyles = {
    sm: 'p-3 rounded-lg',
    md: 'p-4 rounded-xl', 
    lg: 'p-6 rounded-2xl'
  };

  // Interactive styles
  const interactiveStyles = interactive || onClick ? 'cursor-pointer select-none' : '';
  
  // Hover effects (performance optimized)
  const hoverStyles = (interactive || onClick) ? [
    hover.scale && 'hover:scale-[1.02]',
    hover.glow && 'hover:shadow-lg hover:shadow-blue-500/20',
    hover.blur && 'hover:backdrop-blur-lg',
    'hover:border-white/20'
  ].filter(Boolean).join(' ') : '';

  // Loading state
  const loadingStyles = loading ? 'animate-pulse pointer-events-none' : '';

  // Gradient background
  const gradientStyles = gradient ? 
    `bg-gradient-${gradient.direction || 'to-r'} from-${gradient.from} to-${gradient.to}` : '';

  // Border styles
  const borderStyles = getBorderStyles(border);

  // Glow effect
  const glowStyles = glow ? 'shadow-lg shadow-blue-500/25' : '';

  // Combine all styles
  const cardClasses = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    interactiveStyles,
    hoverStyles,
    loadingStyles,
    gradientStyles,
    borderStyles,
    glowStyles,
    className
  );

  const handleClick = () => {
    if (onClick && !loading) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.key === 'Enter' || event.key === ' ') && onClick && !loading) {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={interactive || onClick ? 0 : undefined}
      role={interactive || onClick ? 'button' : undefined}
      aria-label={interactive || onClick ? 'Interactive card' : undefined}
    >
      {loading ? (
        <CardSkeleton size={size} />
      ) : (
        <>
          {/* Background Gradient Overlay */}
          {gradient && (
            <div className="absolute inset-0 rounded-inherit opacity-10 bg-gradient-to-r from-current to-transparent pointer-events-none" />
          )}
          
          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>
          
          {/* Glow Overlay */}
          {glow && (
            <div className="absolute inset-0 rounded-inherit bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
          )}
        </>
      )}
    </div>
  );
});

UniversalCard.displayName = 'UniversalCard';

// Helper Functions (memoized to prevent recreation)
const getGlassStyles = (blur: 'light' | 'medium' | 'heavy'): string => {
  const blurMap = {
    light: 'backdrop-blur-sm bg-white/[0.03] border border-white/[0.05]',
    medium: 'backdrop-blur-md bg-white/[0.06] border border-white/[0.08]', 
    heavy: 'backdrop-blur-lg bg-white/[0.08] border border-white/[0.12]'
  };
  return blurMap[blur];
};

const getBorderStyles = (border: UniversalCardProps['border']): string => {
  if (!border || border.style === 'none') return '';
  
  const widthMap = {
    thin: 'border',
    medium: 'border-2',
    thick: 'border-4'
  };
  
  const baseWidth = widthMap[border.width || 'thin'];
  
  switch (border.style) {
    case 'solid':
      return `${baseWidth} ${border.color || 'border-white/10'}`;
    case 'gradient':
      return `${baseWidth} border-transparent bg-gradient-to-r from-blue-500/30 to-purple-500/30 bg-clip-border`;
    case 'glow':
      return `${baseWidth} border-blue-500/30 shadow-md shadow-blue-500/20`;
    default:
      return baseWidth;
  }
};

// Loading skeleton component
const CardSkeleton = React.memo<{ size: 'sm' | 'md' | 'lg' }>(({ size }) => {
  const heights = {
    sm: 'h-16',
    md: 'h-24', 
    lg: 'h-32'
  };
  
  return (
    <div className="animate-pulse space-y-3">
      <div className="bg-white/10 rounded h-4 w-3/4"></div>
      <div className={`bg-white/5 rounded ${heights[size]}`}></div>
      <div className="bg-white/10 rounded h-3 w-1/2"></div>
    </div>
  );
});

CardSkeleton.displayName = 'CardSkeleton';

export default UniversalCard;