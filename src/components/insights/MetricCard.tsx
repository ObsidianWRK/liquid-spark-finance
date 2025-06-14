
import React from 'react';
import GlassCard from '../GlassCard';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'stable';
  trendPercentage?: number;
  color?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  index: number;
}

const MetricCard = ({
  title,
  value,
  subtitle,
  trend,
  trendPercentage,
  color = '#007AFF',
  icon,
  children,
  index
}: MetricCardProps) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-white/50" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-white/50';
    }
  };

  return (
    <GlassCard 
      variant="subtle" 
      className="p-4 glass-interactive stagger-item"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {icon && (
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${color}20` }}
            >
              <div style={{ color }}>{icon}</div>
            </div>
          )}
          <h3 className="text-white/90 text-sm font-medium">{title}</h3>
        </div>
        
        {trend && (
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            {trendPercentage && (
              <span className={`text-xs ${getTrendColor()}`}>
                {trendPercentage > 0 ? '+' : ''}{trendPercentage}%
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="mb-2">
        <div 
          className="text-2xl font-bold"
          style={{ color }}
        >
          {value}
        </div>
        {subtitle && (
          <div className="text-white/60 text-xs">{subtitle}</div>
        )}
      </div>
      
      {children && (
        <div className="mt-3">
          {children}
        </div>
      )}
    </GlassCard>
  );
};

export default MetricCard;
