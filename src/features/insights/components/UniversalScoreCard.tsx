import React, { memo, ReactNode } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { UniversalCard } from '@/shared/ui/UniversalCard';
import AnimatedCircularProgress from '@/shared/ui/charts/AnimatedCircularProgress';

// Universal Score Card that consolidates:
// - EnhancedScoreCard.tsx
// - RefinedScoreCard.tsx
// - OptimizedScoreCard.tsx
// - CleanCreditScoreCard.tsx
// - CreditScoreCard.tsx

interface UniversalScoreCardProps {
  title: string;
  score: number;
  subtitle: string;
  icon: React.ReactElement;
  color: string;
  trend?: 'up' | 'down' | 'stable';
  delay?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?:
    | 'default'
    | 'clean'
    | 'enhanced'
    | 'refined'
    | 'optimized'
    | 'credit';
  interactive?: boolean;
  liquidIntensity?: number;
  animationsEnabled?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}

const UniversalScoreCard = memo(
  ({
    title,
    score,
    subtitle,
    icon,
    color,
    trend,
    delay = 0,
    size = 'md',
    variant = 'default',
    interactive = true,
    liquidIntensity = 0.6,
    animationsEnabled = true,
    onClick,
    children,
  }: UniversalScoreCardProps) => {
    const sizeConfig = {
      sm: {
        padding: 'p-3',
        progressSize: 80,
        titleSize: 'text-sm',
        subtitleSize: 'text-xs',
        iconPadding: 'p-1.5',
        iconSize: 'w-3 h-3',
      },
      md: {
        padding: 'p-4 md:p-6',
        progressSize: 100,
        titleSize: 'text-base md:text-lg',
        subtitleSize: 'text-xs md:text-sm',
        iconPadding: 'p-2 md:p-3',
        iconSize: 'w-4 h-4 md:w-5 md:h-5',
      },
      lg: {
        padding: 'p-6 md:p-8',
        progressSize: 120,
        titleSize: 'text-lg md:text-xl',
        subtitleSize: 'text-sm md:text-base',
        iconPadding: 'p-3 md:p-4',
        iconSize: 'w-5 h-5 md:w-6 md:h-6',
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

    const getScoreColor = (scoreValue: number) => {
      if (scoreValue >= 80) return 'text-green-300';
      if (scoreValue >= 70) return 'text-blue-300';
      if (scoreValue >= 60) return 'text-yellow-300';
      if (scoreValue >= 40) return 'text-orange-300';
      return 'text-red-300';
    };

    const getVariantStyles = () => {
      switch (variant) {
        case 'clean':
          return {
            container: 'bg-white/5 backdrop-blur-sm border border-white/10',
            header: 'border-b border-white/10 pb-3 mb-4',
            progress: 'mb-4',
            trend: 'bg-white/5 border border-white/10',
          };
        case 'enhanced':
          return {
            container:
              'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl',
            header: 'mb-6',
            progress: 'mb-6',
            trend: 'bg-white/10 border border-white/20 shadow-lg',
          };
        case 'refined':
          return {
            container: 'bg-black/20 backdrop-blur-md border border-white/20',
            header: 'mb-4',
            progress: 'mb-4',
            trend: 'bg-white/10 border border-white/20',
          };
        case 'optimized':
          return {
            container: 'bg-white/5 border border-white/10',
            header: 'mb-3',
            progress: 'mb-3',
            trend: 'bg-white/5 border border-white/10',
          };
        case 'credit':
          return {
            container:
              'bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-md border border-blue-400/20',
            header: 'border-b border-blue-400/20 pb-4 mb-4',
            progress: 'mb-4',
            trend: 'bg-blue-500/10 border border-blue-400/20',
          };
        default:
          return {
            container: 'bg-white/5 backdrop-blur-md border border-white/20',
            header: 'mb-4',
            progress: 'mb-4',
            trend: 'bg-white/10 border border-white/20',
          };
      }
    };

    const variantStyles = getVariantStyles();

    const TrendIcon = () => {
      if (!trend) return null;

      const iconMap = {
        up: <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-400" />,
        down: <TrendingDown className="w-3 h-3 md:w-4 md:h-4 text-red-400" />,
        stable: <Activity className="w-3 h-3 md:w-4 md:h-4 text-white/60" />,
      };

      return (
        <div
          className={`flex items-center space-x-1 px-2 py-1 rounded-vueni-pill ${variantStyles.trend}`}
        >
          {iconMap[trend]}
        </div>
      );
    };

    return (
      <UniversalCard
        variant="glass"
        className={`
        relative overflow-hidden rounded-vueni-lg md:rounded-vueni-lg hover:border-white/30 transition-all duration-500 group 
        ${config.padding} ${onClick ? 'cursor-pointer' : ''} ${variantStyles.container}
        ${animationsEnabled ? `animate-[slideInScale_0.8s_ease-out_${delay}ms_both]` : ''}
      `}
        interactive={interactive}
        onClick={onClick}
      >
        {/* Subtle moving gradient background */}
        <div
          className="absolute inset-0 opacity-20 transition-opacity duration-500 group-hover:opacity-30"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${color}40 0%, transparent 70%)`,
          }}
        />

        <div className="relative z-10">
          {/* Header */}
          <div
            className={`flex items-center justify-between ${variantStyles.header}`}
          >
            <div className="flex items-center space-x-2 md:space-x-3">
              <div
                className={`${config.iconPadding} rounded-vueni-lg md:rounded-vueni-lg backdrop-blur-sm border border-white/20`}
                style={{ background: `${color}20` }}
              >
                {React.cloneElement(icon, {
                  className: config.iconSize,
                  style: { color },
                })}
              </div>
              <h3 className={`${config.titleSize} font-semibold text-white`}>
                {title}
              </h3>
            </div>
            <TrendIcon />
          </div>

          {/* Progress Circle */}
          <div className={`flex justify-center ${variantStyles.progress}`}>
            <AnimatedCircularProgress
              value={score}
              color={color}
              size={config.progressSize}
              delay={animationsEnabled ? delay + 200 : 0}
            />
          </div>

          {/* Description */}
          <div className="text-center space-y-1 md:space-y-2">
            <div
              className={`${config.titleSize} font-bold ${getScoreColor(score)}`}
            >
              {getScoreDescription(score)}
            </div>
            <div className={`${config.subtitleSize} text-white/70`}>
              {subtitle}
            </div>
          </div>

          {/* Additional content */}
          {children && <div className="mt-3 md:mt-4">{children}</div>}
        </div>
      </UniversalCard>
    );
  }
);

UniversalScoreCard.displayName = 'UniversalScoreCard';

export { UniversalScoreCard };
