/**
 * Vueni Logo Download E2E Tests
 * 
 * Tests right-click context menu functionality and file downloads
 * across mobile, tablet, and desktop viewports.
 */

import { test, expect } from '@playwright/test';

test.describe('Vueni Logo Download Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for logo to be visible
    await expect(page.locator('[aria-label*="Vueni logo"]')).toBeVisible();
  });

  test.describe('Desktop Context Menu', () => {
    test('should show context menu on right-click', async ({ page }) => {
      const logo = page.locator('[aria-label*="Vueni logo"]');
      
      // Right-click the logo
      await logo.click({ button: 'right' });
      
      // Verify context menu appears
      await expect(page.locator('[role="menu"]')).toBeVisible();
      
      // Verify menu items are present
      await expect(page.getByText('Download SVG Logo')).toBeVisible();
      await expect(page.getByText('Brand Guidelines')).toBeVisible();
      await expect(page.getByText('LLM Instructions')).toBeVisible();
      await expect(page.getByText('Brand Portal')).toBeVisible();
    });

    test('should download SVG logo file', async ({ page }) => {
      const downloadPromise = page.waitForEvent('download');
      
      // Right-click logo and select SVG download
      await page.locator('[aria-label*="Vueni logo"]').click({ button: 'right' });
      await page.getByText('Download SVG Logo').click();
      
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe('vueni-logo.svg');
    });

    test('should download brand guidelines PDF', async ({ page }) => {
      const downloadPromise = page.waitForEvent('download');
      
      // Right-click logo and select PDF download
      await page.locator('[aria-label*="Vueni logo"]').click({ button: 'right' });
      await page.getByText('Brand Guidelines').click();
      
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe('brand-guidelines.pdf');
    });

    test('should download LLM instructions', async ({ page }) => {
      const downloadPromise = page.waitForEvent('download');
      
      // Right-click logo and select TXT download
      await page.locator('[aria-label*="Vueni logo"]').click({ button: 'right' });
      await page.getByText('LLM Instructions').click();
      
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe('LLM.txt');
    });

    test('should open brand portal in new tab', async ({ page, context }) => {
      const pagePromise = context.waitForEvent('page');
      
      // Right-click logo and select brand portal
      await page.locator('[aria-label*="Vueni logo"]').click({ button: 'right' });
      await page.getByText('Brand Portal').click();
      
      const newPage = await pagePromise;
      expect(newPage.url()).toContain('vueni.com/brand');
    });
  });

  test.describe('Mobile Context Menu', () => {
    test.beforeEach(async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
    });

    test('should show context menu on long press', async ({ page }) => {
      const logo = page.locator('[aria-label*="Vueni logo"]');
      
      // Simulate long press using touch events
      await logo.hover();
      await page.mouse.down();
      await page.waitForTimeout(800); // Long press duration
      await page.mouse.up();
      
      // Verify context menu appears (mobile version might be different)
      await expect(page.locator('[role="menu"]')).toBeVisible();
    });

    test('should handle mobile downloads', async ({ page }) => {
      const downloadPromise = page.waitForEvent('download');
      
      // Long press and download
      const logo = page.locator('[aria-label*="Vueni logo"]');
      await logo.hover();
      await page.mouse.down();
      await page.waitForTimeout(800);
      await page.mouse.up();
      
      await page.getByText('Download SVG Logo').click();
      
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe('vueni-logo.svg');
    });
  });

  test.describe('Tablet Context Menu', () => {
    test.beforeEach(async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
    });

    test('should work on tablet viewports', async ({ page }) => {
      const logo = page.locator('[aria-label*="Vueni logo"]');
      
      // Right-click (touch device might use different interaction)
      await logo.click({ button: 'right' });
      
      await expect(page.locator('[role="menu"]')).toBeVisible();
      await expect(page.getByText('Download SVG Logo')).toBeVisible();
    });
  });

  test.describe('Accessibility Features', () => {
    test('should be keyboard navigable', async ({ page }) => {
      const logo = page.locator('[aria-label*="Vueni logo"]');
      
      // Focus the logo
      await logo.focus();
      
      // Verify it's focusable
      await expect(logo).toBeFocused();
      
      // Test Enter key navigation
      await page.keyboard.press('Enter');
      
      // Should navigate to home (based on onClick handler)
      await expect(page).toHaveURL('/');
    });

    test('should have proper ARIA labels', async ({ page }) => {
      const logo = page.locator('[aria-label*="Vueni logo"]');
      
      // Verify aria-label contains download instructions
      const ariaLabel = await logo.getAttribute('aria-label');
      expect(ariaLabel).toContain('Right-click to download brand assets');
    });

    test('should support screen readers', async ({ page }) => {
      // Verify semantic structure
      const logo = page.locator('[role="button"]').filter({ hasText: 'Vueni' });
      await expect(logo).toBeVisible();
      
      // Check that the logo has proper role
      await expect(logo).toHaveAttribute('role', 'button');
    });
  });

  test.describe('Performance Checks', () => {
    test('should not cause layout shift', async ({ page }) => {
      // Measure initial layout
      const initialMetrics = await page.evaluate(() => {
        return {
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight
        };
      });
      
      // Right-click to show menu
      await page.locator('[aria-label*="Vueni logo"]').click({ button: 'right' });
      await page.waitForTimeout(100);
      
      // Measure after menu appears
      const afterMetrics = await page.evaluate(() => {
        return {
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight
        };
      });
      
      // Verify no horizontal scroll introduced
      expect(afterMetrics.width).toBeLessThanOrEqual(initialMetrics.width + 10); // Allow small variance
    });

    test('should load menu quickly', async ({ page }) => {
      const startTime = Date.now();
      
      await page.locator('[aria-label*="Vueni logo"]').click({ button: 'right' });
      await expect(page.locator('[role="menu"]')).toBeVisible();
      
      const endTime = Date.now();
      const loadTime = endTime - startTime;
      
      // Menu should appear within 500ms
      expect(loadTime).toBeLessThan(500);
    });
  });

  test.describe('Error Handling', () => {
    test('should handle failed downloads gracefully', async ({ page }) => {
      // Mock network to simulate download failure
      await page.route('/branding/vueni-logo.svg', route => {
        route.abort('failed');
      });
      
      // Attempt download
      await page.locator('[aria-label*="Vueni logo"]').click({ button: 'right' });
      await page.getByText('Download SVG Logo').click();
      
      // Should not crash the application
      await expect(page.locator('[aria-label*="Vueni logo"]')).toBeVisible();
    });
  });
}); 