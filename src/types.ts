// Domain Types for PFM Gap-10 features
// These will be expanded with full schemas and Zod validations in later steps.

export interface LinkedAccount {
  id: string;
  provider: string; // e.g., 'plaid', 'teller'
  displayName: string;
  institutionName: string;
  lastFour: string; // last 4 digits
  type: 'checking' | 'savings' | 'credit' | 'loan' | 'investment';
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export interface RecurringCharge {
  id: string;
  accountId: string;
  merchantName: string;
  amount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
  nextDueDate: string; // ISO
  status: 'active' | 'canceled' | 'pending_cancel';
}

export interface NegotiationCase {
  id: string;
  chargeId: string;
  status: 'queued' | 'in_progress' | 'completed' | 'failed';
  savingsAmount?: number;
  submittedAt: string;
  completedAt?: string;
}

export interface AutosavePlan {
  id: string;
  accountId: string;
  targetAmount: number;
  cadence: 'daily' | 'weekly' | 'monthly';
  nextTransferDate: string;
  isActive: boolean;
}

export interface HouseholdMember {
  userId: string;
  role: 'owner' | 'admin' | 'member';
}

export interface Household {
  id: string;
  name: string;
  members: HouseholdMember[];
  createdAt: string;
}

export interface AgeMetric {
  averageDaysHeld: number;
  calculatedAt: string;
}

export interface PrivacySetting {
  hideAmounts: boolean;
  updatedAt: string;
}

export interface AdvisorThread {
  id: string;
  userId: string;
  messages: AdvisorMessage[];
  isEscalated: boolean;
}

export interface AdvisorMessage {
  id: string;
  sender: 'user' | 'advisor' | 'system';
  content: string;
  createdAt: string;
}

export interface SpendableCash {
  amount: number;
  payday: string; // ISO date of upcoming payday
  calculatedAt: string;
}

export interface HomeWidget {
  id: string;
  type: 'balance' | 'safe_to_spend';
  position: number;
  config: Record<string, unknown>;
}

// Transaction status enum used across UI components including TransactionRow and StatusChip
export enum TransactionStatus {
  Pending = 'pending',
  InTransit = 'inTransit',
  Delivered = 'delivered',
  Completed = 'completed',
  Refunded = 'refunded',
  None = 'none', // placeholder when status is unavailable
}

// Biometric Intervention Types
export interface BiometricReading {
  id: string;
  timestamp: string;
  heartRate: number;
  stressLevel: number; // 0-100
  spendingRisk: 'low' | 'medium' | 'high';
}

export interface InterventionAlert {
  id: string;
  type: 'stress_spending' | 'impulse_warning' | 'breathing_break';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  createdAt: string;
  dismissed?: boolean;
} 