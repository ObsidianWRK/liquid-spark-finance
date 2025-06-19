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
        return <Minus className="w-4 h-4 text-white/40" />;
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
    <div className={cn("bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6 hover:bg-white/[0.03] transition-all duration-300", className)} onClick={onClick}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center">
            <Heart className="w-5 h-5 text-pink-400" />
          </div>
          <h3 className="font-medium text-white/80">Wellness Score</h3>
        </div>
        <div className="flex items-center gap-1">
          {getTrendIcon()}
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-2xl font-bold text-white">{Math.round(animatedScore)}</p>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-pink-400">{getScoreLabel(animatedScore)}</span>
          <span className="text-white/60">wellness</span>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">Sleep Quality</span>
            <span className="text-white/80 text-sm font-medium">85%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">Activity Level</span>
            <span className="text-white/80 text-sm font-medium">72%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">Stress Management</span>
            <span className="text-white/80 text-sm font-medium">78%</span>
          </div>
        </div>
      )}
    </div>
  );
}; 