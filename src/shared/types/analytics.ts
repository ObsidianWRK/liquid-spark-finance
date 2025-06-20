import { z } from 'zod';
import { BiometricsState } from '@/features/biometric-intervention/api/WellnessEngine';
import { PerformanceMetrics, RiskMetrics } from './investments';
import { FinancialHealthMetrics } from './financialPlanning';
import { TransactionAnalytics } from './transactions';
import { HealthScoreBreakdown } from '@/features/biometric-intervention/api/healthKitService';

// Core Analytics Data Types
export interface AnalyticsTimeframe {
  start: Date;
  end: Date;
  period: '1d' | '7d' | '30d' | '90d' | '365d' | 'all';
}

export interface AnalyticsDataPoint {
  timestamp: string;
  value: number;
  confidence?: number;
  metadata?: Record<string, any>;
}

// Health Metrics Unified Schema
export interface UnifiedHealthMetrics {
  // Core vitals
  heartRate: AnalyticsDataPoint[];
  heartRateVariability: AnalyticsDataPoint[];
  stressIndex: AnalyticsDataPoint[];
  sleepQuality: AnalyticsDataPoint[];

  // Activity metrics
  steps: AnalyticsDataPoint[];
  activeMinutes: AnalyticsDataPoint[];
  caloriesBurned: AnalyticsDataPoint[];

  // Composite scores
  wellnessScore: AnalyticsDataPoint[];
  activityScore: AnalyticsDataPoint[];
  recoveryScore: AnalyticsDataPoint[];

  // Trends and patterns
  weeklyTrends: {
    stress: 'rising' | 'falling' | 'stable';
    activity: 'improving' | 'declining' | 'stable';
    sleep: 'improving' | 'declining' | 'stable';
  };

  // Data quality
  dataCompleteness: number; // 0-100%
  lastSyncTime: string;
}

// Wealth Metrics Unified Schema
export interface UnifiedWealthMetrics {
  // Net worth components
  netWorth: AnalyticsDataPoint[];
  assets: AnalyticsDataPoint[];
  liabilities: AnalyticsDataPoint[];

  // Investment performance
  portfolioValue: AnalyticsDataPoint[];
  portfolioReturns: AnalyticsDataPoint[];

  // Cash flow
  income: AnalyticsDataPoint[];
  expenses: AnalyticsDataPoint[];
  savings: AnalyticsDataPoint[];

  // Financial health ratios
  debtToIncomeRatio: AnalyticsDataPoint[];
  savingsRate: AnalyticsDataPoint[];
  emergencyFundRatio: AnalyticsDataPoint[];

  // Performance metrics
  performanceMetrics: PerformanceMetrics;
  riskMetrics: RiskMetrics;

  // Trends
  monthlyTrends: {
    netWorth: 'growing' | 'declining' | 'stable';
    cashFlow: 'positive' | 'negative' | 'neutral';
    investments: 'outperforming' | 'underperforming' | 'market-rate';
  };
}

// Transaction Intelligence Unified Schema
export interface UnifiedTransactionMetrics {
  // Spending patterns
  dailySpending: AnalyticsDataPoint[];
  categorySpending: Record<string, AnalyticsDataPoint[]>;
  merchantSpending: Record<string, AnalyticsDataPoint[]>;

  // Transaction scores
  healthImpactScores: AnalyticsDataPoint[];
  ecoImpactScores: AnalyticsDataPoint[];
  necessityScores: AnalyticsDataPoint[];

  // Behavioral patterns
  spendingVelocity: AnalyticsDataPoint[];
  impulsePurchases: AnalyticsDataPoint[];
  planedPurchases: AnalyticsDataPoint[];

  // Insights and trends
  spendingTrends: {
    health: 'increasing' | 'decreasing' | 'stable';
    eco: 'improving' | 'declining' | 'stable';
    overall: 'conscious' | 'unconscious' | 'balanced';
  };

  // Correlation hints
  correlationStrength: number; // 0-1
  primaryDrivers: string[];
}

// Cross-Domain Correlation Schema
export interface HealthWealthCorrelation {
  id: string;
  type:
    | 'stress-spending'
    | 'sleep-decisions'
    | 'activity-performance'
    | 'health-investment';

  // Statistical measures
  correlationCoefficient: number; // -1 to 1
  significance: number; // p-value
  confidence: number; // 0-100%

  // Data points
  dataPoints: Array<{
    timestamp: string;
    healthValue: number;
    wealthValue: number;
    transactionCount?: number;
  }>;

  // Insights
  pattern: 'positive' | 'negative' | 'nonlinear' | 'threshold';
  strength: 'weak' | 'moderate' | 'strong';
  actionable: boolean;

  // Recommendations
  insights: string[];
  recommendations: string[];

  // Metadata
  timeframe: AnalyticsTimeframe;
  lastCalculated: string;
}

// Main Analytics Dashboard Data Schema
export interface AnalyticsDashboardData {
  // Core metrics
  health: UnifiedHealthMetrics;
  wealth: UnifiedWealthMetrics;
  transactions: UnifiedTransactionMetrics;

  // Cross-domain correlations
  correlations: HealthWealthCorrelation[];

  // Summary scores
  overallScores: {
    health: number;
    wealth: number;
    sustainability: number;
    financial_wellness: number;
  };

  // Key insights
  insights: Array<{
    id: string;
    type: 'health' | 'wealth' | 'correlation' | 'trend';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    actionable: boolean;
    recommendation?: string;
    confidence: number;
  }>;

  // Metadata
  timeframe: AnalyticsTimeframe;
  lastUpdated: string;
  dataQuality: {
    health: number;
    wealth: number;
    transactions: number;
    overall: number;
  };
}

// Real-time Analytics Stream Schema
export const AnalyticsStreamSchema = z.object({
  timestamp: z.string(),

  // Real-time health metrics
  currentStress: z.number().min(0).max(100).optional(),
  currentHR: z.number().min(30).max(220).optional(),
  currentHRV: z.number().min(0).max(100).optional(),

  // Recent financial activity
  recentTransactions: z.array(
    z.object({
      amount: z.number(),
      category: z.string(),
      timestamp: z.string(),
      healthScore: z.number().optional(),
    })
  ),

  // Live correlations
  liveCorrelations: z.array(
    z.object({
      type: z.string(),
      strength: z.number().min(-1).max(1),
      confidence: z.number().min(0).max(1),
    })
  ),

  // Intervention triggers
  shouldIntervene: z.boolean(),
  interventionReason: z.string().optional(),
});

export type AnalyticsStream = z.infer<typeof AnalyticsStreamSchema>;

// Analytics Configuration Schema
export interface AnalyticsConfig {
  // Data sources
  enabledSources: {
    healthKit: boolean;
    plaidTransactions: boolean;
    investmentData: boolean;
    biometricDevices: boolean;
  };

  // Correlation settings
  correlationSettings: {
    minDataPoints: number;
    significanceThreshold: number;
    updateFrequency: 'realtime' | 'hourly' | 'daily';
    enabledCorrelations: string[];
  };

  // Privacy and retention
  privacy: {
    shareCorrelations: boolean;
    anonymizeData: boolean;
    retentionPeriod: number; // days
  };

  // Notifications
  notifications: {
    strongCorrelations: boolean;
    healthWealthAlerts: boolean;
    spendingPatterns: boolean;
  };
}

// Analytics API Response Types
export interface AnalyticsAPIResponse<T = any> {
  data: T;
  metadata: {
    timestamp: string;
    processingTime: number;
    dataQuality: number;
    correlationsCount: number;
  };
  errors?: string[];
  warnings?: string[];
}

// Export utility types
export type HealthMetricKey = keyof UnifiedHealthMetrics;
export type WealthMetricKey = keyof UnifiedWealthMetrics;
export type TransactionMetricKey = keyof UnifiedTransactionMetrics;
export type CorrelationType = HealthWealthCorrelation['type'];
