/**
 * Scroll Controller Context
 *
 * Provides global scroll controller state management for the application.
 * This allows components to share scroll state and coordinate navigation visibility.
 */

import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useScrollController } from '../hooks/useScrollController';
import type {
  ScrollControllerState,
  ScrollControllerConfig,
} from '../utils/scroll-controller';

// -----------------------------------------------------------------------------
// Context & Provider
// -----------------------------------------------------------------------------

export interface ScrollControllerContextValue {
  scrollState: ScrollControllerState;
}

const ScrollControllerContext =
  createContext<ScrollControllerContextValue | null>(null);

export interface ScrollControllerProviderProps {
  children: ReactNode;
  options?: Partial<ScrollControllerConfig>;
  /** Disable controller entirely. Useful for tests. */
  disabled?: boolean;
}

const DEFAULT_GLOBAL_OPTIONS: Partial<ScrollControllerConfig> = {
  hideThreshold: 48,
  hideVelocity: 0.5,
  showVelocity: -0.3,
  debounce: 16,
  alwaysShowTop: 100,
};

export const ScrollControllerProvider: React.FC<
  ScrollControllerProviderProps
> = ({ children, options = {}, disabled = false }) => {
  const mergedOptions = useMemo(
    () => ({ ...DEFAULT_GLOBAL_OPTIONS, ...options }),
    [options]
  );

  // When disabled we still provide a static visible state so consumers render.
  const scrollState = useScrollController(disabled ? {} : mergedOptions);

  const value = useMemo<ScrollControllerContextValue>(
    () => ({ scrollState }),
    [scrollState]
  );

  return (
    <ScrollControllerContext.Provider value={value}>
      {children}
    </ScrollControllerContext.Provider>
  );
};

// -----------------------------------------------------------------------------
// Consumer Hooks
// -----------------------------------------------------------------------------

export const useScrollControllerContext = (): ScrollControllerContextValue => {
  const ctx = useContext(ScrollControllerContext);
  if (!ctx) {
    throw new Error(
      'useScrollControllerContext must be used within a ScrollControllerProvider.'
    );
  }
  return ctx;
};

// Derived state tailored for UI components.
export interface NavigationState {
  isVisible: boolean;
  transform: string;
  shouldAnimate: boolean;
  isScrolling: boolean;
  scrollDirection: 'up' | 'down' | 'none';
  safeAreaTop: number;
  safeAreaBottom: number;
}

export const useNavigationState = (): NavigationState => {
  const { scrollState } = useScrollControllerContext();
  const { isVisible, isScrolling, velocity } = scrollState;

  const scrollDirection: NavigationState['scrollDirection'] =
    velocity > 0 ? 'down' : velocity < 0 ? 'up' : 'none';

  const transform = isVisible ? 'translateY(0px)' : 'translateY(-100%)';

  return useMemo<NavigationState>(
    () => ({
      isVisible,
      transform,
      shouldAnimate: true,
      isScrolling,
      scrollDirection,
      safeAreaTop: 0,
      safeAreaBottom: 0,
    }),
    [isVisible, isScrolling, scrollDirection, transform]
  );
};

// Legacy no-op actions so existing imports compile without runtime crashes.
export interface ScrollActions {
  setVisibility: (isVisible: boolean, force?: boolean) => void;
  updateOptions: (options: Partial<ScrollControllerConfig>) => void;
  showNavigation: () => void;
  hideNavigation: () => void;
  toggleNavigation: () => void;
}

export const useScrollActions = (): ScrollActions => {
  const noop = () => {};
  return useMemo<ScrollActions>(
    () => ({
      setVisibility: noop,
      updateOptions: noop,
      showNavigation: noop,
      hideNavigation: noop,
      toggleNavigation: noop,
    }),
    []
  );
};

// -----------------------------------------------------------------------------
// Optional debug overlay (development-only)
// -----------------------------------------------------------------------------

interface DebuggerProps {
  enabled?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export const ScrollControllerDebugger: React.FC<DebuggerProps> = ({
  enabled = process.env.NODE_ENV === 'development',
  position = 'top-right',
  className = '',
}) => {
  const { scrollState } = useScrollControllerContext();
  if (!enabled) return null;

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  } as const;

  const { isVisible, scrollY, velocity, isScrolling } = scrollState;
  const transform = isVisible ? 'translateY(0px)' : 'translateY(-100%)';

  return (
    <div
      className={`fixed z-[9999] p-3 bg-black/80 text-white text-xs font-mono rounded-vueni-lg backdrop-blur-sm border border-white/20 max-w-xs ${positionClasses[position]} ${className}`}
      style={{ pointerEvents: 'none' }}
    >
      <div className="mb-2 font-semibold text-blue-300">
        Scroll Controller Debug
      </div>

      <div className="space-y-1">
        <div>
          <span className="text-gray-400">Visible:</span>{' '}
          <span className={isVisible ? 'text-green-400' : 'text-red-400'}>
            {isVisible ? 'Yes' : 'No'}
          </span>
        </div>
        <div>
          <span className="text-gray-400">Scroll Y:</span>{' '}
          <span className="text-yellow-400">{Math.round(scrollY)}px</span>
        </div>
        <div>
          <span className="text-gray-400">Velocity:</span>{' '}
          <span className="text-yellow-400">{velocity.toFixed(3)}</span>
        </div>
        <div>
          <span className="text-gray-400">Scrolling:</span>{' '}
          <span className={isScrolling ? 'text-green-400' : 'text-gray-500'}>
            {isScrolling ? 'Yes' : 'No'}
          </span>
        </div>
        <div>
          <span className="text-gray-400">Transform:</span>{' '}
          <span className="text-blue-400 text-[10px]">{transform}</span>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Stub hooks for demo components
// -----------------------------------------------------------------------------

export const useVirtualKeyboard = () => {
  // Basic detection using VisualViewport if available
  if (
    typeof window !== 'undefined' &&
    'visualViewport' in window &&
    window.visualViewport
  ) {
    const vv = window.visualViewport;
    const heightDiff = window.innerHeight - vv.height;
    return {
      isVisible: heightDiff > 50,
      height: Math.max(0, heightDiff),
      viewportHeight: vv.height,
    } as const;
  }
  return {
    isVisible: false,
    height: 0,
    viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
  } as const;
};

export const useScrollPerformance = () => {
  // Very naive FPS tracker using requestAnimationFrame
  const [fps, setFps] = React.useState(60);
  React.useEffect(() => {
    let frameCount = 0;
    let start = performance.now();
    let rafId: number;

    const loop = () => {
      frameCount += 1;
      const now = performance.now();
      if (now - start >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        start = now;
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return {
    fps,
    isSmooth: fps > 50,
    isOptimal: fps > 55,
    averageVelocity: 0,
    maxVelocity: 0,
    scrollEvents: 0,
  } as const;
};

// -----------------------------------------------------------------------------
// HOC for legacy compatibility
// -----------------------------------------------------------------------------

export interface WithScrollControllerProps {
  scrollController: ScrollControllerContextValue;
}

export function withScrollController<P extends WithScrollControllerProps>(
  Component: React.ComponentType<P>
): React.FC<Omit<P, keyof WithScrollControllerProps>> {
  const WrappedComponent = (
    props: Omit<P, keyof WithScrollControllerProps>
  ) => {
    const scrollController = useScrollControllerContext();

    return <Component {...(props as P)} scrollController={scrollController} />;
  };

  WrappedComponent.displayName = `withScrollController(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Default export for convenience
export default ScrollControllerProvider;
