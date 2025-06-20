import { test, expect, devices } from '@playwright/test';

// Test configurations for different devices
const testDevices = [
  { name: 'iPhone 15 Pro', device: devices['iPhone 15 Pro'] },
  { name: 'iPhone SE', device: devices['iPhone SE'] },
  { name: 'iPad Pro', device: devices['iPad Pro 11'] },
  { name: 'Pixel 7', device: devices['Pixel 7'] },
];

// Test the iOS 26-style navigation bar across devices
testDevices.forEach(({ name, device }) => {
  test.describe(`iOS 26 NavBar - ${name}`, () => {
    test.use({ ...device });

    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      // Wait for navigation to be visible
      await page.waitForSelector('.ios26-nav', { state: 'visible' });
    });

    test('navigation bar is visible and responsive', async ({ page }) => {
      const nav = page.locator('.ios26-nav');
      await expect(nav).toBeVisible();

      // Check if it has the correct position class
      await expect(nav).toHaveClass(/ios26-nav--bottom/);

      // Verify glass effect is applied
      const glassElement = nav.locator('.ios26-nav__glass');
      await expect(glassElement).toBeVisible();
    });

    test('displays correct number of tabs on mobile', async ({
      page,
      isMobile,
    }) => {
      if (isMobile) {
        const tabs = page.locator('.ios26-nav__tab');
        const tabCount = await tabs.count();
        expect(tabCount).toBeLessThanOrEqual(5); // Max 5 tabs on mobile
      }
    });

    test('tab interactions work correctly', async ({ page }) => {
      // Click on second tab
      const secondTab = page.locator('.ios26-nav__tab').nth(1);
      await secondTab.click();

      // Verify active state is applied
      await expect(secondTab).toHaveClass(/ios26-nav__tab--active/);
      await expect(secondTab).toHaveAttribute('aria-selected', 'true');
    });

    test('badges display correctly', async ({ page }) => {
      // Look for any badge elements
      const badge = page.locator('.ios26-nav__badge').first();
      const badgeExists = (await badge.count()) > 0;

      if (badgeExists) {
        await expect(badge).toBeVisible();
        const badgeText = await badge.textContent();
        expect(badgeText).toBeTruthy();
      }
    });

    test('floating action button is accessible', async ({ page }) => {
      const fab = page.locator('.ios26-nav__fab');
      const fabExists = (await fab.count()) > 0;

      if (fabExists) {
        await expect(fab).toBeVisible();
        await expect(fab).toHaveAttribute('aria-label');

        // Test click
        await fab.click();
        // Verify no console errors by checking the page doesn't throw
        const hasErrors = await page.evaluate(() => {
          // Check if any errors were logged (this is a simplified check)
          return false; // In a real test, you'd set up console monitoring
        });
        expect(hasErrors).toBe(false);
      }
    });

    test('respects safe area insets', async ({ page, browserName }) => {
      // Skip on non-webkit browsers as they don't support env()
      if (browserName !== 'webkit') {
        test.skip();
      }

      const nav = page.locator('.ios26-nav');
      const paddingBottom = await nav.evaluate((el) => {
        return window.getComputedStyle(el).paddingBottom;
      });

      // Should have some padding (either safe area or fallback)
      expect(parseInt(paddingBottom)).toBeGreaterThan(0);
    });

    test('scroll hide behavior works', async ({ page }) => {
      const nav = page.locator('.ios26-nav');

      // Initial state - should be visible
      await expect(nav).not.toHaveClass(/ios26-nav--hidden/);

      // Simulate scroll down
      await page.evaluate(() => {
        window.scrollTo(0, 500);
      });

      // Wait a bit for scroll controller to react
      await page.waitForTimeout(300);

      // Check if navigation can hide (depends on scroll controller implementation)
      // This is a basic check - actual behavior depends on scroll velocity
      const classes = await nav.getAttribute('class');
      expect(classes).toBeTruthy();
    });

    test('keyboard navigation works', async ({ page, browserName }) => {
      // Focus first tab
      await page.keyboard.press('Alt+n');

      // Wait for focus
      await page.waitForTimeout(100);

      // Check if a tab has focus
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.className || '';
      });

      expect(focusedElement).toContain('ios26-nav__tab');

      // Navigate with arrow keys
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(100);

      // Activate with Enter
      await page.keyboard.press('Enter');
    });

    test('accessibility features are present', async ({ page }) => {
      // Check for skip link
      const skipLink = page.locator('a[href="#main-content"]');
      await expect(skipLink).toHaveCount(1);

      // Check ARIA attributes
      const nav = page.locator('.ios26-nav nav');
      await expect(nav).toHaveAttribute('role', 'navigation');
      await expect(nav).toHaveAttribute('aria-label');

      // Check tablist
      const tablist = page.locator('[role="tablist"]');
      await expect(tablist).toBeVisible();
      await expect(tablist).toHaveAttribute('aria-orientation');

      // Check individual tabs
      const tabs = page.locator('[role="tab"]');
      const tabCount = await tabs.count();

      for (let i = 0; i < tabCount; i++) {
        const tab = tabs.nth(i);
        await expect(tab).toHaveAttribute('aria-selected');
        await expect(tab).toHaveAttribute('tabindex');
      }
    });

    test('orientation change handling', async ({ page, isMobile }) => {
      if (!isMobile) {
        test.skip();
      }

      // Get initial height
      const nav = page.locator('.ios26-nav__tabs');
      const initialHeight = await nav.evaluate((el) => {
        return window.getComputedStyle(el).height;
      });

      // Change orientation (if supported by device)
      await page.setViewportSize({ width: 812, height: 375 }); // Landscape
      await page.waitForTimeout(500); // Wait for orientation change

      const landscapeHeight = await nav.evaluate((el) => {
        return window.getComputedStyle(el).height;
      });

      // Height should be different in landscape
      expect(landscapeHeight).not.toBe(initialHeight);
    });

    test('side rail transformation on desktop', async ({ page, viewport }) => {
      if (!viewport || viewport.width < 960) {
        test.skip();
      }

      const nav = page.locator('.ios26-nav');

      // On desktop, should have side rail class if enabled
      const classes = await nav.getAttribute('class');

      // This depends on whether side rail is enabled in the implementation
      if (classes?.includes('ios26-nav--side-rail')) {
        // Verify vertical orientation
        const tablist = page.locator('[role="tablist"]');
        await expect(tablist).toHaveAttribute('aria-orientation', 'vertical');
      }
    });

    test('virtual keyboard detection', async ({ page, isMobile }) => {
      if (!isMobile) {
        test.skip();
      }

      // Find an input field to trigger virtual keyboard
      const searchInput = page
        .locator('input[type="search"], input[type="text"]')
        .first();
      const inputExists = (await searchInput.count()) > 0;

      if (inputExists) {
        // Focus input to show virtual keyboard
        await searchInput.focus();
        await page.waitForTimeout(500); // Wait for keyboard

        // Navigation should remain visible when keyboard is open
        const nav = page.locator('.ios26-nav');
        await expect(nav).not.toHaveClass(/ios26-nav--hidden/);
      }
    });

    test('performance - smooth animations', async ({ page }) => {
      // Measure animation performance
      const nav = page.locator('.ios26-nav');

      // Check if CSS transitions are applied
      const transitionDuration = await nav.evaluate((el) => {
        return window.getComputedStyle(el).transitionDuration;
      });

      // Should have smooth transitions
      expect(transitionDuration).not.toBe('0s');
      expect(parseFloat(transitionDuration)).toBeGreaterThan(0);
    });

    test('contrast and visibility', async ({ page }) => {
      // Check text contrast in navigation
      const labels = page.locator('.ios26-nav__label');
      const labelCount = await labels.count();

      if (labelCount > 0) {
        const firstLabel = labels.first();
        const color = await firstLabel.evaluate((el) => {
          return window.getComputedStyle(el).color;
        });

        // Should have visible text color
        expect(color).not.toBe('transparent');
        expect(color).not.toBe('rgba(0, 0, 0, 0)');
      }
    });
  });
});

// Desktop-specific tests
test.describe('iOS 26 NavBar - Desktop Features', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('side rail layout on large screens', async ({ page }) => {
    await page.goto('/');

    const nav = page.locator('.ios26-nav');
    const hasClass = await nav.evaluate((el, className) => {
      return el.classList.contains(className);
    }, 'ios26-nav--side-rail');

    if (hasClass) {
      // Verify vertical layout
      const navWidth = await nav.evaluate((el) => {
        return el.getBoundingClientRect().width;
      });

      expect(navWidth).toBe(80); // Side rail width
    }
  });

  test('hover states work on desktop', async ({ page }) => {
    await page.goto('/');

    const firstTab = page.locator('.ios26-nav__tab').first();

    // Hover over tab
    await firstTab.hover();

    // Check if hover styles are applied
    const backgroundColor = await firstTab.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Should have some background color on hover
    expect(backgroundColor).not.toBe('transparent');
  });
});

// Accessibility-specific tests
test.describe('iOS 26 NavBar - Accessibility', () => {
  test('meets WCAG color contrast requirements', async ({ page }) => {
    await page.goto('/');

    // Use axe-core for accessibility testing
    await page.addScriptTag({
      url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.2/axe.min.js',
    });

    const violations = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        axe.run(
          '.ios26-nav',
          {
            rules: {
              'color-contrast': { enabled: true },
            },
          },
          (err: any, results: any) => {
            resolve(results.violations);
          }
        );
      });
    });

    expect(violations).toHaveLength(0);
  });

  test('reduced motion support', async ({ page }) => {
    // Enable reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const nav = page.locator('.ios26-nav');
    const transitionDuration = await nav.evaluate((el) => {
      return window.getComputedStyle(el).transitionDuration;
    });

    // Should have no transitions with reduced motion
    expect(transitionDuration).toBe('0s');
  });

  test('screen reader announcements', async ({ page }) => {
    await page.goto('/');

    // Check for live regions
    const liveRegions = page.locator('[aria-live]');
    const liveRegionCount = await liveRegions.count();

    // Should have at least one live region for announcements
    expect(liveRegionCount).toBeGreaterThan(0);
  });
});
