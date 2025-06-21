import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Calendar,
  DollarSign,
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle,
  Calculator,
  PieChart,
  Clock,
  Zap,
} from 'lucide-react';
import { RetirementPlan, RiskProfile } from '@/types/financialPlanning';
import { financialPlanningService } from '@/features/planning/api/financialPlanningService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
} from 'recharts';
import { cn } from '@/shared/lib/utils';

interface RetirementPlannerProps {
  familyId: string;
}

const RetirementPlanner = ({ familyId }: RetirementPlannerProps) => {
  const [plan, setPlan] = useState<RetirementPlan | null>(null);
  const [inputs, setInputs] = useState({
    currentAge: 35,
    retirementAge: 65,
    currentIncome: 100000,
    currentSavings: 150000,
    monthlyContribution: 2000,
    riskProfile: 'moderate' as RiskProfile,
  });
  const [loading, setLoading] = useState(false);
  const [showProjections, setShowProjections] = useState(false);

  useEffect(() => {
    generatePlan();
  }, []);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const newPlan = await financialPlanningService.createRetirementPlan(
        familyId,
        inputs.currentAge,
        inputs.retirementAge,
        inputs.currentIncome,
        inputs.currentSavings,
        inputs.monthlyContribution,
        inputs.riskProfile
      );
      setPlan(newPlan);
    } catch (error) {
      console.error('Failed to generate retirement plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const recalculatePlan = async () => {
    await generatePlan();
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

  // Generate projection data for charts
  const generateProjectionData = () => {
    if (!plan) return [];

    const data = [];
    const yearsToRetirement = plan.yearsToRetirement;

    for (let year = 0; year <= yearsToRetirement; year++) {
      const currentValue =
        plan.currentSavings *
        Math.pow(1 + plan.projections.expectedReturn, year);
      const contributionValue =
        plan.monthlyContribution *
        12 *
        ((Math.pow(1 + plan.projections.expectedReturn, year) - 1) /
          plan.projections.expectedReturn);

      data.push({
        year: inputs.currentAge + year,
        savings: currentValue + contributionValue,
        target:
          plan.projections.targetRetirementSavings * (year / yearsToRetirement),
      });
    }

    return data;
  };

  const riskAllocationData = [
    {
      name: 'Stocks',
      value:
        inputs.riskProfile === 'conservative'
          ? 40
          : inputs.riskProfile === 'moderate'
            ? 70
            : 85,
      color: '#3b82f6',
    },
    {
      name: 'Bonds',
      value:
        inputs.riskProfile === 'conservative'
          ? 50
          : inputs.riskProfile === 'moderate'
            ? 25
            : 10,
      color: '#10b981',
    },
    {
      name: 'Other',
      value:
        inputs.riskProfile === 'conservative'
          ? 10
          : inputs.riskProfile === 'moderate'
            ? 5
            : 5,
      color: '#f59e0b',
    },
  ];

  if (loading && !plan) {
    return (
      <div className="bg-white/[0.02] rounded-vueni-lg border border-white/[0.08] p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-vueni-pill h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white/70">Calculating your retirement plan...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Briefcase className="w-7 h-7 text-blue-400" />
            Retirement Planner
          </h2>
          <p className="text-white/60 mt-1">
            Plan for a secure financial future
          </p>
        </div>

        <button
          onClick={() => setShowProjections(!showProjections)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-vueni-lg transition-colors flex items-center gap-2"
        >
          <PieChart className="w-4 h-4" />
          {showProjections ? 'Hide' : 'Show'} Projections
        </button>
      </div>

      {/* Input Panel */}
      <div className="bg-white/[0.02] rounded-vueni-lg border border-white/[0.08] p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-400" />
          Your Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Current Age
            </label>
            <input
              type="number"
              value={inputs.currentAge}
              onChange={(e) =>
                handleInputChange('currentAge', parseInt(e.target.value))
              }
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-vueni-lg text-white px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Retirement Age
            </label>
            <input
              type="number"
              value={inputs.retirementAge}
              onChange={(e) =>
                handleInputChange('retirementAge', parseInt(e.target.value))
              }
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-vueni-lg text-white px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Current Annual Income
            </label>
            <input
              type="number"
              value={inputs.currentIncome}
              onChange={(e) =>
                handleInputChange('currentIncome', parseInt(e.target.value))
              }
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-vueni-lg text-white px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Current Retirement Savings
            </label>
            <input
              type="number"
              value={inputs.currentSavings}
              onChange={(e) =>
                handleInputChange('currentSavings', parseInt(e.target.value))
              }
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-vueni-lg text-white px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Monthly Contribution
            </label>
            <input
              type="number"
              value={inputs.monthlyContribution}
              onChange={(e) =>
                handleInputChange(
                  'monthlyContribution',
                  parseInt(e.target.value)
                )
              }
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-vueni-lg text-white px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Risk Profile
            </label>
            <select
              value={inputs.riskProfile}
              onChange={(e) => handleInputChange('riskProfile', e.target.value)}
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-vueni-lg text-white px-3 py-2"
            >
              <option value="conservative">Conservative (4% return)</option>
              <option value="moderate">Moderate (7% return)</option>
              <option value="aggressive">Aggressive (10% return)</option>
            </select>
          </div>
        </div>

        <button
          onClick={recalculatePlan}
          disabled={loading}
          className="mt-4 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-6 py-2 rounded-vueni-lg transition-colors flex items-center gap-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-vueni-pill animate-spin" />
          ) : (
            <Calculator className="w-4 h-4" />
          )}
          Recalculate Plan
        </button>
      </div>

      {/* Results */}
      {plan && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/[0.02] rounded-vueni-lg border border-white/[0.08] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Years to Retirement</p>
                  <p className="text-3xl font-bold text-white">
                    {plan.yearsToRetirement}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-white/[0.02] rounded-vueni-lg border border-white/[0.08] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Projected Value</p>
                  <p className="text-3xl font-bold text-white">
                    {formatCurrency(plan.projections.totalRetirementValue)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </div>

            <div className="bg-white/[0.02] rounded-vueni-lg border border-white/[0.08] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Monthly Income</p>
                  <p className="text-3xl font-bold text-white">
                    {formatCurrency(plan.projections.monthlyIncomeAtRetirement)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-400" />
              </div>
            </div>

            <div className="bg-white/[0.02] rounded-vueni-lg border border-white/[0.08] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">
                    {plan.projections.shortfall > 0 ? 'Shortfall' : 'Surplus'}
                  </p>
                  <p
                    className={cn(
                      'text-3xl font-bold',
                      plan.projections.shortfall > 0
                        ? 'text-red-400'
                        : 'text-green-400'
                    )}
                  >
                    {plan.projections.shortfall > 0 ? '-' : '+'}
                    {formatCurrency(Math.abs(plan.projections.shortfall))}
                  </p>
                </div>
                {plan.projections.shortfall > 0 ? (
                  <AlertCircle className="w-8 h-8 text-red-400" />
                ) : (
                  <CheckCircle className="w-8 h-8 text-green-400" />
                )}
              </div>
            </div>
          </div>

          {/* Analysis */}
          <div className="bg-white/[0.02] rounded-vueni-lg border border-white/[0.08] p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              Retirement Analysis
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-vueni-lg">
                  <span className="text-white/80">
                    Target Retirement Savings
                  </span>
                  <span className="font-semibold text-white">
                    {formatCurrency(plan.projections.targetRetirementSavings)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-vueni-lg">
                  <span className="text-white/80">
                    Projected Retirement Value
                  </span>
                  <span className="font-semibold text-white">
                    {formatCurrency(plan.projections.totalRetirementValue)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-vueni-lg">
                  <span className="text-white/80">Expected Annual Return</span>
                  <span className="font-semibold text-white">
                    {formatPercentage(plan.projections.expectedReturn)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-vueni-lg">
                  <span className="text-white/80">
                    Income Replacement Ratio
                  </span>
                  <span className="font-semibold text-white">
                    {Math.round(
                      ((plan.projections.monthlyIncomeAtRetirement * 12) /
                        plan.currentIncome) *
                        100
                    )}
                    %
                  </span>
                </div>
              </div>

              {/* Asset Allocation */}
              <div>
                <h4 className="text-md font-semibold text-white mb-3">
                  Recommended Asset Allocation
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={riskAllocationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {riskAllocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value}%`, 'Allocation']}
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: vueniTheme.radius.lg,
                          color: 'white',
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 mt-4">
                  {riskAllocationData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-white/80">{item.name}</span>
                      </div>
                      <span className="text-white">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Projections Chart */}
          {showProjections && (
            <div className="bg-white/[0.02] rounded-vueni-lg border border-white/[0.08] p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Savings Growth Projection
              </h3>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateProjectionData()}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <XAxis
                      dataKey="year"
                      stroke="rgba(255,255,255,0.6)"
                      tick={{ fill: 'rgba(255,255,255,0.6)' }}
                    />
                    <YAxis
                      stroke="rgba(255,255,255,0.6)"
                      tick={{ fill: 'rgba(255,255,255,0.6)' }}
                      tickFormatter={(value) =>
                        `$${(value / 1000000).toFixed(1)}M`
                      }
                    />
                    <Tooltip
                      formatter={(value, name) => [
                        formatCurrency(value as number),
                        name === 'savings'
                          ? 'Projected Savings'
                          : 'Target Savings',
                      ]}
                      labelFormatter={(label) => `Age ${label}`}
                      contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: vueniTheme.radius.lg,
                        color: 'white',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="savings"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#ef4444"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-blue-500"></div>
                  <span className="text-white/80">Projected Savings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-red-500 border-dashed"></div>
                  <span className="text-white/80">Target Savings</span>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {plan.recommendations.length > 0 && (
            <div className="bg-white/[0.02] rounded-vueni-lg border border-white/[0.08] p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Recommendations
              </h3>

              <div className="space-y-4">
                {plan.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="bg-white/[0.03] rounded-vueni-lg p-4 border border-white/[0.05]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-2">
                          {rec.title}
                        </h4>
                        <p className="text-white/70 text-sm mb-3">
                          {rec.description}
                        </p>

                        <div className="space-y-2">
                          {rec.actionItems.map((item, itemIndex) => (
                            <div
                              key={itemIndex}
                              className="flex items-center gap-2 text-sm"
                            >
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-vueni-pill"></div>
                              <span className="text-white/80">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-right">
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
                        {rec.estimatedBenefit > 0 && (
                          <p className="text-green-400 text-sm mt-1">
                            Save {formatCurrency(rec.estimatedBenefit)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RetirementPlanner;
