// CC: Feature flag system for gating new components (R3 requirement)
export interface FeatureFlags {
  FEATURE_CLOUD: boolean;
  SMART_ACCOUNTS_DECK: boolean;
  ENHANCED_ANIMATIONS: boolean;
}

// CC: Default feature flags - can be overridden by environment variables
const defaultFlags: FeatureFlags = {
  FEATURE_CLOUD: true, // Enable by default for demo
  SMART_ACCOUNTS_DECK: true, // Enable by default for demo
  ENHANCED_ANIMATIONS: true
};

// CC: Get feature flags from environment or use defaults
export const getFeatureFlags = (): FeatureFlags => {
  if (typeof window === 'undefined') {
    return defaultFlags;
  }

  return {
    FEATURE_CLOUD: process.env.VITE_FEATURE_CLOUD === 'true' || defaultFlags.FEATURE_CLOUD,
    SMART_ACCOUNTS_DECK: process.env.VITE_SMART_ACCOUNTS_DECK === 'true' || defaultFlags.SMART_ACCOUNTS_DECK,
    ENHANCED_ANIMATIONS: process.env.VITE_ENHANCED_ANIMATIONS === 'true' || defaultFlags.ENHANCED_ANIMATIONS
  };
};

// CC: Check if a specific feature is enabled
export const isFeatureEnabled = (flag: keyof FeatureFlags): boolean => {
  const flags = getFeatureFlags();
  return flags[flag];
};

// CC: Track feature usage for analytics
export const trackFeatureUsage = (feature: string, action: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'feature_usage', {
      event_category: 'feature_flags',
      event_label: feature,
      custom_parameter_1: action
    });
  }
}; 