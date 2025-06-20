import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

// Core data interfaces
export interface UnifiedDataState {
  family: {
    id: string;
    netWorth: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    creditScore: number;
    lastUpdated: string;
  };
  
  health: {
    wellnessScore: number;
    stressLevel: number;
    heartRate: number;
    heartRateVariability: number;
    sleepHours: number;
    sleepScore: number;
    steps: number;
    activeMinutes: number;
    activeCalories: number;
    floors: number;
    lastUpdated: string;
  };
  
  wealth: {
    totalWealth: number;
    checkingBalance: number;
    savingsBalance: number;
    investmentValue: number;
    creditCardDebt: number;
    netWorth: number;
    portfolioReturns: number;
    savingsRate: number;
    debtToIncomeRatio: number;
    emergencyFundMonths: number;
    lastUpdated: string;
  };
  
  transactions: {
    monthlySpending: number;
    dailyAverage: number;
    topCategories: Array<{
      name: string;
      amount: number;
      percentage: number;
    }>;
    recentTransactions: Array<{
      id: string;
      merchant: string;
      amount: number;
      category: string;
      date: string;
    }>;
    lastUpdated: string;
  };
  
  goals: {
    savingsGoals: Array<{
      id: string;
      name: string;
      targetAmount: number;
      currentAmount: number;
      progress: number;
      monthlyContribution: number;
    }>;
    totalProgress: number;
    lastUpdated: string;
  };
  
  correlations: {
    stressSpending: number;
    sleepROI: number;
    activityDecisions: number;
    lastCalculated: string;
  };
}

// Singleton unified data manager
class UnifiedDataManager {
  private static instance: UnifiedDataManager;
  private dataState$ = new BehaviorSubject<UnifiedDataState>(this.generateInitialState());
  
  private constructor() {
    this.initializeDataUpdates();
  }
  
  public static getInstance(): UnifiedDataManager {
    if (!UnifiedDataManager.instance) {
      UnifiedDataManager.instance = new UnifiedDataManager();
    }
    return UnifiedDataManager.instance;
  }
  
  // Public observables for components to subscribe to
  public readonly familyData$ = this.dataState$.pipe(
    map(state => state.family),
    shareReplay(1)
  );
  
  public readonly healthData$ = this.dataState$.pipe(
    map(state => state.health),
    shareReplay(1)
  );
  
  public readonly wealthData$ = this.dataState$.pipe(
    map(state => state.wealth),
    shareReplay(1)
  );
  
  public readonly transactionData$ = this.dataState$.pipe(
    map(state => state.transactions),
    shareReplay(1)
  );
  
  public readonly goalsData$ = this.dataState$.pipe(
    map(state => state.goals),
    shareReplay(1)
  );
  
  public readonly correlationData$ = this.dataState$.pipe(
    map(state => state.correlations),
    shareReplay(1)
  );
  
  public readonly fullState$ = this.dataState$.asObservable();
  
  // Get current snapshot of data
  public getSnapshot(): UnifiedDataState {
    return this.dataState$.value;
  }
  
  // Update specific data sections
  public updateHealthData(updates: Partial<UnifiedDataState['health']>): void {
    const currentState = this.dataState$.value;
    this.dataState$.next({
      ...currentState,
      health: {
        ...currentState.health,
        ...updates,
        lastUpdated: new Date().toISOString()
      }
    });
    this.recalculateCorrelations();
  }
  
  public updateWealthData(updates: Partial<UnifiedDataState['wealth']>): void {
    const currentState = this.dataState$.value;
    this.dataState$.next({
      ...currentState,
      wealth: {
        ...currentState.wealth,
        ...updates,
        lastUpdated: new Date().toISOString()
      }
    });
    this.recalculateCorrelations();
  }
  
  public updateTransactionData(updates: Partial<UnifiedDataState['transactions']>): void {
    const currentState = this.dataState$.value;
    this.dataState$.next({
      ...currentState,
      transactions: {
        ...currentState.transactions,
        ...updates,
        lastUpdated: new Date().toISOString()
      }
    });
    this.recalculateCorrelations();
  }
  
  // Generate realistic connected data with correlations
  private generateInitialState(): UnifiedDataState {
    const now = new Date().toISOString();
    
    // Base health metrics (these drive correlations)
    const baseStress = 32; // Low stress day
    const baseSleep = 7.5; // Good sleep
    const baseActivity = 8247; // Steps for the day
    const baseHRV = 45; // Good HRV
    
    // Calculate correlated financial metrics
    // High stress = higher spending (correlation +0.65)
    const stressMultiplier = 1 + (baseStress - 30) * 0.02; // Higher stress = more spending
    const baseDailySpending = 136; // Base spending
    const dailySpending = baseDailySpending * stressMultiplier;
    
    // Good sleep = better investment returns (correlation +0.52)
    const sleepROIBonus = (baseSleep - 6) * 1.2; // Better sleep = better decisions
    const baseROI = 8.2;
    const currentROI = baseROI + sleepROIBonus;
    
    // Activity = better decision quality (correlation +0.52)
    const activityBonus = Math.min(10, (baseActivity - 7000) / 1000 * 2);
    
    return {
      family: {
        id: 'demo_family',
        netWorth: 127540,
        monthlyIncome: 6500,
        monthlyExpenses: 4200,
        creditScore: 750,
        lastUpdated: now
      },
      
      health: {
        wellnessScore: 85,
        stressLevel: baseStress,
        heartRate: 68,
        heartRateVariability: baseHRV,
        sleepHours: baseSleep,
        sleepScore: 87,
        steps: baseActivity,
        activeMinutes: 47,
        activeCalories: 486,
        floors: 12,
        lastUpdated: now
      },
      
      wealth: {
        totalWealth: 127540,
        checkingBalance: 12450,
        savingsBalance: 67890,
        investmentValue: 85000,
        creditCardDebt: 4567,
        netWorth: 127540,
        portfolioReturns: currentROI,
        savingsRate: 18,
        debtToIncomeRatio: 12,
        emergencyFundMonths: 4.2,
        lastUpdated: now
      },
      
      transactions: {
        monthlySpending: dailySpending * 30,
        dailyAverage: dailySpending,
        topCategories: [
          { name: 'Food & Dining', amount: 580, percentage: 23.2 },
          { name: 'Shopping', amount: 420, percentage: 16.8 },
          { name: 'Transportation', amount: 180, percentage: 7.2 },
          { name: 'Entertainment', amount: 150, percentage: 6.0 },
          { name: 'Healthcare', amount: 340, percentage: 13.6 }
        ],
        recentTransactions: [
          {
            id: 'txn_001',
            merchant: 'Whole Foods Market',
            amount: -127.43,
            category: 'Groceries',
            date: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
          },
          {
            id: 'txn_002',
            merchant: 'Apple Store',
            amount: -899.00,
            category: 'Electronics',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
          },
          {
            id: 'txn_003',
            merchant: 'Starbucks',
            amount: -6.85 * stressMultiplier, // Stress influences coffee purchases
            category: 'Coffee',
            date: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
          }
        ],
        lastUpdated: now
      },
      
      goals: {
        savingsGoals: [
          {
            id: 'goal_001',
            name: 'Emergency Fund',
            targetAmount: 25000,
            currentAmount: 18500,
            progress: 74,
            monthlyContribution: 750
          },
          {
            id: 'goal_002',
            name: 'House Down Payment',
            targetAmount: 50000,
            currentAmount: 23400,
            progress: 47,
            monthlyContribution: 1200
          },
          {
            id: 'goal_003',
            name: 'Vacation Fund',
            targetAmount: 8000,
            currentAmount: 3200,
            progress: 40,
            monthlyContribution: 300
          }
        ],
        totalProgress: 54,
        lastUpdated: now
      },
      
      correlations: {
        stressSpending: 0.65, // Positive correlation: higher stress = more spending
        sleepROI: 0.78, // Positive correlation: better sleep = better returns
        activityDecisions: 0.52, // Positive correlation: more activity = better decisions
        lastCalculated: now
      }
    };
  }
  
  // Recalculate correlations when data changes
  private recalculateCorrelations(): void {
    const state = this.dataState$.value;
    
    // Simulate correlation calculations based on current data
    const stressImpact = (state.health.stressLevel - 30) / 50; // Normalized stress impact
    const sleepImpact = (state.health.sleepHours - 6) / 4; // Normalized sleep impact
    const activityImpact = (state.health.steps - 7000) / 10000; // Normalized activity impact
    
    const updatedState = {
      ...state,
      correlations: {
        stressSpending: Math.max(-1, Math.min(1, 0.6 + stressImpact * 0.3)),
        sleepROI: Math.max(-1, Math.min(1, 0.7 + sleepImpact * 0.2)),
        activityDecisions: Math.max(-1, Math.min(1, 0.5 + activityImpact * 0.3)),
        lastCalculated: new Date().toISOString()
      }
    };
    
    this.dataState$.next(updatedState);
  }
  
  // Simulate realistic data changes over time
  private initializeDataUpdates(): void {
    // Update health metrics every 30 seconds to simulate device sync
    setInterval(() => {
      const currentHealth = this.dataState$.value.health;
      const timeOfDay = new Date().getHours();
      
      // Stress tends to be higher during work hours
      const stressVariation = timeOfDay >= 9 && timeOfDay <= 17 ? 5 : -3;
      const newStress = Math.max(15, Math.min(85, currentHealth.stressLevel + (Math.random() - 0.5) * 10 + stressVariation));
      
      // HRV varies inversely with stress
      const newHRV = Math.max(20, Math.min(70, 75 - newStress * 0.5 + (Math.random() - 0.5) * 5));
      
      this.updateHealthData({
        stressLevel: Math.round(newStress),
        heartRateVariability: Math.round(newHRV),
        wellnessScore: Math.round(100 - newStress * 0.8)
      });
    }, 30000);
    
    // Update financial metrics daily
    setInterval(() => {
      const currentWealth = this.dataState$.value.wealth;
      const portfolioVariation = (Math.random() - 0.5) * 0.5; // ±0.25% daily variation
      
      this.updateWealthData({
        portfolioReturns: Math.round((currentWealth.portfolioReturns + portfolioVariation) * 100) / 100
      });
    }, 24 * 60 * 60 * 1000); // Daily
  }
  
  // Helper methods for component integration
  public getFormattedData() {
    const state = this.dataState$.value;
    return {
      // Format for ConsolidatedInsightsPage
      insights: {
        creditScore: state.family.creditScore,
        financial: {
          score: Math.round((state.wealth.savingsRate + (100 - state.wealth.debtToIncomeRatio)) / 2),
          trend: 'up' as const,
          trendValue: '+2.3%',
          metrics: [
            { 
              label: 'Total Wealth', 
              value: `$${(state.wealth.totalWealth / 1000).toFixed(0)}K`,
              icon: 'DollarSign',
              color: '#10b981' 
            },
            { 
              label: 'Credit Score', 
              value: state.family.creditScore.toString(),
              icon: 'Shield',
              color: '#3b82f6' 
            },
            { 
              label: 'Monthly Savings', 
              value: `$${Math.round(state.family.monthlyIncome * state.wealth.savingsRate / 100)}`,
              icon: 'PiggyBank',
              color: '#8b5cf6' 
            },
            { 
              label: 'Investments', 
              value: `$${(state.wealth.investmentValue / 1000).toFixed(0)}K`,
              icon: 'TrendingUp',
              color: '#f59e0b' 
            }
          ]
        },
        wellness: {
          score: state.health.wellnessScore,
          trend: 'up' as const,
          trendValue: '+5%'
        }
      },
      
      // Format for Analytics dashboard  
      analytics: {
        overallScores: {
          health: state.health.wellnessScore,
          wealth: Math.round((state.wealth.savingsRate + (100 - state.wealth.debtToIncomeRatio)) / 2),
          sustainability: 82, // Calculated from eco spending
          financial_wellness: Math.round((state.health.wellnessScore + state.wealth.savingsRate) / 2)
        },
        correlations: [
          {
            id: 'stress-spending',
            type: 'stress-spending',
            correlationCoefficient: state.correlations.stressSpending,
            strength: Math.abs(state.correlations.stressSpending) > 0.7 ? 'strong' : 'moderate',
            insights: [`Stress levels ${state.correlations.stressSpending > 0 ? 'increase' : 'decrease'} spending by ${Math.abs(state.correlations.stressSpending * 100).toFixed(0)}%`]
          },
          {
            id: 'sleep-roi',
            type: 'sleep-investment',
            correlationCoefficient: state.correlations.sleepROI,
            strength: Math.abs(state.correlations.sleepROI) > 0.7 ? 'strong' : 'moderate',
            insights: [`Better sleep correlates with ${(state.correlations.sleepROI * 100).toFixed(0)}% better investment returns`]
          }
        ]
      }
    };
  }
}

// Export singleton instance
export const unifiedDataManager = UnifiedDataManager.getInstance();

// Export helper hooks for React components
export const useUnifiedHealth = () => unifiedDataManager.healthData$;
export const useUnifiedWealth = () => unifiedDataManager.wealthData$;
export const useUnifiedTransactions = () => unifiedDataManager.transactionData$;
export const useUnifiedGoals = () => unifiedDataManager.goalsData$;
export const useUnifiedCorrelations = () => unifiedDataManager.correlationData$;
export const useUnifiedState = () => unifiedDataManager.fullState$; 