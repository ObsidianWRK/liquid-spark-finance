/* eslint-disable @typescript-eslint/no-empty-function */
/**
 * React Hook for Scroll Controller Integration
 * 
 * Provides a clean React API for the ScrollController with:
 * - Automatic lifecycle management
 * - State synchronization
 * - Performance optimizations
 * - TypeScript support
 */

import { useEffect, useState, useRef } from 'react';
import {
  ScrollController,
  ScrollControllerState,
  ScrollControllerConfig,
} from '../utils/scroll-controller';

const useScrollController = (
  config?: Partial<ScrollControllerConfig>
): ScrollControllerState => {
  const controllerRef = useRef<ScrollController | null>(null);
  
  // Get an instance of the controller
  if (controllerRef.current === null) {
    controllerRef.current = new ScrollController(config);
  }

  const [state, setState] = useState<ScrollControllerState>(
    controllerRef.current.getState()
  );

  useEffect(() => {
    const controller = controllerRef.current;
    if (!controller) return;

    const unsubscribe = controller.subscribe(setState);
    controller.start();

    return () => {
      unsubscribe();
      controller.stop();
    };
  }, []);

  return state;
};

export { useScrollController };

// -----------------------------------------------------------------------------
// Legacy stub hooks – kept so that demo components compile until the full
// feature-rich implementation is restored.  These all return minimal yet safe
// defaults and should NOT be used for production behaviour.
// -----------------------------------------------------------------------------

export const useNavigationVisibility = (
  _config: Partial<ScrollControllerConfig> = {}
) => {
  return {
    isVisible: true,
    transform: 'translateY(0px)',
    shouldAnimate: false,
    isScrolling: false,
    scrollDirection: 'none' as const,
    safeAreaTop: 0,
    safeAreaBottom: 0,
    setVisibility: () => {},
  };
};

export const useVirtualKeyboard = () => {
  if (typeof window !== 'undefined' && 'visualViewport' in window && window.visualViewport) {
    const vv = window.visualViewport;
    const heightDiff = window.innerHeight - vv.height;
    return {
      isVisible: heightDiff > 50,
      height: Math.max(0, heightDiff),
      viewportHeight: vv.height,
    } as const;
  }
  return { isVisible: false, height: 0, viewportHeight: 0 } as const;
};

export const useScrollPerformance = () => {
  return {
    fps: 60,
    isSmooth: true,
    isOptimal: true,
    averageVelocity: 0,
    maxVelocity: 0,
    scrollEvents: 0,
  } as const;
};