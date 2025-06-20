/**
 * Scroll Controller for Navigation Bar Visibility
 * 
 * Features:
 * - Throttled requestAnimationFrame-based scroll listener
 * - Hide navigation on 48px downward scroll with velocity > 0
 * - Reveal navigation on upward scroll
 * - Virtual keyboard awareness using visualViewport API
 * - Safe area padding synchronization
 * - Performance optimized to prevent scroll jank
 * - Respects reduced motion preferences
 * - Cross-browser compatible
 * - Clean API for React integration
 */

// Import menu bar height constants
const MENU_BAR_HEIGHT = {
  portrait: 44,
  landscape: 48,
} as const;

// Types
export interface ScrollState {
  scrollY: number;
  previousScrollY: number;
  velocity: number;
  direction: 'up' | 'down' | 'none';
  isScrolling: boolean;
  timestamp: number;
}

export interface NavigationVisibilityState {
  isVisible: boolean;
  shouldAnimate: boolean;
  transform: string;
  safeAreaPadding: {
    top: number;
    bottom: number;
  };
}

export interface ScrollControllerOptions {
  hideThreshold: number; // Default: 48px
  showThreshold: number; // Default: 4px
  velocityThreshold: number; // Default: 0.1px/ms
  debounceMs: number; // Default: 150ms
  respectReducedMotion: boolean; // Default: true
  enableVirtualKeyboardDetection: boolean; // Default: true
  enableSafeAreaDetection: boolean; // Default: true
}

export interface ScrollControllerCallbacks {
  onVisibilityChange?: (isVisible: boolean) => void;
  onScrollStateChange?: (state: ScrollState) => void;
  onVirtualKeyboardToggle?: (isVisible: boolean, height: number) => void;
}

// Default configuration
const DEFAULT_OPTIONS: ScrollControllerOptions = {
  hideThreshold: 48,
  showThreshold: 4,
  velocityThreshold: 0.1,
  debounceMs: 150,
  respectReducedMotion: true,
  enableVirtualKeyboardDetection: true,
  enableSafeAreaDetection: true,
};

export class ScrollController {
  private options: ScrollControllerOptions;
  private callbacks: ScrollControllerCallbacks;
  
  // State management
  private scrollState: ScrollState = {
    scrollY: 0,
    previousScrollY: 0,
    velocity: 0,
    direction: 'none',
    isScrolling: false,
    timestamp: performance.now(),
  };
  
  private visibilityState: NavigationVisibilityState = {
    isVisible: true,
    shouldAnimate: true,
    transform: 'translateY(0px)',
    safeAreaPadding: {
      top: 0,
      bottom: 0,
    },
  };

  // Performance optimization
  private rafId: number | null = null;
  private scrollTimeout: number | null = null;
  private isThrottled = false;
  private lastUpdate = 0;
  private readonly THROTTLE_MS = 16; // ~60fps

  // Browser capability detection
  private supportsVisualViewport: boolean;
  private supportsPassiveEvents: boolean;
  private prefersReducedMotion: boolean;
  
  // Virtual keyboard detection
  private initialViewportHeight: number;
  private currentViewportHeight: number;
  private virtualKeyboardHeight = 0;

  constructor(
    options: Partial<ScrollControllerOptions> = {},
    callbacks: ScrollControllerCallbacks = {}
  ) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.callbacks = callbacks;
    
    // Detect browser capabilities
    this.supportsVisualViewport = 'visualViewport' in window;
    this.supportsPassiveEvents = this.detectPassiveEventSupport();
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Initialize viewport tracking
    this.initialViewportHeight = window.innerHeight;
    this.currentViewportHeight = window.innerHeight;
    
    // Update animation preference based on reduced motion
    if (this.options.respectReducedMotion && this.prefersReducedMotion) {
      this.visibilityState.shouldAnimate = false;
    }
    
    this.init();
  }

  private detectPassiveEventSupport(): boolean {
    let supportsPassive = false;
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get: () => {
          supportsPassive = true;
          return true;
        },
      });
      window.addEventListener('testPassive', () => {}, opts);
      window.removeEventListener('testPassive', () => {}, opts);
    } catch {}
    return supportsPassive;
  }

  private init(): void {
    this.updateSafeAreaPadding();
    this.bindEvents();
    this.startVisualViewportTracking();
  }

  private bindEvents(): void {
    const eventOptions = this.supportsPassiveEvents 
      ? { passive: true } 
      : false;
    
    // Main scroll listener
    window.addEventListener('scroll', this.handleScroll, eventOptions);
    
    // Orientation change and resize
    window.addEventListener('orientationchange', this.handleOrientationChange);
    window.addEventListener('resize', this.handleResize);
    
    // Reduced motion preference changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', this.handleMotionPreferenceChange);
  }

  private unbindEvents(): void {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('orientationchange', this.handleOrientationChange);
    window.removeEventListener('resize', this.handleResize);
    
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.removeEventListener('change', this.handleMotionPreferenceChange);
  }

  private handleScroll = (): void => {
    if (this.isThrottled) return;
    
    this.isThrottled = true;
    
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    
    this.rafId = requestAnimationFrame(() => {
      this.updateScrollState();
      this.updateNavigationVisibility();
      this.isThrottled = false;
    });
  };

  private updateScrollState(): void {
    const now = performance.now();
    const currentScrollY = Math.max(0, window.pageYOffset || document.documentElement.scrollTop);
    
    // Calculate velocity (pixels per millisecond)
    const timeDelta = now - this.scrollState.timestamp;
    const scrollDelta = currentScrollY - this.scrollState.scrollY;
    const velocity = timeDelta > 0 ? scrollDelta / timeDelta : 0;
    
    // Determine scroll direction
    let direction: 'up' | 'down' | 'none' = 'none';
    if (scrollDelta > 0) direction = 'down';
    else if (scrollDelta < 0) direction = 'up';
    
    // Update scroll state
    this.scrollState = {
      scrollY: currentScrollY,
      previousScrollY: this.scrollState.scrollY,
      velocity: Math.abs(velocity),
      direction,
      isScrolling: true,
      timestamp: now,
    };
    
    // Reset scrolling state after debounce period
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    
    this.scrollTimeout = window.setTimeout(() => {
      this.scrollState.isScrolling = false;
      this.callbacks.onScrollStateChange?.(this.scrollState);
    }, this.options.debounceMs);
    
    // Notify callback
    this.callbacks.onScrollStateChange?.(this.scrollState);
  }

  private updateNavigationVisibility(): void {
    const { scrollY, velocity, direction } = this.scrollState;
    const { hideThreshold, showThreshold, velocityThreshold } = this.options;
    
    let shouldShow = this.visibilityState.isVisible;
    
    // Logic for hiding navigation
    if (direction === 'down' && 
        scrollY > hideThreshold && 
        velocity > velocityThreshold) {
      shouldShow = false;
    }
    
    // Logic for showing navigation
    if (direction === 'up' || scrollY <= showThreshold) {
      shouldShow = true;
    }
    
    // Special case: always show at top of page
    if (scrollY === 0) {
      shouldShow = true;
    }
    
    // Update visibility state if changed
    if (shouldShow !== this.visibilityState.isVisible) {
      this.setNavigationVisibility(shouldShow);
    }
  }

  private setNavigationVisibility(isVisible: boolean): void {
    const orientation = window.matchMedia('(orientation: landscape)').matches 
      ? 'landscape' 
      : 'portrait';
    
    const menuBarHeight = MENU_BAR_HEIGHT[orientation];
    const totalOffset = menuBarHeight + this.visibilityState.safeAreaPadding.top;
    
    this.visibilityState = {
      ...this.visibilityState,
      isVisible,
      transform: isVisible 
        ? 'translateY(0px)' 
        : `translateY(-${totalOffset}px)`,
    };
    
    // Notify callback
    this.callbacks.onVisibilityChange?.(isVisible);
  }

  private startVisualViewportTracking(): void {
    if (!this.options.enableVirtualKeyboardDetection || !this.supportsVisualViewport) {
      return;
    }
    
    const visualViewport = window.visualViewport!;
    
    const handleViewportChange = () => {
      const newHeight = visualViewport.height;
      const heightDiff = this.initialViewportHeight - newHeight;
      
      // Detect virtual keyboard (threshold: 150px height reduction)
      if (heightDiff > 150) {
        this.virtualKeyboardHeight = heightDiff;
        this.callbacks.onVirtualKeyboardToggle?.(true, heightDiff);
        
        // Show navigation when virtual keyboard appears
        this.setNavigationVisibility(true);
      } else {
        this.virtualKeyboardHeight = 0;
        this.callbacks.onVirtualKeyboardToggle?.(false, 0);
      }
      
      this.currentViewportHeight = newHeight;
    };
    
    visualViewport.addEventListener('resize', handleViewportChange);
    visualViewport.addEventListener('scroll', handleViewportChange);
  }

  private updateSafeAreaPadding(): void {
    if (!this.options.enableSafeAreaDetection) return;
    
    const computedStyle = getComputedStyle(document.documentElement);
    const safeAreaTop = computedStyle.getPropertyValue('env(safe-area-inset-top)');
    const safeAreaBottom = computedStyle.getPropertyValue('env(safe-area-inset-bottom)');
    
    this.visibilityState.safeAreaPadding = {
      top: parseInt(safeAreaTop) || 0,
      bottom: parseInt(safeAreaBottom) || 0,
    };
  }

  private handleOrientationChange = (): void => {
    // Wait for orientation change to complete
    setTimeout(() => {
      this.updateSafeAreaPadding();
      this.initialViewportHeight = window.innerHeight;
      this.currentViewportHeight = window.innerHeight;
      
      // Recalculate visibility state for new orientation
      this.setNavigationVisibility(this.visibilityState.isVisible);
    }, 100);
  };

  private handleResize = (): void => {
    // Throttle resize events
    if (performance.now() - this.lastUpdate < this.THROTTLE_MS) return;
    this.lastUpdate = performance.now();
    
    this.updateSafeAreaPadding();
    
    // Update viewport height if not caused by virtual keyboard
    if (this.virtualKeyboardHeight === 0) {
      this.initialViewportHeight = window.innerHeight;
      this.currentViewportHeight = window.innerHeight;
    }
  };

  private handleMotionPreferenceChange = (e: MediaQueryListEvent): void => {
    this.prefersReducedMotion = e.matches;
    
    if (this.options.respectReducedMotion) {
      this.visibilityState.shouldAnimate = !this.prefersReducedMotion;
    }
  };

  // Public API
  public getScrollState(): ScrollState {
    return { ...this.scrollState };
  }

  public getVisibilityState(): NavigationVisibilityState {
    return { ...this.visibilityState };
  }

  public setVisibility(isVisible: boolean, force = false): void {
    if (force || isVisible !== this.visibilityState.isVisible) {
      this.setNavigationVisibility(isVisible);
    }
  }

  public updateOptions(newOptions: Partial<ScrollControllerOptions>): void {
    this.options = { ...this.options, ...newOptions };
    
    // Update animation state if reduced motion setting changed
    if (newOptions.respectReducedMotion !== undefined) {
      this.visibilityState.shouldAnimate = 
        !(newOptions.respectReducedMotion && this.prefersReducedMotion);
    }
  }

  public destroy(): void {
    // Cancel any pending animations
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    
    // Clear timeouts
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = null;
    }
    
    // Remove event listeners
    this.unbindEvents();
    
    // Clean up visual viewport tracking
    if (this.supportsVisualViewport) {
      const visualViewport = window.visualViewport!;
      visualViewport.removeEventListener('resize', () => {});
      visualViewport.removeEventListener('scroll', () => {});
    }
  }
}

// Hook will be implemented in a separate file to maintain separation of concerns
// This keeps the core controller logic separate from React-specific code

// Utility functions for common use cases
export const createScrollController = (
  options?: Partial<ScrollControllerOptions>,
  callbacks?: ScrollControllerCallbacks
): ScrollController => {
  return new ScrollController(options, callbacks);
};

export const getNavigationTransform = (
  isVisible: boolean,
  orientation: 'portrait' | 'landscape' = 'portrait',
  safeAreaTop = 0
): string => {
  if (isVisible) return 'translateY(0px)';
  
  const menuBarHeight = MENU_BAR_HEIGHT[orientation];
  const totalOffset = menuBarHeight + safeAreaTop;
  
  return `translateY(-${totalOffset}px)`;
};

export const detectVirtualKeyboard = (): {
  isVisible: boolean;
  height: number;
} => {
  if (!('visualViewport' in window)) {
    return { isVisible: false, height: 0 };
  }
  
  const viewport = window.visualViewport!;
  const heightDiff = window.innerHeight - viewport.height;
  
  return {
    isVisible: heightDiff > 150, // 150px threshold for virtual keyboard
    height: Math.max(0, heightDiff),
  };
};

// Export everything for clean API
export default ScrollController;