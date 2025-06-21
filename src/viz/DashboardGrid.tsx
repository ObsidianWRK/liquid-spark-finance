/**
 * @fileoverview DashboardGrid - MetricIQ Layout Foundation
 * @description Responsive grid system for visualization cards
 * Uses CSS Grid with auto-rows for optimal card sizing
 */

import React from 'react';
import { cn } from '@/shared/lib/utils';

export interface DashboardGridProps {
  /** Grid content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Grid density */
  density?: 'compact' | 'comfortable' | 'spacious';
  /** Maximum columns */
  maxCols?: 2 | 3 | 4;
}

/**
 * DashboardGrid Component
 * 
 * Responsive grid following MetricIQ design patterns:
 * - Mobile: 1 column, 16px gap
 * - Tablet: 2 columns, 24px gap  
 * - Desktop: 2-4 columns, 32px gap
 * - Auto-rows for consistent card heights
 */
export const DashboardGrid: React.FC<DashboardGridProps> = ({
  children,
  className,
  density = 'comfortable',
  maxCols = 3,
}) => {
  const gridClasses = cn(
    // Base grid
    'grid auto-rows-max w-full',
    
    // Responsive columns
    'grid-cols-1',
    'md:grid-cols-2',
    maxCols >= 3 && 'lg:grid-cols-3',
    maxCols >= 4 && 'xl:grid-cols-4',
    
    // Gap sizing based on density
    {
      'gap-4': density === 'compact',
      'gap-6 md:gap-8': density === 'comfortable', 
      'gap-8 md:gap-12': density === 'spacious',
    },
    
    className
  );

  return (
    <div 
      className={gridClasses}
      data-testid="dashboard-grid"
      role="main"
      aria-label="Visualization Dashboard"
    >
      {children}
    </div>
  );
}; 