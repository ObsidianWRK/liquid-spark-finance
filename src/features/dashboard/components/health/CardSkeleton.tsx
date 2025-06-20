import React from 'react';
import { cn } from '@/shared/lib/utils';

interface CardSkeletonProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'compact' | 'expanded';
  interactive?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  children,
  className,
  variant = 'default',
  interactive = false,
  loading = false,
  onClick,
}) => {
  const baseClasses = cn(
    // Base Eco Impact card styling (dark mode only)
    'bg-white/[0.02] border-white/[0.08] rounded-2xl backdrop-blur-md',
    'transition-all duration-300 ease-out',
    
    // Variant-specific styling
    {
      'p-4 sm:p-6': variant === 'default',
      'p-3 sm:p-4': variant === 'compact',
      'p-6 sm:p-8': variant === 'expanded',
    },
    
    // Interactive states
    {
              'card-hover': interactive && !loading,
      'cursor-not-allowed opacity-60': loading,
    },
    
    // Custom classes
    className
  );

  if (loading) {
    return (
      <div className={baseClasses}>
        {/* Loading skeleton */}
        <div className="animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-white/[0.1] rounded-full"></div>
              <div className="h-5 bg-white/[0.1] rounded w-24"></div>
            </div>
            <div className="w-16 h-8 bg-white/[0.1] rounded"></div>
          </div>
          
          <div className="space-y-3">
            <div className="h-12 bg-white/[0.1] rounded-lg"></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="h-8 bg-white/[0.1] rounded"></div>
              <div className="h-8 bg-white/[0.1] rounded"></div>
            </div>
          </div>
          
          <div className="h-4 bg-white/[0.1] rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={baseClasses} onClick={onClick}>
      {children}
    </div>
  );
};

// Specialized skeletons for different card types
export const BiometricCardSkeleton: React.FC<Omit<CardSkeletonProps, 'children'>> = (props) => (
  <CardSkeleton {...props}>
    <div className="animate-pulse space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 bg-red-400/20 rounded-full"></div>
          <div className="h-4 bg-white/[0.1] rounded w-20"></div>
        </div>
        <div className="w-12 h-6 bg-green-400/20 rounded-full"></div>
      </div>
      
      {/* Stress level bar */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-3 bg-white/[0.1] rounded w-16"></div>
          <div className="h-3 bg-white/[0.1] rounded w-8"></div>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3">
          <div className="h-3 bg-gradient-to-r from-green-400 to-red-400 rounded-full w-2/3"></div>
        </div>
      </div>
      
      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-1">
            <div className="h-2 bg-white/[0.1] rounded w-12"></div>
            <div className="h-4 bg-white/[0.1] rounded w-16"></div>
          </div>
        ))}
      </div>
    </div>
  </CardSkeleton>
);

export const WellnessCardSkeleton: React.FC<Omit<CardSkeletonProps, 'children'>> = (props) => (
  <CardSkeleton {...props}>
    <div className="animate-pulse space-y-4">
      {/* Header with score circle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 bg-green-400/20 rounded-full"></div>
          <div className="h-4 bg-white/[0.1] rounded w-24"></div>
        </div>
      </div>
      
      {/* Score circle */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-20 h-20 bg-white/[0.1] rounded-full"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-6 bg-white/[0.1] rounded w-8"></div>
          </div>
        </div>
      </div>
      
      {/* Metrics */}
      <div className="space-y-2">
        <div className="h-4 bg-white/[0.1] rounded w-32 mx-auto"></div>
        <div className="h-3 bg-white/[0.1] rounded w-24 mx-auto"></div>
      </div>
    </div>
  </CardSkeleton>
);

export const AccountCardSkeleton: React.FC<Omit<CardSkeletonProps, 'children'>> = (props) => (
  <CardSkeleton {...props}>
    <div className="animate-pulse space-y-4">
      {/* Institution header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-400/20 rounded-lg"></div>
          <div className="space-y-1">
            <div className="h-4 bg-white/[0.1] rounded w-20"></div>
            <div className="h-3 bg-white/[0.1] rounded w-16"></div>
          </div>
        </div>
        <div className="h-6 bg-white/[0.1] rounded w-12"></div>
      </div>
      
      {/* Balance */}
      <div className="space-y-1">
        <div className="h-6 bg-white/[0.1] rounded w-24"></div>
        <div className="h-3 bg-white/[0.1] rounded w-16"></div>
      </div>
      
      {/* Last transaction */}
      <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-white/[0.1] rounded"></div>
          <div className="h-3 bg-white/[0.1] rounded w-20"></div>
        </div>
        <div className="h-3 bg-white/[0.1] rounded w-12"></div>
      </div>
    </div>
  </CardSkeleton>
); 