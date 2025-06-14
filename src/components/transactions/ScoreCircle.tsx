
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
  const circumference = 2 * Math.PI * 8;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div 
      className={`relative transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
      }`}
      title={`${label}: ${score}/100`}
      style={{
        transitionDelay: isVisible ? `${delay}ms` : '0ms',
      }}
    >
      <svg width="20" height="20" className="transform -rotate-90">
        <circle
          cx="10"
          cy="10"
          r="8"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="1.5"
          fill="none"
        />
        <circle
          cx="10"
          cy="10"
          r="8"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span 
          className="text-[8px] font-bold"
          style={{ color }}
        >
          {score}
        </span>
      </div>
    </div>
  );
};

export default ScoreCircle;
