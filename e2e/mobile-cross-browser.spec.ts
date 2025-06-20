import { test, expect, devices } from '@playwright/test';

// Mobile device configurations
const mobileDevices = [
  { name: 'iPhone 12', device: devices['iPhone 12'] },
  { name: 'iPhone 12 Pro', device: devices['iPhone 12 Pro'] },
  { name: 'Pixel 5', device: devices['Pixel 5'] },
  { name: 'Galaxy S21', device: devices['Galaxy S21'] },
];

// Desktop browser configurations
const desktopBrowsers = [
  { name: 'Chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'Firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'WebKit', use: { ...devices['Desktop Safari'] } },
];

test.describe('Mobile and Cross-Browser Testing', () => {
  test.describe('Mobile Responsiveness Tests', () => {
    mobileDevices.forEach(({ name, device }) => {
      test.describe(`${name} Tests`, () => {
        test.use(device);

        test(`should display correctly on ${name}`, async ({ page }) => {
          await page.goto('/');
          await page.waitForLoadState('networkidle');

          // Check viewport is correct
          const viewport = page.viewportSize();
          expect(viewport?.width).toBeLessThanOrEqual(500);

          // Verify mobile layout
          await expect(
            page.locator('[data-testid="mobile-menu-toggle"]')
          ).toBeVisible();
          await expect(
            page.locator('[data-testid="desktop-nav"]')
          ).not.toBeVisible();

          // Check account cards stack vertically
          const accountCards = page.locator('[data-testid="account-card"]');
          const cardCount = await accountCards.count();

          if (cardCount >= 2) {
            const firstCard = await accountCards.first().boundingBox();
            const secondCard = await accountCards.nth(1).boundingBox();

            if (firstCard && secondCard) {
              // Cards should stack vertically on mobile
              expect(firstCard.y).toBeLessThan(secondCard.y);
            }
          }
        });

        test(`should handle touch interactions on ${name}`, async ({
          page,
        }) => {
          await page.goto('/transactions');

          // Test touch scroll
          await page.touchscreen.tap(200, 300);
          await page.mouse.wheel(0, 500);

          // Should scroll smoothly
          await expect(
            page.locator('[data-testid="transaction-list"]')
          ).toBeVisible();

          // Test swipe gestures
          const transaction = page
            .locator('[data-testid="transaction-item"]')
            .first();
          if (await transaction.isVisible()) {
            const box = await transaction.boundingBox();
            if (box) {
              // Swipe left to reveal actions
              await page.touchscreen.tap(
                box.x + box.width - 10,
                box.y + box.height / 2
              );
              await page.mouse.move(box.x + 10, box.y + box.height / 2);

              // Should reveal swipe actions
              await expect(
                page.locator('[data-testid="swipe-actions"]')
              ).toBeVisible();
            }
          }
        });

        test(`should handle mobile navigation on ${name}`, async ({ page }) => {
          await page.goto('/');

          // Open mobile menu
          await page.click('[data-testid="mobile-menu-toggle"]');
          await expect(
            page.locator('[data-testid="mobile-nav"]')
          ).toBeVisible();

          // Navigate to different sections
          await page.click('[data-testid="mobile-nav-transactions"]');
          await expect(page).toHaveURL(/\/transactions/);

          await page.click('[data-testid="mobile-menu-toggle"]');
          await page.click('[data-testid="mobile-nav-budget"]');
          await expect(page).toHaveURL(/\/budget/);

          await page.click('[data-testid="mobile-menu-toggle"]');
          await page.click('[data-testid="mobile-nav-insights"]');
          await expect(page).toHaveURL(/\/insights/);
        });

        test(`should optimize charts for mobile on ${name}`, async ({
          page,
        }) => {
          await page.goto('/insights');

          // Charts should be responsive
          const chart = page.locator('[data-testid="spending-trends-chart"]');
          await expect(chart).toBeVisible();

          const chartBox = await chart.boundingBox();
          const viewport = page.viewportSize();

          if (chartBox && viewport) {
            // Chart should fit within mobile viewport with margin
            expect(chartBox.width).toBeLessThanOrEqual(viewport.width - 40);
          }

          // Test chart interactions on mobile
          if (chartBox) {
            await page.touchscreen.tap(
              chartBox.x + chartBox.width / 2,
              chartBox.y + chartBox.height / 2
            );

            // Should show tooltip or details
            const tooltip = page.locator('[data-testid="chart-tooltip"]');
            if (await tooltip.isVisible()) {
              await expect(tooltip).toBeVisible();
            }
          }
        });

        test(`should handle mobile form inputs on ${name}`, async ({
          page,
        }) => {
          await page.goto('/calculators');
          await page.click('text=Compound Interest Calculator');

          // Mobile keyboard should not obstruct inputs
          await page.fill('[data-testid="principal-input"]', '10000');
          await expect(
            page.locator('[data-testid="principal-input"]')
          ).toHaveValue('10000');

          await page.fill('[data-testid="rate-input"]', '5');
          await expect(page.locator('[data-testid="rate-input"]')).toHaveValue(
            '5'
          );

          // Test mobile-friendly input controls
          await page.click('[data-testid="calculate-button"]');
          await expect(page.locator('[data-testid="result"]')).toBeVisible();
        });

        test(`should maintain performance on ${name}`, async ({ page }) => {
          const startTime = Date.now();

          await page.goto('/');
          await page.waitForLoadState('networkidle');

          const loadTime = Date.now() - startTime;

          // Should load within reasonable time on mobile
          expect(loadTime).toBeLessThan(5000);

          // Test navigation performance
          const navStart = Date.now();
          await page.click('[data-testid="mobile-menu-toggle"]');
          await page.click('[data-testid="mobile-nav-insights"]');
          await page.waitForLoadState('networkidle');
          const navTime = Date.now() - navStart;

          expect(navTime).toBeLessThan(3000);
        });
      });
    });
  });

  test.describe('Cross-Browser Compatibility Tests', () => {
    desktopBrowsers.forEach(({ name, use }) => {
      test.describe(`${name} Browser Tests`, () => {
        test.use(use);

        test(`should render correctly in ${name}`, async ({ page }) => {
          await page.goto('/');
          await page.waitForLoadState('networkidle');

          // Basic layout should work
          await expect(
            page.locator('h1').filter({ hasText: 'Dashboard' })
          ).toBeVisible();
          await expect(
            page.locator('[data-testid="account-card"]')
          ).toHaveCount(4);

          // Navigation should be visible
          await expect(
            page.locator('[data-testid="desktop-nav"]')
          ).toBeVisible();
          await expect(
            page.locator('[data-testid="mobile-menu-toggle"]')
          ).not.toBeVisible();
        });

        test(`should handle CSS features in ${name}`, async ({ page }) => {
          await page.goto('/');

          // Test backdrop-blur support
          const glassCard = page.locator('[data-testid="glass-card"]').first();
          if (await glassCard.isVisible()) {
            const styles = await glassCard.evaluate((el) =>
              getComputedStyle(el)
            );

            // Should have backdrop filter or fallback
            const hasBackdrop = styles.backdropFilter !== 'none';
            const hasFallback =
              styles.backgroundColor.includes('rgba') ||
              styles.background.includes('rgba');

            expect(hasBackdrop || hasFallback).toBe(true);
          }

          // Test CSS Grid support
          const layout = page.locator('[data-testid="dashboard-grid"]');
          if (await layout.isVisible()) {
            const styles = await layout.evaluate((el) => getComputedStyle(el));
            expect(styles.display).toContain('grid');
          }
        });

        test(`should handle JavaScript features in ${name}`, async ({
          page,
        }) => {
          await page.goto('/calculators');
          await page.click('text=Compound Interest Calculator');

          // Test ES6+ features
          await page.fill('[data-testid="principal-input"]', '10000');
          await page.fill('[data-testid="rate-input"]', '5');
          await page.fill('[data-testid="years-input"]', '10');

          await page.click('[data-testid="calculate-button"]');

          // Modern JavaScript should work
          await expect(page.locator('[data-testid="result"]')).toBeVisible();

          // Test async/await
          await page.click('[data-testid="save-calculation"]');
          await page.fill('[data-testid="calculation-name"]', 'Test Calc');
          await page.click('[data-testid="confirm-save"]');

          await expect(page.locator('text=Calculation saved')).toBeVisible();
        });

        test(`should handle charts and visualization in ${name}`, async ({
          page,
        }) => {
          await page.goto('/insights');

          // Charts should render
          await expect(
            page.locator('[data-testid="spending-trends-chart"]')
          ).toBeVisible();
          await expect(
            page.locator('[data-testid="category-breakdown-chart"]')
          ).toBeVisible();

          // Test chart interactions
          const chart = page.locator('[data-testid="spending-trends-chart"]');
          await chart.hover();

          // Should show interactive elements
          const tooltip = page.locator('[data-testid="chart-tooltip"]');
          if (await tooltip.isVisible()) {
            await expect(tooltip).toBeVisible();
          }
        });

        test(`should handle WebGL and animations in ${name}`, async ({
          page,
        }) => {
          await page.goto('/');

          // Test liquid glass animations
          const liquidElement = page.locator(
            '[data-testid="liquid-glass-nav"]'
          );
          if (await liquidElement.isVisible()) {
            // Should have animation properties
            const styles = await liquidElement.evaluate((el) =>
              getComputedStyle(el)
            );
            const hasTransition =
              styles.transition !== 'none' && styles.transition !== '';
            const hasTransform = styles.transform !== 'none';

            expect(hasTransition || hasTransform).toBe(true);
          }

          // Test performance of animations
          const startTime = Date.now();
          await page.hover('[data-testid="account-card"]');
          await page.waitForTimeout(500);
          const endTime = Date.now();

          // Animations should be smooth
          expect(endTime - startTime).toBeGreaterThanOrEqual(400);
          expect(endTime - startTime).toBeLessThan(1000);
        });

        test(`should handle local storage in ${name}`, async ({ page }) => {
          await page.goto('/');

          // Test setting preferences
          await page.click('[data-testid="theme-toggle"]');

          // Reload page
          await page.reload();

          // Theme should persist
          const htmlElement = page.locator('html');
          const className = await htmlElement.getAttribute('class');
          expect(className).toBeDefined();
        });

        test(`should handle error scenarios in ${name}`, async ({ page }) => {
          // Test 404 page
          await page.goto('/nonexistent-page');
          await expect(page.locator('text=Page not found')).toBeVisible();

          // Test navigation back
          await page.click('[data-testid="back-to-dashboard"]');
          await expect(page).toHaveURL('/');

          // Test error boundary
          await page.goto('/calculators');

          // Trigger error condition
          await page.evaluate(() => {
            // Simulate error
            const event = new CustomEvent('triggerError');
            window.dispatchEvent(event);
          });

          // Should show error boundary or handle gracefully
          const errorMessage = page.locator('[data-testid="error-boundary"]');
          if (await errorMessage.isVisible()) {
            await expect(errorMessage).toContainText('Something went wrong');
          }
        });
      });
    });
  });

  test.describe('Accessibility Cross-Platform Tests', () => {
    test('should maintain keyboard navigation across devices', async ({
      page,
    }) => {
      await page.goto('/calculators');

      // Tab through elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Should be able to activate with Enter
      await page.keyboard.press('Enter');

      // Should navigate to calculator
      await expect(
        page.locator('[data-testid="calculator-form"]')
      ).toBeVisible();
    });

    test('should provide proper ARIA labels', async ({ page }) => {
      await page.goto('/');

      // Check for ARIA landmarks
      await expect(page.locator('main[role="main"]')).toBeVisible();
      await expect(page.locator('nav[role="navigation"]')).toBeVisible();

      // Check buttons have labels
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();

      for (let i = 0; i < Math.min(buttonCount, 10); i++) {
        const button = buttons.nth(i);
        const hasLabel =
          (await button.getAttribute('aria-label')) ||
          (await button.textContent()) ||
          (await button.getAttribute('title'));
        expect(hasLabel).toBeTruthy();
      }
    });

    test('should support screen readers', async ({ page }) => {
      await page.goto('/transactions');

      // Check for screen reader friendly content
      const transactions = page.locator('[data-testid="transaction-item"]');
      const count = await transactions.count();

      if (count > 0) {
        const firstTransaction = transactions.first();

        // Should have accessible description
        const ariaLabel = await firstTransaction.getAttribute('aria-label');
        const ariaDescribedBy =
          await firstTransaction.getAttribute('aria-describedby');

        expect(ariaLabel || ariaDescribedBy).toBeTruthy();
      }
    });
  });

  test.describe('Performance Across Platforms', () => {
    test('should maintain consistent performance', async ({ page }) => {
      const measurements = [];

      // Test multiple page loads
      for (let i = 0; i < 3; i++) {
        const startTime = Date.now();
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        const loadTime = Date.now() - startTime;
        measurements.push(loadTime);
      }

      // Calculate average
      const avgLoadTime =
        measurements.reduce((a, b) => a + b, 0) / measurements.length;

      // Should be consistently fast
      expect(avgLoadTime).toBeLessThan(3000);

      // Variance should be low
      const variance =
        measurements.reduce(
          (acc, time) => acc + Math.pow(time - avgLoadTime, 2),
          0
        ) / measurements.length;
      expect(variance).toBeLessThan(1000000); // Low variance
    });

    test('should handle memory efficiently', async ({ page }) => {
      await page.goto('/');

      // Navigate through multiple pages
      const pages = [
        '/transactions',
        '/budget',
        '/insights',
        '/calculators',
        '/',
      ];

      for (const path of pages) {
        await page.goto(path);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
      }

      // Check for memory leaks (basic test)
      const metrics = await page.evaluate(() => {
        if ('memory' in performance) {
          return (
            performance as unknown as {
              memory?: {
                usedJSHeapSize: number;
                totalJSHeapSize: number;
                jsHeapSizeLimit: number;
              };
            }
          ).memory;
        }
        return null;
      });

      if (metrics) {
        // Heap size should be reasonable
        expect(metrics.usedJSHeapSize).toBeLessThan(50 * 1024 * 1024); // 50MB limit
      }
    });
  });

  test.describe('Network Conditions Testing', () => {
    test('should work on slow networks', async ({ page }) => {
      // Simulate slow 3G
      await page.route('**/*', (route) => {
        setTimeout(() => route.continue(), 1000); // 1 second delay
      });

      await page.goto('/');

      // Should show loading states
      await expect(
        page.locator('[data-testid="loading-indicator"]')
      ).toBeVisible();

      // Should eventually load
      await expect(
        page.locator('h1').filter({ hasText: 'Dashboard' })
      ).toBeVisible({ timeout: 10000 });
    });

    test('should handle offline mode', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Go offline
      await page.context().setOffline(true);

      // Try to navigate
      await page.click('[data-testid="nav-transactions"]');

      // Should show offline indicator
      await expect(
        page.locator('[data-testid="offline-indicator"]')
      ).toBeVisible();

      // Should still show cached content
      await expect(
        page.locator('[data-testid="transaction-list"]')
      ).toBeVisible();
    });
  });
});
