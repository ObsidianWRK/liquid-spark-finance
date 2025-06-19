import React, { useEffect, useState } from 'react';
import { Heart, TrendingUp, TrendingDown, Minus, Shield, Activity } from 'lucide-react';
import { CardSkeleton } from './CardSkeleton';
import { WellnessMetric } from './MetricDisplay';
import { useWellnessScore, useBiometricTrends, useBiometrics } from '@/providers/BiometricsProvider';
import { cn } from '@/lib/utils';

interface WellnessScoreCardProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  onClick?: () => void;
}

export const WellnessScoreCard: React.FC<WellnessScoreCardProps> = ({
  className,
  size = 'md',
  showDetails = true,
  onClick,
}) => {
  const { state, isInitialized } = useBiometrics();
  const wellnessScore = useWellnessScore();
  const { wellnessTrend } = useBiometricTrends();
  const [animatedScore, setAnimatedScore] = useState(0);

  // Animate score change
  useEffect(() => {
    if (wellnessScore !== animatedScore) {
      const timer = setTimeout(() => {
        setAnimatedScore(wellnessScore);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [wellnessScore, animatedScore]);

  // Show loading skeleton if not initialized
  if (!isInitialized || !state) {
    return (
      <CardSkeleton 
        variant={size === 'sm' ? 'compact' : size === 'lg' ? 'expanded' : 'default'}
        className={className}
        loading
      />
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // green-500
    if (score >= 60) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Attention';
  };

  const getTrendIcon = () => {
    switch (wellnessTrend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendText = () => {
    switch (wellnessTrend) {
      case 'improving':
        return 'Improving';
      case 'declining':
        return 'Declining';
      default:
        return 'Stable';
    }
  };

  // Circle dimensions based on size
  const circleDimensions = {
    sm: { size: 60, radius: 24, strokeWidth: 4 },
    md: { size: 80, radius: 32, strokeWidth: 5 },
    lg: { size: 100, radius: 40, strokeWidth: 6 },
  };

  const { size: circleSize, radius, strokeWidth } = circleDimensions[size];
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const textSizes = {
    sm: { score: 'text-lg', label: 'text-xs', subtitle: 'text-xs' },
    md: { score: 'text-2xl', label: 'text-sm', subtitle: 'text-sm' },
    lg: { score: 'text-3xl', label: 'text-base', subtitle: 'text-base' },
  };

  return (
    <CardSkeleton
      variant={size === 'sm' ? 'compact' : size === 'lg' ? 'expanded' : 'default'}
      className={className}
      interactive={!!onClick}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-pink-400" />
          <span className={cn(
            'font-semibold text-white',
            textSizes[size].label
          )}>
            Wellness Score
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          {getTrendIcon()}
          <span className={cn(
            'text-white/60',
            textSizes[size].subtitle
          )}>
            {getTrendText()}
          </span>
        </div>
      </div>

      {/* Score Circle */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <svg width={circleSize} height={circleSize} className="transform -rotate-90">
            <circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              stroke={getScoreColor(wellnessScore)}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{
                filter: `drop-shadow(0 0 8px ${getScoreColor(wellnessScore)}40)`
              }}
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <span 
              className={cn(
                'font-bold transition-all duration-1000 ease-out',
                textSizes[size].score
              )}
              style={{ color: getScoreColor(wellnessScore) }}
            >
              {Math.round(animatedScore)}
            </span>
            <span className={cn(
              'text-white/50',
              textSizes[size].subtitle
            )}>
              /100
            </span>
          </div>
        </div>
      </div>

      {/* Score Label */}
      <div className="text-center mb-4">
        <div className={cn(
          'font-semibold text-white mb-1',
          textSizes[size].label
        )}>
          {getScoreLabel(wellnessScore)}
        </div>
        {showDetails && (
          <div className={cn(
            'text-white/60',
            textSizes[size].subtitle
          )}>
            Based on stress, HRV, and vitals
          </div>
        )}
      </div>

      {/* Details Section */}
      {showDetails && size !== 'sm' && (
        <div className="space-y-3">
          {/* Component Breakdown */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-white/[0.03] rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Shield className="w-3 h-3 text-blue-400 mr-1" />
                <span className="text-xs text-white/70">Stress</span>
              </div>
              <div className={cn(
                'font-semibold',
                (100 - (state.stressIndex || 0)) >= 70 ? 'text-green-400' :
                (100 - (state.stressIndex || 0)) >= 50 ? 'text-yellow-400' : 'text-red-400'
              )}>
                {Math.round(100 - (state.stressIndex || 0))}
              </div>
            </div>
            
            <div className="p-2 bg-white/[0.03] rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Activity className="w-3 h-3 text-green-400 mr-1" />
                <span className="text-xs text-white/70">HRV</span>
              </div>
              <div className={cn(
                'font-semibold',
                (state.heartRateVariability || 0) >= 40 ? 'text-green-400' :
                (state.heartRateVariability || 0) >= 25 ? 'text-yellow-400' : 'text-red-400'
              )}>
                {Math.round(state.heartRateVariability || 0)}
              </div>
            </div>
            
            <div className="p-2 bg-white/[0.03] rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Heart className="w-3 h-3 text-red-400 mr-1" />
                <span className="text-xs text-white/70">Heart</span>
              </div>
              <div className={cn(
                'font-semibold',
                (state.heartRate || 0) >= 60 && (state.heartRate || 0) <= 100 ? 'text-green-400' :
                (state.heartRate || 0) >= 50 && (state.heartRate || 0) <= 120 ? 'text-yellow-400' : 'text-red-400'
              )}>
                {Math.round(state.heartRate || 0)}
              </div>
            </div>
          </div>

          {/* Last updated */}
          {state.lastReading && (
            <div className="text-xs text-white/60 text-center pt-2 border-t border-white/10">
              Updated {new Date(state.lastReading).toLocaleTimeString()}
            </div>
          )}
        </div>
      )}
    </CardSkeleton>
  );
}; 