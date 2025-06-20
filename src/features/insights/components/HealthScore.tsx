import React, { useEffect, useState } from 'react';
import GlassCard from '../GlassCard';
import { Heart, TrendingUp, Activity } from 'lucide-react';

interface HealthScoreProps {
  score: number;
  trends: {
    exercise: number;
    nutrition: number;
    sleep: number;
    stress: number;
  };
}

const HealthScore = ({ score, trends }: HealthScoreProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 200);
    return () => clearTimeout(timer);
  }, [score]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#34C759';
    if (score >= 60) return '#FF9500';
    return '#FF3B30';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  const circumference = 2 * Math.PI * 40;
  const strokeDasharray = circumference;
  const strokeDashoffset =
    circumference - (animatedScore / 100) * circumference;

  return (
    <GlassCard
      className="glass-card glass-dark bg-gradient-to-br from-pink-500/20 to-red-500/20 liquid-gradient p-6 text-center relative overflow-hidden stagger-item"
      style={{ animationDelay: '0ms' }}
    >
      {/* Background Gradient */}
      <div
        className="absolute inset-0 opacity-10 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${getScoreColor(score)}20, transparent 70%)`,
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-center mb-4">
          <Heart className="w-5 h-5 text-pink-400 mr-2" />
          <h3 className="text-lg font-bold text-white">Health Score</h3>
          <TrendingUp className="w-4 h-4 text-pink-400 ml-2" />
        </div>

        {/* Enhanced Circular Progress with Glass Effect */}
        <div className="relative flex justify-center items-center mb-4">
          <div className="glass-card p-2 rounded-full">
            <svg width="120" height="120" className="transform -rotate-90">
              <circle
                cx="60"
                cy="60"
                r="40"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r="40"
                stroke="url(#healthGradient)"
                strokeWidth="6"
                fill="none"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                style={{
                  filter: `drop-shadow(0 0 8px ${getScoreColor(score)}40)`,
                }}
              />
              <defs>
                <linearGradient
                  id="healthGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <div
              className="text-3xl font-bold text-white transition-all duration-1000 ease-out"
              style={{ color: getScoreColor(score) }}
            >
              {Math.round(animatedScore)}
            </div>
            <div className="text-white/50 text-xs">out of 100</div>
          </div>
        </div>

        <div className="mb-4">
          <div
            className="text-xl font-bold mb-2"
            style={{ color: getScoreColor(score) }}
          >
            {getScoreLabel(score)}
          </div>
          <p className="text-white/70 text-sm">
            Based on spending patterns and lifestyle data
          </p>
        </div>

        {/* Health Metrics with Glass Progress Bars */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-white/80 text-sm flex items-center">
              <Activity className="w-3 h-3 mr-1" />
              Exercise
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-16 glass-progress h-2">
                <div
                  className="glass-progress-fill green h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${trends.exercise}%` }}
                />
              </div>
              <span className="text-white/60 text-xs">{trends.exercise}%</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-white/80 text-sm">Nutrition</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 glass-progress h-2">
                <div
                  className="glass-progress-fill blue h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${trends.nutrition}%` }}
                />
              </div>
              <span className="text-white/60 text-xs">{trends.nutrition}%</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-white/80 text-sm">Sleep</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 glass-progress h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${trends.sleep}%` }}
                />
              </div>
              <span className="text-white/60 text-xs">{trends.sleep}%</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-white/80 text-sm">Stress Level</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 glass-progress h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${100 - trends.stress}%` }}
                />
              </div>
              <span className="text-white/60 text-xs">Low</span>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default HealthScore;
