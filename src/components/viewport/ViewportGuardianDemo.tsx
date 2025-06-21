/**
 * Viewport Guardian Demo Component
 *
 * Demonstrates the capabilities of the Viewport Guardian system:
 * - Real-time viewport information display
 * - Safe area visualization
 * - Virtual keyboard detection
 * - Orientation change handling
 * - Feature detection results
 */

import React, { useState } from 'react';
import {
  useViewport,
  useSafeArea,
  useVirtualKeyboard,
  useOrientation,
  useViewportDimensions,
  useResponsiveBreakpoint,
  useDeviceType,
} from '@/shared/hooks';
import {
  getViewportDebugInfo,
  getFeatureSupport,
  getBrowserInfo,
} from '@/shared/utils/viewport-guardian';
import { UniversalCard } from '@/shared/ui/UniversalCard';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';

const ViewportGuardianDemo: React.FC = () => {
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  // Use all viewport hooks
  const viewport = useViewport();
  const safeArea = useSafeArea();
  const keyboard = useVirtualKeyboard();
  const orientation = useOrientation();
  const dimensions = useViewportDimensions();
  const breakpoint = useResponsiveBreakpoint();
  const deviceType = useDeviceType();

  const debugInfo = showDebugInfo ? getViewportDebugInfo() : null;
  const features = getFeatureSupport();
  const browser = getBrowserInfo();

  return (
    <div className="p-4 space-y-6 safe-all">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">🛡️ Viewport Guardian Demo</h1>
        <p className="text-muted-foreground">
          Real-time viewport information and cross-browser safe area support
        </p>
      </div>

      {/* Quick Status */}
      <UniversalCard className="p-4">
        <h2 className="text-lg font-semibold mb-3">Quick Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center">
            <Badge variant={deviceType.isMobile ? 'default' : 'secondary'}>
              {deviceType.isMobile
                ? 'Mobile'
                : deviceType.isTablet
                  ? 'Tablet'
                  : 'Desktop'}
            </Badge>
            <p className="text-sm text-muted-foreground mt-1">Device</p>
          </div>

          <div className="text-center">
            <Badge variant={orientation.isPortrait ? 'default' : 'secondary'}>
              {orientation.type}
            </Badge>
            <p className="text-sm text-muted-foreground mt-1">Orientation</p>
          </div>

          <div className="text-center">
            <Badge variant={keyboard.isOpen ? 'destructive' : 'secondary'}>
              {keyboard.isOpen ? 'Open' : 'Closed'}
            </Badge>
            <p className="text-sm text-muted-foreground mt-1">Keyboard</p>
          </div>

          <div className="text-center">
            <Badge variant="outline">{breakpoint.breakpoint}</Badge>
            <p className="text-sm text-muted-foreground mt-1">Breakpoint</p>
          </div>
        </div>
      </UniversalCard>

      {/* Viewport Dimensions */}
      <UniversalCard className="p-4">
        <h2 className="text-lg font-semibold mb-3">Viewport Dimensions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Current Dimensions</h3>
            <div className="space-y-1 text-sm">
              <div>
                Width: <code>{dimensions.width}px</code>
              </div>
              <div>
                Height: <code>{dimensions.height}px</code>
              </div>
              <div>
                Scale: <code>{viewport.visualViewport.scale}</code>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Visual Viewport</h3>
            <div className="space-y-1 text-sm">
              <div>
                Offset Top: <code>{viewport.visualViewport.offsetTop}px</code>
              </div>
              <div>
                Offset Left: <code>{viewport.visualViewport.offsetLeft}px</code>
              </div>
            </div>
          </div>
        </div>
      </UniversalCard>

      {/* Safe Area Insets */}
      <UniversalCard className="p-4">
        <h2 className="text-lg font-semibold mb-3">Safe Area Insets</h2>
        <div className="relative border-2 border-dashed border-muted rounded-lg p-8">
          {/* Safe area visualization */}
          <div
            className="absolute top-0 left-0 right-0 bg-blue-200 opacity-50"
            style={{ height: `${safeArea.top}px` }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 bg-blue-200 opacity-50"
            style={{ height: `${safeArea.bottom}px` }}
          />
          <div
            className="absolute top-0 bottom-0 left-0 bg-blue-200 opacity-50"
            style={{ width: `${safeArea.left}px` }}
          />
          <div
            className="absolute top-0 bottom-0 right-0 bg-blue-200 opacity-50"
            style={{ width: `${safeArea.right}px` }}
          />

          <div className="text-center">
            <p className="font-medium">Safe Content Area</p>
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
              <div>
                Top: <code>{safeArea.top}px</code>
              </div>
              <div>
                Right: <code>{safeArea.right}px</code>
              </div>
              <div>
                Bottom: <code>{safeArea.bottom}px</code>
              </div>
              <div>
                Left: <code>{safeArea.left}px</code>
              </div>
            </div>
          </div>
        </div>
      </UniversalCard>

      {/* Virtual Keyboard */}
      <UniversalCard className="p-4">
        <h2 className="text-lg font-semibold mb-3">Virtual Keyboard</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Status:</span>
            <Badge variant={keyboard.isOpen ? 'destructive' : 'secondary'}>
              {keyboard.isOpen ? 'Open' : 'Closed'}
            </Badge>
          </div>

          {keyboard.isOpen && (
            <div className="flex items-center justify-between">
              <span>Height:</span>
              <code>{keyboard.height}px</code>
            </div>
          )}

          <div className="mt-4">
            <input
              type="text"
              placeholder="Tap here to test virtual keyboard detection"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </UniversalCard>

      {/* Browser Capabilities */}
      <UniversalCard className="p-4">
        <h2 className="text-lg font-semibold mb-3">Browser & Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Browser Info</h3>
            <div className="space-y-1 text-sm">
              <div>
                Name: <code>{browser.name}</code>
              </div>
              <div>
                Version: <code>{browser.version}</code>
              </div>
              <div>
                Engine: <code>{browser.engine}</code>
              </div>
              <div>
                Platform: <code>{browser.platform}</code>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Feature Support</h3>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span>CSS env():</span>
                <Badge
                  variant={features.cssEnvSupport ? 'default' : 'secondary'}
                >
                  {features.cssEnvSupport ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Visual Viewport:</span>
                <Badge
                  variant={features.visualViewportAPI ? 'default' : 'secondary'}
                >
                  {features.visualViewportAPI ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Backdrop Filter:</span>
                <Badge
                  variant={
                    features.backdropFilterSupport ? 'default' : 'secondary'
                  }
                >
                  {features.backdropFilterSupport ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Modern CSS:</span>
                <Badge
                  variant={browser.supportsModernCSS ? 'default' : 'secondary'}
                >
                  {browser.supportsModernCSS ? 'Yes' : 'No'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </UniversalCard>

      {/* Debug Toggle */}
      <div className="text-center">
        <Button
          onClick={() => setShowDebugInfo(!showDebugInfo)}
          variant="outline"
        >
          {showDebugInfo ? 'Hide' : 'Show'} Debug Info
        </Button>
      </div>

      {/* Debug Information */}
      {showDebugInfo && debugInfo && (
        <UniversalCard className="p-4">
          <h2 className="text-lg font-semibold mb-3">Debug Information</h2>
          <pre className="text-xs bg-muted p-4 rounded overflow-x-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </UniversalCard>
      )}

      {/* CSS Demo */}
      <UniversalCard className="p-4">
        <h2 className="text-lg font-semibold mb-3">CSS Utilities Demo</h2>
        <div className="space-y-4">
          <div className="glass-effect p-4 rounded-lg">
            <p className="text-sm">
              Glass effect with cross-browser backdrop-filter support
            </p>
          </div>

          <div className="safe-all bg-blue-100 rounded">
            <p className="text-sm p-2">Content with safe area padding</p>
          </div>

          <div className="keyboard-aware bg-green-100 rounded p-2">
            <p className="text-sm">
              Keyboard-aware content (adjusts when virtual keyboard opens)
            </p>
          </div>
        </div>
      </UniversalCard>
    </div>
  );
};

export default ViewportGuardianDemo;
