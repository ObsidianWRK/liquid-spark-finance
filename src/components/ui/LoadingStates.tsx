import React from 'react';
import { Loader2, TrendingUp, CreditCard, BarChart3, Calculator } from 'lucide-react';
import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

interface PageLoadingProps {
  page: string;
  message?: string;
}

interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

// Basic loading spinner
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <Loader2 className={cn(
      'animate-spin text-blue-400',
      sizeClasses[size],
      className
    )} />
  );
};

// Skeleton loading component
export const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  variant = 'rectangular' 
}) => {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-white/10 via-white/20 to-white/10 bg-[length:200%_100%]';
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  return (
    <div 
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={{
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, shimmer 2s ease-in-out infinite'
      }}
    />
  );
};

// Progress bar component
export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  label, 
  showPercentage = true, 
  className 
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={cn('space-y-2', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center">
          {label && (
            <span className="text-sm font-medium text-white/80">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm text-white/60">{Math.round(clampedProgress)}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

// Account card skeleton
export const AccountCardSkeleton: React.FC = () => (
  <Card className="p-6">
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton variant="circular" className="w-6 h-6" />
      </div>
      <Skeleton className="h-8 w-32" />
      <div className="flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  </Card>
);

// Transaction list skeleton
export const TransactionListSkeleton: React.FC = () => (
  <Card className="p-6">
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 py-3">
          <Skeleton variant="circular" className="w-10 h-10" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full max-w-[200px]" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-5 w-20" />
        </div>
      ))}
    </div>
  </Card>
);

// Chart skeleton
export const ChartSkeleton: React.FC = () => (
  <Card className="p-6">
    <div className="space-y-4">
      <Skeleton className="h-6 w-40" />
      <div className="h-64 flex items-end justify-between gap-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton 
            key={index} 
            className={`w-full max-w-8`}
            style={{ height: `${Math.random() * 80 + 20}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  </Card>
);

// Page-specific loading states
export const PageLoading: React.FC<PageLoadingProps> = ({ page, message }) => {
  const pageConfig = {
    dashboard: {
      icon: <TrendingUp className="w-8 h-8 text-blue-400" />,
      title: 'Loading Dashboard',
      defaultMessage: 'Gathering your financial overview...'
    },
    accounts: {
      icon: <CreditCard className="w-8 h-8 text-green-400" />,
      title: 'Loading Accounts',
      defaultMessage: 'Syncing your account data...'
    },
    insights: {
      icon: <BarChart3 className="w-8 h-8 text-purple-400" />,
      title: 'Analyzing Data',
      defaultMessage: 'Calculating your financial insights...'
    },
    calculators: {
      icon: <Calculator className="w-8 h-8 text-orange-400" />,
      title: 'Loading Tools',
      defaultMessage: 'Preparing financial calculators...'
    }
  };

  const config = pageConfig[page as keyof typeof pageConfig] || {
    icon: <LoadingSpinner size="lg" />,
    title: 'Loading',
    defaultMessage: 'Please wait...'
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
              {config.icon}
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">
              {config.title}
            </h2>
            <p className="text-white/70">
              {message || config.defaultMessage}
            </p>
          </div>

          <div className="flex justify-center">
            <LoadingSpinner size="md" />
          </div>
        </div>
      </Card>
    </div>
  );
};

// Grid skeleton for responsive layouts
export const GridSkeleton: React.FC<{ items?: number; columns?: number }> = ({ 
  items = 6, 
  columns = 3 
}) => (
  <div className={cn(
    'grid gap-6',
    columns === 1 && 'grid-cols-1',
    columns === 2 && 'grid-cols-1 md:grid-cols-2',
    columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    columns === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  )}>
    {Array.from({ length: items }).map((_, index) => (
      <AccountCardSkeleton key={index} />
    ))}
  </div>
);

// Inline loading with text
export const InlineLoading: React.FC<{ message?: string }> = ({ 
  message = 'Loading...' 
}) => (
  <div className="flex items-center gap-3 text-white/70">
    <LoadingSpinner size="sm" />
    <span className="text-sm">{message}</span>
  </div>
);

// Button loading state
export const ButtonLoading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-2">
    <LoadingSpinner size="sm" />
    {children}
  </div>
);

export default {
  LoadingSpinner,
  Skeleton,
  ProgressBar,
  AccountCardSkeleton,
  TransactionListSkeleton,
  ChartSkeleton,
  PageLoading,
  GridSkeleton,
  InlineLoading,
  ButtonLoading
}; 