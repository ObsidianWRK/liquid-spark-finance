import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Target,
  TrendingDown,
  Calendar,
  Zap,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  CreditCard,
} from 'lucide-react';
import { DebtPayoffPlan } from '@/shared/types/financialPlanning';
import { MockFinancialPlanningAPI } from '@/mocks/financialPlanningMocks';
import PlanningCard from '../shared/PlanningCard';
import { cn } from '@/shared/lib/utils';

interface DebtPayoffTabProps {
  familyId: string;
}

const DebtPayoffTab: React.FC<DebtPayoffTabProps> = ({ familyId }) => {
  const [plan, setPlan] = useState<DebtPayoffPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDebtPlan();
  }, [familyId]);

  const loadDebtPlan = async () => {
    setLoading(true);
    try {
      const debtPlan =
        await MockFinancialPlanningAPI.getDebtPayoffPlan(familyId);
      setPlan(debtPlan);
    } catch (error) {
      console.error('Failed to load debt plan:', error);
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

  const getDebtColor = (interestRate: number) => {
    if (interestRate >= 0.2) return 'text-red-400';
    if (interestRate >= 0.1) return 'text-orange-400';
    return 'text-yellow-400';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6 animate-pulse"
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
          No Debt Plan Found
        </h3>
        <p className="text-white/60">
          Create a debt payoff strategy to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <DollarSign className="w-7 h-7 text-red-400" />
            Debt Payoff Strategy
          </h2>
          <p className="text-white/60 mt-1">
            {plan.strategy === 'avalanche'
              ? 'Avalanche Method'
              : 'Snowball Method'}{' '}
            •{plan.projections.monthsToPayoff} months to debt-free
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <PlanningCard
          title="Total Debt"
          icon={CreditCard}
          iconColor="text-red-400"
        >
          <div className="text-2xl font-bold text-white">
            {formatCurrency(plan.projections.totalDebt)}
          </div>
          <div className="text-white/60 text-sm mt-1">
            {plan.debts.length} accounts
          </div>
        </PlanningCard>

        <PlanningCard
          title="Extra Payment"
          icon={Target}
          iconColor="text-blue-400"
        >
          <div className="text-2xl font-bold text-white">
            {formatCurrency(plan.extraPayment)}
          </div>
          <div className="text-white/60 text-sm mt-1">Per month</div>
        </PlanningCard>

        <PlanningCard
          title="Total Interest"
          icon={TrendingDown}
          iconColor="text-orange-400"
        >
          <div className="text-2xl font-bold text-white">
            {formatCurrency(plan.projections.totalInterest)}
          </div>
          <div className="text-white/60 text-sm mt-1">
            Over {plan.projections.monthsToPayoff} months
          </div>
        </PlanningCard>

        <PlanningCard
          title="Freedom Date"
          icon={Calendar}
          iconColor="text-green-400"
        >
          <div className="text-lg font-bold text-white">
            {plan.projections.payoffDate.toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })}
          </div>
          <div className="text-white/60 text-sm mt-1">
            Debt-free in {plan.projections.monthsToPayoff} months
          </div>
        </PlanningCard>
      </div>

      {/* Strategy Information */}
      <PlanningCard
        variant="gradient"
        icon={Target}
        iconColor="text-blue-400"
        title={`${plan.strategy === 'avalanche' ? 'Avalanche' : 'Snowball'} Strategy Active`}
        description={
          plan.strategy === 'avalanche'
            ? 'Paying minimums on all debts, extra payments go to highest interest rate first.'
            : 'Paying minimums on all debts, extra payments go to smallest balance first.'
        }
      >
        <div className="mt-4 p-4 bg-white/[0.05] rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-white/80">Monthly Savings After Payoff</span>
            <span className="text-2xl font-bold text-green-400">
              {formatCurrency(plan.projections.monthlySavingsAfterPayoff)}
            </span>
          </div>
        </div>
      </PlanningCard>

      {/* Debt List */}
      <PlanningCard
        title="Debt Accounts"
        icon={CreditCard}
        iconColor="text-red-400"
      >
        <div className="space-y-4">
          {plan.payoffSchedule.map((debt, index) => (
            <div
              key={index}
              className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.05]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{debt.name}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-white/60 text-sm">
                      {formatPercentage(debt.interestRate)} APR
                    </span>
                    <span
                      className={cn(
                        'text-sm font-medium',
                        getDebtColor(debt.interestRate)
                      )}
                    >
                      {debt.interestRate >= 0.2
                        ? 'High Interest'
                        : debt.interestRate >= 0.1
                          ? 'Medium Interest'
                          : 'Low Interest'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-white">
                    {formatCurrency(debt.balance)}
                  </div>
                  <div className="text-white/60 text-sm">
                    {debt.monthsToPayoff} months
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-white/80">
                    Min: {formatCurrency(debt.minimumPayment)}
                  </span>
                  <span className="text-white/60">
                    Interest: {formatCurrency(debt.totalInterest)}
                  </span>
                </div>
                <div className="w-full bg-white/[0.05] rounded-full h-2">
                  <div
                    className={cn(
                      'h-2 rounded-full',
                      debt.interestRate >= 0.2
                        ? 'bg-red-400'
                        : debt.interestRate >= 0.1
                          ? 'bg-orange-400'
                          : 'bg-yellow-400'
                    )}
                    style={{
                      width: `${Math.min((debt.totalPaid / (debt.balance + debt.totalInterest)) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-white/80">
                  Total Paid: {formatCurrency(debt.totalPaid)}
                </span>
                <span className="text-green-400">
                  Save vs. minimum: {formatCurrency(debt.totalInterest * 0.3)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </PlanningCard>

      {/* Recommendations */}
      <PlanningCard
        title="Debt Payoff Recommendations"
        icon={Zap}
        iconColor="text-yellow-400"
      >
        <div className="space-y-4">
          {plan.recommendations.map((rec, index) => (
            <div
              key={index}
              className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.05]"
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
                        'text-xs px-2 py-1 rounded-lg font-medium',
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
                      Save: {formatCurrency(rec.estimatedBenefit)}
                    </span>
                  </div>

                  {/* Action Items */}
                  <div className="mt-3">
                    <div className="text-xs text-white/60 mb-2">
                      Recommended Actions:
                    </div>
                    <div className="space-y-1">
                      {rec.actionItems.map((action, actionIndex) => (
                        <div
                          key={actionIndex}
                          className="flex items-center gap-2 text-xs text-white/70"
                        >
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          {action}
                        </div>
                      ))}
                    </div>
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

export default DebtPayoffTab;
