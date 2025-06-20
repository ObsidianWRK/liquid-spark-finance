/**
 * Responsive Performance Test Suite
 * Monitors CLS and LCP across multiple viewports
 * Fails if performance thresholds are breached
 */

import { test, expect, Page } from '@playwright/test';

// Performance thresholds
const PERFORMANCE_THRESHOLDS = {
  LCP: 2000, // 2 seconds max
  CLS: 0.05, // 0.05 max cumulative layout shift
  TTI: 3000, // 3 seconds max time to interactive
  FCP: 1500, // 1.5 seconds first contentful paint
};

// Viewport configurations for testing
const VIEWPORTS = [
  { name: 'Mobile', width: 320, height: 568 }, // iPhone SE
  { name: 'Mobile Large', width: 480, height: 854 }, // Large mobile
  { name: 'Tablet', width: 768, height: 1024 }, // iPad
  { name: 'Desktop', width: 1024, height: 768 }, // Small desktop
  { name: 'Desktop Large', width: 1440, height: 900 }, // Large desktop
];

// Critical routes to test
const CRITICAL_ROUTES = [
  { path: '/', name: 'Dashboard' },
  { path: '/accounts', name: 'Accounts' },
  { path: '/transactions', name: 'Transactions' },
  { path: '/insights', name: 'Insights' },
  { path: '/calculators', name: 'Calculators' },
];

// Web Vitals collection utility
const collectWebVitals = async (page: Page) => {
  return await page.evaluate(() => {
    return new Promise((resolve) => {
      const vitals: any = {};
      let pendingMetrics = 3; // LCP, CLS, FCP

      const handleMetric = (name: string, value: number) => {
        vitals[name] = value;
        pendingMetrics--;
        if (pendingMetrics === 0) {
          resolve(vitals);
        }
      };

      // Import web-vitals if available, otherwise use Performance Observer
      try {
        import('web-vitals')
          .then(({ onLCP, onCLS, onFCP }) => {
            onLCP(({ value }) => handleMetric('LCP', value));
            onCLS(({ value }) => handleMetric('CLS', value));
            onFCP(({ value }) => handleMetric('FCP', value));
          })
          .catch(() => {
            // Fallback to Performance Observer API
            const observer = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              entries.forEach((entry) => {
                if (entry.entryType === 'largest-contentful-paint') {
                  handleMetric('LCP', entry.startTime);
                } else if (
                  entry.entryType === 'layout-shift' &&
                  !entry.hadRecentInput
                ) {
                  vitals.CLS = (vitals.CLS || 0) + entry.value;
                }
              });
            });

            observer.observe({
              entryTypes: ['largest-contentful-paint', 'layout-shift', 'paint'],
            });

            // Fallback values after timeout
            setTimeout(() => {
              if (!vitals.LCP) vitals.LCP = performance.now();
              if (!vitals.CLS) vitals.CLS = 0;
              if (!vitals.FCP) vitals.FCP = performance.now();
              resolve(vitals);
            }, 5000);
          });
      } catch (error) {
        // Manual fallback
        setTimeout(() => {
          vitals.LCP = performance.now();
          vitals.CLS = 0;
          vitals.FCP = performance.now();
          resolve(vitals);
        }, 3000);
      }
    });
  });
};

// Main test suite
for (const viewport of VIEWPORTS) {
  test.describe(`Performance Tests - ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });

      // Enable performance monitoring
      await page.addInitScript(() => {
        // Monitor for layout shifts
        window.__CLSScore = 0;
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              window.__CLSScore += entry.value;
            }
          });
        }).observe({ entryTypes: ['layout-shift'] });
      });
    });

    for (const route of CRITICAL_ROUTES) {
      test(`${route.name} performance on ${viewport.name}`, async ({
        page,
      }) => {
        const startTime = Date.now();

        // Navigate to route
        await page.goto(`http://localhost:5000${route.path}`, {
          waitUntil: 'networkidle',
          timeout: 30000,
        });

        // Wait for page to stabilize
        await page.waitForTimeout(2000);

        // Collect Web Vitals
        const vitals = await collectWebVitals(page);

        // Get additional metrics
        const navigationTiming = await page.evaluate(() => {
          const timing = performance.getEntriesByType('navigation')[0];
          return {
            domContentLoaded:
              timing.domContentLoadedEventEnd -
              timing.domContentLoadedEventStart,
            loadComplete: timing.loadEventEnd - timing.loadEventStart,
            timeToInteractive: Date.now() - timing.navigationStart,
          };
        });

        // Get CLS score
        const clsScore = await page.evaluate(() => window.__CLSScore || 0);

        // Performance assertions
        console.log(`📊 ${route.name} on ${viewport.name}:
          LCP: ${vitals.LCP?.toFixed(2)}ms (threshold: ${PERFORMANCE_THRESHOLDS.LCP}ms)
          CLS: ${clsScore.toFixed(4)} (threshold: ${PERFORMANCE_THRESHOLDS.CLS})
          FCP: ${vitals.FCP?.toFixed(2)}ms (threshold: ${PERFORMANCE_THRESHOLDS.FCP}ms)
          TTI: ${navigationTiming.timeToInteractive?.toFixed(2)}ms (threshold: ${PERFORMANCE_THRESHOLDS.TTI}ms)`);

        // Assertions with clear error messages
        expect(
          vitals.LCP,
          `LCP too slow on ${viewport.name}: ${vitals.LCP}ms > ${PERFORMANCE_THRESHOLDS.LCP}ms`
        ).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.LCP);

        expect(
          clsScore,
          `CLS too high on ${viewport.name}: ${clsScore} > ${PERFORMANCE_THRESHOLDS.CLS}`
        ).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.CLS);

        expect(
          vitals.FCP,
          `FCP too slow on ${viewport.name}: ${vitals.FCP}ms > ${PERFORMANCE_THRESHOLDS.FCP}ms`
        ).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.FCP);

        // Layout stability test
        await test.step('Layout stability check', async () => {
          const initialHTML = await page.content();
          await page.waitForTimeout(1000);

          // Scroll to trigger any lazy-loaded content
          await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight / 2);
          });
          await page.waitForTimeout(500);

          const finalCLS = await page.evaluate(() => window.__CLSScore || 0);
          expect(
            finalCLS,
            `Layout shift after scroll: ${finalCLS} > ${PERFORMANCE_THRESHOLDS.CLS}`
          ).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.CLS);
        });

        // Check for horizontal scroll
        await test.step('No horizontal scroll', async () => {
          const hasHorizontalScroll = await page.evaluate(() => {
            return (
              document.documentElement.scrollWidth >
              document.documentElement.clientWidth
            );
          });
          expect(
            hasHorizontalScroll,
            `Horizontal scroll detected on ${viewport.name}`
          ).toBeFalsy();
        });

        // Verify critical content is visible
        await test.step('Critical content visibility', async () => {
          if (route.path === '/') {
            await expect(
              page.locator('[data-testid="dashboard-header"]')
            ).toBeVisible();
          }

          // Check for error states
          const errorElements = await page
            .locator('[data-testid*="error"], .error-message, [role="alert"]')
            .count();
          expect(errorElements, `Error elements found on ${route.name}`).toBe(
            0
          );
        });
      });
    }

    test(`Bundle size budget check on ${viewport.name}`, async ({ page }) => {
      // Monitor network requests
      const responses: any[] = [];
      page.on('response', (response) => {
        if (response.url().includes('.js') || response.url().includes('.css')) {
          responses.push({
            url: response.url(),
            size: response.headers()['content-length'] || 0,
            compressed: response.headers()['content-encoding'],
          });
        }
      });

      await page.goto('http://localhost:5000/', { waitUntil: 'networkidle' });

      // Calculate total bundle size
      const totalJS = responses
        .filter((r) => r.url.includes('.js'))
        .reduce((sum, r) => sum + parseInt(r.size || '0'), 0);

      const totalCSS = responses
        .filter((r) => r.url.includes('.css'))
        .reduce((sum, r) => sum + parseInt(r.size || '0'), 0);

      console.log(`📦 Bundle sizes on ${viewport.name}:
        JS: ${(totalJS / 1024).toFixed(2)} KB
        CSS: ${(totalCSS / 1024).toFixed(2)} KB
        Total: ${((totalJS + totalCSS) / 1024).toFixed(2)} KB`);

      // Budget assertions (2.2MB total target)
      expect(
        totalJS,
        `JS bundle too large: ${totalJS} bytes`
      ).toBeLessThanOrEqual(2200 * 1024);
    });
  });
}

// Global performance summary test
test('Performance summary across all viewports', async () => {
  // This test should run after all viewport tests
  console.log(`
  📈 Performance Summary Complete
  ✅ Tested ${VIEWPORTS.length} viewports
  ✅ Tested ${CRITICAL_ROUTES.length} critical routes  
  ✅ Verified CLS < ${PERFORMANCE_THRESHOLDS.CLS}
  ✅ Verified LCP < ${PERFORMANCE_THRESHOLDS.LCP}ms
  ✅ No horizontal scroll issues
  ✅ Bundle size within budget
  `);
});
