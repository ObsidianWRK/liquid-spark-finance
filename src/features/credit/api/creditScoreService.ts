import { CreditScore, CreditTip, ScoreHistoryPoint } from '@/shared/types/creditScore';
import { VueniSecureStorage } from '@/shared/utils/crypto';

export class CreditScoreService {
  private static instance: CreditScoreService;
  private storageKey = 'vueni:credit:score:v1';
  
  private constructor() {
    // Initialize any persistent data loading if needed
  }
  
  static getInstance(): CreditScoreService {
    if (!CreditScoreService.instance) {
      CreditScoreService.instance = new CreditScoreService();
    }
    return CreditScoreService.instance;
  }

  /**
   * Caches credit score data securely for demo purposes
   */
  private cacheCreditData(data: CreditScore): void {
    try {
      VueniSecureStorage.setItem(this.storageKey, data, { sensitive: true, sessionOnly: true });
    } catch (error) {
      console.error('Failed to cache credit score data:', error);
    }
  }

  /**
   * Retrieves cached credit score data
   */
  private getCachedCreditData(): CreditScore | null {
    try {
      return VueniSecureStorage.getItem(this.storageKey);
    } catch (error) {
      console.error('Failed to retrieve cached credit data:', error);
      return null;
    }
  }

  async getCurrentScore(): Promise<CreditScore> {
    // Check for cached data first (for demo purposes)
    const cachedData = this.getCachedCreditData();
    if (cachedData) {
      return cachedData;
    }

    // Mock data for now - replace with actual API call
    const scoreData: CreditScore = {
      score: 750,
      scoreRange: 'Very Good',
      lastUpdated: new Date().toISOString(),
      provider: 'FICO',
      factors: [
        {
          factor: 'Payment History',
          impact: 'High',
          status: 'Positive',
          description: 'You pay your bills on time',
          percentage: 35
        },
        {
          factor: 'Credit Utilization',
          impact: 'High', 
          status: 'Negative',
          description: 'Your credit utilization is high',
          percentage: 30
        },
        {
          factor: 'Length of Credit History',
          impact: 'Medium',
          status: 'Positive',
          description: 'You have a good credit history length',
          percentage: 15
        },
        {
          factor: 'Credit Mix',
          impact: 'Low',
          status: 'Neutral',
          description: 'You have a fair mix of credit types',
          percentage: 10
        },
        {
          factor: 'New Credit',
          impact: 'Low',
          status: 'Positive',
          description: 'You haven\'t opened many new accounts',
          percentage: 10
        }
      ],
      history: this.generateMockHistory()
    };

    // Cache the sensitive credit score data in session storage
    this.cacheCreditData(scoreData);
    return scoreData;
  }

  async getCreditTips(): Promise<CreditTip[]> {
    return [
      {
        id: '1',
        title: 'Pay down credit card balances',
        description: 'Reduce your credit utilization to below 30%',
        impact: 'High',
        timeframe: '1-2 months',
        category: 'Utilization'
      },
      {
        id: '2', 
        title: 'Set up automatic payments',
        description: 'Never miss a payment with auto-pay',
        impact: 'High',
        timeframe: 'Immediate',
        category: 'Payment'
      },
      {
        id: '3',
        title: 'Keep old accounts open',
        description: 'Maintain your credit history length',
        impact: 'Medium',
        timeframe: 'Ongoing',
        category: 'Length'
      },
      {
        id: '4',
        title: 'Avoid opening new accounts',
        description: 'Limit hard inquiries on your credit',
        impact: 'Medium',
        timeframe: '6 months',
        category: 'Inquiries'
      }
    ];
  }

  private generateMockHistory(): ScoreHistoryPoint[] {
    const history: ScoreHistoryPoint[] = [];
    const currentScore = 750; // Match the current score
    const baseScore = 680; // Starting score 12 months ago
    
    // Create a realistic progression over 12 months
    const milestones = [
      { month: 11, event: 'started', impact: 0 },
      { month: 10, event: 'paid_down_debt', impact: 15 },
      { month: 8, event: 'new_account', impact: -8 },
      { month: 6, event: 'utilization_drop', impact: 25 },
      { month: 4, event: 'payment_history', impact: 12 },
      { month: 2, event: 'credit_age', impact: 8 },
      { month: 0, event: 'final_adjustment', impact: 5 }
    ];
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      // Calculate progressive score improvement
      const monthsProgressed = 11 - i;
      const progressRatio = monthsProgressed / 11;
      const baseProgressScore = baseScore + (currentScore - baseScore) * progressRatio;
      
      // Add milestone impacts
      let milestoneImpact = 0;
      milestones.forEach(milestone => {
        if (i <= milestone.month) {
          milestoneImpact += milestone.impact;
        }
      });
      
      // Add realistic variance (smaller for recent months)
      const varianceRange = Math.max(5, 15 - monthsProgressed);
      const variance = (Math.random() - 0.5) * varianceRange;
      
      // Calculate final score with bounds
      let score = Math.round(baseProgressScore + milestoneImpact + variance);
      score = Math.max(580, Math.min(850, score)); // Keep within realistic bounds
      
      // Calculate change from previous month
      const change = i === 11 ? 0 : score - (history[history.length - 1]?.score || baseScore);
      
      history.push({
        date: date.toISOString().split('T')[0],
        score,
        change
      });
    }
    
    // Ensure the last score matches our current score
    if (history.length > 0) {
      const lastPoint = history[history.length - 1];
      const finalChange = currentScore - lastPoint.score;
      history.push({
        date: new Date().toISOString().split('T')[0],
        score: currentScore,
        change: finalChange
      });
    }
    
    return history;
  }
}

export const creditScoreService = CreditScoreService.getInstance(); 