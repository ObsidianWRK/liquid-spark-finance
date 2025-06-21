import React, { useState, useMemo } from 'react';
import AppShell from '@/components/layout/AppShell';
import CleanAccountCard, {
  AccountData,
} from '@/features/accounts/components/CleanAccountCard';
import CleanCreditScoreCard from '@/features/credit/components/CleanCreditScoreCard';
import { UnifiedTransactionList } from '@/features/transactions/components/UnifiedTransactionList';
import SimpleGlassCard from '@/shared/ui/SimpleGlassCard';
import { vueniTheme } from '@/theme/unified';
import { cn } from '@/shared/lib/utils';
import {
  DollarSign,
  Heart,
  Leaf,
  CreditCard,
  Building2,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Landmark,
  PiggyBank,
  Wallet,
  AreaChart as AreaChartIcon,
  BarChart2,
  PieChart as PieChartIcon,
  Eye,
  EyeOff,
} from 'lucide-react';
import { OptimizedTransactionList } from '@/features/transactions/components/OptimizedTransactionList';
import {
  getAccounts,
  getTransactions,
} from '@/services/mockDataProvider';

// Pull mock data from centralized provider
const mockAccounts: AccountData[] = getAccounts().map((acc) => ({
  id: acc.id,
  accountType: acc.accountSubtype || acc.accountType,
  accountName: acc.name,
  balance: acc.balance,
  available: acc.availableBalance,
  change: { amount: 0, percentage: 0, period: 'vs last month' },
  isActive: acc.isActive,
}));

const mockTransactions = getTransactions().map((t) => ({
  id: t.id,
  merchant: (t as any).merchant ?? (t as any).merchantName ?? 'Unknown',
  category: typeof (t as any).category === 'string'
    ? (t as any).category
    : (t as any).category?.name ?? 'Other',
  amount: t.amount,
  date: t.date,
  status: (t as any).status ?? 'completed',
  scores: { health: 0, eco: 0, financial: 0 },
}));

const DashboardMetric = ({
  title,
  value,
  change,
  icon: Icon,
  iconColor,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <SimpleGlassCard variant="glass" className="p-6">
      <div className="flex items-center gap-3">
        <div
          className="p-3 rounded-full"
          style={{ backgroundColor: vueniTheme.colors.surface.overlay }}
        >
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      <p className="text-sm text-white/70">{change}</p>
      <div
        className={`mb-3 transition-all duration-300 ${isVisible ? '' : 'blur-sm'}`}
      >
        <div className="text-3xl font-black text-white mb-1 tracking-wide">
          {isVisible ? value : '••••••'}
        </div>
      </div>
    </SimpleGlassCard>
  );
};

const CleanDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Calculate totals
  const totalBalance = mockAccounts.reduce((sum, acc) => {
    if (acc.accountType.toLowerCase() === 'credit card') {
      return sum; // Don't include credit card debt in total assets
    }
    return sum + acc.balance;
  }, 0);

  const totalDebt = mockAccounts
    .filter((acc) => acc.accountType.toLowerCase() === 'credit card')
    .reduce((sum, acc) => sum + Math.abs(acc.balance), 0);

  const netWorth = totalBalance - totalDebt;

  const monthlyIncome = mockTransactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const handleTransactionClick = (transaction: {
    id: string;
    amount: number;
    description: string;
    category: string;
  }) => {
    // Transaction clicked handler
  };

  const handleAccountClick = (account: {
    id: string;
    name: string;
    balance: number;
    type: string;
  }) => {
    // Account clicked handler
  };

  const handleCreditReportClick = () => {
    // View credit report handler
  };

  if (activeTab !== 'dashboard') {
    return (
      <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="space-y-6">
          <SimpleGlassCard variant="glass" className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <p className="text-white/60">
              This section would contain the {activeTab} content.
            </p>
          </SimpleGlassCard>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <SimpleGlassCard variant="glass" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white mb-2 tracking-wide">
                ***Good morning, John*** 👋
              </h1>
              <p className="text-white/70 font-medium italic">
                Here's what's happening with your finances today
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/60 font-semibold">
                ***Total Net Worth***
              </p>
              <p className="text-2xl font-black text-white tracking-wide">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(netWorth)}
              </p>
            </div>
          </div>
        </SimpleGlassCard>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardMetric
            title="Total Balance"
            value={new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(totalBalance)}
            change="+5.2%"
            icon={DollarSign}
            iconColor={vueniTheme.colors.accent.blue}
          />

          <DashboardMetric
            title="Credit Score"
            value="750"
            change="+12 pts"
            icon={CreditCard}
            iconColor={vueniTheme.colors.accent.purple}
          />

          <DashboardMetric
            title="Wellness Score"
            value="85/100"
            change="+3 pts"
            icon={Heart}
            iconColor={vueniTheme.colors.accent.pink}
          />

          <DashboardMetric
            title="Eco Score"
            value="92/100"
            change="-1 pt"
            icon={Leaf}
            iconColor={vueniTheme.colors.accent.green}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Accounts & Credit Score */}
          <div className="lg:col-span-1 space-y-6">
            {/* Credit Score */}
            <CleanCreditScoreCard onViewReport={handleCreditReportClick} />

            {/* Account Cards */}
            <div className="space-y-4">
              <h3 className="text-xl font-black text-white px-2 tracking-wide italic">
                ***Accounts***
              </h3>
              {mockAccounts.slice(0, 3).map((account) => (
                <CleanAccountCard
                  key={account.id}
                  account={account}
                  onClick={() => handleAccountClick(account)}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Transactions */}
          <div className="lg:col-span-2">
            <UnifiedTransactionList
              transactions={mockTransactions.map((t) => ({
                id: t.id,
                date: t.date,
                description: t.merchant,
                amount: t.amount,
                category: {
                  name: t.category,
                  color: '#6366f1',
                },
                type: t.amount < 0 ? 'expense' : ('income' as const),
                merchant: t.merchant,
                scores: t.scores,
                status: 'completed' as const,
              }))}
              variant="clean"
              currency="USD"
              features={{
                showScores: true,
                showCategories: true,
                searchable: true,
                filterable: true,
                sortable: true,
              }}
              onTransactionClick={handleTransactionClick}
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default CleanDashboard;
