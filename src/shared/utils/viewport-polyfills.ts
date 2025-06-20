/**
 * Viewport Guardian - Cross-browser safe area polyfills and utilities
 * 
 * Provides comprehensive viewport support including:
 * - Safe area insets polyfill for non-iOS browsers
 * - Visual viewport API utilities
 * - Virtual keyboard detection
 * - Orientation change resilience
 * - Feature detection with fallbacks
 */

// Safe area inset values
export interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// Browser capability detection
export interface ViewportCapabilities {
  hasSafeAreaSupport: boolean;
  hasVisualViewport: boolean;
  hasScreenOrientation: boolean;
  hasMatchMedia: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
}

// Detect browser and platform capabilities
export const detectViewportCapabilities = (): ViewportCapabilities => {
  const isSSR = typeof window === 'undefined';
  
  if (isSSR) {
    return {
      hasSafeAreaSupport: false,
      hasVisualViewport: false,
      hasScreenOrientation: false,
      hasMatchMedia: false,
      isIOS: false,
      isAndroid: false,
      isMobile: false,
    };
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isAndroid = /android/.test(userAgent);
  const isMobile = /mobile|tablet|android|iphone|ipad|ipod/.test(userAgent) || 
                   window.innerWidth <= 768;

  // Test for CSS env() support
  const testEl = document.createElement('div');
  testEl.style.padding = 'env(safe-area-inset-top, 0px)';
  const hasSafeAreaSupport = testEl.style.padding !== '';

  return {
    hasSafeAreaSupport,
    hasVisualViewport: 'visualViewport' in window,
    hasScreenOrientation: 'screen' in window && 'orientation' in window.screen,
    hasMatchMedia: 'matchMedia' in window,
    isIOS,
    isAndroid,
    isMobile,
  };
};

// Cache capabilities to avoid repeated detection
let cachedCapabilities: ViewportCapabilities | null = null;

export const getViewportCapabilities = (): ViewportCapabilities => {
  if (!cachedCapabilities) {
    cachedCapabilities = detectViewportCapabilities();
  }
  return cachedCapabilities;
};

/**
 * Polyfill for safe area insets on non-iOS browsers
 * Provides reasonable fallbacks based on device type and browser chrome
 */
export const getSafeAreaInsets = (): SafeAreaInsets => {
  const capabilities = getViewportCapabilities();
  
  // If native support exists, try to get real values
  if (capabilities.hasSafeAreaSupport && typeof window !== 'undefined') {
    try {
      const computedStyle = getComputedStyle(document.documentElement);
      const getEnvValue = (property: string): number => {
        const value = computedStyle.getPropertyValue(`env(${property})`);
        return value ? parseInt(value.replace('px', ''), 10) || 0 : 0;
      };

      return {
        top: getEnvValue('safe-area-inset-top'),
        right: getEnvValue('safe-area-inset-right'),
        bottom: getEnvValue('safe-area-inset-bottom'),
        left: getEnvValue('safe-area-inset-left'),
      };
    } catch {
      // Fall through to polyfill
    }
  }

  // Polyfill values based on platform and browser
  const polyfillInsets: SafeAreaInsets = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };

  if (typeof window === 'undefined') {
    return polyfillInsets;
  }

  // iOS Safari - estimated values for different device types
  if (capabilities.isIOS) {
    const isLandscape = window.innerWidth > window.innerHeight;
    const screenHeight = window.screen.height;
    const screenWidth = window.screen.width;
    
    // iPhone with notch detection (rough heuristic)
    const hasNotch = screenHeight >= 812 || screenWidth >= 812;
    
    if (hasNotch) {
      polyfillInsets.top = isLandscape ? 0 : 44;
      polyfillInsets.bottom = isLandscape ? 21 : 34;
      polyfillInsets.left = isLandscape ? 44 : 0;
      polyfillInsets.right = isLandscape ? 44 : 0;
    } else {
      // Older iPhones without notch
      polyfillInsets.top = 20; // Status bar
      polyfillInsets.bottom = 0;
    }
  }

  // Android Chrome - estimated safe areas
  else if (capabilities.isAndroid) {
    const isLandscape = window.innerWidth > window.innerHeight;
    
    // Android status bar and navigation
    polyfillInsets.top = 24; // Status bar height
    polyfillInsets.bottom = isLandscape ? 0 : 48; // Navigation bar (portrait only)
  }

  // Desktop browsers - minimal safe areas for browser chrome
  else if (!capabilities.isMobile) {
    // Desktop doesn't typically need safe areas, but provide minimal values
    polyfillInsets.top = 0;
    polyfillInsets.bottom = 0;
  }

  return polyfillInsets;
};

/**
 * Apply safe area insets as CSS custom properties
 * This ensures consistent access across the application
 */
export const applySafeAreaInsets = (): void => {
  if (typeof window === 'undefined') return;

  const insets = getSafeAreaInsets();
  const root = document.documentElement;

  // Set CSS custom properties
  root.style.setProperty('--safe-area-inset-top', `${insets.top}px`);
  root.style.setProperty('--safe-area-inset-right', `${insets.right}px`);
  root.style.setProperty('--safe-area-inset-bottom', `${insets.bottom}px`);
  root.style.setProperty('--safe-area-inset-left', `${insets.left}px`);

  // Also set env() fallback values for better compatibility
  root.style.setProperty('--sai-top', `env(safe-area-inset-top, ${insets.top}px)`);
  root.style.setProperty('--sai-right', `env(safe-area-inset-right, ${insets.right}px)`);
  root.style.setProperty('--sai-bottom', `env(safe-area-inset-bottom, ${insets.bottom}px)`);
  root.style.setProperty('--sai-left', `env(safe-area-inset-left, ${insets.left}px)`);
};

/**
 * Initialize viewport polyfills
 * Should be called once when the application starts
 */
export const initializeViewportPolyfills = (): void => {
  if (typeof window === 'undefined') return;

  // Apply initial safe area insets
  applySafeAreaInsets();

  // Update on orientation change
  const updateOnOrientationChange = () => {
    // Small delay to ensure dimensions are updated
    setTimeout(() => {
      // Recalculate capabilities in case they changed
      cachedCapabilities = null;
      applySafeAreaInsets();
    }, 100);
  };

  // Listen for orientation changes with multiple event types for compatibility
  window.addEventListener('orientationchange', updateOnOrientationChange);
  window.addEventListener('resize', updateOnOrientationChange);

  // Screen orientation API (modern browsers)
  if (getViewportCapabilities().hasScreenOrientation && window.screen.orientation) {
    window.screen.orientation.addEventListener('change', updateOnOrientationChange);
  }

  // Initial application
  updateOnOrientationChange();
};

/**
 * Get current orientation with fallbacks
 */
export const getOrientation = (): 'portrait' | 'landscape' => {
  if (typeof window === 'undefined') return 'portrait';

  const capabilities = getViewportCapabilities();

  // Modern Screen Orientation API
  if (capabilities.hasScreenOrientation && window.screen.orientation) {
    return window.screen.orientation.angle === 0 || window.screen.orientation.angle === 180 
      ? 'portrait' 
      : 'landscape';
  }

  // Legacy orientation property
  if ('orientation' in window) {
    return Math.abs(window.orientation) === 90 ? 'landscape' : 'portrait';
  }

  // Fallback to window dimensions
  return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
};

/**
 * Detect if device is in fullscreen mode
 */
export const isFullscreen = (): boolean => {
  if (typeof document === 'undefined') return false;

  return !!(
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).msFullscreenElement
  );
};

/**
 * Get viewport dimensions excluding browser chrome
 */
export const getViewportDimensions = () => {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }

  const capabilities = getViewportCapabilities();

  // Use Visual Viewport API if available (most accurate)
  if (capabilities.hasVisualViewport && window.visualViewport) {
    return {
      width: window.visualViewport.width,
      height: window.visualViewport.height,
    };
  }

  // Fallback to window dimensions
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

// Type exports
export type Orientation = 'portrait' | 'landscape';
export type ViewportDimensions = { width: number; height: number };