import React, { memo, forwardRef } from 'react';
import { cn } from '@/shared/lib/utils';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';

// Enhanced Glass Card Component
export interface VueniGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'prominent' | 'enterprise' | 'mobile';
  blur?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  opacity?: 'low' | 'medium' | 'high';
  glow?: boolean;
  animated?: boolean;
  children: React.ReactNode;
}

const glassVariants = {
  default: 'bg-black/20 backdrop-blur-sm border-white/10',
  subtle: 'bg-white/5 backdrop-blur-sm border-white/5',
  prominent: 'bg-black/30 backdrop-blur-md border-white/20',
  enterprise: 'bg-slate-900/80 backdrop-blur-sm border-slate-600/30',
  mobile: 'bg-black/25 backdrop-blur-sm border-white/10',
};

const blurClasses = {
  none: 'backdrop-blur-none',
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl',
};

const opacityClasses = {
  low: 'bg-opacity-10',
  medium: 'bg-opacity-20',
  high: 'bg-opacity-30',
};

export const VueniGlassCard = memo(forwardRef<HTMLDivElement, VueniGlassCardProps>(({
  variant = 'default',
  blur = 'sm',
  opacity = 'medium',
  glow = false,
  animated = false,
  children,
  className,
  ...props
}, ref) => {
  return (
    <Card
      ref={ref}
      className={cn(
        glassVariants[variant],
        blurClasses[blur],
        glow && 'shadow-lg shadow-white/5',
        animated && 'transition-all duration-300 hover:bg-opacity-30 hover:border-white/30',
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}));

VueniGlassCard.displayName = 'VueniGlassCard';

// Enhanced Button Component
export interface VueniButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'glass' | 'glow' | 'minimal' | 'enterprise';
  size?: 'sm' | 'md' | 'lg';
  glowing?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const buttonVariants = {
  default: 'bg-white/10 hover:bg-white/20 border-white/20 text-white',
  glass: 'bg-white/5 hover:bg-white/15 backdrop-blur-sm border-white/10 text-white',
  glow: 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border-blue-500/30 text-white shadow-lg shadow-blue-500/10',
  minimal: 'bg-transparent hover:bg-white/5 border-transparent text-white/70 hover:text-white',
  enterprise: 'bg-slate-700/50 hover:bg-slate-600/50 border-slate-600/30 text-slate-200',
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const VueniButton = memo(forwardRef<HTMLButtonElement, VueniButtonProps>(({
  variant = 'default',
  size = 'md',
  glowing = false,
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}, ref) => {
  return (
    <Button
      ref={ref}
      className={cn(
        buttonVariants[variant],
        buttonSizes[size],
        glowing && 'animate-pulse',
        loading && 'opacity-70 cursor-not-allowed',
        'transition-all duration-200 backdrop-blur-sm',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      <div className="flex items-center gap-2">
        {loading && (
          <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
        )}
        {icon && !loading && icon}
        {children}
      </div>
    </Button>
  );
}));

VueniButton.displayName = 'VueniButton';

// Metric Display Component
export interface VueniMetricProps {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  icon?: React.ReactNode;
  variant?: 'default' | 'compact' | 'prominent';
  color?: 'blue' | 'green' | 'red' | 'purple' | 'yellow';
}

const metricColors = {
  blue: 'text-blue-400 bg-blue-500/20',
  green: 'text-green-400 bg-green-500/20', 
  red: 'text-red-400 bg-red-500/20',
  purple: 'text-purple-400 bg-purple-500/20',
  yellow: 'text-yellow-400 bg-yellow-500/20',
};

export const VueniMetric = memo(({
  label,
  value,
  change,
  trend,
  icon,
  variant = 'default',
  color = 'blue',
}: VueniMetricProps) => {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        {icon && (
          <div className={cn('p-1.5 rounded', metricColors[color])}>
            <div className="w-3 h-3">{icon}</div>
          </div>
        )}
        <div>
          <div className="text-white font-medium text-sm">{value}</div>
          <div className="text-white/60 text-xs">{label}</div>
        </div>
      </div>
    );
  }

  if (variant === 'prominent') {
    return (
      <VueniGlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white/70 text-sm font-medium">{label}</h3>
          {icon && (
            <div className={cn('p-2 rounded-lg', metricColors[color])}>
              <div className="w-5 h-5">{icon}</div>
            </div>
          )}
        </div>
        <div className="flex items-end justify-between">
          <div className="text-white font-bold text-2xl">{value}</div>
          {change !== undefined && (
            <div className={cn(
              'flex items-center text-sm',
              change > 0 ? 'text-green-400' : change < 0 ? 'text-red-400' : 'text-white/60'
            )}>
              {change > 0 ? '↑' : change < 0 ? '↓' : '→'} {Math.abs(change)}%
            </div>
          )}
        </div>
      </VueniGlassCard>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {icon && (
        <div className={cn('p-2 rounded-lg', metricColors[color])}>
          <div className="w-4 h-4">{icon}</div>
        </div>
      )}
      <div>
        <div className="text-white font-semibold">{value}</div>
        <div className="text-white/60 text-sm">{label}</div>
        {change !== undefined && (
          <div className={cn(
            'text-xs',
            change > 0 ? 'text-green-400' : change < 0 ? 'text-red-400' : 'text-white/60'
          )}>
            {change > 0 ? '+' : ''}{change}%
          </div>
        )}
      </div>
    </div>
  );
});

VueniMetric.displayName = 'VueniMetric';

// Status Badge Component
export interface VueniStatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'pending';
  children: React.ReactNode;
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const statusColors = {
  success: 'bg-green-500/20 text-green-400 border-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  error: 'bg-red-500/20 text-red-400 border-red-500/30',
  info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  pending: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const statusSizes = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

export const VueniStatusBadge = memo(({
  status,
  children,
  variant = 'solid',
  size = 'sm',
}: VueniStatusBadgeProps) => {
  return (
    <span className={cn(
      statusColors[status],
      statusSizes[size],
      'rounded-full font-medium inline-flex items-center gap-1',
      variant === 'outline' && 'bg-transparent border',
      variant === 'ghost' && 'bg-transparent border-transparent'
    )}>
      {children}
    </span>
  );
});

VueniStatusBadge.displayName = 'VueniStatusBadge';

// Loading Skeleton Component
export interface VueniSkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const VueniSkeleton = memo(({
  variant = 'text',
  width,
  height,
  className,
}: VueniSkeletonProps) => {
  const baseClasses = 'animate-pulse bg-white/10 backdrop-blur-sm';
  
  if (variant === 'circular') {
    return (
      <div 
        className={cn(baseClasses, 'rounded-full', className)}
        style={{ width, height }}
      />
    );
  }
  
  if (variant === 'rectangular') {
    return (
      <div 
        className={cn(baseClasses, 'rounded-lg', className)}
        style={{ width, height }}
      />
    );
  }
  
  return (
    <div 
      className={cn(baseClasses, 'rounded h-4', className)}
      style={{ width }}
    />
  );
});

VueniSkeleton.displayName = 'VueniSkeleton';

// Layout Components
export const VueniContainer = memo(({ 
  children, 
  className,
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('container mx-auto px-4 sm:px-6 lg:px-8', className)} {...props}>
    {children}
  </div>
));

VueniContainer.displayName = 'VueniContainer';

export const VueniSection = memo(({ 
  children, 
  className,
  ...props 
}: React.HTMLAttributes<HTMLElement>) => (
  <section className={cn('py-8 lg:py-12', className)} {...props}>
    {children}
  </section>
));

VueniSection.displayName = 'VueniSection';

export const VueniGrid = memo(({ 
  children, 
  cols = '1',
  gap = '6',
  className,
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & {
  cols?: '1' | '2' | '3' | '4' | '5' | '6';
  gap?: '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12';
}) => (
  <div 
    className={cn(
      `grid grid-cols-1 gap-${gap}`,
      cols === '2' && 'md:grid-cols-2',
      cols === '3' && 'md:grid-cols-2 lg:grid-cols-3',
      cols === '4' && 'md:grid-cols-2 lg:grid-cols-4',
      cols === '5' && 'md:grid-cols-3 lg:grid-cols-5',
      cols === '6' && 'md:grid-cols-3 lg:grid-cols-6',
      className
    )} 
    {...props}
  >
    {children}
  </div>
));

VueniGrid.displayName = 'VueniGrid';

// Export all design system components
export const VueniDesignSystem = {
  GlassCard: VueniGlassCard,
  Button: VueniButton,
  Metric: VueniMetric,
  StatusBadge: VueniStatusBadge,
  Skeleton: VueniSkeleton,
  Container: VueniContainer,
  Section: VueniSection,
  Grid: VueniGrid,
} as const;

// Default export for backward compatibility
export default VueniDesignSystem;

// Design tokens for consistent styling
export const vueniTokens = {
  colors: {
    glass: {
      subtle: 'bg-white/5 border-white/5',
      default: 'bg-black/20 border-white/10',
      prominent: 'bg-black/30 border-white/20',
    },
    status: {
      success: 'text-green-400 bg-green-500/20',
      warning: 'text-yellow-400 bg-yellow-500/20',
      error: 'text-red-400 bg-red-500/20',
      info: 'text-blue-400 bg-blue-500/20',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem', 
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  blur: {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
  },
} as const;