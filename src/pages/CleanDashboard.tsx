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

// Mock data that matches your existing structure
const mockAccounts = [
  {
    id: 'acc_001',
    accountType: 'Checking',
    accountName: 'Main Account',
    balance: 12450.0,
    available: 11200.0,
    change: { amount: 1523.5, percentage: 12.5, period: 'vs last month' },
    isActive: true,
  },
  {
    id: 'acc_002',
    accountType: 'Savings',
    accountName: 'Emergency Fund',
    balance: 25780.5,
    available: 25780.5,
    change: { amount: 780.25, percentage: 3.1, period: 'vs last month' },
  },
  {
    id: 'acc_003',
    accountType: 'Credit Card',
    accountName: 'Rewards Card',
    balance: -1245.3,
    available: 8754.7,
    change: { amount: -245.3, percentage: -2.1, period: 'vs last month' },
  },
  {
    id: 'acc_004',
    accountType: 'Investment',
    accountName: 'Portfolio',
    balance: 45600.25,
    available: 45600.25,
    change: { amount: 2340.8, percentage: 5.4, period: 'vs last month' },
  },
];

const mockTransactions = [
  {
    id: 'txn_001',
    merchant: 'Whole Foods Market',
    category: 'Groceries',
    amount: -127.43,
    date: '2025-06-16T10:30:00Z',
    status: 'completed' as const,
    scores: { health: 85, eco: 92, financial: 78 },
  },
  {
    id: 'txn_002',
    merchant: 'Apple Store',
    category: 'Electronics',
    amount: -899.0,
    date: '2025-06-16T08:15:00Z',
    status: 'completed' as const,
    scores: { health: 65, eco: 45, financial: 60 },
  },
  {
    id: 'txn_003',
    merchant: 'Salary Deposit',
    category: 'Income',
    amount: 3250.0,
    date: '2025-06-15T09:00:00Z',
    status: 'completed' as const,
    scores: { health: 100, eco: 85, financial: 95 },
  },
  {
    id: 'txn_004',
    merchant: 'Starbucks',
    category: 'Coffee',
    amount: -6.85,
    date: '2025-06-15T07:45:00Z',
    status: 'completed' as const,
    scores: { health: 40, eco: 60, financial: 85 },
  },
  {
    id: 'txn_005',
    merchant: 'Gas Station',
    category: 'Transportation',
    amount: -45.2,
    date: '2025-06-14T18:30:00Z',
    status: 'pending' as const,
    scores: { health: 70, eco: 30, financial: 80 },
  },
];

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
