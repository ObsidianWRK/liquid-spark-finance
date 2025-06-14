
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
}

const GlassCard = ({ 
  children, 
  className, 
  variant = 'default',
  shape = 'card',
  interactive = false,
  shimmer = false,
  style,
  onClick 
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
    interactive && 'glass-interactive',
    shimmer && 'glass-shimmer',
    className
  );

  return (
    <div className={classes} style={style} onClick={onClick}>
      {children}
    </div>
  );
};

export default GlassCard;
