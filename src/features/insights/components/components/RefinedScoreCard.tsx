import React, { memo, ReactNode } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { UniversalCard as EnhancedGlassCard } from '@/shared/ui/UniversalCard';
import AnimatedCircularProgress from '@/shared/ui/charts/AnimatedCircularProgress';

interface RefinedScoreCardProps {
  title: string;
  score: number;
  subtitle: string;
  icon: React.ReactElement;
  color?: string;
  trend?: 'up' | 'down' | 'stable';
  delay?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  liquidIntensity?: number;
}

const RefinedScoreCard = memo(
  ({
    title,
    score,
    subtitle,
    icon,
    color,
    trend,
    delay = 0,
    size = 'md',
    interactive = true,
    liquidIntensity = 0.2,
  }: RefinedScoreCardProps) => {
    const sizeConfig = {
      sm: {
        padding: 'p-4',
        progressSize: 100,
        titleSize: 'text-base',
        subtitleSize: 'text-xs',
        iconPadding: 'p-2',
        iconSize: 'w-4 h-4',
      },
      md: {
        padding: 'p-6',
        progressSize: 120,
        titleSize: 'text-lg',
        subtitleSize: 'text-sm',
        iconPadding: 'p-3',
        iconSize: 'w-5 h-5',
      },
      lg: {
        padding: 'p-8',
        progressSize: 140,
        titleSize: 'text-xl',
        subtitleSize: 'text-base',
        iconPadding: 'p-4',
        iconSize: 'w-6 h-6',
      },
    };

    const config = sizeConfig[size];

    const getScoreDescription = (scoreValue: number) => {
      if (scoreValue >= 80) return 'Excellent';
      if (scoreValue >= 70) return 'Very Good';
      if (scoreValue >= 60) return 'Good';
      if (scoreValue >= 40) return 'Fair';
      return 'Needs Attention';
    };

    // Refined color system using Vueni palette
    const getScoreColor = (scoreValue: number) => {
      if (scoreValue >= 80) return '#4ABA70'; // Vueni success for excellent
      if (scoreValue >= 70) return '#516AC8'; // Vueni sapphire dust for very good
      if (scoreValue >= 60) return '#E3AF64'; // Vueni caramel essence for good
      if (scoreValue >= 40) return '#E3AF64'; // Vueni caramel essence for fair
      return '#D64545'; // Vueni error for needs attention
    };

    const getScoreTextColor = (scoreValue: number) => {
      if (scoreValue >= 80) return 'text-vueni-success';
      if (scoreValue >= 70) return 'text-vueni-sapphireDust';
      if (scoreValue >= 60) return 'text-vueni-warning';
      if (scoreValue >= 40) return 'text-vueni-warning';
      return 'text-vueni-error';
    };

    const refinedColor = color || getScoreColor(score);

    const TrendIcon = () => {
      if (!trend) return null;

      const iconMap = {
        up: <TrendingUp className="w-4 h-4 text-vueni-success" />,
        down: <TrendingDown className="w-4 h-4 text-vueni-error" />,
        stable: <Activity className="w-4 h-4 text-vueni-n500" />,
      };

      return (
        <div className="flex items-center space-x-1 px-3 py-1 rounded-vueni-pill bg-vueni-glass-default border border-vueni-glass-border backdrop-blur-sm">
          {iconMap[trend]}
        </div>
      );
    };

    return (
      <EnhancedGlassCard
        variant="glass"
        className={`
        relative overflow-hidden rounded-vueni-lg backdrop-blur-xl border border-vueni-glass-border 
        hover:border-vueni-glass-prominent transition-all duration-500 group hover-lift ${config.padding}
        bg-vueni-glass-subtle animate-[slideInScale_0.8s_ease-out_${delay}ms_both]
      `}
        interactive={interactive}
      >
        {/* Subtle moving gradient overlay */}
        <div
          className="absolute inset-0 opacity-10 transition-opacity duration-500 group-hover:opacity-20 rounded-vueni-lg"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${refinedColor}30 0%, transparent 70%)`,
          }}
        />

        {/* Glass morphism depth layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-vueni-glass-subtle via-transparent to-vueni-glass-default rounded-vueni-lg" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div
                className={`${config.iconPadding} rounded-vueni-lg backdrop-blur-sm border border-vueni-glass-border bg-vueni-glass-subtle`}
                style={{
                  background: `linear-gradient(135deg, ${refinedColor}15, ${refinedColor}05)`,
                  borderColor: `${refinedColor}30`,
                }}
              >
                {React.cloneElement(icon, {
                  className: config.iconSize,
                  style: { color: refinedColor },
                })}
              </div>
              <h3
                className={`${config.titleSize} font-semibold text-white`}
              >
                {title}
              </h3>
            </div>
            <TrendIcon />
          </div>

          {/* Progress Circle */}
          <div className="flex justify-center mb-6">
            <AnimatedCircularProgress
              value={score}
              color={refinedColor}
              size={config.progressSize}
              delay={delay + 200}
            />
          </div>

          {/* Description */}
          <div className="text-center space-y-2">
            <div
              className={`${config.titleSize} font-bold ${getScoreTextColor(score)}`}
            >
              {getScoreDescription(score)}
            </div>
            <div className={`${config.subtitleSize} text-vueni-n500`}>
              {subtitle}
            </div>
          </div>
        </div>

        {/* Subtle border glow effect */}
        <div
          className="absolute inset-0 rounded-vueni-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, transparent, ${refinedColor}20, transparent)`,
            filter: 'blur(1px)',
          }}
        />
      </EnhancedGlassCard>
    );
  }
);

RefinedScoreCard.displayName = 'RefinedScoreCard';

export default RefinedScoreCard;
