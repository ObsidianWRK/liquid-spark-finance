import React from 'react';
import { cn } from '@/shared/lib/utils';
import GlassCard from '../GlassCard';
import LiquidGlass from './LiquidGlass';

interface EnhancedGlassCardProps {
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
  
  // Liquid Glass specific props
  liquid?: boolean;
  liquidIntensity?: number; // 0-1
  liquidDistortion?: number; // 0-1
  liquidAnimated?: boolean;
  liquidInteractive?: boolean;
  performanceMode?: boolean;
}

const EnhancedGlassCard = ({
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
  role,
  
  // Liquid Glass props
  liquid = false,
  liquidIntensity = 0.6,
  liquidDistortion = 0.4,
  liquidAnimated = true,
  liquidInteractive = true,
  performanceMode = false
}: EnhancedGlassCardProps) => {
  
  // Auto-detect performance constraints
  const shouldEnableLiquid = React.useMemo(() => {
    if (!liquid) return false;
    if (performanceMode) return false;
    
    // Disable on mobile devices for better performance
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    // Disable on low-end devices
    const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (isMobile || isLowEnd) {
      // On mobile/low-end, only enable with reduced settings
      return {
        enabled: true,
        intensity: Math.min(liquidIntensity * 0.5, 0.3),
        distortion: Math.min(liquidDistortion * 0.5, 0.2),
        animated: false,
        interactive: false
      };
    }
    
    return {
      enabled: true,
      intensity: liquidIntensity,
      distortion: liquidDistortion,
      animated: liquidAnimated && !prefersReducedMotion,
      interactive: liquidInteractive
    };
  }, [liquid, liquidIntensity, liquidDistortion, liquidAnimated, liquidInteractive, performanceMode]);

  // If liquid effects are disabled, use standard GlassCard
  if (!shouldEnableLiquid || !shouldEnableLiquid.enabled) {
    return (
      <GlassCard
        className={className}
        variant={variant}
        shape={shape}
        interactive={interactive}
        shimmer={shimmer}
        style={style}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        aria-label={ariaLabel}
        role={role}
      >
        {children}
      </GlassCard>
    );
  }

  // Enhanced glass card with liquid effects
  return (
    <div className="relative">
      <GlassCard
        className={cn(
          'relative overflow-hidden',
          className
        )}
        variant={variant}
        shape={shape}
        interactive={interactive}
        shimmer={shimmer}
        style={style}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        aria-label={ariaLabel}
        role={role}
      >
        <LiquidGlass
          intensity={shouldEnableLiquid.intensity}
          distortion={shouldEnableLiquid.distortion}
          animated={shouldEnableLiquid.animated}
          interactive={shouldEnableLiquid.interactive}
          className="absolute inset-0"
        >
          <div className="relative z-10">
            {children}
          </div>
        </LiquidGlass>
      </GlassCard>
    </div>
  );
};

export default EnhancedGlassCard; 