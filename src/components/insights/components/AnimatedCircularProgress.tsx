import React, { memo, useEffect, useState } from 'react';

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
  showLabel = true,
  label = 'out of 100',
  maxValue = 100
}: AnimatedCircularProgressProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedValue / maxValue) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg 
        width={size} 
        height={size} 
        className="transform -rotate-90"
        role="img"
        aria-label={`Progress: ${Math.round(animatedValue)} ${label}`}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: `stroke-dashoffset ${animationDuration}ms ease-out`,
            filter: `drop-shadow(0 0 12px ${color}40)`
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span 
          className="text-3xl font-bold text-white tabular-nums"
          style={{
            transition: `all ${animationDuration}ms ease-out`,
            transitionDelay: `${delay}ms`
          }}
        >
          {Math.round(animatedValue)}
        </span>
        {showLabel && (
          <span className="text-sm text-white/60 mt-1">
            {label}
          </span>
        )}
      </div>
    </div>
  );
});

AnimatedCircularProgress.displayName = 'AnimatedCircularProgress';

export default AnimatedCircularProgress; 