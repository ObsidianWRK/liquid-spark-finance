/**
 * @fileoverview GraphContainer - Base Chart Wrapper
 * @description Foundation container for all graph components with loading/error states
 */

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { VIZ_TOKENS } from './tokens';
import type { GraphContainerProps } from './types';

/**
 * GraphContainer Component
 * 
 * Provides:
 * - SVG clipping with 24px rounded rect
 * - Loading skeleton states
 * - Error boundary fallbacks
 * - Consistent padding and styling
 */
export const GraphContainer: React.FC<GraphContainerProps> = ({
  children,
  className,
  loading = false,
  error = null,
  fallback,
}) => {
  const containerClasses = cn(
    // Base layout
    'relative overflow-hidden',
    'bg-white/5 backdrop-blur-sm',
    
    // Border radius (24px)
    'rounded-[24px]',
    
    // Border
    'border border-white/10',
    
    className
  );

  // SVG clip path ID for rounded corners
  const clipId = React.useId();

  if (error) {
    return (
      <div className={containerClasses}>
        <div className="flex items-center justify-center h-40 p-6">
          <div className="text-center">
            <div className="text-white/40 text-sm mb-2">⚠️</div>
            <div className="text-white/60 text-xs">
              {typeof error === 'string' ? error : 'Chart error'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={containerClasses}>
        <div className="h-40 p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
            <div className="h-4 bg-white/10 rounded w-1/2"></div>
            <div className="h-20 bg-white/5 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!children && fallback) {
    return (
      <div className={containerClasses}>
        {fallback}
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {/* SVG Definitions for clipping */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
        <defs>
          <clipPath id={clipId}>
            <rect 
              width="100%" 
              height="100%" 
              rx={VIZ_TOKENS.radius.LG}
              ry={VIZ_TOKENS.radius.LG}
            />
          </clipPath>
        </defs>
      </svg>
      
      {/* Content with clipping applied */}
      <div 
        className="relative z-10 w-full h-full"
        style={{ clipPath: `url(#${clipId})` }}
      >
        {children}
      </div>
    </div>
  );
}; 