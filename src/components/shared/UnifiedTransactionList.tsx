import React, { memo, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Transaction } from '@/types/transaction';
import { TransactionItem } from '@/components/TransactionItem';
import { AppleTransactionItem } from '@/components/transactions/AppleTransactionItem';
import { CleanTransactionItem } from '@/components/transactions/CleanTransactionItem';
import { EnterpriseTransactionItem } from '@/components/transactions/EnterpriseTransactionItem';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface UnifiedTransactionListProps {
  variant?: 'default' | 'apple' | 'clean' | 'polished' | 'enterprise';
  transactions: Transaction[];
  features?: {
    showScores?: boolean;
    showCategories?: boolean;
    groupByDate?: boolean;
    searchable?: boolean;
    filterable?: boolean;
    virtualScroll?: boolean;
  };
  className?: string;
  onTransactionClick?: (transaction: Transaction) => void;
  testId?: string;
}

// Component mapping for different variants
const VariantComponents = {
  default: TransactionItem,
  apple: AppleTransactionItem,
  clean: CleanTransactionItem,
  polished: TransactionItem, // Use default with different styling
  enterprise: EnterpriseTransactionItem,
};

// Style variants
const variantStyles = {
  default: 'bg-background',
  apple: 'bg-gray-50 dark:bg-gray-900',
  clean: 'bg-white dark:bg-gray-950 shadow-sm',
  polished: 'bg-gradient-to-br from-background to-secondary/5',
  enterprise: 'bg-slate-50 dark:bg-slate-900 border-2',
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
  },
  className,
  onTransactionClick,
  testId = 'transaction-list',
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
export const transactionListVariants = ['default', 'apple', 'clean', 'polished', 'enterprise'] as const;
export type TransactionListVariant = typeof transactionListVariants[number]; 