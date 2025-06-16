import React, { useState, useEffect } from 'react';
import { Plus, Target, TrendingUp, Award } from 'lucide-react';
import GoalCard from './GoalCard';
import GoalCreator from './GoalCreator';
import SavingsInsights from './SavingsInsights';
import { savingsGoalsService } from '@/services/savingsGoalsService';
import { SavingsGoal, SavingsInsight } from '@/types/savingsGoals';

const SavingsGoals = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [insights, setInsights] = useState<SavingsInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGoalCreator, setShowGoalCreator] = useState(false);
  const [activeTab, setActiveTab] = useState<'goals' | 'insights'>('goals');

  useEffect(() => {
    loadSavingsData();
  }, []);

  const loadSavingsData = async () => {
    try {
      const [goalsData, insightsData] = await Promise.all([
        savingsGoalsService.getGoals(),
        savingsGoalsService.getSavingsInsights()
      ]);
      setGoals(goalsData);
      setInsights(insightsData);
    } catch (error) {
      console.error('Failed to load savings data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoalCreated = (newGoal: SavingsGoal) => {
    setGoals([...goals, newGoal]);
    setShowGoalCreator(false);
    loadSavingsData(); // Refresh insights
  };

  const handleGoalUpdate = () => {
    loadSavingsData();
  };

  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTargets = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const completedGoals = goals.filter(goal => goal.isCompleted).length;
  const overallProgress = totalTargets > 0 ? (totalSaved / totalTargets) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen w-full text-white">
        <div className="fixed inset-0 z-0 optimized-bg" />
        <div className="relative z-10 min-h-screen w-full">
          <div className="w-full px-4 py-8 sm:px-6 lg:px-8 xl:px-12">
            <div className="w-full space-y-6 animate-pulse">
              <div className="h-8 bg-slate-700/50 rounded w-48"></div>
              <div className="h-32 liquid-glass-card"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="h-48 liquid-glass-card"></div>
                <div className="h-48 liquid-glass-card"></div>
                <div className="h-48 liquid-glass-card"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full text-white">
      {/* Optimized Background */}
      <div className="fixed inset-0 z-0 optimized-bg" />
      
      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen w-full pb-24">
        <div className="w-full px-4 py-8 sm:px-6 lg:px-8 xl:px-12 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center space-x-3 tracking-wide">
                <Target className="w-8 h-8 text-green-400" />
                <span>Savings Goals</span>
              </h1>
              <p className="text-white/60 mt-2">Track your progress and build wealth systematically</p>
            </div>
            
            <button
              onClick={() => setShowGoalCreator(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Goal</span>
            </button>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="liquid-glass-card p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-white font-bold text-xl">
                    ${totalSaved.toLocaleString()}
                  </div>
                  <div className="text-white/60 text-sm">Total Saved</div>
                </div>
              </div>
            </div>

            <div className="liquid-glass-card p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-white font-bold text-xl">
                    ${totalTargets.toLocaleString()}
                  </div>
                  <div className="text-white/60 text-sm">Total Targets</div>
                </div>
              </div>
            </div>

            <div className="liquid-glass-card p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-white font-bold text-xl">
                    {completedGoals}
                  </div>
                  <div className="text-white/60 text-sm">Completed</div>
                </div>
              </div>
            </div>

            <div className="liquid-glass-card p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-orange-400 font-bold">%</span>
                </div>
                <div>
                  <div className="text-white font-bold text-xl">
                    {overallProgress.toFixed(0)}%
                  </div>
                  <div className="text-white/60 text-sm">Overall Progress</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-white/10 p-1 rounded-lg">
            {[
              { id: 'goals', label: 'My Goals', icon: Target },
              { id: 'insights', label: 'Insights', icon: TrendingUp }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all flex items-center justify-center space-x-2 ${
                    activeTab === tab.id
                      ? 'bg-indigo-500 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          {activeTab === 'goals' && (
            <div>
              {goals.length === 0 ? (
                <div className="liquid-glass-card p-12 text-center">
                  <Target className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Savings Goals Yet</h3>
                  <p className="text-white/60 mb-6 max-w-md mx-auto">
                    Start your financial journey by creating your first savings goal. Whether it's an emergency fund, vacation, or major purchase, we'll help you get there.
                  </p>
                  <button
                    onClick={() => setShowGoalCreator(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all flex items-center space-x-2 mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create Your First Goal</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {goals.map((goal) => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      onGoalUpdate={handleGoalUpdate}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'insights' && (
            <SavingsInsights insights={insights} />
          )}
        </div>
      </div>

      {/* Goal Creator Modal */}
      {showGoalCreator && (
        <GoalCreator
          onGoalCreated={handleGoalCreated}
          onClose={() => setShowGoalCreator(false)}
        />
      )}
    </div>
  );
};

export default SavingsGoals;