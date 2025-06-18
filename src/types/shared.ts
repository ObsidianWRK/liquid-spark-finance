// Central type definitions to eliminate duplication across 20+ files
// This will reduce code complexity by consolidating interfaces

export interface Transaction {
  id: string;
  merchant: string;
  category: {
    name: string;
    color: string;
    icon?: string;
  };
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  description?: string;
  scores?: {
    health: number;
    eco: number;
    financial: number;
  };
  type?: 'income' | 'expense';
}

export interface Account {
  id: string;
  type: string;
  nickname: string;
  balance: number;
  availableBalance: number;
  currency: string;
  isActive?: boolean;
  lastUpdated?: string;
  provider?: string;
}

export interface CreditScore {
  score: number;
  scoreRange: string;
  lastUpdated: string;
  factors: Array<{
    factor: string;
    status: 'Positive' | 'Negative' | 'Neutral';
    percentage: number;
    description?: string;
  }>;
  history?: Array<{
    date: string;
    score: number;
  }>;
}

export interface InsightMetric {
  id: string;
  title: string;
  value: number | string;
  change?: {
    amount: number;
    percentage: number;
    period: string;
  };
  trend?: 'up' | 'down' | 'stable';
  category: string;
  icon?: string;
  color?: string;
}

export interface BaseCardProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'glass' | 'solid' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  loading?: boolean;
}

export interface ScoreCardData {
  score: number;
  maxScore: number;
  label: string;
  description?: string;
  color: string;
  trend?: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
  };
}

export interface UnifiedInsightsConfig {
  variant: 'comprehensive' | 'simple' | 'enhanced' | 'refined';
  features: {
    showScores?: boolean;
    showTrends?: boolean;
    showCategories?: boolean;
    enableInteractions?: boolean;
    showComparisons?: boolean;
  };
  layout: {
    columns: number;
    spacing: 'tight' | 'normal' | 'loose';
    responsive: boolean;
  };
  dataSource: {
    transactions: Transaction[];
    accounts: Account[];
    timeframe?: string;
  };
}

export interface TransactionListProps {
  transactions: Transaction[];
  variant: 'default' | 'clean' | 'enterprise' | 'apple' | 'modern';
  currency: string;
  features: {
    showScores?: boolean;
    showCategories?: boolean;
    searchable?: boolean;
    filterable?: boolean;
    groupByDate?: boolean;
    sortable?: boolean;
  };
  onTransactionClick?: (transaction: Transaction) => void;
  onCategoryFilter?: (category: string) => void;
  className?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  currency: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    shareData: boolean;
    analytics: boolean;
  };
}

// Component State Types
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
  lastUpdated?: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

// Event Handler Types
export type TransactionClickHandler = (transaction: Transaction) => void;
export type AccountSelectHandler = (account: Account) => void;
export type CategoryFilterHandler = (category: string) => void;
export type SortChangeHandler = (field: string, direction: 'asc' | 'desc') => void;

// Performance Optimization Types
export interface MemoizedComponentProps<T = Record<string, unknown>> {
  shouldUpdate?: (prevProps: T, nextProps: T) => boolean;
}

export interface OptimizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
  virtualized?: boolean;
  batchSize?: number;
}