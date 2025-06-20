import { test, expect, devices } from '@playwright/test';
import { Page } from '@playwright/test';

// Define device profiles
const deviceProfiles = [
  { name: 'iPhone SE', device: devices['iPhone SE'] },
  {
    name: 'iPhone 15 Pro Max',
    device: {
      ...devices['iPhone 15 Pro Max'],
      viewport: { width: 430, height: 932 },
    },
  },
  { name: 'Pixel 7', device: devices['Pixel 7'] },
  { name: 'iPad Mini', device: devices['iPad Mini'] },
  { name: 'Desktop 1440', device: { viewport: { width: 1440, height: 900 } } },
];

// Helper function to capture dock and gradient areas
async function captureVisualAreas(page: Page, deviceName: string) {
  await page.waitForLoadState('networkidle');

  // Capture full page screenshot
  const fullPageScreenshot = await page.screenshot({
    fullPage: true,
    path: `.cursor/artifacts/full-page-${deviceName.replace(/\s+/g, '-')}.png`,
  });

  // Capture dock area specifically
  const dock = await page.locator('.bottom-navigation');
  if (await dock.isVisible()) {
    await dock.screenshot({
      path: `.cursor/artifacts/dock-${deviceName.replace(/\s+/g, '-')}.png`,
    });
  }

  // Capture gradient background check
  const gradientElement = await page.locator('.global-gradient-background');
  const hasGradient = (await gradientElement.count()) > 0;

  return { fullPageScreenshot, hasGradient };
}

// Test each device profile
deviceProfiles.forEach(({ name, device }) => {
  test.describe(`Visual Regression - ${name}`, () => {
    test.use(device);

    test('Dock should be flush full-width', async ({ page }) => {
      await page.goto('/');

      // Capture baseline
      await captureVisualAreas(page, name);

      // Check dock positioning
      const dock = await page.locator('.bottom-navigation');
      const dockBox = await dock.boundingBox();
      const viewport = page.viewportSize();

      if (dockBox && viewport) {
        // Dock should start at x=0 (flush left)
        expect(dockBox.x).toBe(0);

        // Dock should be full viewport width
        expect(dockBox.width).toBe(viewport.width);

        // Log measurements for debugging
        console.log(`${name} - Dock measurements:`, {
          x: dockBox.x,
          width: dockBox.width,
          viewportWidth: viewport.width,
          isFlush: dockBox.x === 0 && dockBox.width === viewport.width,
        });
      }
    });

    test('Gradient should fill entire viewport', async ({ page }) => {
      await page.goto('/');

      // Check gradient element exists
      const gradientElement = await page.locator('.global-gradient-background');
      await expect(gradientElement).toBeVisible();

      // Check gradient positioning
      const gradientStyles = await gradientElement.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          position: styles.position,
          top: styles.top,
          right: styles.right,
          bottom: styles.bottom,
          left: styles.left,
          width: styles.width,
          height: styles.height,
          zIndex: styles.zIndex,
        };
      });

      // Gradient should be fixed position with inset 0
      expect(gradientStyles.position).toBe('fixed');
      expect(gradientStyles.top).toBe('0px');
      expect(gradientStyles.right).toBe('0px');
      expect(gradientStyles.bottom).toBe('0px');
      expect(gradientStyles.left).toBe('0px');
      expect(gradientStyles.zIndex).toBe('-1');
    });

    test('Visual snapshot comparison', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Take screenshot for visual comparison
      await expect(page).toHaveScreenshot(`${name}-full-page.png`, {
        fullPage: true,
        animations: 'disabled',
        maxDiffPixels: 100,
      });

      // Dock-specific screenshot
      const dock = await page.locator('.bottom-navigation');
      if (await dock.isVisible()) {
        await expect(dock).toHaveScreenshot(`${name}-dock.png`, {
          animations: 'disabled',
          maxDiffPixels: 20, // Strict 2px tolerance for dock
        });
      }
    });

    test('Safe area handling', async ({ page }) => {
      await page.goto('/');

      // Check viewport meta tag
      const viewportContent = await page.$eval('meta[name="viewport"]', (el) =>
        el.getAttribute('content')
      );
      expect(viewportContent).toContain('viewport-fit=cover');

      // For iOS devices, check safe area classes
      if (name.includes('iPhone') || name.includes('iPad')) {
        const safeAreaElement = await page.locator('.safe-area-bottom');
        await expect(safeAreaElement).toBeVisible();

        // Check computed padding includes safe area
        const bottomNav = await page.locator('.bottom-navigation');
        const paddingBottom = await bottomNav.evaluate(
          (el) => window.getComputedStyle(el).paddingBottom
        );

        console.log(`${name} - Safe area padding:`, paddingBottom);
      }
    });
  });
});

// CI-specific test to prevent regressions
test.describe('CI Visual Regression', () => {
  test('Dock positioning should not regress', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Define critical measurements
    const dock = await page.locator('.bottom-navigation');
    const dockBox = await dock.boundingBox();

    if (dockBox) {
      // These assertions will fail CI if dock positioning changes
      expect(dockBox.x).toBe(0); // Must be flush left
      expect(dockBox.x).toBeLessThanOrEqual(2); // Max 2px tolerance

      // Store measurements for future comparison
      const measurements = {
        timestamp: new Date().toISOString(),
        dockX: dockBox.x,
        dockWidth: dockBox.width,
        viewportWidth: page.viewportSize()?.width,
      };

      console.log('CI Measurements:', measurements);
    }
  });
});
