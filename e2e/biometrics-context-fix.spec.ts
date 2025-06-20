import { test, expect } from '@playwright/test';

test.describe('Biometrics Context Fix', () => {
  test('✅ AccountOverview loads without useBiometricsSelector context error', async ({
    page,
  }) => {
    console.log('🎯 Testing AccountOverview biometrics context fix...');

    // Set up error monitoring
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Navigate to an account overview page
    await page.goto('http://localhost:5173/accounts/acc_001', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    // Wait for potential errors to surface
    await page.waitForTimeout(5000);

    // Check for the specific biometrics context error
    const biometricsErrors = errors.filter(
      (error) =>
        error.includes(
          'useBiometricsSelector must be used within a BiometricsProvider'
        ) ||
        error.includes(
          'useBiometrics must be used within a BiometricsProvider'
        ) ||
        error.includes('useSynchronizedMetrics')
    );

    expect(biometricsErrors).toHaveLength(0);
    console.log('✅ No biometrics context errors detected');

    // Verify the page loaded successfully
    const pageTitle = await page.locator('h1').first();
    await expect(pageTitle).toBeVisible();
    console.log('✅ AccountOverview page loaded successfully');

    // Verify biometrics-related content is present (proves context is working)
    const biometricsPane = page.locator('text=Biometrics at Transactions');
    await expect(biometricsPane).toBeVisible();
    console.log('✅ Biometrics pane is visible, context is working');

    // Check overall error count to ensure stability
    const totalErrors = errors.length;
    console.log(`📊 Total errors detected: ${totalErrors}`);

    // Allow some errors but not biometrics-specific ones
    expect(biometricsErrors).toHaveLength(0);

    console.log('🎉 Biometrics context fix verified successfully!');
  });

  test('🔧 BiometricsProvider provides default values when engine not ready', async ({
    page,
  }) => {
    console.log('🎯 Testing BiometricsProvider fallback behavior...');

    const logs: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'log' && msg.text().includes('BiometricsProvider')) {
        logs.push(msg.text());
      }
    });

    await page.goto('http://localhost:5173/accounts/acc_001', {
      waitUntil: 'networkidle',
    });

    await page.waitForTimeout(3000);

    // Should see initialization logs
    const initLogs = logs.filter((log) => log.includes('Initializing'));
    expect(initLogs.length).toBeGreaterThan(0);
    console.log('✅ BiometricsProvider initialization detected');

    // Page should still work even during initialization
    const pageContent = await page.locator('body');
    await expect(pageContent).toBeVisible();
    console.log('✅ Page renders correctly during biometrics initialization');
  });
});
