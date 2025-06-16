import React, { useState } from 'react';
import SimpleGlassCard from '@/components/ui/SimpleGlassCard';
import { colors } from '@/theme/colors';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  PieChart,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  CreditCard,
  Building,
  PiggyBank,
  Eye,
  EyeOff
} from 'lucide-react';
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Pie } from 'recharts';

interface Account {
  id: string;
  type: string;
  nickname: string;
  balance: number;
  availableBalance: number;
  currency: string;
}

interface NetWorthSummaryProps {
  accounts: Account[];
  className?: string;
}

const NetWorthSummary = ({ accounts, className }: NetWorthSummaryProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeframe, setTimeframe] = useState('6M');

  // Calculate net worth metrics
  const calculations = React.useMemo(() => {
    const assets = accounts
      .filter(acc => !acc.type.toLowerCase().includes('credit'))
      .reduce((sum, acc) => sum + acc.balance, 0);
    
    const liabilities = Math.abs(accounts
      .filter(acc => acc.type.toLowerCase().includes('credit'))
      .reduce((sum, acc) => sum + Math.min(0, acc.balance), 0));
    
    const netWorth = assets - liabilities;
    
    // Calculate allocation
    const checking = accounts
      .filter(acc => acc.type.toLowerCase().includes('checking'))
      .reduce((sum, acc) => sum + acc.balance, 0);
    
    const savings = accounts
      .filter(acc => acc.type.toLowerCase().includes('savings'))
      .reduce((sum, acc) => sum + acc.balance, 0);
    
    const investments = accounts
      .filter(acc => acc.type.toLowerCase().includes('investment'))
      .reduce((sum, acc) => sum + acc.balance, 0);
    
    const retirement = accounts
      .filter(acc => acc.type.toLowerCase().includes('retirement'))
      .reduce((sum, acc) => sum + acc.balance, 0);

    return {
      assets,
      liabilities,
      netWorth,
      checking,
      savings,
      investments,
      retirement,
      monthlyChange: 2847.23, // Mock data - would come from historical data
      yearlyChange: 18420.50, // Mock data
      changePercentage: 8.2 // Mock data
    };
  }, [accounts]);

  // Mock historical data for trend chart
  const trendData = [
    { month: 'Jan', value: calculations.netWorth - 18420 },
    { month: 'Feb', value: calculations.netWorth - 15240 },
    { month: 'Mar', value: calculations.netWorth - 12680 },
    { month: 'Apr', value: calculations.netWorth - 9420 },
    { month: 'May', value: calculations.netWorth - 5830 },
    { month: 'Jun', value: calculations.netWorth - 2847 },
    { month: 'Jul', value: calculations.netWorth }
  ];

  // Allocation data for pie chart
  const allocationData = [
    { name: 'Checking', value: calculations.checking, color: colors.accent.blue },
    { name: 'Savings', value: calculations.savings, color: colors.accent.green },
    { name: 'Investments', value: calculations.investments, color: colors.accent.purple },
    { name: 'Retirement', value: calculations.retirement, color: colors.accent.orange }
  ].filter(item => item.value > 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number, total: number) => {
    return ((value / total) * 100).toFixed(1);
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Main Net Worth Card */}
      <SimpleGlassCard className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Net Worth</h2>
            <p className="text-white/60 text-sm">Your total financial position</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="p-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.08] transition-colors"
            >
              {isVisible ? (
                <EyeOff className="w-4 h-4 text-white/70" />
              ) : (
                <Eye className="w-4 h-4 text-white/70" />
              )}
            </button>
          </div>
        </div>

        <div className={`transition-all duration-300 ${isVisible ? '' : 'blur-sm'}`}>
          {/* Net Worth Value */}
          <div className="mb-6">
            <div className="text-4xl font-bold text-white mb-2">
              {isVisible ? formatCurrency(calculations.netWorth) : '••••••••'}
            </div>
            <div className="flex items-center gap-2">
              {calculations.changePercentage >= 0 ? (
                <ArrowUpRight className="w-4 h-4 text-green-400" />
              ) : (
                <ArrowDownLeft className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-sm font-medium ${
                calculations.changePercentage >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {calculations.changePercentage >= 0 ? '+' : ''}{calculations.changePercentage}% this year
              </span>
              <span className="text-white/60 text-sm">
                ({calculations.changePercentage >= 0 ? '+' : ''}{formatCurrency(calculations.yearlyChange)})
              </span>
            </div>
          </div>

          {/* Assets vs Liabilities */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-medium">Assets</span>
              </div>
              <div className="text-xl font-bold text-white">
                {formatCurrency(calculations.assets)}
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-sm font-medium">Liabilities</span>
              </div>
              <div className="text-xl font-bold text-white">
                {formatCurrency(calculations.liabilities)}
              </div>
            </div>
          </div>
        </div>
      </SimpleGlassCard>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Net Worth Trend */}
        <SimpleGlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Net Worth Trend</h3>
            <div className="flex gap-1">
              {['3M', '6M', '1Y', '2Y'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    timeframe === period
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.accent.blue} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={colors.accent.blue} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                />
                <YAxis hide />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Net Worth']}
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={colors.accent.blue}
                  strokeWidth={2}
                  fill="url(#netWorthGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SimpleGlassCard>

        {/* Asset Allocation */}
        <SimpleGlassCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Asset Allocation</h3>
          
          <div className="h-48 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), '']}
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {allocationData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-white/80 text-sm">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-white text-sm font-medium">
                    {formatCurrency(item.value)}
                  </div>
                  <div className="text-white/60 text-xs">
                    {formatPercentage(item.value, calculations.assets)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SimpleGlassCard>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SimpleGlassCard className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Calendar className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-white/70 text-sm">This Month</span>
          </div>
          <div className="text-xl font-bold text-white">
            +{formatCurrency(calculations.monthlyChange)}
          </div>
          <div className="text-green-400 text-xs">+3.2% increase</div>
        </SimpleGlassCard>

        <SimpleGlassCard className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Target className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-white/70 text-sm">Goal Progress</span>
          </div>
          <div className="text-xl font-bold text-white">73%</div>
          <div className="text-purple-400 text-xs">On track</div>
        </SimpleGlassCard>

        <SimpleGlassCard className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <PiggyBank className="w-4 h-4 text-green-400" />
            </div>
            <span className="text-white/70 text-sm">Savings Rate</span>
          </div>
          <div className="text-xl font-bold text-white">23.5%</div>
          <div className="text-green-400 text-xs">Above average</div>
        </SimpleGlassCard>

        <SimpleGlassCard className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Building className="w-4 h-4 text-orange-400" />
            </div>
            <span className="text-white/70 text-sm">Credit Score</span>
          </div>
          <div className="text-xl font-bold text-white">785</div>
          <div className="text-green-400 text-xs">Excellent</div>
        </SimpleGlassCard>
      </div>
    </div>
  );
};

export default NetWorthSummary; 