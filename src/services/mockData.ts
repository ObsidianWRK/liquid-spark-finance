export interface Account {
  id: string;
  type: string;
  nickname: string;
  balance: number;
  availableBalance: number;
  currency: string;
}

export interface Transaction {
  id: string;
  merchant: string;
  category: {
    name: string;
    color: string;
  };
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  trackingNumber?: string;
  shippingProvider?: 'UPS' | 'FedEx' | 'USPS';
  deliveryStatus?: 'In Transit' | 'Delivered' | 'Out for Delivery';
}

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
    }
  ] as Transaction[]
}; 