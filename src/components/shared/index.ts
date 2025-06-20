// Shared components that consolidate duplicate implementations

// Transaction List Components
export { 
  VueniUnifiedTransactionList,
  transactionListPresets
} from './VueniUnifiedTransactionList';
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

export { 
  VueniUnifiedInsightsPage,
  insightsPresets
} from '@/features/insights/components/VueniUnifiedInsightsPage';
export type { 
  VueniUnifiedInsightsPageProps, 
  InsightsVariant, 
  ViewMode,
  Transaction as InsightsTransaction, 
  Account as InsightsAccount 
} from '@/features/insights/components/VueniUnifiedInsightsPage';

// Design System Components
export { 
  VueniDesignSystem,
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