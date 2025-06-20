// src/navigation/hooks/index.ts
export {
  useAccessibility,
  useKeyboardNavigation,
  useTouchTarget,
} from './useAccessibility';

export {
  default as useScrollController,
  useNavigationVisibility,
  useVirtualKeyboard,
  useScrollPerformance,
  type UseScrollControllerOptions,
  type UseScrollControllerReturn,
  type UseNavigationVisibilityOptions,
  type UseNavigationVisibilityReturn,
  type UseVirtualKeyboardOptions,
  type UseVirtualKeyboardReturn,
  type UseScrollPerformanceOptions,
  type UseScrollPerformanceReturn,
} from './useScrollController';
