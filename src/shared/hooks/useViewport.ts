/**
 * Viewport Management React Hooks
 * 
 * Provides React hooks for comprehensive viewport management:
 * - useViewportState: Complete viewport state management
 * - useSafeArea: Safe area insets with polyfills
 * - useVirtualKeyboard: Virtual keyboard detection
 * - useOrientation: Orientation change handling
 * - useViewportDimensions: Responsive dimensions
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  getSafeAreaInsets, 
  initializeViewportPolyfills,
  getViewportCapabilities,
  type SafeAreaInsets,
  type ViewportCapabilities 
} from '../utils/viewport-polyfills';
import {
  addViewportChangeListener,
  removeViewportChangeListener,
  getVisualViewportState,
  isVirtualKeyboardOpen,
  getVirtualKeyboardHeight,
  type VisualViewportState,
  type ViewportChangeEvent,
  type ViewportChangeListener
} from '../utils/visual-viewport-utils';
import {
  addOrientationChangeListener,
  removeOrientationChangeListener,
  getCurrentOrientation,
  type OrientationState,
  type OrientationChangeEvent,
  type OrientationChangeListener
} from '../utils/orientation-utils';

// Comprehensive viewport state
export interface ViewportState {
  // Dimensions
  width: number;
  height: number;
  
  // Visual viewport
  visualViewport: VisualViewportState;
  
  // Safe areas
  safeArea: SafeAreaInsets;
  
  // Orientation
  orientation: OrientationState;
  
  // Capabilities
  capabilities: ViewportCapabilities;
  
  // Virtual keyboard
  isKeyboardOpen: boolean;
  keyboardHeight: number;
  
  // Convenience flags
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
}

/**
 * Main viewport hook - provides complete viewport state
 */
export const useViewport = (): ViewportState => {
  const [state, setState] = useState<ViewportState>(() => {
    // Initialize polyfills on first use
    if (typeof window !== 'undefined') {
      initializeViewportPolyfills();
    }
    
    return getInitialViewportState();
  });

  const updateStateRef = useRef<() => void>();

  const updateState = useCallback(() => {
    const newState = getCurrentViewportState();
    setState(newState);
  }, []);

  updateStateRef.current = updateState;

  useEffect(() => {
    // Viewport change listener
    const handleViewportChange: ViewportChangeListener = () => {
      updateStateRef.current?.();
    };

    // Orientation change listener
    const handleOrientationChange: OrientationChangeListener = () => {
      updateStateRef.current?.();
    };

    const removeViewportListener = addViewportChangeListener(handleViewportChange);
    const removeOrientationListener = addOrientationChangeListener(handleOrientationChange);

    // Initial update
    updateState();

    return () => {
      removeViewportListener();
      removeOrientationListener();
    };
  }, [updateState]);

  return state;
};

/**
 * Safe area insets hook with automatic polyfills
 */
export const useSafeArea = (): SafeAreaInsets => {
  const [safeArea, setSafeArea] = useState<SafeAreaInsets>(getSafeAreaInsets);

  useEffect(() => {
    // Initialize polyfills
    initializeViewportPolyfills();
    
    const handleViewportChange: ViewportChangeListener = () => {
      setSafeArea(getSafeAreaInsets());
    };

    const handleOrientationChange: OrientationChangeListener = () => {
      // Update safe area on orientation change
      setTimeout(() => {
        setSafeArea(getSafeAreaInsets());
      }, 100);
    };

    const removeViewportListener = addViewportChangeListener(handleViewportChange);
    const removeOrientationListener = addOrientationChangeListener(handleOrientationChange);

    return () => {
      removeViewportListener();
      removeOrientationListener();
    };
  }, []);

  return safeArea;
};

/**
 * Virtual keyboard detection hook
 */
export const useVirtualKeyboard = () => {
  const [keyboardState, setKeyboardState] = useState(() => ({
    isOpen: isVirtualKeyboardOpen(),
    height: getVirtualKeyboardHeight(),
  }));

  useEffect(() => {
    const handleViewportChange: ViewportChangeListener = (event) => {
      if (event.type === 'keyboard' || event.type === 'resize') {
        setKeyboardState({
          isOpen: event.state.isVirtualKeyboardOpen,
          height: event.state.keyboardHeight,
        });
      }
    };

    const removeListener = addViewportChangeListener(handleViewportChange);

    return removeListener;
  }, []);

  return keyboardState;
};

/**
 * Orientation change hook
 */
export const useOrientation = () => {
  const [orientation, setOrientation] = useState<OrientationState>(getCurrentOrientation);

  useEffect(() => {
    const handleOrientationChange: OrientationChangeListener = (event) => {
      setOrientation(event.current);
    };

    const removeListener = addOrientationChangeListener(handleOrientationChange);

    return removeListener;
  }, []);

  return {
    ...orientation,
    isPortrait: orientation.type === 'portrait',
    isLandscape: orientation.type === 'landscape',
  };
};

/**
 * Viewport dimensions hook with performance optimization
 */
export const useViewportDimensions = () => {
  const [dimensions, setDimensions] = useState(() => {
    if (typeof window === 'undefined') {
      return { width: 0, height: 0 };
    }
    
    const vvState = getVisualViewportState();
    return {
      width: vvState.width,
      height: vvState.height,
    };
  });

  useEffect(() => {
    let rafId: number | null = null;

    const handleViewportChange: ViewportChangeListener = (event) => {
      // Debounce dimension updates for performance
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        setDimensions({
          width: event.state.width,
          height: event.state.height,
        });
        rafId = null;
      });
    };

    const removeListener = addViewportChangeListener(handleViewportChange);

    return () => {
      removeListener();
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return dimensions;
};

/**
 * Responsive breakpoint hook
 */
export const useResponsiveBreakpoint = () => {
  const { width } = useViewportDimensions();

  const getBreakpoint = useCallback((w: number) => {
    if (w < 640) return 'mobile';
    if (w < 768) return 'sm';
    if (w < 1024) return 'md';
    if (w < 1280) return 'lg';
    if (w < 1536) return 'xl';
    return '2xl';
  }, []);

  const breakpoint = getBreakpoint(width);

  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'sm' || breakpoint === 'md',
    isDesktop: ['lg', 'xl', '2xl'].includes(breakpoint),
    width,
  };
};

/**
 * Viewport-aware CSS custom properties hook
 */
export const useViewportCSSProperties = () => {
  const safeArea = useSafeArea();
  const { isKeyboardOpen, height: keyboardHeight } = useVirtualKeyboard();
  const { width, height } = useViewportDimensions();

  return {
    '--viewport-width': `${width}px`,
    '--viewport-height': `${height}px`,
    '--safe-area-inset-top': `${safeArea.top}px`,
    '--safe-area-inset-right': `${safeArea.right}px`,
    '--safe-area-inset-bottom': `${safeArea.bottom}px`,
    '--safe-area-inset-left': `${safeArea.left}px`,
    '--keyboard-height': `${keyboardHeight}px`,
    '--keyboard-open': isKeyboardOpen ? '1' : '0',
  } as React.CSSProperties;
};

/**
 * Device type detection hook
 */
export const useDeviceType = () => {
  const capabilities = getViewportCapabilities();
  const { width } = useViewportDimensions();

  return {
    isMobile: capabilities.isMobile,
    isTablet: !capabilities.isMobile && width >= 768 && width < 1024,
    isDesktop: !capabilities.isMobile && width >= 1024,
    isIOS: capabilities.isIOS,
    isAndroid: capabilities.isAndroid,
    capabilities,
  };
};

// Helper functions

function getInitialViewportState(): ViewportState {
  if (typeof window === 'undefined') {
    return {
      width: 0,
      height: 0,
      visualViewport: {
        width: 0,
        height: 0,
        offsetTop: 0,
        offsetLeft: 0,
        scale: 1,
        isVirtualKeyboardOpen: false,
        keyboardHeight: 0,
      },
      safeArea: { top: 0, right: 0, bottom: 0, left: 0 },
      orientation: {
        type: 'portrait',
        angle: 0,
        isLocked: false,
        isPrimary: true,
      },
      capabilities: {
        hasSafeAreaSupport: false,
        hasVisualViewport: false,
        hasScreenOrientation: false,
        hasMatchMedia: false,
        isIOS: false,
        isAndroid: false,
        isMobile: false,
      },
      isKeyboardOpen: false,
      keyboardHeight: 0,
      isMobile: false,
      isTablet: false,
      isDesktop: false,
      isPortrait: true,
      isLandscape: false,
    };
  }

  return getCurrentViewportState();
}

function getCurrentViewportState(): ViewportState {
  const visualViewport = getVisualViewportState();
  const safeArea = getSafeAreaInsets();
  const orientation = getCurrentOrientation();
  const capabilities = getViewportCapabilities();

  const isMobile = capabilities.isMobile;
  const isTablet = !isMobile && visualViewport.width >= 768 && visualViewport.width < 1024;
  const isDesktop = !isMobile && visualViewport.width >= 1024;

  return {
    width: visualViewport.width,
    height: visualViewport.height,
    visualViewport,
    safeArea,
    orientation,
    capabilities,
    isKeyboardOpen: visualViewport.isVirtualKeyboardOpen,
    keyboardHeight: visualViewport.keyboardHeight,
    isMobile,
    isTablet,
    isDesktop,
    isPortrait: orientation.type === 'portrait',
    isLandscape: orientation.type === 'landscape',
  };
}