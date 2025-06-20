// Legacy GlassCard - Redirected to UniversalCard for optimization
// This maintains backward compatibility while using the optimized system

import { UniversalCard } from '@/shared/ui/UniversalCard';
import type { BaseCardProps } from '@/types/shared';

interface GlassCardProps extends Omit<BaseCardProps, 'variant'> {
  variant?: 'default' | 'elevated' | 'subtle';
  shape?: 'rounded' | 'card' | 'capsule';
  interactive?: boolean;
}

// Optimized wrapper component - consolidates legacy GlassCard functionality
export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  variant = 'default',
  shape = 'card',
  interactive = false,
  ...props 
}) => {
  // Map legacy variants to UniversalCard system
  const universalVariant = 'glass';
  const universalSize = variant === 'elevated' ? 'lg' : variant === 'subtle' ? 'sm' : 'md';
  
  return (
    <UniversalCard
      variant={universalVariant}
      size={universalSize}
      interactive={interactive}
      className={className}
      hover={interactive ? { scale: true, glow: true } : undefined}
      {...props}
    >
      {children}
    </UniversalCard>
  );
};

export default GlassCard;