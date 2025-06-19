import React, { memo, ReactNode } from 'react';
import { ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { UniversalCard } from '../ui/UniversalCard';

// Universal Metric Card that consolidates:
// - EnhancedMetricCard.tsx
// - RefinedMetricCard.tsx
// - MetricCard.tsx
// - FinancialCard.tsx
// - AccountCard.tsx
// - BalanceCard.tsx
// - GoalCard.tsx

interface UniversalMetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  progress?: number;
  color: string;
  icon: React.ReactElement;
  delay?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'clean' | 'enhanced' | 'refined' | 'financial' | 'account' | 'balance' | 'goal';
  interactive?: boolean;
  liquidIntensity?: number;
  animationsEnabled?: boolean;
  trend?: 'up' | 'down' | 'stable';
  prefix?: string;
  suffix?: string;
  showProgress?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}

const UniversalMetricCard = memo(({
  title,
  value,
  subtitle,
  progress,
  color,
  icon,
  delay = 0,
  size = 'md',
  variant = 'default',
  interactive = true,
  liquidIntensity = 0.3,
  animationsEnabled = true,
  trend,
  prefix = '',
  suffix = '',
  showProgress = true,
  onClick,
  children
}: UniversalMetricCardProps) => {
  const sizeConfig = {
    sm: { 
      padding: 'p-2 md:p-3', 
      titleSize: 'text-xs', 
      valueSize: 'text-base md:text-lg',
      subtitleSize: 'text-xs',
      iconPadding: 'p-1 md:p-1.5',
      iconSize: 'w-3 h-3'
    },
    md: { 
      padding: 'p-3 md:p-4', 
      titleSize: 'text-xs md:text-sm', 
      valueSize: 'text-lg md:text-2xl',
      subtitleSize: 'text-xs',
      iconPadding: 'p-1.5 md:p-2',
      iconSize: 'w-3 h-3 md:w-4 md:h-4'
    },
    lg: { 
      padding: 'p-4 md:p-6', 
      titleSize: 'text-sm md:text-base', 
      valueSize: 'text-xl md:text-3xl',
      subtitleSize: 'text-xs md:text-sm',
      iconPadding: 'p-2 md:p-3',
      iconSize: 'w-4 h-4 md:w-5 md:h-5'
    }
  };

  const config = sizeConfig[size];

  const getVariantStyles = () => {
    switch (variant) {
      case 'clean':
        return {
          container: 'bg-white/5 backdrop-blur-sm border border-white/10',
          iconContainer: 'bg-white/5 border border-white/10',
          progressBar: 'bg-white/10 border border-white/5'
        };
      case 'enhanced':
        return {
          container: 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-lg',
          iconContainer: 'bg-white/10 border border-white/20 shadow-md',
          progressBar: 'bg-white/10 border border-white/20'
        };
      case 'refined':
        return {
          container: 'bg-black/20 backdrop-blur-md border border-white/20',
          iconContainer: 'bg-white/10 border border-white/20',
          progressBar: 'bg-white/10 border border-white/20'
        };
      case 'financial':
        return {
          container: 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-md border border-blue-400/20',
          iconContainer: 'bg-blue-500/20 border border-blue-400/30',
          progressBar: 'bg-blue-500/10 border border-blue-400/20'
        };
      case 'account':
        return {
          container: 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-md border border-green-400/20',
          iconContainer: 'bg-green-500/20 border border-green-400/30',
          progressBar: 'bg-green-500/10 border border-green-400/20'
        };
      case 'balance':
        return {
          container: 'bg-gradient-to-br from-purple-500/10 to-violet-500/10 backdrop-blur-md border border-purple-400/20',
          iconContainer: 'bg-purple-500/20 border border-purple-400/30',
          progressBar: 'bg-purple-500/10 border border-purple-400/20'
        };
      case 'goal':
        return {
          container: 'bg-gradient-to-br from-orange-500/10 to-amber-500/10 backdrop-blur-md border border-orange-400/20',
          iconContainer: 'bg-orange-500/20 border border-orange-400/30',
          progressBar: 'bg-orange-500/10 border border-orange-400/20'
        };
      default:
        return {
          container: 'bg-white/5 backdrop-blur-md border border-white/20',
          iconContainer: 'bg-white/10 border border-white/20',
          progressBar: 'bg-white/10 border border-white/20'
        };
    }
  };

  const variantStyles = getVariantStyles();

  const getTrendIcon = () => {
    if (!trend) return null;
    
    const iconMap = {
      up: <TrendingUp className="w-3 h-3 text-green-400" />,
      down: <TrendingDown className="w-3 h-3 text-red-400" />,
      stable: <Minus className="w-3 h-3 text-white/60" />
    };

    return iconMap[trend];
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-white/60';
    }
  };

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return `${prefix}${val.toLocaleString()}${suffix}`;
    }
    return `${prefix}${val}${suffix}`;
  };

  return (
    <UniversalCard 
      variant="glass"
      className={`
        relative overflow-hidden rounded-xl md:rounded-2xl hover:border-white/30 transition-all duration-300 group 
        ${onClick ? 'cursor-pointer' : ''} ${config.padding} ${variantStyles.container}
      `}
      liquid={animationsEnabled}
      liquidIntensity={liquidIntensity}
      liquidInteractive={interactive}
      onClick={onClick}
      style={animationsEnabled ? {
        animation: `slideInScale 0.6s ease-out ${delay}ms both`
      } : {}}
    >
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-2 md:mb-3">
          <div className="flex items-center space-x-2">
            <div 
              className={`${config.iconPadding} rounded-xl backdrop-blur-sm ${variantStyles.iconContainer}`}
              style={{ background: `${color}15` }}
            >
              {React.cloneElement(icon, { 
                className: config.iconSize, 
                style: { color } 
              })}
            </div>
            <span className={`${config.titleSize} font-medium text-white/90`}>
              {title}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {trend && (
              <div className={`flex items-center ${getTrendColor()}`}>
                {getTrendIcon()}
              </div>
            )}
            {onClick && (
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-white/40 group-hover:text-white/60 transition-colors" />
            )}
          </div>
        </div>
        
        {/* Value and subtitle */}
        <div className="mb-2 md:mb-3">
          <div className={`${config.valueSize} font-bold text-white tabular-nums`}>
            {formatValue(value)}
          </div>
          {subtitle && (
            <div className={`${config.subtitleSize} text-white/60`}>
              {subtitle}
            </div>
          )}
        </div>
        
        {/* Progress bar */}
        {showProgress && progress !== undefined && (
          <div className="relative">
            <div className={`w-full h-1.5 md:h-2 rounded-full overflow-hidden ${variantStyles.progressBar}`}>
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                style={{ 
                  width: `${Math.min(100, Math.max(0, progress))}%`,
                  background: `linear-gradient(90deg, ${color}, ${color}CC)`
                }}
              >
                {animationsEnabled && (
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    style={{ animation: 'shimmer 2s infinite' }}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Additional content */}
        {children && (
          <div className="mt-2 md:mt-3">
            {children}
          </div>
        )}
      </div>
    </UniversalCard>
  );
});

UniversalMetricCard.displayName = 'UniversalMetricCard';

export { UniversalMetricCard };