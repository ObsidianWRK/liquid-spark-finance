export interface TransactionCategory {
  name: string;
  color: string;
}

export type ShippingProvider = 'UPS' | 'FedEx' | 'USPS';
export type DeliveryStatus = 'In Transit' | 'Delivered' | 'Out for Delivery';

export interface Transaction {
  id: string;
  merchant: string;
  category: TransactionCategory;
  amount: number;
  date: string; // ISO string
  status: 'completed' | 'pending' | 'failed';
  trackingNumber?: string;
  shippingProvider?: ShippingProvider;
  deliveryStatus?: DeliveryStatus;
}
