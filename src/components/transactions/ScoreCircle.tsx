
import React from 'react';

interface ScoreCircleProps {
  score: number;
  label: string;
  isVisible: boolean;
  delay?: number;
  type?: string;
}

const getScoreColor = (type?: string) => {
  switch (type) {
    case 'health': return '#FF69B4'; // Pink for health
    case 'eco': return '#00FF7F'; // Green for eco  
    case 'financial': return '#00BFFF'; // Blue for financial
    default: return '#FFFFFF'; // Default white
  }
};

const ScoreCircle = ({ score, label, isVisible, delay = 0, type }: ScoreCircleProps) => {
  const color = getScoreColor(type);
  const circumference = 2 * Math.PI * 7; // radius = 7
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div 
      className={`relative transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
      }`}
      title={`${label}: ${score}/100`}
      style={{
        transitionDelay: isVisible ? `${delay}ms` : '0ms',
        width: '18px',
        height: '18px'
      }}
    >
      <svg width="18" height="18" className="transform -rotate-90">
        <circle
          cx="9"
          cy="9"
          r="7"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="1.5"
          fill="none"
        />
        <circle
          cx="9"
          cy="9"
          r="7"
          stroke={color}
          strokeWidth="1.5"
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
          className="text-[7px] font-bold leading-none"
          style={{ color }}
        >
          {score}
        </span>
      </div>
    </div>
  );
};

export default ScoreCircle;
