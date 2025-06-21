/**
 * @fileoverview SegmentSlider - Multi-Value Progress Bar
 * @description Segmented progress visualization for InsightSliderStack
 */

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { VIZ_TOKENS } from './tokens';
import type { SegmentSliderProps } from './types';

/**
 * SegmentSlider Component
 * 
 * Features:
 * - Multi-segment progress visualization
 * - Smooth animations
 * - Color-coded segments
 * - Accessible labels
 */
export const SegmentSlider: React.FC<SegmentSliderProps> = ({
  segments,
  className,
}) => {
  // Calculate total value for percentage calculations
  const totalValue = segments.reduce((sum, segment) => sum + segment.value, 0);
  
  // Track cumulative widths for positioning
  let cumulativeWidth = 0;

  return (
    <div 
      className={cn(
        'relative w-full bg-white/5 overflow-hidden',
        className
      )}
      style={{
        height: '8px',
        borderRadius: VIZ_TOKENS.radius.SM,
      }}
      role="progressbar"
      aria-label="Multi-segment progress"
    >
      {/* Segments */}
      {segments.map((segment, index) => {
        const segmentWidth = (segment.value / totalValue) * 100;
        const segmentLeft = cumulativeWidth;
        cumulativeWidth += segmentWidth;

        return (
          <div
            key={index}
            className="absolute top-0 h-full transition-all duration-700 ease-out"
            style={{
              left: `${segmentLeft}%`,
              width: `${segmentWidth}%`,
              backgroundColor: segment.color,
              borderRadius: index === 0 
                ? `${VIZ_TOKENS.radius.SM} 0 0 ${VIZ_TOKENS.radius.SM}`
                : index === segments.length - 1
                  ? `0 ${VIZ_TOKENS.radius.SM} ${VIZ_TOKENS.radius.SM} 0`
                  : '0',
            }}
            title={`${segment.label}: ${segment.value}`}
          />
        );
      })}

      {/* Glow overlay for visual enhancement */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${VIZ_TOKENS.colors.WHITE_05} 50%, transparent 100%)`,
          borderRadius: VIZ_TOKENS.radius.SM,
        }}
      />
    </div>
  );
}; 