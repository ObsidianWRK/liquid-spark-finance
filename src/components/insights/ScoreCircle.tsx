import React, { useEffect, useState } from 'react';

interface ScoreCircleProps {
  score: number;
  size?: 'small' | 'medium' | 'large';
  label?: string;
  color?: string;
  animated?: boolean;
}

const ScoreCircle: React.FC<ScoreCircleProps> = ({ 
  score, 
  size = 'medium', 
  label, 
  color,
  animated = true 
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedScore(score);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedScore(score);
    }
  }, [score, animated]);

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-20 h-20 sm:w-24 sm:h-24',
    large: 'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32'
  };

  const textSizeClasses = {
    small: 'text-lg',
    medium: 'text-xl sm:text-2xl',
    large: 'text-2xl sm:text-3xl md:text-4xl'
  };

  const getScoreColor = (score: number) => {
    if (color) return color;
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const scoreColor = getScoreColor(animatedScore);
  const circumference = 2 * Math.PI * 40;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Background circle */}
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={scoreColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={animated ? strokeDashoffset : circumference - (score / 100) * circumference}
            style={{
              transition: animated ? 'stroke-dashoffset 1.5s ease-in-out' : 'none'
            }}
          />
        </svg>
        
        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold text-white ${textSizeClasses[size]}`}>
            {Math.round(animatedScore)}
          </span>
        </div>
      </div>
      
      {label && (
        <span className="text-xs sm:text-sm text-white/70 text-center font-medium">
          {label}
        </span>
      )}
    </div>
  );
};

export default ScoreCircle; 