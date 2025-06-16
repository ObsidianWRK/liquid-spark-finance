import { CreditScore, CreditTip, ScoreHistoryPoint } from '@/types/creditScore';

export class CreditScoreService {
  private static instance: CreditScoreService;
  
  static getInstance(): CreditScoreService {
    if (!CreditScoreService.instance) {
      CreditScoreService.instance = new CreditScoreService();
    }
    return CreditScoreService.instance;
  }

  async getCurrentScore(): Promise<CreditScore> {
    // Mock data for now - replace with actual API call
    return {
      score: 680,
      scoreRange: 'Good',
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
    const baseScore = 680;
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      const variance = Math.random() * 40 - 20; // ±20 points
      const score = Math.round(baseScore + variance);
      const change = i === 11 ? 0 : score - (history[history.length - 1]?.score || baseScore);
      
      history.push({
        date: date.toISOString().split('T')[0],
        score,
        change
      });
    }
    
    return history;
  }
}

export const creditScoreService = CreditScoreService.getInstance(); 