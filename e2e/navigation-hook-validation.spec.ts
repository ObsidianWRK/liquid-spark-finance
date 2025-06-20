import { test, expect, Page } from '@playwright/test';

test.describe('Navigation Hook Validation Tests', () => {
  let reactErrors: string[] = [];
  let hookWarnings: string[] = [];

  test.beforeEach(async ({ page }) => {
    // Reset error tracking
    reactErrors = [];
    hookWarnings = [];

    // Enhanced console monitoring
    page.on('console', (msg) => {
      const text = msg.text();
      const type = msg.type();

      if (type === 'error') {
        if (
          text.includes('Hook') ||
          text.includes('React') ||
          text.includes('rendered more hooks')
        ) {
          reactErrors.push(`ERROR: ${text}`);
        }
      } else if (type === 'warning') {
        if (text.includes('Hook') || text.includes('React')) {
          hookWarnings.push(`WARNING: ${text}`);
        }
      }
    });

    // Monitor page errors
    page.on('pageerror', (error) => {
      if (error.message.includes('Hook') || error.message.includes('React')) {
        reactErrors.push(`PAGE ERROR: ${error.message}`);
      }
    });

    // Navigate to initial page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should handle all tab navigation sequences without hook violations', async ({
    page,
  }) => {
    const tabs = [
      'dashboard',
      'accounts',
      'transactions',
      'insights',
      'reports',
      'wrapped',
      'profile',
    ];

    // Test every possible tab transition
    for (const fromTab of tabs) {
      for (const toTab of tabs) {
        if (fromTab !== toTab) {
          console.log(`Testing navigation: ${fromTab} → ${toTab}`);

          // Navigate to source tab
          await page.goto(`/?tab=${fromTab}`);
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(300);

          // Clear errors before transition
          const preTransitionErrors = reactErrors.length;

          // Navigate to destination tab
          await page.goto(`/?tab=${toTab}`);
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(300);

          // Check for new hook errors
          const newErrors = reactErrors.slice(preTransitionErrors);
          if (newErrors.length > 0) {
            console.error(
              `Hook errors during ${fromTab} → ${toTab}:`,
              newErrors
            );
          }

          expect(
            newErrors,
            `Hook violations during ${fromTab} → ${toTab}: ${JSON.stringify(newErrors)}`
          ).toHaveLength(0);
        }
      }
    }
  });

  test('should handle bottom navigation tab switching without hook violations', async ({
    page,
  }) => {
    const initialErrorCount = reactErrors.length;

    // Test bottom navigation if available
    const bottomNavButtons = [
      '[data-testid="nav-dashboard"]',
      '[data-testid="nav-accounts"]',
      '[data-testid="nav-transactions"]',
      '[data-testid="nav-insights"]',
      '[data-testid="nav-reports"]',
      '[data-testid="nav-wrapped"]',
      '[data-testid="nav-profile"]',
    ];

    for (const buttonSelector of bottomNavButtons) {
      const button = page.locator(buttonSelector);
      if (await button.isVisible()) {
        console.log(`Clicking bottom nav button: ${buttonSelector}`);
        await button.click();
        await page.waitForTimeout(500);
      }
    }

    // Check for hook errors
    const newErrors = reactErrors.slice(initialErrorCount);
    expect(
      newErrors,
      `Hook violations during bottom nav switching: ${JSON.stringify(newErrors)}`
    ).toHaveLength(0);
  });

  test('should handle URL state changes without hook violations', async ({
    page,
  }) => {
    const initialErrorCount = reactErrors.length;

    // Test various URL state changes that might affect hook order
    const urlChanges = [
      { url: '/', description: 'Root URL' },
      { url: '/?tab=dashboard', description: 'Dashboard with tab param' },
      {
        url: '/?tab=insights&view=overview',
        description: 'Insights with sub-param',
      },
      {
        url: '/?tab=transactions&filter=recent&sort=date',
        description: 'Transactions with multiple params',
      },
      {
        url: '/?tab=reports&period=monthly&category=all',
        description: 'Reports with filters',
      },
      {
        url: '/?tab=profile&section=settings&subsection=privacy',
        description: 'Profile with nested params',
      },
      { url: '/#/legacy-route', description: 'Legacy hash route' },
      {
        url: '/?invalid=param&tab=dashboard',
        description: 'Invalid param with valid tab',
      },
    ];

    for (const { url, description } of urlChanges) {
      console.log(`Testing URL change: ${description} - ${url}`);

      await page.goto(url);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(400);
    }

    // Check for hook errors
    const newErrors = reactErrors.slice(initialErrorCount);
    expect(
      newErrors,
      `Hook violations during URL state changes: ${JSON.stringify(newErrors)}`
    ).toHaveLength(0);
  });

  test('should handle browser back/forward navigation without hook violations', async ({
    page,
  }) => {
    const initialErrorCount = reactErrors.length;

    // Build navigation history
    await page.goto('/?tab=dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(300);

    await page.goto('/?tab=transactions');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(300);

    await page.goto('/?tab=insights');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(300);

    await page.goto('/?tab=reports');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(300);

    // Test back navigation
    for (let i = 0; i < 3; i++) {
      console.log(`Browser back navigation #${i + 1}`);
      await page.goBack();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(300);
    }

    // Test forward navigation
    for (let i = 0; i < 3; i++) {
      console.log(`Browser forward navigation #${i + 1}`);
      await page.goForward();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(300);
    }

    // Check for hook errors
    const newErrors = reactErrors.slice(initialErrorCount);
    expect(
      newErrors,
      `Hook violations during browser navigation: ${JSON.stringify(newErrors)}`
    ).toHaveLength(0);
  });

  test('should handle rapid navigation stress test without hook violations', async ({
    page,
  }) => {
    const initialErrorCount = reactErrors.length;
    const tabs = ['dashboard', 'accounts', 'transactions', 'insights'];

    // Rapid navigation stress test
    console.log('Starting rapid navigation stress test...');

    for (let cycle = 0; cycle < 10; cycle++) {
      for (const tab of tabs) {
        await page.goto(`/?tab=${tab}`);
        // Very short wait to stress test React's reconciliation
        await page.waitForTimeout(50);
      }
    }

    // Final wait for everything to settle
    await page.waitForTimeout(2000);

    // Check for hook errors
    const newErrors = reactErrors.slice(initialErrorCount);
    expect(
      newErrors,
      `Hook violations during rapid navigation: ${JSON.stringify(newErrors)}`
    ).toHaveLength(0);
  });

  test('should handle navigation with viewport changes without hook violations', async ({
    page,
  }) => {
    const initialErrorCount = reactErrors.length;

    const viewports = [
      { width: 1920, height: 1080, name: 'Desktop Large' },
      { width: 1366, height: 768, name: 'Desktop Medium' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' },
      { width: 320, height: 568, name: 'Mobile Small' },
    ];

    const tabs = ['dashboard', 'transactions', 'insights'];

    for (const viewport of viewports) {
      console.log(
        `Testing navigation on ${viewport.name} (${viewport.width}x${viewport.height})`
      );

      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.waitForTimeout(200);

      for (const tab of tabs) {
        await page.goto(`/?tab=${tab}`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(300);
      }
    }

    // Check for hook errors
    const newErrors = reactErrors.slice(initialErrorCount);
    expect(
      newErrors,
      `Hook violations during viewport navigation: ${JSON.stringify(newErrors)}`
    ).toHaveLength(0);
  });

  test('should handle navigation during component lazy loading without hook violations', async ({
    page,
  }) => {
    const initialErrorCount = reactErrors.length;

    // Test navigation to wrapped tab (lazy loaded) multiple times
    for (let i = 0; i < 5; i++) {
      console.log(`Lazy loading test iteration ${i + 1}`);

      // Navigate to wrapped tab
      await page.goto('/?tab=wrapped');
      await page.waitForLoadState('networkidle');

      // Wait for lazy component to potentially load
      await page.waitForTimeout(1000);

      // Navigate away to unmount
      await page.goto('/?tab=dashboard');
      await page.waitForTimeout(300);

      // Navigate back to trigger re-mount and potential lazy loading
      await page.goto('/?tab=wrapped');
      await page.waitForTimeout(300);
    }

    // Check for hook errors
    const newErrors = reactErrors.slice(initialErrorCount);
    expect(
      newErrors,
      `Hook violations during lazy loading navigation: ${JSON.stringify(newErrors)}`
    ).toHaveLength(0);
  });

  test('should handle navigation error recovery without hook violations', async ({
    page,
  }) => {
    const initialErrorCount = reactErrors.length;

    // Test navigation to potentially problematic routes
    const problematicUrls = [
      '/?tab=nonexistent',
      '/?tab=',
      '/?tab=dashboard&corrupt=true',
      '/nonexistent-route',
      '/?tab=insights&invalid[param]=test',
    ];

    for (const url of problematicUrls) {
      console.log(`Testing potentially problematic URL: ${url}`);

      try {
        await page.goto(url);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);

        // Try to recover by navigating to a known good route
        await page.goto('/?tab=dashboard');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(300);
      } catch (error) {
        console.log(
          `Expected error for problematic URL ${url}:`,
          error.message
        );
      }
    }

    // Check for hook errors (not general navigation errors)
    const newErrors = reactErrors.slice(initialErrorCount);
    const hookSpecificErrors = newErrors.filter(
      (error) =>
        error.includes('rendered more hooks') ||
        error.includes('Hook call') ||
        error.includes('Invalid hook call')
    );

    expect(
      hookSpecificErrors,
      `Hook violations during error recovery: ${JSON.stringify(hookSpecificErrors)}`
    ).toHaveLength(0);
  });

  test('should handle concurrent navigation events without hook violations', async ({
    page,
  }) => {
    const initialErrorCount = reactErrors.length;

    // Test handling multiple navigation events in quick succession
    console.log('Testing concurrent navigation events...');

    // Start multiple navigation operations concurrently
    const navigationPromises = [
      page.goto('/?tab=dashboard'),
      page.goto('/?tab=transactions'),
      page.goto('/?tab=insights'),
    ];

    // Wait for one to complete
    await Promise.race(navigationPromises);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Test rapid sequential navigation
    await page.goto('/?tab=accounts');
    await page.goto('/?tab=reports');
    await page.goto('/?tab=wrapped');

    // Wait for everything to settle
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check for hook errors
    const newErrors = reactErrors.slice(initialErrorCount);
    expect(
      newErrors,
      `Hook violations during concurrent navigation: ${JSON.stringify(newErrors)}`
    ).toHaveLength(0);
  });

  test('should validate specific hook violation patterns', async ({ page }) => {
    // This test looks for the exact patterns that cause hook violations

    let specificHookError = '';
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (
          text.includes('rendered more hooks than during the previous render')
        ) {
          specificHookError = text;
        }
      }
    });

    // Reproduce the exact scenario from the error reports
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to insights (commonly reported problem area)
    await page.goto('/?tab=insights');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Switch to mobile viewport (common trigger)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    // Navigate back to dashboard
    await page.goto('/?tab=dashboard');
    await page.waitForLoadState('networkidle');

    // Switch back to desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(500);

    // Navigate to transactions
    await page.goto('/?tab=transactions');
    await page.waitForLoadState('networkidle');

    // Final check
    await page.waitForTimeout(2000);

    if (specificHookError) {
      console.error('SPECIFIC HOOK VIOLATION REPRODUCED:', specificHookError);
      throw new Error(`Hook violation pattern detected: ${specificHookError}`);
    }

    expect(specificHookError).toBe('');
  });
});
