import React, { useState, useEffect } from 'react';
import {
  Target,
  TrendingUp,
  Calendar,
  DollarSign,
  PiggyBank,
  Shield,
  Briefcase,
  Home,
  GraduationCap,
  Heart,
  Car,
  Plane,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  Zap,
  Brain,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { financialPlanningService } from '@/features/financialPlanningService';
import { FinancialGoal, GoalCategory, PlanningRecommendation } from '@/types/financialPlanning';
import { cn } from '@/lib/utils';

interface FinancialPlanningPageProps {
  familyId?: string;
}

const FinancialPlanningPage = ({ familyId = 'demo_family' }: FinancialPlanningPageProps) => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [healthScore, setHealthScore] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<PlanningRecommendation[]>([]);
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'goals' | 'retirement' | 'debt' | 'planning'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlanningData();
  }, [familyId]);

  const loadPlanningData = async () => {
    setLoading(true);
    try {
      // Load financial health score and recommendations
      const healthData = await financialPlanningService.getFinancialHealthScore(familyId);
      setHealthScore(healthData);
      setRecommendations(healthData.recommendations);

      // Create sample goals for demo
      const sampleGoals = await createSampleGoals();
      setGoals(sampleGoals);
    } catch (error) {
      console.error('Failed to load planning data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSampleGoals = async (): Promise<FinancialGoal[]> => {
    const sampleGoals: FinancialGoal[] = [
      {
        id: 'goal_emergency',
        familyId,
        title: 'Emergency Fund',
        description: '6 months of expenses for financial security',
        category: 'emergency_fund',
        targetAmount: 30000,
        targetDate: new Date(Date.now() + 18 * 30 * 24 * 60 * 60 * 1000),
        priority: 1,
        monthlyContribution: 1500,
        autoContribute: true,
        status: 'active',
        progress: {
          currentAmount: 18000,
          percentComplete: 60,
          monthlyContribution: 1500,
          projectedCompletionDate: new Date(Date.now() + 8 * 30 * 24 * 60 * 60 * 1000),
          onTrack: true
        },
        tags: ['safety', 'priority'],
        createdAt: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        id: 'goal_house',
        familyId,
        title: 'House Down Payment',
        description: '20% down payment for dream home',
        category: 'house_down_payment',
        targetAmount: 80000,
        targetDate: new Date(Date.now() + 36 * 30 * 24 * 60 * 60 * 1000),
        priority: 2,
        monthlyContribution: 2000,
        autoContribute: true,
        status: 'active',
        progress: {
          currentAmount: 32000,
          percentComplete: 40,
          monthlyContribution: 2000,
          projectedCompletionDate: new Date(Date.now() + 24 * 30 * 24 * 60 * 60 * 1000),
          onTrack: true
        },
        tags: ['home', 'long-term'],
        createdAt: new Date(Date.now() - 16 * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        id: 'goal_vacation',
        familyId,
        title: 'European Vacation',
        description: 'Two-week family trip to Europe',
        category: 'vacation',
        targetAmount: 12000,
        targetDate: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000),
        priority: 3,
        monthlyContribution: 800,
        autoContribute: true,
        status: 'active',
        progress: {
          currentAmount: 6400,
          percentComplete: 53,
          monthlyContribution: 800,
          projectedCompletionDate: new Date(Date.now() + 7 * 30 * 24 * 60 * 60 * 1000),
          onTrack: true
        },
        tags: ['travel', 'family'],
        createdAt: new Date(Date.now() - 8 * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      }
    ];

    return sampleGoals;
  };

  const getGoalIcon = (category: GoalCategory) => {
    const icons = {
      emergency_fund: Shield,
      retirement: Briefcase,
      house_down_payment: Home,
      vacation: Plane,
      education: GraduationCap,
      debt_payoff: DollarSign,
      car_purchase: Car,
      investment: TrendingUp,
      wedding: Heart,
      business: Briefcase,
      other: Target
    };
    return icons[category] || Target;
  };

  const getGoalColor = (category: GoalCategory) => {
    const colors = {
      emergency_fund: 'from-red-500 to-red-600',
      retirement: 'from-blue-500 to-blue-600',
      house_down_payment: 'from-green-500 to-green-600',
      vacation: 'from-purple-500 to-purple-600',
      education: 'from-yellow-500 to-yellow-600',
      debt_payoff: 'from-gray-500 to-gray-600',
      car_purchase: 'from-indigo-500 to-indigo-600',
      investment: 'from-emerald-500 to-emerald-600',
      wedding: 'from-pink-500 to-pink-600',
      business: 'from-orange-500 to-orange-600',
      other: 'from-cyan-500 to-cyan-600'
    };
    return colors[category] || colors.other;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (goal: FinancialGoal) => {
    if (goal.progress.percentComplete >= 100) return 'text-green-400';
    if (goal.progress.onTrack) return 'text-blue-400';
    return 'text-orange-400';
  };

  const getStatusIcon = (goal: FinancialGoal) => {
    if (goal.progress.percentComplete >= 100) return CheckCircle;
    if (goal.progress.onTrack) return Clock;
    return AlertTriangle;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-white/[0.05] rounded w-48"></div>
              <div className="h-6 bg-white/[0.05] rounded w-24"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-white/[0.05] rounded w-full"></div>
              <div className="h-4 bg-white/[0.05] rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/[0.05] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Dashboard</span>
      </button>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Target className="w-8 h-8 text-blue-400" />
            Financial Planning
          </h1>
          <p className="text-white/60 mt-2">
            Set goals, track progress, and plan for your financial future
          </p>
        </div>

        <button
          onClick={() => setShowNewGoalModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Goal
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 bg-white/[0.02] rounded-xl p-1 border border-white/[0.08]">
        {[
          { id: 'overview', label: 'Overview', icon: Target },
          { id: 'goals', label: 'Goals', icon: PiggyBank },
          { id: 'retirement', label: 'Retirement', icon: Briefcase },
          { id: 'debt', label: 'Debt Payoff', icon: DollarSign },
          { id: 'planning', label: 'Life Planning', icon: Calendar }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm",
              activeTab === id
                ? "bg-blue-500 text-white"
                : "text-white/60 hover:text-white hover:bg-white/[0.05]"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <>
          {/* Financial Health Score */}
          {healthScore && (
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                    <Brain className="w-6 h-6 text-blue-400" />
                    Financial Health Score
                  </h2>
                  <p className="text-white/70">
                    Your overall financial wellness assessment
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-white mb-1">
                    {Math.round(healthScore.overallScore)}/100
                  </div>
                  <div className="text-blue-400 text-sm font-medium">
                    {healthScore.overallScore >= 80 ? 'Excellent' : 
                     healthScore.overallScore >= 60 ? 'Good' : 'Needs Work'}
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="grid grid-cols-5 gap-4 mt-6">
                {Object.entries(healthScore.categoryScores).map(([category, score]) => (
                  <div key={category} className="text-center">
                    <div className="text-2xl font-bold text-white">{score as number}</div>
                    <div className="text-xs text-white/60 capitalize">
                      {category.replace('_', ' ')}
                    </div>
                    <div className="w-full bg-white/[0.05] rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Active Goals</p>
                  <p className="text-2xl font-bold text-white">{goals.length}</p>
                </div>
                <Target className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Total Saved</p>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(goals.reduce((sum, goal) => sum + goal.progress.currentAmount, 0))}
                  </p>
                </div>
                <PiggyBank className="w-8 h-8 text-green-400" />
              </div>
            </div>

            <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Target Amount</p>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(goals.reduce((sum, goal) => sum + goal.targetAmount, 0))}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </div>

            <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Monthly Contributions</p>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(goals.reduce((sum, goal) => sum + (goal.monthlyContribution || 0), 0))}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-orange-400" />
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          {recommendations.length > 0 && (
            <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Zap className="w-6 h-6 text-yellow-400" />
                AI-Powered Recommendations
              </h2>
              
              <div className="space-y-4">
                {recommendations.slice(0, 3).map((rec, index) => (
                  <div key={index} className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-2">{rec.title}</h3>
                        <p className="text-white/70 text-sm mb-3">{rec.description}</p>
                        
                        <div className="flex items-center gap-4">
                          <span className={cn(
                            "text-xs px-2 py-1 rounded-lg font-medium",
                            rec.impact === 'high' ? "bg-red-500/20 text-red-400" :
                            rec.impact === 'medium' ? "bg-yellow-500/20 text-yellow-400" :
                            "bg-green-500/20 text-green-400"
                          )}>
                            {rec.impact} impact
                          </span>
                          <span className="text-xs text-white/60">
                            Priority {rec.priority}
                          </span>
                          {rec.estimatedBenefit > 0 && (
                            <span className="text-xs text-green-400">
                              Save {formatCurrency(rec.estimatedBenefit)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <button className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors">
                        <ArrowRight className="w-4 h-4 text-white/60" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'goals' && (
        <div className="space-y-6">
          {/* Goals List */}
          {goals.map((goal) => {
            const IconComponent = getGoalIcon(goal.category);
            const StatusIcon = getStatusIcon(goal);
            
            return (
              <div key={goal.id} className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6 hover:bg-white/[0.03] transition-all">
                <div className="flex items-start gap-4">
                  {/* Goal Icon */}
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br",
                    getGoalColor(goal.category)
                  )}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Goal Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-white">{goal.title}</h3>
                        <p className="text-white/60 text-sm">{goal.description}</p>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-sm">
                          <StatusIcon className={cn("w-4 h-4", getStatusColor(goal))} />
                          <span className={getStatusColor(goal)}>
                            {goal.progress.percentComplete >= 100 ? 'Completed' :
                             goal.progress.onTrack ? 'On Track' : 'Behind'}
                          </span>
                        </div>
                        <p className="text-white/40 text-xs mt-1">
                          Due {formatDate(goal.targetDate)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-white/80">
                          {formatCurrency(goal.progress.currentAmount)} of {formatCurrency(goal.targetAmount)}
                        </span>
                        <span className="text-white/60">
                          {Math.round(goal.progress.percentComplete)}%
                        </span>
                      </div>
                      <div className="w-full bg-white/[0.05] rounded-full h-2">
                        <div 
                          className={cn(
                            "h-2 rounded-full transition-all duration-500 bg-gradient-to-r",
                            getGoalColor(goal.category)
                          )}
                          style={{ width: `${Math.min(goal.progress.percentComplete, 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Goal Stats */}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-white/60">Monthly Contribution</p>
                        <p className="font-semibold text-white">
                          {formatCurrency(goal.monthlyContribution || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/60">Projected Completion</p>
                        <p className="font-semibold text-white">
                          {formatDate(goal.progress.projectedCompletionDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/60">Priority</p>
                        <p className="font-semibold text-white">
                          {goal.priority === 1 ? 'High' : goal.priority === 2 ? 'Medium' : 'Low'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Other tabs would have similar detailed content */}
      {activeTab === 'retirement' && (
        <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
          <h2 className="text-xl font-bold text-white mb-4">Retirement Planning</h2>
          <p className="text-white/60">Comprehensive retirement planning tools coming soon...</p>
        </div>
      )}

      {activeTab === 'debt' && (
        <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
          <h2 className="text-xl font-bold text-white mb-4">Debt Payoff Strategy</h2>
          <p className="text-white/60">Intelligent debt payoff planning tools coming soon...</p>
        </div>
      )}

      {activeTab === 'planning' && (
        <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
          <h2 className="text-xl font-bold text-white mb-4">Life Event Planning</h2>
          <p className="text-white/60">Plan for major life events and milestones...</p>
        </div>
      )}
    </div>
  );
};

export default FinancialPlanningPage;