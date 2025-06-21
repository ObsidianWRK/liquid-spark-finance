import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface MetricDisplayProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  iconColor?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  target?: number;
  variant?: 'default' | 'compact' | 'large';
  status?: 'good' | 'warning' | 'danger' | 'neutral';
  className?: string;
  onClick?: () => void;
}

export const MetricDisplay: React.FC<MetricDisplayProps> = ({
  label,
  value,
  unit,
  icon: Icon,
  iconColor,
  trend,
  trendValue,
  target,
  variant = 'default',
  status = 'neutral',
  className,
  onClick,
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-red-400" />;
      default:
        return <Minus className="w-3 h-3 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'good':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'danger':
        return 'text-red-400';
      default:
        return 'text-white/90';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatValue = (val: string | number): string => {
    if (typeof val === 'number') {
      if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
      if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
      return val.toFixed(val % 1 === 0 ? 0 : 1);
    }
    return val;
  };

  const containerClasses = cn(
    'transition-all duration-200',
    {
      'p-2': variant === 'compact',
      'p-3': variant === 'default',
      'p-4': variant === 'large',
      'cursor-pointer hover:bg-white/[0.04] rounded-vueni-lg': onClick,
    },
    className
  );

  const textSizeClasses = {
    label: {
      compact: 'text-xs',
      default: 'text-sm',
      large: 'text-base',
    },
    value: {
      compact: 'text-sm',
      default: 'text-lg',
      large: 'text-2xl',
    },
    unit: {
      compact: 'text-xs',
      default: 'text-sm',
      large: 'text-base',
    },
  };

  return (
    <div className={containerClasses} onClick={onClick}>
      {/* Header with icon and label */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-1">
          {Icon && (
            <Icon
              className={cn(
                variant === 'compact'
                  ? 'w-3 h-3'
                  : variant === 'large'
                    ? 'w-5 h-5'
                    : 'w-4 h-4'
              )}
              style={{ color: iconColor }}
            />
          )}
          <span
            className={cn(
              'text-white/70 font-medium',
              textSizeClasses.label[variant]
            )}
          >
            {label}
          </span>
        </div>

        {trend && (
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            {trendValue !== undefined && (
              <span className={cn('text-xs font-medium', getTrendColor())}>
                {trendValue > 0 ? '+' : ''}
                {trendValue}%
              </span>
            )}
          </div>
        )}
      </div>

      {/* Value display */}
      <div className="flex items-baseline space-x-1">
        <span
          className={cn(
            'font-bold transition-colors duration-200',
            getStatusColor(),
            textSizeClasses.value[variant]
          )}
        >
          {formatValue(value)}
        </span>
        {unit && (
          <span className={cn('text-white/60', textSizeClasses.unit[variant])}>
            {unit}
          </span>
        )}
      </div>

      {/* Target comparison */}
      {target !== undefined && (
        <div className="mt-1">
          <div className="flex justify-between text-xs text-white/60">
            <span>Target</span>
            <span>{formatValue(target)}</span>
          </div>

          {/* Progress bar for target */}
          <div className="w-full bg-white/10 rounded-vueni-pill h-1 mt-1">
            <div
              className={cn(
                'h-1 rounded-vueni-pill transition-all duration-300',
                status === 'good'
                  ? 'bg-green-400'
                  : status === 'warning'
                    ? 'bg-yellow-400'
                    : status === 'danger'
                      ? 'bg-red-400'
                      : 'bg-blue-400'
              )}
              style={{
                width: `${Math.min(100, Math.max(0, (Number(value) / target) * 100))}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Specialized metric displays for different data types
export const StressMetric: React.FC<
  Omit<MetricDisplayProps, 'status' | 'iconColor'>
> = (props) => {
  const stressValue = Number(props.value);
  const getStressStatus = (value: number): 'good' | 'warning' | 'danger' => {
    if (value >= 70) return 'danger';
    if (value >= 50) return 'warning';
    return 'good';
  };

  return (
    <MetricDisplay
      {...props}
      status={getStressStatus(stressValue)}
      iconColor={
        stressValue >= 70
          ? '#ef4444'
          : stressValue >= 50
            ? '#f59e0b'
            : '#10b981'
      }
    />
  );
};

export const WellnessMetric: React.FC<
  Omit<MetricDisplayProps, 'status' | 'iconColor'>
> = (props) => {
  const wellnessValue = Number(props.value);
  const getWellnessStatus = (value: number): 'good' | 'warning' | 'danger' => {
    if (value >= 80) return 'good';
    if (value >= 60) return 'warning';
    return 'danger';
  };

  return (
    <MetricDisplay
      {...props}
      status={getWellnessStatus(wellnessValue)}
      iconColor={
        wellnessValue >= 80
          ? '#10b981'
          : wellnessValue >= 60
            ? '#f59e0b'
            : '#ef4444'
      }
    />
  );
};

export const HeartRateMetric: React.FC<
  Omit<MetricDisplayProps, 'status' | 'iconColor'>
> = (props) => {
  const hrValue = Number(props.value);
  const getHRStatus = (value: number): 'good' | 'warning' | 'danger' => {
    if (value >= 60 && value <= 100) return 'good';
    if (value >= 50 && value <= 120) return 'warning';
    return 'danger';
  };

  return (
    <MetricDisplay
      {...props}
      status={getHRStatus(hrValue)}
      iconColor={
        hrValue >= 60 && hrValue <= 100
          ? '#10b981'
          : hrValue >= 50 && hrValue <= 120
            ? '#f59e0b'
            : '#ef4444'
      }
    />
  );
};

// Grid layout for multiple metrics
interface MetricGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export const MetricGrid: React.FC<MetricGridProps> = ({
  children,
  columns = 2,
  className,
}) => {
  const gridClasses = cn(
    'grid gap-3',
    {
      'grid-cols-2': columns === 2,
      'grid-cols-3': columns === 3,
      'grid-cols-2 lg:grid-cols-4': columns === 4,
    },
    className
  );

  return <div className={gridClasses}>{children}</div>;
};
