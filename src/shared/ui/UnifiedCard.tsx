import React, { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown, Minus, ArrowUp, ArrowDown } from 'lucide-react';
import { getTrendColor } from '@/shared/utils/theme-color-mapper';
import { vueniTheme } from '@/theme/unified';

interface UnifiedCardProps {
  title?: string;
  subtitle?: string;
  metric?: ReactNode;
  delta?: {
    value: number | string;
    format?: 'currency' | 'percentage' | 'number';
    label?: string;
  };
  icon?: LucideIcon | ReactNode;
  iconColor?: string;
  trendDirection?: 'up' | 'down' | 'flat';
  variant?: 'default' | 'eco' | 'wellness' | 'financial';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
  children?: ReactNode;
  progress?: {
    value: number;
    max: number;
    color?: string;
    showLabel?: boolean;
  };
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'error' | 'info';
  };
}

export const UnifiedCard = React.memo<UnifiedCardProps>(({
  title,
  subtitle,
  metric,
  delta,
  icon,
  iconColor,
  trendDirection,
  variant = 'default',
  size = 'lg',
  className,
  interactive = false,
  onClick,
  children,
  progress,
  badge,
}) => {
  const getTrendIcon = () => {
    if (!trendDirection && !delta) return null;
    const direction = trendDirection || (delta && typeof delta.value === 'number' 
      ? (delta.value > 0 ? 'up' : delta.value < 0 ? 'down' : 'flat')
      : 'flat');
    switch (direction) {
      case 'up':
        return <ArrowUp style={{ color: vueniTheme.colors.palette.success }} className="w-4 h-4" />;
      case 'down':
        return <ArrowDown style={{ color: vueniTheme.colors.palette.danger }} className="w-4 h-4" />;
      default:
        return <Minus style={{ color: vueniTheme.colors.palette.neutral }} className="w-4 h-4" />;
    }
  };

  const formatDelta = () => {
    if (!delta) return null;
    const { value, format = 'number' } = delta;
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(typeof value === 'number' ? value : parseFloat(value));
      case 'percentage':
        return `${typeof value === 'number' && value >= 0 ? '+' : ''}${value}%`;
      default:
        return `${typeof value === 'number' && value >= 0 ? '+' : ''}${value}`;
    }
  };

  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === 'function') {
      const IconComponent = icon;
      return <IconComponent className="w-5 h-5" />;
    }
    if (typeof icon === 'string') {
      return <span className="text-lg">{icon}</span>;
    }
    if (React.isValidElement(icon)) {
      return icon;
    }
    return <span className="text-sm">{String(icon)}</span>;
  };

  const cardClasses = cn(
    'p-6 rounded-2xl border',
    {
        'bg-white/[0.02] border-white/[0.08]': variant === 'default',
        'bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/20': variant === 'eco',
        'bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border-blue-500/20': variant === 'wellness',
        'bg-gradient-to-br from-purple-500/10 to-indigo-600/10 border-purple-500/20': variant === 'financial',
    },
    {
        'card-hover': interactive,
    },
    className
  );

  return (
    <div
      className={cardClasses}
      onClick={interactive ? onClick : undefined}
    >
      {(icon || title || getTrendIcon() || badge) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.05]"
                style={{ color: iconColor }}
              >
                {renderIcon()}
              </div>
            )}
            <div>
              {title && (
                <h3 className="font-medium text-white/80">{title}</h3>
              )}
              {subtitle && (
                <p className="text-sm text-white/60">{subtitle}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {getTrendIcon()}
            {badge && (
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                {
                  'bg-green-500/20 text-green-400 border border-green-500/30': badge.variant === 'success',
                  'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30': badge.variant === 'warning',
                  'bg-red-500/20 text-red-400 border border-red-500/30': badge.variant === 'error',
                  'bg-blue-500/20 text-blue-400 border border-blue-500/30': badge.variant === 'info'
                }
              )}>
                {badge.text}
              </span>
            )}
          </div>
        </div>
      )}
      
      {(metric || delta) && (
        <div className="space-y-2">
          {metric && (
            <p className="text-2xl font-bold text-white">
              {metric}
            </p>
          )}
          
          {delta && (
            <div className="flex items-center gap-2 text-sm">
              <span style={{ color: getTrendColor(typeof delta.value === 'number' && delta.value > 0 ? 'up' : typeof delta.value === 'number' && delta.value < 0 ? 'down' : 'stable') }}>
                {formatDelta()}
              </span>
              {delta.label && (
                <span className="text-white/60">
                  {delta.label}
                </span>
              )}
            </div>
          )}
        </div>
      )}
      
      {progress && (
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-white/60">Progress</span>
            {progress.showLabel && (
              <span className="text-white/80">
                {((progress.value / progress.max) * 100).toFixed(0)}%
              </span>
            )}
          </div>
          <div className="relative h-2 bg-white/[0.05] rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${Math.min(100, (progress.value / progress.max) * 100)}%`,
                backgroundColor: progress.color || vueniTheme.colors.palette.primary
              }}
            />
          </div>
        </div>
      )}
      
      {children && (
        <div className={metric || delta || progress ? "mt-4" : ""}>
          {children}
        </div>
      )}
    </div>
  );
});

UnifiedCard.displayName = 'UnifiedCard';

// Keep UniversalCard as an alias for backwards compatibility during migration
export const UniversalCard = UnifiedCard; 