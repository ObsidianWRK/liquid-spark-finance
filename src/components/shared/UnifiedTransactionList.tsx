import React, { memo, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Transaction } from '@/types/transaction';
import { TransactionItem } from '@/components/TransactionItem';
import { SharedScoreCircle } from './SharedScoreCircle';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface Transaction {
  id: string;
  merchant: string;
  category: {
    name: string;
    color: string;
  } | string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  description?: string;
  scores?: {
    health: number;
    eco: number;
    financial: number;
  };
  shipping?: {
    trackingNumber: string;
    provider: string;
    status: string;
  };
}

export type TransactionVariant = 'default' | 'apple' | 'clean' | 'polished' | 'enterprise' | 'mobile';

export interface UnifiedTransactionListProps {
  variant?: TransactionVariant;
  transactions: Transaction[];
  features?: {
    showScores?: boolean;
    showCategories?: boolean;
    groupByDate?: boolean;
    searchable?: boolean;
    filterable?: boolean;
    virtualScroll?: boolean;
    showShipping?: boolean;
    showStatusIcon?: boolean;
    compactMode?: boolean;
    animationsEnabled?: boolean;
  };
  className?: string;
  onTransactionClick?: (transaction: Transaction) => void;
  testId?: string;
  currency?: string;
}

// Individual Transaction Item Components for each variant
const DefaultTransactionItem = ({ transaction, showScores, showCategory, currency = 'USD' }: any) => {
  const categoryName = typeof transaction.category === 'string' ? transaction.category : transaction.category.name;
  const categoryColor = typeof transaction.category === 'string' ? '#6366f1' : transaction.category.color;
  
  return (
    <div className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center">
        <span className="text-white text-sm font-medium">
          {transaction.merchant.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1">
        <h4 className="text-white font-medium">{transaction.merchant}</h4>
        {showCategory && (
          <p className="text-white/60 text-sm">{categoryName}</p>
        )}
        <p className="text-white/40 text-xs">{new Date(transaction.date).toLocaleDateString()}</p>
      </div>
      <div className="text-right">
        <div className={cn(
          "font-semibold",
          transaction.amount >= 0 ? "text-green-400" : "text-red-400"
        )}>
          {transaction.amount >= 0 ? '+' : ''}{transaction.amount.toLocaleString('en-US', {
            style: 'currency',
            currency
          })}
        </div>
        <div className="text-white/40 text-xs capitalize">{transaction.status}</div>
      </div>
      {showScores && transaction.scores && (
        <div className="flex gap-1">
          <SharedScoreCircle score={transaction.scores.health} type="health" size="sm" />
          <SharedScoreCircle score={transaction.scores.eco} type="eco" size="sm" />
          <SharedScoreCircle score={transaction.scores.financial} type="financial" size="sm" />
        </div>
      )}
    </div>
  );
};

const AppleTransactionItem = ({ transaction, showScores, showCategory, currency = 'USD' }: any) => {
  const categoryName = typeof transaction.category === 'string' ? transaction.category : transaction.category.name;
  
  return (
    <div className="flex items-center gap-3 p-4 bg-gray-50/5 rounded-xl hover:bg-gray-50/10 transition-all">
      <div className="w-12 h-12 rounded-full bg-gray-200/10 flex items-center justify-center">
        <span className="text-white text-sm font-semibold">
          {transaction.merchant.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1">
        <h4 className="text-white font-medium text-sm">{transaction.merchant}</h4>
        {showCategory && (
          <p className="text-white/50 text-xs">{categoryName}</p>
        )}
      </div>
      <div className="text-right">
        <div className={cn(
          "font-medium text-sm",
          transaction.amount >= 0 ? "text-green-500" : "text-white"
        )}>
          {transaction.amount >= 0 ? '+' : ''}{Math.abs(transaction.amount).toLocaleString('en-US', {
            style: 'currency',
            currency
          })}
        </div>
      </div>
      {showScores && transaction.scores && (
        <div className="flex gap-1">
          <SharedScoreCircle score={transaction.scores.health} type="health" size="sm" />
          <SharedScoreCircle score={transaction.scores.eco} type="eco" size="sm" />
          <SharedScoreCircle score={transaction.scores.financial} type="financial" size="sm" />
        </div>
      )}
    </div>
  );
};

const CleanTransactionItem = ({ transaction, showScores, showCategory, currency = 'USD' }: any) => {
  const categoryName = typeof transaction.category === 'string' ? transaction.category : transaction.category.name;
  
  return (
    <div className="flex items-center gap-4 p-4 border-b border-white/5 last:border-b-0 hover:bg-white/2 transition-colors">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
        <span className="text-white/70 text-xs font-medium">
          {transaction.merchant.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-medium truncate">{transaction.merchant}</h4>
        {showCategory && (
          <p className="text-white/50 text-sm">{categoryName}</p>
        )}
        <p className="text-white/30 text-xs">{new Date(transaction.date).toLocaleDateString()}</p>
      </div>
      <div className="text-right">
        <div className={cn(
          "font-medium",
          transaction.amount >= 0 ? "text-emerald-400" : "text-slate-200"
        )}>
          {transaction.amount.toLocaleString('en-US', {
            style: 'currency',
            currency
          })}
        </div>
      </div>
      {showScores && transaction.scores && (
        <div className="flex gap-1">
          <SharedScoreCircle score={transaction.scores.health} type="health" size="sm" />
          <SharedScoreCircle score={transaction.scores.eco} type="eco" size="sm" />
          <SharedScoreCircle score={transaction.scores.financial} type="financial" size="sm" />
        </div>
      )}
    </div>
  );
};

const PolishedTransactionItem = ({ transaction, showScores, showCategory, currency = 'USD' }: any) => {
  const categoryName = typeof transaction.category === 'string' ? transaction.category : transaction.category.name;
  const categoryColor = typeof transaction.category === 'string' ? '#6366f1' : transaction.category.color;
  
  return (
    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-white/3 to-white/1 rounded-lg hover:from-white/5 hover:to-white/2 transition-all duration-200 backdrop-blur-sm">
      <div 
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${categoryColor}20`, border: `1px solid ${categoryColor}30` }}
      >
        <span className="text-white text-sm font-semibold">
          {transaction.merchant.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1">
        <h4 className="text-white font-semibold">{transaction.merchant}</h4>
        {showCategory && (
          <p className="text-white/60 text-sm" style={{ color: categoryColor }}>{categoryName}</p>
        )}
        <p className="text-white/40 text-xs">{new Date(transaction.date).toLocaleDateString()}</p>
      </div>
      <div className="text-right">
        <div className={cn(
          "font-bold text-lg",
          transaction.amount >= 0 ? "text-green-400" : "text-red-400"
        )}>
          {transaction.amount >= 0 ? '+' : ''}{transaction.amount.toLocaleString('en-US', {
            style: 'currency',
            currency
          })}
        </div>
        <div className="text-white/50 text-xs capitalize">{transaction.status}</div>
      </div>
      {showScores && transaction.scores && (
        <div className="flex gap-2">
          <SharedScoreCircle score={transaction.scores.health} type="health" size="md" />
          <SharedScoreCircle score={transaction.scores.eco} type="eco" size="md" />
          <SharedScoreCircle score={transaction.scores.financial} type="financial" size="md" />
        </div>
      )}
    </div>
  );
};

const EnterpriseTransactionItem = ({ transaction, showScores, showCategory, currency = 'USD' }: any) => {
  const categoryName = typeof transaction.category === 'string' ? transaction.category : transaction.category.name;
  
  return (
    <div className="flex items-center gap-4 p-4 bg-slate-800/30 border border-slate-600/20 rounded-lg hover:bg-slate-700/30 transition-all">
      <div className="w-10 h-10 rounded-lg bg-slate-600/50 flex items-center justify-center border border-slate-500/30">
        <span className="text-slate-200 text-sm font-medium">
          {transaction.merchant.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1">
        <h4 className="text-slate-100 font-medium">{transaction.merchant}</h4>
        {showCategory && (
          <p className="text-slate-400 text-sm">{categoryName}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <p className="text-slate-500 text-xs">{new Date(transaction.date).toLocaleDateString()}</p>
          <span className="text-slate-600">•</span>
          <span className={cn(
            "text-xs px-2 py-1 rounded-full",
            transaction.status === 'completed' ? "bg-green-500/20 text-green-400" :
            transaction.status === 'pending' ? "bg-yellow-500/20 text-yellow-400" :
            "bg-red-500/20 text-red-400"
          )}>
            {transaction.status}
          </span>
        </div>
      </div>
      <div className="text-right">
        <div className={cn(
          "font-semibold",
          transaction.amount >= 0 ? "text-green-400" : "text-slate-200"
        )}>
          {transaction.amount >= 0 ? '+' : ''}{transaction.amount.toLocaleString('en-US', {
            style: 'currency',
            currency
          })}
        </div>
      </div>
      {showScores && transaction.scores && (
        <div className="flex gap-1">
          <SharedScoreCircle score={transaction.scores.health} type="health" size="sm" />
          <SharedScoreCircle score={transaction.scores.eco} type="eco" size="sm" />
          <SharedScoreCircle score={transaction.scores.financial} type="financial" size="sm" />
        </div>
      )}
    </div>
  );
};

const MobileTransactionItem = ({ transaction, showScores, showCategory, currency = 'USD' }: any) => {
  const categoryName = typeof transaction.category === 'string' ? transaction.category : transaction.category.name;
  
  return (
    <div className="flex items-center gap-3 p-3 active:bg-white/5 transition-colors">
      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
        <span className="text-white text-xs font-medium">
          {transaction.merchant.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-medium text-sm truncate">{transaction.merchant}</h4>
        <div className="flex items-center gap-2">
          {showCategory && (
            <p className="text-white/60 text-xs">{categoryName}</p>
          )}
          <span className="text-white/40 text-xs">•</span>
          <p className="text-white/40 text-xs">{new Date(transaction.date).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="text-right">
        <div className={cn(
          "font-medium text-sm",
          transaction.amount >= 0 ? "text-green-400" : "text-white"
        )}>
          {transaction.amount >= 0 ? '+' : ''}{Math.abs(transaction.amount).toLocaleString('en-US', {
            style: 'currency',
            currency
          })}
        </div>
        {showScores && transaction.scores && (
          <div className="flex gap-1 mt-1 justify-end">
            <SharedScoreCircle score={transaction.scores.health} type="health" size="sm" />
            <SharedScoreCircle score={transaction.scores.eco} type="eco" size="sm" />
            <SharedScoreCircle score={transaction.scores.financial} type="financial" size="sm" />
          </div>
        )}
      </div>
    </div>
  );
};

// Component mapping for different variants
const VariantComponents = {
  default: DefaultTransactionItem,
  apple: AppleTransactionItem,
  clean: CleanTransactionItem,
  polished: PolishedTransactionItem,
  enterprise: EnterpriseTransactionItem,
  mobile: MobileTransactionItem,
};

// Style variants
const variantStyles = {
  default: 'bg-black/20 backdrop-blur-sm border-white/10',
  apple: 'bg-gray-900/80 backdrop-blur-sm border-gray-700/30',
  clean: 'bg-white/5 backdrop-blur-sm border-white/10',
  polished: 'bg-gradient-to-br from-black/30 to-purple-900/20 backdrop-blur-sm border-white/20',
  enterprise: 'bg-slate-900/90 backdrop-blur-sm border-slate-600/30',
  mobile: 'bg-black/30 backdrop-blur-sm border-white/10',
};

export const UnifiedTransactionList = memo(({
  variant = 'default',
  transactions,
  features = {
    showScores: true,
    showCategories: true,
    groupByDate: false,
    searchable: false,
    filterable: false,
    virtualScroll: false,
    showShipping: false,
    showStatusIcon: true,
    compactMode: false,
    animationsEnabled: true,
  },
  className,
  onTransactionClick,
  testId = 'transaction-list',
  currency = 'USD',
}: UnifiedTransactionListProps) => {
  
  // Search state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  
  // Get the component for the current variant
  const ItemComponent = VariantComponents[variant] || VariantComponents.default;
  
  // Process transactions based on features
  const processedTransactions = useMemo(() => {
    let result = [...transactions];
    
    // Apply search filter
    if (features.searchable && searchQuery) {
      result = result.filter(t => 
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (features.filterable && selectedCategory) {
      result = result.filter(t => t.category === selectedCategory);
    }
    
    // Group by date if enabled
    if (features.groupByDate) {
      // Group logic here - for now just sort by date
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    
    return result;
  }, [transactions, searchQuery, selectedCategory, features]);
  
  // Extract unique categories for filtering
  const categories = useMemo(() => {
    return [...new Set(transactions.map(t => t.category))];
  }, [transactions]);
  
  return (
    <Card 
      className={cn(variantStyles[variant], 'overflow-hidden', className)}
      data-testid={testId}
    >
      {/* Header with search and filters */}
      {(features.searchable || features.filterable) && (
        <div className="p-4 border-b space-y-3">
          {features.searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="transaction-search"
              />
            </div>
          )}
          
          {features.filterable && (
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Transaction list */}
      <ScrollArea className={features.virtualScroll ? "h-[600px]" : "h-auto max-h-[600px]"}>
        <div className="divide-y">
          {processedTransactions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No transactions found
            </div>
          ) : (
            processedTransactions.map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => onTransactionClick?.(transaction)}
                className={cn(
                  "transition-colors",
                  onTransactionClick && "cursor-pointer hover:bg-secondary/10"
                )}
                data-testid="transaction-item"
              >
                {React.createElement(ItemComponent, {
                  transaction,
                  showScores: features.showScores,
                  showCategory: features.showCategories,
                  showShipping: features.showShipping,
                  showStatusIcon: features.showStatusIcon,
                  compactMode: features.compactMode,
                  animationsEnabled: features.animationsEnabled,
                  currency,
                  variant,
                })}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
});

UnifiedTransactionList.displayName = 'UnifiedTransactionList';

// Export variant types for documentation
export const transactionListVariants = ['default', 'apple', 'clean', 'polished', 'enterprise', 'mobile'] as const;

// Export feature flags for easy configuration
export const defaultFeatures = {
  showScores: true,
  showCategories: true,
  groupByDate: false,
  searchable: false,
  filterable: false,
  virtualScroll: false,
  showShipping: false,
  showStatusIcon: true,
  compactMode: false,
  animationsEnabled: true,
};

// Preset configurations for common use cases
export const transactionListPresets = {
  dashboard: {
    variant: 'default' as TransactionVariant,
    features: { ...defaultFeatures, groupByDate: true, showScores: true },
  },
  mobile: {
    variant: 'mobile' as TransactionVariant,
    features: { ...defaultFeatures, compactMode: true, showScores: false },
  },
  detailed: {
    variant: 'polished' as TransactionVariant,
    features: { ...defaultFeatures, showScores: true, showShipping: true, searchable: true, filterable: true },
  },
  minimal: {
    variant: 'clean' as TransactionVariant,
    features: { ...defaultFeatures, showScores: false, showCategories: false },
  },
  enterprise: {
    variant: 'enterprise' as TransactionVariant,
    features: { ...defaultFeatures, searchable: true, filterable: true, virtualScroll: true },
  },
} as const;

// Performance optimization: Export memoized version
export const VueniUnifiedTransactionList = UnifiedTransactionList; 