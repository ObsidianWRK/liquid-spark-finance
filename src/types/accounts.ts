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