export interface Transaction {
  id: string;
  accountId: string;
  familyId: string;
  externalTransactionId?: string;
  amount: number;
  currency: string;
  date: Date;
  authorizedDate?: Date;
  merchantName?: string;
  description: string;
  category: TransactionCategory;
  subcategory?: string;
  paymentChannel: PaymentChannel;
  transactionType: TransactionType;
  status: TransactionStatus;
  isPending: boolean;
  isRecurring: boolean;
  recurrenceRule?: RecurrenceRule;
  location?: TransactionLocation;
  metadata: TransactionMetadata;
  tags: string[];
  notes?: string;
  excludeFromBudget: boolean;
  isTransfer: boolean;
  transferAccountId?: string;
  transferTransactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TransactionCategory = 
  | 'income'
  | 'housing'
  | 'transportation'
  | 'food'
  | 'utilities'
  | 'insurance'
  | 'healthcare'
  | 'savings'
  | 'debt_payments'
  | 'entertainment'
  | 'personal_care'
  | 'shopping'
  | 'education'
  | 'gifts_donations'
  | 'business'
  | 'taxes'
  | 'investments'
  | 'fees'
  | 'transfers'
  | 'other';

export type PaymentChannel = 
  | 'online' | 'in_store' | 'atm' | 'phone' | 'mail' | 'mobile' | 'other';

export type TransactionType = 
  | 'purchase' | 'deposit' | 'withdrawal' | 'transfer' | 'payment' | 'fee' | 'interest' | 'dividend' | 'adjustment';

export type TransactionStatus = 
  | 'posted' | 'pending' | 'cancelled' | 'failed' | 'returned';

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually';
  interval: number;
  endDate?: Date;
  confidence: number; // 0-1 confidence score
}

export interface TransactionLocation {
  address?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  storeNumber?: string;
}

export interface TransactionMetadata {
  plaidTransactionId?: string;
  tellerTransactionId?: string;
  merchantId?: string;
  accountOwner?: string;
  checkNumber?: string;
  cardLast4?: string;
  paymentProcessor?: string;
  originalAmount?: number;
  originalCurrency?: string;
  exchangeRate?: number;
  scores?: TransactionScores;
  enrichment?: TransactionEnrichment;
  tracking_number?: string;
  carrier?: 'UPS' | 'FedEx' | 'USPS' | 'DHL' | 'Other';
  shipping_status?: 'DELIVERED' | 'OUT_FOR_DELIVERY' | 'IN_TRANSIT' | 'PENDING';
  payment_account_name?: string;
  payment_last4?: string;
  payment_network?: string;
}

export interface TransactionScores {
  health: number;
  eco: number;
  financial: number;
  necessity: number;
  happiness: number;
}

export interface TransactionEnrichment {
  logoUrl?: string;
  website?: string;
  category?: string;
  subcategory?: string;
  tags?: string[];
  isEssential?: boolean;
  environmentalScore?: number;
  healthScore?: number;
  brandInfo?: {
    name: string;
    description?: string;
    industry?: string;
    parentCompany?: string;
  };
}

export interface TransactionRule {
  id: string;
  familyId: string;
  name: string;
  isActive: boolean;
  priority: number;
  conditions: RuleCondition[];
  actions: RuleAction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RuleCondition {
  field: 'merchant' | 'description' | 'amount' | 'category' | 'account';
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'between';
  value: string | number;
  value2?: string | number; // For 'between' operator
}

export interface RuleAction {
  type: 'set_category' | 'set_subcategory' | 'add_tag' | 'set_merchant' | 'exclude_from_budget' | 'mark_as_transfer';
  value: string | boolean;
}

export interface TransactionSplit {
  id: string;
  transactionId: string;
  amount: number;
  category: TransactionCategory;
  subcategory?: string;
  description?: string;
  tags?: string[];
}

export interface TransferPair {
  id: string;
  familyId: string;
  sourceTransactionId: string;
  targetTransactionId: string;
  amount: number;
  confidence: number; // 0-1 confidence that this is a transfer
  isConfirmed: boolean;
  createdAt: Date;
}

export interface TransactionImport {
  id: string;
  familyId: string;
  filename: string;
  format: 'csv' | 'ofx' | 'qfx' | 'qif';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalTransactions: number;
  importedTransactions: number;
  errorTransactions: number;
  duplicateTransactions: number;
  mapping?: FieldMapping;
  errors?: ImportError[];
  createdAt: Date;
  completedAt?: Date;
}

export interface FieldMapping {
  date: string;
  amount: string;
  description: string;
  category?: string;
  merchant?: string;
  account?: string;
}

export interface ImportError {
  row: number;
  field: string;
  value: string;
  error: string;
}

export interface TransactionAnalytics {
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  categoryBreakdown: CategorySpending[];
  merchantBreakdown: MerchantSpending[];
  trends: SpendingTrend[];
  insights: SpendingInsight[];
}

export interface CategorySpending {
  category: TransactionCategory;
  amount: number;
  percentage: number;
  transactionCount: number;
  averageAmount: number;
  change: {
    amount: number;
    percentage: number;
    direction: 'up' | 'down' | 'stable';
  };
}

export interface MerchantSpending {
  merchant: string;
  amount: number;
  transactionCount: number;
  category: TransactionCategory;
  lastTransaction: Date;
}

export interface SpendingTrend {
  period: string;
  amount: number;
  change: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface SpendingInsight {
  type: 'high_spending' | 'unusual_merchant' | 'recurring_charge' | 'budget_alert' | 'savings_opportunity';
  title: string;
  description: string;
  amount?: number;
  category?: TransactionCategory;
  merchant?: string;
  confidence: number;
  actionable: boolean;
  action?: string;
}