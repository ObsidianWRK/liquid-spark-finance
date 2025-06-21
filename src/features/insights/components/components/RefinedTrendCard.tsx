import React, { memo } from 'react';
import { ChevronRight, TrendingUp, BarChart3, Target } from 'lucide-react';
import { UniversalCard as EnhancedGlassCard } from '@/shared/ui/UniversalCard';

interface RefinedTrendCardProps {
  title: string;
  subtitle: string;
  trend: string;
  delay?: number;
  icon?: React.ReactElement;
  interactive?: boolean;
  liquidIntensity?: number;
  onClick?: () => void;
}

const RefinedTrendCard = memo(
  ({
    title,
    subtitle,
    trend,
    delay = 0,
    icon,
    interactive = true,
    liquidIntensity = 0.15,
    onClick,
  }: RefinedTrendCardProps) => {
    // Get appropriate icon based on title if none provided
    const getDefaultIcon = () => {
      if (title.toLowerCase().includes('performance'))
        return <TrendingUp className="w-5 h-5" />;
      if (title.toLowerCase().includes('goal'))
        return <Target className="w-5 h-5" />;
      if (title.toLowerCase().includes('risk'))
        return <BarChart3 className="w-5 h-5" />;
      return <BarChart3 className="w-5 h-5" />;
    };

    const displayIcon = icon || getDefaultIcon();

    return (
      <EnhancedGlassCard
        variant="glass"
        className={`refined-trend-card relative overflow-hidden rounded-vueni-lg backdrop-blur-xl border border-slate-700/40 hover:border-slate-600/60 transition-all duration-300 group cursor-pointer p-6 bg-slate-900/20 hover-lift animate-[slideInScale_0.6s_ease-out_${delay}ms_both]`}
        interactive={interactive}
        onClick={onClick}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/5 via-transparent to-slate-900/10 rounded-vueni-lg" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-vueni-lg bg-slate-800/30 border border-slate-700/40 backdrop-blur-sm">
                {React.cloneElement(displayIcon, {
                  className: 'w-5 h-5 text-slate-300',
                })}
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-slate-100 leading-tight">
                  {title}
                </h4>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  {subtitle}
                </p>
              </div>
            </div>
            {interactive && (
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-300 transition-colors flex-shrink-0 mt-1" />
            )}
          </div>

          {/* Simplified visual indicator */}
          <div className="mb-4">
            <div className="h-12 flex items-end justify-center space-x-1">
              {[...Array(12)].map((_, i) => {
                const heights = [
                  30, 45, 35, 60, 50, 75, 65, 80, 70, 85, 90, 95,
                ];
                return (
                  <div
                    key={i}
                    className="trend-bar flex-1 max-w-2 rounded-vueni-sm transition-all duration-500 relative overflow-hidden"
                    style={{
                      height: `${heights[i]}%`,
                      background:
                        'linear-gradient(180deg, rgba(100, 116, 139, 0.6), rgba(100, 116, 139, 0.3))',
                      animationDelay: `${i * 50}ms`,
                    }}
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-transparent via-slate-400/10 to-transparent"
                      style={{
                        animation: `trendPulse 3s infinite ${i * 0.2}s`,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trend status */}
          <div className="text-center">
            <span className="text-sm font-medium text-slate-200 bg-slate-800/20 px-3 py-1 rounded-vueni-lg border border-slate-700/30">
              {trend}
            </span>
          </div>
        </div>

        {/* Hover glow effect */}
        <div
          className="absolute inset-0 rounded-vueni-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, transparent, rgba(100, 116, 139, 0.1), transparent)`,
            filter: 'blur(1px)',
          }}
        />
      </EnhancedGlassCard>
    );
  }
);

RefinedTrendCard.displayName = 'RefinedTrendCard';

export default RefinedTrendCard;
