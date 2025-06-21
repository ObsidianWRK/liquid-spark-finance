/**
 * @fileoverview GridTile - Individual Card Wrapper
 * @description Standardized tile wrapper with consistent spacing and styling
 */

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { VIZ_TOKENS } from './tokens';
import type { GridTileProps } from './types';

/**
 * GridTile Component
 * 
 * Provides consistent:
 * - 24px border radius (VIZ_TOKENS.radius.LG)
 * - 24px internal padding
 * - Shadow tiers (2dp default, 4dp hover)
 * - Optional title slot
 */
export const GridTile: React.FC<GridTileProps> = ({
  children,
  title,
  className,
  padding = 'lg',
}) => {
  const paddingClasses = {
    sm: 'p-4',    // 16px
    md: 'p-5',    // 20px  
    lg: 'p-6',    // 24px
  };

  const tileClasses = cn(
    // Base layout
    'relative overflow-hidden bg-white/5',
    
    // Border radius (24px)
    'rounded-[24px]',
    
    // Shadow tiers
    'shadow-[0_2px_4px_rgba(0,0,0,.05)]',
    'hover:shadow-[0_4px_12px_rgba(0,0,0,.08)]',
    
    // Smooth transitions
    'transition-all duration-200 ease-out',
    
    // Padding
    paddingClasses[padding],
    
    className
  );

  return (
    <div 
      className={tileClasses}
      data-testid="grid-tile"
      style={{
        borderRadius: VIZ_TOKENS.radius.LG,
        boxShadow: VIZ_TOKENS.shadows.CARD,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = VIZ_TOKENS.shadows.CARD_HOVER;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = VIZ_TOKENS.shadows.CARD;
      }}
    >
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white/95 leading-tight">
            {title}
          </h3>
        </div>
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}; 