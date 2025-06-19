import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  PieChart,
  BarChart3,
  Activity,
  AlertCircle,
  Zap,
  Shield,
  CreditCard,
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import { visualizationService, DashboardData, FinancialMetric } from '@/services/visualizationService';
import { cn } from '@/lib/utils';

interface FinancialDashboardProps {
  familyId: string;
  timeframe?: '1m' | '3m' | '6m' | '1y';
  className?: string;
}

const FinancialDashboard = ({ familyId, timeframe = '3m', className }: FinancialDashboardProps) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState<'networth' | 'cashflow' | 'spending' | 'portfolio'>('networth');

  useEffect(() => {
    loadDashboardData();
  }, [familyId, timeframe]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await visualizationService.getDashboardData(familyId, timeframe);
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const formatNumber = (value: number) => {
    return value.toFixed(1);
  };

  const getMetricIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      'trending-up': TrendingUp,
      'piggy-bank': Target,
      'target': Target,
      'credit-card': CreditCard,
      'shield': Shield
    };
    const Icon = icons[iconName] || Activity;
    return <Icon className="w-5 h-5" />;
  };

  const getTrendIcon = (trend: string, changePercent: number) => {
    if (Math.abs(changePercent) < 1) {
      return <Minus className="w-4 h-4 text-gray-400" />;
    }
    if (trend === 'up' || changePercent > 0) {
      return <ArrowUp className="w-4 h-4 text-green-400" />;
    }
    return <ArrowDown className="w-4 h-4 text-red-400" />;
  };

  const getTrendColor = (trend: string, changePercent: number) => {
    if (Math.abs(changePercent) < 1) return 'text-gray-400';
    if (trend === 'up' || changePercent > 0) return 'text-green-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-white/[0.05] rounded w-32"></div>
                <div className="h-6 bg-white/[0.05] rounded w-6"></div>
              </div>
              <div className="h-8 bg-white/[0.05] rounded w-24 mb-2"></div>
              <div className="h-4 bg-white/[0.05] rounded w-20"></div>
            </div>
          ))}
        </div>
        <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6 animate-pulse">
          <div className="h-64 bg-white/[0.05] rounded"></div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className={cn("bg-white/[0.02] rounded-2xl border border-white/[0.08] p-12 text-center", className)}>
        <Activity className="w-16 h-16 text-white/20 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Dashboard Data</h3>
        <p className="text-white/60">Unable to load financial dashboard. Please try again.</p>
      </div>
    );
  }

  const renderNetWorthChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={dashboardData.netWorthHistory}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="date" 
          stroke="#9ca3af"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
        />
        <YAxis 
          stroke="#9ca3af"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip 
          formatter={(value: number) => [formatCurrency(value), '']}
          labelFormatter={(label) => new Date(label).toLocaleDateString()}
          contentStyle={{ 
            backgroundColor: '#1f2937', 
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#fff'
          }}
        />
        <Area
          type="monotone"
          dataKey="netWorth"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.1}
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="investmentValue"
          stroke="#10b981"
          fill="#10b981"
          fillOpacity={0.1}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  const renderCashFlowChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={dashboardData.cashFlowHistory}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="date" 
          stroke="#9ca3af"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
        />
        <YAxis 
          stroke="#9ca3af"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip 
          formatter={(value: number) => [formatCurrency(value), '']}
          labelFormatter={(label) => new Date(label).toLocaleDateString()}
          contentStyle={{ 
            backgroundColor: '#1f2937', 
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#fff'
          }}
        />
        <Bar dataKey="income" fill="#10b981" name="Income" />
        <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
        <Line
          type="monotone"
          dataKey="netCashFlow"
          stroke="#f59e0b"
          strokeWidth={3}
          name="Net Cash Flow"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );

  const renderSpendingChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={dashboardData.spendingTrends.slice(0, 8)} layout="horizontal">
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          type="number"
          stroke="#9ca3af"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <YAxis 
          type="category"
          dataKey="category"
          stroke="#9ca3af"
          tick={{ fontSize: 12 }}
          width={100}
          tickFormatter={(value) => value.replace('_', ' ').substring(0, 10)}
        />
        <Tooltip 
          formatter={(value: number) => [formatCurrency(value), '']}
          contentStyle={{ 
            backgroundColor: '#1f2937', 
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#fff'
          }}
        />
        <Bar dataKey="currentMonth" fill="#3b82f6" name="This Month" />
        <Bar dataKey="previousMonth" fill="#6b7280" name="Last Month" />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPortfolioChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPieChart>
        <Pie
          data={dashboardData.portfolioAllocation}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={120}
          paddingAngle={2}
          dataKey="value"
        >
          {dashboardData.portfolioAllocation.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => [formatCurrency(value), '']}
          contentStyle={{ 
            backgroundColor: '#1f2937', 
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#fff'
          }}
        />
        <Legend 
          wrapperStyle={{ color: '#fff' }}
          formatter={(value, entry: any) => `${value} (${entry.payload?.percentage?.toFixed(1) || 0}%)`}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );

  return (
    <div className={cn("space-y-8", className)}>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardData.keyMetrics.map((metric) => (
          <div key={metric.id} className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6 hover:bg-white/[0.03] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center" style={{ color: metric.color }}>
                  {getMetricIcon(metric.icon)}
                </div>
                <h3 className="font-medium text-white/80">{metric.label}</h3>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(metric.trend, metric.changePercent)}
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-2xl font-bold text-white">
                {metric.format === 'currency' && formatCurrency(metric.value)}
                {metric.format === 'percentage' && formatPercentage(metric.value)}
                {metric.format === 'number' && `${formatNumber(metric.value)} months`}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className={getTrendColor(metric.trend, metric.changePercent)}>
                  {metric.format === 'currency' && formatCurrency(metric.change)}
                  {metric.format === 'percentage' && formatPercentage(metric.changePercent)}
                  {metric.format === 'number' && formatPercentage(metric.changePercent)}
                </span>
                <span className="text-white/60">vs last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Financial Overview</h2>
          
          {/* Chart Selector */}
          <div className="flex items-center gap-1 bg-white/[0.02] rounded-xl p-1 border border-white/[0.08]">
            {[
              { id: 'networth', label: 'Net Worth', icon: TrendingUp },
              { id: 'cashflow', label: 'Cash Flow', icon: BarChart3 },
              { id: 'spending', label: 'Spending', icon: DollarSign },
              { id: 'portfolio', label: 'Portfolio', icon: PieChart }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSelectedChart(id as any)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm",
                  selectedChart === id
                    ? "bg-blue-500 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-80">
          {selectedChart === 'networth' && renderNetWorthChart()}
          {selectedChart === 'cashflow' && renderCashFlowChart()}
          {selectedChart === 'spending' && renderSpendingChart()}
          {selectedChart === 'portfolio' && renderPortfolioChart()}
        </div>
      </div>

      {/* Budget Performance */}
      <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Target className="w-6 h-6 text-blue-400" />
          Budget Performance
        </h2>
        
        <div className="space-y-4">
          {dashboardData.budgetPerformance.slice(0, 6).map((budget, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${budget.color}20`, color: budget.color }}>
                  <Target className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white capitalize truncate">{budget.category.replace('_', ' ')}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex-1 bg-white/[0.05] rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(budget.progress, 100)}%`,
                          backgroundColor: budget.color
                        }}
                      ></div>
                    </div>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-lg border font-medium",
                      budget.status === 'over-budget' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      budget.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      'bg-green-500/20 text-green-400 border-green-500/30'
                    )}>
                      {budget.progress.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-white">{formatCurrency(budget.spent)}</p>
                <p className="text-white/60 text-sm">of {formatCurrency(budget.budgeted)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Allocation Details */}
      <div className="bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <PieChart className="w-6 h-6 text-purple-400" />
          Portfolio Allocation
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardData.portfolioAllocation.map((allocation, index) => (
            <div key={index} className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: allocation.color }}></div>
                  <span className="font-medium text-white">{allocation.name}</span>
                </div>
                <span className="text-white/60 text-sm">{allocation.percentage.toFixed(1)}%</span>
              </div>
              
              <div className="space-y-2">
                <p className="text-lg font-bold text-white">{formatCurrency(allocation.value)}</p>
                {allocation.change !== undefined && (
                  <div className="flex items-center gap-2 text-sm">
                    {getTrendIcon(allocation.changePercent! >= 0 ? 'up' : 'down', allocation.changePercent!)}
                    <span className={getTrendColor(allocation.changePercent! >= 0 ? 'up' : 'down', allocation.changePercent!)}>
                      {formatCurrency(allocation.change)} ({formatPercentage(allocation.changePercent!)})
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;