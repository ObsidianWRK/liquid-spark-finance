/**
 * TypeScript Definitions for Scroll Controller
 * 
 * Comprehensive type definitions for all scroll controller functionality
 * including core classes, hooks, context, and utility functions.
 */

declare module '@/navigation/utils/scroll-controller' {
  // Core scroll state interface
  export interface ScrollState {
    scrollY: number;
    previousScrollY: number;
    velocity: number;
    direction: 'up' | 'down' | 'none';
    isScrolling: boolean;
    timestamp: number;
  }

  // Navigation visibility state interface
  export interface NavigationVisibilityState {
    isVisible: boolean;
    shouldAnimate: boolean;
    transform: string;
    safeAreaPadding: {
      top: number;
      bottom: number;
    };
  }

  // Configuration options for scroll controller
  export interface ScrollControllerOptions {
    hideThreshold: number;
    showThreshold: number;
    velocityThreshold: number;
    debounceMs: number;
    respectReducedMotion: boolean;
    enableVirtualKeyboardDetection: boolean;
    enableSafeAreaDetection: boolean;
  }

  // Callback functions for scroll controller events
  export interface ScrollControllerCallbacks {
    onVisibilityChange?: (isVisible: boolean) => void;
    onScrollStateChange?: (state: ScrollState) => void;
    onVirtualKeyboardToggle?: (isVisible: boolean, height: number) => void;
  }

  // Main scroll controller class
  export class ScrollController {
    constructor(
      options?: Partial<ScrollControllerOptions>,
      callbacks?: ScrollControllerCallbacks
    );
    
    getScrollState(): ScrollState;
    getVisibilityState(): NavigationVisibilityState;
    setVisibility(isVisible: boolean, force?: boolean): void;
    updateOptions(newOptions: Partial<ScrollControllerOptions>): void;
    destroy(): void;
  }

  // React hook options
  export interface UseScrollControllerOptions extends ScrollControllerOptions {
    enabled?: boolean;
  }

  // React hook return type
  export interface UseScrollControllerReturn {
    scrollState: ScrollState;
    visibilityState: NavigationVisibilityState;
    controller: ScrollController | null;
    setVisibility: (isVisible: boolean, force?: boolean) => void;
    updateOptions: (options: Partial<ScrollControllerOptions>) => void;
  }

  // Utility functions
  export function createScrollController(
    options?: Partial<ScrollControllerOptions>,
    callbacks?: ScrollControllerCallbacks
  ): ScrollController;

  export function getNavigationTransform(
    isVisible: boolean,
    orientation?: 'portrait' | 'landscape',
    safeAreaTop?: number
  ): string;

  export function detectVirtualKeyboard(): {
    isVisible: boolean;
    height: number;
  };

  export default ScrollController;
}

declare module '@/navigation/hooks/useScrollController' {
  import type {
    ScrollState,
    NavigationVisibilityState,
    ScrollControllerOptions,
    ScrollControllerCallbacks,
    UseScrollControllerOptions,
    UseScrollControllerReturn,
    ScrollController,
  } from '@/navigation/utils/scroll-controller';

  // Main hook
  export function useScrollController(
    options?: UseScrollControllerOptions,
    callbacks?: ScrollControllerCallbacks
  ): UseScrollControllerReturn;

  // Navigation visibility hook options
  export interface UseNavigationVisibilityOptions {
    hideThreshold?: number;
    showThreshold?: number;
    velocityThreshold?: number;
    enabled?: boolean;
    respectReducedMotion?: boolean;
  }

  // Navigation visibility hook return type
  export interface UseNavigationVisibilityReturn {
    isVisible: boolean;
    transform: string;
    shouldAnimate: boolean;
    isScrolling: boolean;
    scrollDirection: 'up' | 'down' | 'none';
    setVisibility: (isVisible: boolean, force?: boolean) => void;
  }

  // Navigation visibility hook
  export function useNavigationVisibility(
    options?: UseNavigationVisibilityOptions
  ): UseNavigationVisibilityReturn;

  // Virtual keyboard hook options
  export interface UseVirtualKeyboardOptions {
    enabled?: boolean;
    threshold?: number;
  }

  // Virtual keyboard hook return type
  export interface UseVirtualKeyboardReturn {
    isVisible: boolean;
    height: number;
    viewportHeight: number;
  }

  // Virtual keyboard hook
  export function useVirtualKeyboard(
    options?: UseVirtualKeyboardOptions
  ): UseVirtualKeyboardReturn;

  // Scroll performance hook options
  export interface UseScrollPerformanceOptions {
    enabled?: boolean;
    updateInterval?: number;
  }

  // Scroll performance hook return type
  export interface UseScrollPerformanceReturn {
    fps: number;
    isSmooth: boolean;
    averageVelocity: number;
    maxVelocity: number;
    scrollEvents: number;
    isOptimal: boolean;
  }

  // Scroll performance hook
  export function useScrollPerformance(
    options?: UseScrollPerformanceOptions
  ): UseScrollPerformanceReturn;

  export default useScrollController;
}

declare module '@/navigation/context/ScrollControllerContext' {
  import type { ReactNode } from 'react';
  import type {
    UseScrollControllerOptions,
    UseScrollControllerReturn,
    ScrollControllerCallbacks,
  } from '@/navigation/hooks/useScrollController';

  // Context value interface
  export interface ScrollControllerContextValue extends UseScrollControllerReturn {
    isInitialized: boolean;
  }

  // Provider props
  export interface ScrollControllerProviderProps {
    children: ReactNode;
    options?: UseScrollControllerOptions;
    callbacks?: ScrollControllerCallbacks;
    disabled?: boolean;
  }

  // Provider component
  export const ScrollControllerProvider: React.FC<ScrollControllerProviderProps>;

  // Context hook
  export function useScrollControllerContext(): ScrollControllerContextValue;

  // Navigation state interface
  export interface NavigationState {
    isVisible: boolean;
    transform: string;
    shouldAnimate: boolean;
    isScrolling: boolean;
    scrollDirection: 'up' | 'down' | 'none';
    safeAreaTop: number;
    safeAreaBottom: number;
  }

  // Navigation state hook
  export function useNavigationState(): NavigationState;

  // Scroll actions interface
  export interface ScrollActions {
    setVisibility: (isVisible: boolean, force?: boolean) => void;
    updateOptions: (options: Partial<UseScrollControllerOptions>) => void;
    showNavigation: () => void;
    hideNavigation: () => void;
    toggleNavigation: () => void;
  }

  // Scroll actions hook
  export function useScrollActions(): ScrollActions;

  // HOC props interface
  export interface WithScrollControllerProps {
    scrollController: ScrollControllerContextValue;
  }

  // HOC function
  export function withScrollController<P extends WithScrollControllerProps>(
    Component: React.ComponentType<P>
  ): React.FC<Omit<P, keyof WithScrollControllerProps>>;

  // Debugger component props
  export interface ScrollControllerDebuggerProps {
    enabled?: boolean;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    className?: string;
  }

  // Debugger component
  export const ScrollControllerDebugger: React.FC<ScrollControllerDebuggerProps>;

  export default ScrollControllerProvider;
}

// Augment window interface for Visual Viewport API
declare global {
  interface Window {
    visualViewport?: {
      addEventListener(event: string, callback: () => void): void;
      removeEventListener(event: string, callback: () => void): void;
      height: number;
      width: number;
      offsetTop: number;
      offsetLeft: number;
      pageTop: number;
      pageLeft: number;
      scale: number;
    };
  }

  // Extend Navigator for hardware concurrency
  interface Navigator {
    hardwareConcurrency?: number;
  }

  // Extend Performance for memory API
  interface Performance {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }
}

// CSS Custom Properties for safe area
declare module 'csstype' {
  interface Properties {
    '--safe-area-inset-top'?: string;
    '--safe-area-inset-right'?: string;
    '--safe-area-inset-bottom'?: string;
    '--safe-area-inset-left'?: string;
  }
}

export {};