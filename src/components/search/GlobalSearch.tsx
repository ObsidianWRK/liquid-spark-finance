import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Clock, TrendingUp, CreditCard, Receipt, Calculator, BookOpen, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SimpleGlassCard from '@/components/ui/SimpleGlassCard';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  type: 'transaction' | 'account' | 'calculator' | 'help' | 'insight';
  title: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: () => void;
  category?: string;
  relevanceScore?: number;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (type: string, id: string) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Mock data - in a real app, this would come from your data stores
  const mockTransactions = [
    { id: '1', merchant: 'Whole Foods', amount: -127.43, category: 'Groceries', date: '2025-01-15' },
    { id: '2', merchant: 'Apple Store', amount: -899.00, category: 'Electronics', date: '2025-01-14' },
    { id: '3', merchant: 'Starbucks', amount: -6.85, category: 'Coffee', date: '2025-01-13' },
    { id: '4', merchant: 'Chase Bank', amount: 2500.00, category: 'Transfer', date: '2025-01-12' }
  ];

  const mockAccounts = [
    { id: '1', name: 'Chase Checking', type: 'Checking', balance: 12450 },
    { id: '2', name: 'Savings Account', type: 'Savings', balance: 25780 },
    { id: '3', name: 'Investment Portfolio', type: 'Investment', balance: 45600 },
    { id: '4', name: 'Credit Card', type: 'Credit', balance: -1245 }
  ];

  const mockCalculators = [
    { id: 'retirement', name: '401k Retirement Calculator', category: 'Retirement' },
    { id: 'loan', name: 'Loan Calculator', category: 'Loans' },
    { id: 'roi', name: 'ROI Calculator', category: 'Investment' },
    { id: 'compound', name: 'Compound Interest Calculator', category: 'Savings' }
  ];

  const mockHelpContent = [
    { id: '1', title: 'How to connect your first account', category: 'Getting Started' },
    { id: '2', title: 'Understanding your financial health score', category: 'Insights' },
    { id: '3', title: 'Setting up savings goals', category: 'Goals' },
    { id: '4', title: 'Using the retirement calculator', category: 'Tools' }
  ];

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('vueni-recent-searches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse recent searches:', e);
      }
    }
  }, []);

  // Search function with fuzzy matching
  const searchResults = useMemo((): SearchResult[] => {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];
    const searchTerm = query.toLowerCase();

    // Search transactions
    mockTransactions.forEach(transaction => {
      const merchantMatch = transaction.merchant.toLowerCase().includes(searchTerm);
      const categoryMatch = transaction.category.toLowerCase().includes(searchTerm);
      const amountMatch = Math.abs(transaction.amount).toString().includes(searchTerm);

      if (merchantMatch || categoryMatch || amountMatch) {
        results.push({
          id: transaction.id,
          type: 'transaction',
          title: transaction.merchant,
          subtitle: `${transaction.category} • ${transaction.date}`,
          description: `$${Math.abs(transaction.amount).toFixed(2)}`,
          icon: <Receipt className="w-4 h-4 text-blue-400" />,
          relevanceScore: merchantMatch ? 1.0 : categoryMatch ? 0.8 : 0.6,
          action: () => onNavigate?.('transaction', transaction.id)
        });
      }
    });

    // Search accounts
    mockAccounts.forEach(account => {
      const nameMatch = account.name.toLowerCase().includes(searchTerm);
      const typeMatch = account.type.toLowerCase().includes(searchTerm);

      if (nameMatch || typeMatch) {
        results.push({
          id: account.id,
          type: 'account',
          title: account.name,
          subtitle: account.type,
          description: `$${account.balance.toLocaleString()}`,
          icon: <CreditCard className="w-4 h-4 text-green-400" />,
          relevanceScore: nameMatch ? 1.0 : 0.8,
          action: () => onNavigate?.('account', account.id)
        });
      }
    });

    // Search calculators
    mockCalculators.forEach(calculator => {
      const nameMatch = calculator.name.toLowerCase().includes(searchTerm);
      const categoryMatch = calculator.category.toLowerCase().includes(searchTerm);

      if (nameMatch || categoryMatch) {
        results.push({
          id: calculator.id,
          type: 'calculator',
          title: calculator.name,
          subtitle: calculator.category,
          icon: <Calculator className="w-4 h-4 text-orange-400" />,
          relevanceScore: nameMatch ? 1.0 : 0.7,
          action: () => onNavigate?.('calculator', calculator.id)
        });
      }
    });

    // Search help content
    mockHelpContent.forEach(help => {
      const titleMatch = help.title.toLowerCase().includes(searchTerm);
      const categoryMatch = help.category.toLowerCase().includes(searchTerm);

      if (titleMatch || categoryMatch) {
        results.push({
          id: help.id,
          type: 'help',
          title: help.title,
          subtitle: help.category,
          icon: <BookOpen className="w-4 h-4 text-purple-400" />,
          relevanceScore: titleMatch ? 1.0 : 0.6,
          action: () => onNavigate?.('help', help.id)
        });
      }
    });

    // Sort by relevance score
    return results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0)).slice(0, 8);
  }, [query, onNavigate, mockTransactions, mockAccounts, mockCalculators, mockHelpContent]);

  // Handle search submission
  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    // Add to recent searches
    const newRecentSearches = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, 5);

    setRecentSearches(newRecentSearches);
    localStorage.setItem('vueni-recent-searches', JSON.stringify(newRecentSearches));

    // Execute the first result if available
    if (searchResults.length > 0) {
      searchResults[0].action?.();
      onClose();
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults[selectedIndex]) {
        searchResults[selectedIndex].action?.();
        onClose();
      } else {
        handleSearch();
      }
    }
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setSelectedIndex(0);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <SimpleGlassCard className="w-full max-w-2xl">
        {/* Search input */}
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search transactions, accounts, calculators, help..."
              className="w-full pl-10 pr-20 py-3 bg-transparent border-none outline-none text-white placeholder-white/50 text-lg"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              {query && (
                <button
                  onClick={clearSearch}
                  className="p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white/50 hover:text-white"
              >
                ESC
              </Button>
            </div>
          </div>
        </div>

        {/* Search results */}
        <div ref={resultsRef} className="max-h-96 overflow-y-auto">
          {query ? (
            <div className="p-2">
              {searchResults.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.map((result, index) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => {
                        result.action?.();
                        onClose();
                      }}
                      className={cn(
                        "w-full p-3 rounded-lg text-left transition-all duration-200 flex items-center gap-3",
                        index === selectedIndex
                          ? "bg-blue-500/20 border border-blue-500/30"
                          : "hover:bg-white/5"
                      )}
                    >
                      <div className="flex-shrink-0">
                        {result.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-white truncate">
                            {result.title}
                          </h4>
                          {result.description && (
                            <span className="text-white/70 text-sm font-mono">
                              {result.description}
                            </span>
                          )}
                        </div>
                        {result.subtitle && (
                          <p className="text-white/60 text-sm truncate">
                            {result.subtitle}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/30 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                    <Search className="w-8 h-8 text-white/30" />
                  </div>
                  <h3 className="text-white font-medium mb-2">No results found</h3>
                  <p className="text-white/60 text-sm">
                    Try searching for transactions, accounts, or tools
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4">
              {recentSearches.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-white/70 text-sm font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Recent Searches
                  </h3>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(search);
                          inputRef.current?.focus();
                        }}
                        className="w-full p-2 rounded-lg text-left hover:bg-white/5 text-white/80 hover:text-white transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-6 space-y-3">
                <h3 className="text-white/70 text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'View Accounts', action: () => onNavigate?.('accounts', '') },
                    { label: 'Recent Transactions', action: () => onNavigate?.('transactions', '') },
                    { label: 'Financial Insights', action: () => onNavigate?.('insights', '') },
                    { label: 'Calculators', action: () => onNavigate?.('calculators', '') }
                  ].map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        action.action();
                        onClose();
                      }}
                      className="p-3 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all text-sm text-center"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </SimpleGlassCard>
    </div>
  );
};

export default GlobalSearch; 