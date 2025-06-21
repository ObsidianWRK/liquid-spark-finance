import React, { memo } from 'react';
import { ChevronRight } from 'lucide-react';
import EnhancedGlassCard from '@/shared/ui/EnhancedGlassCard';

interface EnhancedMetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  progress?: number;
  color: string;
  icon: React.ReactElement;
  delay?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  liquidIntensity?: number;
  onClick?: () => void;
}

const EnhancedMetricCard = memo(
  ({
    title,
    value,
    subtitle,
    progress,
    color,
    icon,
    delay = 0,
    size = 'md',
    interactive = true,
    liquidIntensity = 0.3,
    onClick,
  }: EnhancedMetricCardProps) => {
    const sizeConfig = {
      sm: {
        padding: 'p-3',
        titleSize: 'text-xs',
        valueSize: 'text-lg',
        subtitleSize: 'text-xs',
        iconPadding: 'p-1.5',
        iconSize: 'w-3 h-3',
      },
      md: {
        padding: 'p-4',
        titleSize: 'text-sm',
        valueSize: 'text-2xl',
        subtitleSize: 'text-xs',
        iconPadding: 'p-2',
        iconSize: 'w-4 h-4',
      },
      lg: {
        padding: 'p-6',
        titleSize: 'text-base',
        valueSize: 'text-3xl',
        subtitleSize: 'text-sm',
        iconPadding: 'p-3',
        iconSize: 'w-5 h-5',
      },
    };

    const config = sizeConfig[size];

    return (
      <EnhancedGlassCard
        className={`
        relative overflow-hidden rounded-vueni-lg backdrop-blur-xl border border-white/20 
        hover:border-white/30 transition-all duration-300 group 
        ${onClick ? 'cursor-pointer' : ''} ${config.padding}
      `}
        liquid={true}
        liquidIntensity={liquidIntensity}
        liquidDistortion={0.2}
        liquidAnimated={false}
        liquidInteractive={interactive}
        onClick={onClick}
        style={{
          animation: `slideInScale 0.6s ease-out ${delay}ms both`,
        }}
      >
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div
                className={`${config.iconPadding} rounded-vueni-lg backdrop-blur-sm border border-white/20`}
                style={{ background: `${color}15` }}
              >
                {React.cloneElement(icon, {
                  className: config.iconSize,
                  style: { color },
                })}
              </div>
              <span className={`${config.titleSize} font-medium text-white/90`}>
                {title}
              </span>
            </div>
            {onClick && (
              <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
            )}
          </div>

          {/* Value and subtitle */}
          <div className="mb-3">
            <div
              className={`${config.valueSize} font-bold text-white tabular-nums`}
            >
              {value}
            </div>
            <div className={`${config.subtitleSize} text-white/60`}>
              {subtitle}
            </div>
          </div>

          {/* Progress bar */}
          {progress !== undefined && (
            <div className="relative">
              <div className="w-full h-2 rounded-vueni-pill bg-white/10 border border-white/20 overflow-hidden">
                <div
                  className="h-full rounded-vueni-pill transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{
                    width: `${Math.min(100, Math.max(0, progress))}%`,
                    background: `linear-gradient(90deg, ${color}, ${color}CC)`,
                  }}
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    style={{ animation: 'shimmer 2s infinite' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </EnhancedGlassCard>
    );
  }
);

EnhancedMetricCard.displayName = 'EnhancedMetricCard';

export default EnhancedMetricCard;
