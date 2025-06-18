import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import CleanAccountCard from '@/components/financial/CleanAccountCard';
import CleanCreditScoreCard from '@/components/financial/CleanCreditScoreCard';
import { VueniUnifiedTransactionList } from '@/components/shared';
import SimpleGlassCard from '@/components/ui/SimpleGlassCard';
import { colors } from '@/theme/colors';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  PiggyBank,
  Eye,
  EyeOff 
} from 'lucide-react';

// Mock data that matches your existing structure
const mockAccounts = [
  {
    id: 'acc_001',
    accountType: 'Checking',
    accountName: 'Main Account',
    balance: 12450.00,
    available: 11200.00,
    change: { amount: 1523.50, percentage: 12.5, period: 'vs last month' },
    isActive: true
  },
  {
    id: 'acc_002',
    accountType: 'Savings',
    accountName: 'Emergency Fund',
    balance: 25780.50,
    available: 25780.50,
    change: { amount: 780.25, percentage: 3.1, period: 'vs last month' }
  },
  {
    id: 'acc_003',
    accountType: 'Credit Card',
    accountName: 'Rewards Card',
    balance: -1245.30,
    available: 8754.70,
    change: { amount: -245.30, percentage: -2.1, period: 'vs last month' }
  },
  {
    id: 'acc_004',
    accountType: 'Investment',
    accountName: 'Portfolio',
    balance: 45600.25,
    available: 45600.25,
    change: { amount: 2340.80, percentage: 5.4, period: 'vs last month' }
  }
];

const mockTransactions = [
  {
    id: 'txn_001',
    merchant: 'Whole Foods Market',
    category: 'Groceries',
    amount: -127.43,
    date: '2025-06-16T10:30:00Z',
    status: 'completed' as const,
    scores: { health: 85, eco: 92, financial: 78 }
  },
  {
    id: 'txn_002',
    merchant: 'Apple Store',
    category: 'Electronics',
    amount: -899.00,
    date: '2025-06-16T08:15:00Z',
    status: 'completed' as const,
    scores: { health: 65, eco: 45, financial: 60 }
  },
  {
    id: 'txn_003',
    merchant: 'Salary Deposit',
    category: 'Income',
    amount: 3250.00,
    date: '2025-06-15T09:00:00Z',
    status: 'completed' as const,
    scores: { health: 100, eco: 85, financial: 95 }
  },
  {
    id: 'txn_004',
    merchant: 'Starbucks',
    category: 'Coffee',
    amount: -6.85,
    date: '2025-06-15T07:45:00Z',
    status: 'completed' as const,
    scores: { health: 40, eco: 60, financial: 85 }
  },
  {
    id: 'txn_005',
    merchant: 'Gas Station',
    category: 'Transportation',
    amount: -45.20,
    date: '2025-06-14T18:30:00Z',
    status: 'pending' as const,
    scores: { health: 70, eco: 30, financial: 80 }
  }
];

const OverviewCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color 
}: { 
  title: string; 
  value: string; 
  change: { amount: number; percentage: number };
  icon: React.ComponentType<{ className?: string }>; 
  color: string;
}) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <SimpleGlassCard className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/[0.06]">
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm tracking-wide">***{title}***</h3>
          </div>
        </div>
        
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

      <div className={`mb-3 transition-all duration-300 ${isVisible ? '' : 'blur-sm'}`}>
        <div className="text-3xl font-black text-white mb-1 tracking-wide">
          {isVisible ? value : '••••••'}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div 
          className="flex items-center gap-1"
          style={{ 
            color: change.amount >= 0 ? colors.status.success : colors.status.error 
          }}
        >
          <TrendingUp className={`w-4 h-4 ${change.amount < 0 ? 'rotate-180' : ''}`} />
          <span className="text-sm font-medium">
            {change.percentage >= 0 ? '+' : ''}{change.percentage.toFixed(1)}%
          </span>
        </div>
        <span className="text-white/50 text-sm">vs last month</span>
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
    .filter(acc => acc.accountType.toLowerCase() === 'credit card')
    .reduce((sum, acc) => sum + Math.abs(acc.balance), 0);

  const netWorth = totalBalance - totalDebt;
  
  const monthlyIncome = mockTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const handleTransactionClick = (transaction: { id: string; amount: number; description: string; category: string }) => {
    console.log('Transaction clicked:', transaction);
  };

  const handleAccountClick = (account: { id: string; name: string; balance: number; type: string }) => {
    console.log('Account clicked:', account);
  };

  const handleCreditReportClick = () => {
    console.log('View credit report clicked');
  };

  if (activeTab !== 'dashboard') {
    return (
      <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="space-y-6">
          <SimpleGlassCard className="p-8 text-center">
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
        <SimpleGlassCard className="p-6">
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
              <p className="text-sm text-white/60 font-semibold">***Total Net Worth***</p>
              <p className="text-2xl font-black text-white tracking-wide">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(netWorth)}
              </p>
            </div>
          </div>
        </SimpleGlassCard>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <OverviewCard
            title="Total Assets"
            value={new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(totalBalance)}
            change={{ amount: 2500, percentage: 8.2 }}
            icon={DollarSign}
            color={colors.accent.green}
          />
          
          <OverviewCard
            title="Monthly Income"
            value={new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(monthlyIncome)}
            change={{ amount: 250, percentage: 4.1 }}
            icon={TrendingUp}
            color={colors.accent.blue}
          />
          
          <OverviewCard
            title="Total Debt"
            value={new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(totalDebt)}
            change={{ amount: -125, percentage: -2.5 }}
            icon={CreditCard}
            color={colors.status.error}
          />
          
          <OverviewCard
            title="Savings Rate"
            value="23.5%"
            change={{ amount: 1.2, percentage: 5.4 }}
            icon={PiggyBank}
            color={colors.accent.purple}
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
              <h3 className="text-xl font-black text-white px-2 tracking-wide italic">***Accounts***</h3>
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
            <OptimizedTransactionList
              transactions={mockTransactions.map(t => ({
                id: t.id,
                date: t.date,
                description: t.merchant,
                amount: t.amount,
                category: {
                  name: t.category,
                  color: '#6366f1'
                },
                type: t.amount < 0 ? 'expense' : 'income' as const,
                merchant: t.merchant,
                scores: t.scores,
                status: 'completed' as const
              }))}
              variant="clean"
              currency="USD"
              features={{
                showScores: true,
                showCategories: true,
                searchable: true,
                filterable: true,
                sortable: true
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