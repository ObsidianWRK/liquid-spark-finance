import { NegotiationCase } from '@/types';

export interface NegotiationService {
  submitNegotiation: (chargeId: string) => Promise<NegotiationCase>;
  getNegotiationStatus: (
    caseId: string
  ) => Promise<NegotiationCase | undefined>;
}

class MockNegotiationService implements NegotiationService {
  private cases: NegotiationCase[] = [];
  private negotiationOutcomes = {
    // Predefined outcomes for different types of bills
    'bill_verizon_wireless': { success: true, savingsAmount: 13.50, timeToComplete: 3 },
    'bill_xfinity': { success: true, savingsAmount: 12.00, timeToComplete: 5 },
    'bill_state_farm_insurance': { success: true, savingsAmount: 23.45, timeToComplete: 7 },
    'bill_allstate_insurance': { success: false, savingsAmount: 0, timeToComplete: 4 },
    'bill_blue_cross_blue_shield': { success: true, savingsAmount: 34.67, timeToComplete: 10 },
    'bill_northwestern_mutual': { success: true, savingsAmount: 8.90, timeToComplete: 6 },
    'bill_pg&e_electric': { success: false, savingsAmount: 0, timeToComplete: 3 },
    'bill_socal_gas_company': { success: true, savingsAmount: 4.50, timeToComplete: 4 },
    'bill_city_water_department': { success: false, savingsAmount: 0, timeToComplete: 2 },
    'bill_la_fitness': { success: true, savingsAmount: 15.99, timeToComplete: 2 },
    'bill_at&t': { success: true, savingsAmount: 21.84, timeToComplete: 6 },
    'bill_adt_security': { success: true, savingsAmount: 8.25, timeToComplete: 4 },
    'bill_microsoft_365': { success: true, savingsAmount: 2.60, timeToComplete: 1 },
    'bill_planet_fitness': { success: true, savingsAmount: 3.00, timeToComplete: 1 },
    'bill_netflix': { success: false, savingsAmount: 0, timeToComplete: 1 },
    'bill_spotify': { success: false, savingsAmount: 0, timeToComplete: 1 },
    'bill_adobe_creative_cloud': { success: true, savingsAmount: 5.25, timeToComplete: 3 },
    'bill_amazon_prime': { success: false, savingsAmount: 0, timeToComplete: 1 },
    'bill_disney+': { success: false, savingsAmount: 0, timeToComplete: 1 },
    'bill_hulu': { success: true, savingsAmount: 2.60, timeToComplete: 2 },
    'bill_apple_music': { success: false, savingsAmount: 0, timeToComplete: 1 },
    'bill_icloud_storage': { success: false, savingsAmount: 0, timeToComplete: 1 },
    'bill_gym_membership': { success: true, savingsAmount: 16.50, timeToComplete: 3 }
  };

  async submitNegotiation(chargeId: string): Promise<NegotiationCase> {
    const outcome = this.negotiationOutcomes[chargeId as keyof typeof this.negotiationOutcomes];
    
    const newCase: NegotiationCase = {
      id: 'case-' + Math.random().toString(36).substring(2),
      chargeId,
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
  getNegotiationTips(chargeId: string): string[] {
    const tipsByCategory = {
      telecom: [
        'Ask about loyalty discounts for long-term customers',
        'Mention competitor offers to leverage better rates',
        'Inquire about bundling services for additional savings',
        'Request to speak with the retention department'
      ],
      insurance: [
        'Review your coverage to ensure you\'re not over-insured',
        'Ask about discounts for bundling auto and home insurance',
        'Inquire about safe driver or good student discounts',
        'Consider increasing deductibles to lower premiums'
      ],
      utilities: [
        'Ask about budget billing or level payment plans',
        'Inquire about energy efficiency programs and rebates',
        'Check if you qualify for low-income assistance programs',
        'Request a home energy audit'
      ],
      fitness: [
        'Ask for annual payment discounts',
        'Negotiate a freeze option instead of cancellation',
        'Inquire about corporate or family plan rates',
        'Request waived initiation fees'
      ],
      streaming: [
        'Consider downgrading to a lower-tier plan',
        'Look for annual subscription discounts',
        'Share family plans to split costs',
        'Cancel and re-subscribe with promotional rates'
      ]
    };

    // Determine category based on charge ID
    const chargeIdLower = chargeId.toLowerCase();
    if (chargeIdLower.includes('verizon') || chargeIdLower.includes('at&t') || chargeIdLower.includes('xfinity')) {
      return tipsByCategory.telecom;
    }
    if (chargeIdLower.includes('insurance')) {
      return tipsByCategory.insurance;
    }
    if (chargeIdLower.includes('fitness') || chargeIdLower.includes('gym')) {
      return tipsByCategory.fitness;
    }
    if (chargeIdLower.includes('electric') || chargeIdLower.includes('gas') || chargeIdLower.includes('water')) {
      return tipsByCategory.utilities;
    }
    if (chargeIdLower.includes('netflix') || chargeIdLower.includes('spotify') || chargeIdLower.includes('hulu')) {
      return tipsByCategory.streaming;
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
