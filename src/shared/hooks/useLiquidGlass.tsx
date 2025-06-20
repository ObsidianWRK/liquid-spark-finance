import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { secureStorage } from '@/shared/utils/crypto';

interface LiquidGlassSettings {
  enabled: boolean;
  globalIntensity: number; // 0-1
  globalDistortion: number; // 0-1
  animated: boolean;
  interactive: boolean;
  performanceMode: boolean;
  autoDetectPerformance: boolean;
}

interface LiquidGlassContextType {
  settings: LiquidGlassSettings;
  updateSettings: (updates: Partial<LiquidGlassSettings>) => void;
  resetSettings: () => void;
  performanceInfo: {
    webGLSupported: boolean;
    isMobile: boolean;
    isLowEnd: boolean;
    prefersReducedMotion: boolean;
  };
}

const defaultSettings: LiquidGlassSettings = {
  enabled: true,
  globalIntensity: 0.6,
  globalDistortion: 0.4,
  animated: true,
  interactive: true,
  performanceMode: false,
  autoDetectPerformance: true,
};

const LiquidGlassContext = createContext<LiquidGlassContextType | undefined>(
  undefined
);

// Performance detection utilities
const detectPerformance = () => {
  // Check WebGL support
  const checkWebGL = () => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch (e) {
      return false;
    }
  };

  // Detect mobile devices
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  // Detect low-end devices
  const isLowEnd = navigator.hardwareConcurrency
    ? navigator.hardwareConcurrency < 4
    : false;

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  return {
    webGLSupported: checkWebGL(),
    isMobile,
    isLowEnd,
    prefersReducedMotion,
  };
};

// Auto-adjust settings based on performance
const getOptimizedSettings = (
  settings: LiquidGlassSettings,
  performanceInfo: ReturnType<typeof detectPerformance>
): LiquidGlassSettings => {
  if (!settings.autoDetectPerformance) return settings;

  const { isMobile, isLowEnd, prefersReducedMotion, webGLSupported } =
    performanceInfo;

  // If no WebGL support, disable entirely
  if (!webGLSupported) {
    return { ...settings, enabled: false };
  }

  // Mobile optimization
  if (isMobile) {
    return {
      ...settings,
      globalIntensity: Math.min(settings.globalIntensity * 0.6, 0.4),
      globalDistortion: Math.min(settings.globalDistortion * 0.6, 0.3),
      animated: false,
      interactive: false,
    };
  }

  // Low-end device optimization
  if (isLowEnd) {
    return {
      ...settings,
      globalIntensity: Math.min(settings.globalIntensity * 0.7, 0.5),
      globalDistortion: Math.min(settings.globalDistortion * 0.7, 0.3),
      animated: !prefersReducedMotion,
    };
  }

  // Respect reduced motion preference
  if (prefersReducedMotion) {
    return {
      ...settings,
      animated: false,
    };
  }

  return settings;
};

export const LiquidGlassProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<LiquidGlassSettings>(() => {
    // Load settings from secure storage if available
    try {
      const saved = secureStorage.getItem('vueni:liquidGlassSettings');
      return saved ? { ...defaultSettings, ...saved } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [performanceInfo] = useState(() => detectPerformance());

  // Get optimized settings based on performance
  const optimizedSettings = getOptimizedSettings(settings, performanceInfo);

  const updateSettings = (updates: Partial<LiquidGlassSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);

    // Save to secure storage
    try {
      secureStorage.setItem('vueni:liquidGlassSettings', newSettings);
    } catch {
      // Ignore storage errors
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    try {
      secureStorage.removeItem('vueni:liquidGlassSettings');
    } catch {
      // Ignore storage errors
    }
  };

  // Performance monitoring
  useEffect(() => {
    if (!optimizedSettings.enabled) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 60;

    const monitorPerformance = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;

        // Auto-enable performance mode if FPS drops too low
        if (
          fps < 30 &&
          settings.autoDetectPerformance &&
          !settings.performanceMode
        ) {
          console.warn('Low FPS detected, enabling performance mode');
          updateSettings({ performanceMode: true });
        }
      }

      requestAnimationFrame(monitorPerformance);
    };

    const animationId = requestAnimationFrame(monitorPerformance);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [
    optimizedSettings.enabled,
    settings.autoDetectPerformance,
    settings.performanceMode,
  ]);

  const contextValue: LiquidGlassContextType = {
    settings: optimizedSettings,
    updateSettings,
    resetSettings,
    performanceInfo,
  };

  return (
    <LiquidGlassContext.Provider value={contextValue}>
      {children}
    </LiquidGlassContext.Provider>
  );
};

export const useLiquidGlass = () => {
  const context = useContext(LiquidGlassContext);
  if (!context) {
    throw new Error('useLiquidGlass must be used within a LiquidGlassProvider');
  }
  return context;
};

// Hook for individual component settings
export const useLiquidGlassSettings = (
  componentSettings?: Partial<{
    intensity: number;
    distortion: number;
    animated: boolean;
    interactive: boolean;
  }>
) => {
  const { settings, performanceInfo } = useLiquidGlass();

  return {
    enabled: settings.enabled && performanceInfo.webGLSupported,
    intensity: componentSettings?.intensity ?? settings.globalIntensity,
    distortion: componentSettings?.distortion ?? settings.globalDistortion,
    animated:
      (componentSettings?.animated ?? settings.animated) &&
      !performanceInfo.prefersReducedMotion,
    interactive: componentSettings?.interactive ?? settings.interactive,
    performanceMode: settings.performanceMode,
  };
};
