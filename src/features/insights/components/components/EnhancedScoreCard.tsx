import React, { memo, ReactNode } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import EnhancedGlassCard from '../../ui/EnhancedGlassCard';
import AnimatedCircularProgress from './AnimatedCircularProgress';

interface EnhancedScoreCardProps {
  title: string;
  score: number;
  subtitle: string;
  icon: React.ReactElement;
  color: string;
  trend?: 'up' | 'down' | 'stable';
  delay?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  liquidIntensity?: number;
  onClick?: () => void;
}

const EnhancedScoreCard = memo(({
  title,
  score,
  subtitle,
  icon,
  color,
  trend,
  delay = 0,
  size = 'md',
  interactive = true,
  liquidIntensity = 0.6,
  onClick,
}: EnhancedScoreCardProps) => {
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

  const getScoreColor = (scoreValue: number) => {
    if (scoreValue >= 80) return 'text-green-300';
    if (scoreValue >= 70) return 'text-blue-300';
    if (scoreValue >= 60) return 'text-yellow-300';
    if (scoreValue >= 40) return 'text-orange-300';
    return 'text-red-300';
  };

  const TrendIcon = () => {
    if (!trend) return null;
    
    const iconMap = {
      up: <TrendingUp className="w-4 h-4 text-green-400" />,
      down: <TrendingDown className="w-4 h-4 text-red-400" />,
      stable: <Activity className="w-4 h-4 text-white/60" />
    };

    return (
      <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-white/10 border border-white/20">
        {iconMap[trend]}
      </div>
    );
  };

  return (
    <EnhancedGlassCard 
      className={`
        relative overflow-hidden rounded-3xl backdrop-blur-xl border border-white/20 
        hover:border-white/30 transition-all duration-500 group ${config.padding} ${onClick ? 'cursor-pointer' : ''}
      `}
      liquid={true}
      liquidIntensity={liquidIntensity}
      liquidDistortion={0.4}
      liquidAnimated={true}
      liquidInteractive={interactive}
      onClick={onClick}
      style={{
        animation: `slideInScale 0.8s ease-out ${delay}ms both`
      }}
    >
      {/* Subtle moving gradient */}
      <div 
        className="absolute inset-0 opacity-20 transition-opacity duration-500 group-hover:opacity-30"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${color}40 0%, transparent 70%)`
        }}
      />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div 
              className={`${config.iconPadding} rounded-2xl backdrop-blur-sm border border-white/20`}
              style={{ background: `${color}20` }}
            >
              {React.cloneElement(icon, { 
                className: config.iconSize, 
                style: { color } 
              })}
            </div>
            <h3 className={`${config.titleSize} font-semibold text-white`}>
              {title}
            </h3>
          </div>
          <TrendIcon />
        </div>
        
        {/* Progress Circle */}
        <div className="flex justify-center mb-6">
          <AnimatedCircularProgress 
            value={score} 
            color={color} 
            size={config.progressSize}
            delay={delay + 200}
          />
        </div>
        
        {/* Description */}
        <div className="text-center space-y-2">
          <div className={`${config.titleSize} font-bold ${getScoreColor(score)}`}>
            {getScoreDescription(score)}
          </div>
          <div className={`${config.subtitleSize} text-white/70`}>
            {subtitle}
          </div>
        </div>
      </div>
    </EnhancedGlassCard>
  );
});

EnhancedScoreCard.displayName = 'EnhancedScoreCard';

export default EnhancedScoreCard; 