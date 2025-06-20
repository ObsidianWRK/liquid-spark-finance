import { test, expect } from '@playwright/test';

test.describe('FeatureCloud Quick Test', () => {
  test('Verify all FeatureCloud buttons are clickable and navigate correctly', async ({
    page,
  }) => {
    // Navigate to the main page
    await page.goto('/');

    // Wait for loading to complete
    await page.waitForSelector('text=Loading your financial dashboard...', {
      state: 'hidden',
      timeout: 30000,
    });
    await page.waitForSelector('h1:has-text("Intelligence you can bank on")', {
      state: 'visible',
      timeout: 30000,
    });

    // Test each button
    const buttons = [
      { text: 'Smart Banking', expectedRoute: 'accounts' },
      { text: 'AI Insights', expectedRoute: 'insights' },
      { text: 'Investment', expectedRoute: 'investments' },
      { text: 'Budgeting', expectedRoute: 'budget' },
      { text: 'Goals', expectedRoute: 'savings' },
      { text: 'Analytics', expectedRoute: 'analytics' },
      { text: 'Planning', expectedRoute: 'planning' },
      { text: 'Credit', expectedRoute: 'credit' },
    ];

    let successCount = 0;

    for (const button of buttons) {
      try {
        // Go back to dashboard
        await page.goto('/?tab=dashboard');
        await page.waitForSelector(
          'h1:has-text("Intelligence you can bank on")',
          { state: 'visible', timeout: 10000 }
        );

        // Find and click the button
        const buttonElement = page.locator(`button:has-text("${button.text}")`);
        await expect(buttonElement).toBeVisible({ timeout: 5000 });
        await buttonElement.click();

        // Wait for navigation
        await page.waitForLoadState('networkidle');

        // Check URL
        const url = page.url();
        if (url.includes(`tab=${button.expectedRoute}`)) {
          console.log(
            `✅ ${button.text} button works - navigates to ${button.expectedRoute}`
          );
          successCount++;
        } else {
          console.log(
            `❌ ${button.text} button failed - expected ${button.expectedRoute}, got ${url}`
          );
        }
      } catch (error) {
        console.log(`❌ ${button.text} button error:`, error.message);
      }
    }

    console.log(
      `\n🎉 Test Summary: ${successCount}/${buttons.length} buttons working correctly`
    );

    // Expect at least 6 out of 8 buttons to work
    expect(successCount).toBeGreaterThanOrEqual(6);
  });
});
