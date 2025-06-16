import React from 'react';
import { Heart, Activity, Apple, Brain, UtensilsCrossed, Moon, Droplets } from 'lucide-react';
import EnhancedGlassCard from '../ui/EnhancedGlassCard';

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

const ComprehensiveWellnessCard: React.FC<{ data: WellnessData }> = ({ data }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981'; // green
    if (score >= 60) return '#F59E0B'; // amber
    return '#EF4444'; // red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '—';
    }
  };

  const categories = [
    { key: 'Ph..', icon: Activity, label: 'Physical' },
    { key: 'Vi..', icon: Heart, label: 'Vitals' },
    { key: 'B.o.', icon: Brain, label: 'Body' },
    { key: 'N.u.', icon: UtensilsCrossed, label: 'Nutrition' },
    { key: 'Sl..', icon: Moon, label: 'Sleep' },
    { key: 'Me..', icon: Brain, label: 'Mental' },
    { key: 'H.e.', icon: Heart, label: 'Heart' },
    { key: 'M.o.', icon: Activity, label: 'Motion' },
    { key: 'R.e.', icon: Droplets, label: 'Recovery' },
    { key: 'R.e.', icon: Activity, label: 'Routine' },
    { key: 'L.a.', icon: Heart, label: 'Labs' }
  ];

  return (
    <EnhancedGlassCard className="comprehensive-card responsive-padding-md responsive-spacing-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
          <h2 className="responsive-text-base font-semibold text-white">Comprehensive Wellness</h2>
        </div>
        <button className="text-white/60 hover:text-white">
          <span className="text-sm">⌄</span>
        </button>
      </div>

      {/* Overall Score Circle */}
      <div className="flex flex-col items-center space-y-2">
        <div className="relative score-circle">
          <svg className="score-circle transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-white/10"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={getScoreColor(data.overallScore)}
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - data.overallScore / 100)}`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="score-text text-white">{data.overallScore}</span>
            <span className="score-label text-orange-400">Wellness Score</span>
          </div>
        </div>
        <span className="text-white font-medium">{getScoreLabel(data.overallScore)}</span>
      </div>

      {/* Health Categories Grid */}
      <div className="category-grid">
        {categories.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <div key={index} className="category-item flex flex-col items-center space-y-1">
              <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 text-white/70" />
              <span className="responsive-text-xs text-white/60">{category.key}</span>
            </div>
          );
        })}
      </div>

      {/* Health Spending This Month */}
      <div className="responsive-spacing-sm">
        <h3 className="responsive-text-sm text-white font-medium">Health Spending This Month</h3>
        <div className="spending-grid">
          <div className="spending-item">
            <div className="text-white/60 responsive-text-xs">Fitness</div>
            <div className="text-white font-semibold responsive-text-sm">${data.monthlySpending.fitness}</div>
          </div>
          <div className="spending-item">
            <div className="text-white/60 responsive-text-xs">Nutrition</div>
            <div className="text-white font-semibold responsive-text-sm">${data.monthlySpending.nutrition}</div>
          </div>
          <div className="spending-item">
            <div className="text-white/60 responsive-text-xs">Healthcare</div>
            <div className="text-white font-semibold responsive-text-sm">${data.monthlySpending.healthcare}</div>
          </div>
          <div className="spending-item">
            <div className="text-white/60 responsive-text-xs">Wellness</div>
            <div className="text-white font-semibold responsive-text-sm">${data.monthlySpending.wellness}</div>
          </div>
          <div className="spending-item">
            <div className="text-white/60 responsive-text-xs">Supplements</div>
            <div className="text-white font-semibold responsive-text-sm">${data.monthlySpending.supplements}</div>
          </div>
          <div className="spending-item">
            <div className="text-white/60 responsive-text-xs">Mental Health</div>
            <div className="text-white font-semibold responsive-text-sm">${data.monthlySpending.mentalHealth}</div>
          </div>
        </div>
      </div>

      {/* Health Trends */}
      <div className="responsive-spacing-sm">
        <h3 className="responsive-text-sm text-white font-medium">Health Trends</h3>
        <div className="trends-grid">
          <div className="trend-item">
            <span className="text-white/70">Exercise</span>
            <span className="text-green-400">{getTrendIcon(data.healthTrends.exercise)}</span>
          </div>
          <div className="trend-item">
            <span className="text-white/70">Nutrition</span>
            <span className="text-white/70">{getTrendIcon(data.healthTrends.nutrition)}</span>
          </div>
          <div className="trend-item">
            <span className="text-white/70">Sleep</span>
            <span className="text-white/70">{getTrendIcon(data.healthTrends.sleep)}</span>
          </div>
          <div className="trend-item">
            <span className="text-white/70">Stress</span>
            <span className="text-red-400">{getTrendIcon(data.healthTrends.stress)}</span>
          </div>
        </div>
      </div>
    </EnhancedGlassCard>
  );
};

export default ComprehensiveWellnessCard; 