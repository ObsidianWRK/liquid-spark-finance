import { RecurringCharge } from '../types';
import { mockData } from '@/services/mockData';

export interface SubscriptionService {
  detectSubscriptions: (transactions: unknown[]) => Promise<RecurringCharge[]>;
  cancelSubscription: (chargeId: string) => Promise<boolean>; // returns success flag
}

interface TransactionPattern {
  merchant: string;
  amount: number;
  frequency: 'monthly' | 'yearly' | 'weekly';
  dates: Date[];
  category: string;
}

class MockSubscriptionService implements SubscriptionService {
  private charges: RecurringCharge[] = [];

  async detectSubscriptions(transactions: unknown[] = []): Promise<RecurringCharge[]> {
    // Use mock data if no transactions provided
    const transactionsToAnalyze = transactions.length > 0 ? transactions : mockData.transactions;
    
    // Convert to a consistent format
    const normalizedTransactions = transactionsToAnalyze.map((t: any) => ({
      id: t.id,
      merchant: t.merchant || t.merchantName || 'Unknown',
      amount: Math.abs(t.amount), // Use absolute value for comparison
      date: new Date(t.date),
      category: typeof t.category === 'string' ? t.category : t.category?.name || 'other',
      status: t.status
    })).filter(t => t.amount > 0 && t.status === 'completed'); // Only completed transactions with positive amounts

    // Detect recurring patterns
    const patterns = this.detectRecurringPatterns(normalizedTransactions);
    
    // Convert patterns to RecurringCharge format
    this.charges = patterns.map((pattern, index) => {
      const lastTransaction = pattern.dates[pattern.dates.length - 1];
      const nextDueDate = this.calculateNextDueDate(lastTransaction, pattern.frequency);
      
      return {
        id: `sub-${index + 1}`,
        accountId: 'acc_001', // Default account
        merchantName: pattern.merchant,
        amount: pattern.amount,
        frequency: pattern.frequency,
        nextDueDate: nextDueDate.toISOString(),
        status: 'active' as const,
        category: pattern.category,
        lastChargeDate: lastTransaction.toISOString(),
        averageAmount: pattern.amount,
        detectedPattern: `Recurring ${pattern.frequency} charges detected`,
        confidence: this.calculateConfidence(pattern)
      };
    });

    return this.charges;
  }

  private detectRecurringPatterns(transactions: any[]): TransactionPattern[] {
    // Group transactions by merchant and similar amounts
    const merchantGroups = new Map<string, any[]>();
    
    transactions.forEach(t => {
      const key = this.normalizeMerchant(t.merchant);
      if (!merchantGroups.has(key)) {
        merchantGroups.set(key, []);
      }
      merchantGroups.get(key)!.push(t);
    });

    const patterns: TransactionPattern[] = [];

    merchantGroups.forEach((merchantTransactions, merchant) => {
      // Group by similar amounts (within $1 tolerance)
      const amountGroups = new Map<number, any[]>();
      
      merchantTransactions.forEach(t => {
        let found = false;
        for (const [amount, group] of amountGroups.entries()) {
          if (Math.abs(t.amount - amount) <= 1.0) {
            group.push(t);
            found = true;
            break;
          }
        }
        if (!found) {
          amountGroups.set(t.amount, [t]);
        }
      });

      amountGroups.forEach((amountTransactions, amount) => {
        if (amountTransactions.length >= 2) { // Need at least 2 occurrences
          const dates = amountTransactions.map(t => t.date).sort();
          const frequency = this.detectFrequency(dates);
          
          if (frequency && this.isValidSubscription(merchant, amount)) {
            patterns.push({
              merchant: this.formatMerchantName(merchant),
              amount,
              frequency,
              dates,
              category: amountTransactions[0].category
            });
          }
        }
      });
    });

    return patterns.sort((a, b) => b.amount - a.amount); // Sort by amount descending
  }

  private normalizeMerchant(merchant: string): string {
    return merchant.toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[^a-z0-9\s]/g, '')
      .trim();
  }

  private formatMerchantName(normalizedMerchant: string): string {
    // Convert back to proper case
    return normalizedMerchant
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private detectFrequency(dates: Date[]): 'monthly' | 'yearly' | 'weekly' | null {
    if (dates.length < 2) return null;

    const intervals: number[] = [];
    for (let i = 1; i < dates.length; i++) {
      const diff = dates[i].getTime() - dates[i-1].getTime();
      intervals.push(diff);
    }

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const daysDiff = avgInterval / (1000 * 60 * 60 * 24);

    // Allow some tolerance in the intervals
    if (daysDiff >= 28 && daysDiff <= 35) return 'monthly';
    if (daysDiff >= 6 && daysDiff <= 8) return 'weekly';
    if (daysDiff >= 360 && daysDiff <= 370) return 'yearly';
    
    return null;
  }

  private isValidSubscription(merchant: string, amount: number): boolean {
    // Common subscription patterns
    const subscriptionKeywords = [
      'netflix', 'spotify', 'hulu', 'disney', 'apple music', 
      'amazon prime', 'adobe', 'icloud', 'gym', 'fitness',
      'planet fitness', 'subscription', 'monthly', 'premium'
    ];

    const merchantLower = merchant.toLowerCase();
    const hasSubscriptionKeyword = subscriptionKeywords.some(keyword => 
      merchantLower.includes(keyword)
    );

    // Typical subscription amount ranges
    const isTypicalSubscriptionAmount = amount >= 2.99 && amount <= 50.00;

    return hasSubscriptionKeyword && isTypicalSubscriptionAmount;
  }

  private calculateNextDueDate(lastDate: Date, frequency: string): Date {
    const nextDate = new Date(lastDate);
    
    switch (frequency) {
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }
    
    return nextDate;
  }

  private calculateConfidence(pattern: TransactionPattern): number {
    let confidence = 0.5; // Base confidence
    
    // More occurrences = higher confidence
    confidence += Math.min(pattern.dates.length * 0.1, 0.3);
    
    // Consistent timing = higher confidence
    if (pattern.frequency === 'monthly') confidence += 0.2;
    
    return Math.min(confidence, 1.0);
  }

  async cancelSubscription(chargeId: string): Promise<boolean> {
    const charge = this.charges.find((c) => c.id === chargeId);
    if (charge) {
      charge.status = 'pending_cancel';
      return true;
    }
    return false;
  }
}

export const subscriptionService: SubscriptionService =
  new MockSubscriptionService();
