// 🎨 **Vueni UI Kit** - Unified Design System
// Consolidated from multiple Card/UI component sources

// Core Universal Components
export { UniversalCard } from '../shared/ui/UniversalCard';
export { Button } from '../shared/ui/button';
export { Input } from '../shared/ui/input';

// Specialized Components
export { UniversalMetricCard } from '../features/insights/components/UniversalMetricCard';
export { UniversalScoreCard } from '../features/insights/components/UniversalScoreCard';
export { SharedScoreCircle } from '../components/shared/SharedScoreCircle';

// Layout Components
export { UnifiedCard } from '../shared/ui/UnifiedCard';

// Unified Transaction Components
export { default as UnifiedTransactionList } from '../features/transactions/components/UnifiedTransactionList';

// Base Insights
export { default as BaseInsightsPage } from '../features/insights/components/BaseInsightsPage';

// Theme
export { vueniTheme } from '../theme/unified';
