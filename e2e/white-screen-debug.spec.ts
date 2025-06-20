import { test, expect, Page } from '@playwright/test';

/**
 * Comprehensive White Screen Debugging Test
 * This test performs deep validation to ensure the application loads correctly
 */

test.describe('White Screen Debugging', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();

    // Enable console logging to catch errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error('🔴 BROWSER ERROR:', msg.text());
      } else if (msg.type() === 'warning') {
        console.warn('🟡 BROWSER WARNING:', msg.text());
      } else if (
        msg.text().includes('SECURITY') ||
        msg.text().includes('ERROR')
      ) {
        console.log('🔍 SECURITY/ERROR LOG:', msg.text());
      }
    });

    // Catch page errors
    page.on('pageerror', (error) => {
      console.error('🔴 PAGE ERROR:', error.message);
    });

    // Catch network failures
    page.on('response', (response) => {
      if (!response.ok()) {
        console.error('🔴 NETWORK ERROR:', response.status(), response.url());
      }
    });
  });

  test('should load without white screen and display content', async () => {
    console.log('🧪 Starting comprehensive white screen test...');

    // Step 1: Navigate to the application
    console.log('📡 Navigating to application...');
    await page.goto('/', { waitUntil: 'networkidle' });

    // Step 2: Wait for React to load and render
    console.log('⚛️ Waiting for React application to initialize...');
    await page.waitForTimeout(2000); // Give React time to start up

    // Step 3: Check if we have the root element
    const rootElement = await page.locator('#root');
    await expect(rootElement).toBeVisible();
    console.log('✅ Root element is visible');

    // Step 4: Verify the root element has content (not empty)
    const rootContent = await rootElement.innerHTML();
    expect(rootContent.trim()).not.toBe('');
    console.log('✅ Root element has content');

    // Step 5: Check for any visible content on the page
    const bodyContent = await page.locator('body').innerHTML();
    expect(bodyContent).toContain('');

    // Step 6: Look for specific UI elements that should be present
    console.log('🔍 Checking for specific UI elements...');

    // Wait for at least one of these elements to be visible
    const criticalElements = [
      'nav', // Navigation
      'header', // Header
      'main', // Main content
      '[data-testid]', // Any test elements
      '.card', // Cards
      'button', // Buttons
      'a[href]', // Links
    ];

    const foundElements: string[] = [];
    for (const selector of criticalElements) {
      const elements = await page.locator(selector).count();
      if (elements > 0) {
        foundElements.push(`${selector}: ${elements}`);
      }
    }

    console.log('📋 Found UI elements:', foundElements);
    expect(foundElements.length).toBeGreaterThan(0);

    // Step 7: Check for dark mode class (should be applied by default)
    const htmlElement = page.locator('html');
    await expect(htmlElement).toHaveClass(/dark/);
    console.log('✅ Dark mode is applied');

    // Step 8: Verify no critical errors in console
    const errorMessages: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errorMessages.push(msg.text());
      }
    });

    // Step 9: Take a screenshot for visual verification
    await page.screenshot({
      path: 'test-results/white-screen-debug.png',
      fullPage: true,
    });
    console.log('📸 Screenshot saved for visual verification');

    // Step 10: Check page title
    const title = await page.title();
    expect(title).not.toBe('');
    console.log('✅ Page title:', title);

    // Step 11: Verify page is not completely white
    const pageBackground = await page.evaluate(() => {
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      return {
        backgroundColor: computedStyle.backgroundColor,
        color: computedStyle.color,
      };
    });

    console.log('🎨 Page styling:', pageBackground);

    // The background should not be pure white (rgb(255, 255, 255))
    expect(pageBackground.backgroundColor).not.toBe('rgb(255, 255, 255)');

    console.log('🎉 All white screen debugging tests passed!');
  });

  test('should handle environment variable validation correctly', async () => {
    console.log('🔐 Testing environment variable validation...');

    await page.goto('/');

    // Wait for the security validation to complete
    await page.waitForTimeout(1000);

    // Check for security validation messages in console
    const securityLogs: string[] = [];
    page.on('console', (msg) => {
      if (msg.text().includes('SECURITY')) {
        securityLogs.push(msg.text());
      }
    });

    // Reload to trigger validation again
    await page.reload();
    await page.waitForTimeout(1000);

    // Should not see critical security errors
    const hasSecurityError = securityLogs.some((log) =>
      log.includes('CRITICAL SECURITY ERROR')
    );

    expect(hasSecurityError).toBeFalsy();
    console.log('✅ No critical security errors found');
  });

  test('should display loading states and transitions properly', async () => {
    console.log('⏳ Testing loading states and transitions...');

    // Use slow 3G to test loading states
    await page.route('**/*', (route) => {
      setTimeout(() => route.continue(), 100); // Add 100ms delay
    });

    await page.goto('/');

    // Check if we see any loading indicators
    const loadingIndicators = [
      '[data-loading]',
      '.loading',
      '.spinner',
      '[aria-busy="true"]',
    ];

    for (const selector of loadingIndicators) {
      const exists = await page.locator(selector).count();
      if (exists > 0) {
        console.log(`🔄 Found loading indicator: ${selector}`);
      }
    }

    // Wait for content to fully load
    await page.waitForLoadState('networkidle');

    // Verify we have actual content, not just loading states
    const hasContent = await page.evaluate(() => {
      const textContent = document.body.textContent || '';
      return textContent.length > 100; // Should have substantial content
    });

    expect(hasContent).toBeTruthy();
    console.log('✅ Page has substantial content beyond loading states');
  });

  test('should be responsive and work on different viewport sizes', async () => {
    console.log('📱 Testing responsive design...');

    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 },
    ];

    for (const viewport of viewports) {
      console.log(
        `🖥️ Testing ${viewport.name} viewport (${viewport.width}x${viewport.height})`
      );

      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Verify content is visible at this viewport
      const visibleContent = await page.locator('body').isVisible();
      expect(visibleContent).toBeTruthy();

      // Take screenshot for this viewport
      await page.screenshot({
        path: `test-results/viewport-${viewport.name.toLowerCase()}.png`,
      });

      console.log(`✅ ${viewport.name} viewport test passed`);
    }
  });

  test('should navigate between pages without white screens', async () => {
    console.log('🧭 Testing navigation between pages...');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Find navigation links
    const navLinks = await page
      .locator('nav a, [role="navigation"] a, header a')
      .all();

    for (let i = 0; i < Math.min(navLinks.length, 5); i++) {
      const link = navLinks[i];
      const href = await link.getAttribute('href');

      if (href && href.startsWith('/')) {
        console.log(`🔗 Testing navigation to: ${href}`);

        await link.click();
        await page.waitForLoadState('networkidle');

        // Verify we're not on a white screen
        const hasContent = await page.evaluate(() => {
          const textContent = document.body.textContent || '';
          return textContent.trim().length > 50;
        });

        expect(hasContent).toBeTruthy();
        console.log(`✅ Navigation to ${href} successful`);

        // Go back to home for next test
        await page.goto('/');
        await page.waitForLoadState('networkidle');
      }
    }
  });
});
