/**
 * Viewport Guardian Initialization
 *
 * Provides initialization utilities for the Viewport Guardian system:
 * - Automatic initialization on app startup
 * - CSS class application for feature detection
 * - Event listener setup for dynamic updates
 * - Integration with React app lifecycle
 */

import {
  initializeViewportGuardian,
  getViewportDebugInfo,
  getFeatureSupport,
  getBrowserInfo,
  configureViewportGuardian,
} from './viewport-guardian';
import {
  addViewportChangeListener,
  addOrientationChangeListener,
  type ViewportChangeEvent,
  type OrientationChangeEvent,
} from './viewport-guardian';

/**
 * Initialize Viewport Guardian with CSS class management
 */
export const initializeViewportGuardianWithCSS = (): void => {
  if (typeof window === 'undefined') return;

  // Initialize the core system
  initializeViewportGuardian();

  // Apply CSS classes based on capabilities
  applyCSSClasses();

  // Set up dynamic class updates
  setupDynamicClasses();

  console.log('🛡️ Viewport Guardian initialized with CSS integration');
};

/**
 * Apply CSS classes based on detected capabilities
 */
const applyCSSClasses = (): void => {
  if (typeof document === 'undefined') return;

  const features = getFeatureSupport();
  const browser = getBrowserInfo();
  const root = document.documentElement;

  // Add base class
  root.classList.add('viewport-guardian-active');

  // Safe area support
  if (features.cssEnvSupport) {
    root.classList.add('has-safe-area');
  }

  // Virtual keyboard support
  if (features.visualViewportAPI) {
    root.classList.add('has-virtual-keyboard');
  }

  // Backdrop filter support
  if (features.backdropFilterSupport || features.webkitBackdropFilter) {
    root.classList.add('supports-backdrop-filter');
  }

  // Device type classes
  if (browser.isMobile) {
    root.classList.add('mobile-device');
  } else if (browser.isTablet) {
    root.classList.add('tablet-device');
  } else if (browser.isDesktop) {
    root.classList.add('desktop-device');
  }

  // Platform classes
  root.classList.add(`platform-${browser.platform}`);
  root.classList.add(`browser-${browser.name}`);

  // Modern CSS support
  if (browser.supportsModernCSS) {
    root.classList.add('supports-modern-css');
  }
};

/**
 * Set up dynamic class updates for viewport changes
 */
const setupDynamicClasses = (): void => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // Handle viewport changes
  const handleViewportChange = (event: ViewportChangeEvent) => {
    // Update keyboard state
    root.setAttribute(
      'data-keyboard-open',
      event.state.isVirtualKeyboardOpen.toString()
    );

    // Update CSS custom properties
    root.style.setProperty('--viewport-width', `${event.state.width}px`);
    root.style.setProperty('--viewport-height', `${event.state.height}px`);
    root.style.setProperty(
      '--keyboard-height',
      `${event.state.keyboardHeight}px`
    );
    root.style.setProperty(
      '--keyboard-open',
      event.state.isVirtualKeyboardOpen ? '1' : '0'
    );
  };

  // Handle orientation changes
  const handleOrientationChange = (event: OrientationChangeEvent) => {
    // Remove old orientation classes
    root.classList.remove('orientation-portrait', 'orientation-landscape');

    // Add new orientation class
    root.classList.add(`orientation-${event.current.type}`);

    // Update data attributes
    root.setAttribute('data-orientation', event.current.type);
    root.setAttribute('data-orientation-angle', event.current.angle.toString());
    root.setAttribute(
      'data-orientation-locked',
      event.current.isLocked.toString()
    );
  };

  // Add listeners
  addViewportChangeListener(handleViewportChange);
  addOrientationChangeListener(handleOrientationChange);
};

/**
 * Initialize with development mode features
 */
export const initializeViewportGuardianDev = (): void => {
  // Configure for development
  configureViewportGuardian({
    debug: process.env.NODE_ENV === 'development',
    autoInit: true,
  });

  // Initialize with CSS
  initializeViewportGuardianWithCSS();

  // Add development helpers
  if (process.env.NODE_ENV === 'development') {
    addDevelopmentHelpers();
  }
};

/**
 * Add development helpers for debugging
 */
const addDevelopmentHelpers = (): void => {
  if (typeof window === 'undefined') return;

  // Add global debug function
  (window as any).viewportDebug = () => {
    console.log('🛡️ Viewport Guardian Debug Info:', getViewportDebugInfo());
  };

  // Add keyboard shortcuts for testing
  document.addEventListener('keydown', (event) => {
    // Ctrl/Cmd + Shift + V for viewport debug
    if (
      (event.ctrlKey || event.metaKey) &&
      event.shiftKey &&
      event.key === 'V'
    ) {
      console.log('🛡️ Viewport Guardian Debug Info:', getViewportDebugInfo());
      event.preventDefault();
    }
  });

  console.log(
    '🛡️ Development helpers added. Press Ctrl/Cmd+Shift+V for debug info or call window.viewportDebug()'
  );
};

/**
 * Initialize for production
 */
export const initializeViewportGuardianProd = (): void => {
  // Configure for production
  configureViewportGuardian({
    debug: false,
    autoInit: true,
  });

  // Initialize with CSS
  initializeViewportGuardianWithCSS();
};

/**
 * React app integration helper
 */
export const initializeForReactApp = (): void => {
  if (process.env.NODE_ENV === 'development') {
    initializeViewportGuardianDev();
  } else {
    initializeViewportGuardianProd();
  }
};

/**
 * Manual initialization with custom config
 */
export const initializeViewportGuardianCustom = (config: {
  debug?: boolean;
  applyCSSClasses?: boolean;
  setupDynamicUpdates?: boolean;
}): void => {
  const {
    debug = false,
    applyCSSClasses: shouldApplyCSSClasses = true,
    setupDynamicUpdates = true,
  } = config;

  // Configure
  configureViewportGuardian({ debug });

  // Initialize core
  initializeViewportGuardian();

  // Apply CSS classes if requested
  if (shouldApplyCSSClasses) {
    applyCSSClasses();
  }

  // Set up dynamic updates if requested
  if (setupDynamicUpdates) {
    setupDynamicClasses();
  }

  console.log('🛡️ Viewport Guardian initialized with custom configuration');
};

/**
 * Get initialization status
 */
export const getInitializationStatus = () => {
  if (typeof document === 'undefined') {
    return { initialized: false, reason: 'SSR environment' };
  }

  const root = document.documentElement;
  const isInitialized = root.classList.contains('viewport-guardian-active');

  return {
    initialized: isInitialized,
    features: isInitialized ? getFeatureSupport() : null,
    browser: isInitialized ? getBrowserInfo() : null,
  };
};
