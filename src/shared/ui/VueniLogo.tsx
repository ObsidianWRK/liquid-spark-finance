/**
 * VueniLogo Component
 * 
 * Official Vueni logo component with embedded SVG and right-click context menu
 * for downloading brand assets. Maintains design consistency and accessibility.
 */

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { BrandDownloadMenu } from './BrandDownloadMenu';

interface VueniLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'text-only' | 'icon-only';
  className?: string;
  onClick?: () => void;
  showContextMenu?: boolean;
  onDownloadComplete?: (filename: string) => void;
}

const sizeClasses = {
  sm: 'h-6 w-auto', // 24px height
  md: 'h-8 w-auto', // 32px height  
  lg: 'h-10 w-auto', // 40px height
  xl: 'h-12 w-auto', // 48px height
};

const VueniLogoSVG: React.FC<{ className?: string; variant: 'full' | 'text-only' | 'icon-only' }> = ({ 
  className, 
  variant 
}) => {
  if (variant === 'icon-only') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Vueni"
      >
        <defs>
          <linearGradient id="vueniIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:'#4A9EFF',stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#9D4EDD',stopOpacity:1}} />
          </linearGradient>
        </defs>
        
        {/* Glass background */}
        <rect 
          x="2" y="2" width="36" height="36" rx="8" 
          fill="rgba(255,255,255,0.05)" 
          stroke="rgba(255,255,255,0.1)" 
          strokeWidth="1"
        />
        
        {/* V Icon */}
        <path 
          d="M12 15 L20 25 L28 15" 
          stroke="url(#vueniIconGradient)" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Accent dot */}
        <circle cx="30" cy="12" r="2" fill="#4A9EFF" opacity="0.8"/>
      </svg>
    );
  }

  return (
    <svg 
      className={className} 
      viewBox="0 0 200 60" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Vueni - Intelligence you can bank on"
    >
      <defs>
        <linearGradient id="vueniGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor:'#4A9EFF',stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#9D4EDD',stopOpacity:1}} />
        </linearGradient>
      </defs>
      
      {variant === 'full' && (
        <rect 
          x="8" y="8" width="184" height="44" rx="12" 
          fill="rgba(255,255,255,0.05)" 
          stroke="rgba(255,255,255,0.1)" 
          strokeWidth="1"
        />
      )}
      
      <text 
        x="100" y="38" 
        textAnchor="middle" 
        fontFamily="SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif" 
        fontSize="24" 
        fontWeight="700" 
        fill="url(#vueniGradient)" 
        letterSpacing="-0.02em"
      >
        Vueni
      </text>
      
      {variant === 'full' && (
        <>
          <circle cx="150" cy="20" r="3" fill="#4A9EFF" opacity="0.8"/>
          <circle cx="150" cy="20" r="1.5" fill="#FFFFFF" opacity="0.9"/>
        </>
      )}
    </svg>
  );
};

export const VueniLogo: React.FC<VueniLogoProps> = ({
  size = 'md',
  variant = 'text-only',
  className,
  onClick,
  showContextMenu = true,
  onDownloadComplete,
}) => {
  const logoElement = (
    <div
      className={cn(
        'inline-flex items-center cursor-pointer transition-all duration-200',
        'card-hover-enhanced focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-black',
        'rounded-lg p-1',
        className
      )}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label="Vueni logo - Right-click to download brand assets"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <VueniLogoSVG 
        className={cn(sizeClasses[size], 'transition-all duration-200')} 
        variant={variant}
      />
    </div>
  );

  if (!showContextMenu) {
    return logoElement;
  }

  return (
    <BrandDownloadMenu onDownloadComplete={onDownloadComplete}>
      {logoElement}
    </BrandDownloadMenu>
  );
};

// Legacy text-based logo for backward compatibility
export const VueniTextLogo: React.FC<{ 
  className?: string; 
  onClick?: () => void;
}> = ({ className, onClick }) => (
  <span 
    className={cn(
      "text-white font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent cursor-pointer",
      className
    )}
    onClick={onClick}
  >
    Vueni
  </span>
);

export default VueniLogo; 