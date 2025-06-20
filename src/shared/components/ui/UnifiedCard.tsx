import React, { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown, Minus, ArrowUp, ArrowDown } from 'lucide-react';
import { unifiedCardTokens, getCardClasses } from '@/theme/unified-card-tokens';

// UnifiedCard Component - Matches Financial Dashboard cards exactly
// Consolidates all 26+ card variants into one consistent design

interface UnifiedCardProps {
  // Core props
  title?: string;
  subtitle?: string;
  metric?: ReactNode;
  delta?: {
    value: number | string;
    format?: 'currency' | 'percentage' | 'number';
    label?: string; // e.g. "vs last month"
  };
  
  // Icon & Visual
  icon?: LucideIcon | ReactNode;
  iconColor?: string;
  trendDirection?: 'up' | 'down' | 'flat';
  
  // Layout & Styling
  variant?: 'default' | 'eco' | 'wellness' | 'financial';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
  
  // Extended content
  children?: ReactNode;
  
  // Special features (for specific card types)
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
  // Determine trend icon and color
  const getTrendIcon = () => {
    if (!trendDirection && !delta) return null;
    
    const direction = trendDirection || (delta && typeof delta.value === 'number' 
      ? (delta.value > 0 ? 'up' : delta.value < 0 ? 'down' : 'flat')
      : 'flat');
    
    switch (direction) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };
  
  const getTrendColor = () => {
    if (!trendDirection && !delta) return unifiedCardTokens.trend.flat;
    
    const direction = trendDirection || (delta && typeof delta.value === 'number' 
      ? (delta.value > 0 ? 'up' : delta.value < 0 ? 'down' : 'flat')
      : 'flat');
    
    return unifiedCardTokens.trend[direction];
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
    
    // Check if it's a Lucide icon component (function)
    if (typeof icon === 'function') {
      const IconComponent = icon;
      return <IconComponent className={unifiedCardTokens.iconChip.icon} />;
    }
    
    // Handle string icons (emojis)
    if (typeof icon === 'string') {
      return <span className="text-lg">{icon}</span>;
    }
    
    // Handle React elements
    if (React.isValidElement(icon)) {
      return icon;
    }
    
    // Fallback for anything else
    return <span className="text-sm">{String(icon)}</span>;
  };
  
  return (
    <div
      className={cn(
        getCardClasses(variant, size, interactive),
        className
      )}
      onClick={interactive ? onClick : undefined}
    >
      {/* Header Section */}
      {(icon || title || getTrendIcon() || badge) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div 
                className={unifiedCardTokens.iconChip.container}
                style={{ color: iconColor }}
              >
                {renderIcon()}
              </div>
            )}
            <div>
              {title && (
                <h3 className={unifiedCardTokens.text.title}>{title}</h3>
              )}
              {subtitle && (
                <p className={unifiedCardTokens.text.subtitle}>{subtitle}</p>
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
      
      {/* Metric Section */}
      {(metric || delta) && (
        <div className="space-y-2">
          {metric && (
            <p className={unifiedCardTokens.text.metric}>
              {metric}
            </p>
          )}
          
          {delta && (
            <div className={cn("flex items-center gap-2", unifiedCardTokens.text.delta)}>
              <span className={getTrendColor()}>
                {formatDelta()}
              </span>
              {delta.label && (
                <span className={unifiedCardTokens.text.label}>
                  {delta.label}
                </span>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Progress Bar (optional) */}
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
                backgroundColor: progress.color || '#3b82f6'
              }}
            />
          </div>
        </div>
      )}
      
      {/* Custom Children */}
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