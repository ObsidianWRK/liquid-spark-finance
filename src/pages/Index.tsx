import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import AccountCard from '@/components/AccountCard';
import BalanceCard from '@/components/BalanceCard';
import AppleTransactionList from '@/components/transactions/AppleTransactionList';
import LiquidGlassTopMenuBar from '@/components/LiquidGlassTopMenuBar';
import CreditScoreCard from '@/components/credit/CreditScoreCard';
import NewInsightsPage from '@/components/insights/NewInsightsPage';
import WrappedPage from '@/components/wrapped/WrappedPage';
import BudgetReportsPage from '@/components/reports/BudgetReportsPage';
import Profile from './Profile';
import ChatDrawer from '@/components/ai/ChatDrawer';
import NetWorthSummary from '@/components/financial/NetWorthSummary';
import { mockData } from '@/services/mockData';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [performanceMode, setPerformanceMode] = useState(false);
  const { liquidSettings } = usePerformanceOptimization();
  const [searchParams] = useSearchParams();

  // Handle URL tab parameter
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['dashboard', 'accounts', 'transactions', 'insights', 'reports', 'wrapped', 'profile'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  // Performance detection
  useEffect(() => {
    const checkPerformance = () => {
      const start = performance.now();
      requestAnimationFrame(() => {
        const duration = performance.now() - start;
        if (duration > 16.67) { // More than one frame at 60fps
          setPerformanceMode(true);
        }
      });
    };

    checkPerformance();
  }, []);

  // Calculate main account data for BalanceCard
  const mainAccount = mockData.accounts[0]; // Main checking account

  const renderContent = useCallback(() => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            {/* Enhanced Navigation Menu Bar */}
            <div className="w-full">
              <LiquidGlassTopMenuBar />
            </div>
            
            {/* Balance Overview Section */}
            <div className="w-full space-y-6 pt-20">
              <div className="w-full">
                <BalanceCard 
                  accountType={mainAccount.type}
                  nickname={mainAccount.nickname}
                  balance={mainAccount.balance}
                  availableBalance={mainAccount.availableBalance}
                  currency={mainAccount.currency}
                  trend="up"
                  trendPercentage={12.5}
                />
              </div>
              
              {/* Credit Score and Account Cards Grid */}
              <div className="w-full space-y-6">
                {/* Credit Score Card */}
                <div className="w-full">
                  <CreditScoreCard />
                </div>
                
                {/* Account Cards Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {mockData.accounts.map((account) => (
                    <AccountCard key={account.id} account={account} />
                  ))}
                </div>
              </div>
              
              {/* Recent Transactions */}
              <div className="w-full">
                <AppleTransactionList 
                  transactions={mockData.transactions.slice(0, 15)}
                  currency="USD" 
                />
              </div>
            </div>
          </>
        );
      case 'accounts':
        return (
          <div className="w-full space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">All Accounts</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {mockData.accounts.map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
            </div>
            
            {/* Net Worth Summary */}
            <NetWorthSummary accounts={mockData.accounts} className="mt-8" />
          </div>
        );
      case 'transactions':
        return (
          <div className="w-full">
            <AppleTransactionList 
              transactions={mockData.transactions} 
              currency="USD"
            />
          </div>
        );
      case 'insights':
        return (
          <div className="w-full">
            <NewInsightsPage 
              transactions={mockData.transactions} 
              accounts={mockData.accounts} 
            />
          </div>
        );
      case 'reports':
        return (
          <div className="w-full">
            <BudgetReportsPage />
          </div>
        );
      case 'wrapped':
        return (
          <div className="w-full">
            <WrappedPage />
          </div>
        );
      case 'profile':
        return (
          <div className="w-full">
            <Profile />
          </div>
        );
      default:
        return (
          <div className="w-full">
            <h1 className="text-2xl font-bold text-white">Welcome to Vueni</h1>
          </div>
        );
    }
  }, [activeTab, mainAccount]);

  return (
    <div className={`min-h-screen w-full text-white smooth-scroll ${performanceMode ? 'performance-mode low-end-device' : ''}`}>
      {/* Optimized Background */}
      <div className={`fixed inset-0 z-0 ${performanceMode ? 'bg-black' : 'optimized-bg'}`} />
      
      {/* Main Content Container - Full Screen Layout */}
      <div className="relative z-10 min-h-screen w-full pb-24">
        <div className="w-full px-4 pt-24 pb-8 sm:px-6 lg:px-8 xl:px-12">
          {/* Header - Only show on dashboard */}
          {activeTab === 'dashboard' && (
            <div className="text-center space-y-4 mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-wide">
                Vueni
              </h1>
              <p className="text-white/60 text-sm sm:text-base lg:text-lg">Intelligence You Can Bank On</p>
            </div>
          )}

          {/* Dynamic Content */}
          <main className="w-full space-y-6">
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
