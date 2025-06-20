import React from 'react';
import { TrendingUp, Target, Award, AlertCircle, Lightbulb, Plus } from 'lucide-react';
import { SavingsInsight } from '@/types/savingsGoals';

interface SavingsInsightsProps {
  insights: SavingsInsight[];
}

const SavingsInsights = ({ insights }: SavingsInsightsProps) => {
  const getInsightIcon = (type: SavingsInsight['type']) => {
    switch (type) {
      case 'milestone': return <Award className="w-5 h-5 text-yellow-400" />;
      case 'progress': return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'suggestion': return <Lightbulb className="w-5 h-5 text-blue-400" />;
      default: return <AlertCircle className="w-5 h-5 text-white/60" />;
    }
  };

  const getInsightColor = (type: SavingsInsight['type']) => {
    switch (type) {
      case 'milestone': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'progress': return 'border-green-500/30 bg-green-500/10';
      case 'suggestion': return 'border-blue-500/30 bg-blue-500/10';
      default: return 'border-white/20 bg-white/5';
    }
  };

  return (
    <div className="space-y-8">
      {/* Insights Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="liquid-glass-card p-6 card-hover">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-white font-bold text-xl">3</div>
              <div className="text-white/60 text-sm">Active Goals</div>
            </div>
          </div>
        </div>

        <div className="liquid-glass-card p-6 card-hover">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-white font-bold text-xl">67%</div>
              <div className="text-white/60 text-sm">Avg Progress</div>
            </div>
          </div>
        </div>

        <div className="liquid-glass-card p-6 card-hover">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <div className="text-white font-bold text-xl">1</div>
              <div className="text-white/60 text-sm">On Track</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Insights */}
      <div>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
          <Lightbulb className="w-6 h-6 text-yellow-400" />
          <span>Personalized Insights</span>
        </h3>

        {insights.length === 0 ? (
          <div className="liquid-glass-card p-8 text-center card-hover">
            <TrendingUp className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">No Insights Available</h4>
            <p className="text-white/60 mb-6">
              Create some savings goals to get personalized insights and recommendations.
            </p>
            <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all flex items-center space-x-2 mx-auto">
              <Plus className="w-5 h-5" />
              <span>Create Your First Goal</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`liquid-glass-card p-6 border ${getInsightColor(insight.type)} card-hover`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-2">{insight.title}</h4>
                    <p className="text-white/70 text-sm mb-4">{insight.description}</p>
                    
                    {insight.actionable && insight.action && (
                      <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-indigo-600 hover:to-purple-600 transition-all">
                        {insight.action}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Featured Recommendations */}
      <div>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
          <Award className="w-6 h-6 text-green-400" />
          <span>Smart Recommendations</span>
        </h3>
        
        <div className="space-y-4">
          <div className="liquid-glass-card p-6 border border-green-500/30 bg-green-500/10 card-hover">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-2">Emergency Fund Progress</h4>
                <p className="text-white/70 text-sm mb-4">
                  You're 78% of the way to your emergency fund goal! Consider increasing your monthly contribution by $200 to reach your target 2 months earlier.
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <span className="text-green-400 text-sm font-medium">78%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="liquid-glass-card p-6 border border-blue-500/30 bg-blue-500/10 card-hover">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-2">Japan Vacation on Track</h4>
                <p className="text-white/70 text-sm mb-4">
                  Great job! Your Japan vacation fund is on schedule. At your current rate, you'll have enough saved by your target date.
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-blue-400 text-sm font-medium">45%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="liquid-glass-card p-6 border border-orange-500/30 bg-orange-500/10 card-hover">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-orange-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-2">New Car Goal Needs Boost</h4>
                <p className="text-white/70 text-sm mb-4">
                  Your new car fund is falling behind schedule. Consider increasing your monthly contribution or extending your target date by 6 months.
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-orange-400 h-2 rounded-full" style={{ width: '23%' }}></div>
                  </div>
                  <span className="text-orange-400 text-sm font-medium">23%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsInsights; 