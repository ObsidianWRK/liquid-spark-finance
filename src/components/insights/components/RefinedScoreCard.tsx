import React, { memo, ReactNode } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import EnhancedGlassCard from '../../ui/EnhancedGlassCard';
import AnimatedCircularProgress from './AnimatedCircularProgress';

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

const RefinedScoreCard = memo(({
  title,
  score,
  subtitle,
  icon,
  color,
  trend,
  delay = 0,
  size = 'md',
  interactive = true,
  liquidIntensity = 0.2
}: RefinedScoreCardProps) => {
  const sizeConfig = {
    sm: { 
      padding: 'p-4', 
      progressSize: 100, 
      titleSize: 'text-base', 
      subtitleSize: 'text-xs',
      iconPadding: 'p-2',
      iconSize: 'w-4 h-4'
    },
    md: { 
      padding: 'p-6', 
      progressSize: 120, 
      titleSize: 'text-lg', 
      subtitleSize: 'text-sm',
      iconPadding: 'p-3',
      iconSize: 'w-5 h-5'
    },
    lg: { 
      padding: 'p-8', 
      progressSize: 140, 
      titleSize: 'text-xl', 
      subtitleSize: 'text-base',
      iconPadding: 'p-4',
      iconSize: 'w-6 h-6'
    }
  };

  const config = sizeConfig[size];

  const getScoreDescription = (scoreValue: number) => {
    if (scoreValue >= 80) return 'Excellent';
    if (scoreValue >= 70) return 'Very Good';
    if (scoreValue >= 60) return 'Good';
    if (scoreValue >= 40) return 'Fair';
    return 'Needs Attention';
  };

  // Refined color system using professional palette
  const getScoreColor = (scoreValue: number) => {
    if (scoreValue >= 80) return '#22c55e'; // Green-500 for excellent
    if (scoreValue >= 70) return '#6366f1'; // Indigo-500 for very good
    if (scoreValue >= 60) return '#f59e0b'; // Amber-500 for good
    if (scoreValue >= 40) return '#f97316'; // Orange-500 for fair
    return '#ef4444'; // Red-500 for needs attention
  };

  const getScoreTextColor = (scoreValue: number) => {
    if (scoreValue >= 80) return 'text-green-400';
    if (scoreValue >= 70) return 'text-indigo-400';
    if (scoreValue >= 60) return 'text-amber-400';
    if (scoreValue >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const refinedColor = color || getScoreColor(score);

  const TrendIcon = () => {
    if (!trend) return null;
    
    const iconMap = {
      up: <TrendingUp className="w-4 h-4 text-green-400" />,
      down: <TrendingDown className="w-4 h-4 text-red-400" />,
      stable: <Activity className="w-4 h-4 text-slate-400" />
    };

    return (
      <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-slate-800/30 border border-slate-700/40 backdrop-blur-sm">
        {iconMap[trend]}
      </div>
    );
  };

  return (
    <EnhancedGlassCard 
      className={`
        relative overflow-hidden rounded-3xl backdrop-blur-xl border border-slate-700/40 
        hover:border-slate-600/60 transition-all duration-500 group hover-lift ${config.padding}
        bg-slate-900/20
      `}
      liquid={true}
      liquidIntensity={liquidIntensity}
      liquidDistortion={0.2}
      liquidAnimated={true}
      liquidInteractive={interactive}
      style={{
        animation: `slideInScale 0.8s ease-out ${delay}ms both`
      }}
    >
      {/* Subtle moving gradient overlay */}
      <div 
        className="absolute inset-0 opacity-10 transition-opacity duration-500 group-hover:opacity-20 rounded-3xl"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${refinedColor}30 0%, transparent 70%)`
        }}
      />
      
      {/* Glass morphism depth layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/10 via-transparent to-slate-900/20 rounded-3xl" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div 
              className={`${config.iconPadding} rounded-2xl backdrop-blur-sm border border-slate-700/30 bg-slate-800/20`}
              style={{ 
                background: `linear-gradient(135deg, ${refinedColor}15, ${refinedColor}05)`,
                borderColor: `${refinedColor}30`
              }}
            >
              {React.cloneElement(icon, { 
                className: config.iconSize, 
                style: { color: refinedColor } 
              })}
            </div>
            <h3 className={`${config.titleSize} font-semibold text-slate-100`}>
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
          <div className={`${config.titleSize} font-bold ${getScoreTextColor(score)}`}>
            {getScoreDescription(score)}
          </div>
          <div className={`${config.subtitleSize} text-slate-400`}>
            {subtitle}
          </div>
        </div>
      </div>

      {/* Subtle border glow effect */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, transparent, ${refinedColor}20, transparent)`,
          filter: 'blur(1px)'
        }}
      />
    </EnhancedGlassCard>
  );
});

RefinedScoreCard.displayName = 'RefinedScoreCard';

export default RefinedScoreCard; 