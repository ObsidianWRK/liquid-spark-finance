/**
 * @fileoverview KpiDonut - Circular Progress Indicator
 * @description Animated donut chart for KPI visualization
 * Replaces AgeOfMoneyRing and CreditScore circular components
 */

import React, { useEffect, useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { VIZ_TOKENS } from './tokens';
import type { KpiDonutProps } from './types';

/**
 * KpiDonut Component
 * 
 * Features:
 * - Animated progress with easing
 * - Consistent 24px container radius
 * - Trend indicators
 * - Accessibility labels
 */
export const KpiDonut: React.FC<KpiDonutProps> = ({
  data,
  size = 120,
  strokeWidth = 8,
  className,
  showLabel = true,
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(data.value);
    }, 100);
    return () => clearTimeout(timer);
  }, [data.value]);

  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedValue / data.max) * 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Center position
  const center = size / 2;

  // Color based on progress
  const getProgressColor = (percentage: number): string => {
    if (percentage >= 80) return VIZ_TOKENS.colors.WHITE_95; // Excellent
    if (percentage >= 60) return VIZ_TOKENS.colors.WHITE_80; // Good
    if (percentage >= 40) return VIZ_TOKENS.colors.WHITE_60; // Fair
    return VIZ_TOKENS.colors.WHITE_40; // Needs attention
  };

  const progressColor = data.color || getProgressColor(progress);

  return (
    <div 
      className={cn(
        'relative inline-flex items-center justify-center',
        className
      )}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={data.value}
      aria-valuemin={0}
      aria-valuemax={data.max}
      aria-label={`${data.label}: ${data.value} of ${data.max}`}
    >
      {/* SVG Circle */}
      <svg 
        width={size} 
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={VIZ_TOKENS.colors.WHITE_10}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.1))',
          }}
        />
      </svg>

      {/* Center content */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center">
            <div 
              className="text-xl font-bold leading-none"
              style={{ color: progressColor }}
            >
              {Math.round(progress)}
            </div>
            <div className="text-xs text-white/60 mt-1">
              {data.label}
            </div>
            
            {/* Trend indicator */}
            {data.trend && data.trendValue && (
              <div className="flex items-center justify-center mt-1 text-xs">
                <span 
                  className="mr-1"
                  style={{ 
                    color: data.trend === 'up' 
                      ? VIZ_TOKENS.colors.WHITE_80 
                      : data.trend === 'down' 
                        ? VIZ_TOKENS.colors.WHITE_40
                        : VIZ_TOKENS.colors.WHITE_60
                  }}
                >
                  {data.trend === 'up' ? '↗' : data.trend === 'down' ? '↘' : '→'}
                </span>
                <span className="text-white/40">
                  {data.trendValue}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 