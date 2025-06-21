import React, { useState } from 'react';
import { UniversalCard } from '@/shared/ui/UniversalCard';
import { 
  Banknote, 
  Building2, 
  CreditCard, 
  TrendingUp, 
  PiggyBank 
} from 'lucide-react';
import { formatCurrency } from '@/shared/utils/formatters';
import { cn } from '@/shared/lib/utils';
import { mockInstitutions } from '@/services/mockData';
import { getAccounts } from '@/services/mockDataProvider';

interface MockAccount {
  id: string;
  institution: {
    name: string;
    id: string;
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
}

// Transform enhanced mock data to panel format
const transformMockAccounts = (accounts: ReturnType<typeof getAccounts>): MockAccount[] => {
  return accounts.map((account, index) => {
    const institutionName = account.institutionName || 'Chase Bank';
    const institutionData = institutionName in mockInstitutions 
      ? mockInstitutions[institutionName as keyof typeof mockInstitutions]
      : { color: '#004879' };
    
    // Map account subtypes to panel types
    let panelType: 'checking' | 'savings' | 'credit' | 'investment' = 'checking';
    if (account.accountSubtype === 'checking') panelType = 'checking';
    else if (account.accountSubtype === 'savings' || account.accountSubtype === 'cd') panelType = 'savings';
    else if (account.accountSubtype === 'credit_card' || account.accountSubtype === 'line_of_credit') panelType = 'credit';
    else if (account.accountSubtype === 'brokerage' || account.accountSubtype === '401k' || 
             account.accountSubtype === 'ira' || account.accountSubtype === 'roth_ira' || 
             account.accountSubtype === '529') panelType = 'investment';
    else if (account.accountType === 'loan' || account.accountSubtype === 'student' || account.accountSubtype === 'auto') panelType = 'credit';
    
    return {
      id: account.id,
      institution: {
        name: account.institutionName || 'Unknown Bank',
        id: `ins_${account.institutionName?.toLowerCase().replace(/\s+/g, '_')}`,
        color: institutionData?.color || '#004879',
      },
      type: panelType,
      name: account.name,
      mask: account.metadata?.accountNumber?.replace('****', '') || index.toString().padStart(4, '0'),
      balance: account.balance,
      availableBalance: account.availableBalance,
      currency: account.currency,
      isActive: account.isActive,
      creditLimit: account.metadata?.creditLimit,
      lastTransaction: {
        merchant: 'Recent Transaction',
        amount: account.metadata?.sparklineData?.[account.metadata.sparklineData.length - 1] || 0,
        date: new Date().toISOString(),
        pending: false,
      },
    };
  });
};

// Use accounts from provider with a small fallback when disabled
const MOCK_ACCOUNTS: MockAccount[] = (() => {
  const accs = transformMockAccounts(getAccounts());
  if (accs.length > 0) return accs;
  return [
      {
        id: 'acc_chase_checking_001',
        institution: {
          name: 'Chase Bank',
          id: 'ins_chase',
          color: '#004879',
        },
        type: 'checking',
        name: 'Chase Total Checking',
        mask: '4521',
        balance: 4250.75,
        availableBalance: 4250.75,
        currency: 'USD',
        isActive: true,
        lastTransaction: {
          merchant: 'Starbucks',
          amount: -5.67,
          date: '2024-01-15T09:30:00Z',
          pending: false,
        },
      },
      {
        id: 'acc_bofa_savings_001',
        institution: {
          name: 'Bank of America',
          id: 'ins_bofa',
          color: '#E31837',
        },
        type: 'savings',
        name: 'Advantage Savings',
        mask: '8932',
        balance: 15750.42,
        availableBalance: 15750.42,
        currency: 'USD',
        isActive: true,
        lastTransaction: {
          merchant: 'Interest Payment',
          amount: 18.25,
          date: '2024-01-01T00:00:00Z',
          pending: false,
        },
      },
      {
        id: 'acc_wells_credit_001',
        institution: {
          name: 'Wells Fargo',
          id: 'ins_wells',
          color: '#D50032',
        },
        type: 'credit',
        name: 'Cash Wise Visa',
        mask: '1847',
        balance: -1285.63,
        availableBalance: 3714.37,
        currency: 'USD',
        isActive: true,
        creditLimit: 5000.0,
        lastTransaction: {
          merchant: 'Amazon',
          amount: -89.99,
          date: '2024-01-14T14:22:00Z',
          pending: true,
        },
      }
    ];
})();

const VISIBLE_COUNT = 5;

export const BankLinkingPanel: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
      case 'savings':
        return <Building2 className="w-3 h-3 text-blue-400" />;
      case 'credit':
        return <CreditCard className="w-3 h-3 text-orange-400" />;
      case 'investment':
        return <TrendingUp className="w-3 h-3 text-green-400" />;
      default:
        return <PiggyBank className="w-3 h-3 text-purple-400" />;
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
    return MOCK_ACCOUNTS.reduce((total, account) => {
      if (account.type === 'credit') {
        // Credit cards subtract from net worth
        return total + account.balance; // balance is already negative
      }
      return total + account.balance;
    }, 0);
  };

  const visibleAccounts = expanded
    ? MOCK_ACCOUNTS
    : MOCK_ACCOUNTS.slice(0, VISIBLE_COUNT);

  return (
    <div className="bg-white/[0.02] rounded-vueni-lg border border-white/[0.08] p-4 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300 hover:scale-[1.02] cursor-pointer">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-vueni-lg bg-blue-500/20 flex items-center justify-center">
          <Banknote className="w-4 h-4 text-blue-400" />
        </div>
        <h3 className="font-medium text-white/80 text-sm">Linked Bank Accounts</h3>
      </div>

      {/* Account Summary - Compact */}
      <div className="flex items-center justify-between p-2 bg-white/[0.03] rounded-vueni-lg border border-white/[0.05] mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/70">Connected</span>
          <span className="text-xs px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded-vueni-pill">
            {MOCK_ACCOUNTS.length}
          </span>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/60">Net Worth</p>
          <p className={cn(
            'text-xs font-semibold',
            calculateNetWorth() >= 0 ? 'text-green-400' : 'text-red-400'
          )}>
            {formatCurrency(calculateNetWorth())}
          </p>
        </div>
      </div>

      {/* Scrollable Account List - Show only 5 accounts initially */}
      <div className="max-h-32 overflow-y-auto space-y-1 mb-3 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-white/5">
        {visibleAccounts.map((account) => (
          <div
            key={account.id}
            className="pfm-row justify-between px-1.5 bg-white/[0.02] rounded-vueni-lg border border-white/[0.05] hover:bg-white/[0.04] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-vueni-lg bg-white/[0.05] flex items-center justify-center">
                {getAccountIcon(account.type)}
              </div>
              <div>
                <p className="text-xs font-medium text-white">
                  {account.institution.name}
                </p>
                <div className="flex items-center gap-1">
                  <p className="text-xs text-white/60">****{account.mask}</p>
                  <span className="text-xs px-1 py-0.5 rounded bg-white/[0.05] text-white/70">
                    {getAccountTypeLabel(account.type)}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className={cn('text-xs font-bold', getBalanceColor(account))}>
                {formatCurrency(account.balance)}
              </p>
            </div>
          </div>
        ))}
        {!expanded && MOCK_ACCOUNTS.length > VISIBLE_COUNT && (
          <div
            className="flex items-center justify-center p-1.5 bg-white/[0.02] rounded-vueni-lg border border-white/[0.05] hover:bg-white/[0.04] transition-all cursor-pointer text-xs text-white/70"
            onClick={() => setExpanded(true)}
          >
            Show all accounts
          </div>
        )}
      </div>

      {/* Add Account Action - Compact */}
      <button className="w-full p-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-vueni-lg text-blue-400 text-xs font-medium transition-colors flex items-center justify-center gap-2">
        <Banknote className="w-3 h-3" />
        Link Additional Account
      </button>


    </div>
  );
};
