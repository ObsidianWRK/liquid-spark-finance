/**
 * Viewport Guardian - Main Export
 * 
 * Complete viewport management system with cross-browser compatibility:
 * - Safe area insets with polyfills
 * - Visual viewport API utilities
 * - Virtual keyboard detection
 * - Orientation change handling
 * - Feature detection and fallbacks
 * - Performance-optimized React hooks
 */

// Core polyfills and utilities
export {
  // Safe area polyfills
  getSafeAreaInsets,
  applySafeAreaInsets,
  initializeViewportPolyfills,
  getViewportCapabilities,
  getOrientation,
  isFullscreen,
  getViewportDimensions,
  type SafeAreaInsets,
  type ViewportCapabilities,
  type Orientation,
  type ViewportDimensions,
} from './viewport-polyfills';

// Visual viewport utilities
export {
  addViewportChangeListener,
  removeViewportChangeListener,
  getVisualViewportState,
  isVirtualKeyboardOpen,
  getVirtualKeyboardHeight,
  getViewportAwarePadding,
  destroyViewportManager,
  type VisualViewportState,
  type ViewportChangeEvent,
  type ViewportChangeListener,
} from './visual-viewport-utils';

// Orientation utilities
export {
  addOrientationChangeListener,
  removeOrientationChangeListener,
  getCurrentOrientation,
  isPortrait,
  isLandscape,
  isOrientationLocked,
  lockOrientation,
  unlockOrientation,
  getOrientationMediaQuery,
  destroyOrientationManager,
  type OrientationType,
  type OrientationAngle,
  type OrientationState,
  type OrientationChangeEvent,
  type OrientationChangeListener,
} from './orientation-utils';

// Feature detection
export {
  runFeatureDetection,
  getBrowserInfo,
  getFeatureSupport,
  hasModernViewportSupport,
  getViewportFallbacks,
  generateResponsiveCSS,
  clearFeatureCache,
  type FeatureTestResults,
  type BrowserInfo,
} from './viewport-feature-detection';

/**
 * Initialize the entire Viewport Guardian system
 * Call this once at application startup
 */
export const initializeViewportGuardian = (): void => {
  if (typeof window === 'undefined') return;

  // Initialize polyfills
  initializeViewportPolyfills();
  
  // Run feature detection
  runFeatureDetection();
  
  console.log('🛡️ Viewport Guardian initialized with cross-browser safe area support');
};

/**
 * Get comprehensive viewport information for debugging
 */
export const getViewportDebugInfo = () => {
  if (typeof window === 'undefined') {
    return {
      environment: 'SSR',
      message: 'Running in server-side rendering environment',
    };
  }

  const capabilities = getViewportCapabilities();
  const safeArea = getSafeAreaInsets();
  const visualViewport = getVisualViewportState();
  const orientation = getCurrentOrientation();
  const features = getFeatureSupport();
  const browser = getBrowserInfo();

  return {
    timestamp: new Date().toISOString(),
    
    // Browser and platform
    browser: {
      name: browser.name,
      version: browser.version,
      engine: browser.engine,
      platform: browser.platform,
      supportsModernCSS: browser.supportsModernCSS,
    },
    
    // Device classification
    device: {
      type: browser.isMobile ? 'mobile' : browser.isTablet ? 'tablet' : 'desktop',
      isMobile: browser.isMobile,
      isTablet: browser.isTablet,
      isDesktop: browser.isDesktop,
    },
    
    // Viewport dimensions
    viewport: {
      window: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      visual: {
        width: visualViewport.width,
        height: visualViewport.height,
        scale: visualViewport.scale,
        offsetTop: visualViewport.offsetTop,
        offsetLeft: visualViewport.offsetLeft,
      },
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        availWidth: window.screen.availWidth,
        availHeight: window.screen.availHeight,
      },
    },
    
    // Safe areas
    safeArea,
    
    // Orientation
    orientation,
    
    // Virtual keyboard
    virtualKeyboard: {
      isOpen: visualViewport.isVirtualKeyboardOpen,
      height: visualViewport.keyboardHeight,
    },
    
    // Capabilities
    capabilities,
    
    // Feature support
    features: {
      cssEnv: features.cssEnvSupport,
      visualViewportAPI: features.visualViewportAPI,
      screenOrientationAPI: features.screenOrientationAPI,
      customProperties: features.cssCustomProperties,
      backdropFilter: features.backdropFilterSupport,
      webkitBackdropFilter: features.webkitBackdropFilter,
      modernViewportUnits: features.cssViewportUnits.dvh,
      touchSupport: features.touchSupport,
    },
    
    // Recommendations
    recommendations: {
      usePolyfills: !capabilities.hasSafeAreaSupport,
      useModernCSS: browser.supportsModernCSS,
      useBackdropFilter: features.backdropFilterSupport || features.webkitBackdropFilter,
      optimizeForTouch: features.touchSupport,
    },
  };
};

/**
 * Viewport Guardian configuration options
 */
export interface ViewportGuardianConfig {
  // Enable debug logging
  debug?: boolean;
  
  // Auto-initialize on import
  autoInit?: boolean;
  
  // Custom safe area fallbacks
  safeAreaFallbacks?: Partial<SafeAreaInsets>;
  
  // Virtual keyboard detection sensitivity
  keyboardThreshold?: number;
  
  // Orientation change debounce delay
  orientationDebounce?: number;
}

let guardianConfig: ViewportGuardianConfig = {
  debug: false,
  autoInit: true,
  keyboardThreshold: 150,
  orientationDebounce: 100,
};

/**
 * Configure Viewport Guardian
 */
export const configureViewportGuardian = (config: ViewportGuardianConfig): void => {
  guardianConfig = { ...guardianConfig, ...config };
  
  if (config.debug) {
    console.log('🛡️ Viewport Guardian Debug Info:', getViewportDebugInfo());
  }
};

/**
 * Get current configuration
 */
export const getViewportGuardianConfig = (): ViewportGuardianConfig => {
  return { ...guardianConfig };
};

// Auto-initialize if enabled
if (typeof window !== 'undefined' && guardianConfig.autoInit) {
  initializeViewportGuardian();
}