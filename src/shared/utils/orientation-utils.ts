/**
 * Orientation Change Utilities
 * 
 * Provides resilient orientation change detection and handling:
 * - Multiple orientation detection methods with fallbacks
 * - Debounced orientation change events
 * - Screen lock detection
 * - Cross-browser compatibility
 * - Performance-optimized event handling
 */

import { getViewportCapabilities } from './viewport-polyfills';

// Orientation types
export type OrientationType = 'portrait' | 'landscape';
export type OrientationAngle = 0 | 90 | 180 | 270;

// Orientation state
export interface OrientationState {
  type: OrientationType;
  angle: OrientationAngle;
  isLocked: boolean;
  isPrimary: boolean; // true if this is the device's natural orientation
}

// Orientation change event
export interface OrientationChangeEvent {
  current: OrientationState;
  previous: OrientationState | null;
  timestamp: number;
}

// Event listener type
export type OrientationChangeListener = (event: OrientationChangeEvent) => void;

// Configuration
const ORIENTATION_CHANGE_DEBOUNCE_MS = 100;
const DIMENSION_CHECK_DELAY_MS = 150; // Delay to allow dimensions to update
const MAX_ORIENTATION_CHECKS = 10; // Maximum retries for orientation detection

class OrientationManager {
  private listeners: Set<OrientationChangeListener> = new Set();
  private currentState: OrientationState;
  private previousState: OrientationState | null = null;
  private debounceTimeout: NodeJS.Timeout | null = null;
  private checkTimeout: NodeJS.Timeout | null = null;
  private isInitialized = false;
  private orientationCheckCount = 0;

  constructor() {
    this.currentState = this.getInitialOrientationState();
    
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  private getInitialOrientationState(): OrientationState {
    if (typeof window === 'undefined') {
      return {
        type: 'portrait',
        angle: 0,
        isLocked: false,
        isPrimary: true,
      };
    }

    return this.detectOrientationState();
  }

  private detectOrientationState(): OrientationState {
    const capabilities = getViewportCapabilities();
    let angle: OrientationAngle = 0;
    let type: OrientationType = 'portrait';
    let isLocked = false;

    // Method 1: Modern Screen Orientation API (most reliable)
    if (capabilities.hasScreenOrientation && window.screen.orientation) {
      const orientation = window.screen.orientation;
      angle = this.normalizeAngle(orientation.angle);
      type = orientation.type.includes('portrait') ? 'portrait' : 'landscape';
      
      // Detect orientation lock (experimental)
      try {
        isLocked = orientation.type.includes('primary') || orientation.type.includes('secondary');
      } catch {
        isLocked = false;
      }
    }
    
    // Method 2: Legacy window.orientation (iOS Safari, older browsers)
    else if ('orientation' in window && typeof window.orientation === 'number') {
      angle = this.normalizeAngle(window.orientation);
      type = Math.abs(angle) === 90 ? 'landscape' : 'portrait';
    }
    
    // Method 3: Fallback to window dimensions
    else {
      const width = window.innerWidth;
      const height = window.innerHeight;
      type = width > height ? 'landscape' : 'portrait';
      
      // Estimate angle based on dimensions (rough heuristic)
      if (type === 'landscape') {
        angle = width > screen.width ? 90 : 270; // Guess based on typical rotation
      }
    }

    // Determine if this is the primary orientation
    const isPrimary = this.isPrimaryOrientation(type, angle);

    return {
      type,
      angle,
      isLocked,
      isPrimary,
    };
  }

  private normalizeAngle(angle: number): OrientationAngle {
    // Normalize angle to 0, 90, 180, 270
    const normalized = ((angle % 360) + 360) % 360;
    
    if (normalized <= 45 || normalized > 315) return 0;
    if (normalized > 45 && normalized <= 135) return 90;
    if (normalized > 135 && normalized <= 225) return 180;
    return 270;
  }

  private isPrimaryOrientation(type: OrientationType, angle: OrientationAngle): boolean {
    // Most mobile devices have portrait as primary
    // Most tablets have landscape as primary
    const capabilities = getViewportCapabilities();
    
    if (capabilities.isIOS || capabilities.isAndroid) {
      // For phones, portrait is usually primary
      // For tablets, it varies but we'll assume landscape for wide screens
      const isTabletSize = window.screen.width >= 768 || window.screen.height >= 768;
      
      if (isTabletSize) {
        return type === 'landscape' && (angle === 0 || angle === 180);
      } else {
        return type === 'portrait' && (angle === 0 || angle === 180);
      }
    }
    
    // Desktop: assume landscape primary
    return type === 'landscape' && angle === 0;
  }

  private initialize(): void {
    if (this.isInitialized) return;

    const capabilities = getViewportCapabilities();

    // Modern Screen Orientation API
    if (capabilities.hasScreenOrientation && window.screen.orientation) {
      window.screen.orientation.addEventListener('change', this.handleOrientationChange);
    }

    // Legacy orientationchange event
    window.addEventListener('orientationchange', this.handleOrientationChange);

    // Resize event as fallback
    window.addEventListener('resize', this.handleResize);

    // Page visibility change (helps with lock detection)
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    this.isInitialized = true;
  }

  private handleOrientationChange = (): void => {
    this.debounceOrientationUpdate();
  };

  private handleResize = (): void => {
    // Only use resize as orientation trigger if other methods aren't available
    const capabilities = getViewportCapabilities();
    
    if (!capabilities.hasScreenOrientation && !('orientation' in window)) {
      this.debounceOrientationUpdate();
    }
  };

  private handleVisibilityChange = (): void => {
    // Re-check orientation when page becomes visible
    // This helps catch changes that happened while page was hidden
    if (!document.hidden) {
      setTimeout(() => {
        this.debounceOrientationUpdate();
      }, 100);
    }
  };

  private debounceOrientationUpdate(): void {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    this.debounceTimeout = setTimeout(() => {
      this.checkOrientationWithRetry();
    }, ORIENTATION_CHANGE_DEBOUNCE_MS);
  }

  private checkOrientationWithRetry(): void {
    this.orientationCheckCount = 0;
    this.performOrientationCheck();
  }

  private performOrientationCheck(): void {
    const newState = this.detectOrientationState();
    
    // Check if orientation actually changed
    if (this.hasOrientationChanged(newState, this.currentState)) {
      this.updateOrientation(newState);
    } else if (this.orientationCheckCount < MAX_ORIENTATION_CHECKS) {
      // Sometimes orientation change is delayed, retry
      this.orientationCheckCount++;
      
      if (this.checkTimeout) {
        clearTimeout(this.checkTimeout);
      }
      
      this.checkTimeout = setTimeout(() => {
        this.performOrientationCheck();
      }, DIMENSION_CHECK_DELAY_MS);
    }
  }

  private hasOrientationChanged(newState: OrientationState, currentState: OrientationState): boolean {
    return (
      newState.type !== currentState.type ||
      newState.angle !== currentState.angle ||
      newState.isLocked !== currentState.isLocked
    );
  }

  private updateOrientation(newState: OrientationState): void {
    this.previousState = { ...this.currentState };
    this.currentState = newState;

    const event: OrientationChangeEvent = {
      current: this.currentState,
      previous: this.previousState,
      timestamp: Date.now(),
    };

    // Notify all listeners
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.warn('Orientation change listener error:', error);
      }
    });
  }

  public addListener(listener: OrientationChangeListener): () => void {
    this.listeners.add(listener);
    
    // Immediately call with current state
    listener({
      current: this.currentState,
      previous: null,
      timestamp: Date.now(),
    });

    // Return cleanup function
    return () => {
      this.listeners.delete(listener);
    };
  }

  public removeListener(listener: OrientationChangeListener): void {
    this.listeners.delete(listener);
  }

  public getCurrentState(): OrientationState {
    return { ...this.currentState };
  }

  public async lockOrientation(orientation: OrientationType): Promise<boolean> {
    const capabilities = getViewportCapabilities();
    
    if (!capabilities.hasScreenOrientation || !window.screen.orientation) {
      return false;
    }

    try {
      const lockType = orientation === 'portrait' 
        ? 'portrait-primary' 
        : 'landscape-primary';
        
      await window.screen.orientation.lock(lockType as OrientationLockType);
      
      // Update state to reflect lock
      this.currentState.isLocked = true;
      return true;
    } catch (error) {
      console.warn('Failed to lock orientation:', error);
      return false;
    }
  }

  public async unlockOrientation(): Promise<boolean> {
    const capabilities = getViewportCapabilities();
    
    if (!capabilities.hasScreenOrientation || !window.screen.orientation) {
      return false;
    }

    try {
      window.screen.orientation.unlock();
      
      // Update state to reflect unlock
      this.currentState.isLocked = false;
      return true;
    } catch (error) {
      console.warn('Failed to unlock orientation:', error);
      return false;
    }
  }

  public destroy(): void {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = null;
    }

    if (this.checkTimeout) {
      clearTimeout(this.checkTimeout);
      this.checkTimeout = null;
    }

    const capabilities = getViewportCapabilities();

    if (capabilities.hasScreenOrientation && window.screen.orientation) {
      window.screen.orientation.removeEventListener('change', this.handleOrientationChange);
    }

    window.removeEventListener('orientationchange', this.handleOrientationChange);
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);

    this.listeners.clear();
    this.isInitialized = false;
  }
}

// Singleton instance
let orientationManager: OrientationManager | null = null;

/**
 * Get the orientation manager instance
 */
export const getOrientationManager = (): OrientationManager => {
  if (!orientationManager) {
    orientationManager = new OrientationManager();
  }
  return orientationManager;
};

/**
 * Add an orientation change listener
 */
export const addOrientationChangeListener = (listener: OrientationChangeListener): (() => void) => {
  return getOrientationManager().addListener(listener);
};

/**
 * Remove an orientation change listener
 */
export const removeOrientationChangeListener = (listener: OrientationChangeListener): void => {
  getOrientationManager().removeListener(listener);
};

/**
 * Get current orientation state
 */
export const getCurrentOrientation = (): OrientationState => {
  return getOrientationManager().getCurrentState();
};

/**
 * Check if device is in portrait mode
 */
export const isPortrait = (): boolean => {
  return getCurrentOrientation().type === 'portrait';
};

/**
 * Check if device is in landscape mode
 */
export const isLandscape = (): boolean => {
  return getCurrentOrientation().type === 'landscape';
};

/**
 * Check if orientation is locked
 */
export const isOrientationLocked = (): boolean => {
  return getCurrentOrientation().isLocked;
};

/**
 * Lock orientation to portrait or landscape
 */
export const lockOrientation = async (orientation: OrientationType): Promise<boolean> => {
  return getOrientationManager().lockOrientation(orientation);
};

/**
 * Unlock orientation
 */
export const unlockOrientation = async (): Promise<boolean> => {
  return getOrientationManager().unlockOrientation();
};

/**
 * Get CSS media query for current orientation
 */
export const getOrientationMediaQuery = (): string => {
  const state = getCurrentOrientation();
  return `(orientation: ${state.type})`;
};

/**
 * Clean up orientation manager (for testing or app shutdown)
 */
export const destroyOrientationManager = (): void => {
  if (orientationManager) {
    orientationManager.destroy();
    orientationManager = null;
  }
};