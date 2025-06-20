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
    await page.waitForSelector(
      '[data-testid="account-card"], .relative.rounded-2xl',
      { timeout: 10000 }
    );

    // Get all account cards
    const accountCards = await page
      .locator('[data-testid="account-card"], .relative.rounded-2xl')
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
        expect(cardBox.height).toBeGreaterThanOrEqual(270);
        expect(cardBox.height).toBeLessThanOrEqual(310);
      }
    }
  });

  test('should display reasonable percentage values', async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Get all percentage elements that might contain extreme values
    const percentageElements = await page.locator('text=/%/').all();

    for (const element of percentageElements) {
      const text = await element.textContent();
      if (text) {
        // Extract numeric value (remove % sign)
        const match = text.match(/([\d.-]+)%/);
        if (match) {
          const numericValue = parseFloat(match[1]);

          // Ensure no extreme percentage values (should be clamped to ±999%)
          expect(Math.abs(numericValue)).toBeLessThanOrEqual(999);
        }
      }
    }
  });

  test('should maintain grid layout without gaps', async ({ page }) => {
    // Wait for grid container
    await page.waitForSelector('.grid', { timeout: 5000 });

    const gridContainer = page.locator('.grid').first();
    const cards = await gridContainer.locator('.relative.rounded-2xl').all();

    if (cards.length >= 2) {
      // Get positions of first two cards
      const firstCardBox = await cards[0].boundingBox();
      const secondCardBox = await cards[1].boundingBox();

      if (firstCardBox && secondCardBox) {
        // Cards should be horizontally aligned (same top position, within tolerance)
        expect(Math.abs(firstCardBox.y - secondCardBox.y)).toBeLessThan(10);

        // Cards should have consistent heights
        expect(
          Math.abs(firstCardBox.height - secondCardBox.height)
        ).toBeLessThan(10);
      }
    }
  });
});
