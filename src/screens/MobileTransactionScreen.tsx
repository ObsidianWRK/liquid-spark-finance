import React, { useState } from 'react';
import {
  Search,
  ArrowLeft,
  MoreHorizontal,
  ChevronRight,
  Truck,
  Package,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const MobileTransactionScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock transaction data optimized for mobile
  const transactions = [
    {
      id: '1',
      merchant: 'Whole Foods',
      category: 'Groceries',
      amount: -127.43,
      date: '2025-06-14',
      time: '2:34 PM',
      status: 'completed' as const,
      icon: '🛒',
    },
    {
      id: '2',
      merchant: 'Apple Store',
      category: 'Electronics',
      amount: -899.0,
      date: '2025-06-14',
      time: '11:15 AM',
      status: 'completed' as const,
      icon: '🍎',
      shipping: {
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
      icon: '📦',
      shipping: { status: 'Delivered' as const },
    },
    {
      id: '4',
      merchant: 'Salary',
      category: 'Income',
      amount: 3250.0,
      date: '2025-06-13',
      time: '12:00 AM',
      status: 'completed' as const,
      icon: '💰',
    },
    {
      id: '5',
      merchant: 'Starbucks',
      category: 'Coffee',
      amount: -6.85,
      date: '2025-06-13',
      time: '8:15 AM',
      status: 'completed' as const,
      icon: '☕',
    },
    {
      id: '6',
      merchant: 'Uber',
      category: 'Transportation',
      amount: -23.45,
      date: '2025-06-12',
      time: '6:30 PM',
      status: 'pending' as const,
      icon: '🚗',
    },
  ];

  const formatAmount = (amount: number) => {
    const formatted = Math.abs(amount).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
    return amount < 0 ? `-${formatted}` : `+${formatted}`;
  };

  const getShippingIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'Out for Delivery':
        return <Truck className="w-3 h-3 text-blue-500" />;
      case 'In Transit':
        return <Package className="w-3 h-3 text-orange-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const groupedTransactions = transactions.reduce(
    (groups, transaction) => {
      const dateKey = formatDate(transaction.date);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction);
      return groups;
    },
    {} as Record<string, typeof transactions>
  );

  return (
    <div className="h-full bg-black text-white overflow-hidden">
      {/* Status Bar */}
      <div className="h-11 bg-black relative">
        <div className="absolute top-2 left-6 text-white text-sm font-medium">
          9:41
        </div>
        <div className="absolute top-2 right-6 flex items-center gap-1">
          <div className="w-6 h-3 border border-white rounded-sm">
            <div className="w-4 h-1 bg-white rounded-sm m-0.5"></div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="px-4 pt-2 pb-4">
        <div className="flex items-center justify-between mb-6">
          <button className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-blue-500" />
          </button>
          <h1 className="text-lg font-semibold">Transactions</h1>
          <button className="p-2 -mr-2">
            <MoreHorizontal className="w-6 h-6 text-blue-500" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border-0 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Transaction List */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(groupedTransactions).map(([date, dateTransactions]) => (
          <div key={date} className="mb-6">
            {/* Date Header */}
            <div className="px-4 py-2">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                {date}
              </h3>
            </div>

            {/* Transactions */}
            <div className="bg-gray-900 mx-4 rounded-xl overflow-hidden">
              {dateTransactions.map((transaction, index) => (
                <div key={transaction.id}>
                  <div className="flex items-center gap-3 p-4">
                    {/* Icon */}
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-lg flex-shrink-0">
                      {transaction.icon}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-white text-sm truncate">
                          {transaction.merchant}
                        </h4>
                        <span
                          className={cn(
                            'font-semibold text-sm',
                            transaction.amount > 0
                              ? 'text-green-400'
                              : 'text-white'
                          )}
                        >
                          {formatAmount(transaction.amount)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            {transaction.category}
                          </span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-400">
                            {transaction.time}
                          </span>
                          {transaction.status === 'pending' && (
                            <>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-yellow-500">
                                Pending
                              </span>
                            </>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      </div>

                      {/* Shipping Status */}
                      {transaction.shipping && (
                        <div className="flex items-center gap-2 mt-2 p-2 bg-gray-800 rounded-md">
                          {getShippingIcon(transaction.shipping.status)}
                          <span className="text-xs text-gray-300">
                            {transaction.shipping.status}
                          </span>
                          {transaction.shipping.estimatedDelivery &&
                            transaction.shipping.status !== 'Delivered' && (
                              <>
                                <span className="text-xs text-gray-500">•</span>
                                <span className="text-xs text-gray-500">
                                  ETA{' '}
                                  {new Date(
                                    transaction.shipping.estimatedDelivery
                                  ).toLocaleDateString()}
                                </span>
                              </>
                            )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  {index < dateTransactions.length - 1 && (
                    <div className="ml-14 mr-4 border-b border-gray-800" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Home Indicator */}
      <div className="flex justify-center pb-2">
        <div className="w-32 h-1 bg-gray-600 rounded-full"></div>
      </div>
    </div>
  );
};

export default MobileTransactionScreen;
