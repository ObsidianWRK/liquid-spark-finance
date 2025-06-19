import React, { memo, useEffect, useState, useMemo } from 'react';
import { cn } from '@/shared/lib/utils';
import { formatScore, formatFinancialScore } from '@/shared/utils/formatters';

export type ScoreType = 'health' | 'eco' | 'financial';

export interface SharedScoreCircleProps {
  score: number;
  type?: ScoreType;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

const getScoreColor = (score: number, type?: ScoreType): string => {
  if (type === 'health') {
    if (score >= 80) return 'text-green-500 border-green-500';
    if (score >= 60) return 'text-yellow-500 border-yellow-500';
    return 'text-red-500 border-red-500';
  }
  
  if (type === 'eco') {
    if (score >= 80) return 'text-emerald-500 border-emerald-500';
    if (score >= 60) return 'text-amber-500 border-amber-500';
    return 'text-orange-500 border-orange-500';
  }
  
  if (type === 'financial') {
    if (score >= 80) return 'text-blue-500 border-blue-500';
    if (score >= 60) return 'text-indigo-500 border-indigo-500';
    return 'text-purple-500 border-purple-500';
  }
  
  // Default color scheme
  if (score >= 80) return 'text-green-500 border-green-500';
  if (score >= 60) return 'text-yellow-500 border-yellow-500';
  return 'text-red-500 border-red-500';
};

const getScoreBackground = (score: number, type?: ScoreType): string => {
  const opacity = 'bg-opacity-10';
  
  if (type === 'health') {
    if (score >= 80) return `bg-green-500 ${opacity}`;
    if (score >= 60) return `bg-yellow-500 ${opacity}`;
    return `bg-red-500 ${opacity}`;
  }
  
  if (type === 'eco') {
    if (score >= 80) return `bg-emerald-500 ${opacity}`;
    if (score >= 60) return `bg-amber-500 ${opacity}`;
    return `bg-orange-500 ${opacity}`;
  }
  
  if (type === 'financial') {
    if (score >= 80) return `bg-blue-500 ${opacity}`;
    if (score >= 60) return `bg-indigo-500 ${opacity}`;
    return `bg-purple-500 ${opacity}`;
  }
  
  // Default
  if (score >= 80) return `bg-green-500 ${opacity}`;
  if (score >= 60) return `bg-yellow-500 ${opacity}`;
  return `bg-red-500 ${opacity}`;
};

export const SharedScoreCircle = memo(({
  score,
  type,
  label,
  size = 'md',
  showLabel = false,
  animated = false,
  className,
}: SharedScoreCircleProps) => {
  const normalizedScore = Math.max(0, Math.min(100, score));
  const circumference = 2 * Math.PI * 36; // radius = 36
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full border-2 transition-all',
          sizeClasses[size],
          getScoreColor(normalizedScore, type),
          getScoreBackground(normalizedScore, type),
          animated && 'animate-pulse'
        )}
        data-testid={`${type || 'score'}-circle`}
      >
        {/* SVG Progress Ring for larger sizes */}
        {size === 'lg' && (
          <svg
            className="absolute inset-0 -rotate-90"
            width="100%"
            height="100%"
            viewBox="0 0 80 80"
          >
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              opacity="0.2"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={cn(
                'transition-all duration-500',
                animated && 'animate-[spin_10s_linear_infinite]'
              )}
            />
          </svg>
        )}
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span 
            className={cn(
              "font-bold text-white tabular-nums leading-none",
              sizeClasses[size]
            )}
          >
            {type === 'financial' ? formatFinancialScore(normalizedScore) : formatScore(normalizedScore)}
          </span>
          {showLabel && (
            <span 
              className={cn(
                "text-white/60 leading-none mt-1",
                "text-xs"
              )}
            >
              {label || (type === 'financial' ? 'Financial' : type === 'health' ? 'Health' : 'Eco')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

SharedScoreCircle.displayName = 'SharedScoreCircle';

// Export a compound component for grouped scores
export interface ScoreGroupProps {
  scores: {
    health?: number;
    eco?: number;
    financial?: number;
  };
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  animated?: boolean;
  className?: string;
}

export const ScoreGroup = memo(({
  scores,
  size = 'md',
  showLabels = false,
  animated = false,
  className,
}: ScoreGroupProps) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {scores.health !== undefined && (
        <SharedScoreCircle
          score={scores.health}
          type="health"
          label="Health"
          size={size}
          showLabel={showLabels}
          animated={animated}
          data-testid="health-score"
        />
      )}
      {scores.eco !== undefined && (
        <SharedScoreCircle
          score={scores.eco}
          type="eco"
          label="Eco"
          size={size}
          showLabel={showLabels}
          animated={animated}
          data-testid="eco-score"
        />
      )}
      {scores.financial !== undefined && (
        <SharedScoreCircle
          score={scores.financial}
          type="financial"
          label="Financial"
          size={size}
          showLabel={showLabels}
          animated={animated}
          data-testid="financial-score"
        />
      )}
    </div>
  );
});

ScoreGroup.displayName = 'ScoreGroup'; 