import { Transaction, Account } from '@/types/shared';

export type { Transaction, Account } from '@/types/shared';

export const mockData = {
  accounts: [
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
    },
    {
      id: 'acc_004',
      type: 'Investment',
      nickname: 'Portfolio',
      balance: 45600.25,
      availableBalance: 45600.25,
      currency: 'USD'
    },
    {
      id: 'acc_005',
      type: 'Checking',
      nickname: 'Chase Banking',
      balance: 8920.14,
      availableBalance: 8920.14,
      currency: 'USD'
    },
    {
      id: 'acc_006',
      type: 'Retirement',
      nickname: '401(k)',
      balance: 174250.67,
      availableBalance: 174250.67,
      currency: 'USD'
    },
    {
      id: 'acc_007',
      type: 'Retirement',
      nickname: 'Traditional IRA',
      balance: 62340.22,
      availableBalance: 62340.22,
      currency: 'USD'
    },
    {
      id: 'acc_008',
      type: 'Savings',
      nickname: '502A Health Savings',
      balance: 12450.11,
      availableBalance: 12450.11,
      currency: 'USD'
    },
    {
      id: 'acc_009',
      type: 'Education',
      nickname: 'College Savings 529',
      balance: 18230.89,
      availableBalance: 18230.89,
      currency: 'USD'
    },
    {
      id: 'acc_010',
      type: 'Savings',
      nickname: 'Disaster Savings',
      balance: 8500.00,
      availableBalance: 8500.00,
      currency: 'USD'
    }
  ] as Account[],

  transactions: [
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
    },
    {
      id: 'txn_009',
      merchant: 'Netflix',
      category: { name: 'Entertainment', color: '#E50914' },
      amount: -15.99,
      date: '2025-06-11T09:00:00Z',
      status: 'completed' as const
    },
    {
      id: 'txn_010',
      merchant: 'Uber',
      category: { name: 'Transportation', color: '#000000' },
      amount: -23.45,
      date: '2025-06-11T18:30:00Z',
      status: 'completed' as const
    },
    {
      id: 'txn_011',
      merchant: 'Home Depot',
      category: { name: 'Home Improvement', color: '#FF8C00' },
      amount: -120.33,
      date: '2025-06-10T15:45:00Z',
      status: 'completed' as const,
      trackingNumber: '1ZHD123456789',
      shippingProvider: 'UPS' as const,
      deliveryStatus: 'Delivered' as const
    },
    {
      id: 'txn_012',
      merchant: 'Spotify',
      category: { name: 'Entertainment', color: '#1DB954' },
      amount: -9.99,
      date: '2025-06-10T05:30:00Z',
      status: 'completed' as const
    },
    {
      id: 'txn_013',
      merchant: 'Walmart',
      category: { name: 'Groceries', color: '#34C759' },
      amount: -58.12,
      date: '2025-06-09T20:10:00Z',
      status: 'completed' as const,
      trackingNumber: 'WM123456789US',
      shippingProvider: 'USPS' as const,
      deliveryStatus: 'In Transit' as const
    },
    {
      id: 'txn_014',
      merchant: 'Lowe\'s',
      category: { name: 'Home Improvement', color: '#007AFF' },
      amount: -240.00,
      date: '2025-06-09T13:00:00Z',
      status: 'completed' as const
    },
    {
      id: 'txn_015',
      merchant: 'DoorDash',
      category: { name: 'Dining', color: '#FF3B30' },
      amount: -34.56,
      date: '2025-06-08T23:15:00Z',
      status: 'completed' as const,
      trackingNumber: 'DD123456',
      shippingProvider: 'FedEx' as const,
      deliveryStatus: 'Delivered' as const
    },
    {
      id: 'txn_016',
      merchant: 'CVS Pharmacy',
      category: { name: 'Health', color: '#8E44AD' },
      amount: -12.89,
      date: '2025-06-08T18:40:00Z',
      status: 'completed' as const
    },
    {
      id: 'txn_017',
      merchant: 'Lyft',
      category: { name: 'Transportation', color: '#FF00BF' },
      amount: -18.75,
      date: '2025-06-07T21:10:00Z',
      status: 'completed' as const
    },
    {
      id: 'txn_018',
      merchant: 'eBay',
      category: { name: 'Shopping', color: '#FF9500' },
      amount: -65.00,
      date: '2025-06-07T09:22:00Z',
      status: 'completed' as const,
      trackingNumber: 'EBAY987654321',
      shippingProvider: 'UPS' as const,
      deliveryStatus: 'Out for Delivery' as const
    },
    {
      id: 'txn_019',
      merchant: 'Chipotle',
      category: { name: 'Dining', color: '#FF3B30' },
      amount: -11.25,
      date: '2025-06-06T13:37:00Z',
      status: 'completed' as const
    },
    {
      id: 'txn_020',
      merchant: 'Nike.com',
      category: { name: 'Shopping', color: '#FF9500' },
      amount: -120.00,
      date: '2025-06-06T16:05:00Z',
      status: 'completed' as const,
      trackingNumber: '1ZNIKE123456',
      shippingProvider: 'UPS' as const,
      deliveryStatus: 'In Transit' as const
    },
    {
      id: 'txn_021',
      merchant: 'Paycheck',
      category: { name: 'Income', color: '#34C759' },
      amount: 3250.00,
      date: '2025-06-05T00:00:00Z',
      status: 'completed' as const
    },
    {
      id: 'txn_022',
      merchant: 'Costco',
      category: { name: 'Groceries', color: '#34C759' },
      amount: -210.45,
      date: '2025-06-05T19:40:00Z',
      status: 'completed' as const
    },
    {
      id: 'txn_023',
      merchant: 'Apple Music',
      category: { name: 'Entertainment', color: '#E50914' },
      amount: -10.99,
      date: '2025-06-04T04:20:00Z',
      status: 'completed' as const
    },
    {
      id: 'txn_024',
      merchant: 'Best Buy',
      category: { name: 'Electronics', color: '#007AFF' },
      amount: -79.99,
      date: '2025-06-04T17:55:00Z',
      status: 'completed' as const,
      trackingNumber: 'BB987654321',
      shippingProvider: 'FedEx' as const,
      deliveryStatus: 'Delivered' as const
    },
    {
      id: 'txn_025',
      merchant: 'Grocery Store',
      category: { name: 'Groceries', color: '#34C759' },
      amount: -92.10,
      date: '2025-06-03T11:30:00Z',
      status: 'completed' as const
    },
    {
      id: 'txn_026',
      merchant: 'Amazon',
      category: { name: 'Shopping', color: '#FF9500' },
      amount: -32.45,
      date: '2025-06-03T14:05:00Z',
      status: 'completed' as const,
      trackingNumber: 'AMZ123987456',
      shippingProvider: 'UPS' as const,
      deliveryStatus: 'In Transit' as const
    },
    {
      id: 'txn_027',
      merchant: 'Subway',
      category: { name: 'Dining', color: '#FF3B30' },
      amount: -8.90,
      date: '2025-06-02T12:00:00Z',
      status: 'completed' as const
    },
    {
      id: 'txn_028',
      merchant: 'Apple.com',
      category: { name: 'Electronics', color: '#007AFF' },
      amount: -299.00,
      date: '2025-06-02T07:30:00Z',
      status: 'completed' as const,
      trackingNumber: 'APL123456789',
      shippingProvider: 'UPS' as const,
      deliveryStatus: 'Out for Delivery' as const
    },
    {
      id: 'txn_029',
      merchant: 'Gym Membership',
      category: { name: 'Health', color: '#8E44AD' },
      amount: -55.00,
      date: '2025-06-01T02:30:00Z',
      status: 'completed' as const
    },
    {
      id: 'txn_030',
      merchant: 'Whole Foods Market',
      category: { name: 'Groceries', color: '#34C759' },
      amount: -140.25,
      date: '2025-06-01T18:15:00Z',
      status: 'completed' as const,
      trackingNumber: 'WF123456',
      shippingProvider: 'USPS' as const,
      deliveryStatus: 'Delivered' as const
    }
  ] as Transaction[]
}; 