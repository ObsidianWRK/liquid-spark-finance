import React from 'react';
import { Heart, Activity, Brain, Apple, Bed, Shield } from 'lucide-react';
import ScoreCircle from '../transactions/ScoreCircle';
import MetricCard from './MetricCard';

interface WellnessData {
  overallScore: number;
  monthlySpending: {
    fitness: number;
    nutrition: number;
    healthcare: number;
    wellness: number;
    supplements: number;
    mentalHealth: number;
  };
  healthTrends: {
    exercise: 'up' | 'down' | 'stable';
    nutrition: 'up' | 'down' | 'stable';
    sleep: 'up' | 'down' | 'stable';
    stress: 'up' | 'down' | 'stable';
  };
}

interface WellnessCardProps {
  data: WellnessData;
}

const WellnessCard: React.FC<WellnessCardProps> = ({ data }) => {
  const getScoreRating = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  const healthCategories = [
    { icon: Activity, label: 'Fitness', amount: data.monthlySpending.fitness, color: '#10b981' },
    { icon: Apple, label: 'Nutrition', amount: data.monthlySpending.nutrition, color: '#f59e0b' },
    { icon: Shield, label: 'Healthcare', amount: data.monthlySpending.healthcare, color: '#3b82f6' },
    { icon: Heart, label: 'Wellness', amount: data.monthlySpending.wellness, color: '#ef4444' },
    { icon: Brain, label: 'Supplements', amount: data.monthlySpending.supplements, color: '#8b5cf6' },
    { icon: Bed, label: 'Mental Health', amount: data.monthlySpending.mentalHealth, color: '#06b6d4' },
  ];

  const trends = [
    { label: 'Exercise', trend: data.healthTrends.exercise },
    { label: 'Nutrition', trend: data.healthTrends.nutrition },
    { label: 'Sleep', trend: data.healthTrends.sleep },
    { label: 'Stress', trend: data.healthTrends.stress },
  ];

  const totalSpending = Object.values(data.monthlySpending).reduce((sum, amount) => sum + amount, 0);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="liquid-glass-fallback rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Health & Wellness</h3>
            <p className="text-white/70 text-sm sm:text-base">
              Monthly wellness spending: ${totalSpending.toLocaleString()}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <ScoreCircle 
              score={data.overallScore} 
              size="large"
              label={getScoreRating(data.overallScore)}
            />
          </div>
        </div>
      </div>

      {/* Health Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {healthCategories.map((category, index) => (
          <MetricCard
            key={category.label}
            title={category.label}
            value={category.amount}
            icon={category.icon}
            color={category.color}
            prefix="$"
          />
        ))}
      </div>

      {/* Health Trends */}
      <div className="liquid-glass-fallback rounded-2xl p-4 sm:p-6">
        <h4 className="text-lg sm:text-xl font-bold text-white mb-4">Health Trends</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {trends.map((trend, index) => (
            <div key={trend.label} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <span className="text-white/80 text-xs sm:text-sm font-medium">{trend.label}</span>
              <span 
                className="text-sm sm:text-base font-bold"
                style={{ 
                  color: trend.trend === 'up' ? '#10b981' : 
                         trend.trend === 'down' ? '#ef4444' : '#6b7280'
                }}
              >
                {trend.trend === 'up' ? '↗' : trend.trend === 'down' ? '↘' : '—'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WellnessCard; 