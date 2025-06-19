import React, { useState, useEffect } from 'react';
import { Building2, CreditCard, PiggyBank, TrendingUp, Plus, RefreshCw } from 'lucide-react';
import { CardSkeleton } from './health/CardSkeleton';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface MockAccount {
  id: string;
  institution: {
    name: string;
    id: string;
    logo?: string;
    color: string;
  };
  type: 'checking' | 'savings' | 'credit' | 'investment';
  name: string;
  mask: string;
  balance: number;
  availableBalance: number;
  currency: string;
  isActive: boolean;
  creditLimit?: number;
  lastTransaction?: {
    merchant: string;
    amount: number;
    date: string;
    pending: boolean;
  };
  metadata?: Record<string, any>;
}

interface LinkedAccountsCardProps {
  className?: string;
  compact?: boolean;
  onAddAccount?: () => void;
}

// Mock data directly in component to avoid fetch issues
const MOCK_ACCOUNTS: MockAccount[] = [
  {
    id: "acc_chase_checking_001",
    institution: {
      name: "Chase Bank",
      id: "ins_chase",
      color: "#004879"
    },
    type: "checking",
    name: "Chase Total Checking",
    mask: "4521",
    balance: 4250.75,
    availableBalance: 4250.75,
    currency: "USD",
    isActive: true,
    lastTransaction: {
      merchant: "Starbucks",
      amount: -5.67,
      date: "2024-01-15T09:30:00Z",
      pending: false
    }
  },
  {
    id: "acc_bofa_savings_001",
    institution: {
      name: "Bank of America",
      id: "ins_bofa",
      color: "#E31837"
    },
    type: "savings",
    name: "Advantage Savings",
    mask: "8932",
    balance: 15750.42,
    availableBalance: 15750.42,
    currency: "USD",
    isActive: true,
    lastTransaction: {
      merchant: "Interest Payment",
      amount: 18.25,
      date: "2024-01-01T00:00:00Z",
      pending: false
    }
  },
  {
    id: "acc_wells_credit_001", 
    institution: {
      name: "Wells Fargo",
      id: "ins_wells",
      color: "#D50032"
    },
    type: "credit",
    name: "Cash Wise Visa",
    mask: "1847",
    balance: -1285.63,
    availableBalance: 3714.37,
    currency: "USD",
    isActive: true,
    creditLimit: 5000.00,
    lastTransaction: {
      merchant: "Amazon",
      amount: -89.99,
      date: "2024-01-14T14:22:00Z",
      pending: true
    }
  },
  {
    id: "acc_schwab_investment_001",
    institution: {
      name: "Charles Schwab",
      id: "ins_schwab",
      color: "#00A0DF"
    },
    type: "investment",
    name: "Brokerage Account",
    mask: "7409",
    balance: 42850.19,
    availableBalance: 1250.00,
    currency: "USD",
    isActive: true,
    lastTransaction: {
      merchant: "VTSAX Purchase",
      amount: -1000.00,
      date: "2024-01-12T16:00:00Z",
      pending: false
    }
  },
  {
    id: "acc_citi_credit_001",
    institution: {
      name: "Citibank",
      id: "ins_citi",
      color: "#DC143C"
    },
    type: "credit",
    name: "Double Cash Card",
    mask: "2156",
    balance: -567.23,
    availableBalance: 2432.77,
    currency: "USD", 
    isActive: true,
    creditLimit: 3000.00,
    lastTransaction: {
      merchant: "Whole Foods",
      amount: -127.45,
      date: "2024-01-13T18:45:00Z",
      pending: false
    }
  }
];

export const LinkedAccountsCard: React.FC<LinkedAccountsCardProps> = ({
  className,
  compact = false,
  onAddAccount,
}) => {
  const [accounts, setAccounts] = useState<MockAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMocks, setUseMocks] = useState(false);

  // Check if we should use mock data
  useEffect(() => {
    const shouldUseMocks = 
      import.meta.env.VITE_USE_MOCKS === 'true' || 
      process.env.NEXT_PUBLIC_USE_MOCKS === 'true' ||
      window.location.search.includes('mock=true');
    
    setUseMocks(shouldUseMocks);
  }, []);

  // Load accounts data
  useEffect(() => {
    if (!useMocks) {
      setLoading(false);
      return;
    }

    const loadMockAccounts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setAccounts(MOCK_ACCOUNTS);
      } catch (err) {
        console.error('Failed to load mock accounts:', err);
        setError('Failed to load accounts');
      } finally {
        setLoading(false);
      }
    };

    loadMockAccounts();
  }, [useMocks]);

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
      case 'savings':
        return <Building2 className="w-5 h-5 text-blue-400" />;
      case 'credit':
        return <CreditCard className="w-5 h-5 text-orange-400" />;
      case 'investment':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      default:
        return <PiggyBank className="w-5 h-5 text-purple-400" />;
    }
  };

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case 'checking':
        return 'Checking';
      case 'savings':
        return 'Savings';
      case 'credit':
        return 'Credit Card';
      case 'investment':
        return 'Investment';
      default:
        return 'Account';
    }
  };

  const getBalanceColor = (account: MockAccount) => {
    if (account.type === 'credit') {
      // Credit cards: negative balance is good
      return account.balance > 0 ? 'text-red-400' : 'text-green-400';
    }
    // Other accounts: positive balance is good
    return account.balance > 0 ? 'text-green-400' : 'text-red-400';
  };

  const calculateNetWorth = () => {
    return accounts.reduce((total, account) => {
      if (account.type === 'credit') {
        // Credit cards subtract from net worth
        return total + account.balance; // balance is already negative
      }
      return total + account.balance;
    }, 0);
  };

  // Show loading skeleton
  if (loading) {
    return (
      <CardSkeleton 
        variant={compact ? 'compact' : 'default'}
        className={className}
        loading
      />
    );
  }

  // Show empty state if not using mocks
  if (!useMocks) {
    return (
      <CardSkeleton 
        variant={compact ? 'compact' : 'default'}
        className={className}
      >
        <div className="text-center py-8">
          <Building2 className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white/70 mb-2">
            No Linked Accounts
          </h3>
          <p className="text-sm text-white/50 mb-4">
            Enable mock mode to see sample accounts
          </p>
          <p className="text-xs text-white/40">
            Add ?mock=true to URL or set VITE_USE_MOCKS=true
          </p>
        </div>
      </CardSkeleton>
    );
  }

  // Show error state
  if (error) {
    return (
      <CardSkeleton 
        variant={compact ? 'compact' : 'default'}
        className={className}
      >
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-red-400 mb-2">
            Failed to Load Accounts
          </h3>
          <p className="text-sm text-white/60">
            {error}
          </p>
        </div>
      </CardSkeleton>
    );
  }

  // Compact view
  if (compact) {
    return (
      <CardSkeleton 
        variant="compact"
        className={className}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            <span className="font-semibold text-white">Linked Accounts</span>
          </div>
          <span className="text-sm text-white/60">{accounts.length} accounts</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-white/70">Net Worth</span>
            <span className={cn(
              'text-sm font-semibold',
              calculateNetWorth() >= 0 ? 'text-green-400' : 'text-red-400'
            )}>
              {formatCurrency(calculateNetWorth())}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {accounts.slice(0, 4).map((account) => (
              <div 
                key={account.id}
                className="flex items-center space-x-2 p-2 bg-white/[0.03] rounded-lg"
              >
                {getAccountIcon(account.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/80 truncate">
                    {account.institution.name}
                  </p>
                  <p className="text-xs text-white/60">
                    •••• {account.mask}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {accounts.length > 4 && (
            <p className="text-xs text-white/60 text-center">
              +{accounts.length - 4} more accounts
            </p>
          )}
        </div>
      </CardSkeleton>
    );
  }

  // Full view
  return (
    <CardSkeleton 
      variant="default"
      className={className}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Building2 className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-white">Linked Bank Accounts</h3>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-sm text-white/60">
            {accounts.length} accounts • Mock Mode
          </span>
          {onAddAccount && (
            <button
              onClick={onAddAccount}
              className="flex items-center space-x-1 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add Account</span>
            </button>
          )}
        </div>
      </div>

      {/* Net Worth Summary */}
      <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-white/10 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/70">Total Net Worth</p>
            <p className={cn(
              'text-2xl font-bold',
              calculateNetWorth() >= 0 ? 'text-green-400' : 'text-red-400'
            )}>
              {formatCurrency(calculateNetWorth())}
            </p>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-white/70">Accounts</p>
            <div className="flex items-center space-x-1">
              <span className="text-lg font-semibold text-white">{accounts.length}</span>
              <span className="text-sm text-white/60">linked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accounts List */}
      <div className="space-y-3">
        {accounts.map((account) => (
          <div 
            key={account.id}
            className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:bg-white/[0.05] transition-colors account-item"
            data-testid="account-card"
          >
            <div className="flex items-center space-x-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${account.institution.color}20` }}
              >
                {getAccountIcon(account.type)}
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold text-white">{account.name}</h4>
                  <span className="text-xs text-white/60 bg-white/10 px-2 py-0.5 rounded">
                    {getAccountTypeLabel(account.type)}
                  </span>
                </div>
                <p className="text-sm text-white/70">
                  {account.institution.name} • •••• {account.mask}
                </p>
                
                {account.lastTransaction && (
                  <p className="text-xs text-white/60 mt-1">
                    Last: {account.lastTransaction.merchant} • {formatCurrency(Math.abs(account.lastTransaction.amount))}
                  </p>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <p className={cn('text-lg font-semibold', getBalanceColor(account))}>
                {formatCurrency(Math.abs(account.balance))}
              </p>
              
              {account.type === 'credit' && account.creditLimit && (
                <p className="text-xs text-white/60">
                  {formatCurrency(account.availableBalance)} available
                </p>
              )}
              
              {account.type !== 'credit' && (
                <p className="text-xs text-white/60">
                  {account.currency}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <p className="text-xs text-white/60 text-center">
          🚀 Demo Mode: Using mock account data • Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </CardSkeleton>
  );
}; 