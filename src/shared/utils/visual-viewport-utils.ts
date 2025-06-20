/**
 * Visual Viewport Utilities
 * 
 * Provides advanced viewport management including:
 * - Visual Viewport API integration
 * - Virtual keyboard detection and handling
 * - Resilient viewport dimension tracking
 * - Performance-optimized viewport change detection
 */

import { getViewportCapabilities } from './viewport-polyfills';

// Visual viewport state
export interface VisualViewportState {
  width: number;
  height: number;
  offsetTop: number;
  offsetLeft: number;
  scale: number;
  isVirtualKeyboardOpen: boolean;
  keyboardHeight: number;
}

// Viewport change event data
export interface ViewportChangeEvent {
  state: VisualViewportState;
  previousState: VisualViewportState | null;
  type: 'resize' | 'scroll' | 'keyboard';
}

// Event listener type
export type ViewportChangeListener = (event: ViewportChangeEvent) => void;

// Virtual keyboard detection thresholds
const KEYBOARD_DETECTION_THRESHOLD = 150; // px
const KEYBOARD_ANIMATION_DURATION = 300; // ms

class VisualViewportManager {
  private listeners: Set<ViewportChangeListener> = new Set();
  private currentState: VisualViewportState;
  private previousState: VisualViewportState | null = null;
  private rafId: number | null = null;
  private isInitialized = false;
  private keyboardDetectionTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.currentState = this.getInitialState();
    
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  private getInitialState(): VisualViewportState {
    if (typeof window === 'undefined') {
      return {
        width: 0,
        height: 0,
        offsetTop: 0,
        offsetLeft: 0,
        scale: 1,
        isVirtualKeyboardOpen: false,
        keyboardHeight: 0,
      };
    }

    const capabilities = getViewportCapabilities();
    let width = window.innerWidth;
    let height = window.innerHeight;
    let offsetTop = 0;
    let offsetLeft = 0;
    let scale = 1;

    // Use Visual Viewport API if available
    if (capabilities.hasVisualViewport && window.visualViewport) {
      const vv = window.visualViewport;
      width = vv.width;
      height = vv.height;
      offsetTop = vv.offsetTop;
      offsetLeft = vv.offsetLeft;
      scale = vv.scale;
    }

    return {
      width,
      height,
      offsetTop,
      offsetLeft,
      scale,
      isVirtualKeyboardOpen: false,
      keyboardHeight: 0,
    };
  }

  private initialize(): void {
    if (this.isInitialized) return;

    const capabilities = getViewportCapabilities();

    // Use Visual Viewport API if available
    if (capabilities.hasVisualViewport && window.visualViewport) {
      window.visualViewport.addEventListener('resize', this.handleViewportChange);
      window.visualViewport.addEventListener('scroll', this.handleViewportScroll);
    }

    // Fallback to window events
    window.addEventListener('resize', this.handleWindowResize);
    window.addEventListener('orientationchange', this.handleOrientationChange);

    this.isInitialized = true;
  }

  private handleViewportChange = (): void => {
    this.scheduleUpdate('resize');
  };

  private handleViewportScroll = (): void => {
    this.scheduleUpdate('scroll');
  };

  private handleWindowResize = (): void => {
    this.scheduleUpdate('resize');
  };

  private handleOrientationChange = (): void => {
    // Delay orientation change handling to allow for proper dimension updates
    setTimeout(() => {
      this.scheduleUpdate('resize');
    }, 100);
  };

  private scheduleUpdate(type: 'resize' | 'scroll' | 'keyboard'): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }

    this.rafId = requestAnimationFrame(() => {
      this.updateState(type);
      this.rafId = null;
    });
  }

  private updateState(type: 'resize' | 'scroll' | 'keyboard'): void {
    this.previousState = { ...this.currentState };
    const newState = this.getCurrentState();
    
    // Detect virtual keyboard
    this.detectVirtualKeyboard(newState, this.previousState);

    this.currentState = newState;

    // Notify listeners
    const event: ViewportChangeEvent = {
      state: this.currentState,
      previousState: this.previousState,
      type,
    };

    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.warn('Viewport change listener error:', error);
      }
    });
  }

  private getCurrentState(): VisualViewportState {
    const capabilities = getViewportCapabilities();
    let width = window.innerWidth;
    let height = window.innerHeight;
    let offsetTop = 0;
    let offsetLeft = 0;
    let scale = 1;

    // Use Visual Viewport API if available
    if (capabilities.hasVisualViewport && window.visualViewport) {
      const vv = window.visualViewport;
      width = vv.width;
      height = vv.height;
      offsetTop = vv.offsetTop;
      offsetLeft = vv.offsetLeft;
      scale = vv.scale;
    }

    return {
      width,
      height,
      offsetTop,
      offsetLeft,
      scale,
      isVirtualKeyboardOpen: this.currentState.isVirtualKeyboardOpen,
      keyboardHeight: this.currentState.keyboardHeight,
    };
  }

  private detectVirtualKeyboard(newState: VisualViewportState, previousState: VisualViewportState | null): void {
    if (!previousState) return;

    const heightDifference = previousState.height - newState.height;
    const capabilities = getViewportCapabilities();

    // Only detect keyboard on mobile devices
    if (!capabilities.isMobile) {
      newState.isVirtualKeyboardOpen = false;
      newState.keyboardHeight = 0;
      return;
    }

    // Clear existing timeout
    if (this.keyboardDetectionTimeout) {
      clearTimeout(this.keyboardDetectionTimeout);
      this.keyboardDetectionTimeout = null;
    }

    // Detect keyboard opening
    if (heightDifference > KEYBOARD_DETECTION_THRESHOLD) {
      newState.isVirtualKeyboardOpen = true;
      newState.keyboardHeight = heightDifference;
      
      // Schedule keyboard event
      this.scheduleKeyboardEvent();
    }
    // Detect keyboard closing
    else if (previousState.isVirtualKeyboardOpen && Math.abs(heightDifference) < KEYBOARD_DETECTION_THRESHOLD) {
      // Use timeout to prevent false positives during animations
      this.keyboardDetectionTimeout = setTimeout(() => {
        if (this.currentState.height >= previousState.height - 50) { // Small tolerance
          this.currentState.isVirtualKeyboardOpen = false;
          this.currentState.keyboardHeight = 0;
          this.scheduleKeyboardEvent();
        }
      }, KEYBOARD_ANIMATION_DURATION);
    }
  }

  private scheduleKeyboardEvent(): void {
    // Debounce keyboard events
    setTimeout(() => {
      this.scheduleUpdate('keyboard');
    }, 50);
  }

  public addListener(listener: ViewportChangeListener): () => void {
    this.listeners.add(listener);
    
    // Immediately call with current state
    listener({
      state: this.currentState,
      previousState: null,
      type: 'resize',
    });

    // Return cleanup function
    return () => {
      this.listeners.delete(listener);
    };
  }

  public removeListener(listener: ViewportChangeListener): void {
    this.listeners.delete(listener);
  }

  public getCurrentState(): VisualViewportState {
    return { ...this.currentState };
  }

  public destroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    if (this.keyboardDetectionTimeout) {
      clearTimeout(this.keyboardDetectionTimeout);
      this.keyboardDetectionTimeout = null;
    }

    const capabilities = getViewportCapabilities();

    if (capabilities.hasVisualViewport && window.visualViewport) {
      window.visualViewport.removeEventListener('resize', this.handleViewportChange);
      window.visualViewport.removeEventListener('scroll', this.handleViewportScroll);
    }

    window.removeEventListener('resize', this.handleWindowResize);
    window.removeEventListener('orientationchange', this.handleOrientationChange);

    this.listeners.clear();
    this.isInitialized = false;
  }
}

// Singleton instance
let visualViewportManager: VisualViewportManager | null = null;

/**
 * Get the visual viewport manager instance
 */
export const getVisualViewportManager = (): VisualViewportManager => {
  if (!visualViewportManager) {
    visualViewportManager = new VisualViewportManager();
  }
  return visualViewportManager;
};

/**
 * Add a viewport change listener
 */
export const addViewportChangeListener = (listener: ViewportChangeListener): (() => void) => {
  return getVisualViewportManager().addListener(listener);
};

/**
 * Remove a viewport change listener
 */
export const removeViewportChangeListener = (listener: ViewportChangeListener): void => {
  getVisualViewportManager().removeListener(listener);
};

/**
 * Get current visual viewport state
 */
export const getVisualViewportState = (): VisualViewportState => {
  return getVisualViewportManager().getCurrentState();
};

/**
 * Check if virtual keyboard is currently open
 */
export const isVirtualKeyboardOpen = (): boolean => {
  return getVisualViewportState().isVirtualKeyboardOpen;
};

/**
 * Get virtual keyboard height
 */
export const getVirtualKeyboardHeight = (): number => {
  return getVisualViewportState().keyboardHeight;
};

/**
 * Utility to apply viewport-aware padding
 */
export const getViewportAwarePadding = () => {
  const state = getVisualViewportState();
  const capabilities = getViewportCapabilities();

  return {
    paddingBottom: state.isVirtualKeyboardOpen && capabilities.isMobile 
      ? `${state.keyboardHeight}px` 
      : '0px',
    paddingTop: `${state.offsetTop}px`,
    paddingLeft: `${state.offsetLeft}px`,
  };
};

/**
 * Clean up viewport manager (for testing or app shutdown)
 */
export const destroyViewportManager = (): void => {
  if (visualViewportManager) {
    visualViewportManager.destroy();
    visualViewportManager = null;
  }
};