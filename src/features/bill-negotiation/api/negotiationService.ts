import { NegotiationCase } from '@/types';
import { useSubscriptionsStore } from '@/features/subscriptions/store';

export interface NegotiationService {
  submitNegotiation: (chargeId: string, merchantName: string) => Promise<NegotiationCase>;
  getNegotiationStatus: (
    caseId: string
  ) => Promise<NegotiationCase | undefined>;
}

class MockNegotiationService implements NegotiationService {
  private cases: NegotiationCase[] = [];

  async submitNegotiation(chargeId: string, merchantName: string): Promise<NegotiationCase> {
    const outcome = this.determineNegotiationOutcome(merchantName);
    
    const newCase: NegotiationCase = {
      id: 'case-' + Math.random().toString(36).substring(2),
      chargeId,
      merchantName,
      status: 'queued',
      savingsAmount: outcome?.success ? outcome.savingsAmount : undefined,
      submittedAt: new Date().toISOString(),
    };
    
    this.cases.push(newCase);
    
    // Simulate progression through negotiation states
    this.simulateNegotiationProgress(newCase.id, outcome);
    
    return newCase;
  }

  async getNegotiationStatus(
    caseId: string
  ): Promise<NegotiationCase | undefined> {
    return this.cases.find((c) => c.id === caseId);
  }

  private determineNegotiationOutcome(merchantName: string): { success: boolean, savingsAmount: number, timeToComplete: number } {
    const merchantLower = merchantName.toLowerCase();
    
    // Get the actual charge amount from subscriptions to calculate realistic savings
    const subscriptions = useSubscriptionsStore.getState().charges;
    const matchingCharge = subscriptions.find(charge => 
      charge.merchantName.toLowerCase() === merchantLower
    );
    const chargeAmount = matchingCharge?.amount || 50; // Fallback amount
    
    // Determine outcome based on merchant type and realistic success rates
    if (merchantLower.includes('verizon')) {
      return { success: true, savingsAmount: Math.round(chargeAmount * 0.15 * 100) / 100, timeToComplete: 3 };
    }
    if (merchantLower.includes('xfinity') || merchantLower.includes('comcast')) {
      return { success: true, savingsAmount: Math.round(chargeAmount * 0.15 * 100) / 100, timeToComplete: 5 };
    }
    if (merchantLower.includes('at&t')) {
      return { success: true, savingsAmount: Math.round(chargeAmount * 0.15 * 100) / 100, timeToComplete: 6 };
    }
    
    // Insurance companies
    if (merchantLower.includes('state farm')) {
      return { success: true, savingsAmount: Math.round(chargeAmount * 0.15 * 100) / 100, timeToComplete: 7 };
    }
    if (merchantLower.includes('allstate')) {
      return { success: false, savingsAmount: 0, timeToComplete: 4 };
    }
    if (merchantLower.includes('blue cross')) {
      return { success: true, savingsAmount: Math.round(chargeAmount * 0.15 * 100) / 100, timeToComplete: 10 };
    }
    if (merchantLower.includes('northwestern mutual')) {
      return { success: true, savingsAmount: Math.round(chargeAmount * 0.13 * 100) / 100, timeToComplete: 6 };
    }
    
    // Utilities
    if (merchantLower.includes('pg&e') || merchantLower.includes('electric')) {
      return { success: false, savingsAmount: 0, timeToComplete: 3 };
    }
    if (merchantLower.includes('gas')) {
      return { success: true, savingsAmount: Math.round(chargeAmount * 0.08 * 100) / 100, timeToComplete: 4 };
    }
    if (merchantLower.includes('water')) {
      return { success: false, savingsAmount: 0, timeToComplete: 2 };
    }
    if (merchantLower.includes('adt') || merchantLower.includes('security')) {
      return { success: true, savingsAmount: Math.round(chargeAmount * 0.15 * 100) / 100, timeToComplete: 4 };
    }
    
    // Fitness
    if (merchantLower.includes('fitness') || merchantLower.includes('gym')) {
      return { success: true, savingsAmount: Math.round(chargeAmount * 0.25 * 100) / 100, timeToComplete: 2 };
    }
    
    // Software
    if (merchantLower.includes('microsoft')) {
      return { success: true, savingsAmount: Math.round(chargeAmount * 0.20 * 100) / 100, timeToComplete: 1 };
    }
    if (merchantLower.includes('adobe')) {
      return { success: true, savingsAmount: Math.round(chargeAmount * 0.25 * 100) / 100, timeToComplete: 3 };
    }
    
    // Entertainment (typically low success rates)
    if (merchantLower.includes('netflix') || merchantLower.includes('spotify') || 
        merchantLower.includes('apple music') || merchantLower.includes('icloud') ||
        merchantLower.includes('amazon prime') || merchantLower.includes('disney')) {
      return { success: false, savingsAmount: 0, timeToComplete: 1 };
    }
    if (merchantLower.includes('hulu')) {
      return { success: true, savingsAmount: Math.round(chargeAmount * 0.20 * 100) / 100, timeToComplete: 2 };
    }
    
    // Default case - moderate success rate
    return { 
      success: Math.random() > 0.4, 
      savingsAmount: Math.round(chargeAmount * (0.05 + Math.random() * 0.15) * 100) / 100, 
      timeToComplete: Math.floor(2 + Math.random() * 4) 
    };
  }

  private async simulateNegotiationProgress(caseId: string, outcome?: { success: boolean, savingsAmount: number, timeToComplete: number }) {
    const caseIndex = this.cases.findIndex(c => c.id === caseId);
    if (caseIndex === -1) return;

    const baseDelay = outcome?.timeToComplete ? outcome.timeToComplete * 1000 : 3000;
    
    // Simulate progression: queued -> in_progress -> completed/failed
    setTimeout(() => {
      if (this.cases[caseIndex]) {
        this.cases[caseIndex] = {
          ...this.cases[caseIndex],
          status: 'in_progress'
        };
      }
    }, 1000);

    setTimeout(() => {
      if (this.cases[caseIndex]) {
        const finalStatus = outcome?.success ? 'completed' : 'failed';
        this.cases[caseIndex] = {
          ...this.cases[caseIndex],
          status: finalStatus,
          completedAt: new Date().toISOString(),
          savingsAmount: outcome?.success ? outcome.savingsAmount : 0
        };
      }
    }, baseDelay);
  }

  // Additional methods for enhanced functionality
  getAllCases(): NegotiationCase[] {
    return [...this.cases];
  }

  getTotalSavings(): number {
    return this.cases
      .filter(c => c.status === 'completed' && c.savingsAmount)
      .reduce((total, c) => total + (c.savingsAmount || 0), 0);
  }

  getCasesInProgress(): NegotiationCase[] {
    return this.cases.filter(c => ['queued', 'in_progress'].includes(c.status));
  }

  getCompletedCases(): NegotiationCase[] {
    return this.cases.filter(c => c.status === 'completed');
  }

  getFailedCases(): NegotiationCase[] {
    return this.cases.filter(c => c.status === 'failed');
  }

  // Method to get negotiation recommendations for specific bill types
  getNegotiationTips(merchantName: string): string[] {
    const merchantLower = merchantName.toLowerCase();
    
    if (merchantLower.includes('verizon') || merchantLower.includes('at&t') || merchantLower.includes('xfinity')) {
      return [
        'Ask about loyalty discounts for long-term customers',
        'Mention competitor offers to leverage better rates',
        'Inquire about bundling services for additional savings',
        'Request to speak with the retention department'
      ];
    }
    if (merchantLower.includes('insurance')) {
      return [
        'Review your coverage to ensure you\'re not over-insured',
        'Ask about discounts for bundling auto and home insurance',
        'Inquire about safe driver or good student discounts',
        'Consider increasing deductibles to lower premiums'
      ];
    }
    if (merchantLower.includes('fitness') || merchantLower.includes('gym')) {
      return [
        'Ask for annual payment discounts',
        'Negotiate a freeze option instead of cancellation',
        'Inquire about corporate or family plan rates',
        'Request waived initiation fees'
      ];
    }
    if (merchantLower.includes('electric') || merchantLower.includes('gas') || merchantLower.includes('water')) {
      return [
        'Ask about budget billing or level payment plans',
        'Inquire about energy efficiency programs and rebates',
        'Check if you qualify for low-income assistance programs',
        'Request a home energy audit'
      ];
    }

    return [
      'Be polite but persistent when negotiating',
      'Ask to speak with a supervisor if initial offer is declined',
      'Be prepared to walk away if terms aren\'t favorable',
      'Document all agreements in writing'
    ];
  }
}

export const negotiationService: NegotiationService =
  new MockNegotiationService();
