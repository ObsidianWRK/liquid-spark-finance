import { test, expect } from '@playwright/test';

test.describe('TransactionList responsive alignment', () => {
  const viewports = [
    { width: 1280, height: 800, name: 'desktop' },
    { width: 834, height: 1112, name: 'tablet' },
    { width: 390, height: 844, name: 'mobile' },
  ];

  for (const vp of viewports) {
    test(`no horizontal scroll on ${vp.name}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.goto('/?tab=transactions');
      await page.waitForLoadState('networkidle');

      // Evaluate overflow
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasOverflow).toBe(false);
    });
  }
});
