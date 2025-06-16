import React, { useState, useEffect } from 'react';
import AppShell from '@/components/layout/AppShell';
import CleanAccountCard from '@/components/financial/CleanAccountCard';
import CleanCreditScoreCard from '@/components/financial/CleanCreditScoreCard';
import CleanTransactionList from '@/components/transactions/CleanTransactionList';
import SimpleGlassCard from '@/components/ui/SimpleGlassCard';
import { colors } from '@/theme/colors';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  PiggyBank,
  Eye,
  EyeOff,
  Search,
  Bell,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import AccountCard from '@/components/AccountCard';
import TransactionItem from '@/components/TransactionItem';
import QuickActions from '@/components/QuickActions';
import EmptyState from '@/components/ui/EmptyState';
import { SkeletonCard, SkeletonTransaction } from '@/components/ui/Skeleton';
import { useAccessibility, useSkipLinks } from '@/hooks/useAccessibility';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  category: string;
  merchant?: string;
  icon?: string;
}

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  lastUpdated: string;
}

const mockAccounts: Account[] = [
  {
    id: 'acc_001',
    name: 'Main Account',
    type: 'Checking',
    balance: 12450.00,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'acc_002',
    name: 'Emergency Fund',
    type: 'Savings',
    balance: 25780.50,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'acc_003',
    name: 'Rewards Card',
    type: 'Credit Card',
    balance: -1245.30,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'acc_004',
    name: 'Portfolio',
    type: 'Investment',
    balance: 45600.25,
    lastUpdated: new Date().toISOString(),
  }
];

const mockTransactions: Transaction[] = [
  {
    id: 'txn_001',
    description: 'Whole Foods Market',
    amount: -127.43,
    date: new Date().toISOString(),
    type: 'expense',
    category: 'Groceries',
    merchant: 'Whole Foods',
    icon: '🛒',
  },
  {
    id: 'txn_002',
    description: 'Apple Store',
    amount: -899.00,
    date: new Date().toISOString(),
    type: 'expense',
    category: 'Electronics',
    merchant: 'Apple',
    icon: '🖥️',
  },
  {
    id: 'txn_003',
    description: 'Salary Deposit',
    amount: 3250.00,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    type: 'income',
    category: 'Salary',
    icon: '💰',
  },
  {
    id: 'txn_004',
    description: 'Starbucks',
    amount: -6.85,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'expense',
    category: 'Coffee',
    merchant: 'Starbucks',
    icon: '☕',
  },
  {
    id: 'txn_005',
    description: 'Gas Station',
    amount: -45.20,
    date: new Date().toISOString(),
    type: 'expense',
    category: 'Transportation',
    merchant: 'Shell',
    icon: '🚗',
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
  icon: any; 
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
            <h3 className="font-medium text-white text-sm">{title}</h3>
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
        <div className="text-2xl font-bold text-white mb-1">
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
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [retryCount, setRetryCount] = useState(0);

  const { containerRef, announceToScreenReader } = useAccessibility({
    announcePageChanges: true,
    focusOnMount: false,
  });

  useSkipLinks();

  // Mock data loading with error simulation
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate occasional network errors
      if (Math.random() < 0.1 && retryCount < 3) {
        throw new Error('Network error occurred');
      }

      // Mock data
      const mockAccounts: Account[] = [
        {
          id: '1',
          name: 'Chase Freedom',
          type: 'Credit Card',
          balance: 2543.67,
          lastUpdated: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Wells Fargo Checking',
          type: 'Checking',
          balance: 8934.21,
          lastUpdated: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Savings Account',
          type: 'Savings',
          balance: 15420.89,
          lastUpdated: new Date().toISOString(),
        },
      ];

      const mockTransactions: Transaction[] = [
        {
          id: '1',
          description: 'Whole Foods Market',
          amount: -87.43,
          date: new Date().toISOString(),
          type: 'expense',
          category: 'Groceries',
          merchant: 'Whole Foods',
          icon: '🛒',
        },
        {
          id: '2',
          description: 'Direct Deposit',
          amount: 3250.00,
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          type: 'income',
          category: 'Salary',
          icon: '💰',
        },
        {
          id: '3',
          description: 'Netflix Subscription',
          amount: -15.99,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'expense',
          category: 'Entertainment',
          merchant: 'Netflix',
          icon: '📺',
        },
      ];

      setAccounts(mockAccounts);
      setTransactions(mockTransactions);
      setRetryCount(0);
      
      announceToScreenReader('Dashboard data loaded successfully');
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load data');
      setRetryCount(prev => prev + 1);
      announceToScreenReader('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    announceToScreenReader('Refreshing dashboard');
    loadDashboardData();
  };

  const toggleBalanceVisibility = () => {
    setBalanceVisible(!balanceVisible);
    announceToScreenReader(balanceVisible ? 'Balance hidden' : 'Balance visible');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    announceToScreenReader(`Searching for: ${query}`);
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const monthlyIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  // Error state
  if (error && !isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <EmptyState
          emoji="⚠️"
          title="Unable to load dashboard"
          description={`${error}. Please check your connection and try again.`}
          action={{
            label: `Retry${retryCount > 1 ? ` (${retryCount})` : ''}`,
            onClick: loadDashboardData,
            variant: 'primary'
          }}
          size="lg"
        />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className="min-h-screen bg-black text-white"
    >
      {/* Skip to content link for screen readers */}
      <div id="main-content" className="sr-only">
        <h1>Financial Dashboard</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Good morning, Alex 👋</h1>
            <p className="text-white/60">
              {isLoading ? 'Loading your financial overview...' : 'Here\'s your financial overview'}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Refresh dashboard data"
            >
              <RefreshCw className={cn("w-5 h-5", isLoading && "animate-spin")} />
            </button>
            
            <button
              className="p-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Summary Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonCard key={index} className="h-32" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <SimpleGlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white/70 font-medium">Total Balance</h3>
                <button
                  onClick={toggleBalanceVisibility}
                  className="p-1 rounded hover:bg-white/[0.08] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  aria-label={balanceVisible ? 'Hide balance' : 'Show balance'}
                >
                  {balanceVisible ? (
                    <EyeOff className="w-4 h-4 text-white/60" />
                  ) : (
                    <Eye className="w-4 h-4 text-white/60" />
                  )}
                </button>
              </div>
              
              <div className="text-3xl font-bold text-white mb-2">
                {balanceVisible ? (
                  `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                ) : (
                  '••••••'
                )}
              </div>
              
              <div className="flex items-center text-green-400 text-sm">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +2.4% from last month
              </div>
            </SimpleGlassCard>

            <SimpleGlassCard className="p-6">
              <h3 className="text-white/70 font-medium mb-4">Monthly Income</h3>
              <div className="text-3xl font-bold text-white mb-2">
                {balanceVisible ? (
                  `$${monthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                ) : (
                  '••••••'
                )}
              </div>
              <div className="flex items-center text-green-400 text-sm">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +5.2% from last month
              </div>
            </SimpleGlassCard>

            <SimpleGlassCard className="p-6">
              <h3 className="text-white/70 font-medium mb-4">Monthly Expenses</h3>
              <div className="text-3xl font-bold text-white mb-2">
                {balanceVisible ? (
                  `$${monthlyExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                ) : (
                  '••••••'
                )}
              </div>
              <div className="flex items-center text-red-400 text-sm">
                <ArrowDownRight className="w-4 h-4 mr-1" />
                +1.8% from last month
              </div>
            </SimpleGlassCard>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Accounts */}
          <div className="lg:col-span-1">
            <SimpleGlassCard className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Accounts</h2>
              
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <SkeletonCard key={index} className="h-16" />
                  ))}
                </div>
              ) : accounts.length === 0 ? (
                <EmptyState
                  emoji="🏦"
                  title="No accounts connected"
                  description="Connect your bank accounts to see your financial overview."
                  action={{
                    label: 'Connect Account',
                    onClick: () => console.log('Connect account'),
                    variant: 'primary'
                  }}
                  size="sm"
                />
              ) : (
                <div className="space-y-4">
                  {accounts.map((account) => (
                    <AccountCard 
                      key={account.id}
                      account={account}
                      showBalance={balanceVisible}
                    />
                  ))}
                </div>
              )}
            </SimpleGlassCard>
          </div>

          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <SimpleGlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
                <button className="text-blue-400 hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400/50 rounded px-2 py-1">
                  View All
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  aria-label="Search transactions"
                />
              </div>

              {/* Transactions List */}
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <SkeletonTransaction key={index} />
                  ))}
                </div>
              ) : filteredTransactions.length === 0 ? (
                <EmptyState
                  icon={searchQuery ? Search : Plus}
                  title={searchQuery ? "No transactions found" : "No recent transactions"}
                  description={
                    searchQuery 
                      ? "Try adjusting your search terms to find transactions."
                      : "Your recent transactions will appear here."
                  }
                  action={
                    searchQuery 
                      ? {
                          label: 'Clear Search',
                          onClick: () => handleSearch(''),
                          variant: 'secondary'
                        }
                      : undefined
                  }
                  size="sm"
                />
              ) : (
                <div className="space-y-3">
                  {filteredTransactions.slice(0, 10).map((transaction) => (
                    <TransactionItem 
                      key={transaction.id}
                      transaction={transaction}
                      showBalance={balanceVisible}
                    />
                  ))}
                </div>
              )}
            </SimpleGlassCard>
          </div>
        </div>
      </div>

      {/* Live region for accessibility announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" />
    </div>
  );
};

export default CleanDashboard; 