// CC: Data transformation utilities for Smart Accounts Deck
import { AccountRowData } from '@/components/AccountDeck/AccountRow';
import { mockAccountsEnhanced, mockInstitutions } from '@/services/mockData';

// CC: Transform account data to AccountRowData format for Smart Accounts Deck
export const transformToAccountRowData = (): AccountRowData[] => {
  return mockAccountsEnhanced.map((account, index) => {
    // CC: Calculate realistic percentage delta for each account
    const sparklineData = account.metadata?.sparklineData || [];
    const deltaPercentage = sparklineData.length >= 2 
      ? ((sparklineData[sparklineData.length - 1] - sparklineData[sparklineData.length - 2]) / Math.abs(sparklineData[sparklineData.length - 2])) * 100
      : (Math.random() - 0.5) * 10; // Random delta if no sparkline data

    // CC: Get institution data with fallback
    const institution = mockInstitutions[account.institutionName] || {
      name: account.institutionName,
      color: '#6366f1',
      logo: undefined
    };

    // CC: Extract last 4 digits from account number
    const last4 = account.metadata?.accountNumber?.slice(-4) || '0000';

    // CC: Format account type for display
    const accountType = formatAccountType(account.accountType, account.accountSubtype);

    return {
      id: account.id,
      name: account.name,
      institution,
      balance: account.balance,
      currency: account.currency,
      sparklineData: sparklineData,
      deltaPercentage: Number(deltaPercentage.toFixed(2)),
      accountType,
      last4
    };
  });
};

// CC: Format account type and subtype for display
const formatAccountType = (accountType: string, accountSubtype?: string): string => {
  const typeMap: Record<string, string> = {
    'depository': 'Deposit',
    'credit': 'Credit',
    'loan': 'Loan',
    'investment': 'Investment'
  };

  const subtypeMap: Record<string, string> = {
    'checking': 'Checking',
    'savings': 'Savings',
    'cd': 'Certificate of Deposit',
    'credit_card': 'Credit Card',
    'line_of_credit': 'Line of Credit',
    'brokerage': 'Brokerage',
    '401k': '401(k)',
    'ira': 'IRA',
    'roth_ira': 'Roth IRA',
    '529': '529 Plan',
    'student': 'Student Loan',
    'auto': 'Auto Loan'
  };

  if (accountSubtype && subtypeMap[accountSubtype]) {
    return subtypeMap[accountSubtype];
  }

  return typeMap[accountType] || accountType;
};

// CC: Get total account balance for Smart Accounts header
export const getTotalAccountBalance = (): number => {
  return mockAccountsEnhanced.reduce((total, account) => {
    // CC: Only count positive balances (assets, not liabilities)
    return total + (account.balance > 0 ? account.balance : 0);
  }, 0);
}; 