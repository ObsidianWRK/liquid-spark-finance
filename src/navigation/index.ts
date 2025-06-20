// Navigation Components
export { default as AdaptiveNavigation } from './components/AdaptiveNavigation';
export { default as BottomNav } from './components/BottomNav';
export { default as NavRail } from './components/NavRail';
export { default as TopBar } from './components/TopBar';
export { default as MotionWrapper } from './components/MotionWrapper';
export { default as NavBar } from './components/NavBar';

// Route Configuration
export { mainRoutes, secondaryRoutes, allRoutes } from './routeConfig';
export type { Route } from './routeConfig';

// NavBar Types
export type { Tab, NavBarProps } from './components/NavBar';

// Scroll Controller
export { default as ScrollController } from './utils/scroll-controller';
export type {
  ScrollState,
  NavigationVisibilityState,
  ScrollControllerOptions,
  ScrollControllerCallbacks,
  UseScrollControllerOptions,
  UseScrollControllerReturn,
} from './utils/scroll-controller';

// Scroll Controller Hooks
export {
  default as useScrollController,
  useNavigationVisibility,
  useVirtualKeyboard,
  useScrollPerformance,
} from './hooks/useScrollController';

// Scroll Controller Context
export {
  default as ScrollControllerProvider,
  useScrollControllerContext,
  useNavigationState,
  useScrollActions,
  withScrollController,
  ScrollControllerDebugger,
} from './context/ScrollControllerContext';

// Utility Functions
export {
  createScrollController,
  getNavigationTransform,
  detectVirtualKeyboard,
} from './utils/scroll-controller';

// Hooks
export { useBreakpoint } from '@/shared/hooks/useBreakpoint';

// Accessibility Hooks
export {
  useAccessibility,
  useKeyboardNavigation,
  useTouchTarget,
} from './hooks/useAccessibility'; 