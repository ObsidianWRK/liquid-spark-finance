
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'subtle';
  shape?: 'rounded' | 'card' | 'capsule';
  interactive?: boolean;
  shimmer?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  'aria-label'?: string;
  role?: string;
}

const GlassCard = ({ 
  children, 
  className, 
  variant = 'default',
  shape = 'card',
  interactive = false,
  shimmer = false,
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
  'aria-label': ariaLabel,
  role
}: GlassCardProps) => {
  const baseClasses = 'glass';
  const variantClasses = {
    default: '',
    elevated: 'glass-elevated',
    subtle: 'glass-subtle'
  };
  const shapeClasses = {
    rounded: 'glass-rounded',
    card: 'glass-card',
    capsule: 'glass-capsule'
  };

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    shapeClasses[shape],
    interactive && 'glass-interactive focus:outline-none focus:ring-2 focus:ring-blue-400',
    shimmer && 'glass-shimmer',
    className
  );

  const Component = onClick || interactive ? 'button' : 'div';

  return (
    <Component 
      className={classes} 
      style={style} 
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={ariaLabel}
      role={role}
      type={onClick ? 'button' : undefined}
    >
      {children}
    </Component>
  );
};

export default GlassCard;
