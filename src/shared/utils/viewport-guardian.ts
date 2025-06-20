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

import React from 'react';

import {
  initializeViewportPolyfills,
  getViewportCapabilities,
  getSafeAreaInsets,
  SafeAreaInsets,
} from './viewport-polyfills';
import { getVisualViewportState } from './visual-viewport-utils';
import { getCurrentOrientation } from './orientation-utils';
import {
  runFeatureDetection,
  getBrowserInfo,
  getFeatureSupport,
} from './viewport-feature-detection';

// Core polyfills and utilities
export {
  // Safe area polyfills
  getSafeAreaInsetsPolyfill,
  applySafeAreaInsets,
  initializeViewportPolyfills,
  getViewportCapabilities,
  getOrientation,
  isFullscreen,
  getViewportDimensions,
  type ViewportCapabilities,
  type Orientation,
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

  console.log(
    '🛡️ Viewport Guardian initialized with cross-browser safe area support'
  );
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
      type: browser.isMobile
        ? 'mobile'
        : browser.isTablet
          ? 'tablet'
          : 'desktop',
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
      useBackdropFilter:
        features.backdropFilterSupport || features.webkitBackdropFilter,
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
  autoInit: false, // Disabled auto-init to prevent startup crashes
  keyboardThreshold: 150,
  orientationDebounce: 100,
};

/**
 * Configure Viewport Guardian
 */
export const configureViewportGuardian = (
  config: ViewportGuardianConfig
): void => {
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

// Auto-initialize if enabled (wrapped in try-catch for safety)
if (typeof window !== 'undefined' && guardianConfig.autoInit) {
  try {
    initializeViewportGuardian();
  } catch (error) {
    console.warn('Viewport Guardian auto-initialization failed:', error);
  }
}

/**
 * Viewport Guardian - iOS 26 Style
 * Universal safe area and viewport management
 */

// Safe area CSS custom property names
const SAFE_AREA_PROPERTIES = {
  top: 'env(safe-area-inset-top)',
  right: 'env(safe-area-inset-right)',
  bottom: 'env(safe-area-inset-bottom)',
  left: 'env(safe-area-inset-left)',
} as const;

// Fallback values for non-iOS browsers
const SAFE_AREA_FALLBACKS = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
} as const;

export interface ViewportDimensions {
  width: number;
  height: number;
  visualWidth: number;
  visualHeight: number;
  scale: number;
  offsetTop: number;
  offsetLeft: number;
}

export interface ViewportState {
  dimensions: ViewportDimensions;
  safeAreaInsets: SafeAreaInsets;
  orientation: 'portrait' | 'landscape';
  isVirtualKeyboardOpen: boolean;
  virtualKeyboardHeight: number;
  devicePixelRatio: number;
}

/**
 * ViewportGuardian class
 * Manages viewport state and provides polyfills for cross-browser compatibility
 */
export class ViewportGuardian {
  private state: ViewportState;
  private listeners: Set<(state: ViewportState) => void> = new Set();
  private visualViewport: VisualViewport | null = null;
  private rafId: number | null = null;
  private resizeTimeout: NodeJS.Timeout | null = null;
  private initialViewportHeight: number = 0;

  constructor() {
    // Initialize visual viewport if available
    if (typeof window !== 'undefined' && 'visualViewport' in window) {
      this.visualViewport = window.visualViewport;
    }

    // Initialize state
    this.state = this.getInitialState();
    this.initialViewportHeight = window.innerHeight;
  }

  /**
   * Get initial viewport state
   */
  private getInitialState(): ViewportState {
    const dimensions = this.getViewportDimensions();
    const safeAreaInsets = this.getSafeAreaInsets();
    const orientation = this.getOrientation();

    return {
      dimensions,
      safeAreaInsets,
      orientation,
      isVirtualKeyboardOpen: false,
      virtualKeyboardHeight: 0,
      devicePixelRatio: window.devicePixelRatio || 1,
    };
  }

  /**
   * Start monitoring viewport changes
   */
  public start(): void {
    if (typeof window === 'undefined') return;

    // Window events
    window.addEventListener('resize', this.handleResize, { passive: true });
    window.addEventListener('orientationchange', this.handleOrientationChange);

    // Visual viewport events
    if (this.visualViewport) {
      this.visualViewport.addEventListener(
        'resize',
        this.handleVisualViewportChange
      );
      this.visualViewport.addEventListener(
        'scroll',
        this.handleVisualViewportChange
      );
    }

    // Check for safe area changes periodically (for dynamic islands, notches, etc.)
    this.startSafeAreaMonitoring();
  }

  /**
   * Stop monitoring viewport changes
   */
  public stop(): void {
    if (typeof window === 'undefined') return;

    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener(
      'orientationchange',
      this.handleOrientationChange
    );

    if (this.visualViewport) {
      this.visualViewport.removeEventListener(
        'resize',
        this.handleVisualViewportChange
      );
      this.visualViewport.removeEventListener(
        'scroll',
        this.handleVisualViewportChange
      );
    }

    this.stopSafeAreaMonitoring();

    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }
  }

  /**
   * Subscribe to viewport state changes
   */
  public subscribe(listener: (state: ViewportState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state); // Emit current state immediately
    return () => this.listeners.delete(listener);
  }

  /**
   * Get current viewport state
   */
  public getState(): ViewportState {
    return { ...this.state };
  }

  /**
   * Get viewport dimensions with visual viewport fallback
   */
  private getViewportDimensions(): ViewportDimensions {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (this.visualViewport) {
      return {
        width,
        height,
        visualWidth: this.visualViewport.width,
        visualHeight: this.visualViewport.height,
        scale: this.visualViewport.scale,
        offsetTop: this.visualViewport.offsetTop,
        offsetLeft: this.visualViewport.offsetLeft,
      };
    }

    // Polyfill for browsers without visualViewport
    return {
      width,
      height,
      visualWidth: width,
      visualHeight: height,
      scale: 1,
      offsetTop: 0,
      offsetLeft: 0,
    };
  }

  /**
   * Get safe area insets with fallbacks
   */
  public getSafeAreaInsets(): SafeAreaInsets {
    if (typeof window === 'undefined') {
      return { ...SAFE_AREA_FALLBACKS };
    }

    const computedStyle = getComputedStyle(document.documentElement);

    // Try to get safe area values from CSS
    const getInsetValue = (property: string, fallback: number): number => {
      const value = computedStyle.getPropertyValue(property);
      if (value && value !== '0px') {
        return parseInt(value, 10) || fallback;
      }
      return fallback;
    };

    return {
      top: getInsetValue('--safe-area-inset-top', SAFE_AREA_FALLBACKS.top),
      right: getInsetValue(
        '--safe-area-inset-right',
        SAFE_AREA_FALLBACKS.right
      ),
      bottom: getInsetValue(
        '--safe-area-inset-bottom',
        SAFE_AREA_FALLBACKS.bottom
      ),
      left: getInsetValue('--safe-area-inset-left', SAFE_AREA_FALLBACKS.left),
    };
  }

  /**
   * Get device orientation
   */
  private getOrientation(): 'portrait' | 'landscape' {
    if (typeof window === 'undefined') return 'portrait';

    return getCurrentOrientation();
  }

  /**
   * Detect virtual keyboard presence
   */
  private detectVirtualKeyboard(): { isOpen: boolean; height: number } {
    if (!this.visualViewport) {
      // Fallback detection
      const currentHeight = window.innerHeight;
      const heightDiff = this.initialViewportHeight - currentHeight;
      return {
        isOpen: heightDiff > 100, // Threshold for keyboard detection
        height: Math.max(0, heightDiff),
      };
    }

    const viewportHeight = this.visualViewport.height;
    const windowHeight = window.innerHeight;
    const keyboardHeight = windowHeight - viewportHeight;

    return {
      isOpen: keyboardHeight > 50,
      height: Math.max(0, keyboardHeight),
    };
  }

  /**
   * Handle resize events
   */
  private handleResize = (): void => {
    // Debounce resize events
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = setTimeout(() => {
      this.updateState();
    }, 100);
  };

  /**
   * Handle orientation change
   */
  private handleOrientationChange = (): void => {
    // Wait for orientation change to complete
    setTimeout(() => {
      this.initialViewportHeight = window.innerHeight;
      this.updateState();
    }, 300);
  };

  /**
   * Handle visual viewport changes
   */
  private handleVisualViewportChange = (): void => {
    this.updateState();
  };

  /**
   * Update viewport state
   */
  private updateState(): void {
    const dimensions = this.getViewportDimensions();
    const safeAreaInsets = this.getSafeAreaInsets();
    const orientation = this.getOrientation();
    const keyboard = this.detectVirtualKeyboard();

    this.state = {
      dimensions,
      safeAreaInsets,
      orientation,
      isVirtualKeyboardOpen: keyboard.isOpen,
      virtualKeyboardHeight: keyboard.height,
      devicePixelRatio: window.devicePixelRatio || 1,
    };

    this.notifyListeners();
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }

  /**
   * Start monitoring safe area changes
   */
  private startSafeAreaMonitoring(): void {
    // Use RAF for smooth updates
    const checkSafeAreas = () => {
      const currentInsets = this.getSafeAreaInsets();
      const hasChanged = Object.keys(currentInsets).some(
        (key) =>
          currentInsets[key as keyof SafeAreaInsets] !==
          this.state.safeAreaInsets[key as keyof SafeAreaInsets]
      );

      if (hasChanged) {
        this.updateState();
      }

      this.rafId = requestAnimationFrame(checkSafeAreas);
    };

    checkSafeAreas();
  }

  /**
   * Stop monitoring safe area changes
   */
  private stopSafeAreaMonitoring(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Apply safe area CSS variables polyfill
   */
  public static applySafeAreaPolyfill(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined')
      return;

    // Check if safe areas are already supported
    const testEl = document.createElement('div');
    testEl.style.paddingTop = 'env(safe-area-inset-top)';
    document.body.appendChild(testEl);
    const computedStyle = getComputedStyle(testEl);
    const isSupported = computedStyle.paddingTop !== '';
    document.body.removeChild(testEl);

    if (!isSupported) {
      // Apply CSS variables as fallback
      const root = document.documentElement;
      root.style.setProperty('--safe-area-inset-top', '0px');
      root.style.setProperty('--safe-area-inset-right', '0px');
      root.style.setProperty('--safe-area-inset-bottom', '0px');
      root.style.setProperty('--safe-area-inset-left', '0px');

      // For iOS devices in standalone mode, add some defaults
      if (window.navigator.standalone) {
        root.style.setProperty('--safe-area-inset-top', '20px');
        root.style.setProperty('--safe-area-inset-bottom', '0px');
      }
    }
  }
}

/**
 * React Hook for Viewport Guardian
 */
export function useViewportGuardian(): ViewportState {
  const [state, setState] = React.useState<ViewportState>(() => {
    const guardian = new ViewportGuardian();
    return guardian.getState();
  });

  React.useEffect(() => {
    const guardian = new ViewportGuardian();
    const unsubscribe = guardian.subscribe(setState);
    guardian.start();

    return () => {
      unsubscribe();
      guardian.stop();
    };
  }, []);

  return state;
}

// Apply polyfill on module load
if (typeof window !== 'undefined') {
  ViewportGuardian.applySafeAreaPolyfill();
}

// Export singleton for non-React usage
export const viewportGuardian = new ViewportGuardian();

// Utility functions for common use cases are available from viewport-polyfills.ts

export const isIOSDevice = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

export const isStandaloneMode = (): boolean => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone ||
    document.referrer.includes('android-app://')
  );
};
