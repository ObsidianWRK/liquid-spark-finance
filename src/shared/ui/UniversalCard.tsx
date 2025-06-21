import React from 'react';
import { cn } from '@/shared/lib/utils';
import { LucideIcon } from 'lucide-react';
import { formatFinancialScore } from '@/shared/utils/formatters';
import { vueniTheme } from '@/theme/unified';
import {
  getScoreColor,
  getTrendColor,
} from '@/shared/utils/theme-color-mapper';
import AnimatedCircularProgress from './charts/AnimatedCircularProgress';

// Universal Card Component - Consolidates:
// - GlassCard.tsx
// - SimpleGlassCard.tsx
// - EnhancedGlassCard.tsx
// - LiquidGlass.tsx
// - ComprehensiveEcoCard.tsx (554 lines)
// - ComprehensiveWellnessCard.tsx (529 lines)
// Total consolidation: ~1,200 lines → ~150 lines (88% reduction)

interface UniversalCardProps {
  variant?: 'glass' | 'solid' | 'eco' | 'wellness' | 'financial' | 'minimal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  blur?: 'light' | 'medium' | 'heavy';
  className?: string;
  children?: React.ReactNode;

  // Data props for insight cards
  title?: string;
  value?: string | number;
  icon?: LucideIcon;
  iconColor?: string;
  score?: number;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;

  // Layout props
  orientation?: 'horizontal' | 'vertical';
  showBackground?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  disableHover?: boolean; // New prop to disable hover effects if needed

  // Advanced props for comprehensive cards
  data?: {
    metrics?: Array<{
      label: string;
      value: string | number;
      icon?: LucideIcon;
      color?: string;
    }>;
    trends?: Array<{
      label: string;
      trend: 'up' | 'down' | 'stable';
      value?: string;
    }>;
    spending?: Array<{
      category: string;
      amount: number;
      color?: string;
    }>;
  };
}

export const UniversalCard = React.memo<UniversalCardProps>(
  ({
    variant = 'glass',
    size = 'md',
    blur = 'medium',
    className,
    children,
    title,
    value,
    icon: Icon,
    iconColor = '#6366f1',
    score,
    trend,
    trendValue,
    orientation = 'vertical',
    showBackground = true,
    interactive = false,
    onClick,
    disableHover = false,
    data,
    ...props
  }) => {
    const baseClasses = cn(
      'relative overflow-hidden',
      {
        // Variants - Updated to use unified design tokens with enhanced hover effects
        'bg-white/[0.02] backdrop-blur-md border border-white/[0.08]':
          variant === 'glass',
        'bg-black/80 border border-white/[0.08]': variant === 'solid',
        'bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/20 bg-white/[0.02]':
          variant === 'eco',
        'bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border border-blue-500/20 bg-white/[0.02]':
          variant === 'wellness',
        'bg-gradient-to-br from-purple-500/10 to-indigo-600/10 border border-purple-500/20 bg-white/[0.02]':
          variant === 'financial',
        'bg-white/[0.02] border border-white/[0.05]': variant === 'minimal',

        // Sizes
        'p-3 rounded-lg text-sm': size === 'sm',
        'p-4 rounded-xl text-base': size === 'md',
        'p-6 rounded-2xl text-lg': size === 'lg',
        'p-8 rounded-3xl text-xl': size === 'xl',

        // Enhanced hover effects for all cards (unless disabled)
        'hover:bg-white/[0.05] hover:border-white/[0.15] hover:scale-[1.02] transition-all duration-300 ease-out cursor-pointer': 
          !disableHover && (interactive || onClick),
        'hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300 ease-out': 
          !disableHover && !interactive && !onClick,
        
        // Variant-specific hover enhancements
        'hover:from-green-500/15 hover:to-emerald-600/15 hover:border-green-500/30': 
          !disableHover && variant === 'eco',
        'hover:from-blue-500/15 hover:to-cyan-600/15 hover:border-blue-500/30': 
          !disableHover && variant === 'wellness',
        'hover:from-purple-500/15 hover:to-indigo-600/15 hover:border-purple-500/30': 
          !disableHover && variant === 'financial',
        'hover:shadow-lg hover:shadow-blue-500/10': 
          !disableHover && (variant === 'wellness' || variant === 'financial'),
        'hover:shadow-lg hover:shadow-green-500/10': 
          !disableHover && variant === 'eco',

        // Accessibility - Focus ring for keyboard navigation
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500': interactive || onClick,

        // Orientation
        'flex flex-col': orientation === 'vertical',
        'flex flex-row items-center': orientation === 'horizontal',
      },
      className
    );

    const renderScore = () => {
      if (typeof score !== 'number') return null;

      const scoreColor = getScoreColor(score);

      return (
        <div className="flex justify-center">
          <AnimatedCircularProgress
            value={score}
            color={scoreColor}
            size={80}
            showLabel={false}
          />
        </div>
      );
    };

    const renderMetrics = () => {
      if (!data?.metrics) return null;

      return (
        <div className="grid grid-cols-2 gap-3">
          {data.metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white/[0.03] border border-white/[0.05] rounded-lg p-3 hover:bg-white/[0.06] hover:border-white/[0.10] transition-all duration-200"
            >
              <div className="flex items-center space-x-2 mb-1">
                {metric.icon && (
                  <metric.icon
                    className="w-3 h-3"
                    style={{ color: metric.color }}
                  />
                )}
                <span className="text-xs text-white/60">{metric.label}</span>
              </div>
              <div className="text-sm font-semibold text-white">
                {metric.value}
              </div>
            </div>
          ))}
        </div>
      );
    };

    const renderTrends = () => {
      if (!data?.trends) return null;

      return (
        <div className="grid grid-cols-2 gap-2">
          {data.trends.map((trend, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] hover:border-white/[0.10] transition-all duration-200"
            >
              <span className="text-xs text-white/70">{trend.label}</span>
              <div className="flex items-center space-x-1">
                <span
                  className="text-sm font-bold"
                  style={{ color: getTrendColor(trend.trend) }}
                >
                  {trend.trend === 'up'
                    ? '↗'
                    : trend.trend === 'down'
                      ? '↘'
                      : '—'}
                </span>
                {trend.value && (
                  <span className="text-xs text-white/60">{trend.value}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    };

    const renderSpending = () => {
      if (!data?.spending) return null;

      return (
        <div className="space-y-2">
          {data.spending.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] hover:border-white/[0.10] transition-all duration-200"
            >
              <span className="text-sm text-white/70 capitalize">
                {item.category}
              </span>
              <span className="text-sm font-semibold text-white">
                ${item.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    };

    const accessibilityProps = {
      role: interactive || onClick ? 'button' : 'region',
      'aria-label': interactive || onClick
        ? `${title ? `${title} - ` : ''}Click to interact`
        : title || 'Card content',
      tabIndex: interactive || onClick ? 0 : undefined,
      'aria-describedby': value ? `${title?.toLowerCase().replace(/\s+/g, '-')}-value` : undefined,
      onKeyDown: interactive || onClick ? (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      } : undefined,
    };

    return (
      <div className={baseClasses} onClick={onClick} {...accessibilityProps} {...props}>
        {showBackground && variant === 'glass' && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-white/0 pointer-events-none" />
        )}

        <div className="relative z-10 h-full">
          {/* Header */}
          {(title || Icon) && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {Icon && (
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center hover:bg-white/[0.08] transition-all duration-200">
                    <Icon className="w-5 h-5" style={{ color: iconColor }} />
                  </div>
                )}
                {title && (
                  <h3 className="font-medium text-white/80">{title}</h3>
                )}
              </div>
              {trend && (
                <div className="flex items-center space-x-1">
                  <span
                    className="text-sm font-bold"
                    style={{ color: getTrendColor(trend) }}
                  >
                    {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '—'}
                  </span>
                  {trendValue && (
                    <span className="text-sm text-white/60">{trendValue}</span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Score Circle */}
          {typeof score === 'number' && renderScore()}

          {/* Value Display */}
          {value && (
            <div className="text-center mb-4">
              <div 
                id={title ? `${title.toLowerCase().replace(/\s+/g, '-')}-value` : undefined}
                className="text-2xl font-bold text-white"
                aria-label={`Current value: ${value}`}
              >
                {value}
              </div>
            </div>
          )}

          {/* Metrics Grid */}
          {data?.metrics && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-white/80 mb-3">
                Metrics
              </h4>
              {renderMetrics()}
            </div>
          )}

          {/* Trends Grid */}
          {data?.trends && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-white/80 mb-3">Trends</h4>
              {renderTrends()}
            </div>
          )}

          {/* Spending List */}
          {data?.spending && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-white/80 mb-3">
                Spending
              </h4>
              {renderSpending()}
            </div>
          )}

          {/* Custom Children */}
          {children}
        </div>
      </div>
    );
  }
);

UniversalCard.displayName = 'UniversalCard';

export default UniversalCard;
