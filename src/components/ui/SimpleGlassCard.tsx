import React from 'react';
import { cn } from '@/lib/utils';

export interface SimpleGlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'subtle' | 'accent';
  interactive?: boolean;
  onClick?: () => void;
}

const SimpleGlassCard = ({ 
  children, 
  className, 
  variant = 'default',
  interactive = false,
  onClick 
}: SimpleGlassCardProps) => {
  const baseClasses = `
    relative overflow-hidden rounded-xl
    transition-all duration-300 ease-out
    backdrop-blur-[20px] backdrop-saturate-150
  `;

  const variantClasses = {
    default: `
      bg-white/[0.06] 
      border border-white/[0.08]
      shadow-[0_8px_32px_rgba(0,0,0,0.12)]
      shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
    `,
    elevated: `
      bg-white/[0.08] 
      border border-white/[0.12]
      shadow-[0_12px_40px_rgba(0,0,0,0.18)]
      shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]
    `,
    subtle: `
      bg-white/[0.04] 
      border border-white/[0.06]
      shadow-[0_4px_24px_rgba(0,0,0,0.08)]
      shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]
    `,
    accent: `
      bg-blue-500/[0.08] 
      border border-blue-400/[0.12]
      shadow-[0_8px_32px_rgba(74,158,255,0.12)]
      shadow-[inset_0_1px_0_rgba(74,158,255,0.08)]
    `
  };

  const interactiveClasses = interactive ? `
    cursor-pointer
    hover:bg-white/[0.08]
    hover:border-white/[0.12]
    hover:shadow-[0_12px_40px_rgba(0,0,0,0.16)]
    hover:transform hover:scale-[1.02] hover:-translate-y-1
    active:scale-[0.98] active:translate-y-0
  ` : '';

  return (
    <div 
      className={cn(
        baseClasses,
        variantClasses[variant],
        interactiveClasses,
        className
      )}
      onClick={onClick}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      } : undefined}
    >
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Subtle shimmer effect for interactive cards */}
      {interactive && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </div>
      )}
    </div>
  );
};

export default SimpleGlassCard; 