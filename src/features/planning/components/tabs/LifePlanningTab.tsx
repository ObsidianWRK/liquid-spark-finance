import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Baby,
  Home,
  GraduationCap,
  Heart,
  Car,
  Briefcase,
  Plus,
  Target,
  Zap,
  AlertCircle,
} from 'lucide-react';
import { LifeEventPlanning } from '@/shared/types/financialPlanning';
import { MockFinancialPlanningAPI } from '@/mocks/financialPlanningMocks';
import PlanningCard from '../shared/PlanningCard';
import { cn } from '@/shared/lib/utils';

interface LifePlanningTabProps {
  familyId: string;
}

const LifePlanningTab: React.FC<LifePlanningTabProps> = ({ familyId }) => {
  const [plans, setPlans] = useState<LifeEventPlanning[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLifeEventPlans();
  }, [familyId]);

  const loadLifeEventPlans = async () => {
    setLoading(true);
    try {
      const lifeEventPlans =
        await MockFinancialPlanningAPI.getLifeEventPlans(familyId);
      setPlans(lifeEventPlans);
    } catch (error) {
      console.error('Failed to load life event plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getEventIcon = (eventType: string) => {
    const icons = {
      baby: Baby,
      marriage: Heart,
      house_purchase: Home,
      education: GraduationCap,
      car_purchase: Car,
      job_change: Briefcase,
      retirement: Calendar,
    };
    return icons[eventType as keyof typeof icons] || Calendar;
  };

  const getEventColor = (eventType: string) => {
    const colors = {
      baby: 'text-pink-400',
      marriage: 'text-red-400',
      house_purchase: 'text-green-400',
      education: 'text-blue-400',
      car_purchase: 'text-indigo-400',
      job_change: 'text-orange-400',
      retirement: 'text-purple-400',
    };
    return colors[eventType as keyof typeof colors] || 'text-blue-400';
  };

  const getEventLabel = (eventType: string) => {
    const labels = {
      baby: 'Baby/Child',
      marriage: 'Wedding',
      house_purchase: 'Home Purchase',
      education: 'Education',
      car_purchase: 'Vehicle',
      job_change: 'Career Change',
      retirement: 'Retirement',
    };
    return labels[eventType as keyof typeof labels] || eventType;
  };

  const calculateProgress = (plan: LifeEventPlanning) => {
    return Math.min((plan.currentSavings / plan.estimatedCost) * 100, 100);
  };

  const calculateMonthsRemaining = (targetDate: Date) => {
    const now = new Date();
    const diffTime = targetDate.getTime() - now.getTime();
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return Math.max(diffMonths, 0);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white/[0.02] rounded-vueni-lg border border-white/[0.08] p-6 animate-pulse"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-8 bg-white/[0.05] rounded"></div>
              <div className="h-6 bg-white/[0.05] rounded w-48"></div>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Calendar className="w-7 h-7 text-purple-400" />
            Life Event Planning
          </h2>
          <p className="text-white/60 mt-1">
            Plan and save for major life milestones
          </p>
        </div>
        <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-vueni-lg transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PlanningCard
          title="Active Plans"
          icon={Target}
          iconColor="text-blue-400"
        >
          <div className="text-2xl font-bold text-white">{plans.length}</div>
          <div className="text-white/60 text-sm mt-1">Life events tracked</div>
        </PlanningCard>

        <PlanningCard
          title="Total Estimated Cost"
          icon={Calendar}
          iconColor="text-orange-400"
        >
          <div className="text-2xl font-bold text-white">
            {formatCurrency(
              plans.reduce((sum, plan) => sum + plan.estimatedCost, 0)
            )}
          </div>
          <div className="text-white/60 text-sm mt-1">Across all events</div>
        </PlanningCard>

        <PlanningCard
          title="Total Saved"
          icon={Target}
          iconColor="text-green-400"
        >
          <div className="text-2xl font-bold text-white">
            {formatCurrency(
              plans.reduce((sum, plan) => sum + plan.currentSavings, 0)
            )}
          </div>
          <div className="text-white/60 text-sm mt-1">
            {Math.round(
              plans.reduce((sum, plan) => sum + calculateProgress(plan), 0) /
                plans.length || 0
            )}
            % complete
          </div>
        </PlanningCard>
      </div>

      {/* Life Event Plans */}
      <div className="space-y-4">
        {plans.map((plan, index) => {
          const EventIcon = getEventIcon(plan.eventType);
          const iconColor = getEventColor(plan.eventType);
          const progress = calculateProgress(plan);
          const monthsRemaining = calculateMonthsRemaining(plan.plannedDate);
          const monthlyNeeded =
            monthsRemaining > 0
              ? (plan.estimatedCost - plan.currentSavings) / monthsRemaining
              : 0;

          return (
            <PlanningCard
              key={index}
              title={getEventLabel(plan.eventType)}
              icon={EventIcon}
              iconColor={iconColor}
              variant="highlight"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Progress Section */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Financial Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/80 text-sm">
                        Financial Progress
                      </span>
                      <span className="text-white/60 text-sm">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="w-full bg-white/[0.05] rounded-vueni-pill h-3">
                      <div
                        className={cn(
                          'h-3 rounded-vueni-pill transition-all duration-500',
                          progress >= 100
                            ? 'bg-green-400'
                            : progress >= 50
                              ? 'bg-blue-400'
                              : 'bg-orange-400'
                        )}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-white/[0.03] rounded-vueni-lg">
                      <div className="text-lg font-bold text-white">
                        {formatCurrency(plan.estimatedCost)}
                      </div>
                      <div className="text-white/60 text-xs">Target Cost</div>
                    </div>

                    <div className="text-center p-3 bg-white/[0.03] rounded-vueni-lg">
                      <div className="text-lg font-bold text-white">
                        {formatCurrency(plan.currentSavings)}
                      </div>
                      <div className="text-white/60 text-xs">Saved</div>
                    </div>

                    <div className="text-center p-3 bg-white/[0.03] rounded-vueni-lg">
                      <div className="text-lg font-bold text-white">
                        {formatCurrency(plan.monthlyContribution)}
                      </div>
                      <div className="text-white/60 text-xs">Monthly</div>
                    </div>

                    <div className="text-center p-3 bg-white/[0.03] rounded-vueni-lg">
                      <div className="text-lg font-bold text-white">
                        {monthsRemaining}
                      </div>
                      <div className="text-white/60 text-xs">Months Left</div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="p-4 bg-white/[0.03] rounded-vueni-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-semibold">
                          Target Date
                        </div>
                        <div className="text-white/60 text-sm">
                          {plan.plannedDate.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">
                          {monthlyNeeded > plan.monthlyContribution
                            ? 'Behind Schedule'
                            : 'On Track'}
                        </div>
                        {monthlyNeeded > plan.monthlyContribution && (
                          <div className="text-orange-400 text-sm">
                            Need: {formatCurrency(monthlyNeeded)}/month
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations Section */}
                <div className="space-y-4">
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Recommendations
                  </h4>

                  {plan.recommendations.map((rec, recIndex) => (
                    <div
                      key={recIndex}
                      className="p-3 bg-white/[0.03] rounded-vueni-lg border border-white/[0.05]"
                    >
                      <h5 className="font-semibold text-white text-sm mb-1">
                        {rec.title}
                      </h5>
                      <p className="text-white/70 text-xs mb-2">
                        {rec.description}
                      </p>

                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={cn(
                            'text-xs px-2 py-1 rounded-vueni-lg font-medium',
                            rec.impact === 'high'
                              ? 'bg-red-500/20 text-red-400'
                              : rec.impact === 'medium'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-green-500/20 text-green-400'
                          )}
                        >
                          {rec.impact} impact
                        </span>
                        <span className="text-xs text-green-400">
                          +{formatCurrency(rec.estimatedBenefit)}
                        </span>
                      </div>

                      <div className="space-y-1">
                        {rec.actionItems.map((action, actionIndex) => (
                          <div
                            key={actionIndex}
                            className="flex items-center gap-2 text-xs text-white/70"
                          >
                            <div className="w-1 h-1 bg-white/40 rounded-vueni-pill" />
                            {action}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </PlanningCard>
          );
        })}
      </div>

      {/* No Plans State */}
      {plans.length === 0 && (
        <PlanningCard
          title="No Life Events Planned"
          icon={AlertCircle}
          iconColor="text-orange-400"
          variant="highlight"
        >
          <div className="text-center py-8">
            <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 mb-4">
              Start planning for major life events like buying a home, having a
              baby, or pursuing education.
            </p>
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-vueni-lg transition-colors flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" />
              Add Your First Life Event
            </button>
          </div>
        </PlanningCard>
      )}
    </div>
  );
};

export default LifePlanningTab;
