export interface Account {
  id: string;
  familyId: string;
  name: string;
  accountType: AccountType;
  accountSubtype: AccountSubtype;
  institutionId?: string;
  institutionName?: string;
  externalAccountId?: string;
  balance: number;
  availableBalance?: number;
  currency: string;
  isActive: boolean;
  isManual: boolean;
  lastSyncAt?: Date;
  syncStatus: SyncStatus;
  metadata: AccountMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export type AccountType = 
  | 'depository'   // Checking, Savings, Money Market
  | 'credit'       // Credit Cards, Lines of Credit
  | 'loan'         // Personal, Auto, Student, Mortgage
  | 'investment'   // Brokerage, IRA, 401k, etc.
  | 'insurance'    // Life, Auto, Health, etc.
  | 'property'     // Real Estate, Vehicles
  | 'crypto'       // Cryptocurrency wallets
  | 'other';       // Catch-all

export type AccountSubtype = 
  // Depository
  | 'checking' | 'savings' | 'money_market' | 'cd' | 'treasury'
  // Credit
  | 'credit_card' | 'line_of_credit' | 'heloc'
  // Loan
  | 'mortgage' | 'auto_loan' | 'student_loan' | 'personal_loan'
  // Investment
  | 'brokerage' | 'ira' | 'roth_ira' | '401k' | '403b' | 'pension' | 'annuity'
  // Insurance
  | 'life_insurance' | 'auto_insurance' | 'health_insurance' | 'disability_insurance'
  // Property
  | 'real_estate' | 'vehicle' | 'collectible' | 'artwork'
  // Crypto
  | 'bitcoin' | 'ethereum' | 'crypto_exchange' | 'defi_wallet'
  // Other
  | 'cash' | 'precious_metals' | 'business' | 'trust';

export type SyncStatus = 'active' | 'inactive' | 'error' | 'pending' | 'manual';

// Transaction interface for type safety
export interface Transaction {
  id: string;
  amount: number;
  date: string;
  merchant: string;
  status: 'completed' | 'pending' | 'failed';
  category?: string;
  description?: string;
}

export interface AccountMetadata {
  plaidAccountId?: string;
  tellerAccountId?: string;
  routingNumber?: string;
  accountNumber?: string; // Encrypted/masked
  interestRate?: number;
  creditLimit?: number;
  minimumPayment?: number;
  dueDate?: string;
  term?: number;
  maturityDate?: Date;
  apy?: number;
  fees?: AccountFee[];
  tags?: string[];
  notes?: string;
}

export interface AccountFee {
  type: 'monthly' | 'annual' | 'transaction' | 'overdraft' | 'atm' | 'other';
  amount: number;
  description: string;
}

export interface Institution {
  id: string;
  name: string;
  logo?: string;
  url?: string;
  primaryColor?: string;
  loginUrl?: string;
  supportPhone?: string;
  supportEmail?: string;
  plaidInstitutionId?: string;
  tellerInstitutionId?: string;
  isActive: boolean;
  capabilities: InstitutionCapabilities;
}

export interface InstitutionCapabilities {
  accounts: boolean;
  transactions: boolean;
  investments: boolean;
  liabilities: boolean;
  identity: boolean;
  auth: boolean;
  realTimeUpdates: boolean;
}

export interface AccountConnection {
  id: string;
  familyId: string;
  institutionId: string;
  provider: 'plaid' | 'teller' | 'manual';
  accessToken?: string; // Encrypted
  itemId?: string;
  accounts: string[]; // Account IDs
  status: 'active' | 'error' | 'requires_reauth' | 'disconnected';
  error?: ConnectionError;
  lastSyncAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConnectionError {
  code: string;
  message: string;
  resolution?: string;
  timestamp: Date;
}

export interface AccountBalance {
  accountId: string;
  balance: number;
  availableBalance?: number;
  currency: string;
  asOfDate: Date;
  balanceType: 'current' | 'available' | 'limit';
}

export interface AccountPerformance {
  accountId: string;
  period: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'ytd' | 'all';
  startBalance: number;
  endBalance: number;
  totalReturn: number;
  totalReturnPercentage: number;
  deposits: number;
  withdrawals: number;
  fees: number;
  interest: number;
  dividends: number;
  unrealizedGains: number;
  realizedGains: number;
}

// Enterprise Account Card DTO - Optimized for compact display
export interface AccountCardDTO {
  // Core Identity
  id: string;
  institution: {
    name: string;           // "Chase", "Bank of America", "Wells Fargo"
    logo?: string;          // Institution logo URL
    color?: string;         // Brand color for accents
    percentChange30d?: number; // Balance change vs 30 days (%)
    category?: 'CHECKING' | 'SAVINGS' | 'CREDIT' | 'INVESTMENT';
    utilPercent?: number;      // For credit cards
  };
  
  // Account Details
  accountType: 'Checking' | 'Savings' | 'Credit Card' | 'Investment' | 'Loan';
  accountName: string;      // "Main Checking", "Rewards Card", etc.
  last4: string;           // Last 4 digits for identification
  
  // Financial Data
  currentBalance: number;
  availableBalance?: number;  // Different from current for credit cards
  currency: string;
  
  // Smart Insights (Fortune 500 Standard)
  lastTransaction?: {
    merchant: string;       // "Starbucks"
    amount: number;        // -5.67
    date: string;          // "Dec 15"
    pending?: boolean;
  };
  
  // Contextual Metrics
  pendingCount?: number;     // Number of pending transactions
  interestApy?: number;      // For savings accounts
  creditUtilization?: number; // For credit cards (0-100%)
  monthlySpend?: number;     // Current month spending
  spendDelta?: {            // vs last month
    amount: number;
    percentage: number;
    trend: 'up' | 'down' | 'stable';
  };
  
  // Status & Alerts
  alerts?: Array<{
    type: 'low_balance' | 'unusual_spending' | 'payment_due' | 'fraud_alert';
    message: string;
    severity: 'info' | 'warning' | 'critical';
  }>;
  
  // Quick Actions (Enterprise Standard)
  quickActions?: Array<{
    type: 'transfer' | 'pay' | 'deposit' | 'pay_bill';
    label: string;
    enabled: boolean;
  }>;

  // New UI fields
  category?: 'CHECKING' | 'SAVINGS' | 'CREDIT' | 'INVESTMENT';
  percentChange30d?: number;
  utilPercent?: number;
}

// Helper function to transform Account to AccountCardDTO
export function accountToCardDTO(
  account: Account, 
  transactions: Transaction[] = [],
  institutionData?: { name: string; logo?: string; color?: string }
): AccountCardDTO {
  const recentTransaction = transactions
    .filter(t => t.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
  const pendingTransactions = transactions.filter(t => t.status === 'pending');
  
  const monthlySpending = transactions
    .filter(t => {
      const txDate = new Date(t.date);
      const now = new Date();
      return txDate.getMonth() === now.getMonth() && 
             txDate.getFullYear() === now.getFullYear() &&
             t.amount < 0;
    })
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return {
    id: account.id,
    institution: institutionData || {
      name: account.institutionName || 'Unknown Bank',
      color: '#6366f1'
    },
    accountType: mapAccountType(account.accountType, account.accountSubtype),
    accountName: account.name || 'Account',
    last4: account.metadata?.accountNumber?.slice(-4) || '0000',
    currentBalance: account.balance,
    availableBalance: account.availableBalance,
    currency: account.currency,
    lastTransaction: recentTransaction ? {
      merchant: recentTransaction.merchant,
      amount: recentTransaction.amount,
      date: formatTransactionDate(recentTransaction.date),
      pending: false
    } : undefined,
    pendingCount: pendingTransactions.length,
    interestApy: account.metadata?.apy,
    creditUtilization: calculateCreditUtilization(account),
    monthlySpend: monthlySpending,
    spendDelta: calculateSpendDelta(transactions),
    alerts: generateSmartAlerts(account, transactions),
    quickActions: getQuickActions(account.accountType),
    category: account.accountType === 'depository' ? 'CHECKING' : account.accountType === 'credit' ? 'CREDIT' : account.accountType === 'investment' ? 'INVESTMENT' : undefined,
    // Approximate 30-day change using spending delta (negative => down)
    percentChange30d: (() => {
      const delta = calculateSpendDelta(transactions);
      if (!delta) return undefined;
      return delta.trend === 'up' ? -delta.percentage : delta.percentage;
    })(),
    utilPercent: account.accountType === 'credit' ? calculateCreditUtilization(account) : undefined
  };
}

function mapAccountType(type: AccountType, subtype?: AccountSubtype): AccountCardDTO['accountType'] {
  if (type === 'depository') {
    return subtype === 'savings' ? 'Savings' : 'Checking';
  }
  if (type === 'credit') return 'Credit Card';
  if (type === 'investment') return 'Investment';
  if (type === 'loan') return 'Loan';
  return 'Checking';
}

function formatTransactionDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function calculateCreditUtilization(account: Account): number | undefined {
  if (account.accountType !== 'credit') return undefined;
  const limit = account.metadata?.creditLimit;
  if (!limit) return undefined;
  const used = Math.abs(account.balance);
  return Math.round((used / limit) * 100);
}

function calculateSpendDelta(transactions: Transaction[]): AccountCardDTO['spendDelta'] {
  const now = new Date();
  const thisMonth = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && t.amount < 0;
  }).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const lastMonth = transactions.filter(t => {
    const d = new Date(t.date);
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
    return d.getMonth() === lastMonthDate.getMonth() && 
           d.getFullYear() === lastMonthDate.getFullYear() && t.amount < 0;
  }).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  if (lastMonth === 0) return undefined;
  
  const difference = thisMonth - lastMonth;
  const percentage = Math.round((difference / lastMonth) * 100);
  
  return {
    amount: difference,
    percentage: Math.abs(percentage),
    trend: difference > 0 ? 'up' : difference < 0 ? 'down' : 'stable'
  };
}

function generateSmartAlerts(account: Account, transactions: Transaction[]): AccountCardDTO['alerts'] {
  const alerts: AccountCardDTO['alerts'] = [];
  
  // Low balance alert
  if (account.accountType === 'depository' && account.balance < 100) {
    alerts.push({
      type: 'low_balance',
      message: 'Low balance',
      severity: 'warning'
    });
  }
  
  // High utilization alert
  const utilization = calculateCreditUtilization(account);
  if (utilization && utilization > 80) {
    alerts.push({
      type: 'unusual_spending',
      message: 'High utilization',
      severity: 'warning'
    });
  }
  
  return alerts;
}

function getQuickActions(accountType: AccountType): AccountCardDTO['quickActions'] {
  const baseActions: Array<{
    type: 'transfer' | 'pay' | 'deposit' | 'pay_bill';
    label: string;
    enabled: boolean;
  }> = [
    { type: 'transfer', label: 'Transfer', enabled: true },
    { type: 'pay', label: 'Pay', enabled: true }
  ];
  
  if (accountType === 'depository') {
    baseActions.push({ type: 'deposit', label: 'Deposit', enabled: true });
  }
  
  return baseActions;
}