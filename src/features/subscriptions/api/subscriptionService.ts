import { RecurringCharge } from '@/types';
import { mockData } from '@/services/mockData';
import { billAnalysisService } from '@/features/bill-negotiation/api/billAnalysisService';

export interface SubscriptionService {
  detectSubscriptions: (transactions: unknown[]) => Promise<RecurringCharge[]>;
  cancelSubscription: (chargeId: string) => Promise<boolean>; // returns success flag
}

// Enhanced interface for better subscription management
export interface EnhancedRecurringCharge extends RecurringCharge {
  isNegotiable?: boolean;
  negotiationPotential?: 'high' | 'medium' | 'low';
  potentialSavings?: number;
}

class MockSubscriptionService implements SubscriptionService {
  private charges: RecurringCharge[] = [];

  async detectSubscriptions(transactions: unknown[]): Promise<RecurringCharge[]> {
    // Use the bill analysis service to get comprehensive negotiatable bills
    const analysisResult = billAnalysisService.analyzeTransactionsForNegotiatableBills();
    
    // Convert NegotiatableBill to RecurringCharge format
    const negotiatableBills: RecurringCharge[] = analysisResult.negotiatableBills.map(bill => ({
      id: bill.id,
      accountId: bill.accountId,
      merchantName: bill.merchantName,
      amount: Math.abs(bill.amount), // Ensure positive amount for display
      frequency: bill.frequency,
      nextDueDate: bill.nextDueDate,
      status: bill.status,
      category: bill.category,
      lastChargeDate: bill.lastChargeDate,
      averageAmount: bill.averageAmount,
      confidence: bill.confidence
    }));

    // Add some additional mock subscriptions for completeness
    const additionalMockCharges: RecurringCharge[] = [
      {
        id: 'sub_streaming_bundle',
        accountId: 'acc_001',
        merchantName: 'Entertainment Bundle',
        amount: 49.99,
        frequency: 'monthly',
        nextDueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        category: 'entertainment',
        confidence: 0.95,
        lastChargeDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'sub_cloud_storage',
        accountId: 'acc_001', 
        merchantName: 'Cloud Storage Pro',
        amount: 19.99,
        frequency: 'monthly',
        nextDueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        category: 'software',
        confidence: 0.90,
        lastChargeDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Combine negotiatable bills with additional mock charges
    this.charges = [...negotiatableBills, ...additionalMockCharges];
    
    return this.charges;
  }

  async cancelSubscription(chargeId: string): Promise<boolean> {
    const chargeIndex = this.charges.findIndex(c => c.id === chargeId);
    if (chargeIndex >= 0) {
      // Update status instead of removing entirely
      this.charges[chargeIndex] = {
        ...this.charges[chargeIndex],
        status: 'pending_cancel'
      };
      return true;
    }
    return false;
  }

  // Additional method to get charges for bill negotiation
  getChargesForNegotiation(): RecurringCharge[] {
    return this.charges.filter(charge => 
      charge.status === 'active' && this.isNegotiableCharge(charge)
    );
  }

  private isNegotiableCharge(charge: RecurringCharge): boolean {
    const negotiatableKeywords = [
      // Telecom
      'verizon', 'at&t', 'xfinity', 'comcast', 't-mobile',
      // Insurance  
      'insurance', 'allstate', 'state farm', 'blue cross',
      // Utilities
      'electric', 'gas', 'water', 'utility', 'security',
      // Fitness
      'fitness', 'gym', 'planet', 'la fitness',
      // High-value subscriptions
      'adobe', 'microsoft', 'enterprise'
    ];

    const merchantLower = charge.merchantName.toLowerCase();
    return negotiatableKeywords.some(keyword => merchantLower.includes(keyword)) ||
           charge.amount > 30; // Bills over $30 are typically negotiatable
  }

  private isValidSubscription(merchant: string, amount: number): boolean {
    // Common subscription patterns
    const subscriptionKeywords = [
      'netflix', 'spotify', 'hulu', 'disney', 'apple music', 
      'amazon prime', 'adobe', 'icloud', 'gym', 'fitness',
      'planet fitness', 'subscription', 'monthly', 'premium',
      'insurance', 'verizon', 'at&t', 'xfinity', 'utility'
    ];

    const merchantLower = merchant.toLowerCase();
    const hasSubscriptionKeyword = subscriptionKeywords.some(keyword => 
      merchantLower.includes(keyword)
    );

    // Expanded amount range for utilities and insurance
    const isTypicalSubscriptionAmount = amount >= 2.99 && amount <= 500.00;

    return hasSubscriptionKeyword && isTypicalSubscriptionAmount;
  }

  // Method to simulate negotiation success
  async simulateNegotiation(chargeId: string): Promise<{success: boolean, newAmount?: number, savings?: number}> {
    const charge = this.charges.find(c => c.id === chargeId);
    if (!charge) return { success: false };

    // Simulate different success rates based on charge type
    const successRate = this.getNegotiationSuccessRate(charge);
    const isSuccessful = Math.random() < successRate;

    if (isSuccessful) {
      const savingsPercentage = Math.random() * 0.25 + 0.05; // 5-30% savings
      const newAmount = charge.amount * (1 - savingsPercentage);
      const savings = charge.amount - newAmount;

      // Update the charge amount
      const chargeIndex = this.charges.findIndex(c => c.id === chargeId);
      if (chargeIndex >= 0) {
        this.charges[chargeIndex] = {
          ...this.charges[chargeIndex],
          amount: newAmount,
          averageAmount: newAmount
        };
      }

      return {
        success: true,
        newAmount: Math.round(newAmount * 100) / 100,
        savings: Math.round(savings * 100) / 100
      };
    }

    return { success: false };
  }

  private getNegotiationSuccessRate(charge: RecurringCharge): number {
    const merchantLower = charge.merchantName.toLowerCase();
    
    // Higher success rates for certain types of services
    if (merchantLower.includes('gym') || merchantLower.includes('fitness')) return 0.8;
    if (merchantLower.includes('cable') || merchantLower.includes('internet')) return 0.7;
    if (merchantLower.includes('phone') || merchantLower.includes('wireless')) return 0.6;
    if (merchantLower.includes('insurance')) return 0.5;
    
    return 0.4; // Default success rate
  }
}

export const subscriptionService: SubscriptionService = new MockSubscriptionService();
