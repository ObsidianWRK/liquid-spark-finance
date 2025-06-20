import { test, expect } from '@playwright/test';

test.describe('Mobile Responsive Financial Pages', () => {
  const viewports = [
    { name: 'Mobile Small', width: 360, height: 640 },
    { name: 'Mobile Large', width: 414, height: 896 },
    { name: 'Tablet Portrait', width: 768, height: 1024 },
    { name: 'Tablet Landscape', width: 1024, height: 768 },
    { name: 'Desktop Small', width: 1366, height: 768 },
    { name: 'Desktop Large', width: 1920, height: 1080 }
  ];

  for (const viewport of viewports) {
    test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/');
        await page.waitForLoadState('networkidle');
      });

      test('Credit Score page mobile responsive layout', async ({ page }) => {
        await page.goto('/credit');
        await page.waitForSelector('h1:has-text("Credit Score")', { timeout: 10000 });

        // Check no horizontal scroll
        const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
        const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
        expect(bodyScrollWidth).toBeLessThanOrEqual(viewportWidth + 1);

        // Verify header is responsive
        const header = page.locator('h1:has-text("Credit Score")');
        await expect(header).toBeVisible();
        
        // Check back button touch target
        const backButton = page.locator('button:has-text("Dashboard")');
        await expect(backButton).toBeVisible();
        const backButtonHeight = await backButton.evaluate(el => el.getBoundingClientRect().height);
        expect(backButtonHeight).toBeGreaterThanOrEqual(44);
      });

      test('Investment Tracker page mobile responsive layout', async ({ page }) => {
        await page.goto('/investments');
        await page.waitForSelector('h1:has-text("Investment Tracker")', { timeout: 10000 });

        // Check no horizontal scroll
        const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
        const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
        expect(bodyScrollWidth).toBeLessThanOrEqual(viewportWidth + 1);

        // Verify header responsiveness
        const header = page.locator('h1:has-text("Investment Tracker")');
        await expect(header).toBeVisible();
      });

      test('Financial Planning page mobile responsive layout', async ({ page }) => {
        await page.goto('/planning');
        await page.waitForSelector('h1:has-text("Financial Planning")', { timeout: 10000 });

        // Check no horizontal scroll
        const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
        const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
        expect(bodyScrollWidth).toBeLessThanOrEqual(viewportWidth + 1);

        // Verify header layout
        const header = page.locator('h1:has-text("Financial Planning")');
        await expect(header).toBeVisible();
      });
    });
  }

  test('Accessibility: Touch targets meet minimum size requirements', async ({ page }) => {
    const pages = ['/credit', '/investments', '/planning'];
    
    for (const pagePath of pages) {
      await page.setViewportSize({ width: 360, height: 640 }); // Mobile viewport
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');

      // Get all interactive elements
      const interactiveElements = page.locator('button, a, input, select, textarea, [role="button"], [role="tab"]');
      const elementCount = await interactiveElements.count();

      // Check a sample of elements for touch target compliance
      const sampleSize = Math.min(elementCount, 10);
      for (let i = 0; i < sampleSize; i++) {
        const element = interactiveElements.nth(i);
        if (await element.isVisible()) {
          const bounds = await element.boundingBox();
          if (bounds) {
            expect(bounds.height).toBeGreaterThanOrEqual(44);
            expect(bounds.width).toBeGreaterThanOrEqual(44);
          }
        }
      }
    }
  });

  test('Content readability on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    
    const pages = ['/credit', '/investments', '/planning'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');

      // Check that text is not too small
      const textElements = page.locator('p, span, div').filter({ hasText: /\w+/ });
      const sampleSize = Math.min(await textElements.count(), 10);
      
      for (let i = 0; i < sampleSize; i++) {
        const element = textElements.nth(i);
        if (await element.isVisible()) {
          const fontSize = await element.evaluate(el => {
            const style = window.getComputedStyle(el);
            return parseFloat(style.fontSize);
          });
          
          // Minimum font size should be 14px for readability
          expect(fontSize).toBeGreaterThanOrEqual(14);
        }
      }

      // Check that content doesn't get cut off horizontally
      const contentElements = page.locator('.bg-white\\/\\[0\\.02\\], .bg-gradient-to-r, .grid');
      const contentCount = await contentElements.count();
      
      for (let i = 0; i < Math.min(contentCount, 5); i++) {
        const element = contentElements.nth(i);
        if (await element.isVisible()) {
          const bounds = await element.boundingBox();
          if (bounds) {
            expect(bounds.x + bounds.width).toBeLessThanOrEqual(360 + 5); // 5px tolerance
          }
        }
      }
    }
  });
}); 