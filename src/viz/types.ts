/**
 * @fileoverview Viz System Type Definitions
 * @description Strict TypeScript interfaces for MetricIQ components
 */

import React from 'react';

// ============================================================================
// LAYOUT TYPES
// ============================================================================

export interface DashboardGridProps {
  children: React.ReactNode;
  className?: string;
  density?: 'compact' | 'comfortable' | 'spacious';
  maxCols?: 2 | 3 | 4;
}

export interface GridTileProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export interface GraphContainerProps {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  error?: string | null;
  fallback?: React.ReactNode;
}

// ============================================================================
// DATA TYPES  
// ============================================================================

export interface TimelineData {
  timestamp: string;
  value: number;
  label?: string;
}

export interface KpiData {
  value: number;
  max: number;
  label: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color?: string;
}

export interface HealthMetrics {
  heartRate: number;
  stressLevel: number;
  activityLevel: number;
  timestamp: string;
}

export interface SpendingPattern {
  category: string;
  amount: number;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
}

export interface SavingsGoal {
  id: string;
  title: string;
  current: number;
  target: number;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface TimelineAreaChartProps {
  data: TimelineData[];
  height?: number;
  color?: string;
  className?: string;
  showXAxis?: boolean;
  showYAxis?: boolean;
}

export interface DotMatrixSparkProps {
  data: number[];
  width?: number;
  height?: number;
  dotSize?: number;
  className?: string;
}

export interface KpiDonutProps {
  data: KpiData;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
}

export interface SegmentSliderProps {
  segments: Array<{
    value: number;
    color: string;
    label: string;
  }>;
  className?: string;
}

// ============================================================================
// COMPOSED CARD PROPS
// ============================================================================

export interface LifestyleBehaviourCardProps {
  spendingPatterns: SpendingPattern[];
  accountMetrics: {
    totalBalance: number;
    monthlySpend: number;
    topCategory: string;
  };
  className?: string;
}

export interface InsightSliderStackProps {
  goals: SavingsGoal[];
  className?: string;
  onGoalClick?: (goalId: string) => void;
}

export interface BodyHealthCardProps {
  metrics: HealthMetrics;
  className?: string;
  compact?: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type ChartTheme = 'light' | 'dark';
export type AnimationEasing = 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
export type ResponsiveSize = 'sm' | 'md' | 'lg' | 'xl'; 