/**
 * ScrollControllerDemo Component
 * 
 * Demonstrates how to integrate and use the ScrollController with React components.
 * This shows practical examples of:
 * - Basic scroll controller setup
 * - Navigation visibility control
 * - Virtual keyboard detection
 * - Performance monitoring
 * - Custom scroll behaviors
 */

import React, { useState } from 'react';
import {
  ScrollControllerProvider,
  useNavigationState,
  useScrollActions,
  useVirtualKeyboard,
  useScrollPerformance,
  ScrollControllerDebugger,
} from '@/navigation/context/ScrollControllerContext';
import {
  useNavigationVisibility,
  useScrollController,
} from '../hooks/useScrollController';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';

// Demo Navigation Bar Component
const DemoNavBar: React.FC = () => {
  const navigationState = useNavigationState();
  const { showNavigation, hideNavigation, toggleNavigation } = useScrollActions();
  
  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md",
        "border-b border-white/20 px-4 py-3 text-white",
        navigationState.shouldAnimate && "transition-transform duration-300 ease-out"
      )}
      style={{
        transform: navigationState.transform,
        paddingTop: `${navigationState.safeAreaTop}px`,
      }}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Scroll Demo NavBar</h1>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-white/60">
            {navigationState.isVisible ? 'Visible' : 'Hidden'}
          </span>
          
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant="outline"
              onClick={showNavigation}
              className="text-xs"
            >
              Show
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={hideNavigation}
              className="text-xs"
            >
              Hide
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={toggleNavigation}
              className="text-xs"
            >
              Toggle
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo Content Component
const DemoContent: React.FC = () => {
  const navigationState = useNavigationState();
  const virtualKeyboard = useVirtualKeyboard();
  const scrollPerformance = useScrollPerformance();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Add top padding to account for fixed navbar */}
      <div className="h-16"></div>
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Scroll State Card */}
        <Card className="p-6 bg-black/40 border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Scroll State</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Direction:</span>
              <div className="font-mono text-yellow-400">
                {navigationState.scrollDirection}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Scrolling:</span>
              <div className={cn(
                "font-mono",
                navigationState.isScrolling ? "text-green-400" : "text-gray-500"
              )}>
                {navigationState.isScrolling ? 'Yes' : 'No'}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Visible:</span>
              <div className={cn(
                "font-mono",
                navigationState.isVisible ? "text-green-400" : "text-red-400"
              )}>
                {navigationState.isVisible ? 'Yes' : 'No'}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Animate:</span>
              <div className={cn(
                "font-mono",
                navigationState.shouldAnimate ? "text-blue-400" : "text-gray-500"
              )}>
                {navigationState.shouldAnimate ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        </Card>
        
        {/* Virtual Keyboard Card */}
        <Card className="p-6 bg-black/40 border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Virtual Keyboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Status:</span>
              <div className={cn(
                "font-mono",
                virtualKeyboard.isVisible ? "text-orange-400" : "text-gray-500"
              )}>
                {virtualKeyboard.isVisible ? 'Visible' : 'Hidden'}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Height:</span>
              <div className="font-mono text-blue-400">
                {virtualKeyboard.height}px
              </div>
            </div>
            <div>
              <span className="text-gray-400">Viewport:</span>
              <div className="font-mono text-purple-400">
                {virtualKeyboard.viewportHeight}px
              </div>
            </div>
          </div>
          
          {/* Test input for virtual keyboard */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Type here to test virtual keyboard detection..."
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </Card>
        
        {/* Performance Card */}
        <Card className="p-6 bg-black/40 border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Scroll Performance</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">FPS:</span>
              <div className={cn(
                "font-mono text-lg",
                scrollPerformance.fps > 55 ? "text-green-400" : 
                scrollPerformance.fps > 30 ? "text-yellow-400" : "text-red-400"
              )}>
                {scrollPerformance.fps}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Smooth:</span>
              <div className={cn(
                "font-mono",
                scrollPerformance.isSmooth ? "text-green-400" : "text-red-400"
              )}>
                {scrollPerformance.isSmooth ? 'Yes' : 'No'}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Optimal:</span>
              <div className={cn(
                "font-mono",
                scrollPerformance.isOptimal ? "text-green-400" : "text-yellow-400"
              )}>
                {scrollPerformance.isOptimal ? 'Yes' : 'No'}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Avg Velocity:</span>
              <div className="font-mono text-blue-400">
                {scrollPerformance.averageVelocity.toFixed(2)}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Max Velocity:</span>
              <div className="font-mono text-purple-400">
                {scrollPerformance.maxVelocity.toFixed(2)}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Events:</span>
              <div className="font-mono text-cyan-400">
                {scrollPerformance.scrollEvents}
              </div>
            </div>
          </div>
        </Card>
        
        {/* Test Content - Long scrollable content */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Test Content</h2>
          <p className="text-gray-300">
            Scroll up and down to test the navigation bar behavior. The navigation will:
          </p>
          <ul className="text-gray-300 space-y-2 list-disc list-inside">
            <li>Hide when scrolling down more than 48px with velocity greater than 0.1px/ms</li>
            <li>Show when scrolling up</li>
            <li>Always show when at the top of the page</li>
            <li>Respect reduced motion preferences</li>
            <li>Handle virtual keyboards automatically</li>
            <li>Maintain 60fps performance</li>
          </ul>
          
          {/* Generate scrollable content */}
          {Array.from({ length: 50 }, (_, i) => (
            <Card key={i} className="p-6 bg-black/20 border-white/10">
              <h3 className="text-lg font-medium text-white mb-2">
                Section {i + 1}
              </h3>
              <p className="text-gray-400">
                This is test content section {i + 1}. Keep scrolling to test the scroll controller
                behavior. The navigation bar should hide and show based on scroll direction and velocity.
                This demonstrates the smooth, performance-optimized scroll handling that prevents
                scroll jank while providing responsive navigation controls.
              </p>
              
              {/* Add some variety to content heights */}
              {i % 3 === 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg"></div>
                  <div className="h-20 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg"></div>
                </div>
              )}
              
              {i % 5 === 0 && (
                <div className="mt-4">
                  <div className="h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-white/60">Interactive Test Area</span>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// Custom Hook Demo Component
const CustomHookDemo: React.FC = () => {
  const [enabled, setEnabled] = useState(true);
  
  // Direct hook usage (alternative to context)
  const { isVisible, transform, shouldAnimate, setVisibility } = useNavigationVisibility({
    enabled,
    hideThreshold: 60, // Custom threshold
    velocityThreshold: 0.2, // Custom velocity
  });
  
  return (
    <Card className="p-6 bg-black/40 border-white/20">
      <h2 className="text-xl font-semibold text-white mb-4">Custom Hook Demo</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 text-white">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="rounded"
            />
            <span>Enable Custom Hook</span>
          </label>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Hook Visible:</span>
            <div className={cn(
              "font-mono",
              isVisible ? "text-green-400" : "text-red-400"
            )}>
              {isVisible ? 'Yes' : 'No'}
            </div>
          </div>
          <div>
            <span className="text-gray-400">Transform:</span>
            <div className="font-mono text-blue-400 text-xs">
              {transform}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={() => setVisibility(true, true)}
            className="text-xs"
          >
            Force Show
          </Button>
          <Button
            size="sm"
            onClick={() => setVisibility(false, true)}
            className="text-xs"
          >
            Force Hide
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Main Demo Component
const ScrollControllerDemo: React.FC = () => {
  const [debugEnabled, setDebugEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  
  return (
    <ScrollControllerProvider
      options={{
        respectReducedMotion: reducedMotion,
        hideThreshold: 48,
        showThreshold: 4,
        velocityThreshold: 0.1,
        debounceMs: 150,
      }}
      callbacks={{
        onVisibilityChange: (isVisible) => {
          console.log('Navigation visibility changed:', isVisible);
        },
        onScrollStateChange: (state) => {
          // Throttled logging
          if (Math.floor(state.timestamp / 1000) % 2 === 0) {
            console.log('Scroll state:', state);
          }
        },
        onVirtualKeyboardToggle: (isVisible, height) => {
          console.log('Virtual keyboard:', { isVisible, height });
        },
      }}
    >
      <DemoNavBar />
      <DemoContent />
      <CustomHookDemo />
      
      {/* Debug overlay */}
      <ScrollControllerDebugger
        enabled={debugEnabled}
        position="top-right"
      />
      
      {/* Debug controls */}
      <div className="fixed bottom-4 left-4 space-y-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setDebugEnabled(!debugEnabled)}
          className="text-xs bg-black/80 text-white border-white/20"
        >
          {debugEnabled ? 'Hide Debug' : 'Show Debug'}
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => setReducedMotion(!reducedMotion)}
          className="text-xs bg-black/80 text-white border-white/20"
        >
          {reducedMotion ? 'Enable Motion' : 'Reduce Motion'}
        </Button>
      </div>
    </ScrollControllerProvider>
  );
};

export default ScrollControllerDemo;