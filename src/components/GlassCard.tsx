
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!interactive || !onClick) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={classes}
      style={style}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
    >
      {children}
    </div>
  );
};

export default GlassCard;
