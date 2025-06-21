import { MOCK_DATA } from '@/services/dataProvider';
import { RecurringCharge } from '@/types';

export interface NegotiatableBill extends RecurringCharge {
  negotiationType: 'telecom' | 'insurance' | 'utilities' | 'fitness' | 'entertainment' | 'software';
  negotiationPotential: 'high' | 'medium' | 'low';
  averageSavings: number; // Potential savings percentage
  recommendedAction: string;
}

export interface BillAnalysisResult {
  negotiatableBills: NegotiatableBill[];
  totalMonthlyCost: number;
  potentialMonthlySavings: number;
  analysisSummary: {
    highPotential: number;
    mediumPotential: number;
    lowPotential: number;
  };
}

class BillAnalysisService {
  private negotiatableCategories = {
    // Cell phone/telecom providers
    telecom: {
      keywords: ['verizon', 'at&t', 'att', 't-mobile', 'tmobile', 'sprint', 'xfinity', 'comcast'],
      potential: 'high' as const,
      avgSavings: 15, // 15% average savings
      action: 'Contact to negotiate plan or switch to competitor offer'
    },
    // Insurance providers  
    insurance: {
      keywords: ['insurance', 'allstate', 'state farm', 'geico', 'progressive', 'blue cross', 'northwestern mutual'],
      potential: 'medium' as const,
      avgSavings: 10, // 10% average savings
      action: 'Review coverage options and compare competitor rates'
    },
    // Utilities
    utilities: {
      keywords: ['electric', 'gas', 'water', 'utility', 'pg&e', 'socal gas', 'city water', 'adt security'],
      potential: 'medium' as const,
      avgSavings: 8, // 8% average savings
      action: 'Negotiate rate or explore energy efficiency programs'
    },
    // Fitness/gym memberships
    fitness: {
      keywords: ['fitness', 'gym', 'planet fitness', 'la fitness', 'anytime fitness'],
      potential: 'high' as const,
      avgSavings: 20, // 20% average savings
      action: 'Request promotional rates or annual discount'
    },
    // Entertainment subscriptions
    entertainment: {
      keywords: ['netflix', 'spotify', 'hulu', 'disney', 'apple music', 'amazon prime'],
      potential: 'low' as const,
      avgSavings: 5, // 5% average savings  
      action: 'Bundle services or downgrade plan'
    },
    // Software subscriptions
    software: {
      keywords: ['adobe', 'microsoft', 'icloud', 'software', 'subscription'],
      potential: 'medium' as const,
      avgSavings: 12, // 12% average savings
      action: 'Negotiate volume discount or switch to alternative'
    }
  };

  analyzeTransactionsForNegotiatableBills(): BillAnalysisResult {
    const transactions = MOCK_DATA.transactions;
    const billGroups = this.groupRecurringTransactions(transactions);
    const negotiatableBills: NegotiatableBill[] = [];

    for (const [merchant, group] of Object.entries(billGroups)) {
      if (group.length >= 2) { // At least 2 occurrences to be considered recurring
        const negotiationType = this.categorizeForNegotiation(merchant);
        if (negotiationType) {
          const category = this.negotiatableCategories[negotiationType];
          const avgAmount = group.reduce((sum, t) => sum + Math.abs(t.amount), 0) / group.length;
          const lastTransaction = group.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
          
          const bill: NegotiatableBill = {
            id: `bill_${merchant.toLowerCase().replace(/\s+/g, '_')}`,
            accountId: 'acc_001', // Default account
            merchantName: merchant,
            amount: avgAmount,
            frequency: this.determineFrequency(group),
            nextDueDate: this.calculateNextDueDate(group),
            status: 'active',
            category: this.getCategoryFromTransaction(lastTransaction),
            lastChargeDate: lastTransaction.date,
            averageAmount: avgAmount,
            confidence: this.calculateConfidence(group),
            negotiationType,
            negotiationPotential: category.potential,
            averageSavings: category.avgSavings,
            recommendedAction: category.action
          };
          
          negotiatableBills.push(bill);
        }
      }
    }

    return this.generateAnalysisResult(negotiatableBills);
  }

  private groupRecurringTransactions(transactions: any[]): Record<string, any[]> {
    const groups: Record<string, any[]> = {};
    
    transactions.forEach(transaction => {
      if (transaction.amount < 0) { // Only expenses
        const merchant = transaction.merchant;
        if (!groups[merchant]) {
          groups[merchant] = [];
        }
        groups[merchant].push(transaction);
      }
    });

    return groups;
  }

  private categorizeForNegotiation(merchant: string): keyof typeof this.negotiatableCategories | null {
    const merchantLower = merchant.toLowerCase();
    
    for (const [category, config] of Object.entries(this.negotiatableCategories)) {
      if (config.keywords.some(keyword => merchantLower.includes(keyword))) {
        return category as keyof typeof this.negotiatableCategories;
      }
    }
    
    return null;
  }

  private determineFrequency(transactions: any[]): 'monthly' | 'quarterly' | 'yearly' {
    // Simple logic - most bills are monthly
    const sortedDates = transactions
      .map(t => new Date(t.date))
      .sort((a, b) => a.getTime() - b.getTime());
    
    if (sortedDates.length < 2) return 'monthly';
    
    const daysBetween = (sortedDates[1].getTime() - sortedDates[0].getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysBetween <= 40) return 'monthly';
    if (daysBetween <= 100) return 'quarterly';
    return 'yearly';
  }

  private calculateNextDueDate(transactions: any[]): string {
    const lastTransaction = transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
    const lastDate = new Date(lastTransaction.date);
    const nextDate = new Date(lastDate);
    nextDate.setMonth(nextDate.getMonth() + 1); // Assume monthly for simplicity
    
    return nextDate.toISOString();
  }

  private calculateConfidence(transactions: any[]): number {
    // Higher confidence for more regular amounts and timing
    if (transactions.length < 2) return 0.5;
    
    const amounts = transactions.map(t => Math.abs(t.amount));
    const avgAmount = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
    const variance = amounts.reduce((sum, amt) => sum + Math.pow(amt - avgAmount, 2), 0) / amounts.length;
    const coefficient = Math.sqrt(variance) / avgAmount;
    
    // Lower coefficient of variation = higher confidence
    return Math.max(0.6, Math.min(0.95, 1 - coefficient));
  }

  private getCategoryFromTransaction(transaction: any): string {
    if (typeof transaction.category === 'string') {
      return transaction.category.toLowerCase();
    }
    return transaction.category?.name?.toLowerCase() || 'other';
  }

  private generateAnalysisResult(bills: NegotiatableBill[]): BillAnalysisResult {
    const totalMonthlyCost = bills.reduce((sum, bill) => sum + Math.abs(bill.amount), 0);
    const potentialMonthlySavings = bills.reduce((sum, bill) => 
      sum + (Math.abs(bill.amount) * bill.averageSavings / 100), 0);
    
    const analysisSummary = {
      highPotential: bills.filter(b => b.negotiationPotential === 'high').length,
      mediumPotential: bills.filter(b => b.negotiationPotential === 'medium').length,
      lowPotential: bills.filter(b => b.negotiationPotential === 'low').length
    };

    return {
      negotiatableBills: bills,
      totalMonthlyCost,
      potentialMonthlySavings,
      analysisSummary
    };
  }

  // Get specific bill recommendations
  getBillRecommendations(bill: NegotiatableBill): string[] {
    const recommendations: string[] = [bill.recommendedAction];
    
    switch (bill.negotiationType) {
      case 'telecom':
        recommendations.push(
          'Ask about loyalty discounts for long-term customers',
          'Inquire about bundling services for better rates',
          'Check if you qualify for senior, military, or student discounts'
        );
        break;
      case 'insurance':
        recommendations.push(
          'Request a policy review to ensure optimal coverage',
          'Ask about safe driver or good student discounts',
          'Consider raising deductibles to lower premiums'
        );
        break;
      case 'fitness':
        recommendations.push(
          'Ask about annual payment discounts',
          'Negotiate a freeze option instead of cancellation',
          'Inquire about corporate or family plan rates'
        );
        break;
      case 'utilities':
        recommendations.push(
          'Ask about budget billing or level payment plans',
          'Inquire about energy efficiency rebates',
          'Check if you qualify for low-income assistance programs'
        );
        break;
    }
    
    return recommendations;
  }
}

export const billAnalysisService = new BillAnalysisService(); 