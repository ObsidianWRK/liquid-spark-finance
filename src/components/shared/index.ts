// Shared components that consolidate duplicate implementations

// Transaction List Components
export { default as VueniUnifiedTransactionList } from './VueniUnifiedTransactionList';
export type { 
  VueniUnifiedTransactionListProps, 
  VueniTransaction,
  VueniTransactionFeatures,
  TransactionVariant
} from './VueniUnifiedTransactionList';

// Score Circle Components
export { SharedScoreCircle } from './SharedScoreCircle';
export type { SharedScoreCircleProps, ScoreGroupProps, ScoreType } from './SharedScoreCircle';

// Insights Page Components
export { ConfigurableInsightsPage } from '@/features/insights/components/ConfigurableInsightsPage';
export type { ConfigurableInsightsPageProps } from '@/features/insights/components/ConfigurableInsightsPage';

// Temporarily commented out during consolidation
// export { 
//   VueniUnifiedInsightsPage,
//   insightsPresets
// } from '@/features/insights/components/VueniUnifiedInsightsPage';
// export type { 
//   VueniUnifiedInsightsPageProps, 
//   InsightsVariant, 
//   ViewMode,
//   Transaction as InsightsTransaction, 
//   Account as InsightsAccount 
// } from '@/features/insights/components/VueniUnifiedInsightsPage';

// Design System Components
export { default as VueniDesignSystem } from './VueniDesignSystem';
export { 
  VueniGlassCard,
  VueniButton,
  VueniMetric,
  VueniStatusBadge,
  VueniSkeleton,
  VueniContainer,
  VueniSection,
  VueniGrid,
  vueniTokens
} from './VueniDesignSystem';
export type {
  VueniGlassCardProps,
  VueniButtonProps,
  VueniMetricProps,
  VueniStatusBadgeProps,
  VueniSkeletonProps
} from './VueniDesignSystem';

// Feature Flag System
export { default as VueniFeatureFlags } from './VueniFeatureFlags';
export {
  FeatureFlagProvider,
  useFeatureFlags,
  useTransactionVariant,
  useInsightsVariant,
  useCompactMode,
  useAnimationsEnabled,
  usePerformanceMode,
  FeatureFlagDebugPanel,
  withFeatureFlag,
  checkFeatureFlag,
  featureFlagPresets
} from './VueniFeatureFlags';
export type { 
  FeatureFlags, 
  FeatureFlagContextType 
} from './VueniFeatureFlags';

// All core components now consolidated and production-ready

// Re-export shared components
export { default as VueniConsolidationDemo } from './VueniConsolidationDemo';

// Temporarily commenting out missing component
// export { default as VueniUnifiedInsightsPage } from '@/features/insights/components/VueniUnifiedInsightsPage';

// Only export what actually exists and doesn't cause import errors
// All other exports are temporarily removed to fix the build