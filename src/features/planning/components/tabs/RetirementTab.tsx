import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  TrendingUp,
  Target,
  Calculator,
  PieChart,
  Zap,
  AlertCircle,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { RetirementPlan } from '@/shared/types/financialPlanning';
import { MockFinancialPlanningAPI } from '@/mocks/financialPlanningMocks';
import PlanningCard from '../shared/PlanningCard';
import ProjectionChart from '../shared/ProjectionChart';
import { cn } from '@/shared/lib/utils';

interface RetirementTabProps {
  familyId: string;
}

const RetirementTab: React.FC<RetirementTabProps> = ({ familyId }) => {
  const [plan, setPlan] = useState<RetirementPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRetirementPlan();
  }, [familyId]);

  const loadRetirementPlan = async () => {
    setLoading(true);
    try {
      const retirementPlan =
        await MockFinancialPlanningAPI.getRetirementPlan(familyId);
      setPlan(retirementPlan);
    } catch (error) {
      console.error('Failed to load retirement plan:', error);
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

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const generateProjectionData = () => {
    if (!plan) return [];

    const data: Array<{
      date: Date;
      value: number;
      label: string;
    }> = [];
    const yearsToRetirement = plan.yearsToRetirement;
    const monthlyContribution = plan.monthlyContribution;
    const expectedReturn = plan.projections.expectedReturn;
    let currentValue = plan.currentSavings;

    for (let year = 0; year <= yearsToRetirement; year++) {
      if (year > 0) {
        currentValue =
          currentValue * (1 + expectedReturn) + monthlyContribution * 12;
      }

      data.push({
        date: new Date(Date.now() + year * 365 * 24 * 60 * 60 * 1000),
        value: Math.round(currentValue),
        label: `Year ${year}`,
      });
    }

    return data;
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

  if (!plan) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">
          No Retirement Plan Found
        </h3>
        <p className="text-white/60">
          Create a retirement plan to get started.
        </p>
      </div>
    );
  }

  const isOnTrack = plan.projections.shortfall <= 0;
  const projectionData = generateProjectionData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Briefcase className="w-7 h-7 text-blue-400" />
            Retirement Planning
          </h2>
          <p className="text-white/60 mt-1">
            {plan.yearsToRetirement} years to retirement
          </p>
        </div>
      </div>

      {/* Current Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <PlanningCard
          title="Current Savings"
          icon={TrendingUp}
          iconColor="text-green-400"
        >
          <div className="text-2xl font-bold text-white">
            {formatCurrency(plan.currentSavings)}
          </div>
        </PlanningCard>

        <PlanningCard
          title="Monthly Contribution"
          icon={Calculator}
          iconColor="text-blue-400"
        >
          <div className="text-2xl font-bold text-white">
            {formatCurrency(plan.monthlyContribution)}
          </div>
        </PlanningCard>

        <PlanningCard
          title="Projected Value"
          icon={Target}
          iconColor="text-purple-400"
        >
          <div className="text-2xl font-bold text-white">
            {formatCurrency(plan.projections.totalRetirementValue)}
          </div>
        </PlanningCard>

        <PlanningCard
          title="Monthly Income"
          icon={PieChart}
          iconColor="text-orange-400"
        >
          <div className="text-2xl font-bold text-white">
            {formatCurrency(plan.projections.monthlyIncomeAtRetirement)}
          </div>
        </PlanningCard>
      </div>

      {/* Status Alert */}
      <PlanningCard
        variant={isOnTrack ? 'gradient' : 'highlight'}
        icon={isOnTrack ? CheckCircle : AlertCircle}
        iconColor={isOnTrack ? 'text-green-400' : 'text-orange-400'}
        title={
          isOnTrack
            ? 'On Track for Retirement'
            : 'Retirement Shortfall Detected'
        }
        description={
          isOnTrack
            ? 'Your current savings rate should meet your retirement goals.'
            : `Projected shortfall of ${formatCurrency(plan.projections.shortfall)}.`
        }
      />

      {/* Projection Chart */}
      <ProjectionChart
        data={projectionData}
        title="Retirement Savings Projection"
        type="area"
        height={350}
        color="#3b82f6"
      />

      {/* Recommendations */}
      <PlanningCard
        title="AI Recommendations"
        icon={Zap}
        iconColor="text-yellow-400"
      >
        <div className="space-y-4">
          {plan.recommendations.map((rec, index) => (
            <div
              key={index}
              className="p-4 bg-white/[0.03] rounded-vueni-lg border border-white/[0.05]"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-2">{rec.title}</h4>
                  <p className="text-white/70 text-sm mb-3">
                    {rec.description}
                  </p>

                  <div className="flex items-center gap-4">
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
                      Benefit: {formatCurrency(rec.estimatedBenefit)}
                    </span>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-white/60" />
              </div>
            </div>
          ))}
        </div>
      </PlanningCard>
    </div>
  );
};

export default RetirementTab;
