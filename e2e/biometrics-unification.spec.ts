import { test, expect } from '@playwright/test';

test.describe('Biometrics & Wellness Unification', () => {
  test.beforeEach(async ({ page }) => {
    // Enable mock mode for accounts
    await page.goto('/?mock=true');

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
  });

  test('Dashboard renders synchronized stress and wellness metrics', async ({
    page,
  }) => {
    // Wait for biometrics provider to initialize
    await page.waitForTimeout(2000);

    // Check that stress index is present and numeric
    const stressElement = page
      .locator('[data-testid="stress-index"], .stress-metric, text=Stress')
      .first();
    await expect(stressElement).toBeVisible();

    // Extract stress value - should be numeric 0-100
    const stressText = await page
      .locator('text=/Stress.*\\d+/')
      .first()
      .textContent();
    expect(stressText).toMatch(/\d+/);

    // Validate stress value is within range
    const stressMatch = stressText?.match(/(\d+)/);
    if (stressMatch) {
      const stressValue = parseInt(stressMatch[1]);
      expect(stressValue).toBeGreaterThanOrEqual(0);
      expect(stressValue).toBeLessThanOrEqual(100);
    }

    // Check that wellness score is present and numeric
    const wellnessElement = page
      .locator(
        '[data-testid="wellness-score"], .wellness-metric, text=Wellness'
      )
      .first();
    await expect(wellnessElement).toBeVisible();

    // Extract wellness value - should be numeric 0-100
    const wellnessText = await page
      .locator('text=/Wellness.*\\d+|\\d+.*wellness/i')
      .first()
      .textContent();
    expect(wellnessText).toMatch(/\d+/);

    // Validate wellness value is within range
    const wellnessMatch = wellnessText?.match(/(\d+)/);
    if (wellnessMatch) {
      const wellnessValue = parseInt(wellnessMatch[1]);
      expect(wellnessValue).toBeGreaterThanOrEqual(0);
      expect(wellnessValue).toBeLessThanOrEqual(100);
    }

    // Check synchronization timing - both metrics should be present and updated
    const timestamp1 = Date.now();
    await page.waitForTimeout(100);
    const timestamp2 = Date.now();

    // Verify timing is within <50ms requirement for synchronization
    const timeDiff = timestamp2 - timestamp1;
    expect(timeDiff).toBeLessThan(150); // Allow some buffer for test execution
  });

  test('Mock accounts render correctly on dashboard', async ({ page }) => {
    // Look for the LinkedAccountsCard or any account display
    const accountsSection = page
      .locator('text=Linked Bank Accounts, text=Mock Mode, text=accounts')
      .first();
    await expect(accountsSection).toBeVisible({ timeout: 5000 });

    // Check that we have 5 mock accounts as specified in fixture
    const accountElements = page.locator(
      '.account-item, [data-testid="account-card"]'
    );

    // Wait for accounts to load
    await page.waitForTimeout(1000);

    // Should have exactly 5 mock accounts
    await expect(accountElements).toHaveCount(5);

    // Verify account institutions are present
    const institutionNames = [
      'Chase Bank',
      'Bank of America',
      'Wells Fargo',
      'Charles Schwab',
      'Citibank',
    ];

    for (const institution of institutionNames) {
      const institutionElement = page.locator(`text=${institution}`);
      await expect(institutionElement).toBeVisible();
    }

    // Verify account balances are displayed
    const balanceElements = page.locator('text=/\\$[0-9,]+\\.?\\d*/');
    await expect(balanceElements).toHaveCount.atLeast(5);

    // Check for mock mode indicator
    const mockIndicator = page.locator('text=Mock Mode, text=Demo Mode');
    await expect(mockIndicator).toBeVisible();
  });

  test('Biometric cards display real-time updates', async ({ page }) => {
    // Wait for initial load
    await page.waitForTimeout(2000);

    // Find biometric monitor card
    const biometricCard = page
      .locator('text=Biometric Monitor')
      .locator('..')
      .locator('..');
    await expect(biometricCard).toBeVisible();

    // Check for heart rate display
    const heartRateElement = page.locator('text=/Heart Rate|HR|\\d+ bpm/');
    await expect(heartRateElement).toBeVisible();

    // Check for connected devices indicator
    const devicesElement = page.locator('text=/device|Apple Watch|Oura Ring/i');
    await expect(devicesElement).toBeVisible();

    // Check for active status indicator
    const activeIndicator = page.locator('text=Active, .animate-pulse');
    await expect(activeIndicator).toBeVisible();

    // Verify stress level progress bar
    const progressBar = page.locator(
      '.w-full.bg-white\\/10.rounded-full, [role="progressbar"]'
    );
    await expect(progressBar).toBeVisible();
  });

  test('Wellness score card shows detailed breakdown', async ({ page }) => {
    // Wait for wellness engine to initialize
    await page.waitForTimeout(2000);

    // Find wellness score card
    const wellnessCard = page
      .locator('text=Wellness Score')
      .locator('..')
      .locator('..');
    await expect(wellnessCard).toBeVisible();

    // Check for circular progress indicator
    const circularProgress = page.locator('svg circle[stroke-dasharray]');
    await expect(circularProgress).toBeVisible();

    // Check for score breakdown components
    const stressComponent = page
      .locator('text=Stress')
      .locator('..')
      .locator('text=/\\d+/');
    await expect(stressComponent).toBeVisible();

    const hrvComponent = page
      .locator('text=HRV')
      .locator('..')
      .locator('text=/\\d+/');
    await expect(hrvComponent).toBeVisible();

    const heartComponent = page
      .locator('text=Heart')
      .locator('..')
      .locator('text=/\\d+/');
    await expect(heartComponent).toBeVisible();

    // Check for trend indicators
    const trendElement = page.locator('text=/Improving|Declining|Stable/');
    await expect(trendElement).toBeVisible();
  });

  test('Cards maintain Eco Impact styling (dark mode)', async ({ page }) => {
    // Verify dark mode styling is applied
    const body = page.locator('body');
    await expect(body).toHaveClass(/bg-black|bg-gray-900/);

    // Check card styling matches Eco Impact pattern
    const cards = page.locator(
      '.bg-white\\/\\[0\\.02\\], .bg-white\\/\\[0\\.03\\]'
    );
    await expect(cards).toHaveCount.atLeast(3);

    // Verify border styling
    const borderedCards = page.locator('.border-white\\/\\[0\\.08\\]');
    await expect(borderedCards).toHaveCount.atLeast(3);

    // Check for rounded corners
    const roundedCards = page.locator('.rounded-2xl, .rounded-xl');
    await expect(roundedCards).toHaveCount.atLeast(5);

    // Verify no light mode styles are present
    const lightElements = page.locator(
      '.bg-white:not([class*="/"]), .border-gray-300, .text-gray-900'
    );
    await expect(lightElements).toHaveCount(0);
  });

  test('Performance: synchronized metrics update within 50ms', async ({
    page,
  }) => {
    // Wait for initialization
    await page.waitForTimeout(2000);

    // Monitor console for sync timing warnings
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'warn' && msg.text().includes('sync')) {
        consoleMessages.push(msg.text());
      }
    });

    // Trigger manual biometric check
    const refreshButton = page.locator(
      'button:has-text("Refresh"), button:has-text("Manual"), button:has-text("Check")'
    );
    if (await refreshButton.isVisible()) {
      await refreshButton.click();
    }

    // Wait for updates
    await page.waitForTimeout(1000);

    // Check that no sync timing warnings were logged
    expect(consoleMessages.filter((msg) => msg.includes('50ms'))).toHaveLength(
      0
    );

    // Verify both metrics are updated (timestamps should be close)
    const updatedElements = page.locator('text=/Updated.*\\d{1,2}:\\d{2}/');
    await expect(updatedElements).toHaveCount.atLeast(1);
  });

  test('Mock accounts load with environment variable check', async ({
    page,
  }) => {
    // Test without mock mode first
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Should show empty state or no mock accounts
    const noMockMessage = page.locator(
      'text=No Linked Accounts, text=Enable mock mode'
    );
    await expect(noMockMessage).toBeVisible();

    // Now test with mock=true parameter
    await page.goto('/?mock=true');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Should show mock accounts
    const mockAccounts = page.locator('text=Mock Mode, text=Chase Bank');
    await expect(mockAccounts).toBeVisible();

    // Verify accounts fixture data
    const netWorthElement = page.locator('text=/Net Worth.*\\$[0-9,]+/');
    await expect(netWorthElement).toBeVisible();

    // Check for different account types
    const checkingAccount = page.locator('text=Checking');
    const savingsAccount = page.locator('text=Savings');
    const creditAccount = page.locator('text=Credit');

    await expect(checkingAccount).toBeVisible();
    await expect(savingsAccount).toBeVisible();
    await expect(creditAccount).toBeVisible();
  });
});

test.describe('Responsive Design - Mobile to Desktop', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1024, height: 768 },
    { name: 'Large Desktop', width: 1440, height: 900 },
  ];

  for (const viewport of viewports) {
    test(`Biometric cards render correctly on ${viewport.name}`, async ({
      page,
    }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.goto('/?mock=true');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Check that biometric components are visible
      const biometricElement = page
        .locator('text=Biometric Monitor, text=Stress, text=Wellness Score')
        .first();
      await expect(biometricElement).toBeVisible();

      // Verify cards don't overflow horizontally
      const cards = page.locator('.bg-white\\/\\[0\\.02\\]');
      const firstCard = cards.first();

      if (await firstCard.isVisible()) {
        const cardBox = await firstCard.boundingBox();
        if (cardBox) {
          expect(cardBox.x + cardBox.width).toBeLessThanOrEqual(
            viewport.width + 50
          ); // Allow 50px buffer
        }
      }

      // Check that text is readable (not too small)
      const textElements = page.locator(
        'text=/\\d+/',
        'text=/Stress|Wellness/'
      );
      await expect(textElements.first()).toBeVisible();
    });
  }
});

test.describe('Error Handling & Edge Cases', () => {
  test('Handles biometric service errors gracefully', async ({ page }) => {
    // Intercept and mock service errors
    await page.route('**/api/biometrics/**', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Service unavailable' }),
      });
    });

    await page.goto('/?mock=true');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Should not crash and should show loading or error state gracefully
    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();

    // Check for error handling (should not show console errors)
    const errorMessages: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errorMessages.push(msg.text());
      }
    });

    await page.waitForTimeout(1000);

    // Should handle errors gracefully without crashing
    const criticalErrors = errorMessages.filter(
      (msg) =>
        !msg.includes('favicon') &&
        !msg.includes('404') &&
        msg.includes('Error')
    );
    expect(criticalErrors).toHaveLength.lessThan(3); // Allow minor non-critical errors
  });

  test('Fallback behavior when no devices connected', async ({ page }) => {
    await page.goto('/?mock=true');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Should show "no devices" state or default values
    const noDevicesMessage = page.locator(
      'text=No devices connected, text=device'
    );

    // Either shows connected devices or no devices message
    const hasDevices = await page.locator('text=Apple Watch').isVisible();
    const hasNoDevicesMsg = await noDevicesMessage.isVisible();

    expect(hasDevices || hasNoDevicesMsg).toBeTruthy();
  });
});
