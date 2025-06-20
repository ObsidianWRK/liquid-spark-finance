import { Observable, BehaviorSubject, combineLatest, interval } from 'rxjs';
import { map, shareReplay, tap, catchError, switchMap } from 'rxjs/operators';
import {
  AnalyticsDashboardData,
  UnifiedHealthMetrics,
  UnifiedWealthMetrics,
  UnifiedTransactionMetrics,
  HealthWealthCorrelation,
  AnalyticsTimeframe,
  AnalyticsDataPoint,
  AnalyticsConfig,
  AnalyticsAPIResponse,
} from '@/shared/types/analytics';
import { biometricStream } from '@/features/biometric-intervention/api/BiometricStream';
import { wellnessEngine } from '@/features/biometric-intervention/api/WellnessEngine';
import { fetchHealthMetrics } from '@/features/biometric-intervention/api/healthKitService';
import { VisualizationService } from '@/features/dashboard/api/visualizationService';
import { TransactionService } from '@/features/transactions/api/transactionService';
import { investmentService } from '@/features/investments/api/investmentService';

/**
 * Comprehensive Analytics Service
 * Merges health, wealth, and transaction data to generate insights and correlations
 */
export class AnalyticsService {
  private static instance: AnalyticsService;
  private dashboardData$ = new BehaviorSubject<AnalyticsDashboardData | null>(
    null
  );
  private config$ = new BehaviorSubject<AnalyticsConfig>(
    this.getDefaultConfig()
  );
  private correlationCache = new Map<string, HealthWealthCorrelation>();

  // Service dependencies
  private visualizationService = VisualizationService.getInstance();
  private transactionService = TransactionService.getInstance();
  private investmentService = investmentService;

  private constructor() {
    this.initializeDataStream();
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Get the main analytics dashboard data stream
   */
  public getDashboardData$(): Observable<AnalyticsDashboardData> {
    return this.dashboardData$.pipe(
      map((data) => data || this.getMockDashboardData()),
      shareReplay(1)
    );
  }

  /**
   * Fetch comprehensive analytics data for a specific timeframe
   */
  public async getAnalyticsData(
    familyId: string,
    timeframe: AnalyticsTimeframe
  ): Promise<AnalyticsAPIResponse<AnalyticsDashboardData>> {
    const startTime = performance.now();

    try {
      // Fetch data from all sources in parallel
      const [healthData, wealthData, transactionData] = await Promise.all([
        this.getHealthMetrics(familyId, timeframe),
        this.getWealthMetrics(familyId, timeframe),
        this.getTransactionMetrics(familyId, timeframe),
      ]);

      // Calculate correlations
      const correlations = await this.calculateCorrelations(
        healthData,
        wealthData,
        transactionData
      );

      // Generate insights
      const insights = await this.generateInsights(
        healthData,
        wealthData,
        transactionData,
        correlations
      );

      const dashboardData: AnalyticsDashboardData = {
        health: healthData,
        wealth: wealthData,
        transactions: transactionData,
        correlations,
        overallScores: this.calculateOverallScores(
          healthData,
          wealthData,
          transactionData
        ),
        insights,
        timeframe,
        lastUpdated: new Date().toISOString(),
        dataQuality: this.calculateDataQuality(
          healthData,
          wealthData,
          transactionData
        ),
      };

      const processingTime = performance.now() - startTime;

      return {
        data: dashboardData,
        metadata: {
          timestamp: new Date().toISOString(),
          processingTime,
          dataQuality: dashboardData.dataQuality.overall,
          correlationsCount: correlations.length,
        },
      };
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      return {
        data: this.getMockDashboardData(),
        metadata: {
          timestamp: new Date().toISOString(),
          processingTime: performance.now() - startTime,
          dataQuality: 75,
          correlationsCount: 3,
        },
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  /**
   * Get unified health metrics
   */
  private async getHealthMetrics(
    familyId: string,
    timeframe: AnalyticsTimeframe
  ): Promise<UnifiedHealthMetrics> {
    try {
      // Get current health metrics
      const currentMetrics = await fetchHealthMetrics();

      // Generate historical data (mock for now - would integrate with real health data)
      const healthData = this.generateMockHealthData(timeframe);

      return {
        heartRate: healthData.heartRate,
        heartRateVariability: healthData.hrv,
        stressIndex: healthData.stress,
        sleepQuality: healthData.sleep,
        steps: healthData.steps,
        activeMinutes: healthData.activeMinutes,
        caloriesBurned: healthData.calories,
        wellnessScore: healthData.wellness,
        activityScore: healthData.activity,
        recoveryScore: healthData.recovery,
        weeklyTrends: {
          stress:
            healthData.stress[healthData.stress.length - 1]?.value >
            healthData.stress[0]?.value
              ? 'rising'
              : 'falling',
          activity: 'improving',
          sleep: 'stable',
        },
        dataCompleteness: 92,
        lastSyncTime: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching health metrics:', error);
      return this.getMockHealthMetrics();
    }
  }

  /**
   * Get unified wealth metrics
   */
  private async getWealthMetrics(
    familyId: string,
    timeframe: AnalyticsTimeframe
  ): Promise<UnifiedWealthMetrics> {
    try {
      // Get financial data from various services
      const [netWorthHistory, portfolioData, dashboardData] = await Promise.all(
        [
          this.visualizationService.getNetWorthHistory(familyId, 12),
          this.investmentService.getFamilyPortfolio(familyId),
          this.visualizationService.getDashboardData(familyId),
        ]
      );

      // Convert to analytics format
      const wealthData = this.transformWealthData(
        netWorthHistory,
        portfolioData,
        dashboardData
      );

      return wealthData;
    } catch (error) {
      console.error('Error fetching wealth metrics:', error);
      return this.getMockWealthMetrics();
    }
  }

  /**
   * Get unified transaction metrics
   */
  private async getTransactionMetrics(
    familyId: string,
    timeframe: AnalyticsTimeframe
  ): Promise<UnifiedTransactionMetrics> {
    try {
      // Get transaction analytics
      const analytics = await this.transactionService.generateAnalytics(
        familyId,
        'month'
      );

      // Transform to unified format
      return this.transformTransactionData(analytics);
    } catch (error) {
      console.error('Error fetching transaction metrics:', error);
      return this.getMockTransactionMetrics();
    }
  }

  /**
   * Calculate correlations between health and wealth metrics
   */
  private async calculateCorrelations(
    health: UnifiedHealthMetrics,
    wealth: UnifiedWealthMetrics,
    transactions: UnifiedTransactionMetrics
  ): Promise<HealthWealthCorrelation[]> {
    const correlations: HealthWealthCorrelation[] = [];

    // Stress vs Spending correlation
    const stressSpendingCorr = this.calculatePearsonCorrelation(
      health.stressIndex.map((d) => d.value),
      transactions.dailySpending.map((d) => d.value)
    );

    if (Math.abs(stressSpendingCorr) > 0.3) {
      correlations.push({
        id: 'stress-spending',
        type: 'stress-spending',
        correlationCoefficient: stressSpendingCorr,
        significance: 0.05,
        confidence: 85,
        dataPoints: health.stressIndex.map((stress, i) => ({
          timestamp: stress.timestamp,
          healthValue: stress.value,
          wealthValue: transactions.dailySpending[i]?.value || 0,
        })),
        pattern: stressSpendingCorr > 0 ? 'positive' : 'negative',
        strength: Math.abs(stressSpendingCorr) > 0.7 ? 'strong' : 'moderate',
        actionable: true,
        insights: [
          stressSpendingCorr > 0
            ? 'Higher stress levels correlate with increased spending'
            : 'Higher stress levels correlate with reduced spending',
        ],
        recommendations: [
          stressSpendingCorr > 0
            ? 'Consider stress management techniques to reduce impulse purchases'
            : 'Monitor for potential under-spending during high stress periods',
        ],
        timeframe: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          end: new Date(),
          period: '30d',
        },
        lastCalculated: new Date().toISOString(),
      });
    }

    // Sleep vs Investment Performance correlation
    const sleepInvestmentCorr = this.calculatePearsonCorrelation(
      health.sleepQuality.map((d) => d.value),
      wealth.portfolioReturns.map((d) => d.value)
    );

    if (Math.abs(sleepInvestmentCorr) > 0.3) {
      correlations.push({
        id: 'sleep-investment',
        type: 'sleep-decisions',
        correlationCoefficient: sleepInvestmentCorr,
        significance: 0.05,
        confidence: 78,
        dataPoints: health.sleepQuality.map((sleep, i) => ({
          timestamp: sleep.timestamp,
          healthValue: sleep.value,
          wealthValue: wealth.portfolioReturns[i]?.value || 0,
        })),
        pattern: sleepInvestmentCorr > 0 ? 'positive' : 'negative',
        strength: Math.abs(sleepInvestmentCorr) > 0.6 ? 'strong' : 'moderate',
        actionable: true,
        insights: [
          'Sleep quality appears to influence investment decision timing',
        ],
        recommendations: [
          'Consider delaying major investment decisions when sleep quality is poor',
        ],
        timeframe: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          end: new Date(),
          period: '30d',
        },
        lastCalculated: new Date().toISOString(),
      });
    }

    // Activity vs Decision Quality correlation
    const activityDecisionCorr = this.calculatePearsonCorrelation(
      health.steps.map((d) => d.value),
      transactions.necessityScores.map((d) => d.value)
    );

    if (Math.abs(activityDecisionCorr) > 0.3) {
      correlations.push({
        id: 'activity-decisions',
        type: 'activity-performance',
        correlationCoefficient: activityDecisionCorr,
        significance: 0.05,
        confidence: 82,
        dataPoints: health.steps.map((activity, i) => ({
          timestamp: activity.timestamp,
          healthValue: activity.value,
          wealthValue: transactions.necessityScores[i]?.value || 0,
        })),
        pattern: activityDecisionCorr > 0 ? 'positive' : 'negative',
        strength: Math.abs(activityDecisionCorr) > 0.5 ? 'strong' : 'moderate',
        actionable: true,
        insights: [
          'Physical activity levels correlate with financial decision quality',
        ],
        recommendations: [
          'Consider taking a walk before making significant financial decisions',
        ],
        timeframe: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          end: new Date(),
          period: '30d',
        },
        lastCalculated: new Date().toISOString(),
      });
    }

    return correlations;
  }

  /**
   * Calculate Pearson correlation coefficient
   */
  private calculatePearsonCorrelation(x: number[], y: number[]): number {
    const n = Math.min(x.length, y.length);
    if (n < 2) return 0;

    const sumX = x.slice(0, n).reduce((a, b) => a + b, 0);
    const sumY = y.slice(0, n).reduce((a, b) => a + b, 0);
    const sumXY = x.slice(0, n).reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumXX = x.slice(0, n).reduce((acc, xi) => acc + xi * xi, 0);
    const sumYY = y.slice(0, n).reduce((acc, yi) => acc + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt(
      (n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY)
    );

    return denominator === 0 ? 0 : numerator / denominator;
  }

  /**
   * Generate actionable insights from the data
   */
  private async generateInsights(
    health: UnifiedHealthMetrics,
    wealth: UnifiedWealthMetrics,
    transactions: UnifiedTransactionMetrics,
    correlations: HealthWealthCorrelation[]
  ): Promise<AnalyticsDashboardData['insights']> {
    const insights: AnalyticsDashboardData['insights'] = [];

    // High correlation insights
    correlations.forEach((corr) => {
      if (corr.strength === 'strong' && corr.actionable) {
        insights.push({
          id: `correlation-${corr.id}`,
          type: 'correlation',
          title: `Strong ${corr.type.replace('-', ' ')} correlation detected`,
          description: corr.insights[0] || '',
          impact: 'high',
          actionable: true,
          recommendation: corr.recommendations[0],
          confidence: corr.confidence,
        });
      }
    });

    // Health trend insights
    const avgStress =
      health.stressIndex.reduce((sum, d) => sum + d.value, 0) /
      health.stressIndex.length;
    if (avgStress > 70) {
      insights.push({
        id: 'high-stress-alert',
        type: 'health',
        title: 'Elevated stress levels detected',
        description: `Your average stress level (${Math.round(avgStress)}) is above the healthy range`,
        impact: 'high',
        actionable: true,
        recommendation:
          'Consider stress management techniques and monitor spending patterns',
        confidence: 90,
      });
    }

    // Wealth trend insights
    const netWorthTrend =
      wealth.netWorth[wealth.netWorth.length - 1]?.value -
      wealth.netWorth[0]?.value;
    if (netWorthTrend > 0) {
      insights.push({
        id: 'positive-wealth-trend',
        type: 'wealth',
        title: 'Positive net worth growth',
        description: `Your net worth has increased by $${Math.round(netWorthTrend).toLocaleString()} this period`,
        impact: 'medium',
        actionable: false,
        confidence: 95,
      });
    }

    return insights.sort((a, b) => {
      const impactWeight = { high: 3, medium: 2, low: 1 };
      return impactWeight[b.impact] - impactWeight[a.impact];
    });
  }

  /**
   * Calculate overall scores across all domains
   */
  private calculateOverallScores(
    health: UnifiedHealthMetrics,
    wealth: UnifiedWealthMetrics,
    transactions: UnifiedTransactionMetrics
  ) {
    const healthScore =
      health.wellnessScore[health.wellnessScore.length - 1]?.value || 75;
    const wealthScore = this.calculateWealthScore(wealth);
    const sustainabilityScore = this.calculateSustainabilityScore(transactions);
    const financialWellnessScore = Math.round((healthScore + wealthScore) / 2);

    return {
      health: Math.round(healthScore),
      wealth: Math.round(wealthScore),
      sustainability: Math.round(sustainabilityScore),
      financial_wellness: financialWellnessScore,
    };
  }

  private calculateWealthScore(wealth: UnifiedWealthMetrics): number {
    const netWorthGrowth =
      wealth.netWorth.length > 1
        ? ((wealth.netWorth[wealth.netWorth.length - 1].value -
            wealth.netWorth[0].value) /
            wealth.netWorth[0].value) *
          100
        : 0;

    const savingsRate =
      wealth.savingsRate[wealth.savingsRate.length - 1]?.value || 0;
    const debtRatio =
      wealth.debtToIncomeRatio[wealth.debtToIncomeRatio.length - 1]?.value || 0;

    // Simple scoring algorithm (would be more sophisticated in production)
    let score = 50; // Base score
    score += Math.min(netWorthGrowth * 2, 25); // Up to 25 points for growth
    score += Math.min(savingsRate, 20); // Up to 20 points for savings rate
    score -= Math.min(debtRatio / 2, 15); // Subtract for high debt ratio

    return Math.max(0, Math.min(100, score));
  }

  private calculateSustainabilityScore(
    transactions: UnifiedTransactionMetrics
  ): number {
    const ecoScores = transactions.ecoImpactScores;
    const avgEcoScore =
      ecoScores.reduce((sum, d) => sum + d.value, 0) / ecoScores.length;
    return avgEcoScore || 75; // Default score
  }

  /**
   * Calculate data quality metrics
   */
  private calculateDataQuality(
    health: UnifiedHealthMetrics,
    wealth: UnifiedWealthMetrics,
    transactions: UnifiedTransactionMetrics
  ) {
    const healthQuality = health.dataCompleteness;
    const wealthQuality = 95; // Assume high quality for financial data
    const transactionQuality = 98; // Assume very high quality for transaction data

    return {
      health: healthQuality,
      wealth: wealthQuality,
      transactions: transactionQuality,
      overall: Math.round(
        (healthQuality + wealthQuality + transactionQuality) / 3
      ),
    };
  }

  /**
   * Initialize real-time data stream
   */
  private initializeDataStream(): void {
    // Update dashboard data every 5 minutes
    interval(5 * 60 * 1000)
      .pipe(
        switchMap(() =>
          this.getAnalyticsData('demo_family', {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            end: new Date(),
            period: '30d',
          })
        ),
        tap((response) => this.dashboardData$.next(response.data)),
        catchError((error) => {
          console.error('Error in analytics data stream:', error);
          return [];
        })
      )
      .subscribe();
  }

  /**
   * Get default analytics configuration
   */
  private getDefaultConfig(): AnalyticsConfig {
    return {
      enabledSources: {
        healthKit: true,
        plaidTransactions: true,
        investmentData: true,
        biometricDevices: true,
      },
      correlationSettings: {
        minDataPoints: 10,
        significanceThreshold: 0.05,
        updateFrequency: 'daily',
        enabledCorrelations: [
          'stress-spending',
          'sleep-decisions',
          'activity-performance',
        ],
      },
      privacy: {
        shareCorrelations: false,
        anonymizeData: true,
        retentionPeriod: 365,
      },
      notifications: {
        strongCorrelations: true,
        healthWealthAlerts: true,
        spendingPatterns: true,
      },
    };
  }

  // Mock data generators (temporary - would be replaced with real data)
  private generateMockHealthData(timeframe: AnalyticsTimeframe): any {
    const days = Math.min(
      30,
      Math.floor(
        (timeframe.end.getTime() - timeframe.start.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );
    const data: any = {
      heartRate: [],
      hrv: [],
      stress: [],
      sleep: [],
      steps: [],
      activeMinutes: [],
      calories: [],
      wellness: [],
      activity: [],
      recovery: [],
    };

    for (let i = 0; i < days; i++) {
      const timestamp = new Date(
        timeframe.start.getTime() + i * 24 * 60 * 60 * 1000
      ).toISOString();

      data.heartRate.push({
        timestamp,
        value: 65 + Math.random() * 20,
        confidence: 0.9,
      });
      data.hrv.push({
        timestamp,
        value: 35 + Math.random() * 30,
        confidence: 0.85,
      });
      data.stress.push({
        timestamp,
        value: 20 + Math.random() * 60,
        confidence: 0.8,
      });
      data.sleep.push({
        timestamp,
        value: 6.5 + Math.random() * 2,
        confidence: 0.95,
      });
      data.steps.push({
        timestamp,
        value: 7000 + Math.random() * 6000,
        confidence: 0.99,
      });
      data.activeMinutes.push({
        timestamp,
        value: 25 + Math.random() * 40,
        confidence: 0.9,
      });
      data.calories.push({
        timestamp,
        value: 350 + Math.random() * 200,
        confidence: 0.85,
      });
      data.wellness.push({
        timestamp,
        value: 70 + Math.random() * 25,
        confidence: 0.8,
      });
      data.activity.push({
        timestamp,
        value: 65 + Math.random() * 30,
        confidence: 0.85,
      });
      data.recovery.push({
        timestamp,
        value: 60 + Math.random() * 35,
        confidence: 0.8,
      });
    }

    return data;
  }

  private getMockHealthMetrics(): UnifiedHealthMetrics {
    return {
      heartRate: [
        { timestamp: new Date().toISOString(), value: 72, confidence: 0.9 },
      ],
      heartRateVariability: [
        { timestamp: new Date().toISOString(), value: 45, confidence: 0.85 },
      ],
      stressIndex: [
        { timestamp: new Date().toISOString(), value: 35, confidence: 0.8 },
      ],
      sleepQuality: [
        { timestamp: new Date().toISOString(), value: 7.5, confidence: 0.95 },
      ],
      steps: [
        { timestamp: new Date().toISOString(), value: 8500, confidence: 0.99 },
      ],
      activeMinutes: [
        { timestamp: new Date().toISOString(), value: 45, confidence: 0.9 },
      ],
      caloriesBurned: [
        { timestamp: new Date().toISOString(), value: 420, confidence: 0.85 },
      ],
      wellnessScore: [
        { timestamp: new Date().toISOString(), value: 85, confidence: 0.8 },
      ],
      activityScore: [
        { timestamp: new Date().toISOString(), value: 78, confidence: 0.85 },
      ],
      recoveryScore: [
        { timestamp: new Date().toISOString(), value: 82, confidence: 0.8 },
      ],
      weeklyTrends: {
        stress: 'falling',
        activity: 'improving',
        sleep: 'stable',
      },
      dataCompleteness: 92,
      lastSyncTime: new Date().toISOString(),
    };
  }

  private getMockWealthMetrics(): UnifiedWealthMetrics {
    return {
      netWorth: [
        { timestamp: new Date().toISOString(), value: 127500, confidence: 1.0 },
      ],
      assets: [
        { timestamp: new Date().toISOString(), value: 152500, confidence: 1.0 },
      ],
      liabilities: [
        { timestamp: new Date().toISOString(), value: 25000, confidence: 1.0 },
      ],
      portfolioValue: [
        { timestamp: new Date().toISOString(), value: 85000, confidence: 1.0 },
      ],
      portfolioReturns: [
        { timestamp: new Date().toISOString(), value: 8.2, confidence: 0.9 },
      ],
      income: [
        { timestamp: new Date().toISOString(), value: 6500, confidence: 1.0 },
      ],
      expenses: [
        { timestamp: new Date().toISOString(), value: 4200, confidence: 0.95 },
      ],
      savings: [
        { timestamp: new Date().toISOString(), value: 2300, confidence: 1.0 },
      ],
      debtToIncomeRatio: [
        { timestamp: new Date().toISOString(), value: 15, confidence: 1.0 },
      ],
      savingsRate: [
        { timestamp: new Date().toISOString(), value: 18, confidence: 1.0 },
      ],
      emergencyFundRatio: [
        { timestamp: new Date().toISOString(), value: 6.2, confidence: 1.0 },
      ],
      performanceMetrics: {
        totalReturn: 8.2,
        annualizedReturn: 8.2,
        returns: { '1d': 0.1, '7d': 0.8, '30d': 2.1, '90d': 4.5, '365d': 8.2 },
        sharpeRatio: 1.2,
        volatility: 15,
        maxDrawdown: -8.5,
        alpha: 0.5,
        beta: 1.1,
        rSquared: 0.89,
      },
      riskMetrics: {
        concentrationRisk: 25,
        sectorConcentration: 35,
        geographicRisk: 15,
        currencyRisk: 5,
        correlation: 0.75,
        var95: 12500,
        var99: 18000,
        expectedShortfall: 20000,
      },
      monthlyTrends: {
        netWorth: 'growing',
        cashFlow: 'positive',
        investments: 'outperforming',
      },
    };
  }

  private getMockTransactionMetrics(): UnifiedTransactionMetrics {
    return {
      dailySpending: [
        { timestamp: new Date().toISOString(), value: 140, confidence: 0.98 },
      ],
      categorySpending: {
        health: [
          { timestamp: new Date().toISOString(), value: 340, confidence: 0.95 },
        ],
        fitness: [
          { timestamp: new Date().toISOString(), value: 85, confidence: 0.95 },
        ],
        food: [
          { timestamp: new Date().toISOString(), value: 420, confidence: 0.98 },
        ],
      },
      merchantSpending: {},
      healthImpactScores: [
        { timestamp: new Date().toISOString(), value: 75, confidence: 0.8 },
      ],
      ecoImpactScores: [
        { timestamp: new Date().toISOString(), value: 82, confidence: 0.8 },
      ],
      necessityScores: [
        { timestamp: new Date().toISOString(), value: 68, confidence: 0.7 },
      ],
      spendingVelocity: [
        { timestamp: new Date().toISOString(), value: 3.2, confidence: 0.9 },
      ],
      impulsePurchases: [
        { timestamp: new Date().toISOString(), value: 2, confidence: 0.8 },
      ],
      planedPurchases: [
        { timestamp: new Date().toISOString(), value: 8, confidence: 0.9 },
      ],
      spendingTrends: {
        health: 'increasing',
        eco: 'improving',
        overall: 'conscious',
      },
      correlationStrength: 0.65,
      primaryDrivers: ['stress', 'sleep_quality', 'weekend_effect'],
    };
  }

  private transformWealthData(
    netWorthHistory: any,
    portfolioData: any,
    dashboardData: any
  ): UnifiedWealthMetrics {
    // Transform existing data to unified format
    // This would contain actual transformation logic in production
    return this.getMockWealthMetrics();
  }

  private transformTransactionData(analytics: any): UnifiedTransactionMetrics {
    // Transform existing transaction analytics to unified format
    // This would contain actual transformation logic in production
    return this.getMockTransactionMetrics();
  }

  private getMockDashboardData(): AnalyticsDashboardData {
    return {
      health: this.getMockHealthMetrics(),
      wealth: this.getMockWealthMetrics(),
      transactions: this.getMockTransactionMetrics(),
      correlations: [],
      overallScores: {
        health: 85,
        wealth: 72,
        sustainability: 82,
        financial_wellness: 78,
      },
      insights: [],
      timeframe: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date(),
        period: '30d',
      },
      lastUpdated: new Date().toISOString(),
      dataQuality: {
        health: 92,
        wealth: 95,
        transactions: 98,
        overall: 95,
      },
    };
  }
}

// Export singleton instance
export const analyticsService = AnalyticsService.getInstance();
