/**
 * @fileoverview TimelineAreaChart - Time Series Visualization
 * @description Area chart with d3-shape curveBasis for smooth curves
 * No Y-axis labels as per MetricIQ requirements
 */

import React, { useMemo } from 'react';
import { cn } from '@/shared/lib/utils';
import { VIZ_TOKENS } from './tokens';
import type { TimelineAreaChartProps } from './types';

/**
 * TimelineAreaChart Component
 * 
 * Features:
 * - Smooth curve interpolation (curveBasis)
 * - No Y-axis labels (clean design)
 * - Responsive scaling
 * - Gradient fill areas
 */
export const TimelineAreaChart: React.FC<TimelineAreaChartProps> = ({
  data,
  height = 120,
  color = VIZ_TOKENS.colors.WHITE_80,
  className,
  showXAxis = false,
  showYAxis = false,
}) => {
  const width = 300; // Default width, should be responsive

  // Process data and create path
  const { pathData, gradientId } = useMemo(() => {
    if (!data.length) return { pathData: '', gradientId: '' };

    // Find min/max for scaling
    const values = data.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue || 1;

    // Create path points
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((item.value - minValue) / range) * (height - 20);
      return { x, y };
    });

    // Generate smooth curve path using basic interpolation
    // (d3-shape would be ideal but keeping bundle size minimal)
    let pathString = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];
      
      if (next) {
        // Create smooth curve using quadratic bezier
        const cpX = prev.x + (curr.x - prev.x) * 0.5;
        const cpY = prev.y + (curr.y - prev.y) * 0.5;
        pathString += ` Q ${cpX} ${cpY} ${curr.x} ${curr.y}`;
      } else {
        pathString += ` L ${curr.x} ${curr.y}`;
      }
    }

    // Close path for area fill
    const lastPoint = points[points.length - 1];
    const areaPath = pathString + ` L ${lastPoint.x} ${height} L ${points[0].x} ${height} Z`;

    return {
      pathData: areaPath,
      gradientId: `timeline-gradient-${Math.random().toString(36).substr(2, 9)}`,
    };
  }, [data, width, height]);

  if (!data.length) {
    return (
      <div 
        className={cn('flex items-center justify-center text-white/40 text-sm', className)}
        style={{ height }}
      >
        No data available
      </div>
    );
  }

  return (
    <div 
      className={cn('relative', className)}
      style={{ height }}
    >
      <svg 
        width="100%" 
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="overflow-visible"
      >
        {/* Gradient definitions */}
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="50%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Area fill */}
        <path
          d={pathData}
          fill={`url(#${gradientId})`}
          className="transition-all duration-500 ease-out"
        />

        {/* Stroke line */}
        <path
          d={pathData.split('L')[0] + data.slice(1).map((_, i) => 
            pathData.split('Q')[i + 1]?.split('L')[0] || ''
          ).join('')}
          fill="none"
          stroke={color}
          strokeWidth="2"
          filter="url(#glow)"
          className="transition-all duration-500 ease-out"
        />

        {/* Data points (optional hover targets) */}
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * width;
          const values = data.map(d => d.value);
          const minValue = Math.min(...values);
          const maxValue = Math.max(...values);
          const range = maxValue - minValue || 1;
          const y = height - ((item.value - minValue) / range) * (height - 20);
          
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill={color}
              opacity="0.8"
              className="hover:opacity-100 transition-opacity duration-200"
            >
              <title>{`${item.label || 'Value'}: ${item.value}`}</title>
            </circle>
          );
        })}
      </svg>

      {/* X-axis (optional) */}
      {showXAxis && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-white/40 mt-2">
          <span>{data[0]?.label}</span>
          <span>{data[data.length - 1]?.label}</span>
        </div>
      )}
    </div>
  );
}; 