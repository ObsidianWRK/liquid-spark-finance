import React, { useState } from 'react';
import { UnifiedTransactionList } from '@/features/transactions/components/UnifiedTransactionList';
import MobileTransactionScreen from '@/screens/MobileTransactionScreen';
import { Smartphone, Tablet, Monitor } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { SubscriptionsPanel } from '@/features/subscriptions/components/SubscriptionsPanel';

const TransactionDemo: React.FC = () => {
  const [view, setView] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Sample transactions data
  const transactions = [
    {
      id: '1',
      merchant: 'Whole Foods Market',
      category: 'Groceries',
      amount: -127.43,
      date: '2025-06-14',
      time: '2:34 PM',
      status: 'completed' as const,
      paymentMethod: 'Vueni Card •••• 4242',
    },
    {
      id: '2',
      merchant: 'Apple Store',
      category: 'Electronics',
      amount: -899.0,
      date: '2025-06-14',
      time: '11:15 AM',
      status: 'completed' as const,
      paymentMethod: 'Vueni Card •••• 4242',
      shipping: {
        trackingNumber: '1Z999AA1234567890',
        provider: 'UPS' as const,
        status: 'In Transit' as const,
        estimatedDelivery: '2025-06-17',
      },
    },
    {
      id: '3',
      merchant: 'Amazon',
      category: 'Shopping',
      amount: -156.78,
      date: '2025-06-14',
      time: '9:42 AM',
      status: 'completed' as const,
      paymentMethod: 'Vueni Card •••• 4242',
      shipping: {
        trackingNumber: '771234567890',
        provider: 'FedEx' as const,
        status: 'Delivered' as const,
      },
    },
    {
      id: '4',
      merchant: 'Salary Deposit',
      category: 'Income',
      amount: 3250.0,
      date: '2025-06-13',
      time: '12:00 AM',
      status: 'completed' as const,
      reference: 'PAYROLL-2025-06-13',
    },
    {
      id: '5',
      merchant: 'Best Buy',
      category: 'Electronics',
      amount: -234.99,
      date: '2025-06-13',
      time: '4:22 PM',
      status: 'pending' as const,
      paymentMethod: 'Vueni Card •••• 4242',
      shipping: {
        trackingNumber: '940010020079323456789',
        provider: 'USPS' as const,
        status: 'Out for Delivery' as const,
        estimatedDelivery: '2025-06-14',
      },
    },
    {
      id: '6',
      merchant: 'Starbucks',
      category: 'Coffee',
      amount: -6.85,
      date: '2025-06-13',
      time: '8:15 AM',
      status: 'completed' as const,
      paymentMethod: 'Vueni Card •••• 4242',
    },
    {
      id: '7',
      merchant: 'Target',
      category: 'Shopping',
      amount: -89.42,
      date: '2025-06-12',
      time: '6:30 PM',
      status: 'completed' as const,
      paymentMethod: 'Vueni Card •••• 4242',
      shipping: {
        trackingNumber: '1Z12345E0123456789',
        provider: 'UPS' as const,
        status: 'Delivered' as const,
      },
    },
  ];

  const ViewToggle = () => (
    <div className="flex items-center gap-2 p-1 bg-white/[0.05] rounded-xl">
      <button
        onClick={() => setView('mobile')}
        className={cn(
          'px-4 py-2 rounded-lg flex items-center gap-2 transition-all',
          view === 'mobile'
            ? 'bg-white/[0.1] text-white'
            : 'text-white/60 hover:text-white/80'
        )}
      >
        <Smartphone className="w-4 h-4" />
        Mobile
      </button>
      <button
        onClick={() => setView('tablet')}
        className={cn(
          'px-4 py-2 rounded-lg flex items-center gap-2 transition-all',
          view === 'tablet'
            ? 'bg-white/[0.1] text-white'
            : 'text-white/60 hover:text-white/80'
        )}
      >
        <Tablet className="w-4 h-4" />
        Tablet
      </button>
      <button
        onClick={() => setView('desktop')}
        className={cn(
          'px-4 py-2 rounded-lg flex items-center gap-2 transition-all',
          view === 'desktop'
            ? 'bg-white/[0.1] text-white'
            : 'text-white/60 hover:text-white/80'
        )}
      >
        <Monitor className="w-4 h-4" />
        Desktop
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Transaction Components
            </h1>
            <p className="text-white/60">
              Fortune 500-level polish for financial applications
            </p>
          </div>
          <ViewToggle />
        </div>

        {/* Device Frame */}
        <div
          className={cn(
            'mx-auto transition-all duration-500',
            view === 'mobile' && 'max-w-[390px]',
            view === 'tablet' && 'max-w-[768px]',
            view === 'desktop' && 'max-w-full'
          )}
        >
          {/* Mobile View */}
          {view === 'mobile' && (
            <div className="relative">
              {/* iPhone Frame */}
              <div className="relative mx-auto bg-gray-900 rounded-[2.5rem] p-4 shadow-2xl">
                <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-1 h-16 bg-gray-800 rounded-r-lg" />
                <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-1 h-12 bg-gray-800 rounded-l-lg" />
                <div className="bg-black rounded-[2rem] overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-2xl" />
                  {/* Screen */}
                  <div className="relative h-[844px] overflow-hidden">
                    <MobileTransactionScreen />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tablet View */}
          {view === 'tablet' && (
            <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl">
              <div className="bg-black rounded-xl overflow-hidden">
                <UnifiedTransactionList
                  transactions={transactions.map((t) => ({
                    id: t.id,
                    merchant: t.merchant,
                    category: { name: t.category, color: '#516AC8' }, // Vueni Sapphire Dust
                    amount: t.amount,
                    date: t.date,
                    status: t.status,
                    scores: {
                      health: Math.floor(Math.random() * 100),
                      eco: Math.floor(Math.random() * 100),
                      financial: Math.floor(Math.random() * 100),
                    },
                  }))}
                  variant="modern"
                  currency="USD"
                  features={{
                    showScores: true,
                    showCategories: true,
                    searchable: true,
                    filterable: true,
                  }}
                  onTransactionClick={(t) => {
                    /* Transaction selected */
                  }}
                />
              </div>
            </div>
          )}

          {/* Desktop View */}
          {view === 'desktop' && (
            <UnifiedTransactionList
              transactions={transactions.map((t) => ({
                id: t.id,
                merchant: t.merchant,
                category: { name: t.category, color: '#516AC8' }, // Vueni Sapphire Dust
                amount: t.amount,
                date: t.date,
                status: t.status,
                shipping: t.shipping && {
                  trackingNumber: t.shipping.trackingNumber,
                  provider: t.shipping.provider,
                  status: t.shipping.status,
                },
              }))}
              variant="enterprise"
              currency="USD"
              features={{
                showScores: false,
                showCategories: true,
                searchable: true,
                filterable: true,
                sortable: true,
              }}
            />
          )}
        </div>

        {/* Subscriptions Panel */}
        <div className="mt-6 sm:mt-8 md:mt-10 px-4 sm:px-6">
          <SubscriptionsPanel />
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mt-8 sm:mt-10 md:mt-12">
          <div
            className="p-4 sm:p-5 md:p-6 bg-white/[0.02] rounded-xl border border-white/[0.08] 
                          card-hover"
          >
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
              Clean Design
            </h3>
            <p className="text-white/60 text-sm sm:text-base">
              Minimal visual noise with focus on content. Every pixel serves a
              purpose.
            </p>
          </div>

          <div
            className="p-4 sm:p-5 md:p-6 bg-white/[0.02] rounded-xl border border-white/[0.08]
                          card-hover"
          >
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
              Smart UX
            </h3>
            <p className="text-white/60 text-sm sm:text-base">
              Inline shipping tracking, smart date formatting, and contextual
              information.
            </p>
          </div>

          <div
            className="p-4 sm:p-5 md:p-6 bg-white/[0.02] rounded-xl border border-white/[0.08]
                          card-hover
                          sm:col-span-2 lg:col-span-1"
          >
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
              Performance
            </h3>
            <p className="text-white/60 text-sm sm:text-base">
              Optimized for large datasets with virtualization support and
              minimal rerenders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDemo;
