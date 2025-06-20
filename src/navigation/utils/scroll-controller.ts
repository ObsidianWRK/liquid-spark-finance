/**
 * iOS 26-Style Navigation Scroll Controller
 * Handles hide/reveal behavior with performance optimization
 */

import React from 'react';

export interface ScrollControllerConfig {
  hideThreshold: number; // Minimum scroll distance to trigger hide
  hideVelocity: number; // Minimum velocity (px/ms) for hide
  showVelocity: number; // Minimum velocity (px/ms) for show
  debounce: number; // Debounce time in ms
  alwaysShowTop: number; // Distance from top where nav is always visible
  onVisibilityChange?: (isVisible: boolean) => void;
}

export interface ScrollControllerState {
  isVisible: boolean;
  scrollY: number;
  velocity: number;
  isScrolling: boolean;
  virtualKeyboardHeight: number;
}

export class ScrollController {
  private config: ScrollControllerConfig;
  private state: ScrollControllerState;
  private lastScrollY: number = 0;
  private lastScrollTime: number = 0;
  private scrollTimeout: NodeJS.Timeout | null = null;
  private rafId: number | null = null;
  private visualViewport: VisualViewport | null = null;
  private listeners: Set<(state: ScrollControllerState) => void> = new Set();

  constructor(config: Partial<ScrollControllerConfig> = {}) {
    this.config = {
      hideThreshold: 48,
      hideVelocity: 0.5,
      showVelocity: -0.3,
      debounce: 16, // ~60fps
      alwaysShowTop: 100,
      ...config,
    };

    this.state = {
      isVisible: true,
      scrollY: 0,
      velocity: 0,
      isScrolling: false,
      virtualKeyboardHeight: 0,
    };

    // Initialize visual viewport if available
    if (typeof window !== 'undefined' && 'visualViewport' in window) {
      this.visualViewport = window.visualViewport;
    }
  }

  /**
   * Start monitoring scroll events
   */
  public start(): void {
    if (typeof window === 'undefined') return;

    // Scroll event listener with passive flag for performance
    window.addEventListener('scroll', this.handleScroll, { passive: true });

    // Visual viewport listeners for virtual keyboard detection
    if (this.visualViewport) {
      this.visualViewport.addEventListener('resize', this.handleViewportResize);
      this.visualViewport.addEventListener('scroll', this.handleViewportScroll);
    }

    // Orientation change listener
    window.addEventListener('orientationchange', this.handleOrientationChange);

    // Initial state
    this.updateScrollState();
  }

  /**
   * Stop monitoring scroll events
   */
  public stop(): void {
    if (typeof window === 'undefined') return;

    window.removeEventListener('scroll', this.handleScroll);

    if (this.visualViewport) {
      this.visualViewport.removeEventListener(
        'resize',
        this.handleViewportResize
      );
      this.visualViewport.removeEventListener(
        'scroll',
        this.handleViewportScroll
      );
    }

    window.removeEventListener(
      'orientationchange',
      this.handleOrientationChange
    );

    // Cancel any pending updates
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = null;
    }

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Subscribe to state changes
   */
  public subscribe(
    listener: (state: ScrollControllerState) => void
  ): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Get current state
   */
  public getState(): ScrollControllerState {
    return { ...this.state };
  }

  /**
   * Force show navigation
   */
  public show(): void {
    this.updateVisibility(true);
  }

  /**
   * Force hide navigation
   */
  public hide(): void {
    this.updateVisibility(false);
  }

  /**
   * Handle scroll events with debouncing
   */
  private handleScroll = (): void => {
    // Cancel existing RAF
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }

    // Use requestAnimationFrame for smooth updates
    this.rafId = requestAnimationFrame(() => {
      this.updateScrollState();
    });

    // Update scrolling state
    if (!this.state.isScrolling) {
      this.state.isScrolling = true;
      this.notifyListeners();
    }

    // Debounce scroll end detection
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    this.scrollTimeout = setTimeout(() => {
      this.state.isScrolling = false;
      this.notifyListeners();
    }, this.config.debounce * 10); // Longer timeout for scroll end
  };

  /**
   * Update scroll state and determine visibility
   */
  private updateScrollState(): void {
    const currentScrollY = window.scrollY;
    const currentTime = performance.now();
    const timeDelta = currentTime - this.lastScrollTime;

    // Calculate velocity only if enough time has passed
    let velocity = 0;
    if (timeDelta > 0) {
      velocity = (currentScrollY - this.lastScrollY) / timeDelta;
    }

    // Update state
    this.state.scrollY = currentScrollY;
    this.state.velocity = velocity;

    // Determine visibility
    const scrollDelta = currentScrollY - this.lastScrollY;
    const shouldUpdate = Math.abs(scrollDelta) >= this.config.hideThreshold;

    if (shouldUpdate || currentScrollY < this.config.alwaysShowTop) {
      let newVisibility = this.state.isVisible;

      // Always show near top
      if (currentScrollY < this.config.alwaysShowTop) {
        newVisibility = true;
      }
      // Hide on fast downward scroll
      else if (velocity > this.config.hideVelocity && scrollDelta > 0) {
        newVisibility = false;
      }
      // Show on upward scroll
      else if (velocity < this.config.showVelocity && scrollDelta < 0) {
        newVisibility = true;
      }

      if (newVisibility !== this.state.isVisible) {
        this.updateVisibility(newVisibility);
      }
    }

    // Update tracking variables
    this.lastScrollY = currentScrollY;
    this.lastScrollTime = currentTime;
  }

  /**
   * Handle visual viewport resize (virtual keyboard)
   */
  private handleViewportResize = (): void => {
    if (!this.visualViewport) return;

    const viewportHeight = this.visualViewport.height;
    const windowHeight = window.innerHeight;
    const keyboardHeight = windowHeight - viewportHeight;

    // Update virtual keyboard height
    this.state.virtualKeyboardHeight = Math.max(0, keyboardHeight);

    // Show navigation when keyboard appears
    if (keyboardHeight > 50) {
      this.updateVisibility(true);
    }

    this.notifyListeners();
  };

  /**
   * Handle visual viewport scroll
   */
  private handleViewportScroll = (): void => {
    // Visual viewport scroll can happen independently of document scroll
    // This is important for position: fixed elements
    this.updateScrollState();
  };

  /**
   * Handle orientation changes
   */
  private handleOrientationChange = (): void => {
    // Reset state on orientation change
    this.lastScrollY = window.scrollY;
    this.lastScrollTime = performance.now();

    // Always show navigation after orientation change
    this.updateVisibility(true);
  };

  /**
   * Update visibility state
   */
  private updateVisibility(isVisible: boolean): void {
    if (this.state.isVisible !== isVisible) {
      this.state.isVisible = isVisible;

      // Call config callback
      if (this.config.onVisibilityChange) {
        this.config.onVisibilityChange(isVisible);
      }

      this.notifyListeners();
    }
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }
}

// Export singleton instance for non-React usage
export const scrollController = new ScrollController();

// Factory function for creating new controller instances
export function createScrollController(
  config?: Partial<ScrollControllerConfig>
): ScrollController {
  return new ScrollController(config);
}

// Utility function to get navigation transform based on visibility state
export function getNavigationTransform(
  isVisible: boolean,
  orientation: 'portrait' | 'landscape' = 'portrait',
  safeAreaTop: number = 0
): string {
  if (isVisible) {
    return `translateY(${safeAreaTop}px)`;
  }

  // Hide by moving up beyond the safe area
  const hideDistance = orientation === 'landscape' ? -80 : -100; // Adjust for nav height
  return `translateY(${hideDistance - safeAreaTop}px)`;
}

// Utility function to detect virtual keyboard
export function detectVirtualKeyboard(): {
  isVisible: boolean;
  height: number;
} {
  if (typeof window === 'undefined') {
    return { isVisible: false, height: 0 };
  }

  // Use Visual Viewport API if available
  if ('visualViewport' in window && window.visualViewport) {
    const viewport = window.visualViewport;
    const keyboardHeight = window.innerHeight - viewport.height;
    return {
      isVisible: keyboardHeight > 50, // Threshold for keyboard detection
      height: Math.max(0, keyboardHeight),
    };
  }

  // Fallback: Use window height comparison
  const originalHeight = window.screen.height;
  const currentHeight = window.innerHeight;
  const heightDiff = originalHeight - currentHeight;

  return {
    isVisible: heightDiff > 150, // Conservative threshold
    height: Math.max(0, heightDiff),
  };
}

// Legacy alias for backward compatibility
export { ScrollController as iOS26ScrollController };
