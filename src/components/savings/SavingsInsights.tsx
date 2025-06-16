import React from 'react';
import { TrendingUp, Target, Award, AlertCircle, Lightbulb, Plus } from 'lucide-react';
import { SavingsInsight, SavingsGoal } from '@/types/savingsGoals';

interface SavingsInsightsProps {
  insights: SavingsInsight[];
  goals: SavingsGoal[];
  onCreateGoal: () => void;
}

const SavingsInsights = ({ insights, goals, onCreateGoal }: SavingsInsightsProps) => {
  const getInsightIcon = (type: SavingsInsight['type']) => {
    switch (type) {
      case 'milestone': return <Award className="w-5 h-5 text-yellow-400" />;
      case 'progress': return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'suggestion': return <Lightbulb className="w-5 h-5 text-blue-400" />;
      default: return <AlertCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getInsightColor = (type: SavingsInsight['type']) => {
    switch (type) {
      case 'milestone': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'progress': return 'border-green-500/30 bg-green-500/10';
      case 'suggestion': return 'border-blue-500/30 bg-blue-500/10';
      default: return 'border-slate-500/30 bg-slate-500/10';
    }
  };

  // Calculate summary stats
  const totalGoals = goals.length;
  const completedGoals = goals.filter(goal => goal.isCompleted).length;
  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTargets = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const averageProgress = totalGoals > 0 ? goals.reduce((sum, goal) => sum + (goal.currentAmount / goal.targetAmount), 0) / totalGoals * 100 : 0;

  // Find goals that are close to completion
  const nearCompletionGoals = goals.filter(goal => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    return progress >= 80 && progress < 100;
  });

  // Find goals that need attention (behind schedule)
  const needAttentionGoals = goals.filter(goal => {
    if (goal.isCompleted) return false;
    const daysLeft = Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const timeProgress = daysLeft <= 0 ? 100 : Math.max(0, 100 - (daysLeft / 365) * 100); // Rough time progress
    return progress < timeProgress - 20; // Behind by more than 20%
  });

  return (
    <div className="space-y-8">
      {/* Insights Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="liquid-glass-card p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-white font-bold text-xl">{averageProgress.toFixed(0)}%</div>
              <div className="text-slate-400 text-sm">Average Progress</div>
            </div>
          </div>
        </div>

        <div className="liquid-glass-card p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-white font-bold text-xl">{nearCompletionGoals.length}</div>
              <div className="text-slate-400 text-sm">Nearly Complete</div>
            </div>
          </div>
        </div>

        <div className="liquid-glass-card p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <div className="text-white font-bold text-xl">{needAttentionGoals.length}</div>
              <div className="text-slate-400 text-sm">Need Attention</div>
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
          <div className="liquid-glass-card p-8 text-center">
            <TrendingUp className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">No Insights Available</h4>
            <p className="text-slate-400 mb-6">
              Create some savings goals to get personalized insights and recommendations.
            </p>
            <button
              onClick={onCreateGoal}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Goal</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`liquid-glass-card p-6 border ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-2">{insight.title}</h4>
                    <p className="text-slate-400 text-sm mb-4">{insight.description}</p>
                    
                    {insight.actionable && insight.action && (
                      <button
                        onClick={onCreateGoal}
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-indigo-600 hover:to-purple-600 transition-all"
                      >
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

      {/* Goals Needing Attention */}
      {needAttentionGoals.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-orange-400" />
            <span>Goals Needing Attention</span>
          </h3>
          
          <div className="space-y-4">
            {needAttentionGoals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const daysLeft = Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={goal.id} className="liquid-glass-card p-6 border border-orange-500/30 bg-orange-500/10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{goal.icon}</div>
                      <div>
                        <h4 className="text-white font-semibold">{goal.name}</h4>
                        <p className="text-slate-400 text-sm">
                          {progress.toFixed(0)}% complete • {daysLeft > 0 ? `${daysLeft} days left` : `${Math.abs(daysLeft)} days overdue`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">
                        ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                      </div>
                      <div className="text-orange-400 text-sm font-medium">
                        Behind Schedule
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Nearly Complete Goals */}
      {nearCompletionGoals.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
            <Award className="w-6 h-6 text-green-400" />
            <span>Almost There!</span>
          </h3>
          
          <div className="space-y-4">
            {nearCompletionGoals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const remaining = goal.targetAmount - goal.currentAmount;
              
              return (
                <div key={goal.id} className="liquid-glass-card p-6 border border-green-500/30 bg-green-500/10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{goal.icon}</div>
                      <div>
                        <h4 className="text-white font-semibold">{goal.name}</h4>
                        <p className="text-slate-400 text-sm">
                          {progress.toFixed(0)}% complete • Only ${remaining.toLocaleString()} to go!
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">
                        ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                      </div>
                      <div className="text-green-400 text-sm font-medium">
                        Almost Complete!
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsInsights; 