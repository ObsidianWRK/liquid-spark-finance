import { test, expect } from '@playwright/test';

test.describe('FeatureCloud Navigation', () => {
  test.setTimeout(60000); // Increase timeout to 60 seconds per test

  // Test configuration
  const features = [
    { text: 'Smart Banking', route: 'accounts', expectedTitle: 'Accounts' },
    {
      text: 'AI Insights',
      route: 'insights',
      expectedTitle: 'Financial Insights',
    },
    {
      text: 'Investment',
      route: 'investments',
      expectedTitle: 'Investment Portfolio',
    },
    { text: 'Budgeting', route: 'budget', expectedTitle: 'Budget Planner' },
    { text: 'Goals', route: 'savings', expectedTitle: 'Savings Goals' },
    {
      text: 'Analytics',
      route: 'analytics',
      expectedTitle: 'Financial Analytics Dashboard',
    },
    { text: 'Security', route: 'dashboard', expectedTitle: 'dashboard' }, // Security goes to dashboard
    {
      text: 'Planning',
      route: 'planning',
      expectedTitle: 'Financial Planning',
    },
    { text: 'Savings', route: 'savings', expectedTitle: 'Savings Goals' },
    { text: 'Credit', route: 'credit', expectedTitle: 'Credit Score' },
  ];

  test.beforeEach(async ({ page }) => {
    // Navigate to the main page
    await page.goto('/');

    // Wait for the loading indicator to disappear
    await page.waitForSelector('text=Loading your financial dashboard...', {
      state: 'hidden',
      timeout: 30000,
    });

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Wait for FeatureCloud to be visible
    await page.waitForSelector('h1:has-text("Intelligence you can bank on")', {
      state: 'visible',
      timeout: 30000,
    });

    // Additional wait to ensure all buttons are rendered
    await page.waitForTimeout(1000);
  });

  test('FeatureCloud component is visible and contains all buttons', async ({
    page,
  }) => {
    // Check that the main headline is visible
    await expect(
      page.locator('h1:has-text("Intelligence you can bank on")')
    ).toBeVisible();

    // Check that all feature buttons are visible
    for (const feature of features) {
      const button = page.locator(`button:has-text("${feature.text}")`);
      await expect(button).toBeVisible();
      await expect(button).toBeEnabled();
    }
  });

  // Test each button individually
  for (const feature of features) {
    test(`${feature.text} button navigates to ${feature.route}`, async ({
      page,
    }) => {
      // Find and click the button
      const button = page.locator(`button:has-text("${feature.text}")`);
      await expect(button).toBeVisible();
      await expect(button).toBeEnabled();

      // Click the button
      await button.click();

      // Wait for navigation
      await page.waitForLoadState('networkidle');

      // Check URL parameter
      const url = page.url();
      expect(url).toContain(`tab=${feature.route}`);

      // Wait for content to load and check page title or specific content
      if (feature.route === 'dashboard') {
        // Dashboard should show FeatureCloud again
        await expect(
          page.locator('text=Intelligence you can bank on')
        ).toBeVisible({ timeout: 10000 });
      } else {
        // Other pages should show their specific content
        await page.waitForTimeout(1000); // Give time for lazy loading

        // Check for page-specific content
        switch (feature.route) {
          case 'accounts':
            await expect(page.locator('h1:has-text("Accounts")')).toBeVisible({
              timeout: 10000,
            });
            break;
          case 'insights':
            await expect(page.locator('text=Financial Insights')).toBeVisible({
              timeout: 10000,
            });
            break;
          case 'investments':
            await expect(page.locator('text=Investment')).toBeVisible({
              timeout: 10000,
            });
            break;
          case 'budget':
            await expect(page.locator('text=Budget')).toBeVisible({
              timeout: 10000,
            });
            break;
          case 'savings':
            await expect(page.locator('text=Savings Goals')).toBeVisible({
              timeout: 10000,
            });
            break;
          case 'analytics':
            await expect(page.locator('text=Analytics')).toBeVisible({
              timeout: 10000,
            });
            break;
          case 'planning':
            await expect(page.locator('text=Planning')).toBeVisible({
              timeout: 10000,
            });
            break;
          case 'credit':
            await expect(page.locator('text=Credit Score')).toBeVisible({
              timeout: 10000,
            });
            break;
        }
      }

      // Navigate back to dashboard for next test
      await page.goto('/?tab=dashboard');
      await page.waitForLoadState('networkidle');
    });
  }

  test('All buttons have proper keyboard accessibility', async ({ page }) => {
    // Tab through all buttons
    for (let i = 0; i < features.length; i++) {
      await page.keyboard.press('Tab');

      // Check if a button is focused
      const focusedElement = await page.locator(':focus');
      const tagName = await focusedElement.evaluate((el) => el.tagName);

      // After tabbing through other elements, we should eventually reach our buttons
      if (tagName === 'BUTTON') {
        const buttonText = await focusedElement.textContent();
        // Check if this is one of our feature buttons
        const isFeatureButton = features.some((f) =>
          buttonText?.includes(f.text)
        );
        if (isFeatureButton) {
          // Press Enter to activate
          await page.keyboard.press('Enter');
          await page.waitForLoadState('networkidle');

          // Check navigation worked
          const url = page.url();
          expect(url).toContain('tab=');

          // Go back to dashboard
          await page.goto('/?tab=dashboard');
          await page.waitForLoadState('networkidle');
        }
      }
    }
  });

  test('Buttons have proper hover effects', async ({ page }) => {
    for (const feature of features) {
      const button = page.locator(`button:has-text("${feature.text}")`);

      // Get initial style
      const initialTransform = await button.evaluate(
        (el) => window.getComputedStyle(el).transform
      );

      // Hover over button
      await button.hover();

      // Wait for animation
      await page.waitForTimeout(300);

      // Get hover style
      const hoverTransform = await button.evaluate(
        (el) => window.getComputedStyle(el).transform
      );

      // Transform should change on hover (scale effect)
      expect(initialTransform).not.toBe(hoverTransform);
    }
  });

  test('Mobile responsiveness - buttons are properly sized', async ({
    page,
  }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);

    for (const feature of features) {
      const button = page.locator(`button:has-text("${feature.text}")`);
      const box = await button.boundingBox();

      // Buttons should have minimum touch target size (44x44 pixels)
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('Desktop responsiveness - buttons scale appropriately', async ({
    page,
  }) => {
    // Test desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(500);

    for (const feature of features) {
      const button = page.locator(`button:has-text("${feature.text}")`);
      const box = await button.boundingBox();

      // Buttons should be larger on desktop
      expect(box?.width).toBeGreaterThan(60);
      expect(box?.height).toBeGreaterThan(40);
    }
  });

  test('Performance - navigation is fast', async ({ page }) => {
    for (const feature of features) {
      const button = page.locator(`button:has-text("${feature.text}")`);

      // Measure navigation time
      const startTime = Date.now();
      await button.click();
      await page.waitForLoadState('networkidle');
      const endTime = Date.now();

      const navigationTime = endTime - startTime;

      // Navigation should be fast (under 3 seconds)
      expect(navigationTime).toBeLessThan(3000);

      // Go back to dashboard
      await page.goto('/?tab=dashboard');
      await page.waitForLoadState('networkidle');
    }
  });
});
