import React, { useEffect, useState } from 'react';
import { Heart, TrendingUp, TrendingDown, Minus, Shield, Activity } from 'lucide-react';
import { CardSkeleton } from './CardSkeleton';
import { WellnessMetric } from './MetricDisplay';
import { useWellnessScore, useBiometricTrends, useBiometrics } from '@/providers/BiometricsProvider';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
    <Card>
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <Heart className="text-pink-400" />
        <CardTitle>Wellness Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="text-3xl font-bold text-pink-400">{Math.round(animatedScore)}</div>
          <p className="text-sm text-muted-foreground">Overall wellness</p>
          {showDetails && (
            <div className="mt-4 space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Sleep Quality</span>
                <span>85%</span>
              </div>
              <div className="flex justify-between">
                <span>Activity Level</span>
                <span>72%</span>
              </div>
              <div className="flex justify-between">
                <span>Stress Management</span>
                <span>78%</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 