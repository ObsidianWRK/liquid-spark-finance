import React from 'react';
import { 
  CreditCard, 
  Receipt, 
  Target, 
  BarChart3, 
  Search, 
  Plus, 
  TrendingUp, 
  Calculator,
  Wallet,
  FileText,
  HelpCircle,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import SimpleGlassCard from './SimpleGlassCard';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  type: 'accounts' | 'transactions' | 'goals' | 'insights' | 'search' | 'reports' | 'notifications' | 'general';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
  showIllustration?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
  showIllustration = true
}) => {
  const getEmptyStateConfig = () => {
    switch (type) {
      case 'accounts':
        return {
          icon: <CreditCard className="w-16 h-16 text-blue-400" />,
          defaultTitle: 'No Accounts Connected',
          defaultDescription: 'Connect your first account to start tracking your finances and get personalized insights.',
          defaultActionLabel: 'Connect Account',
          illustration: (
            <div className="relative">
              <div className="w-24 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30 relative">
                <CreditCard className="w-8 h-8 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Plus className="w-4 h-4 text-white" />
              </div>
            </div>
          )
        };
      
      case 'transactions':
        return {
          icon: <Receipt className="w-16 h-16 text-green-400" />,
          defaultTitle: 'No Transactions Yet',
          defaultDescription: 'Once you connect an account, your transactions will appear here automatically.',
          defaultActionLabel: 'View Accounts',
          illustration: (
            <div className="space-y-2">
              {[1, 2, 3].map((_, index) => (
                <div 
                  key={index}
                  className="w-32 h-3 bg-white/10 rounded-full"
                  style={{ 
                    opacity: 1 - (index * 0.3),
                    width: `${120 - (index * 20)}px`
                  }}
                />
              ))}
              <Receipt className="w-6 h-6 text-green-400 mx-auto mt-4" />
            </div>
          )
        };
      
      case 'goals':
        return {
          icon: <Target className="w-16 h-16 text-purple-400" />,
          defaultTitle: 'No Savings Goals Set',
          defaultDescription: 'Create your first savings goal and track your progress toward financial milestones.',
          defaultActionLabel: 'Create Goal',
          illustration: (
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-purple-500/30 relative">
                <div className="w-12 h-12 rounded-full border-4 border-purple-500/50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Target className="w-4 h-4 text-purple-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          )
        };
      
      case 'insights':
        return {
          icon: <BarChart3 className="w-16 h-16 text-orange-400" />,
          defaultTitle: 'Not Enough Data for Insights',
          defaultDescription: 'Connect accounts and make transactions to unlock personalized financial insights.',
          defaultActionLabel: 'Connect Account',
          illustration: (
            <div className="flex items-end justify-center gap-1">
              {[1, 2, 3, 4].map((_, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-t from-orange-500/30 to-orange-500/10 rounded-t-sm"
                  style={{ 
                    width: '8px',
                    height: `${20 + (index * 8)}px`
                  }}
                />
              ))}
            </div>
          )
        };
      
      case 'search':
        return {
          icon: <Search className="w-16 h-16 text-gray-400" />,
          defaultTitle: 'No Results Found',
          defaultDescription: 'Try adjusting your search terms or browse categories below.',
          defaultActionLabel: 'Clear Search',
          illustration: (
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-gray-400/30 flex items-center justify-center">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-400/20 rounded-full" />
            </div>
          )
        };
      
      case 'reports':
        return {
          icon: <FileText className="w-16 h-16 text-indigo-400" />,
          defaultTitle: 'No Reports Available',
          defaultDescription: 'Generate your first financial report to track spending patterns and budgets.',
          defaultActionLabel: 'Create Report',
          illustration: (
            <div className="space-y-1">
              <div className="w-20 h-24 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg border border-indigo-500/30 relative">
                <div className="absolute top-3 left-3 space-y-1">
                  <div className="w-8 h-1 bg-indigo-400/50 rounded-full" />
                  <div className="w-6 h-1 bg-indigo-400/30 rounded-full" />
                  <div className="w-10 h-1 bg-indigo-400/40 rounded-full" />
                </div>
                <BarChart3 className="w-4 h-4 text-indigo-400 absolute bottom-2 right-2" />
              </div>
            </div>
          )
        };
      
      case 'notifications':
        return {
          icon: <HelpCircle className="w-16 h-16 text-yellow-400" />,
          defaultTitle: 'No Notifications',
          defaultDescription: 'You\'re all caught up! We\'ll notify you about important account activity.',
          illustration: (
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center">
                <Zap className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
          )
        };
      
      default:
        return {
          icon: <Wallet className="w-16 h-16 text-blue-400" />,
          defaultTitle: 'Nothing Here Yet',
          defaultDescription: 'This section will populate as you use the app.',
          illustration: (
            <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <Wallet className="w-8 h-8 text-blue-400" />
            </div>
          )
        };
    }
  };

  const config = getEmptyStateConfig();

  return (
    <SimpleGlassCard className={cn("p-12 text-center max-w-md mx-auto", className)}>
      <div className="space-y-6">
        {/* Illustration or Icon */}
        <div className="flex justify-center">
          {showIllustration && config.illustration ? (
            <div className="relative">
              {config.illustration}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
              {config.icon}
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-white">
            {title || config.defaultTitle}
          </h3>
          <p className="text-white/70 leading-relaxed">
            {description || config.defaultDescription}
          </p>
        </div>
        
        {/* Actions */}
        <div className="space-y-3">
          {(onAction || config.defaultActionLabel) && (
            <Button
              onClick={onAction}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              {actionLabel || config.defaultActionLabel}
            </Button>
          )}
          
          {onSecondaryAction && secondaryActionLabel && (
            <Button
              variant="outline"
              onClick={onSecondaryAction}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      </div>
    </SimpleGlassCard>
  );
};

// Specialized empty state components for common use cases
export const AccountsEmptyState: React.FC<{ onConnectAccount: () => void }> = ({ onConnectAccount }) => (
  <EmptyState
    type="accounts"
    onAction={onConnectAccount}
    secondaryActionLabel="Learn More"
    onSecondaryAction={() => window.open('/help/connecting-accounts', '_blank')}
  />
);

export const TransactionsEmptyState: React.FC<{ onViewAccounts: () => void }> = ({ onViewAccounts }) => (
  <EmptyState
    type="transactions"
    onAction={onViewAccounts}
    secondaryActionLabel="Import Manually"
    onSecondaryAction={() => {}}
  />
);

export const GoalsEmptyState: React.FC<{ onCreateGoal: () => void }> = ({ onCreateGoal }) => (
  <EmptyState
    type="goals"
    onAction={onCreateGoal}
    secondaryActionLabel="See Examples"
    onSecondaryAction={() => {}}
  />
);

export const InsightsEmptyState: React.FC<{ onConnectAccount: () => void }> = ({ onConnectAccount }) => (
  <EmptyState
    type="insights"
    title="Ready for Insights?"
    description="We need at least 30 days of transaction history to generate meaningful insights about your spending patterns."
    onAction={onConnectAccount}
    secondaryActionLabel="View Demo"
    onSecondaryAction={() => {}}
  />
);

export const SearchEmptyState: React.FC<{ onClearSearch: () => void; searchTerm?: string }> = ({ 
  onClearSearch, 
  searchTerm 
}) => (
  <EmptyState
    type="search"
    title={`No results for "${searchTerm}"`}
    description="Try searching for transactions, accounts, or help topics."
    actionLabel="Clear Search"
    onAction={onClearSearch}
    secondaryActionLabel="Browse All"
    onSecondaryAction={() => {}}
  />
);

// Loading empty state for when data is being fetched
export const LoadingEmptyState: React.FC<{ message?: string }> = ({ 
  message = "Loading your data..." 
}) => (
  <SimpleGlassCard className="p-12 text-center max-w-md mx-auto">
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">Please Wait</h3>
        <p className="text-white/70">{message}</p>
      </div>
    </div>
  </SimpleGlassCard>
);

export default EmptyState; 