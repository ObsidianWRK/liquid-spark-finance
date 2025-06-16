import React, { useState, Suspense, lazy, useEffect } from 'react';
import BalanceCard from '@/components/BalanceCard';
import QuickActions from '@/components/QuickActions';
import TransactionList from '@/components/TransactionList';
import AccountCard from '@/components/AccountCard';
import Navigation from '@/components/Navigation';
import ChatDrawer from '@/components/ai/ChatDrawer';
import Profile from './Profile';
import '../styles/glass.css';
import '../styles/liquid-glass-wwdc.css';
import '../styles/performance-optimized.css';

// Lazy load heavy components for better initial load performance
const OptimizedRefinedInsightsPage = lazy(() => import('@/components/insights/OptimizedRefinedInsightsPage'));
const RefinedInsightsPage = lazy(() => import('@/components/insights/RefinedInsightsPage'));
const BudgetReportsPage = lazy(() => import('@/components/reports/BudgetReportsPage'));
const WrappedPage = lazy(() => import('@/components/wrapped/WrappedPage'));

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [performanceMode, setPerformanceMode] = useState(false);

  // Performance detection
  useEffect(() => {
    const detectPerformance = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isLowEnd = navigator.hardwareConcurrency ? navigator.hardwareConcurrency < 4 : isMobile;
      
      if (isLowEnd || isMobile) {
        setPerformanceMode(true);
        document.body.classList.add('performance-mode', 'low-end-device');
      }
    };

    detectPerformance();
  }, []);

  // Sample banking data
  const mainAccount = {
    id: 'acc_001',
    type: 'Checking',
    nickname: 'Main Account',
    balance: 12450.00,
    availableBalance: 11200.00,
    currency: 'USD',
    trend: 'up' as const,
    trendPercentage: 12.5
  };

  const accounts = [
    {
      id: 'acc_001',
      type: 'Checking',
      nickname: 'Main Account',
      balance: 12450.00,
      availableBalance: 11200.00,
      currency: 'USD'
    },
    {
      id: 'acc_002',
      type: 'Savings',
      nickname: 'Emergency Fund',
      balance: 25780.50,
      availableBalance: 25780.50,
      currency: 'USD'
    },
    {
      id: 'acc_003',
      type: 'Credit Card',
      nickname: 'Rewards Card',
      balance: -1245.30,
      availableBalance: 8754.70,
      currency: 'USD'
    }
  ];

  const transactions = [
    {
      id: 'txn_001',
      merchant: 'Whole Foods Market',
      category: { name: 'Groceries', color: '#34C759' },
      amount: -127.43,
      date: '2025-06-14T10:30:00Z',
      status: 'completed' as const
    },
    {
      id: 'txn_002',
      merchant: 'Apple Store',
      category: { name: 'Electronics', color: '#007AFF' },
      amount: -899.00,
      date: '2025-06-14T08:15:00Z',
      status: 'completed' as const,
      trackingNumber: '1Z999AA1234567890',
      shippingProvider: 'UPS' as const,
      deliveryStatus: 'In Transit' as const
    },
    {
      id: 'txn_003',
      merchant: 'Amazon',
      category: { name: 'Shopping', color: '#FF9500' },
      amount: -156.78,
      date: '2025-06-14T12:45:00Z',
      status: 'completed' as const,
      trackingNumber: '771234567890',
      shippingProvider: 'FedEx' as const,
      deliveryStatus: 'Delivered' as const
    },
    {
      id: 'txn_004',
      merchant: 'Salary Deposit',
      category: { name: 'Income', color: '#34C759' },
      amount: 3250.00,
      date: '2025-06-13T09:00:00Z',
      status: 'completed' as const
    },
    {
      id: 'txn_005',
      merchant: 'Best Buy',
      category: { name: 'Electronics', color: '#007AFF' },
      amount: -234.99,
      date: '2025-06-13T16:20:00Z',
      status: 'completed' as const,
      trackingNumber: '9400110200793123456789',
      shippingProvider: 'USPS' as const,
      deliveryStatus: 'Out for Delivery' as const
    },
    {
      id: 'txn_006',
      merchant: 'Starbucks',
      category: { name: 'Coffee', color: '#FF9500' },
      amount: -6.85,
      date: '2025-06-13T07:45:00Z',
      status: 'completed' as const
    },
    {
      id: 'txn_007',
      merchant: 'Target',
      category: { name: 'Shopping', color: '#FF3B30' },
      amount: -89.42,
      date: '2025-06-12T14:30:00Z',
      status: 'completed' as const,
      trackingNumber: '1Z12345E0123456789',
      shippingProvider: 'UPS' as const,
      deliveryStatus: 'Delivered' as const
    },
    {
      id: 'txn_008',
      merchant: 'Gas Station',
      category: { name: 'Transportation', color: '#FF3B30' },
      amount: -45.20,
      date: '2025-06-12T18:30:00Z',
      status: 'pending' as const
    }
  ];

  const recentTransactions = [
    { id: 'txn_001', merchant: 'Whole Foods', amount: -127.43, date: '2025-06-14' },
    { id: 'txn_002', merchant: 'Apple Store', amount: -899.00, date: '2025-06-14' },
    { id: 'txn_003', merchant: 'Salary', amount: 3250.00, date: '2025-06-13' }
  ];

  // Loading component
  const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-optimized-pulse">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'accounts':
        return (
          <div className="space-y-4 optimized-text">
            <h2 className="text-2xl font-bold text-white mb-6">Your Accounts</h2>
            <div className="optimized-grid">
              {accounts.map((account) => (
                <div key={account.id} className={performanceMode ? "liquid-glass-card-optimized p-6" : "liquid-glass-card p-6"}>
                  <AccountCard 
                    account={account}
                    recentTransactions={recentTransactions}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'transactions':
        return (
          <div className="optimized-text">
            <h2 className="text-2xl font-bold text-white mb-6">Transaction History</h2>
            <div className={performanceMode ? "liquid-glass-card-optimized p-4 sm:p-6" : "liquid-glass-card p-4 sm:p-6"}>
              <TransactionList transactions={transactions} currency="USD" enhanced={!performanceMode} />
            </div>
          </div>
        );
      
      case 'insights':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            {performanceMode ? (
              <OptimizedRefinedInsightsPage transactions={transactions} accounts={accounts} />
            ) : (
              <RefinedInsightsPage transactions={transactions} accounts={accounts} />
            )}
          </Suspense>
        );
      
      case 'reports':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <BudgetReportsPage />
          </Suspense>
        );
      
      case 'wrapped':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <WrappedPage />
          </Suspense>
        );
      
      case 'profile':
        return <Profile />;
      
      default:
        return (
          <div className="space-y-6 optimized-text contain-layout">
            {/* Main Cards Grid - Responsive Layout */}
            <div className="optimized-grid">
              <div className={`${performanceMode ? "liquid-glass-card-optimized" : "liquid-glass-card"} p-4 sm:p-6 lg:col-span-2 xl:col-span-2 promote-layer`}>
                <BalanceCard
                  accountType={mainAccount.type}
                  nickname={mainAccount.nickname}
                  balance={mainAccount.balance}
                  availableBalance={mainAccount.availableBalance}
                  currency={mainAccount.currency}
                  trend={mainAccount.trend}
                  trendPercentage={mainAccount.trendPercentage}
                />
              </div>
              
              <div className={`${performanceMode ? "liquid-glass-card-optimized" : "liquid-glass-card"} p-4 sm:p-6 promote-layer`}>
                <QuickActions />
              </div>
            </div>
            
            <div className={`${performanceMode ? "liquid-glass-card-optimized" : "liquid-glass-card"} p-4 sm:p-6 promote-layer`}>
              <h2 className="text-xl font-bold text-white mb-4">Recent Transactions</h2>
              <TransactionList 
                transactions={transactions.slice(0, performanceMode ? 3 : 5)} 
                currency="USD" 
                enhanced={!performanceMode} 
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen text-white smooth-scroll ${performanceMode ? 'performance-mode low-end-device' : ''}`}>
      {/* Optimized Background */}
      <div className={`fixed inset-0 z-0 ${performanceMode ? 'bg-black' : 'optimized-bg'}`} />
      
      {/* Main Content Container - Responsive Layout */}
      <div className="relative z-10 min-h-screen pb-24">
        <div className="container mx-auto px-4 py-8 max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl">
          {/* Header */}
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-wide">
              Vueni
            </h1>
            <p className="text-white/60 text-sm sm:text-base lg:text-lg">Modern Financial Management</p>
          </div>

          {/* Dynamic Content */}
          <main className="space-y-6">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Chat Drawer */}
      <ChatDrawer />
    </div>
  );
};

export default Index;
