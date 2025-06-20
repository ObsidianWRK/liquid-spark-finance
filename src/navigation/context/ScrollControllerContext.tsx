/**
 * Scroll Controller Context
 * 
 * Provides global scroll controller state management for the application.
 * This allows components to share scroll state and coordinate navigation visibility.
 */

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import {
  useScrollController,
  type UseScrollControllerOptions,
  type UseScrollControllerReturn,
} from '../hooks/useScrollController';
import type { ScrollControllerCallbacks } from '../utils/scroll-controller';

// Context type definition
export interface ScrollControllerContextValue extends UseScrollControllerReturn {
  // Additional context-specific properties
  isInitialized: boolean;
}

// Create context with default values
const ScrollControllerContext = createContext<ScrollControllerContextValue | null>(null);

// Provider props
export interface ScrollControllerProviderProps {
  children: ReactNode;
  options?: UseScrollControllerOptions;
  callbacks?: ScrollControllerCallbacks;
  disabled?: boolean;
}

// Default options for the global scroll controller
const DEFAULT_GLOBAL_OPTIONS: UseScrollControllerOptions = {
  hideThreshold: 48,
  showThreshold: 4,
  velocityThreshold: 0.1,
  debounceMs: 150,
  respectReducedMotion: true,
  enableVirtualKeyboardDetection: true,
  enableSafeAreaDetection: true,
  enabled: true,
};

/**
 * ScrollControllerProvider Component
 * 
 * Provides scroll controller state to the entire application.
 * Should be placed high in the component tree, typically in App.tsx.
 */
export const ScrollControllerProvider: React.FC<ScrollControllerProviderProps> = ({
  children,
  options = {},
  callbacks = {},
  disabled = false,
}) => {
  const mergedOptions = useMemo(
    () => ({ ...DEFAULT_GLOBAL_OPTIONS, ...options, enabled: !disabled }),
    [options, disabled]
  );
  
  const scrollController = useScrollController(mergedOptions, callbacks);
  
  const contextValue = useMemo((): ScrollControllerContextValue => ({
    ...scrollController,
    isInitialized: scrollController.controller !== null,
  }), [scrollController]);
  
  return (
    <ScrollControllerContext.Provider value={contextValue}>
      {children}
    </ScrollControllerContext.Provider>
  );
};

/**
 * useScrollControllerContext Hook
 * 
 * Provides access to the global scroll controller state.
 * Throws an error if used outside of ScrollControllerProvider.
 */
export const useScrollControllerContext = (): ScrollControllerContextValue => {
  const context = useContext(ScrollControllerContext);
  
  if (!context) {
    throw new Error(
      'useScrollControllerContext must be used within a ScrollControllerProvider. ' +
      'Make sure to wrap your app with <ScrollControllerProvider>.'
    );
  }
  
  return context;
};

/**
 * useNavigationState Hook
 * 
 * Simplified hook for components that only need navigation visibility state.
 * Uses the global scroll controller context.
 */
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
  const { scrollState, visibilityState } = useScrollControllerContext();
  
  return React.useMemo((): NavigationState => ({
    isVisible: visibilityState.isVisible,
    transform: visibilityState.transform,
    shouldAnimate: visibilityState.shouldAnimate,
    isScrolling: scrollState.isScrolling,
    scrollDirection: scrollState.direction,
    safeAreaTop: visibilityState.safeAreaPadding.top,
    safeAreaBottom: visibilityState.safeAreaPadding.bottom,
  }), [scrollState, visibilityState]);
};

/**
 * useScrollActions Hook
 * 
 * Provides actions to control scroll behavior.
 * Uses the global scroll controller context.
 */
export interface ScrollActions {
  setVisibility: (isVisible: boolean, force?: boolean) => void;
  updateOptions: (options: Partial<UseScrollControllerOptions>) => void;
  showNavigation: () => void;
  hideNavigation: () => void;
  toggleNavigation: () => void;
}

export const useScrollActions = (): ScrollActions => {
  const { setVisibility, updateOptions, visibilityState } = useScrollControllerContext();
  
  return useMemo((): ScrollActions => ({
    setVisibility,
    updateOptions,
    showNavigation: () => setVisibility(true, true),
    hideNavigation: () => setVisibility(false, true),
    toggleNavigation: () => setVisibility(!visibilityState.isVisible, true),
  }), [setVisibility, updateOptions, visibilityState.isVisible]);
};

/**
 * withScrollController HOC
 * 
 * Higher-order component that provides scroll controller context to wrapped components.
 * Useful for class components or components that need scroll controller props.
 */
export interface WithScrollControllerProps {
  scrollController: ScrollControllerContextValue;
}

export function withScrollController<P extends WithScrollControllerProps>(
  Component: React.ComponentType<P>
): React.FC<Omit<P, keyof WithScrollControllerProps>> {
  const WrappedComponent = (props: Omit<P, keyof WithScrollControllerProps>) => {
    const scrollController = useScrollControllerContext();
    
    return (
      <Component
        {...(props as P)}
        scrollController={scrollController}
      />
    );
  };
  
  WrappedComponent.displayName = `withScrollController(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

/**
 * ScrollControllerDebugger Component
 * 
 * Development component for debugging scroll controller state.
 * Only renders content in development mode.
 */
export interface ScrollControllerDebuggerProps {
  enabled?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export const ScrollControllerDebugger: React.FC<ScrollControllerDebuggerProps> = ({
  enabled = process.env.NODE_ENV === 'development',
  position = 'top-right',
  className = '',
}) => {
  const { scrollState, visibilityState, isInitialized } = useScrollControllerContext();
  
  if (!enabled || !isInitialized) {
    return null;
  }
  
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };
  
  return (
    <div
      className={`
        fixed z-[9999] p-3 bg-black/80 text-white text-xs font-mono rounded-lg
        backdrop-blur-sm border border-white/20 max-w-xs
        ${positionClasses[position]}
        ${className}
      `}
      style={{ pointerEvents: 'none' }}
    >
      <div className="mb-2 font-semibold text-blue-300">Scroll Controller Debug</div>
      
      <div className="space-y-1">
        <div>
          <span className="text-gray-400">Visible:</span>{' '}
          <span className={visibilityState.isVisible ? 'text-green-400' : 'text-red-400'}>
            {visibilityState.isVisible ? 'Yes' : 'No'}
          </span>
        </div>
        
        <div>
          <span className="text-gray-400">Scroll Y:</span>{' '}
          <span className="text-yellow-400">{Math.round(scrollState.scrollY)}px</span>
        </div>
        
        <div>
          <span className="text-gray-400">Velocity:</span>{' '}
          <span className="text-yellow-400">{scrollState.velocity.toFixed(3)}</span>
        </div>
        
        <div>
          <span className="text-gray-400">Direction:</span>{' '}
          <span className="text-yellow-400">{scrollState.direction}</span>
        </div>
        
        <div>
          <span className="text-gray-400">Scrolling:</span>{' '}
          <span className={scrollState.isScrolling ? 'text-green-400' : 'text-gray-500'}>
            {scrollState.isScrolling ? 'Yes' : 'No'}
          </span>
        </div>
        
        <div>
          <span className="text-gray-400">Transform:</span>{' '}
          <span className="text-blue-400 text-[10px]">{visibilityState.transform}</span>
        </div>
        
        <div>
          <span className="text-gray-400">Safe Area:</span>{' '}
          <span className="text-purple-400">
            {visibilityState.safeAreaPadding.top}px / {visibilityState.safeAreaPadding.bottom}px
          </span>
        </div>
        
        <div>
          <span className="text-gray-400">Animate:</span>{' '}
          <span className={visibilityState.shouldAnimate ? 'text-green-400' : 'text-gray-500'}>
            {visibilityState.shouldAnimate ? 'Yes' : 'No'}
          </span>
        </div>
      </div>
    </div>
  );
};

// Export everything
export default ScrollControllerProvider;