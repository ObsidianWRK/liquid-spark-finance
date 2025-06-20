import React from 'react';
import { ScoreCardData } from '@/types/shared';
import { UniversalCard } from '@/shared/ui/UniversalCard';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface OptimizedScoreCardProps {
  data: ScoreCardData;
  variant?: 'default' | 'simple' | 'enhanced' | 'refined';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Optimized Score Card - Consolidates all score card variations
// with performance optimizations and consistent styling
export const OptimizedScoreCard = React.memo<OptimizedScoreCardProps>(
  ({ data, variant = 'default', size = 'md', className = '' }) => {
    const { score, maxScore, label, description, color, trend } = data;

    // Calculate percentage and stroke
    const percentage = (score / maxScore) * 100;
    const strokeWidth = size === 'sm' ? 6 : size === 'lg' ? 12 : 8;
    const radius = size === 'sm' ? 35 : size === 'lg' ? 70 : 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    // Size-dependent dimensions
    const dimensions = {
      sm: { size: 80, textSize: 'text-lg', labelSize: 'text-xs' },
      md: { size: 120, textSize: 'text-2xl', labelSize: 'text-sm' },
      lg: { size: 160, textSize: 'text-3xl', labelSize: 'text-base' },
    };

    const { size: svgSize, textSize, labelSize } = dimensions[size];

    const getTrendIcon = () => {
      if (!trend) return null;

      const iconClass = 'w-4 h-4';
      switch (trend.direction) {
        case 'up':
          return <TrendingUp className={cn(iconClass, 'text-green-400')} />;
        case 'down':
          return <TrendingDown className={cn(iconClass, 'text-red-400')} />;
        default:
          return <Minus className={cn(iconClass, 'text-white/60')} />;
      }
    };

    const getVariantStyles = () => {
      switch (variant) {
        case 'simple':
          return {
            card: 'p-4',
            layout: 'flex items-center space-x-4',
            content: 'text-left',
          };
        case 'enhanced':
          return {
            card: 'p-6 bg-gradient-to-br from-white/10 to-white/5',
            layout: 'text-center space-y-4',
            content: 'space-y-2',
          };
        case 'refined':
          return {
            card: 'p-5 border-l-4',
            layout: 'flex items-center justify-between',
            content: 'text-left',
          };
        default:
          return {
            card: 'p-4',
            layout: 'text-center space-y-3',
            content: 'space-y-1',
          };
      }
    };

    const variantStyles = getVariantStyles();

    return (
      <UniversalCard
        variant="glass"
        className={cn(variantStyles.card, className)}
        style={variant === 'refined' ? { borderLeftColor: color } : undefined}
      >
        <div className={variantStyles.layout}>
          {/* Circular Progress */}
          <div className="relative flex items-center justify-center">
            <svg
              width={svgSize}
              height={svgSize}
              className="transform -rotate-90"
            >
              {/* Background Circle */}
              <circle
                cx={svgSize / 2}
                cy={svgSize / 2}
                r={radius}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth={strokeWidth}
                fill="transparent"
              />

              {/* Progress Circle */}
              <circle
                cx={svgSize / 2}
                cy={svgSize / 2}
                r={radius}
                stroke={color}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                style={{
                  filter: `drop-shadow(0 0 8px ${color}30)`,
                }}
              />
            </svg>

            {/* Score Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={cn('font-bold text-white', textSize)}>
                {score}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className={variantStyles.content}>
            <div className="flex items-center justify-center space-x-2">
              <h3 className={cn('font-semibold text-white', labelSize)}>
                {label}
              </h3>
              {trend && getTrendIcon()}
            </div>

            {description && (
              <p className="text-white/60 text-xs">{description}</p>
            )}

            {trend && (
              <div className="flex items-center justify-center space-x-1">
                <span
                  className={cn(
                    'text-xs font-medium',
                    trend.direction === 'up'
                      ? 'text-green-400'
                      : trend.direction === 'down'
                        ? 'text-red-400'
                        : 'text-white/60'
                  )}
                >
                  {trend.direction === 'up'
                    ? '+'
                    : trend.direction === 'down'
                      ? '-'
                      : ''}
                  {trend.percentage}%
                </span>
                <span className="text-xs text-white/60">vs last month</span>
              </div>
            )}
          </div>
        </div>
      </UniversalCard>
    );
  }
);

OptimizedScoreCard.displayName = 'OptimizedScoreCard';

export default OptimizedScoreCard;
