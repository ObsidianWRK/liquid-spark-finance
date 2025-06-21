/**
 * @fileoverview Vueni Viz System - Main Export Barrel
 * @version 1.0.0
 * @description Centralized exports for the MetricIQ visualization system
 * 
 * Tree-shaking optimized - only import what you need
 * Feature flagged via VIZ_DASH_ENABLED environment variable
 */

// Grid & Layout Components
export { DashboardGrid } from './DashboardGrid';
export { GridTile } from './GridTile';
export { GraphContainer } from './GraphContainer';

// Graph Primitives (lazy loaded)
export const TimelineAreaChart = () => import('./TimelineAreaChart');
export const DotMatrixSpark = () => import('./DotMatrixSpark');
export const KpiDonut = () => import('./KpiDonut');
export const SegmentSlider = () => import('./SegmentSlider');

// Composed Cards (lazy loaded)
export const LifestyleBehaviourCard = () => import('./LifestyleBehaviourCard');
export const InsightSliderStack = () => import('./InsightSliderStack');
export const BodyHealthCard = () => import('./BodyHealthCard');

// Design Tokens
export { VIZ_TOKENS } from './tokens';
export type { VizTokens } from './tokens';

// Type Definitions
export type {
  DashboardGridProps,
  GridTileProps,
  GraphContainerProps,
  TimelineData,
  KpiData,
  HealthMetrics,
} from './types';

/**
 * Feature flag check utility
 * @returns {boolean} Whether viz dashboard is enabled
 */
export const isVizEnabled = (): boolean => {
  return import.meta.env.VIZ_DASH_ENABLED === 'true';
}; 