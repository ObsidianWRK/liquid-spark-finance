import React, { memo, useEffect, useState, useMemo, useRef } from 'react';
import { formatScore } from '@/utils/formatters';

interface AnimatedCircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  animationDuration?: number;
  delay?: number;
  showLabel?: boolean;
  label?: string;
  maxValue?: number;
}

const AnimatedCircularProgress = memo(({
  value,
  size = 120,
  strokeWidth = 8,
  color = '#007AFF',
  animationDuration = 1000,
  delay = 0,
  showLabel = false,
  label = 'out of 100',
  maxValue = 100
}: AnimatedCircularProgressProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // Responsive size calculation
  const responsiveSize = useMemo(() => {
    if (typeof window === 'undefined') return size;
    
    const width = window.innerWidth;
    if (width >= 1440) return Math.max(size, 140); // Large desktop
    if (width >= 1024) return Math.max(size, 120); // Desktop
    if (width >= 768) return Math.max(size, 100);  // Tablet
    return size; // Mobile
  }, [size]);

  // Intersection Observer for better performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          const timer = setTimeout(() => {
            setAnimatedValue(value);
          }, delay);
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [value, delay]);

  const radius = (responsiveSize - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedValue / maxValue) * circumference;

  // Validate and sanitize the value
  const sanitizedValue = useMemo(() => {
    if (isNaN(value) || !isFinite(value)) return 0;
    return Math.max(0, Math.min(maxValue, value));
  }, [value, maxValue]);

  return (
    <div 
      ref={elementRef}
      className="relative flex items-center justify-center hardware-accelerated" 
      style={{ width: responsiveSize, height: responsiveSize }}
    >
      <svg 
        width={responsiveSize} 
        height={responsiveSize} 
        className="transform -rotate-90"
        viewBox={`0 0 ${responsiveSize} ${responsiveSize}`}
        role="img"
        aria-label={`Progress: ${Math.round(animatedValue)}`}
      >
        {/* Enhanced background circle */}
        <circle
          cx={responsiveSize / 2}
          cy={responsiveSize / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Enhanced progress circle with better rendering */}
        <circle
          cx={responsiveSize / 2}
          cy={responsiveSize / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={isVisible ? offset : circumference}
          strokeLinecap="round"
          style={{
            transition: `stroke-dashoffset ${animationDuration}ms ease-out`,
            filter: `drop-shadow(0 0 12px ${color}40)`,
            transform: 'translateZ(0)', // Force hardware acceleration
            willChange: 'stroke-dashoffset' // Optimize for animations
          }}
        />
      </svg>
      
      {/* Center content with responsive sizing - removed label display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span 
          className="font-bold text-white tabular-nums"
          style={{
            fontSize: `${responsiveSize * 0.25}px`,
            transition: `all ${animationDuration}ms ease-out`,
            transitionDelay: `${delay}ms`
          }}
        >
          {formatScore(animatedValue).replace('.', '.')}
        </span>
      </div>
    </div>
  );
});

AnimatedCircularProgress.displayName = 'AnimatedCircularProgress';

export default AnimatedCircularProgress; 