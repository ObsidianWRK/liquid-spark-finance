import { test, expect, devices } from '@playwright/test';

// Use iPhone 15 viewport
test.use({
  ...devices['iPhone 15'],
  viewport: {
    width: 393,
    height: 852,
  },
});

test.describe('Safe Area Dock Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Dock should respect safe area insets on iPhone 15', async ({
    page,
  }) => {
    // Check that viewport-fit=cover is set
    const viewport = await page.$eval('meta[name="viewport"]', (el) =>
      el.getAttribute('content')
    );
    expect(viewport).toContain('viewport-fit=cover');

    // Get the bottom navigation element
    const bottomNav = await page.locator('.bottom-navigation');
    await expect(bottomNav).toBeVisible();

    // Check that safe-area-bottom class is applied to parent
    const safeAreaParent = await page.locator('.safe-area-bottom');
    await expect(safeAreaParent).toBeVisible();

    // Check computed styles for safe area padding
    const computedStyles = await bottomNav.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        paddingBottom: styles.paddingBottom,
        paddingLeft: styles.paddingLeft,
        paddingRight: styles.paddingRight,
        width: styles.width,
      };
    });

    // Verify no horizontal padding
    expect(computedStyles.paddingLeft).toBe('0px');
    expect(computedStyles.paddingRight).toBe('0px');

    // Verify full width
    expect(computedStyles.width).toBe(`${393}px`); // Should match viewport width

    // Check that dock is positioned at the very bottom
    const dockBounds = await bottomNav.boundingBox();
    const viewportSize = page.viewportSize();

    if (dockBounds && viewportSize) {
      // Dock should extend to the very edges
      expect(dockBounds.x).toBe(0);
      expect(dockBounds.width).toBe(viewportSize.width);
    }

    // Test nav bubble has no horizontal margins
    const navBubble = await page.locator('.ios26-nav-bubble');
    const navBubbleStyles = await navBubble.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        marginLeft: styles.marginLeft,
        marginRight: styles.marginRight,
      };
    });

    expect(navBubbleStyles.marginLeft).toBe('0px');
    expect(navBubbleStyles.marginRight).toBe('0px');
  });

  test('Dock should not overlap with viewport content', async ({ page }) => {
    // Add test content to check for overlaps
    await page.evaluate(() => {
      const testDiv = document.createElement('div');
      testDiv.id = 'test-content';
      testDiv.style.position = 'fixed';
      testDiv.style.bottom = '0';
      testDiv.style.left = '0';
      testDiv.style.right = '0';
      testDiv.style.height = '100px';
      testDiv.style.backgroundColor = 'red';
      testDiv.style.zIndex = '1';
      document.body.appendChild(testDiv);
    });

    // Get dock z-index
    const dockContainer = await page.locator(
      '.fixed.bottom-0.left-0.right-0.z-50'
    );
    const dockZIndex = await dockContainer.evaluate(
      (el) => window.getComputedStyle(el).zIndex
    );

    // Dock should have higher z-index than content
    expect(parseInt(dockZIndex)).toBeGreaterThan(1);

    // Clean up test content
    await page.evaluate(() => {
      document.getElementById('test-content')?.remove();
    });
  });

  test('FAB should be positioned correctly with safe areas', async ({
    page,
  }) => {
    const fab = await page.locator('.liquid-glass-fab');
    await expect(fab).toBeVisible();

    const fabBounds = await fab.boundingBox();
    const viewportSize = page.viewportSize();

    if (fabBounds && viewportSize) {
      // FAB should be positioned above the dock
      expect(fabBounds.y).toBeLessThan(viewportSize.height - 100);

      // FAB should not extend beyond viewport edges
      expect(fabBounds.x + fabBounds.width).toBeLessThanOrEqual(
        viewportSize.width
      );
    }
  });
});

// Additional test for landscape orientation
test.describe('Safe Area Dock Tests - Landscape', () => {
  test.use({
    ...devices['iPhone 15 landscape'],
    viewport: {
      width: 852,
      height: 393,
    },
  });

  test('Dock should remain flush in landscape orientation', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const bottomNav = await page.locator('.bottom-navigation');
    const navBounds = await bottomNav.boundingBox();
    const viewportSize = page.viewportSize();

    if (navBounds && viewportSize) {
      // Should still be full width in landscape
      expect(navBounds.x).toBe(0);
      expect(navBounds.width).toBe(viewportSize.width);
    }
  });
});
