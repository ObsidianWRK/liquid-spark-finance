import { test, expect } from '@playwright/test';

test.describe('TopBar Visibility', () => {
  test.beforeEach(async ({ page }) => {
    // Set desktop viewport (≥1024px)
    await page.setViewportSize({ width: 1024, height: 768 });
  });

  test('TopBar should be visible on homepage at 1024px viewport', async ({
    page,
  }) => {
    await page.goto('http://localhost:5173');

    // Wait for initial load
    await page.waitForLoadState('networkidle');

    // Look for TopBar component (header element with role="banner")
    const topBar = page.locator('header[role="banner"]');

    // Check if TopBar exists in DOM
    await expect(topBar).toBeAttached();

    // Check if TopBar is visible
    await expect(topBar).toBeVisible();

    // Verify TopBar has correct classes
    await expect(topBar).toHaveClass(/hidden lg:flex/);

    // Check z-index is at least 50 (should be z-50)
    const computedStyle = await topBar.evaluate((el) => {
      return window.getComputedStyle(el).zIndex;
    });
    expect(parseInt(computedStyle)).toBeGreaterThanOrEqual(50);
  });

  test('TopBar should contain search and action buttons', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    const topBar = page.locator('header[role="banner"]');
    await expect(topBar).toBeVisible();

    // Check for search input
    const searchInput = topBar.locator('input[placeholder*="Search"]');
    await expect(searchInput).toBeVisible();

    // Check for action buttons (Plus, Bell, Settings, User)
    await expect(
      topBar.locator('button[aria-label="Add new transaction"]')
    ).toBeVisible();
    await expect(
      topBar.locator('button[aria-label="View notifications"]')
    ).toBeVisible();
    await expect(
      topBar.locator('button[aria-label="Open settings"]')
    ).toBeVisible();
    await expect(
      topBar.locator('button[aria-label="View profile"]')
    ).toBeVisible();
  });

  test('TopBar should persist across route navigation', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    // Verify TopBar on homepage
    const topBar = page.locator('header[role="banner"]');
    await expect(topBar).toBeVisible();

    // Navigate to different routes and verify TopBar persists
    const routes = ['/profile', '/transactions', '/calculators', '/credit'];

    for (const route of routes) {
      await page.goto(`http://localhost:5173${route}`);
      await page.waitForLoadState('networkidle');
      await expect(topBar).toBeVisible();
    }
  });

  test('TopBar should NOT be visible on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    // TopBar should be hidden on mobile
    const topBar = page.locator('header[role="banner"]');
    if ((await topBar.count()) > 0) {
      await expect(topBar).toBeHidden();
    }

    // BottomNav should be visible instead
    const bottomNav = page.locator('nav[role="navigation"]');
    await expect(bottomNav).toBeVisible();
  });

  test('TopBar should be visible on large desktop viewport', async ({
    page,
  }) => {
    // Set large desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    const topBar = page.locator('header[role="banner"]');
    await expect(topBar).toBeVisible();
  });

  test('TopBar should respond to scroll behavior (no early hide)', async ({
    page,
  }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    const topBar = page.locator('header[role="banner"]');
    await expect(topBar).toBeVisible();

    // Small scroll should not hide the TopBar
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(300); // Wait for any scroll animations
    await expect(topBar).toBeVisible();

    // Larger scroll down
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(300);
    // TopBar might hide on large scroll (this is expected behavior)

    // Scroll back up should show TopBar
    await page.mouse.wheel(0, -600);
    await page.waitForTimeout(300);
    await expect(topBar).toBeVisible();
  });

  test('Debug mode should force TopBar visible', async ({ page }) => {
    await page.goto('http://localhost:5173?navDebug=1');
    await page.waitForLoadState('networkidle');

    const topBar = page.locator('header[role="banner"]');
    await expect(topBar).toBeVisible();

    // Even with large scroll, debug mode should keep it visible
    await page.mouse.wheel(0, 1000);
    await page.waitForTimeout(500);
    await expect(topBar).toBeVisible();
  });
});
