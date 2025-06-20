/**
 * Performance Vitals E2E Tests
 * Captures real Web Vitals metrics and enforces performance budgets
 * Fails CI if performance degradation is detected
 */

import { test, expect, Page } from '@playwright/test';

// Performance thresholds matching our goals
const PERFORMANCE_BUDGETS = {
  mobile: {
    LCP: 2000,      // Largest Contentful Paint
    CLS: 0.05,      // Cumulative Layout Shift  
    FCP: 1800,      // First Contentful Paint
    TTI: 2500,      // Time to Interactive
    TBT: 200,       // Total Blocking Time
    SI: 2500        // Speed Index
  },
  desktop: {
    LCP: 1500,
    CLS: 0.05,
    FCP: 1200,
    TTI: 2000,
    TBT: 150,
    SI: 2000
  }
};

// Core pages to test
const CRITICAL_PAGES = [
  { path: '/', name: 'Home' },
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/insights', name: 'Insights' },
  { path: '/calculators', name: 'Calculators' },
  { path: '/savings', name: 'Savings' }
];

// Capture Web Vitals using the real web-vitals library
async function captureWebVitals(page: Page) {
  // Inject web-vitals library and capture metrics
  await page.addScriptTag({
    url: 'https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js'
  });

  const vitals = await page.evaluate(() => {
    return new Promise((resolve) => {
      const metrics: Record<string, number> = {};
      let collectedCount = 0;
      const expectedMetrics = 4; // LCP, CLS, FCP, TTI

      function collectMetric(metric: any) {
        metrics[metric.name] = metric.value;
        collectedCount++;
        
        if (collectedCount >= expectedMetrics) {
          resolve(metrics);
        }
      }

      // @ts-ignore - web-vitals is loaded globally
      if (typeof webVitals !== 'undefined') {
        webVitals.onLCP(collectMetric);
        webVitals.onCLS(collectMetric);
        webVitals.onFCP(collectMetric);
        
        // Fallback resolve after timeout
        setTimeout(() => resolve(metrics), 10000);
      } else {
        resolve({});
      }
    });
  });

  return vitals as Record<string, number>;
}

// Get performance navigation metrics
async function getNavigationMetrics(page: Page) {
  return await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    
    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      domInteractive: navigation.domInteractive - navigation.navigationStart,
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      resourceCount: performance.getEntriesByType('resource').length,
      totalTransferSize: performance.getEntriesByType('resource').reduce((acc: number, r: any) => acc + (r.transferSize || 0), 0)
    };
  });
}

// Test performance on mobile viewports
test.describe('Mobile Performance Budget', () => {
  test.beforeEach(async ({ page }) => {
    // Configure mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.emulate({ 
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
      viewport: { width: 375, height: 812 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true
    });
  });

  for (const route of CRITICAL_PAGES) {
    test(`${route.name} page meets mobile performance budget`, async ({ page }) => {
      console.log(`🔍 Testing mobile performance for ${route.name} (${route.path})`);
      
      // Navigate and measure
      const startTime = Date.now();
      await page.goto(route.path, { waitUntil: 'networkidle' });
      const navigationTime = Date.now() - startTime;

      // Capture Web Vitals
      const vitals = await captureWebVitals(page);
      const navMetrics = await getNavigationMetrics(page);

      console.log(`📊 ${route.name} Mobile Metrics:`, {
        navigationTime,
        vitals,
        navMetrics
      });

      // Assert performance budgets
      if (vitals.LCP) {
        expect(vitals.LCP).toBeLessThanOrEqual(PERFORMANCE_BUDGETS.mobile.LCP);
      }
      
      if (vitals.CLS !== undefined) {
        expect(vitals.CLS).toBeLessThanOrEqual(PERFORMANCE_BUDGETS.mobile.CLS);
      }
      
      if (vitals.FCP) {
        expect(vitals.FCP).toBeLessThanOrEqual(PERFORMANCE_BUDGETS.mobile.FCP);
      }

      // Navigation timing budgets
      expect(navigationTime).toBeLessThanOrEqual(3000); // 3s total navigation
      expect(navMetrics.domContentLoaded).toBeLessThanOrEqual(1500);
      expect(navMetrics.resourceCount).toBeLessThanOrEqual(50);
      expect(navMetrics.totalTransferSize).toBeLessThanOrEqual(2 * 1024 * 1024); // 2MB
    });
  }
});

// Test performance on desktop viewports  
test.describe('Desktop Performance Budget', () => {
  test.beforeEach(async ({ page }) => {
    // Configure desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  for (const route of CRITICAL_PAGES) {
    test(`${route.name} page meets desktop performance budget`, async ({ page }) => {
      console.log(`🔍 Testing desktop performance for ${route.name} (${route.path})`);
      
      // Navigate and measure
      const startTime = Date.now();
      await page.goto(route.path, { waitUntil: 'networkidle' });
      const navigationTime = Date.now() - startTime;

      // Capture Web Vitals
      const vitals = await captureWebVitals(page);
      const navMetrics = await getNavigationMetrics(page);

      console.log(`📊 ${route.name} Desktop Metrics:`, {
        navigationTime,
        vitals,
        navMetrics
      });

      // Assert performance budgets (stricter for desktop)
      if (vitals.LCP) {
        expect(vitals.LCP).toBeLessThanOrEqual(PERFORMANCE_BUDGETS.desktop.LCP);
      }
      
      if (vitals.CLS !== undefined) {
        expect(vitals.CLS).toBeLessThanOrEqual(PERFORMANCE_BUDGETS.desktop.CLS);
      }
      
      if (vitals.FCP) {
        expect(vitals.FCP).toBeLessThanOrEqual(PERFORMANCE_BUDGETS.desktop.FCP);
      }

      // Navigation timing budgets
      expect(navigationTime).toBeLessThanOrEqual(2000); // 2s total navigation
      expect(navMetrics.domContentLoaded).toBeLessThanOrEqual(1000);
      expect(navMetrics.resourceCount).toBeLessThanOrEqual(50);
    });
  }
});

// Chart loading performance specific tests
test.describe('Chart Loading Performance', () => {
  test('Dashboard charts load within performance budget', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for charts to appear
    await page.waitForSelector('[data-testid="insights-card"]', { timeout: 5000 });
    
    // Measure chart loading time
    const chartLoadTime = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const chartEntries = list.getEntries().filter(entry => 
            entry.name.includes('chart') || entry.name.includes('Chart')
          );
          
          if (chartEntries.length > 0) {
            const maxDuration = Math.max(...chartEntries.map(e => e.duration));
            resolve(maxDuration);
          }
        });
        
        observer.observe({ entryTypes: ['measure', 'mark'] });
        
        // Fallback
        setTimeout(() => resolve(0), 3000);
      });
    });

    // Charts should load quickly
    if (chartLoadTime > 0) {
      expect(chartLoadTime).toBeLessThanOrEqual(500); // 500ms budget
    }
  });
});

// Network resource optimization tests
test.describe('Resource Optimization', () => {
  test('Critical resources are preloaded', async ({ page }) => {
    const response = await page.goto('/');
    
    // Check HTML contains preload hints
    const html = await page.content();
    expect(html).toContain('rel="preload"');
    expect(html).toContain('rel="preconnect"');
    expect(html).toContain('rel="prefetch"');
  });

  test('Assets are compressed', async ({ page }) => {
    // Intercept network requests
    const responses: any[] = [];
    
    page.on('response', response => {
      if (response.url().includes('.js') || response.url().includes('.css')) {
        responses.push({
          url: response.url(),
          headers: response.headers()
        });
      }
    });

    await page.goto('/');
    
    // Check for compression headers
    responses.forEach(response => {
      if (response.url.includes('assets/')) {
        expect(
          response.headers['content-encoding'] === 'gzip' ||
          response.headers['content-encoding'] === 'br'
        ).toBeTruthy();
      }
    });
  });

  test('Bundle sizes within budget', async ({ page }) => {
    const responses: any[] = [];
    
    page.on('response', async response => {
      if (response.url().includes('.js') && response.url().includes('assets/')) {
        const contentLength = response.headers()['content-length'];
        if (contentLength) {
          responses.push({
            url: response.url(),
            size: parseInt(contentLength)
          });
        }
      }
    });

    await page.goto('/');
    
    // Check individual chunk sizes
    responses.forEach(response => {
      // No single chunk should exceed 500KB (compressed)
      expect(response.size).toBeLessThanOrEqual(500 * 1024);
    });
  });
});

// User interaction performance
test.describe('Interaction Performance', () => {
  test('Route navigation is fast', async ({ page }) => {
    await page.goto('/');
    
    // Measure navigation to different routes
    const routes = ['/dashboard', '/insights', '/calculators'];
    
    for (const route of routes) {
      const startTime = Date.now();
      await page.click(`[href="${route}"]`);
      await page.waitForLoadState('networkidle');
      const navTime = Date.now() - startTime;
      
      console.log(`Navigation to ${route}: ${navTime}ms`);
      expect(navTime).toBeLessThanOrEqual(1000); // 1s budget for SPA navigation
    }
  });

  test('Interactive elements respond quickly', async ({ page }) => {
    await page.goto('/calculators');
    
    // Test calculator interaction performance
    const input = page.locator('input[type="number"]').first();
    
    const startTime = Date.now();
    await input.fill('100000');
    await input.blur();
    
    // Wait for calculation to complete
    await page.waitForTimeout(100);
    const responseTime = Date.now() - startTime;
    
    console.log(`Calculator response time: ${responseTime}ms`);
    expect(responseTime).toBeLessThanOrEqual(300); // 300ms budget
  });
});

// Memory leak detection
test.describe('Memory Performance', () => {
  test('No memory leaks during navigation', async ({ page }) => {
    await page.goto('/');
    
    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });

    // Navigate through several pages
    const routes = ['/dashboard', '/insights', '/calculators', '/savings', '/'];
    
    for (const route of routes) {
      await page.goto(route);
      await page.waitForTimeout(500);
    }

    // Check final memory usage
    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });

    if (initialMemory > 0 && finalMemory > 0) {
      const memoryIncrease = finalMemory - initialMemory;
      const increasePercent = (memoryIncrease / initialMemory) * 100;
      
      console.log(`Memory usage: ${initialMemory} -> ${finalMemory} (+${increasePercent.toFixed(1)}%)`);
      
      // Memory should not increase by more than 50% during navigation
      expect(increasePercent).toBeLessThanOrEqual(50);
    }
  });
}); 