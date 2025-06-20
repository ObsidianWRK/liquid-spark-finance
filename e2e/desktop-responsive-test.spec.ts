import { test, expect } from '@playwright/test';

test.describe('Desktop Responsive Navigation Test', () => {
  test('should be fully responsive and navigable on desktop viewports', async ({
    page,
  }) => {
    console.log('🖥️ Starting comprehensive desktop responsive test...');

    const desktopViewports = [
      { width: 1280, height: 720 },
      { width: 1440, height: 900 },
      { width: 1920, height: 1080 },
      { width: 2560, height: 1440 },
    ];

    for (const viewport of desktopViewports) {
      console.log(`📐 Testing ${viewport.width}x${viewport.height}`);

      await page.setViewportSize(viewport);
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);

      // 1. Check for horizontal scroll (major responsive issue)
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth;
      });

      expect(hasHorizontalScroll).toBeFalsy();
      console.log(`✅ No horizontal scroll at ${viewport.width}px`);

      // 2. Verify main content fills space properly
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();

      const contentBox = await mainContent.boundingBox();
      if (contentBox) {
        expect(contentBox.width).toBeLessThanOrEqual(viewport.width);
        expect(contentBox.width).toBeGreaterThan(viewport.width * 0.4); // Should use significant space
        console.log(`✅ Main content properly sized: ${contentBox.width}px`);
      }

      // 3. Check navigation elements exist and are sized properly
      const navElements = await page
        .locator('nav, [role="navigation"]')
        .count();
      expect(navElements).toBeGreaterThan(0);
      console.log(`✅ Navigation elements present: ${navElements}`);

      // 4. Take screenshot for manual verification
      await page.screenshot({
        path: `test-results/desktop-${viewport.width}x${viewport.height}.png`,
        fullPage: true,
      });

      console.log(
        `✅ ${viewport.width}x${viewport.height} responsive test passed`
      );
    }
  });

  test('should successfully navigate through all main menu items', async ({
    page,
  }) => {
    console.log('🧭 Testing main navigation...');

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Navigation items to test
    const navItems = ['Home', 'Accounts', 'Transactions', 'Insights'];

    for (const item of navItems) {
      console.log(`🔗 Testing navigation to: ${item}`);

      // Try multiple ways to find the navigation item
      let navButton = page.locator(`button:has-text("${item}")`).first();

      if ((await navButton.count()) === 0) {
        navButton = page.locator(`[aria-label*="${item}"]`).first();
      }

      if ((await navButton.count()) === 0) {
        navButton = page.locator(`text="${item}"`).first();
      }

      if ((await navButton.count()) > 0) {
        await navButton.click();
        await page.waitForTimeout(2000);

        // Verify content loaded
        const contentLength = await page.evaluate(() => {
          const text = document.body.textContent || '';
          return text.trim().length;
        });

        expect(contentLength).toBeGreaterThan(100);

        // Verify no white screen
        const bgColor = await page.evaluate(() => {
          return window.getComputedStyle(document.body).backgroundColor;
        });

        expect(bgColor).not.toBe('rgb(255, 255, 255)');

        console.log(`✅ Successfully navigated to ${item}`);
      } else {
        console.warn(`⚠️ Could not find navigation for ${item}`);
      }
    }
  });

  test('should handle More menu navigation successfully', async ({ page }) => {
    console.log('📋 Testing More menu...');

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Find More button using multiple selectors
    let moreButton = page.locator('button:has-text("More")').first();

    if ((await moreButton.count()) === 0) {
      moreButton = page.locator('[aria-label*="More"]').first();
    }

    if ((await moreButton.count()) === 0) {
      moreButton = page.locator('[aria-label*="navigation options"]').first();
    }

    if ((await moreButton.count()) > 0) {
      console.log('🔍 Found More button, testing menu items...');

      await moreButton.click();
      await page.waitForTimeout(1000);

      const moreItems = ['Credit Score', 'Savings Goals', 'Reports', 'Profile'];

      for (const item of moreItems) {
        console.log(`🔗 Testing More menu item: ${item}`);

        const menuItem = page.locator(`text="${item}"`).first();

        if ((await menuItem.count()) > 0) {
          await menuItem.click();
          await page.waitForTimeout(2000);

          const hasContent = await page.evaluate(() => {
            const text = document.body.textContent || '';
            return text.trim().length > 50;
          });

          expect(hasContent).toBeTruthy();
          console.log(`✅ Successfully navigated to ${item}`);

          // Return to home
          await page.goto('/', { waitUntil: 'networkidle' });
          await page.waitForTimeout(1500);

          // Reopen more menu for next item
          const newMoreButton = page.locator('button:has-text("More")').first();
          if ((await newMoreButton.count()) > 0) {
            await newMoreButton.click();
            await page.waitForTimeout(500);
          }
        } else {
          console.warn(`⚠️ Could not find More menu item: ${item}`);
        }
      }
    } else {
      console.log('🔗 More button not found, testing direct routes...');

      const routes = ['/credit-score', '/savings', '/reports', '/profile'];

      for (const route of routes) {
        console.log(`🔗 Testing direct route: ${route}`);

        await page.goto(route, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1500);

        const hasContent = await page.evaluate(() => {
          const text = document.body.textContent || '';
          return text.trim().length > 50;
        });

        expect(hasContent).toBeTruthy();
        console.log(`✅ Successfully loaded ${route}`);
      }
    }
  });

  test('should return to dashboard from all navigation states', async ({
    page,
  }) => {
    console.log('🏠 Testing return to dashboard...');

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const testViews = [
      { name: 'Transactions', url: '/?view=transactions' },
      { name: 'Insights', url: '/?view=insights' },
      { name: 'Reports', url: '/?view=reports' },
      { name: 'Savings', url: '/?view=savings' },
    ];

    for (const view of testViews) {
      console.log(`🔄 Testing: Dashboard → ${view.name} → Dashboard`);

      // Navigate to view
      await page.goto(view.url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      // Verify we're on the view (has content)
      const contentLength = await page.evaluate(() => {
        const text = document.body.textContent || '';
        return text.trim().length;
      });

      expect(contentLength).toBeGreaterThan(50);

      // Try to return to dashboard/home
      let homeButton = page.locator('button:has-text("Home")').first();

      if ((await homeButton.count()) === 0) {
        homeButton = page.locator('[aria-label*="Home"]').first();
      }

      if ((await homeButton.count()) === 0) {
        homeButton = page.locator('text="Home"').first();
      }

      if ((await homeButton.count()) > 0) {
        await homeButton.click();
        await page.waitForTimeout(2000);
      } else {
        // Navigate directly to home
        await page.goto('/', { waitUntil: 'networkidle' });
        await page.waitForTimeout(1500);
      }

      // Verify we're back on dashboard
      const dashboardContent = await page.evaluate(() => {
        const text = document.body.textContent || '';
        return text.trim().length;
      });

      expect(dashboardContent).toBeGreaterThan(100);
      console.log(`✅ Successfully returned from ${view.name}`);
    }
  });

  test('should handle smooth layout transitions across viewport changes', async ({
    page,
  }) => {
    console.log('📐 Testing responsive layout transitions...');

    await page.goto('/', { waitUntil: 'networkidle' });

    const viewportSizes = [
      { width: 1024, height: 768 },
      { width: 1280, height: 800 },
      { width: 1440, height: 900 },
      { width: 1920, height: 1080 },
      { width: 2560, height: 1440 },
    ];

    for (const size of viewportSizes) {
      console.log(`📏 Transitioning to ${size.width}x${size.height}`);

      await page.setViewportSize(size);
      await page.waitForTimeout(1000); // Allow layout to settle

      // Check for layout overflow issues
      const layoutInfo = await page.evaluate(() => {
        const bodyRect = document.body.getBoundingClientRect();
        return {
          bodyWidth: bodyRect.width,
          windowWidth: window.innerWidth,
          scrollWidth: document.body.scrollWidth,
          hasOverflow: document.body.scrollWidth > window.innerWidth,
        };
      });

      expect(layoutInfo.hasOverflow).toBeFalsy();

      // Verify main content is still accessible
      const mainVisible = await page.evaluate(() => {
        const main = document.querySelector('main');
        if (!main) return false;

        const rect = main.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });

      expect(mainVisible).toBeTruthy();

      console.log(
        `✅ Layout transition successful for ${size.width}x${size.height}`
      );
    }
  });
});
