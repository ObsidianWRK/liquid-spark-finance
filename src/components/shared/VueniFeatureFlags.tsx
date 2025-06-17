import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TransactionVariant } from './UnifiedTransactionList';
import { InsightsVariant } from './VueniUnifiedInsightsPage';

// Feature flag configuration interface
export interface FeatureFlags {
  // Component variants
  transactionListVariant: TransactionVariant;
  insightsPageVariant: InsightsVariant;
  
  // Feature toggles
  enableAdvancedScoring: boolean;
  enableRealTimeUpdates: boolean;
  enableAnimations: boolean;
  enableMobileOptimizations: boolean;
  enableExperimentalFeatures: boolean;
  enablePerformanceMode: boolean;
  enableDebugMode: boolean;
  
  // UI preferences
  compactMode: boolean;
  showScoreCircles: boolean;
  showCategoryIcons: boolean;
  enableDarkMode: boolean;
  enableGlassEffects: boolean;
  
  // Data and privacy
  enableDataExport: boolean;
  enableOfflineMode: boolean;
  enableAnalytics: boolean;
  
  // Performance settings
  maxTransactionsPerPage: number;
  enableVirtualScrolling: boolean;
  enableLazyLoading: boolean;
  refreshInterval: number;
}

// Default feature flag values
const defaultFeatureFlags: FeatureFlags = {
  // Component variants
  transactionListVariant: 'default',
  insightsPageVariant: 'standard',
  
  // Feature toggles
  enableAdvancedScoring: true,
  enableRealTimeUpdates: false,
  enableAnimations: true,
  enableMobileOptimizations: true,
  enableExperimentalFeatures: false,
  enablePerformanceMode: false,
  enableDebugMode: false,
  
  // UI preferences
  compactMode: false,
  showScoreCircles: true,
  showCategoryIcons: true,
  enableDarkMode: true,
  enableGlassEffects: true,
  
  // Data and privacy
  enableDataExport: false,
  enableOfflineMode: false,
  enableAnalytics: false,
  
  // Performance settings
  maxTransactionsPerPage: 50,
  enableVirtualScrolling: false,
  enableLazyLoading: true,
  refreshInterval: 30000,
};

// Environment-specific presets
export const featureFlagPresets = {
  development: {
    ...defaultFeatureFlags,
    enableDebugMode: true,
    enableExperimentalFeatures: true,
    enableAnalytics: false,
  },
  staging: {
    ...defaultFeatureFlags,
    enableExperimentalFeatures: true,
    enableAnalytics: true,
    enableDataExport: true,
  },
  production: {
    ...defaultFeatureFlags,
    enableDebugMode: false,
    enableExperimentalFeatures: false,
    enableAnalytics: true,
    enablePerformanceMode: true,
  },
  mobile: {
    ...defaultFeatureFlags,
    transactionListVariant: 'mobile',
    insightsPageVariant: 'mobile',
    compactMode: true,
    enableMobileOptimizations: true,
    enableVirtualScrolling: true,
    enableGlassEffects: false,
    maxTransactionsPerPage: 25,
  },
  enterprise: {
    ...defaultFeatureFlags,
    transactionListVariant: 'enterprise',
    insightsPageVariant: 'comprehensive',
    enableAdvancedScoring: true,
    enableDataExport: true,
    enableAnalytics: true,
    enableVirtualScrolling: true,
    maxTransactionsPerPage: 100,
  },
  minimal: {
    ...defaultFeatureFlags,
    transactionListVariant: 'clean',
    insightsPageVariant: 'optimized',
    enableAnimations: false,
    showScoreCircles: false,
    enableGlassEffects: false,
    enablePerformanceMode: true,
    maxTransactionsPerPage: 25,
  },
} as const;

// Feature flag context
interface FeatureFlagContextType {
  flags: FeatureFlags;
  updateFlag: <K extends keyof FeatureFlags>(key: K, value: FeatureFlags[K]) => void;
  updateFlags: (newFlags: Partial<FeatureFlags>) => void;
  resetFlags: () => void;
  loadPreset: (preset: keyof typeof featureFlagPresets) => void;
  isFeatureEnabled: (feature: keyof FeatureFlags) => boolean;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

// Feature flag provider component
interface FeatureFlagProviderProps {
  children: ReactNode;
  initialFlags?: Partial<FeatureFlags>;
  preset?: keyof typeof featureFlagPresets;
  persistToStorage?: boolean;
  storageKey?: string;
}

export const FeatureFlagProvider: React.FC<FeatureFlagProviderProps> = ({
  children,
  initialFlags = {},
  preset,
  persistToStorage = true,
  storageKey = 'vueni-feature-flags',
}) => {
  // Initialize flags with preset, initial flags, and stored flags
  const [flags, setFlags] = useState<FeatureFlags>(() => {
    let baseFlags = defaultFeatureFlags;
    
    // Apply preset if provided
    if (preset && featureFlagPresets[preset]) {
      baseFlags = { ...baseFlags, ...featureFlagPresets[preset] };
    }
    
    // Apply initial flags
    baseFlags = { ...baseFlags, ...initialFlags };
    
    // Load from storage if enabled
    if (persistToStorage && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const storedFlags = JSON.parse(stored);
          baseFlags = { ...baseFlags, ...storedFlags };
        }
      } catch (error) {
        console.warn('Failed to load feature flags from storage:', error);
      }
    }
    
    return baseFlags;
  });

  // Persist flags to storage when they change
  useEffect(() => {
    if (persistToStorage && typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(flags));
      } catch (error) {
        console.warn('Failed to save feature flags to storage:', error);
      }
    }
  }, [flags, persistToStorage, storageKey]);

  const updateFlag = <K extends keyof FeatureFlags>(key: K, value: FeatureFlags[K]) => {
    setFlags(prev => ({ ...prev, [key]: value }));
  };

  const updateFlags = (newFlags: Partial<FeatureFlags>) => {
    setFlags(prev => ({ ...prev, ...newFlags }));
  };

  const resetFlags = () => {
    setFlags(defaultFeatureFlags);
  };

  const loadPreset = (presetName: keyof typeof featureFlagPresets) => {
    const presetFlags = featureFlagPresets[presetName];
    setFlags(prev => ({ ...prev, ...presetFlags }));
  };

  const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
    const value = flags[feature];
    return typeof value === 'boolean' ? value : Boolean(value);
  };

  const contextValue: FeatureFlagContextType = {
    flags,
    updateFlag,
    updateFlags,
    resetFlags,
    loadPreset,
    isFeatureEnabled,
  };

  return (
    <FeatureFlagContext.Provider value={contextValue}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

// Hook to use feature flags
export const useFeatureFlags = (): FeatureFlagContextType => {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context;
};

// Individual feature flag hooks for convenience
export const useTransactionVariant = () => {
  const { flags } = useFeatureFlags();
  return flags.transactionListVariant;
};

export const useInsightsVariant = () => {
  const { flags } = useFeatureFlags();
  return flags.insightsPageVariant;
};

export const useCompactMode = () => {
  const { flags } = useFeatureFlags();
  return flags.compactMode;
};

export const useAnimationsEnabled = () => {
  const { flags } = useFeatureFlags();
  return flags.enableAnimations;
};

export const usePerformanceMode = () => {
  const { flags } = useFeatureFlags();
  return flags.enablePerformanceMode;
};

// Feature flag debugging component (development only)
export const FeatureFlagDebugPanel: React.FC = () => {
  const { flags, updateFlag, loadPreset, resetFlags } = useFeatureFlags();

  if (!flags.enableDebugMode) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-4 max-w-sm max-h-96 overflow-y-auto z-50">
      <h3 className="text-white font-bold mb-3">Feature Flags Debug</h3>
      
      <div className="space-y-2 mb-4">
        <button
          onClick={() => loadPreset('development')}
          className="w-full px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs hover:bg-blue-500/30"
        >
          Load Dev Preset
        </button>
        <button
          onClick={() => loadPreset('mobile')}
          className="w-full px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs hover:bg-green-500/30"
        >
          Load Mobile Preset
        </button>
        <button
          onClick={() => loadPreset('enterprise')}
          className="w-full px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs hover:bg-purple-500/30"
        >
          Load Enterprise Preset
        </button>
        <button
          onClick={resetFlags}
          className="w-full px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30"
        >
          Reset to Default
        </button>
      </div>

      <div className="space-y-2 text-xs">
        {Object.entries(flags).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-white/70 truncate">{key}</span>
            {typeof value === 'boolean' ? (
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => updateFlag(key as keyof FeatureFlags, e.target.checked as any)}
                className="ml-2"
              />
            ) : (
              <span className="text-white/50 text-xs ml-2 truncate">
                {String(value)}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// HOC for feature-gated components
export function withFeatureFlag<P extends object>(
  Component: React.ComponentType<P>,
  featureKey: keyof FeatureFlags,
  fallback?: React.ComponentType<P> | null
) {
  return function FeatureGatedComponent(props: P) {
    const { isFeatureEnabled } = useFeatureFlags();
    
    if (!isFeatureEnabled(featureKey)) {
      return fallback ? React.createElement(fallback, props) : null;
    }
    
    return React.createElement(Component, props);
  };
}

// Utility function to check feature flags outside of React components
export const checkFeatureFlag = (flags: FeatureFlags, feature: keyof FeatureFlags): boolean => {
  const value = flags[feature];
  return typeof value === 'boolean' ? value : Boolean(value);
};

// Export types for external use
export type { FeatureFlags, FeatureFlagContextType };