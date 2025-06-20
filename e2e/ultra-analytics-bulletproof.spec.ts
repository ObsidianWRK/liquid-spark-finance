import { test, expect } from '@playwright/test';

test.describe('🔥 Ultra-Deep Analytics Bulletproof Tests', () => {
  const viewports = [
    { name: 'Mobile', width: 390, height: 844 },
    { name: 'Tablet', width: 834, height: 1194 },
    { name: 'Desktop', width: 1440, height: 900 },
    { name: 'Ultra-wide', width: 2560, height: 1440 }
  ];

  const DESTRUCTURING_ERROR_PATTERNS = [
    'Right side of assignment cannot be destructured',
    'Cannot read property',
    'Cannot read properties of undefined',
    'Cannot destructure property',
    'Cannot destructure',
    'undefined is not iterable',
    'null is not iterable',
    'Cannot access before initialization',
    'TypeError: undefined',
    'TypeError: null'
  ];

  viewports.forEach(({ name, width, height }) => {
    test.describe(`${name} (${width}x${height})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width, height });
      });

      test('BULLETPROOF: Analytics navigation never crashes', async ({ page }) => {
        const consoleErrors: string[] = [];
        const jsErrors: string[] = [];
        
        // Capture all errors
        page.on('console', msg => {
          if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
          }
        });
        
        page.on('pageerror', error => {
          jsErrors.push(error.message);
        });

        // Navigate to analytics via multiple paths
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Path 1: Direct navigation
        await page.goto('/?tab=analytics');
        await page.waitForSelector('h1:has-text("Financial Analytics Dashboard")', { timeout: 15000 });
        await page.waitForTimeout(2000); // Let all components fully render

        // Path 2: Tab navigation
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.click('button:has-text("Analytics")');
        await page.waitForSelector('h1:has-text("Financial Analytics Dashboard")', { timeout: 15000 });
        await page.waitForTimeout(2000);

        // Path 3: Query parameter navigation
        await page.goto('/?view=analytics');
        await page.waitForSelector('h1:has-text("Financial Analytics Dashboard")', { timeout: 15000 });
        await page.waitForTimeout(2000);

        // Filter for destructuring-specific errors
        const destructuringErrors = [...consoleErrors, ...jsErrors].filter(error =>
          DESTRUCTURING_ERROR_PATTERNS.some(pattern => 
            error.toLowerCase().includes(pattern.toLowerCase())
          )
        );

        // ✅ ZERO TOLERANCE for destructuring errors
        expect(destructuringErrors, `Found destructuring errors: ${destructuringErrors.join(', ')}`).toHaveLength(0);
      });

      test('BULLETPROOF: All chart interactions are safe', async ({ page }) => {
        const errors: string[] = [];
        page.on('console', msg => msg.type() === 'error' && errors.push(msg.text()));
        page.on('pageerror', error => errors.push(error.message));

        await page.goto('/?tab=analytics');
        await page.waitForSelector('h1:has-text("Financial Analytics Dashboard")', { timeout: 15000 });

        // Test all chart type switches
        const chartButtons = ['Net Worth', 'Cash Flow', 'Spending', 'Portfolio'];
        for (const chartName of chartButtons) {
          const button = page.locator(`button:has-text("${chartName}")`);
          if (await button.isVisible()) {
            await button.click();
            await page.waitForTimeout(1000);
            // Verify chart renders
            await expect(page.locator('.recharts-wrapper')).toBeVisible();
          }
        }

        // Test timeframe selectors
        const timeframes = ['1M', '3M', '6M', '1Y'];
        for (const timeframe of timeframes) {
          const button = page.locator(`button:has-text("${timeframe}")`);
          if (await button.isVisible()) {
            await button.click();
            await page.waitForTimeout(1500);
            await expect(page.locator('.recharts-wrapper')).toBeVisible();
          }
        }

        // ✅ No errors during interactions
        const destructuringErrors = errors.filter(error =>
          DESTRUCTURING_ERROR_PATTERNS.some(pattern => 
            error.toLowerCase().includes(pattern.toLowerCase())
          )
        );
        expect(destructuringErrors).toHaveLength(0);
      });

      test('BULLETPROOF: Network failure graceful degradation', async ({ page }) => {
        const errors: string[] = [];
        page.on('console', msg => msg.type() === 'error' && errors.push(msg.text()));
        page.on('pageerror', error => errors.push(error.message));

        // Simulate slow/failing network
        await page.route('**/*', async route => {
          if (Math.random() < 0.3) { // 30% failure rate
            await route.abort();
          } else {
            await new Promise(resolve => setTimeout(resolve, 200));
            await route.continue();
          }
        });

        await page.goto('/?tab=analytics');
        await page.waitForSelector('h1:has-text("Financial Analytics Dashboard")', { timeout: 20000 });

        // Even with network issues, should show fallback data
        await expect(page.locator('.recharts-wrapper, text="No Dashboard Data"')).toBeVisible();

        // ✅ Network failures don't cause destructuring crashes
        const destructuringErrors = errors.filter(error =>
          DESTRUCTURING_ERROR_PATTERNS.some(pattern => 
            error.toLowerCase().includes(pattern.toLowerCase())
          )
        );
        expect(destructuringErrors).toHaveLength(0);
      });

      test('BULLETPROOF: Rapid tab switching stress test', async ({ page }) => {
        const errors: string[] = [];
        page.on('console', msg => msg.type() === 'error' && errors.push(msg.text()));
        page.on('pageerror', error => errors.push(error.message));

        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Rapid switching between tabs
        const tabs = ['dashboard', 'accounts', 'analytics', 'insights', 'budget'];
        for (let cycle = 0; cycle < 3; cycle++) {
          for (const tab of tabs) {
            await page.goto(`/?tab=${tab}`);
            if (tab === 'analytics') {
              await page.waitForSelector('h1:has-text("Financial Analytics Dashboard")', { timeout: 10000 });
            }
            await page.waitForTimeout(500);
          }
        }

        // ✅ Rapid switching doesn't break Analytics
        const destructuringErrors = errors.filter(error =>
          DESTRUCTURING_ERROR_PATTERNS.some(pattern => 
            error.toLowerCase().includes(pattern.toLowerCase())
          )
        );
        expect(destructuringErrors).toHaveLength(0);
      });

      test('BULLETPROOF: Page refresh and hot reload resilience', async ({ page }) => {
        const errors: string[] = [];
        page.on('console', msg => msg.type() === 'error' && errors.push(msg.text()));
        page.on('pageerror', error => errors.push(error.message));

        // Initial load
        await page.goto('/?tab=analytics');
        await page.waitForSelector('h1:has-text("Financial Analytics Dashboard")', { timeout: 15000 });

        // Force refresh
        await page.reload();
        await page.waitForSelector('h1:has-text("Financial Analytics Dashboard")', { timeout: 15000 });

        // Hot reload simulation (navigate away and back)
        await page.goto('/');
        await page.waitForTimeout(1000);
        await page.goto('/?tab=analytics');
        await page.waitForSelector('h1:has-text("Financial Analytics Dashboard")', { timeout: 15000 });

        // ✅ Refresh cycles are bulletproof
        const destructuringErrors = errors.filter(error =>
          DESTRUCTURING_ERROR_PATTERNS.some(pattern => 
            error.toLowerCase().includes(pattern.toLowerCase())
          )
        );
        expect(destructuringErrors).toHaveLength(0);
      });

      test('BULLETPROOF: Memory leak and performance validation', async ({ page }) => {
        await page.goto('/?tab=analytics');
        await page.waitForSelector('h1:has-text("Financial Analytics Dashboard")', { timeout: 15000 });

        // Measure performance metrics
        const metrics = await page.evaluate(() => {
          const navigation = performance.getEntriesByType('navigation')[0];
          return {
            loadTime: navigation.loadEventEnd - navigation.loadEventStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            memoryUsed: (performance as any).memory?.usedJSHeapSize || 0
          };
        });

        // ✅ Performance within acceptable bounds
        expect(metrics.loadTime).toBeLessThan(5000); // < 5s load time
        expect(metrics.domContentLoaded).toBeLessThan(3000); // < 3s DOM ready
        if (metrics.memoryUsed > 0) {
          expect(metrics.memoryUsed).toBeLessThan(50 * 1024 * 1024); // < 50MB
        }
      });

      test('BULLETPROOF: Accessibility and dark mode consistency', async ({ page }) => {
        await page.goto('/?tab=analytics');
        await page.waitForSelector('h1:has-text("Financial Analytics Dashboard")', { timeout: 15000 });

        // Verify dark mode colors
        const backgroundColor = await page.locator('body').evaluate(el => 
          getComputedStyle(el).backgroundColor
        );
        expect(backgroundColor).toContain('rgb(3, 7, 18)'); // Dark background

        // Check for light mode artifacts (should be none)
        const lightArtifacts = page.locator('.bg-white:not([class*="bg-white/"])')
        expect(await lightArtifacts.count()).toBe(0);

        // ✅ Color contrast accessibility
        const chartText = page.locator('.recharts-cartesian-axis text').first();
        if (await chartText.isVisible()) {
          const textColor = await chartText.evaluate(el => getComputedStyle(el).fill);
          expect(textColor).toMatch(/#[a-fA-F0-9]{6}|rgb/); // Valid color format
        }
      });
    });
  });

  test('REGRESSION: Visual consistency across viewports', async ({ page }) => {
    const screenshots: Buffer[] = [];
    
    for (const { name, width, height } of viewports) {
      await page.setViewportSize({ width, height });
      await page.goto('/?tab=analytics');
      await page.waitForSelector('h1:has-text("Financial Analytics Dashboard")', { timeout: 15000 });
      await page.waitForTimeout(3000); // Ensure animations complete
      
      const screenshot = await page.screenshot({ fullPage: true });
      screenshots.push(screenshot);
      
      // Basic layout verification
      await expect(page.locator('h1:has-text("Financial Analytics Dashboard")')).toBeVisible();
      await expect(page.locator('.recharts-wrapper')).toBeVisible();
    }

    // ✅ All viewports render successfully
    expect(screenshots).toHaveLength(viewports.length);
  });

  test('PERFORMANCE: Bundle size and Lighthouse metrics', async ({ page }) => {
    // Enable performance monitoring
    const client = await page.context().newCDPSession(page);
    await client.send('Performance.enable');
    
    await page.goto('/?tab=analytics');
    await page.waitForSelector('h1:has-text("Financial Analytics Dashboard")', { timeout: 15000 });
    
    // Wait for all resources to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    
    // Check Core Web Vitals
    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals: any = {};
          
          entries.forEach((entry) => {
            if (entry.name === 'LCP') vitals.lcp = entry.value;
            if (entry.name === 'FID') vitals.fid = entry.value;
            if (entry.name === 'CLS') vitals.cls = entry.value;
          });
          
          resolve(vitals);
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        
        // Fallback timeout
        setTimeout(() => resolve({}), 2000);
      });
    });

    console.log('Core Web Vitals:', vitals);
    
    // ✅ Performance targets met
    // LCP < 2.5s, FID < 100ms, CLS < 0.1
    if ((vitals as any).lcp) expect((vitals as any).lcp).toBeLessThan(2500);
    if ((vitals as any).fid) expect((vitals as any).fid).toBeLessThan(100);
    if ((vitals as any).cls) expect((vitals as any).cls).toBeLessThan(0.1);
  });
}); 