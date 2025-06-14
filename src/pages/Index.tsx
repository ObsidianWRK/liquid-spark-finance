
import React, { useState } from 'react';
import BalanceCard from '@/components/BalanceCard';
import QuickActions from '@/components/QuickActions';
import TransactionList from '@/components/TransactionList';
import AccountCard from '@/components/AccountCard';
import Navigation from '@/components/Navigation';
import InsightsPage from '@/components/insights/InsightsPage';
import ChatDrawer from '@/components/ai/ChatDrawer';
import BudgetReportsPage from '@/components/reports/BudgetReportsPage';
import WrappedPage from '@/components/wrapped/WrappedPage';
import '../styles/glass.css';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

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

  const renderContent = () => {
    switch (activeTab) {
      case 'accounts':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">Your Accounts</h2>
            <div className="grid grid-cols-1 gap-4">
              {accounts.map((account) => (
                <AccountCard 
                  key={account.id} 
                  account={account}
                  recentTransactions={recentTransactions}
                />
              ))}
            </div>
          </div>
        );
      
      case 'transactions':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Transaction History</h2>
            <TransactionList transactions={transactions} currency="USD" />
          </div>
        );
      
      case 'insights':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Financial Insights</h2>
            <InsightsPage transactions={transactions} accounts={accounts} />
          </div>
        );
      
      case 'reports':
        return <BudgetReportsPage />;
      
      case 'wrapped':
        return <WrappedPage />;
      
      case 'profile':
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-white/70 text-lg">Profile Settings</p>
          </div>
        );
      
      default:
        return (
          <>
            <BalanceCard
              accountType={mainAccount.type}
              nickname={mainAccount.nickname}
              balance={mainAccount.balance}
              availableBalance={mainAccount.availableBalance}
              currency={mainAccount.currency}
              trend={mainAccount.trend}
              trendPercentage={mainAccount.trendPercentage}
            />
            
            <QuickActions />
            
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-4">Recent Transactions</h2>
              <TransactionList transactions={transactions.slice(0, 5)} currency="USD" />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0B] via-[#1C1C1E] to-[#0A0A0B] relative overflow-hidden">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      
      {/* Main Content */}
      <div className="relative z-10 px-4 pt-12 pb-24 max-w-md mx-auto">
        {renderContent()}
      </div>

      {/* AI Chat Drawer */}
      <ChatDrawer userContext={{ accounts, transactions }} />

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
