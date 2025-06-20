import { test, expect } from '@playwright/test';

test.describe('Transaction Date Header Alignment', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?tab=transactions');
    // Wait for page load and navigate to transactions view
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    // Ensure we're on the transactions tab with Recent Transactions visible
    await expect(
      page.locator('h1:has-text("Recent Transactions")')
    ).toBeVisible({ timeout: 10000 });
  });

  test('date headers align with transaction rows on desktop', async ({
    page,
    browserName,
  }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 });

    // Look for date headers and transaction rows within the transaction list
    const transactionContainer = page.locator('.transaction-scroll-container');
    const dateHeaders = transactionContainer
      .locator('[role="presentation"]')
      .first();
    const transactionRows = transactionContainer
      .locator('[role="button"]')
      .first();

    // Wait for elements to be visible
    await expect(dateHeaders).toBeVisible({ timeout: 5000 });
    await expect(transactionRows).toBeVisible({ timeout: 5000 });

    if (
      (await dateHeaders.count()) > 0 &&
      (await transactionRows.count()) > 0
    ) {
      // Get bounding boxes
      const headerBox = await dateHeaders.boundingBox();
      const transactionBox = await transactionRows.boundingBox();

      expect(headerBox).not.toBeNull();
      expect(transactionBox).not.toBeNull();

      if (headerBox && transactionBox) {
        // Date header left edge should align with transaction row left edge (within 2px tolerance)
        expect(Math.abs(headerBox.x - transactionBox.x)).toBeLessThanOrEqual(2);
      }
    }
  });

  test('date headers align with transaction rows on tablet', async ({
    page,
  }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 834, height: 1112 });

    const transactionContainer = page.locator('.transaction-scroll-container');
    const dateHeaders = transactionContainer
      .locator('[role="presentation"]')
      .first();
    const transactionRows = transactionContainer
      .locator('[role="button"]')
      .first();

    await expect(dateHeaders).toBeVisible({ timeout: 5000 });
    await expect(transactionRows).toBeVisible({ timeout: 5000 });

    if (
      (await dateHeaders.count()) > 0 &&
      (await transactionRows.count()) > 0
    ) {
      const headerBox = await dateHeaders.boundingBox();
      const transactionBox = await transactionRows.boundingBox();

      expect(headerBox).not.toBeNull();
      expect(transactionBox).not.toBeNull();

      if (headerBox && transactionBox) {
        expect(Math.abs(headerBox.x - transactionBox.x)).toBeLessThanOrEqual(2);
      }
    }
  });

  test('date headers align with transaction rows on mobile', async ({
    page,
  }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });

    const transactionContainer = page.locator('.transaction-scroll-container');
    const dateHeaders = transactionContainer
      .locator('[role="presentation"]')
      .first();
    const transactionRows = transactionContainer
      .locator('[role="button"]')
      .first();

    await expect(dateHeaders).toBeVisible({ timeout: 5000 });
    await expect(transactionRows).toBeVisible({ timeout: 5000 });

    if (
      (await dateHeaders.count()) > 0 &&
      (await transactionRows.count()) > 0
    ) {
      const headerBox = await dateHeaders.boundingBox();
      const transactionBox = await transactionRows.boundingBox();

      expect(headerBox).not.toBeNull();
      expect(transactionBox).not.toBeNull();

      if (headerBox && transactionBox) {
        expect(Math.abs(headerBox.x - transactionBox.x)).toBeLessThanOrEqual(2);
      }
    }
  });

  test('transaction list has consistent grid structure', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    const transactionContainer = page.locator('.transaction-scroll-container');

    // Verify date headers use grid layout
    const dateHeader = transactionContainer
      .locator('[role="presentation"]')
      .first();
    if ((await dateHeader.count()) > 0) {
      const headerStyles = await dateHeader.evaluate(
        (el) => getComputedStyle(el).display
      );
      expect(headerStyles).toBe('grid');
    }

    // Verify transaction rows use grid layout
    const transactionRow = transactionContainer
      .locator('[role="button"]')
      .first();
    if ((await transactionRow.count()) > 0) {
      const rowStyles = await transactionRow.evaluate(
        (el) => getComputedStyle(el).display
      );
      expect(rowStyles).toBe('grid');
    }
  });

  test('recent transactions section is visible and responsive', async ({
    page,
  }) => {
    // Test on multiple viewports
    const viewports = [
      { width: 1280, height: 800, name: 'desktop' },
      { width: 834, height: 1112, name: 'tablet' },
      { width: 390, height: 844, name: 'mobile' },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);

      // Look for Recent Transactions heading
      const heading = page.locator('h1:has-text("Recent Transactions")');
      await expect(heading).toBeVisible({ timeout: 5000 });

      // Verify transaction list container exists
      const container = page.locator(
        '.transaction-scroll-container, [data-testid="transaction-list"]'
      );
      await expect(container).toBeVisible({ timeout: 5000 });
    }
  });
});
