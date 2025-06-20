import { test, expect } from '@playwright/test';

test.describe('White Screen Regression Prevention', () => {
  test('should not show white screen on app load', async ({ page }) => {
    // Navigate to the application
    await page.goto('/');

    // Wait for the root element to be present
    await expect(page.locator('#root')).toBeVisible();

    // Ensure the app content loads (not just a white screen)
    await expect(page.locator('main')).toBeVisible();

    // Check that navigation elements are present
    await expect(page.locator('nav')).toBeVisible();

    // Verify no critical JavaScript errors in console
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Wait a bit for any async errors to surface
    await page.waitForTimeout(2000);

    // Assert no critical console errors
    const criticalErrors = consoleErrors.filter(
      (error) =>
        error.includes('Failed to load') ||
        error.includes('SecurityEnvValidator') ||
        error.includes('Cannot read') ||
        error.includes('Uncaught')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('should load CSS styles correctly', async ({ page }) => {
    await page.goto('/');

    // Check that background color is applied (indicating CSS loaded)
    const bodyBg = await page
      .locator('body')
      .evaluate((el) => window.getComputedStyle(el).backgroundColor);

    // Should not be default white (rgb(255, 255, 255))
    expect(bodyBg).not.toBe('rgb(255, 255, 255)');

    // Check that the dark theme class is applied
    await expect(page.locator('html.dark')).toBeVisible();
  });

  test('should not have CSS syntax errors', async ({ page }) => {
    // Navigate and capture network responses
    const cssResponses: any[] = [];
    page.on('response', (response) => {
      if (
        response.url().includes('.css') ||
        response.headers()['content-type']?.includes('text/css')
      ) {
        cssResponses.push(response);
      }
    });

    await page.goto('/');

    // Verify all CSS files loaded successfully
    for (const cssResponse of cssResponses) {
      expect(cssResponse.status()).toBe(200);
    }

    // Check for CSS parsing errors in console
    const cssErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.text().includes('CSS') && msg.type() === 'error') {
        cssErrors.push(msg.text());
      }
    });

    await page.waitForTimeout(1000);
    expect(cssErrors).toHaveLength(0);
  });
});
