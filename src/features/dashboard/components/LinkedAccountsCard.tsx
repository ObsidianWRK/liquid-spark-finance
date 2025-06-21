import React, { useState, useEffect } from 'react';
import {
  Building2,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Plus,
  RefreshCw,
  Banknote,
  CheckCircle,
  University,
  GraduationCap,
  Landmark,
  Car,
} from 'lucide-react';
import { CardSkeleton } from './health/CardSkeleton';
import { formatCurrency } from '@/shared/utils/formatters';
import { cn } from '@/shared/lib/utils';
import { mockAccountsEnhanced } from '@/services/mockData';

interface MockAccount {
  id: string;
  name: string;
  institutionName: string;
  accountType: string;
  accountSubtype: string;
  balance: number;
  availableBalance: number;
  currency: string;
  isActive: boolean;
  metadata?: {
    accountNumber?: string;
    creditLimit?: number;
    apy?: number;
    fees?: any[];
    sparklineData?: number[];
  };
}

interface LinkedAccountsCardProps {
  className?: string;
  compact?: boolean;
  onAddAccount?: () => void;
}

// Transform the enhanced mock data to our component format
const transformMockAccounts = (): MockAccount[] => {
  return mockAccountsEnhanced.map((account) => ({
    id: account.id,
    name: account.name,
    institutionName: account.institutionName || 'Unknown Bank',
    accountType: account.accountType,
    accountSubtype: account.accountSubtype,
    balance: account.balance,
    availableBalance: account.availableBalance,
    currency: account.currency,
    isActive: account.isActive,
    metadata: account.metadata,
  }));
};

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
      import.meta.env.VITE_USE_MOCK_ACCOUNTS === 'true' ||
      import.meta.env.VITE_USE_MOCKS === 'true' ||
      process.env.NEXT_PUBLIC_USE_MOCKS === 'true' ||
      window.location.search.includes('mock=true') ||
      import.meta.env.DEV || // Always show in development
      true; // Always show for staging/demo

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
        await new Promise((resolve) => setTimeout(resolve, 500));

        const transformedAccounts = transformMockAccounts();
        setAccounts(transformedAccounts);
      } catch (err) {
        console.error('Failed to load mock accounts:', err);
        setError('Failed to load accounts');
      } finally {
        setLoading(false);
      }
    };

    loadMockAccounts();
  }, [useMocks]);

  const getAccountIcon = (accountType: string, accountSubtype: string) => {
    // Handle by subtype first for more specific icons
    switch (accountSubtype) {
      case 'checking':
        return <Building2 className="w-5 h-5 text-blue-400" />;
      case 'savings':
        return <PiggyBank className="w-5 h-5 text-green-400" />;
      case 'credit_card':
        return <CreditCard className="w-5 h-5 text-orange-400" />;
      case 'line_of_credit':
        return <CreditCard className="w-5 h-5 text-orange-300" />;
      case 'brokerage':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case '401k':
      case 'ira':
      case 'roth_ira':
        return <University className="w-5 h-5 text-purple-400" />;
      case '529':
        return <GraduationCap className="w-5 h-5 text-indigo-400" />;
      case 'cd':
        return <Landmark className="w-5 h-5 text-blue-300" />;
      case 'student':
        return <GraduationCap className="w-5 h-5 text-red-400" />;
      case 'auto':
        return <Car className="w-5 h-5 text-red-400" />;
      default:
        // Fall back to account type
        switch (accountType) {
          case 'depository':
            return <Building2 className="w-5 h-5 text-blue-400" />;
          case 'credit':
            return <CreditCard className="w-5 h-5 text-orange-400" />;
          case 'investment':
            return <TrendingUp className="w-5 h-5 text-green-400" />;
          case 'loan':
            return <Landmark className="w-5 h-5 text-red-400" />;
          default:
            return <PiggyBank className="w-5 h-5 text-purple-400" />;
        }
    }
  };

  const getAccountTypeLabel = (accountType: string, accountSubtype: string) => {
    switch (accountSubtype) {
      case 'checking':
        return 'Checking';
      case 'savings':
        return 'Savings';
      case 'credit_card':
        return 'Credit Card';
      case 'line_of_credit':
        return 'Line of Credit';
      case 'brokerage':
        return 'Brokerage';
      case '401k':
        return '401(k)';
      case 'ira':
        return 'IRA';
      case 'roth_ira':
        return 'Roth IRA';
      case '529':
        return '529 Plan';
      case 'cd':
        return 'Certificate of Deposit';
      case 'student':
        return 'Student Loan';
      case 'auto':
        return 'Auto Loan';
      default:
        return accountType.charAt(0).toUpperCase() + accountType.slice(1);
    }
  };

  const getBalanceColor = (account: MockAccount) => {
    const isDebt = account.accountType === 'credit' || account.accountType === 'loan';
    
    if (isDebt) {
      // For debt accounts: closer to zero is better
      return account.balance >= 0 ? 'text-red-400' : 'text-green-400';
    }
    // For asset accounts: positive balance is good
    return account.balance > 0 ? 'text-green-400' : 'text-red-400';
  };

  const calculateNetWorth = () => {
    return accounts.reduce((total, account) => {
      const isDebt = account.accountType === 'credit' || account.accountType === 'loan';
      
      if (isDebt) {
        // Debt subtracts from net worth (balance is typically negative for debt)
        return total + account.balance;
      }
      // Assets add to net worth
      return total + account.balance;
    }, 0);
  };

  const getLastFourDigits = (account: MockAccount) => {
    if (account.metadata?.accountNumber) {
      return account.metadata.accountNumber.replace('****', '');
    }
    // Generate consistent last 4 digits based on account ID
    const hash = account.id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return Math.abs(hash).toString().slice(-4).padStart(4, '0');
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
            Add ?mock=true to URL or set VITE_USE_MOCK_ACCOUNTS=true
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
          <p className="text-sm text-white/60">{error}</p>
        </div>
      </CardSkeleton>
    );
  }

  // Compact view
  if (compact) {
    return (
      <CardSkeleton variant="compact" className={className}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            <span className="font-semibold text-white">Linked Accounts</span>
          </div>
          <span className="text-sm text-white/60">
            {accounts.length} accounts
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-white/70">Connected</span>
            <span className="text-sm font-semibold text-green-400">
              {accounts.length}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-white/70">Net Worth</span>
            <span
              className={cn(
                'text-sm font-semibold',
                calculateNetWorth() >= 0 ? 'text-green-400' : 'text-red-400'
              )}
            >
              {formatCurrency(calculateNetWorth())}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {accounts.slice(0, 6).map((account) => (
              <div
                key={account.id}
                className="flex items-center space-x-2 p-2 bg-white/[0.03] rounded-lg"
              >
                {getAccountIcon(account.accountType, account.accountSubtype)}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/80 truncate">
                    {account.institutionName}
                  </p>
                  <p className="text-xs text-white/60">•••• {getLastFourDigits(account)}</p>
                </div>
              </div>
            ))}
          </div>

          {accounts.length > 6 && (
            <p className="text-xs text-white/60 text-center">
              +{accounts.length - 6} more accounts
            </p>
          )}
        </div>
      </CardSkeleton>
    );
  }

  // Full view with scrollable list
  return (
    <div
      className={cn(
        'bg-white/[0.02] rounded-2xl border border-white/[0.08] p-6 card-hover-subtle',
        className
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center">
            <Banknote className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="font-medium text-white/80">Linked Bank Accounts</h3>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/60">Connected</span>
            <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-lg text-sm font-medium">
              {accounts.length}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4 p-4 bg-white/[0.03] rounded-xl border border-white/[0.05]">
        <div className="flex justify-between items-center">
          <span className="font-medium text-white/80">Net Worth</span>
          <span
            className={cn(
              'text-xl font-bold',
              calculateNetWorth() >= 0 ? 'text-green-400' : 'text-red-400'
            )}
          >
            {formatCurrency(calculateNetWorth())}
          </span>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/[0.05] hover:bg-white/[0.05] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center">
                {getAccountIcon(account.accountType, account.accountSubtype)}
              </div>
              <div>
                <p className="font-medium text-white">{account.institutionName}</p>
                <p className="text-sm text-white/70">{account.name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-white/60">****{getLastFourDigits(account)}</p>
                  <span className="text-xs px-2 py-1 rounded-lg bg-white/[0.05] text-white/70">
                    {getAccountTypeLabel(account.accountType, account.accountSubtype)}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className={cn('font-bold', getBalanceColor(account))}>
                {formatCurrency(account.balance)}
              </p>
              {account.metadata?.creditLimit && (
                <p className="text-xs text-white/60">
                  Limit: {formatCurrency(account.metadata.creditLimit)}
                </p>
              )}
              {account.metadata?.apy && (
                <p className="text-xs text-white/60">
                  APY: {(account.metadata.apy * 100).toFixed(2)}%
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {onAddAccount && (
        <button
          onClick={onAddAccount}
          className="w-full mt-4 p-3 border-2 border-dashed border-white/[0.15] rounded-xl text-white/60 hover:text-white/80 hover:border-white/[0.25] transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Link Additional Account
        </button>
      )}
    </div>
  );
};
