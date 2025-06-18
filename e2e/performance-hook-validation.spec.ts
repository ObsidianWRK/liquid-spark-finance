import { test, expect, Page } from '@playwright/test';

test.describe('Performance and Stress Testing for Hook Violations', () => {
  let performanceErrors: string[] = [];
  let memoryWarnings: string[] = [];

  test.beforeEach(async ({ page }) => {
    performanceErrors = [];
    memoryWarnings = [];

    // Monitor console for performance-related hook issues
    page.on('console', (msg) => {
      const text = msg.text();
      if (msg.type() === 'error' && (
        text.includes('Hook') || 
        text.includes('rendered more hooks') ||
        text.includes('memory leak') ||
        text.includes('performance')
      )) {
        performanceErrors.push(text);
      }
      
      if (msg.type() === 'warning' && (
        text.includes('memory') ||
        text.includes('performance') ||
        text.includes('Hook')
      )) {
        memoryWarnings.push(text);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should handle high-frequency navigation without hook violations', async ({ page }) => {
    const startTime = Date.now();
    const initialErrorCount = performanceErrors.length;
    
    // High-frequency navigation test
    console.log('Starting high-frequency navigation test...');
    
    const tabs = ['dashboard', 'accounts', 'transactions', 'insights', 'reports'];
    
    // Perform 100 rapid navigations
    for (let i = 0; i < 100; i++) {
      const tab = tabs[i % tabs.length];
      await page.goto(`/?tab=${tab}`);
      // Minimal wait to stress test
      await page.waitForTimeout(10);
      
      if (i % 20 === 0) {
        console.log(`Navigation iteration: ${i + 1}/100`);
      }
    }
    
    // Final settlement
    await page.waitForTimeout(2000);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`High-frequency navigation completed in ${duration}ms`);
    
    // Check for performance-related hook errors
    const newErrors = performanceErrors.slice(initialErrorCount);
    expect(newErrors, `Performance hook violations: ${JSON.stringify(newErrors)}`).toHaveLength(0);
    
    // Ensure reasonable performance (should complete in under 30 seconds)
    expect(duration).toBeLessThan(30000);
  });

  test('should handle memory stress during navigation without hook violations', async ({ page }) => {
    const initialErrorCount = performanceErrors.length;
    
    // Create memory pressure scenario
    console.log('Starting memory stress test...');
    
    // Inject memory pressure
    await page.evaluate(() => {
      // Create some memory pressure
      const memoryArray: number[][] = [];
      for (let i = 0; i < 1000; i++) {
        memoryArray.push(new Array(1000).fill(Math.random()));
      }
      (window as unknown as { memoryPressure?: number[][] }).memoryPressure = memoryArray;
    });
    
    const tabs = ['dashboard', 'accounts', 'transactions', 'insights'];
    
    // Navigate under memory pressure
    for (let cycle = 0; cycle < 10; cycle++) {
      console.log(`Memory stress cycle: ${cycle + 1}/10`);
      
      for (const tab of tabs) {
        await page.goto(`/?tab=${tab}`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(100);
        
        // Add more memory pressure each cycle
        await page.evaluate((cycleNum) => {
          const additionalMemory = new Array(500).fill(`cycle-${cycleNum}-${Math.random()}`);
          const windowWithMemory = window as unknown as { memoryPressure?: (number[][] | string[])[] };
          windowWithMemory.memoryPressure?.push(additionalMemory);
        }, cycle);
      }
    }
    
    // Clean up memory
    await page.evaluate(() => {
      delete (window as unknown as { memoryPressure?: unknown }).memoryPressure;
    });
    
    await page.waitForTimeout(1000);
    
    // Check for hook errors under memory pressure
    const newErrors = performanceErrors.slice(initialErrorCount);
    expect(newErrors, `Hook violations under memory pressure: ${JSON.stringify(newErrors)}`).toHaveLength(0);
  });

  test('should handle CPU stress during navigation without hook violations', async ({ page }) => {
    const initialErrorCount = performanceErrors.length;
    
    console.log('Starting CPU stress test...');
    
    // Create CPU stress in background
    await page.evaluate(() => {
      let cpuStress = true;
      const stressCPU = () => {
        if (cpuStress) {
          // Perform some CPU-intensive calculations
          let result = 0;
          for (let i = 0; i < 100000; i++) {
            result += Math.sin(i) * Math.cos(i);
          }
          setTimeout(stressCPU, 1);
        }
      };
      stressCPU();
      
      // Stop after 30 seconds
      setTimeout(() => {
        cpuStress = false;
      }, 30000);
    });
    
    const tabs = ['dashboard', 'transactions', 'insights', 'reports'];
    
    // Navigate under CPU stress
    for (let i = 0; i < 20; i++) {
      const tab = tabs[i % tabs.length];
      console.log(`CPU stress navigation ${i + 1}/20: ${tab}`);
      
      await page.goto(`/?tab=${tab}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(200);
    }
    
    await page.waitForTimeout(2000);
    
    // Check for hook errors under CPU stress
    const newErrors = performanceErrors.slice(initialErrorCount);
    expect(newErrors, `Hook violations under CPU stress: ${JSON.stringify(newErrors)}`).toHaveLength(0);
  });

  test('should handle network throttling during navigation without hook violations', async ({ page }) => {
    const initialErrorCount = performanceErrors.length;
    
    console.log('Starting network throttling test...');
    
    // Simulate slow network
    const client = await page.context().newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 50 * 1024, // 50 KB/s
      uploadThroughput: 20 * 1024,   // 20 KB/s
      latency: 500 // 500ms latency
    });
    
    const tabs = ['dashboard', 'accounts', 'transactions', 'insights'];
    
    // Navigate under network throttling
    for (const tab of tabs) {
      console.log(`Throttled navigation to: ${tab}`);
      
      await page.goto(`/?tab=${tab}`);
      await page.waitForLoadState('networkidle', { timeout: 30000 });
      await page.waitForTimeout(500);
    }
    
    // Restore normal network
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: -1,
      uploadThroughput: -1,
      latency: 0
    });
    
    await page.waitForTimeout(1000);
    
    // Check for hook errors under network stress
    const newErrors = performanceErrors.slice(initialErrorCount);
    expect(newErrors, `Hook violations under network throttling: ${JSON.stringify(newErrors)}`).toHaveLength(0);
  });

  test('should handle multiple concurrent user interactions without hook violations', async ({ page }) => {
    const initialErrorCount = performanceErrors.length;
    
    console.log('Starting concurrent interactions test...');
    
    await page.goto('/?tab=dashboard');
    await page.waitForLoadState('networkidle');
    
    // Simulate multiple concurrent user interactions
    const interactions = [
      // Mouse movements
      page.mouse.move(100, 100),
      page.mouse.move(200, 200),
      page.mouse.move(300, 300),
      
      // Navigation attempts
      page.goto('/?tab=transactions'),
      page.goBack(),
      page.goForward(),
      
      // Keyboard events
      page.keyboard.press('Tab'),
      page.keyboard.press('Enter'),
      page.keyboard.press('Escape'),
      
      // Touch events (for mobile simulation)
      page.touchscreen.tap(150, 150),
      
      // Viewport changes
      page.setViewportSize({ width: 800, height: 600 }),
      page.setViewportSize({ width: 1200, height: 800 })
    ];
    
    // Execute all interactions concurrently
    await Promise.allSettled(interactions);
    
    // Wait for everything to settle
    await page.waitForTimeout(2000);
    
    // Navigate through tabs after concurrent interactions
    const tabs = ['dashboard', 'accounts', 'transactions'];
    for (const tab of tabs) {
      await page.goto(`/?tab=${tab}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(300);
    }
    
    // Check for hook errors after concurrent interactions
    const newErrors = performanceErrors.slice(initialErrorCount);
    expect(newErrors, `Hook violations during concurrent interactions: ${JSON.stringify(newErrors)}`).toHaveLength(0);
  });

  test('should handle page lifecycle events without hook violations', async ({ page }) => {
    const initialErrorCount = performanceErrors.length;
    
    console.log('Starting page lifecycle test...');
    
    // Test various page lifecycle events
    await page.goto('/?tab=dashboard');
    await page.waitForLoadState('networkidle');
    
    // Simulate page visibility changes
    await page.evaluate(() => {
      // Simulate page becoming hidden
      Object.defineProperty(document, 'hidden', {
        writable: true,
        value: true
      });
      Object.defineProperty(document, 'visibilityState', {
        writable: true,
        value: 'hidden'
      });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    
    await page.waitForTimeout(500);
    
    // Navigate while "hidden"
    await page.goto('/?tab=transactions');
    await page.waitForTimeout(300);
    
    // Simulate page becoming visible again
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', {
        writable: true,
        value: false
      });
      Object.defineProperty(document, 'visibilityState', {
        writable: true,
        value: 'visible'
      });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    
    await page.waitForTimeout(500);
    
    // Test focus/blur events
    await page.evaluate(() => {
      window.dispatchEvent(new Event('blur'));
    });
    
    await page.goto('/?tab=insights');
    await page.waitForTimeout(300);
    
    await page.evaluate(() => {
      window.dispatchEvent(new Event('focus'));
    });
    
    await page.waitForTimeout(1000);
    
    // Check for hook errors during lifecycle events
    const newErrors = performanceErrors.slice(initialErrorCount);
    expect(newErrors, `Hook violations during lifecycle events: ${JSON.stringify(newErrors)}`).toHaveLength(0);
  });

  test('should handle error conditions without hook violations', async ({ page }) => {
    const initialErrorCount = performanceErrors.length;
    
    console.log('Starting error conditions test...');
    
    // Simulate various error conditions
    await page.goto('/?tab=dashboard');
    await page.waitForLoadState('networkidle');
    
    // Simulate JavaScript errors
    await page.evaluate(() => {
      // Inject a non-hook-related error
      setTimeout(() => {
        try {
          throw new Error('Simulated non-React error');
        } catch (e) {
          console.error('Caught simulated error:', e);
        }
      }, 100);
    });
    
    await page.waitForTimeout(200);
    
    // Navigate after error
    await page.goto('/?tab=transactions');
    await page.waitForLoadState('networkidle');
    
    // Simulate network error
    await page.route('**/*', route => {
      if (Math.random() < 0.1) { // 10% chance of network error
        route.abort();
      } else {
        route.continue();
      }
    });
    
    // Navigate with potential network errors
    await page.goto('/?tab=insights');
    await page.waitForLoadState('networkidle');
    
    // Clear route handler
    await page.unroute('**/*');
    
    await page.waitForTimeout(1000);
    
    // Check for hook errors (not general errors)
    const newErrors = performanceErrors.slice(initialErrorCount);
    const hookSpecificErrors = newErrors.filter(error => 
      error.includes('rendered more hooks') || 
      error.includes('Hook call') ||
      error.includes('Invalid hook call')
    );
    
    expect(hookSpecificErrors, `Hook violations during error conditions: ${JSON.stringify(hookSpecificErrors)}`).toHaveLength(0);
  });

  test('should handle resource cleanup during navigation without hook violations', async ({ page }) => {
    const initialErrorCount = performanceErrors.length;
    
    console.log('Starting resource cleanup test...');
    
    // Track resource usage
    await page.evaluate(() => {
      (window as any).resourceTracker = {
        intervals: [],
        timeouts: [],
        listeners: []
      };
      
      // Mock some resource creation
      const originalSetInterval = window.setInterval;
      const originalSetTimeout = window.setTimeout;
      const originalAddEventListener = window.addEventListener;
      
      window.setInterval = function(fn, delay) {
        const id = originalSetInterval(fn, delay);
        (window as any).resourceTracker.intervals.push(id);
        return id;
      };
      
      window.setTimeout = function(fn, delay) {
        const id = originalSetTimeout(fn, delay);
        (window as any).resourceTracker.timeouts.push(id);
        return id;
      };
      
      window.addEventListener = function(type, listener, options) {
        originalAddEventListener.call(this, type, listener, options);
        (window as any).resourceTracker.listeners.push({ type, listener });
      };
    });
    
    const tabs = ['dashboard', 'accounts', 'transactions', 'insights'];
    
    // Navigate and create resources
    for (const tab of tabs) {
      await page.goto(`/?tab=${tab}`);
      await page.waitForLoadState('networkidle');
      
      // Create some mock resources
      await page.evaluate(() => {
        // Create interval
        setInterval(() => {}, 1000);
        
        // Create timeout
        setTimeout(() => {}, 5000);
        
        // Add event listener
        addEventListener('resize', () => {});
      });
      
      await page.waitForTimeout(300);
    }
    
    // Check resource cleanup
    const resourceCount = await page.evaluate(() => {
      const tracker = (window as any).resourceTracker;
      return {
        intervals: tracker.intervals.length,
        timeouts: tracker.timeouts.length,
        listeners: tracker.listeners.length
      };
    });
    
    console.log('Resource count:', resourceCount);
    
    // Navigate one more time to trigger cleanup
    await page.goto('/?tab=dashboard');
    await page.waitForTimeout(1000);
    
    // Check for hook errors related to cleanup
    const newErrors = performanceErrors.slice(initialErrorCount);
    expect(newErrors, `Hook violations during resource cleanup: ${JSON.stringify(newErrors)}`).toHaveLength(0);
  });

  test('should measure and validate performance metrics', async ({ page }) => {
    console.log('Starting performance metrics validation...');
    
    const navigationTimes: number[] = [];
    const tabs = ['dashboard', 'accounts', 'transactions', 'insights'];
    
    for (const tab of tabs) {
      const startTime = Date.now();
      
      await page.goto(`/?tab=${tab}`);
      await page.waitForLoadState('networkidle');
      
      const endTime = Date.now();
      const navigationTime = endTime - startTime;
      navigationTimes.push(navigationTime);
      
      console.log(`Navigation to ${tab}: ${navigationTime}ms`);
    }
    
    // Calculate performance metrics
    const avgNavigationTime = navigationTimes.reduce((a, b) => a + b, 0) / navigationTimes.length;
    const maxNavigationTime = Math.max(...navigationTimes);
    
    console.log(`Average navigation time: ${avgNavigationTime}ms`);
    console.log(`Max navigation time: ${maxNavigationTime}ms`);
    
    // Performance assertions
    expect(avgNavigationTime, 'Average navigation time should be reasonable').toBeLessThan(3000);
    expect(maxNavigationTime, 'No single navigation should take too long').toBeLessThan(5000);
    
    // Ensure no hook-related performance issues
    expect(performanceErrors.filter(e => e.includes('Hook'))).toHaveLength(0);
  });
});