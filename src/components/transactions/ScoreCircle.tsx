
import React from 'react';

interface ScoreCircleProps {
  score: number;
  label: string;
  isVisible: boolean;
  delay?: number;
  type?: string;
}

const getScoreColor = (score: number, type?: string) => {
  if (type === 'health') return '#FF6B9D'; // Pink for health
  if (type === 'eco') return '#34C759'; // Green for eco
  if (type === 'financial') return '#007AFF'; // Blue for financial
  
  // Default color based on score
  if (score >= 80) return '#34C759'; // Green
  if (score >= 60) return '#FF9500'; // Orange
  return '#FF3B30'; // Red
};

const ScoreCircle = ({ score, label, isVisible, delay = 0, type }: ScoreCircleProps) => {
  const color = getScoreColor(score, type);
  const circumference = 2 * Math.PI * 12;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div 
      className={`relative transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
      }`}
      title={`${label}: ${score}/100`}
      style={{
        transitionDelay: isVisible ? `${delay}ms` : '0ms',
        transitionTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      }}
    >
      <div className="w-8 h-8 relative">
        <svg width="32" height="32" className="transform -rotate-90 absolute inset-0">
          <circle
            cx="16"
            cy="16"
            r="12"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="2.5"
            fill="none"
          />
          <circle
            cx="16"
            cy="16"
            r="12"
            stroke={color}
            strokeWidth="2.5"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            style={{
              filter: `drop-shadow(0 0 4px ${color}60)`
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span 
            className="text-xs font-bold leading-none"
            style={{ color }}
          >
            {score}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScoreCircle;
