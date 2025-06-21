import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  Activity,
  TrendingUp,
  Heart,
  CheckCircle,
  Calendar,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { UniversalCard } from '@/shared/ui/UniversalCard';
import { Badge } from '@/shared/ui/badge';
import { formatCurrency } from '@/shared/utils/formatters';
import { useSynchronizedMetrics } from '@/providers/BiometricsProvider';
import { BiometricMonitor } from '@/features/biometric-intervention/components/BiometricMonitor';
import { UnifiedTransactionList } from '@/features/transactions/components/UnifiedTransactionList';
import { AccountOverviewSkeleton } from '@/shared/ui/account-overview-skeleton';
import { ErrorState } from '@/shared/ui/error-state';
import { useAccountOverview } from '@/features/accounts/hooks/useAccountOverview';
import { Transaction } from '@/shared/types/transactions';
import { BackButton } from '@/shared/components/ui/BackButton';

// Utility functions can be moved to a shared utils file if used elsewhere

interface TransactionWithBiometrics extends Transaction {
  stressAtTime: number;
  heartRateAtTime?: number;
  riskLevel: 'low' | 'medium' | 'high';
}

function mergeBiometricsWithTransactions(
  transactions: Transaction[],
  currentStressIndex: number
): TransactionWithBiometrics[] {
  return transactions.map((transaction) => {
    // This logic can be made more sophisticated
    const stressAtTime = Math.min(
      100,
      Math.round(
        (currentStressIndex || 30) +
          (Math.random() - 0.5) * 15 +
          Math.abs(transaction.amount) / 50
      )
    );
    const riskLevel =
      stressAtTime >= 70 ? 'high' : stressAtTime >= 40 ? 'medium' : 'low';
    const heartRateAtTime = Math.round(
      70 + (stressAtTime / 100) * 30 + (Math.random() - 0.5) * 10
    );

    return { ...transaction, stressAtTime, heartRateAtTime, riskLevel };
  });
}

interface CollapsiblePaneProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badge?: string;
  badgeVariant?: 'default' | 'destructive' | 'outline' | 'secondary';
}

const CollapsiblePane: React.FC<CollapsiblePaneProps> = ({
  title,
  icon: Icon,
  isExpanded,
  onToggle,
  children,
  badge,
  badgeVariant = 'default',
}) => (
  <UniversalCard variant="glass" className="w-full">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors rounded-2xl"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center">
          <Icon className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {badge && (
          <Badge variant={badgeVariant} className="text-xs">
            {badge}
          </Badge>
        )}
      </div>
      {isExpanded ? (
        <ChevronUp className="w-5 h-5 text-white/50" />
      ) : (
        <ChevronDown className="w-5 h-5 text-white/50" />
      )}
    </button>
    <div
      className={cn(
        'transition-all duration-300 overflow-hidden',
        isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
      )}
    >
      <div className="px-6 pb-6">
        <div className="border-t border-white/[0.08] pt-6">{children}</div>
      </div>
    </div>
  </UniversalCard>
);

const AccountOverview: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const [expandedPanes, setExpandedPanes] = useState<Set<string>>(
    new Set(['health'])
  );
  const { stressIndex } = useSynchronizedMetrics();

  const { account, transactions, balanceHistory, loading, error } =
    useAccountOverview(accountId);

  const togglePane = (paneId: string) => {
    setExpandedPanes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(paneId)) newSet.delete(paneId);
      else newSet.add(paneId);
      return newSet;
    });
  };

  const daysInWarning = useMemo(() => {
    if (!account || !balanceHistory.length) return 0;
    const threshold =
      account.category === 'CREDIT' ? (account.creditLimit || 0) * 0.9 : 100;
    return balanceHistory.filter((h) => h.balance < threshold).length;
  }, [account, balanceHistory]);

  const transactionsWithBiometrics = useMemo(() => {
    return mergeBiometricsWithTransactions(transactions, stressIndex);
  }, [transactions, stressIndex]);

  const thirtyDayAverage = useMemo(() => {
    if (!balanceHistory.length) return 0;
    const sum = balanceHistory.reduce((acc, h) => acc + h.balance, 0);
    return sum / balanceHistory.length;
  }, [balanceHistory]);

  if (loading) {
    return <AccountOverviewSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        title="Failed to Load Account"
        onRetry={() => window.location.reload()}
        onBack={() => {
          if (window.history.length > 2) {
            navigate(-1);
          } else {
            navigate('/accounts');
          }
        }}
      />
    );
  }

  if (!account) {
    return (
      <ErrorState
        title="Account Not Found"
        message="The requested account could not be found."
        onBack={() => {
          if (window.history.length > 2) {
            navigate(-1);
          } else {
            navigate('/accounts');
          }
        }}
        backText="Back to Accounts"
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <BackButton
            fallbackPath="/accounts"
            variant="ghost"
            size="sm"
            label="Back"
            className="p-2 hover:bg-white/[0.05]"
          />
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
              {account.accountName} ••••{account.last4}
            </h1>
            <p className="text-white/60 text-sm">{account.institution.name}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl md:text-3xl font-bold text-white">
              {formatCurrency(account.currentBalance, {
                currency: account.currency,
              })}
            </div>
            <div className="text-white/60 text-sm">
              Available:{' '}
              {formatCurrency(
                account.availableBalance || account.currentBalance,
                { currency: account.currency }
              )}
            </div>
          </div>
        </div>

        {/* Panes */}
        <div className="space-y-6">
          <CollapsiblePane
            title="Account Health"
            icon={Activity}
            isExpanded={expandedPanes.has('health')}
            onToggle={() => togglePane('health')}
            badge={
              daysInWarning > 0 ? `${daysInWarning} days warning` : 'Healthy'
            }
            badgeVariant={
              daysInWarning > 7
                ? 'destructive'
                : daysInWarning > 0
                  ? 'outline'
                  : 'default'
            }
          >
            {/* Health content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-medium text-white/90">
                    Available Balance
                  </span>
                </div>
                <div className="text-lg font-bold text-white">
                  {formatCurrency(
                    account.availableBalance || account.currentBalance,
                    { currency: account.currency }
                  )}
                </div>
              </div>

              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium text-white/90">
                    30-Day Average
                  </span>
                </div>
                <div className="text-lg font-bold text-white">
                  {formatCurrency(thirtyDayAverage, {
                    currency: account.currency,
                  })}
                </div>
              </div>

              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle
                    className={cn(
                      'w-5 h-5',
                      daysInWarning > 7
                        ? 'text-red-400'
                        : daysInWarning > 0
                          ? 'text-yellow-400'
                          : 'text-green-400'
                    )}
                  />
                  <span className="text-sm font-medium text-white/90">
                    Status
                  </span>
                </div>
                <div className="text-lg font-bold text-white">
                  {daysInWarning > 0
                    ? `${daysInWarning} days warning`
                    : 'Healthy'}
                </div>
              </div>
            </div>
          </CollapsiblePane>

          <CollapsiblePane
            title="Recent Transactions"
            icon={DollarSign}
            isExpanded={expandedPanes.has('transactions')}
            onToggle={() => togglePane('transactions')}
            badge={`${transactions.length} transactions`}
          >
            <UnifiedTransactionList
              transactions={transactions.map((t) => ({
                id: t.id,
                merchant: t.merchantName ?? t.description ?? 'Unknown',
                category: { name: String(t.category), color: '#6366f1' },
                amount: t.amount,
                date: t.date instanceof Date ? t.date.toISOString() : t.date,
                status:
                  (t.status as string) === 'pending'
                    ? 'pending'
                    : ['failed', 'cancelled', 'returned', 'refunded'].includes(
                        t.status as string
                      )
                    ? 'failed'
                    : 'completed',
              }))}
              currency={account.currency}
              onTransactionClick={(transaction) =>
                console.log('Transaction clicked:', transaction)
              }
            />
          </CollapsiblePane>

          <CollapsiblePane
            title="Biometrics at Transactions"
            icon={Heart}
            isExpanded={expandedPanes.has('biometrics')}
            onToggle={() => togglePane('biometrics')}
            badge="Live monitoring"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white/90 font-medium mb-4">
                    Current Biometric Status
                  </h4>
                  <BiometricMonitor compact={false} />
                </div>
                <div>
                  <h4 className="text-white/90 font-medium mb-4">
                    Stress During Transactions
                  </h4>
                  <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                    <div className="space-y-4">
                      {transactionsWithBiometrics
                        .slice(0, 5)
                        .map((tx: TransactionWithBiometrics) => (
                          <div
                            key={tx.id}
                            className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg"
                          >
                            <div>
                              <div className="text-white font-medium">
                                {tx.merchantName}
                              </div>
                              <div className="text-white/60 text-sm">
                                {new Date(tx.date).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white">
                                {formatCurrency(tx.amount, {
                                  currency: tx.currency,
                                })}
                              </div>
                              <div className="text-sm">
                                <span
                                  className={cn(
                                    'inline-block px-2 py-1 rounded-full text-xs',
                                    tx.stressAtTime >= 70
                                      ? 'bg-red-500/20 text-red-400'
                                      : tx.stressAtTime >= 40
                                        ? 'bg-yellow-500/20 text-yellow-400'
                                        : 'bg-green-500/20 text-green-400'
                                  )}
                                >
                                  Stress: {tx.stressAtTime}%
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CollapsiblePane>

          <CollapsiblePane
            title="Personal Insights"
            icon={TrendingUp}
            isExpanded={expandedPanes.has('insights')}
            onToggle={() => togglePane('insights')}
            badge="AI-powered"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                <h4 className="text-white/90 font-medium mb-3">
                  Spending Patterns
                </h4>
                <p className="text-white/70 text-sm">
                  Your spending patterns show healthy financial behavior with
                  consistent saving habits.
                </p>
              </div>
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                <h4 className="text-white/90 font-medium mb-3">
                  Recommendations
                </h4>
                <p className="text-white/70 text-sm">
                  Consider setting up automatic transfers to maximize your
                  savings potential.
                </p>
              </div>
            </div>
          </CollapsiblePane>
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;
