import React, { memo, useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import EnhancedGlassCard from '../../ui/EnhancedGlassCard';

interface RefinedMetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  progress?: number; // 0-100
  color?: string;
  icon: React.ReactElement;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  delay?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  liquidIntensity?: number;
}

const RefinedMetricCard = memo(({
  title,
  value,
  subtitle,
  progress,
  color = '#64748b', // Default to slate-500
  icon,
  trend,
  trendValue,
  delay = 0,
  size = 'md',
  interactive = true,
  liquidIntensity = 0.2
}: RefinedMetricCardProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [animatedValue, setAnimatedValue] = useState(0);

  const sizeConfig = {
    sm: { 
      padding: 'p-4', 
      titleSize: 'text-sm', 
      valueSize: 'text-xl',
      subtitleSize: 'text-xs',
      iconPadding: 'p-2',
      iconSize: 'w-4 h-4'
    },
    md: { 
      padding: 'p-6', 
      titleSize: 'text-base', 
      valueSize: 'text-2xl',
      subtitleSize: 'text-sm',
      iconPadding: 'p-3',
      iconSize: 'w-5 h-5'
    },
    lg: { 
      padding: 'p-8', 
      titleSize: 'text-lg', 
      valueSize: 'text-3xl',
      subtitleSize: 'text-base',
      iconPadding: 'p-4',
      iconSize: 'w-6 h-6'
    }
  };

  const config = sizeConfig[size];

  // Animate progress bar
  useEffect(() => {
    if (progress !== undefined) {
      const timer = setTimeout(() => {
        setAnimatedProgress(progress);
      }, delay + 300);
      return () => clearTimeout(timer);
    }
  }, [progress, delay]);

  // Animate numeric values
  useEffect(() => {
    if (typeof value === 'number') {
      const timer = setTimeout(() => {
        const duration = 1500;
        const increment = value / (duration / 16);
        let current = 0;
        
        const counter = setInterval(() => {
          current += increment;
          if (current >= value) {
            current = value;
            clearInterval(counter);
          }
          setAnimatedValue(Math.round(current));
        }, 16);
        
        return () => clearInterval(counter);
      }, delay + 500);
      return () => clearTimeout(timer);
    }
  }, [value, delay]);

  const TrendIndicator = () => {
    if (!trend) return null;
    
    const trendConfig = {
      up: { 
        icon: <TrendingUp className="w-4 h-4" />, 
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        border: 'border-green-500/20'
      },
      down: { 
        icon: <TrendingDown className="w-4 h-4" />, 
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20'
      },
      stable: { 
        icon: <Minus className="w-4 h-4" />, 
        color: 'text-slate-400',
        bg: 'bg-slate-500/10',
        border: 'border-slate-500/20'
      }
    };

    const config = trendConfig[trend];

    return (
      <div className={`
        flex items-center space-x-1 px-2 py-1 rounded-lg 
        ${config.bg} ${config.border} border backdrop-blur-sm
      `}>
        <span className={config.color}>
          {config.icon}
        </span>
        {trendValue && (
          <span className={`text-xs font-medium ${config.color}`}>
            {trendValue}
          </span>
        )}
      </div>
    );
  };

  const displayValue = typeof value === 'number' ? animatedValue : value;

  return (
    <EnhancedGlassCard 
      className={`
        relative overflow-hidden rounded-2xl backdrop-blur-xl border border-slate-700/40 
        hover:border-slate-600/60 transition-all duration-300 group hover-lift ${config.padding}
        bg-slate-900/20
      `}
      liquid={true}
      liquidIntensity={liquidIntensity}
      liquidDistortion={0.15}
      liquidAnimated={true}
      liquidInteractive={interactive}
      style={{
        animation: `slideInScale 0.6s ease-out ${delay}ms both`
      }}
    >
      {/* Subtle gradient overlay */}
      <div 
        className="absolute inset-0 opacity-5 transition-opacity duration-300 group-hover:opacity-10 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${color}20 0%, transparent 50%, ${color}10 100%)`
        }}
      />
      
      {/* Glass morphism depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/5 via-transparent to-slate-900/10 rounded-2xl" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div 
              className={`${config.iconPadding} rounded-xl backdrop-blur-sm border border-slate-700/30 bg-slate-800/10`}
              style={{ 
                background: `linear-gradient(135deg, ${color}10, ${color}05)`,
                borderColor: `${color}20`
              }}
            >
              {React.cloneElement(icon, { 
                className: config.iconSize, 
                style: { color } 
              })}
            </div>
            <h4 className={`${config.titleSize} font-semibold text-slate-200`}>
              {title}
            </h4>
          </div>
          <TrendIndicator />
        </div>
        
        {/* Value */}
        <div className="mb-3">
          <div 
            className={`${config.valueSize} font-bold text-slate-100 animate-metricCounter`}
            style={{ animationDelay: `${delay + 300}ms` }}
          >
            {displayValue}
          </div>
          <div className={`${config.subtitleSize} text-slate-400 mt-1`}>
            {subtitle}
          </div>
        </div>
        
        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Progress</span>
              <span className="text-xs text-slate-400">{Math.round(animatedProgress)}%</span>
            </div>
            <div className="relative h-2 bg-slate-800/30 rounded-full overflow-hidden backdrop-blur-sm">
              <div 
                className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${animatedProgress}%`,
                  background: `linear-gradient(90deg, ${color}80, ${color}60)`,
                  boxShadow: `0 0 8px ${color}40`
                }}
              />
              {/* Shimmer effect */}
              <div 
                className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shimmer"
                style={{
                  animation: `shimmer 2s infinite ${delay + 800}ms`,
                  transform: `translateX(${animatedProgress * 4}px) skewX(12deg)`
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Hover glow effect */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${color}15 0%, transparent 70%)`,
          filter: 'blur(1px)'
        }}
      />
    </EnhancedGlassCard>
  );
});

RefinedMetricCard.displayName = 'RefinedMetricCard';

export default RefinedMetricCard; 