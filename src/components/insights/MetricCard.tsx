import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
  color?: string;
  prefix?: string;
  suffix?: string;
  index?: number;
  children?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = '#3b82f6',
  prefix = '',
  suffix = '',
  index = 0,
  children
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return '#10b981';
      case 'down': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getTrendSymbol = () => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '—';
    }
  };

  return (
    <div className="liquid-glass-card rounded-2xl p-4 sm:p-6 h-full min-h-[120px] sm:min-h-[140px] md:min-h-[160px] flex flex-col justify-between group hover:scale-[1.02] transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div 
          className="p-2 sm:p-3 rounded-xl backdrop-blur-sm"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon 
            className="w-4 h-4 sm:w-5 sm:h-5" 
            style={{ color }} 
          />
        </div>
        {trend && (
          <span 
            className="text-xs sm:text-sm font-medium"
            style={{ color: getTrendColor() }}
          >
            {getTrendSymbol()}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </div>
        <div className="text-xs sm:text-sm text-white/70 font-medium mb-2">
          {title}
        </div>
        {subtitle && (
          <div className="text-xs text-white/50">
            {subtitle}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default MetricCard;
