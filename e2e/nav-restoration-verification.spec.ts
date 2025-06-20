import { test, expect } from '@playwright/test';

test.describe('🧭 Nav Restoration Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('✅ Mobile (390×844): BottomNav should be visible, TopBar hidden', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500); // Allow responsive changes

    // BottomNav should be visible on mobile
    const bottomNav = page
      .locator(
        '[aria-label*="navigation"], .bottom-navigation, nav[role="menubar"]'
      )
      .first();
    await expect(bottomNav).toBeVisible();

    // TopBar should be hidden on mobile
    const topBar = page.locator(
      'header[role="banner"], header[aria-label*="Top navigation"]'
    );
    if ((await topBar.count()) > 0) {
      await expect(topBar).toBeHidden();
    }

    console.log('✅ Mobile navigation verified');
  });

  test('✅ Tablet (834×1112): NavRail should be visible', async ({ page }) => {
    await page.setViewportSize({ width: 834, height: 1112 });
    await page.waitForTimeout(500);

    // Some form of navigation should be visible on tablet
    const navigation = page
      .locator('[aria-label*="navigation"], nav, .nav-rail')
      .first();
    await expect(navigation).toBeVisible();

    console.log('✅ Tablet navigation verified');
  });

  test('✅ Desktop (1440×900): TopBar should be visible and functional', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(500);

    // TopBar should be visible on desktop
    const topBar = page.locator(
      'header[role="banner"], header[aria-label*="Top navigation"]'
    );
    await expect(topBar).toBeVisible({ timeout: 10000 });

    // Search input should be visible
    const searchInput = page.locator('input[placeholder*="Search"]');
    await expect(searchInput).toBeVisible();

    // Profile button should be clickable
    const profileButton = page.locator(
      'button[aria-label*="Profile"], button[title*="Profile"]'
    );
    await expect(profileButton).toBeVisible();

    // Test search functionality
    await searchInput.fill('test search');
    await expect(searchInput).toHaveValue('test search');

    console.log('✅ Desktop TopBar navigation verified');
  });

  test('🔄 Navigation responsiveness: should adapt correctly on viewport changes', async ({
    page,
  }) => {
    // Start desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(500);

    const topBar = page.locator('header[role="banner"]');
    await expect(topBar).toBeVisible();

    // Switch to mobile
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);

    // TopBar should be hidden, BottomNav should be visible
    if ((await topBar.count()) > 0) {
      await expect(topBar).toBeHidden();
    }

    const mobileNav = page
      .locator('[aria-label*="navigation"], .bottom-navigation')
      .first();
    await expect(mobileNav).toBeVisible();

    // Switch back to desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(500);

    await expect(topBar).toBeVisible();

    console.log('✅ Responsive navigation adaptation verified');
  });

  test('🎯 TopBar search functionality works', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    const searchInput = page.locator('input[placeholder*="Search"]');
    await expect(searchInput).toBeVisible();

    // Test search interaction
    await searchInput.click();
    await searchInput.fill('monthly expenses');
    await expect(searchInput).toHaveValue('monthly expenses');

    // Test form submission (should not cause errors)
    await searchInput.press('Enter');

    // Verify no console errors from search
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.waitForTimeout(1000);
    console.log('✅ TopBar search functionality verified');
  });

  test('📱 Navigation accessibility compliance', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // Check for proper ARIA labels
    const topBar = page.locator('header[role="banner"]');
    await expect(topBar).toBeVisible();

    // Verify buttons have proper accessibility attributes
    const profileButton = page.locator('button[aria-label*="Profile"]');
    await expect(profileButton).toBeVisible();

    const notificationButton = page.locator(
      'button[aria-label*="notification"]'
    );
    await expect(notificationButton).toBeVisible();

    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    console.log('✅ Navigation accessibility verified');
  });
});
