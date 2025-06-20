import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Adaptive Navigation System
 * Tests navigation flows across iPhone 14, iPad Air, and MacBook Pro viewports
 */

// Test viewport configurations
const viewports = {
  mobile: { width: 390, height: 844 }, // iPhone 14
  tablet: { width: 820, height: 1180 }, // iPad Air
  desktop: { width: 1440, height: 900 }, // MacBook Pro
};

test.describe('Adaptive Navigation System', () => {
  test.describe('Mobile Navigation (Bottom Bar)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.goto('/');
    });

    test('should display bottom navigation with max 5 items', async ({
      page,
    }) => {
      // Wait for navigation to be visible
      const bottomNav = page.locator(
        '[role="navigation"][aria-label="Bottom navigation"]'
      );
      await expect(bottomNav).toBeVisible();

      // Count navigation items
      const navItems = bottomNav.locator('button');
      const itemCount = await navItems.count();
      expect(itemCount).toBeLessThanOrEqual(5);

      // Verify items have proper accessibility attributes
      for (let i = 0; i < itemCount; i++) {
        const item = navItems.nth(i);
        await expect(item).toHaveAttribute('aria-label');
        await expect(item).toHaveAttribute('aria-current');
      }
    });

    test('should navigate correctly when bottom nav items are clicked', async ({
      page,
    }) => {
      const bottomNav = page.locator(
        '[role="navigation"][aria-label="Bottom navigation"]'
      );

      // Test navigation to transactions
      const transactionsBtn = bottomNav.locator('button', {
        hasText: 'Transactions',
      });
      await transactionsBtn.click();
      await expect(page).toHaveURL(/.*transactions.*/);

      // Test navigation back to dashboard
      const dashboardBtn = bottomNav.locator('button', {
        hasText: 'Dashboard',
      });
      await dashboardBtn.click();
      await expect(page).toHaveURL('/');
    });

    test('should respect safe area insets', async ({ page }) => {
      const bottomNav = page.locator(
        '[role="navigation"][aria-label="Bottom navigation"]'
      );

      // Check that navigation respects safe area
      const navStyles = await bottomNav.evaluate((el) => getComputedStyle(el));
      expect(navStyles.paddingBottom).toContain('env(safe-area-inset-bottom)');
    });

    test('should not show tablet or desktop navigation', async ({ page }) => {
      // Tablet navigation should be hidden
      const navRail = page.locator('[aria-label="Navigation rail"]');
      await expect(navRail).toBeHidden();

      // Desktop navigation should be hidden
      const sidebar = page.locator('[aria-label="Main navigation"]');
      await expect(sidebar).toBeHidden();

      const topBar = page.locator('[aria-label="Top navigation bar"]');
      await expect(topBar).toBeHidden();
    });
  });

  test.describe('Tablet Navigation (Navigation Rail)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewports.tablet);
      await page.goto('/');
    });

    test('should display navigation rail in collapsed state by default', async ({
      page,
    }) => {
      const navRail = page.locator('[aria-label="Navigation rail"]');
      await expect(navRail).toBeVisible();

      // Check initial width (collapsed state)
      const railBox = await navRail.boundingBox();
      expect(railBox?.width).toBeLessThan(100); // Should be around 80px when collapsed
    });

    test('should expand rail on hover', async ({ page }) => {
      const navRail = page.locator('[aria-label="Navigation rail"]');

      // Get initial width
      const initialBox = await navRail.boundingBox();

      // Hover to expand
      await navRail.hover();
      await page.waitForTimeout(500); // Wait for animation

      // Check expanded width
      const expandedBox = await navRail.boundingBox();
      expect(expandedBox?.width).toBeGreaterThan(200); // Should be around 256px when expanded
    });

    test('should navigate correctly when rail items are clicked', async ({
      page,
    }) => {
      const navRail = page.locator('[aria-label="Navigation rail"]');
      await navRail.hover(); // Expand the rail

      // Test navigation to insights
      const insightsBtn = navRail.locator('button', { hasText: 'Insights' });
      await insightsBtn.click();
      await expect(page).toHaveURL(/.*insights.*/);

      // Test navigation to profile
      const profileBtn = navRail.locator('button', { hasText: 'Profile' });
      await profileBtn.click();
      await expect(page).toHaveURL(/.*profile.*/);
    });

    test('should not show mobile or desktop navigation', async ({ page }) => {
      // Mobile navigation should be hidden
      const bottomNav = page.locator('[aria-label="Bottom navigation"]');
      await expect(bottomNav).toBeHidden();

      // Desktop navigation should be hidden
      const sidebar = page.locator('[aria-label="Main navigation"]');
      await expect(sidebar).toBeHidden();

      const topBar = page.locator('[aria-label="Top navigation bar"]');
      await expect(topBar).toBeHidden();
    });
  });

  test.describe('Desktop Navigation (Sidebar + Top Bar)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
      await page.goto('/');
    });

    test('should display both sidebar and top bar', async ({ page }) => {
      const sidebar = page.locator('[aria-label="Main navigation"]');
      const topBar = page.locator('[aria-label="Top navigation bar"]');

      await expect(sidebar).toBeVisible();
      await expect(topBar).toBeVisible();
    });

    test('should have properly sized sidebar', async ({ page }) => {
      const sidebar = page.locator('[aria-label="Main navigation"]');
      const sidebarBox = await sidebar.boundingBox();

      // Should be 288px wide (w-72)
      expect(sidebarBox?.width).toBeCloseTo(288, 10);
    });

    test('should have functional search in top bar', async ({ page }) => {
      const topBar = page.locator('[aria-label="Top navigation bar"]');
      const searchInput = topBar.locator('input[placeholder*="Search"]');

      await expect(searchInput).toBeVisible();
      await searchInput.fill('test transaction');
      await expect(searchInput).toHaveValue('test transaction');
    });

    test('should navigate correctly from sidebar', async ({ page }) => {
      const sidebar = page.locator('[aria-label="Main navigation"]');

      // Test main section navigation
      const accountsBtn = sidebar.locator('button', { hasText: 'Accounts' });
      await accountsBtn.click();
      await expect(page).toHaveURL(/.*accounts.*/);

      // Test secondary section navigation
      const settingsBtn = sidebar.locator('button', { hasText: 'Settings' });
      await settingsBtn.click();
      await expect(page).toHaveURL(/.*settings.*/);
    });

    test('should have functional top bar actions', async ({ page }) => {
      const topBar = page.locator('[aria-label="Top navigation bar"]');

      // Test profile button
      const profileBtn = topBar.locator('button[aria-label="View profile"]');
      await profileBtn.click();
      await expect(page).toHaveURL(/.*profile.*/);
    });

    test('should not show mobile or tablet navigation', async ({ page }) => {
      // Mobile navigation should be hidden
      const bottomNav = page.locator('[aria-label="Bottom navigation"]');
      await expect(bottomNav).toBeHidden();

      // Tablet navigation should be hidden
      const navRail = page.locator('[aria-label="Navigation rail"]');
      await expect(navRail).toBeHidden();
    });
  });

  test.describe('Responsive Transitions', () => {
    test('should switch navigation correctly when resizing viewport', async ({
      page,
    }) => {
      // Start with desktop
      await page.setViewportSize(viewports.desktop);
      await page.goto('/');

      const sidebar = page.locator('[aria-label="Main navigation"]');
      await expect(sidebar).toBeVisible();

      // Resize to tablet
      await page.setViewportSize(viewports.tablet);
      await page.waitForTimeout(300); // Wait for transition

      const navRail = page.locator('[aria-label="Navigation rail"]');
      await expect(navRail).toBeVisible();
      await expect(sidebar).toBeHidden();

      // Resize to mobile
      await page.setViewportSize(viewports.mobile);
      await page.waitForTimeout(300); // Wait for transition

      const bottomNav = page.locator('[aria-label="Bottom navigation"]');
      await expect(bottomNav).toBeVisible();
      await expect(navRail).toBeHidden();
    });

    test('should maintain navigation state across viewport changes', async ({
      page,
    }) => {
      // Navigate to transactions on desktop
      await page.setViewportSize(viewports.desktop);
      await page.goto('/transactions');

      // Resize to mobile and verify navigation state
      await page.setViewportSize(viewports.mobile);
      await page.waitForTimeout(300);

      const bottomNav = page.locator('[aria-label="Bottom navigation"]');
      const transactionsBtn = bottomNav.locator('button', {
        hasText: 'Transactions',
      });
      await expect(transactionsBtn).toHaveAttribute('aria-current', 'page');
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels across all breakpoints', async ({
      page,
    }) => {
      for (const [breakpoint, viewport] of Object.entries(viewports)) {
        await page.setViewportSize(viewport);
        await page.goto('/');
        await page.waitForTimeout(300);

        // All navigation elements should have proper role and labels
        const navElements = page.locator('[role="navigation"]');
        const navCount = await navElements.count();

        for (let i = 0; i < navCount; i++) {
          const nav = navElements.nth(i);
          if (await nav.isVisible()) {
            await expect(nav).toHaveAttribute('aria-label');
          }
        }
      }
    });

    test('should support keyboard navigation', async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
      await page.goto('/');

      // Focus sidebar and navigate with keyboard
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter'); // Should navigate

      // Verify keyboard accessibility
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });

    test('should have minimum touch target sizes on mobile', async ({
      page,
    }) => {
      await page.setViewportSize(viewports.mobile);
      await page.goto('/');

      const bottomNav = page.locator('[aria-label="Bottom navigation"]');
      const navButtons = bottomNav.locator('button');

      const buttonCount = await navButtons.count();
      for (let i = 0; i < buttonCount; i++) {
        const button = navButtons.nth(i);
        const box = await button.boundingBox();

        // WCAG 2.5.5 - minimum 44x44px touch targets
        expect(box?.width).toBeGreaterThanOrEqual(44);
        expect(box?.height).toBeGreaterThanOrEqual(44);
      }
    });
  });
});
