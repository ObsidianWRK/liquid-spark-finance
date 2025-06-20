import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Activity, CreditCard, TrendingUp, Heart, ArrowLeft, AlertTriangle, CheckCircle, Calendar, DollarSign } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { UniversalCard } from '@/shared/ui/UniversalCard';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { formatCurrency } from '@/shared/utils/formatters';
import { useSynchronizedMetrics } from '@/providers/BiometricsProvider';
import { BiometricMonitor } from '@/features/biometric-intervention/components/BiometricMonitor';
import { TransactionList } from '@/features/transactions/components/TransactionList';
import { accountService } from '@/features/accounts/api/accountService';
import { transactionService } from '@/features/transactions/api/transactionService';
import { AccountCardDTO } from '@/shared/types/accounts';
import { Transaction } from '@/shared/types/transactions';

// Utility functions for account warnings and biometric integration
function getDaysInWarning(balanceHistory: number[], threshold: number): number {
  if (!balanceHistory.length) return 0;
  
  let daysInWarning = 0;
  
  // Count consecutive days below threshold starting from most recent
  for (const balance of balanceHistory) {
    if (balance < threshold) {
      daysInWarning++;
    } else {
      break; // Stop at first day above threshold
    }
  }
  
  return daysInWarning;
}

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
    const transactionDate = new Date(transaction.date);
    const hour = transactionDate.getHours();
    const dayOfWeek = transactionDate.getDay();
    const transactionAmount = Math.abs(transaction.amount);
    
    // Base stress from current user state
    let stressAtTime = currentStressIndex || 30;
    
    // Amount-based stress increase
    if (transactionAmount > 500) stressAtTime += 20;
    else if (transactionAmount > 200) stressAtTime += 10;
    else if (transactionAmount > 100) stressAtTime += 5;
    
    // Time-based stress (work hours are more stressful)
    if (hour >= 9 && hour <= 17) stressAtTime += 10;
    if (hour >= 14 && hour <= 16) stressAtTime += 5; // Peak stress hours
    
    // Weekday stress
    if (dayOfWeek >= 1 && dayOfWeek <= 5) stressAtTime += 5;
    
    // Add some randomness to make it realistic
    stressAtTime += (Math.random() - 0.5) * 15;
    
    // Clamp to 0-100 range
    stressAtTime = Math.max(0, Math.min(100, Math.round(stressAtTime)));
    
    // Calculate risk level based on stress
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (stressAtTime >= 70) riskLevel = 'high';
    else if (stressAtTime >= 40) riskLevel = 'medium';
    
    // Estimate heart rate based on stress (rough correlation)
    const heartRateAtTime = Math.round(70 + (stressAtTime / 100) * 30 + (Math.random() - 0.5) * 10);
    
    return {
      ...transaction,
      stressAtTime,
      heartRateAtTime,
      riskLevel
    };
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
  badgeVariant = 'default'
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
    
    <div className={cn(
      "transition-all duration-300 overflow-hidden",
      isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
    )}>
      <div className="px-6 pb-6">
        <div className="border-t border-white/[0.08] pt-6">
          {children}
        </div>
      </div>
    </div>
  </UniversalCard>
);

const AccountOverview: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const [expandedPanes, setExpandedPanes] = useState<Set<string>>(new Set(['health']));
  const [account, setAccount] = useState<AccountCardDTO | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balanceHistory, setBalanceHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { stressIndex, wellnessScore } = useSynchronizedMetrics();

  useEffect(() => {
    const loadAccountData = async () => {
      if (!accountId) return;
      
      try {
        setLoading(true);
        
        // Load account details (mock data for demo)
        const mockAccount: AccountCardDTO = {
          id: accountId,

          accountType: 'Checking',
          accountName: 'Main Checking',
          currentBalance: 8750.42,
          availableBalance: 8450.42,
          currency: 'USD',
          institution: {
            name: 'Chase Bank',
            logo: '/api/placeholder/32/32',
            color: '#0066CC'
          },
          last4: '1234',
          interestApy: 0.01,
          category: 'CHECKING',
          alerts: []
        };
        
        setAccount(mockAccount);
        
        // Load transactions (using mock data since service method doesn't exist)
        const mockTransactions: Transaction[] = [
          {
            id: '1',
            accountId: accountId,
            familyId: 'demo_family',
            amount: -85.32,
            currency: 'USD',
            date: new Date('2024-12-10'),
            merchantName: 'Starbucks',
            description: 'Coffee purchase',
            category: 'food',
            paymentChannel: 'online',
            transactionType: 'purchase',
            status: 'completed',
            isPending: false,
            isRecurring: false,
            metadata: {},
            tags: [],
            excludeFromBudget: false,
            isTransfer: false,
            createdAt: new Date('2024-12-10'),
            updatedAt: new Date('2024-12-10'),
          },
          // Add more mock transactions...
        ];
        setTransactions(mockTransactions);
        
        // Load balance history
        const history = await accountService.getAccountBalanceHistory(accountId, 30);
        setBalanceHistory(history);
        
      } catch (error) {
        console.error('Error loading account data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAccountData();
  }, [accountId]);

  const togglePane = (paneId: string) => {
    setExpandedPanes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(paneId)) {
        newSet.delete(paneId);
      } else {
        newSet.add(paneId);
      }
      return newSet;
    });
  };

  const daysInWarning = useMemo(() => {
    if (!account || !balanceHistory.length) return 0;
    const threshold = 100; // Default minimum balance threshold
    return getDaysInWarning(balanceHistory.map(h => h.balance), threshold);
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white/70">Loading account details...</p>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Account Not Found</h2>
          <p className="text-white/70 mb-4">The requested account could not be found.</p>
          <Button onClick={() => navigate('/')} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            onClick={() => navigate('/')}
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-white/[0.05]"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">
              {account.accountType} ••••{account.last4}
            </h1>
            <p className="text-white/60">
              {account.institution.name} • Last updated {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {formatCurrency(account.currentBalance, { currency: account.currency })}
            </div>
            <div className="text-white/60 text-sm">
              Available: {formatCurrency(account.availableBalance || account.currentBalance, { currency: account.currency })}
            </div>
          </div>
        </div>

        {/* 5 Collapsible Panes */}
        <div className="space-y-6">
          {/* 1. Health Pane */}
          <CollapsiblePane
            title="Account Health"
            icon={Activity}
            isExpanded={expandedPanes.has('health')}
            onToggle={() => togglePane('health')}
            badge={daysInWarning > 0 ? `${daysInWarning} days warning` : 'Healthy'}
            badgeVariant={daysInWarning > 7 ? 'destructive' : daysInWarning > 0 ? 'outline' : 'default'}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-medium text-white/90">Available vs Limit</span>
                </div>
                <div className="space-y-2">
                  <div className="text-lg font-bold text-white">
                    {formatCurrency(account.availableBalance || account.currentBalance, { currency: account.currency })}
                  </div>
                  <div className="text-xs text-white/60">
                    Minimum: {formatCurrency(100, { currency: account.currency })}
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium text-white/90">30-Day Average</span>
                </div>
                <div className="text-lg font-bold text-white">
                  {formatCurrency(thirtyDayAverage, { currency: account.currency })}
                </div>
                <div className="text-xs text-white/60">
                  Based on {balanceHistory.length} data points
                </div>
              </div>

              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className={cn(
                    "w-5 h-5",
                    daysInWarning > 7 ? "text-red-400" : daysInWarning > 0 ? "text-yellow-400" : "text-green-400"
                  )} />
                  <span className="text-sm font-medium text-white/90">Warning Days</span>
                </div>
                <div className="text-lg font-bold text-white">
                  {daysInWarning} days
                </div>
                <div className="text-xs text-white/60">
                  {daysInWarning > 0 ? 'Below threshold' : 'Above minimum balance'}
                </div>
              </div>
            </div>
          </CollapsiblePane>

          {/* 2. Transactions Pane */}
          <CollapsiblePane
            title="Recent Transactions"
            icon={DollarSign}
            isExpanded={expandedPanes.has('transactions')}
            onToggle={() => togglePane('transactions')}
            badge={`${transactions.length} transactions`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-white/60 text-sm">
                  Showing latest {transactions.length} transactions for this account
                </p>
                <Button variant="outline" size="sm">
                  Export CSV
                </Button>
              </div>
              <TransactionList
                transactions={transactions}
                isLoading={false}
                onTransactionClick={(transaction) => console.log('Transaction clicked:', transaction)}
              />
            </div>
          </CollapsiblePane>

          {/* 3. Holdings/Credit Details Pane */}
          <CollapsiblePane
            title={account.category === 'CREDIT' ? 'Credit Card Details' : 'Account Details'}
            icon={CreditCard}
            isExpanded={expandedPanes.has('details')}
            onToggle={() => togglePane('details')}
          >
            {account.category === 'CREDIT' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white/90 font-medium">Payment Information</h4>
                  <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/60">Next Payment Due</span>
                        <span className="text-white">Dec 15, 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Minimum Payment</span>
                        <span className="text-white">{formatCurrency(85.00, { currency: account.currency })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Current APR</span>
                        <span className="text-white">24.99%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-white/90 font-medium">Payoff Calculator</h4>
                  <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/60">Minimum Payment Strategy</span>
                        <span className="text-white">8.2 years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Aggressive Payoff (+$200/mo)</span>
                        <span className="text-white">2.1 years</span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        View Full Calculator
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white/90 font-medium">Account Information</h4>
                  <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/60">Account Number</span>
                        <span className="text-white">••••••{account.last4}</span>
                      </div>
                                             <div className="flex justify-between">
                         <span className="text-white/60">Account Type</span>
                         <span className="text-white">{account.accountType}</span>
                       </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Interest APY</span>
                        <span className="text-white">{account.interestApy ? `${(account.interestApy * 100).toFixed(2)}%` : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-white/90 font-medium">Performance</h4>
                  <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/60">Average Monthly Balance</span>
                        <span className="text-white">{formatCurrency(thirtyDayAverage, { currency: account.currency })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Interest Earned (YTD)</span>
                        <span className="text-white">{formatCurrency(12.45, { currency: account.currency })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CollapsiblePane>

          {/* 4. Biometrics at Spend/Invest Pane */}
          <CollapsiblePane
            title="Biometrics at Transactions"
            icon={Heart}
            isExpanded={expandedPanes.has('biometrics')}
            onToggle={() => togglePane('biometrics')}
            badge="Live monitoring"
            badgeVariant="default"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white/90 font-medium mb-4">Current Biometric Status</h4>
                  <BiometricMonitor compact={false} />
                </div>
                <div>
                  <h4 className="text-white/90 font-medium mb-4">Stress During Transactions</h4>
                  <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                    <div className="space-y-4">
                      {transactionsWithBiometrics.slice(0, 5).map((tx: TransactionWithBiometrics, idx: number) => (
                        <div key={tx.id} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg">
                          <div>
                            <div className="text-white font-medium">{tx.merchantName}</div>
                            <div className="text-white/60 text-sm">{new Date(tx.date).toLocaleDateString()}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-white">{formatCurrency(tx.amount, { currency: tx.currency })}</div>
                            <div className="text-sm">
                              <span className={cn(
                                "inline-block px-2 py-1 rounded-full text-xs",
                                tx.stressAtTime >= 70 ? "bg-red-500/20 text-red-400" :
                                tx.stressAtTime >= 40 ? "bg-yellow-500/20 text-yellow-400" :
                                "bg-green-500/20 text-green-400"
                              )}>
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

          {/* 5. Insights Pane */}
          <CollapsiblePane
            title="Personal Insights"
            icon={TrendingUp}
            isExpanded={expandedPanes.has('insights')}
            onToggle={() => togglePane('insights')}
            badge="AI-powered"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                <h4 className="text-white/90 font-medium mb-3">Spending Patterns</h4>
                <div className="space-y-2">
                  <p className="text-white/70 text-sm">
                    Your highest stress transactions typically occur on weekdays between 2-4 PM.
                  </p>
                  <p className="text-white/70 text-sm">
                    Consider setting spending alerts during these high-stress periods.
                  </p>
                </div>
              </div>
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                <h4 className="text-white/90 font-medium mb-3">Recommendations</h4>
                <div className="space-y-2">
                  <p className="text-white/70 text-sm">
                    Your account balance is healthy. Consider moving excess funds to a high-yield savings account.
                  </p>
                  <p className="text-white/70 text-sm">
                    You could earn an additional ${formatCurrency(45.50, { currency: account.currency })} annually with a 2.5% APY.
                  </p>
                </div>
              </div>
            </div>
          </CollapsiblePane>
        </div>
      </div>
    </div>
  );
};

export default AccountOverview; 