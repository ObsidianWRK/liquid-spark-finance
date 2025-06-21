/**
 * @fileoverview Smoke Test for Viz System
 * @description Quick verification that all exports are working
 */

import { 
  DashboardGrid, 
  GridTile, 
  GraphContainer,
  VIZ_TOKENS,
  isVizEnabled,
  type DashboardGridProps,
  type VizTokens
} from './index';

// Type checking - ensures all exports exist and have correct types
const smokeTest = (): boolean => {
  try {
    // Test component exports exist
    if (!DashboardGrid || !GridTile || !GraphContainer) {
      throw new Error('Missing component exports');
    }

    // Test tokens exist
    if (!VIZ_TOKENS || !VIZ_TOKENS.radius.LG) {
      throw new Error('Missing design tokens');
    }

    // Test utility functions exist
    if (typeof isVizEnabled !== 'function') {
      throw new Error('Missing utility functions');
    }

    // Test types are accessible (TypeScript will catch if they don't exist)
    const testProps: DashboardGridProps = {
      children: null,
      density: 'comfortable',
      maxCols: 3,
    };

    const testTokens: VizTokens = VIZ_TOKENS;

    console.log('✅ Viz System Smoke Test: PASSED');
    console.log('📦 Components:', { DashboardGrid, GridTile, GraphContainer });
    console.log('🎨 Tokens:', testTokens);
    console.log('🚀 Feature enabled:', isVizEnabled());
    
    return true;
  } catch (error) {
    console.error('❌ Viz System Smoke Test: FAILED', error);
    return false;
  }
};

// Export for testing
export { smokeTest };

// Auto-run in development
if (import.meta.env.DEV) {
  smokeTest();
} 