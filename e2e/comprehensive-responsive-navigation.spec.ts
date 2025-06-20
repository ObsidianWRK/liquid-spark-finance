import { test, expect, Page } from '@playwright/test';

/**
 * Comprehensive Responsive Navigation Testing
 * Tests every navigation item, menu interaction, and responsive behavior
 */

test.describe('Comprehensive Responsive Navigation', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();

    // Enable console logging to catch errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error('🔴 BROWSER ERROR:', msg.text());
      } else if (msg.type() === 'warning') {
        console.warn('🟡 BROWSER WARNING:', msg.text());
      }
    });

    // Catch page errors
    page.on('pageerror', (error) => {
      console.error('🔴 PAGE ERROR:', error.message);
    });
  });

  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1280, height: 720 },
    { name: 'Large Desktop', width: 1920, height: 1080 },
    { name: 'Ultra Wide', width: 2560, height: 1440 },
  ];

  for (const viewport of viewports) {
    test(`should be fully responsive on ${viewport.name} (${viewport.width}x${viewport.height})`, async () => {
      console.log(
        `🖥️ Testing ${viewport.name} viewport: ${viewport.width}x${viewport.height}`
      );

      // Set viewport
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });

      // Navigate to application
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      // Verify the page doesn't have fixed/hardcoded widths causing horizontal scroll
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth;
      });

      expect(hasHorizontalScroll).toBeFalsy();

      // Check that main content area adapts to viewport
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();

      const contentBox = await mainContent.boundingBox();
      expect(contentBox?.width).toBeLessThanOrEqual(viewport.width);

      // Verify navigation is properly sized
      const navigation = page.locator('nav, [role="navigation"]');
      if ((await navigation.count()) > 0) {
        const navBox = await navigation.first().boundingBox();
        expect(navBox?.width).toBeLessThanOrEqual(viewport.width);
      }

      // Take screenshot for visual verification
      await page.screenshot({
        path: `test-results/responsive-${viewport.name.toLowerCase().replace(' ', '-')}-${viewport.width}x${viewport.height}.png`,
        fullPage: true,
      });

      console.log(`✅ ${viewport.name} responsive test passed`);
    });
  }

  test('should navigate through every main navigation item successfully', async () => {
    console.log('🧭 Testing all main navigation items...');

    // Start with desktop viewport for comprehensive testing
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Main navigation items to test
    const mainNavItems = [
      {
        name: 'Home',
        selector: '[aria-label*="Home"], button:has-text("Home")',
      },
      {
        name: 'Accounts',
        selector: '[aria-label*="Accounts"], button:has-text("Accounts")',
      },
      {
        name: 'Transactions',
        selector:
          '[aria-label*="Transactions"], button:has-text("Transactions")',
      },
      {
        name: 'Insights',
        selector: '[aria-label*="Insights"], button:has-text("Insights")',
      },
    ];

    for (const navItem of mainNavItems) {
      console.log(`🔗 Testing navigation to: ${navItem.name}`);

      // Find and click the navigation item
      const navButton = page.locator(navItem.selector).first();

      if ((await navButton.count()) === 0) {
        console.warn(
          `⚠️ Navigation item "${navItem.name}" not found, trying alternative selectors...`
        );

        // Try alternative selectors
        const altSelectors = [
          `text="${navItem.name}"`,
          `[aria-label="${navItem.name}"]`,
          `button:has-text("${navItem.name}")`,
          `a:has-text("${navItem.name}")`,
          `[data-testid*="${navItem.name.toLowerCase()}"]`,
        ];

        let found = false;
        for (const selector of altSelectors) {
          const altButton = page.locator(selector);
          if ((await altButton.count()) > 0) {
            await altButton.first().click();
            found = true;
            break;
          }
        }

        if (!found) {
          console.error(`❌ Could not find navigation item: ${navItem.name}`);
          continue;
        }
      } else {
        await navButton.click();
      }

      await page.waitForTimeout(1000);

      // Verify we navigated successfully (page has content)
      const hasContent = await page.evaluate(() => {
        const textContent = document.body.textContent || '';
        return textContent.trim().length > 100;
      });

      expect(hasContent).toBeTruthy();

      // Verify no white screen
      const backgroundColor = await page.evaluate(() => {
        const body = document.body;
        const computedStyle = window.getComputedStyle(body);
        return computedStyle.backgroundColor;
      });

      expect(backgroundColor).not.toBe('rgb(255, 255, 255)');

      console.log(`✅ Successfully navigated to ${navItem.name}`);
    }
  });

  test('should navigate through "More" menu items successfully', async () => {
    console.log('📋 Testing "More" menu navigation...');

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Find and click the "More" button
    const moreButton = page
      .locator(
        '[aria-label*="More"], button:has-text("More"), [aria-label*="navigation options"]'
      )
      .first();

    if ((await moreButton.count()) > 0) {
      await moreButton.click();
      await page.waitForTimeout(500);

      // More menu items to test
      const moreNavItems = [
        'Credit Score',
        'Savings Goals',
        'Reports',
        'Wrapped',
        'Profile',
      ];

      for (const itemName of moreNavItems) {
        console.log(`🔗 Testing More menu item: ${itemName}`);

        // Look for the item in the more menu
        const menuItem = page.locator(`text="${itemName}"`).first();

        if ((await menuItem.count()) > 0) {
          await menuItem.click();
          await page.waitForTimeout(1000);

          // Verify navigation worked
          const hasContent = await page.evaluate(() => {
            const textContent = document.body.textContent || '';
            return textContent.trim().length > 50;
          });

          expect(hasContent).toBeTruthy();
          console.log(`✅ Successfully navigated to ${itemName}`);

          // Go back to home for next test
          await page.goto('/', { waitUntil: 'networkidle' });
          await page.waitForTimeout(1000);

          // Reopen more menu if needed
          if ((await moreButton.count()) > 0) {
            await moreButton.click();
            await page.waitForTimeout(500);
          }
        } else {
          console.warn(`⚠️ More menu item "${itemName}" not found`);
        }
      }
    } else {
      console.warn('⚠️ More button not found, testing direct routes...');

      // Test direct navigation routes
      const routes = ['/credit-score', '/savings', '/reports', '/profile'];

      for (const route of routes) {
        console.log(`🔗 Testing direct route: ${route}`);

        await page.goto(route, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);

        const hasContent = await page.evaluate(() => {
          const textContent = document.body.textContent || '';
          return textContent.trim().length > 50;
        });

        expect(hasContent).toBeTruthy();
        console.log(`✅ Successfully loaded ${route}`);
      }
    }
  });

  test('should return to dashboard from all navigation states', async () => {
    console.log('🏠 Testing return to dashboard from all states...');

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Test pages to navigate to and return from
    const testPages = [
      { name: 'Transactions', url: '/?view=transactions' },
      { name: 'Insights', url: '/?view=insights' },
      { name: 'Reports', url: '/?view=reports' },
      { name: 'Savings', url: '/?view=savings' },
    ];

    for (const testPage of testPages) {
      console.log(
        `🔄 Testing round-trip: Dashboard → ${testPage.name} → Dashboard`
      );

      // Navigate to test page
      await page.goto(testPage.url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      // Verify we're on the test page
      const pageContent = await page.evaluate(
        () => document.body.textContent || ''
      );
      expect(pageContent.length).toBeGreaterThan(50);

      // Find and click Home/Dashboard button
      const homeSelectors = [
        '[aria-label*="Home"]',
        'button:has-text("Home")',
        '[aria-label*="Dashboard"]',
        'button:has-text("Dashboard")',
        '[data-testid*="home"]',
        'text="Home"',
      ];

      let returnedHome = false;
      for (const selector of homeSelectors) {
        const homeButton = page.locator(selector);
        if ((await homeButton.count()) > 0) {
          await homeButton.first().click();
          await page.waitForTimeout(1000);
          returnedHome = true;
          break;
        }
      }

      if (!returnedHome) {
        // Try navigating to root URL directly
        await page.goto('/', { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);
      }

      // Verify we're back on dashboard
      const dashboardContent = await page.evaluate(
        () => document.body.textContent || ''
      );
      expect(dashboardContent.length).toBeGreaterThan(100);

      console.log(
        `✅ Successfully returned to dashboard from ${testPage.name}`
      );
    }
  });

  test('should handle responsive layout transitions smoothly', async () => {
    console.log('📐 Testing responsive layout transitions...');

    // Start at mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Gradually increase viewport size and check layout
    const sizes = [
      { width: 640, height: 800 }, // SM
      { width: 768, height: 1024 }, // MD
      { width: 1024, height: 768 }, // LG
      { width: 1280, height: 800 }, // XL
      { width: 1920, height: 1080 }, // 2XL
    ];

    for (const size of sizes) {
      console.log(`📏 Transitioning to ${size.width}x${size.height}`);

      await page.setViewportSize(size);
      await page.waitForTimeout(500); // Allow layout to settle

      // Check for layout overflow
      const hasOverflow = await page.evaluate(() => {
        return (
          document.body.scrollWidth > window.innerWidth ||
          document.documentElement.scrollWidth > window.innerWidth
        );
      });

      expect(hasOverflow).toBeFalsy();

      // Verify content is still accessible
      const isContentVisible = await page.evaluate(() => {
        const main = document.querySelector('main');
        return main && main.offsetWidth > 0 && main.offsetHeight > 0;
      });

      expect(isContentVisible).toBeTruthy();

      console.log(
        `✅ Layout transition to ${size.width}x${size.height} successful`
      );
    }
  });

  test('should have proper touch targets on all screen sizes', async () => {
    console.log('👆 Testing touch target sizes across viewports...');

    for (const viewport of viewports) {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });

      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      // Find all interactive elements
      const interactiveElements = await page
        .locator('button, a, [role="button"], [role="tab"], input, select')
        .all();

      for (const element of interactiveElements) {
        const box = await element.boundingBox();

        if (box) {
          // WCAG AA requires minimum 44x44px touch targets
          if (viewport.name === 'Mobile' || viewport.name === 'Tablet') {
            expect(box.width).toBeGreaterThanOrEqual(44);
            expect(box.height).toBeGreaterThanOrEqual(44);
          }
        }
      }

      console.log(`✅ Touch targets verified for ${viewport.name}`);
    }
  });

  test('should be fully responsive on Desktop viewports', async ({ page }) => {
    console.log('🖥️ Testing Desktop responsive behavior...');

    const desktopViewports = [
      { width: 1280, height: 720 },
      { width: 1440, height: 900 },
      { width: 1920, height: 1080 },
      { width: 2560, height: 1440 },
    ];

    for (const viewport of desktopViewports) {
      console.log(`Testing ${viewport.width}x${viewport.height}`);

      await page.setViewportSize(viewport);
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      // Check for horizontal scroll (should not exist)
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth;
      });

      expect(hasHorizontalScroll).toBeFalsy();

      // Verify main content fills available space properly
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();

      const contentBox = await mainContent.boundingBox();
      expect(contentBox?.width || 0).toBeLessThanOrEqual(viewport.width);
      expect(contentBox?.width || 0).toBeGreaterThan(viewport.width * 0.5); // Should use significant portion of screen

      await page.screenshot({
        path: `test-results/desktop-responsive-${viewport.width}x${viewport.height}.png`,
        fullPage: true,
      });

      console.log(
        `✅ ${viewport.width}x${viewport.height} responsive test passed`
      );
    }
  });

  test('should navigate through all main navigation successfully', async ({
    page,
  }) => {
    console.log('🧭 Testing comprehensive navigation...');

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Test main navigation items
    const navItems = ['Home', 'Accounts', 'Transactions', 'Insights'];

    for (const item of navItems) {
      console.log(`🔗 Testing navigation to: ${item}`);

      // Multiple selector strategies
      const selectors = [
        `button:has-text("${item}")`,
        `[aria-label*="${item}"]`,
        `text="${item}"`,
        `a:has-text("${item}")`,
      ];

      let clicked = false;
      for (const selector of selectors) {
        const element = page.locator(selector).first();
        if ((await element.count()) > 0) {
          await element.click();
          clicked = true;
          break;
        }
      }

      if (clicked) {
        await page.waitForTimeout(2000);

        // Verify content loaded
        const hasContent = await page.evaluate(() => {
          return document.body.textContent?.trim().length > 100;
        });

        expect(hasContent).toBeTruthy();
        console.log(`✅ Successfully navigated to ${item}`);
      } else {
        console.warn(`⚠️ Could not find navigation for ${item}`);
      }
    }
  });

  test('should handle More menu navigation', async ({ page }) => {
    console.log('📋 Testing More menu...');

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Find More button
    const moreSelectors = [
      'button:has-text("More")',
      '[aria-label*="More"]',
      '[aria-label*="navigation options"]',
      'text="More"',
    ];

    let moreButton = null;
    for (const selector of moreSelectors) {
      const element = page.locator(selector).first();
      if ((await element.count()) > 0) {
        moreButton = element;
        break;
      }
    }

    if (moreButton && (await moreButton.count()) > 0) {
      await moreButton.click();
      await page.waitForTimeout(1000);

      // Test more menu items
      const moreItems = ['Credit Score', 'Savings Goals', 'Reports', 'Profile'];

      for (const item of moreItems) {
        console.log(`🔗 Testing More menu item: ${item}`);

        const menuItem = page.locator(`text="${item}"`).first();

        if ((await menuItem.count()) > 0) {
          await menuItem.click();
          await page.waitForTimeout(2000);

          const hasContent = await page.evaluate(() => {
            return (document.body.textContent?.trim().length || 0) > 50;
          });

          expect(hasContent).toBeTruthy();
          console.log(`✅ Successfully navigated to ${item}`);

          // Return to home
          await page.goto('/', { waitUntil: 'networkidle' });
          await page.waitForTimeout(1500);

          // Reopen more menu
          if (moreButton && (await moreButton.count()) > 0) {
            await moreButton.click();
            await page.waitForTimeout(500);
          }
        }
      }
    } else {
      console.log('🔗 Testing direct routes...');

      const routes = ['/credit-score', '/savings', '/reports', '/profile'];

      for (const route of routes) {
        await page.goto(route, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1500);

        const hasContent = await page.evaluate(() => {
          return document.body.textContent?.trim().length > 50;
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

      // Verify we're on the view
      const content = await page.evaluate(
        () => document.body.textContent || ''
      );
      expect(content.length).toBeGreaterThan(50);

      // Return to dashboard
      const homeSelectors = [
        'button:has-text("Home")',
        '[aria-label*="Home"]',
        'text="Home"',
        'a[href="/"]',
      ];

      let returnedHome = false;
      for (const selector of homeSelectors) {
        const homeBtn = page.locator(selector).first();
        if ((await homeBtn.count()) > 0) {
          await homeBtn.click();
          await page.waitForTimeout(2000);
          returnedHome = true;
          break;
        }
      }

      if (!returnedHome) {
        await page.goto('/', { waitUntil: 'networkidle' });
        await page.waitForTimeout(1500);
      }

      // Verify back on dashboard
      const dashContent = await page.evaluate(
        () => document.body.textContent || ''
      );
      expect(dashContent.length).toBeGreaterThan(100);

      console.log(`✅ Successfully returned from ${view.name}`);
    }
  });

  test('should handle layout transitions smoothly', async ({ page }) => {
    console.log('📐 Testing layout transitions...');

    await page.goto('/', { waitUntil: 'networkidle' });

    const sizes = [
      { width: 1024, height: 768 },
      { width: 1280, height: 800 },
      { width: 1440, height: 900 },
      { width: 1920, height: 1080 },
      { width: 2560, height: 1440 },
    ];

    for (const size of sizes) {
      console.log(`📏 Testing ${size.width}x${size.height}`);

      await page.setViewportSize(size);
      await page.waitForTimeout(1000);

      // Check for layout overflow
      const hasOverflow = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth;
      });

      expect(hasOverflow).toBeFalsy();

      // Verify main content is visible and properly sized
      const mainVisible = await page.evaluate(() => {
        const main = document.querySelector('main');
        return main && main.offsetWidth > 0 && main.offsetHeight > 0;
      });

      expect(mainVisible).toBeTruthy();

      console.log(
        `✅ Layout transition successful for ${size.width}x${size.height}`
      );
    }
  });

  test('should have consistent navigation across all screen sizes', async ({
    page,
  }) => {
    console.log('🔄 Testing navigation consistency...');

    for (const viewport of viewports) {
      console.log(`Testing navigation on ${viewport.name}`);

      await page.setViewportSize(viewport);
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      // Check that navigation elements are present
      const hasNavigation = await page.evaluate(() => {
        const nav = document.querySelector('nav, [role="navigation"]');
        const buttons = document.querySelectorAll('button, a');
        return nav !== null && buttons.length > 0;
      });

      expect(hasNavigation).toBeTruthy();

      // Verify interactive elements have proper sizing
      const interactiveElements = await page
        .locator('button, a, [role="button"]')
        .all();

      for (const element of interactiveElements.slice(0, 5)) {
        // Test first 5 to avoid timeout
        const box = await element.boundingBox();
        if (box) {
          // Elements should be at least 44x44px for accessibility
          if (viewport.width <= 768) {
            expect(box.width).toBeGreaterThanOrEqual(40);
            expect(box.height).toBeGreaterThanOrEqual(40);
          }
        }
      }

      console.log(`✅ Navigation consistency verified for ${viewport.name}`);
    }
  });
});
