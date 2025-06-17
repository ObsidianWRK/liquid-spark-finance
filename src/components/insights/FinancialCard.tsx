import React from 'react';
import { DollarSign, PiggyBank, CreditCard, TrendingUp, Shield, Calendar } from 'lucide-react';
import { SharedScoreCircle } from '@/components/shared';
import MetricCard from './MetricCard';

interface FinancialData {
  overallScore: number;
  monthlyIncome: number;
  monthlySpending: number;
  totalBalance: number;
  savingsRate: number;
  spendingRatio: number;
  emergencyFundMonths: number;
  debtToIncomeRatio: number;
  billPaymentScore: number;
}

interface FinancialCardProps {
  data: FinancialData;
}

const FinancialCard: React.FC<FinancialCardProps> = ({ data }) => {
  const getScoreRating = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
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
    return `${Math.round(value)}%`;
  };

  const keyMetrics = [
    { 
      icon: DollarSign, 
      label: 'Monthly Income', 
      value: formatCurrency(data.monthlyIncome), 
      color: '#10b981',
      trend: 'stable' as const
    },
    { 
      icon: TrendingUp, 
      label: 'Monthly Spending', 
      value: formatCurrency(data.monthlySpending), 
      color: '#ef4444',
      trend: data.spendingRatio > 80 ? 'up' as const : 'stable' as const
    },
    { 
      icon: PiggyBank, 
      label: 'Total Balance', 
      value: formatCurrency(data.totalBalance), 
      color: '#3b82f6',
      trend: data.totalBalance > 10000 ? 'up' as const : 'stable' as const
    },
    { 
      icon: Shield, 
      label: 'Emergency Fund', 
      value: `${data.emergencyFundMonths.toFixed(1)} months`, 
      color: '#8b5cf6',
      trend: data.emergencyFundMonths >= 6 ? 'up' as const : data.emergencyFundMonths >= 3 ? 'stable' as const : 'down' as const
    },
    { 
      icon: Calendar, 
      label: 'Savings Rate', 
      value: formatPercentage(data.savingsRate), 
      color: '#f59e0b',
      trend: data.savingsRate >= 20 ? 'up' as const : data.savingsRate >= 10 ? 'stable' as const : 'down' as const
    },
    { 
      icon: CreditCard, 
      label: 'Bill Payment Score', 
      value: formatPercentage(data.billPaymentScore), 
      color: '#06b6d4',
      trend: data.billPaymentScore >= 95 ? 'up' as const : data.billPaymentScore >= 85 ? 'stable' as const : 'down' as const
    },
  ];

  const insights = [
    {
      title: 'Spending Ratio',
      value: formatPercentage(data.spendingRatio),
      description: 'Of income spent monthly',
      status: data.spendingRatio <= 70 ? 'good' : data.spendingRatio <= 85 ? 'warning' : 'danger'
    },
    {
      title: 'Debt to Income',
      value: formatPercentage(data.debtToIncomeRatio),
      description: 'Annual debt burden',
      status: data.debtToIncomeRatio <= 20 ? 'good' : data.debtToIncomeRatio <= 40 ? 'warning' : 'danger'
    },
    {
      title: 'Emergency Fund',
      value: `${data.emergencyFundMonths.toFixed(1)} months`,
      description: 'Monthly expenses covered',
      status: data.emergencyFundMonths >= 6 ? 'good' : data.emergencyFundMonths >= 3 ? 'warning' : 'danger'
    },
    {
      title: 'Savings Rate',
      value: formatPercentage(data.savingsRate),
      description: 'Of income saved monthly',
      status: data.savingsRate >= 20 ? 'good' : data.savingsRate >= 10 ? 'warning' : 'danger'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'danger': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="liquid-glass-fallback rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Financial Health</h3>
            <p className="text-white/70 text-sm sm:text-base">
              Net worth: {formatCurrency(data.totalBalance)}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <SharedScoreCircle 
              score={data.overallScore} 
              type="financial"
              size="lg"
              label={getScoreRating(data.overallScore)}
              showLabel={true}
            />
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {keyMetrics.map((metric, index) => (
          <MetricCard
            key={metric.label}
            title={metric.label}
            value={metric.value}
            icon={metric.icon}
            color={metric.color}
            trend={metric.trend}
          />
        ))}
      </div>

      {/* Financial Insights */}
      <div className="liquid-glass-fallback rounded-2xl p-4 sm:p-6">
        <h4 className="text-lg sm:text-xl font-bold text-white mb-4">Financial Insights</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {insights.map((insight, index) => (
            <div key={insight.title} className="p-4 rounded-xl bg-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-xs sm:text-sm font-medium">{insight.title}</span>
                <span 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getStatusColor(insight.status) }}
                />
              </div>
              <div 
                className="text-lg sm:text-xl font-bold mb-1"
                style={{ color: getStatusColor(insight.status) }}
              >
                {insight.value}
              </div>
              <div className="text-xs text-white/50">
                {insight.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinancialCard; 