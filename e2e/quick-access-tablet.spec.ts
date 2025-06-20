import { test, expect } from '@playwright/test';

test.describe('Quick Access Cards - Tablet Viewport', () => {
  test.beforeEach(async ({ page }) => {
    // Set iPad Air viewport size (tablet)
    await page.setViewportSize({ width: 834, height: 1112 });
    await page.goto('/');
  });

  test('should align Quick Access cards properly on tablet view', async ({
    page,
  }) => {
    // Wait for cards to load
    await page.waitForSelector('[data-testid="account-card"], .account-card', {
      timeout: 10000,
    });

    // Get all account cards
    const accountCards = await page
      .locator('[data-testid="account-card"], .account-card')
      .all();

    // Ensure we have cards to test
    expect(accountCards.length).toBeGreaterThan(0);

    // Test each card for proper height and overflow
    for (const card of accountCards) {
      // Check that card doesn't overflow its container
      const cardBox = await card.boundingBox();
      if (cardBox) {
        const scrollHeight = await card.evaluate((el) => el.scrollHeight);
        const clientHeight = await card.evaluate((el) => el.clientHeight);

        // Card content should fit within its container (allowing 2px tolerance)
        expect(scrollHeight).toBeLessThanOrEqual(clientHeight + 2);

        // Card should have consistent height (18rem = 288px)
        expect(cardBox.height).toBeGreaterThanOrEqual(286);
        expect(cardBox.height).toBeLessThanOrEqual(290);
      }
    }
  });

  test('should display clamped percentage values', async ({ page }) => {
    // Wait for cards with percentage values
    await page.waitForSelector('text=/%/', { timeout: 5000 });

    // Get all percentage elements
    const percentageElements = await page.locator('text=/%/').all();

    for (const element of percentageElements) {
      const text = await element.textContent();
      if (text) {
        // Extract numeric value (remove % sign)
        const numericValue = parseFloat(text.replace('%', ''));

        // Ensure no extreme percentage values (should be clamped to ±999%)
        expect(Math.abs(numericValue)).toBeLessThanOrEqual(999);
      }
    }
  });

  test('should maintain grid layout without gaps', async ({ page }) => {
    // Wait for grid container
    await page.waitForSelector('.grid', { timeout: 5000 });

    const gridContainer = page.locator('.grid').first();
    const cards = await gridContainer
      .locator('[data-testid="account-card"], .account-card')
      .all();

    if (cards.length >= 2) {
      // Get positions of first two cards
      const firstCardBox = await cards[0].boundingBox();
      const secondCardBox = await cards[1].boundingBox();

      if (firstCardBox && secondCardBox) {
        // Cards should be horizontally aligned (same top position)
        expect(Math.abs(firstCardBox.y - secondCardBox.y)).toBeLessThan(5);

        // Cards should have consistent heights
        expect(
          Math.abs(firstCardBox.height - secondCardBox.height)
        ).toBeLessThan(5);
      }
    }
  });

  test('should display tooltips for truncated text', async ({ page }) => {
    // Find cards with potentially long account names
    const accountNameElements = await page
      .locator('[data-testid="account-name"], .account-name')
      .all();

    for (const element of accountNameElements) {
      // Check if text is truncated (scrollWidth > clientWidth)
      const isOverflowing = await element.evaluate(
        (el) => el.scrollWidth > el.clientWidth
      );

      if (isOverflowing) {
        // Hover to trigger tooltip
        await element.hover();

        // Wait for tooltip to appear
        await page.waitForSelector('[role="tooltip"]', { timeout: 1000 });

        const tooltip = page.locator('[role="tooltip"]');
        await expect(tooltip).toBeVisible();
      }
    }
  });

  test('should maintain accessibility standards', async ({ page }) => {
    // Check that all interactive elements have proper labels
    const buttons = await page.locator('button').all();

    for (const button of buttons) {
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();

      // Button should have either aria-label or visible text
      expect(ariaLabel || text).toBeTruthy();
    }

    // Check color contrast (basic check)
    const cards = await page
      .locator('[data-testid="account-card"], .account-card')
      .all();

    for (const card of cards) {
      const bgColor = await card.evaluate(
        (el) => getComputedStyle(el).backgroundColor
      );
      expect(bgColor).not.toBe('rgb(255, 255, 255)'); // Should not be pure white (dark theme)
    }
  });
});
