
import React, { useEffect, useState } from 'react';
import GlassCard from '../GlassCard';

interface HealthScoreProps {
  score: number;
  category: string;
  lastUpdated: Date;
}

const HealthScore = ({ score, category, lastUpdated }: HealthScoreProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 200);
    return () => clearTimeout(timer);
  }, [score]);

  const getScoreColor = (score: number) => {
    if (score <= 40) return '#FF3B30';
    if (score <= 70) return '#FF9500';
    return '#34C759';
  };

  const getScoreCategory = (score: number) => {
    if (score <= 40) return 'Poor';
    if (score <= 70) return 'Fair';
    if (score <= 85) return 'Good';
    return 'Excellent';
  };

  const circumference = 2 * Math.PI * 60;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <GlassCard 
      variant="elevated" 
      className="p-8 mb-6 text-center relative overflow-hidden stagger-item"
      style={{ animationDelay: '0ms' }}
    >
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 opacity-10 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${getScoreColor(score)}20, transparent 70%)`
        }}
      />
      
      <div className="relative z-10">
        <h2 className="text-xl font-bold text-white mb-6">Financial Health Score</h2>
        
        {/* Circular Progress */}
        <div className="relative flex justify-center items-center mb-6">
          <svg width="160" height="160" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r="60"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="80"
              cy="80"
              r="60"
              stroke={getScoreColor(score)}
              strokeWidth="8"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{
                filter: `drop-shadow(0 0 8px ${getScoreColor(score)}40)`
              }}
            />
          </svg>
          
          {/* Score display */}
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <div 
              className="text-5xl font-bold text-white transition-all duration-1000 ease-out"
              style={{ color: getScoreColor(score) }}
            >
              {Math.round(animatedScore)}
            </div>
            <div className="text-white/70 text-sm mt-1">out of 100</div>
          </div>
        </div>
        
        {/* Score category */}
        <div className="mb-4">
          <div 
            className="text-2xl font-bold mb-2"
            style={{ color: getScoreColor(score) }}
          >
            {getScoreCategory(score)}
          </div>
          <p className="text-white/70 text-sm">
            Your financial health is {getScoreCategory(score).toLowerCase()}. 
            {score < 70 && " Let's work on improving it!"}
            {score >= 70 && score < 85 && " You're on the right track!"}
            {score >= 85 && " Excellent financial management!"}
          </p>
        </div>
        
        {/* Last updated */}
        <div className="text-white/50 text-xs">
          Last updated: {lastUpdated.toLocaleDateString()}
        </div>
      </div>
    </GlassCard>
  );
};

export default HealthScore;
