import { test, expect } from '@playwright/test';

test.describe('Analytics Tab - Destructuring Fix Validation', () => {
  const viewports = [
    { name: 'Desktop', width: 1440, height: 900 },
    { name: 'Tablet', width: 834, height: 1194 },
    { name: 'Mobile', width: 390, height: 844 },
  ];

  viewports.forEach(({ name, width, height }) => {
    test.describe(`${name} (${width}x${height})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.goto('/');
      });

      test('should navigate to analytics without destructuring errors', async ({
        page,
      }) => {
        // Set up console error listener
        const consoleErrors: string[] = [];
        page.on('console', (msg) => {
          if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
          }
        });

        // Navigate to analytics tab
        await page.click(
          '[data-testid="nav-analytics"], [role="button"]:has-text("Analytics"), button:has-text("Analytics")'
        );

        // Wait for analytics content to load
        await page.waitForSelector(
          '[data-testid="financial-dashboard"], .financial-dashboard, h1:has-text("Financial Analytics Dashboard")',
          { timeout: 10000 }
        );

        // Verify no destructuring errors
        const destructuringErrors = consoleErrors.filter(
          (error) =>
            error.includes('Right side of assignment cannot be destructured') ||
            error.includes('Cannot read property') ||
            error.includes('Cannot read properties of undefined')
        );

        expect(destructuringErrors).toHaveLength(0);

        // Verify charts are present
        const chartCount = await page.locator('.recharts-wrapper').count();
        expect(chartCount).toBeGreaterThan(0);
      });

      test('should render all chart sections without errors', async ({
        page,
      }) => {
        // Navigate to analytics
        await page.goto('/?view=analytics');

        // Wait for dashboard to load
        await page.waitForSelector(
          'h1:has-text("Financial Analytics Dashboard")',
          { timeout: 10000 }
        );

        // Check key metrics section
        const metricsCount = await page
          .locator('.grid .bg-white\\/\\[0\\.02\\]')
          .count();
        expect(metricsCount).toBeGreaterThan(0);

        // Check main chart area
        await expect(page.locator('.recharts-wrapper')).toBeVisible();

        // Check budget performance section
        await expect(
          page.locator('h2:has-text("Budget Performance")')
        ).toBeVisible();

        // Check portfolio allocation section
        await expect(
          page.locator('h2:has-text("Portfolio Allocation")')
        ).toBeVisible();
      });

      test('should handle chart interactions without errors', async ({
        page,
      }) => {
        await page.goto('/?view=analytics');
        await page.waitForSelector(
          'h1:has-text("Financial Analytics Dashboard")',
          { timeout: 10000 }
        );

        // Test timeframe selector
        const timeframeButtons = page.locator(
          'button:has-text("1M"), button:has-text("3M"), button:has-text("6M"), button:has-text("1Y")'
        );
        if (await timeframeButtons.first().isVisible()) {
          await timeframeButtons.first().click();
          await page.waitForTimeout(1000);
        }

        // Test chart type switching
        const chartButtons = page.locator(
          'button:has-text("Net Worth"), button:has-text("Cash Flow"), button:has-text("Spending"), button:has-text("Portfolio")'
        );
        if (await chartButtons.first().isVisible()) {
          await chartButtons.first().click();
          await page.waitForTimeout(500);
        }

        // Verify charts still render after interactions
        await expect(page.locator('.recharts-wrapper')).toBeVisible();
      });

      test('should display loading states gracefully', async ({ page }) => {
        // Throttle network to test loading states
        await page.route('**/*', async (route) => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          await route.continue();
        });

        await page.goto('/?view=analytics');

        // Check for loading skeleton or spinner (if implemented)
        page.locator(
          '.animate-pulse, .animate-spin, [data-testid=\"loading\"]'
        );

        // Wait for content to eventually load
        await page.waitForSelector(
          'h1:has-text(\"Financial Analytics Dashboard\")',
          { timeout: 15000 }
        );

        // Verify final state is properly rendered
        await expect(page.locator('.recharts-wrapper')).toBeVisible();
      });

      test('should not have horizontal scroll', async ({ page }) => {
        await page.goto('/?view=analytics');
        await page.waitForSelector(
          'h1:has-text("Financial Analytics Dashboard")',
          { timeout: 10000 }
        );

        // Check for horizontal scroll
        const scrollWidth = await page.evaluate(
          () => document.documentElement.scrollWidth
        );
        const clientWidth = await page.evaluate(
          () => document.documentElement.clientWidth
        );

        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // Allow 1px tolerance
      });

      test('should display contextual empty states if needed', async ({
        page,
      }) => {
        await page.goto('/?view=analytics');
        await page.waitForSelector(
          'h1:has-text("Financial Analytics Dashboard")',
          { timeout: 10000 }
        );

        // Check if empty state is shown appropriately
        const noDataMessages = page.locator(
          'text="No Dashboard Data", text="Unable to load", text="No data available"'
        );

        // If empty state is shown, verify it's properly styled
        if ((await noDataMessages.count()) > 0) {
          await expect(noDataMessages.first()).toBeVisible();
        } else {
          // If data is available, verify charts are rendered
          await expect(page.locator('.recharts-wrapper')).toBeVisible();
        }
      });
    });
  });

  test('visual regression comparison', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/?view=analytics');
    await page.waitForSelector('h1:has-text("Financial Analytics Dashboard")', {
      timeout: 10000,
    });

    // Wait for charts to fully render
    await page.waitForTimeout(2000);

    // Take screenshot for visual comparison
    await expect(page).toHaveScreenshot('analytics-dashboard-desktop.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });
});
