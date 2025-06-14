
import React, { useEffect, useState } from 'react';
import GlassCard from '../GlassCard';
import { Leaf, TrendingUp, Recycle } from 'lucide-react';

interface EcoScoreProps {
  score: number;
  metrics: {
    carbonFootprint: number;
    sustainableSpending: number;
    greenTransport: number;
    renewableEnergy: number;
  };
  monthlyImpact: {
    co2Saved: number;
    treesEquivalent: number;
  };
}

const EcoScore = ({ score, metrics, monthlyImpact }: EcoScoreProps) => {
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

  const getEcoLabel = (score: number) => {
    if (score >= 90) return 'Eco Champion';
    if (score >= 80) return 'Very Green';
    if (score >= 70) return 'Eco Friendly';
    if (score >= 60) return 'Making Progress';
    return 'Room to Grow';
  };

  const circumference = 2 * Math.PI * 40;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <GlassCard 
      className="glass-card glass-dark bg-gradient-to-br from-green-500/20 to-emerald-500/20 liquid-gradient p-6 text-center relative overflow-hidden stagger-item"
      style={{ animationDelay: '100ms' }}
    >
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 opacity-10 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${getScoreColor(score)}20, transparent 70%)`
        }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center justify-center mb-4">
          <Leaf className="w-5 h-5 text-green-400 mr-2" />
          <h3 className="text-lg font-bold text-white">Eco Score</h3>
          <TrendingUp className="w-4 h-4 text-green-400 ml-2" />
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
                stroke="url(#ecoGradient)"
                strokeWidth="6"
                fill="none"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                style={{
                  filter: `drop-shadow(0 0 8px ${getScoreColor(score)}40)`
                }}
              />
              <defs>
                <linearGradient id="ecoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
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
            {getEcoLabel(score)}
          </div>
          <p className="text-white/70 text-sm">
            Environmental impact of your spending
          </p>
        </div>
        
        {/* Eco Metrics with Glass Progress Bars */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-white/80 text-sm">Carbon Footprint</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 glass-progress h-2">
                <div 
                  className="glass-progress-fill red h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${metrics.carbonFootprint}%` }}
                />
              </div>
              <span className="text-white/60 text-xs">Low</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-white/80 text-sm">Sustainable Spending</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 glass-progress h-2">
                <div 
                  className="glass-progress-fill green h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${metrics.sustainableSpending}%` }}
                />
              </div>
              <span className="text-white/60 text-xs">{metrics.sustainableSpending}%</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-white/80 text-sm">Green Transport</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 glass-progress h-2">
                <div 
                  className="glass-progress-fill blue h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${metrics.greenTransport}%` }}
                />
              </div>
              <span className="text-white/60 text-xs">{metrics.greenTransport}%</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-white/80 text-sm">Renewable Energy</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 glass-progress h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${metrics.renewableEnergy}%` }}
                />
              </div>
              <span className="text-white/60 text-xs">{metrics.renewableEnergy}%</span>
            </div>
          </div>
        </div>
        
        {/* Monthly Impact with Enhanced Glass Effect */}
        <GlassCard className="glass-green p-3">
          <div className="flex items-center gap-2 mb-2">
            <Recycle className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium text-green-300">Monthly Impact</span>
          </div>
          <div className="text-sm text-green-200 space-y-1">
            <div>CO₂ Saved: {monthlyImpact.co2Saved}kg</div>
            <div>≈ {monthlyImpact.treesEquivalent} trees planted</div>
          </div>
        </GlassCard>
      </div>
    </GlassCard>
  );
};

export default EcoScore;
