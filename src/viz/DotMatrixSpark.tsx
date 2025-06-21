/**
 * @fileoverview DotMatrixSpark - Compact Sparkline Visualization
 * @description Dot-based mini charts with uniform 3px diameter dots
 */

import React, { useEffect, useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { VIZ_TOKENS } from './tokens';
import type { DotMatrixSparkProps } from './types';

/**
 * DotMatrixSpark Component
 * 
 * Features:
 * - Uniform 3px dot diameter (VIZ_TOKENS.dots.DIAMETER)
 * - Responsive scaling
 * - Pulse animation for new data
 * - High density visualization
 */
export const DotMatrixSpark: React.FC<DotMatrixSparkProps> = ({
  data,
  width = 120,
  height = 40,
  dotSize = VIZ_TOKENS.dots.DIAMETER,
  className,
}) => {
  const [animatedData, setAnimatedData] = useState<number[]>([]);

  // Animation on data change
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedData(data);
    }, 50);
    return () => clearTimeout(timer);
  }, [data]);

  // Calculate grid dimensions
  const dotSpacing = dotSize * 1.5; // 1.5x spacing for visual clarity
  const dotsPerRow = Math.floor(width / dotSpacing);
  const dotsPerColumn = Math.floor(height / dotSpacing);
  const totalDots = dotsPerRow * dotsPerColumn;

  // Normalize data to fit dot matrix
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  // Generate dot grid
  const dots = Array.from({ length: totalDots }, (_, index) => {
    const row = Math.floor(index / dotsPerRow);
    const col = index % dotsPerRow;
    
    // Map data point to this position
    const dataIndex = Math.floor((col / dotsPerRow) * data.length);
    const value = animatedData[dataIndex] || data[dataIndex] || 0;
    
    // Calculate intensity (0-1)
    const intensity = (value - minValue) / range;
    
    // Position
    const x = col * dotSpacing + dotSize / 2;
    const y = row * dotSpacing + dotSize / 2;
    
    // Opacity based on intensity and row position
    const baseOpacity = intensity * 0.8 + 0.1;
    const rowFactor = (dotsPerColumn - row) / dotsPerColumn; // Bottom rows more prominent
    const opacity = Math.min(1, baseOpacity * rowFactor);

    return {
      x,
      y,
      opacity,
      intensity,
      dataIndex,
    };
  });

  return (
    <div 
      className={cn(
        'relative overflow-hidden rounded-[12px]',
        className
      )}
      style={{ width, height }}
      role="img"
      aria-label={`Sparkline chart with ${data.length} data points`}
    >
      <svg 
        width={width} 
        height={height}
        className="absolute inset-0"
      >
        {/* Define gradient for enhanced visual appeal */}
        <defs>
          <radialGradient id="dotGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={VIZ_TOKENS.colors.WHITE} stopOpacity="1" />
            <stop offset="100%" stopColor={VIZ_TOKENS.colors.WHITE} stopOpacity="0.6" />
          </radialGradient>
        </defs>

        {/* Render dots */}
        {dots.map((dot, index) => (
          <circle
            key={index}
            cx={dot.x}
            cy={dot.y}
            r={dotSize / 2}
            fill="url(#dotGradient)"
            opacity={dot.opacity}
            className="transition-all duration-300 ease-out"
            style={{
              animationDelay: `${(dot.dataIndex * 50)}ms`,
              filter: dot.intensity > 0.7 
                ? 'drop-shadow(0 0 2px rgba(255,255,255,0.4))' 
                : 'none',
            }}
          />
        ))}
        
        {/* Optional trend line overlay */}
        {data.length > 1 && (
          <path
            d={`M ${dotSpacing / 2} ${height - (animatedData[0] || data[0]) / maxValue * height} 
                ${data.slice(1).map((value, i) => 
                  `L ${(i + 1) * (width / data.length)} ${height - value / maxValue * height}`
                ).join(' ')}`}
            stroke={VIZ_TOKENS.colors.WHITE_20}
            strokeWidth="1"
            fill="none"
            opacity="0.3"
            className="transition-all duration-500 ease-out"
          />
        )}
      </svg>

      {/* Pulse animation overlay for new data */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${VIZ_TOKENS.colors.WHITE_05} 0%, transparent 70%)`,
          animation: data !== animatedData ? 'pulse 0.6s ease-out' : 'none',
        }}
      />
    </div>
  );
}; 