/**
 * Viewport Feature Detection and Fallbacks
 * 
 * Provides comprehensive feature detection for viewport-related APIs:
 * - CSS env() support detection
 * - Visual Viewport API availability
 * - Screen Orientation API support
 * - CSS viewport units support (vh, vw, dvh, lvh, svh)
 * - CSS custom properties support
 * - Performance-optimized feature testing
 */

// Feature test results cache
interface FeatureTestResults {
  cssEnvSupport: boolean;
  visualViewportAPI: boolean;
  screenOrientationAPI: boolean;
  cssViewportUnits: {
    vh: boolean;
    vw: boolean;
    vmin: boolean;
    vmax: boolean;
    dvh: boolean; // Dynamic viewport height
    lvh: boolean; // Large viewport height  
    svh: boolean; // Small viewport height
    dvw: boolean; // Dynamic viewport width
    lvw: boolean; // Large viewport width
    svw: boolean; // Small viewport width
  };
  cssCustomProperties: boolean;
  matchMediaSupport: boolean;
  resizeObserverSupport: boolean;
  intersectionObserverSupport: boolean;
  backdropFilterSupport: boolean;
  touchSupport: boolean;
  pointerEvents: boolean;
  webkitBackdropFilter: boolean;
}

// Browser information
interface BrowserInfo {
  name: string;
  version: string;
  engine: string;
  platform: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  supportsModernCSS: boolean;
}

let cachedFeatureResults: FeatureTestResults | null = null;
let cachedBrowserInfo: BrowserInfo | null = null;

/**
 * Test CSS env() function support
 */
const testCSSEnvSupport = (): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    const testEl = document.createElement('div');
    testEl.style.paddingTop = 'env(safe-area-inset-top, 0px)';
    
    // If the browser supports env(), the computed style will be different
    document.body.appendChild(testEl);
    const computedStyle = getComputedStyle(testEl);
    const paddingTop = computedStyle.paddingTop;
    document.body.removeChild(testEl);
    
    // If env() is supported, paddingTop should be set (even if to '0px')
    return paddingTop !== '' && paddingTop !== 'auto';
  } catch {
    return false;
  }
};

/**
 * Test CSS viewport units support
 */
const testViewportUnitsSupport = () => {
  if (typeof window === 'undefined') {
    return {
      vh: false, vw: false, vmin: false, vmax: false,
      dvh: false, lvh: false, svh: false,
      dvw: false, lvw: false, svw: false,
    };
  }

  const testUnit = (unit: string): boolean => {
    try {
      const testEl = document.createElement('div');
      testEl.style.height = `100${unit}`;
      
      document.body.appendChild(testEl);
      const computedStyle = getComputedStyle(testEl);
      const height = computedStyle.height;
      document.body.removeChild(testEl);
      
      return height !== '' && height !== 'auto' && !height.includes(unit);
    } catch {
      return false;
    }
  };

  return {
    vh: testUnit('vh'),
    vw: testUnit('vw'),
    vmin: testUnit('vmin'),
    vmax: testUnit('vmax'),
    dvh: testUnit('dvh'),
    lvh: testUnit('lvh'),
    svh: testUnit('svh'),
    dvw: testUnit('dvw'),
    lvw: testUnit('lvw'),
    svw: testUnit('svw'),
  };
};

/**
 * Test CSS custom properties support
 */
const testCSSCustomPropertiesSupport = (): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    const testEl = document.createElement('div');
    testEl.style.setProperty('--test-prop', 'test-value');
    testEl.style.color = 'var(--test-prop)';
    
    document.body.appendChild(testEl);
    const computedStyle = getComputedStyle(testEl);
    const color = computedStyle.color;
    document.body.removeChild(testEl);
    
    return color === 'test-value';
  } catch {
    return false;
  }
};

/**
 * Test backdrop-filter support
 */
const testBackdropFilterSupport = (): { backdrop: boolean; webkit: boolean } => {
  if (typeof window === 'undefined') return { backdrop: false, webkit: false };

  try {
    const testEl = document.createElement('div');
    
    // Test standard backdrop-filter
    testEl.style.backdropFilter = 'blur(10px)';
    const hasBackdrop = testEl.style.backdropFilter !== '';
    
    // Test -webkit-backdrop-filter
    (testEl.style as any).webkitBackdropFilter = 'blur(10px)';
    const hasWebkit = (testEl.style as any).webkitBackdropFilter !== '';
    
    return { backdrop: hasBackdrop, webkit: hasWebkit };
  } catch {
    return { backdrop: false, webkit: false };
  }
};

/**
 * Detect browser information
 */
const detectBrowserInfo = (): BrowserInfo => {
  if (typeof window === 'undefined') {
    return {
      name: 'unknown',
      version: '0',
      engine: 'unknown',
      platform: 'unknown',
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      supportsModernCSS: false,
    };
  }

  const userAgent = navigator.userAgent.toLowerCase();
  
  // Detect browser
  let name = 'unknown';
  let version = '0';
  let engine = 'unknown';

  if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
    name = 'chrome';
    const match = userAgent.match(/chrome\/(\d+)/);
    version = match ? match[1] : '0';
    engine = 'blink';
  } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    name = 'safari';
    const match = userAgent.match(/version\/(\d+)/);
    version = match ? match[1] : '0';
    engine = 'webkit';
  } else if (userAgent.includes('firefox')) {
    name = 'firefox';
    const match = userAgent.match(/firefox\/(\d+)/);
    version = match ? match[1] : '0';
    engine = 'gecko';
  } else if (userAgent.includes('edg')) {
    name = 'edge';
    const match = userAgent.match(/edg\/(\d+)/);
    version = match ? match[1] : '0';
    engine = 'blink';
  }

  // Detect platform
  let platform = 'unknown';
  if (userAgent.includes('windows')) platform = 'windows';
  else if (userAgent.includes('mac')) platform = 'macos';
  else if (userAgent.includes('linux')) platform = 'linux';
  else if (userAgent.includes('android')) platform = 'android';
  else if (userAgent.includes('ios') || userAgent.includes('iphone') || userAgent.includes('ipad')) platform = 'ios';

  // Detect device type
  const isMobile = /mobile|android|iphone|ipod/.test(userAgent) && window.innerWidth <= 768;
  const isTablet = /tablet|ipad/.test(userAgent) || (!isMobile && window.innerWidth <= 1024);
  const isDesktop = !isMobile && !isTablet;

  // Determine modern CSS support
  const versionNum = parseInt(version, 10);
  let supportsModernCSS = false;

  if (name === 'chrome' && versionNum >= 85) supportsModernCSS = true;
  else if (name === 'safari' && versionNum >= 14) supportsModernCSS = true;
  else if (name === 'firefox' && versionNum >= 82) supportsModernCSS = true;
  else if (name === 'edge' && versionNum >= 85) supportsModernCSS = true;

  return {
    name,
    version,
    engine,
    platform,
    isMobile,
    isTablet,
    isDesktop,
    supportsModernCSS,
  };
};

/**
 * Run comprehensive feature detection
 */
export const runFeatureDetection = (): FeatureTestResults => {
  if (cachedFeatureResults) {
    return cachedFeatureResults;
  }

  if (typeof window === 'undefined') {
    cachedFeatureResults = {
      cssEnvSupport: false,
      visualViewportAPI: false,
      screenOrientationAPI: false,
      cssViewportUnits: {
        vh: false, vw: false, vmin: false, vmax: false,
        dvh: false, lvh: false, svh: false,
        dvw: false, lvw: false, svw: false,
      },
      cssCustomProperties: false,
      matchMediaSupport: false,
      resizeObserverSupport: false,
      intersectionObserverSupport: false,
      backdropFilterSupport: false,
      touchSupport: false,
      pointerEvents: false,
      webkitBackdropFilter: false,
    };
    return cachedFeatureResults;
  }

  const backdropFilter = testBackdropFilterSupport();

  cachedFeatureResults = {
    cssEnvSupport: testCSSEnvSupport(),
    visualViewportAPI: 'visualViewport' in window,
    screenOrientationAPI: 'screen' in window && 'orientation' in window.screen,
    cssViewportUnits: testViewportUnitsSupport(),
    cssCustomProperties: testCSSCustomPropertiesSupport(),
    matchMediaSupport: 'matchMedia' in window,
    resizeObserverSupport: 'ResizeObserver' in window,
    intersectionObserverSupport: 'IntersectionObserver' in window,
    backdropFilterSupport: backdropFilter.backdrop,
    webkitBackdropFilter: backdropFilter.webkit,
    touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    pointerEvents: 'PointerEvent' in window,
  };

  return cachedFeatureResults;
};

/**
 * Get browser information
 */
export const getBrowserInfo = (): BrowserInfo => {
  if (cachedBrowserInfo) {
    return cachedBrowserInfo;
  }

  cachedBrowserInfo = detectBrowserInfo();
  return cachedBrowserInfo;
};

/**
 * Get feature test results
 */
export const getFeatureSupport = (): FeatureTestResults => {
  return runFeatureDetection();
};

/**
 * Check if modern viewport features are supported
 */
export const hasModernViewportSupport = (): boolean => {
  const features = getFeatureSupport();
  const browser = getBrowserInfo();

  return (
    features.visualViewportAPI &&
    features.cssEnvSupport &&
    features.cssCustomProperties &&
    browser.supportsModernCSS
  );
};

/**
 * Get recommended CSS fallbacks for the current browser
 */
export const getViewportFallbacks = () => {
  const features = getFeatureSupport();
  const browser = getBrowserInfo();

  return {
    // Safe area fallbacks
    safeAreaTop: features.cssEnvSupport 
      ? 'env(safe-area-inset-top, 0px)' 
      : browser.platform === 'ios' ? '44px' : '0px',
    
    safeAreaBottom: features.cssEnvSupport 
      ? 'env(safe-area-inset-bottom, 0px)' 
      : browser.platform === 'ios' ? '34px' : '0px',
    
    safeAreaLeft: features.cssEnvSupport 
      ? 'env(safe-area-inset-left, 0px)' 
      : '0px',
    
    safeAreaRight: features.cssEnvSupport 
      ? 'env(safe-area-inset-right, 0px)' 
      : '0px',

    // Viewport height fallbacks
    viewportHeight: features.cssViewportUnits.dvh 
      ? '100dvh' 
      : features.cssViewportUnits.vh 
        ? '100vh' 
        : '100%',

    // Backdrop filter fallbacks
    backdropFilter: features.backdropFilterSupport 
      ? 'blur(20px)' 
      : features.webkitBackdropFilter 
        ? 'blur(20px)' 
        : 'none',

    // Custom properties fallback
    customProperty: (property: string, fallback: string) => 
      features.cssCustomProperties ? `var(${property}, ${fallback})` : fallback,
  };
};

/**
 * Generate CSS with appropriate fallbacks
 */
export const generateResponsiveCSS = () => {
  const features = getFeatureSupport();
  const fallbacks = getViewportFallbacks();

  return {
    safeAreaStyles: `
      padding-top: ${fallbacks.safeAreaTop};
      padding-bottom: ${fallbacks.safeAreaBottom};
      padding-left: ${fallbacks.safeAreaLeft};
      padding-right: ${fallbacks.safeAreaRight};
    `,

    fullHeightStyles: `
      height: 100vh; /* Fallback */
      ${features.cssViewportUnits.dvh ? 'height: 100dvh;' : ''}
    `,

    glassEffectStyles: `
      background: rgba(255, 255, 255, 0.1);
      ${features.backdropFilterSupport ? 'backdrop-filter: blur(20px);' : ''}
      ${features.webkitBackdropFilter ? '-webkit-backdrop-filter: blur(20px);' : ''}
      ${!features.backdropFilterSupport && !features.webkitBackdropFilter ? 
        'background: rgba(255, 255, 255, 0.2);' : ''}
    `,
  };
};

/**
 * Clear feature detection cache (useful for testing)
 */
export const clearFeatureCache = (): void => {
  cachedFeatureResults = null;
  cachedBrowserInfo = null;
};

/**
 * Export types
 */
export type { FeatureTestResults, BrowserInfo };