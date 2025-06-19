// Legacy SimpleGlassCard - Redirected to UnifiedCard for optimization
// This maintains backward compatibility while using the optimized system

import React from 'react';
import { UnifiedCard } from './UnifiedCard';
import { cn } from '@/shared/lib/utils';

export interface SimpleGlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'subtle' | 'accent';
  interactive?: boolean;
  onClick?: () => void;
}

const SimpleGlassCard: React.FC<SimpleGlassCardProps> = ({ 
  children, 
  className, 
  variant = 'default',
  interactive = false,
  onClick 
}) => {
  // Map SimpleGlassCard variants to UnifiedCard system
  const unifiedVariant = variant === 'accent' ? 'financial' : 'default';
  const unifiedSize = variant === 'elevated' ? 'xl' : variant === 'subtle' ? 'sm' : 'lg';
  
  return (
    <UnifiedCard
      variant={unifiedVariant}
      size={unifiedSize}
      interactive={interactive}
      onClick={onClick}
      className={cn(
        // Additional styling to match SimpleGlassCard behavior
        variant === 'accent' && 'bg-blue-500/[0.08] border-blue-400/[0.12]',
        className
      )}
    >
      {children}
    </UnifiedCard>
  );
};

export default SimpleGlassCard; 