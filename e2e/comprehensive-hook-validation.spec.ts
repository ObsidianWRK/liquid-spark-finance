/*
import { test, expect } from '@playwright/test';
import { HookValidationMonitor, commonTestScenarios, defaultHookValidationConfig } from './hook-validation-config';

test.describe('Comprehensive Hook Validation Suite', () => {
  let monitor: HookValidationMonitor;

  test.beforeEach(async ({ page }) => {
    // Initialize hook validation monitor
    monitor = new HookValidationMonitor(page, {
      ...defaultHookValidationConfig,
      strictHookValidation: true,
      captureScreenshotsOnError: true,
      captureVideoOnError: true
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async ({ page: _page }) => {
    // Generate and log the validation report
    const report = monitor.generateReport();
    console.log('Hook Validation Report:', report);

    // Fail test if strict validation is enabled and violations were found
    const validation = await monitor.validateHookIntegrity();
    if (!validation.passed && defaultHookValidationConfig.strictHookValidation) {
      console.error('Hook violations detected:', validation.violations);
      // Don't fail here - let individual tests handle the validation
    }
  });

  test('should complete full navigation cycle without hook violations', async ({ page }) => {
    const tabs = ['dashboard', 'accounts', 'transactions', 'insights', 'reports', 'wrapped', 'profile'];
    
    console.log('🧪 Testing full navigation cycle...');
    
    const validation = await commonTestScenarios.testNavigation(page, tabs, monitor);
    
    expect(validation.violations, `Hook violations detected: ${JSON.stringify(validation.violations)}`).toHaveLength(0);
    expect(validation.passed, 'Navigation cycle should pass hook validation').toBe(true);
    
    console.log('✅ Full navigation cycle completed successfully');
  });

  test('should handle rapid navigation stress test without hook violations', async ({ page }) => {
    const tabs = ['dashboard', 'accounts', 'transactions', 'insights'];
    const iterations = 50;
    
    console.log(`🧪 Testing rapid navigation (${iterations} iterations)...`);
    
    const validation = await commonTestScenarios.testRapidNavigation(page, tabs, iterations, monitor);
    
    expect(validation.violations, `Hook violations during rapid navigation: ${JSON.stringify(validation.violations)}`).toHaveLength(0);
    expect(validation.passed, 'Rapid navigation should pass hook validation').toBe(true);
    
    console.log('✅ Rapid navigation stress test completed successfully');
  });

  test('should handle mobile navigation without hook violations', async ({ page }) => {
    const tabs = ['dashboard', 'accounts', 'transactions', 'insights'];
    
    console.log('🧪 Testing mobile navigation...');
    
    const validation = await commonTestScenarios.testMobileNavigation(page, tabs, monitor);
    
    expect(validation.violations, `Hook violations during mobile navigation: ${JSON.stringify(validation.violations)}`).toHaveLength(0);
    expect(validation.passed, 'Mobile navigation should pass hook validation').toBe(true);
    
    console.log('✅ Mobile navigation completed successfully');
  });

  test('should handle complex navigation patterns without hook violations', async ({ page }) => {
    console.log('🧪 Testing complex navigation patterns...');
    
    // Pattern 1: Sequential navigation
    await page.goto('/?tab=dashboard');
    await page.waitForLoadState('networkidle');
    
    await page.goto('/?tab=transactions');
    await page.waitForLoadState('networkidle');
    
    await page.goto('/?tab=insights');
    await page.waitForLoadState('networkidle');
    
    // Pattern 2: Back/forward navigation
    await page.goBack();
    await page.waitForLoadState('networkidle');
    
    await page.goForward();
    await page.waitForLoadState('networkidle');
    
    // Pattern 3: URL parameter changes
    await page.goto('/?tab=insights&view=overview');
    await page.waitForLoadState('networkidle');
    
    await page.goto('/?tab=insights&view=trends');
    await page.waitForLoadState('networkidle');
    
    // Pattern 4: Mixed navigation
    await page.goto('/?tab=dashboard');
    await page.waitForTimeout(100);
    
    await page.goto('/?tab=reports');
    await page.waitForTimeout(100);
    
    await page.goto('/?tab=wrapped');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for lazy loading
    
    // Final validation
    const validation = await monitor.validateHookIntegrity();
    
    expect(validation.violations, `Hook violations in complex patterns: ${JSON.stringify(validation.violations)}`).toHaveLength(0);
    expect(validation.passed, 'Complex navigation patterns should pass hook validation').toBe(true);
    
    console.log('✅ Complex navigation patterns completed successfully');
  });

  test('should handle viewport changes during navigation without hook violations', async ({ page }) => {
    console.log('🧪 Testing viewport changes during navigation...');
    
    const viewports = [
      { width: 1920, height: 1080, name: 'Large Desktop' },
      { width: 1366, height: 768, name: 'Standard Desktop' },
      { width: 768, height: 1024, name: 'Tablet Portrait' },
      { width: 1024, height: 768, name: 'Tablet Landscape' },
      { width: 375, height: 667, name: 'Mobile Portrait' },
      { width: 667, height: 375, name: 'Mobile Landscape' }
    ];
    
    const tabs = ['dashboard', 'transactions', 'insights'];
    
    for (const viewport of viewports) {
      console.log(`Testing on ${viewport.name} (${viewport.width}x${viewport.height})`);
      
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(200);
      
      for (const tab of tabs) {
        await page.goto(`/?tab=${tab}`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(300);
      }
    }
    
    const validation = await monitor.validateHookIntegrity();
    
    expect(validation.violations, `Hook violations during viewport changes: ${JSON.stringify(validation.violations)}`).toHaveLength(0);
    expect(validation.passed, 'Viewport changes should pass hook validation').toBe(true);
    
    console.log('✅ Viewport change tests completed successfully');
  });

  test('should handle lazy loading scenarios without hook violations', async ({ page }) => {
    console.log('🧪 Testing lazy loading scenarios...');
    
    // Test wrapped component (lazy loaded)
    for (let i = 0; i < 5; i++) {
      console.log(`Lazy loading iteration ${i + 1}/5`);
      
      // Navigate to wrapped (lazy loaded)
      await page.goto('/?tab=wrapped');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1500); // Wait for lazy component
      
      // Navigate away to unmount
      await page.goto('/?tab=dashboard');
      await page.waitForTimeout(300);
      
      // Navigate back to trigger re-mount
      await page.goto('/?tab=wrapped');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
    }
    
    const validation = await monitor.validateHookIntegrity();
    
    expect(validation.violations, `Hook violations during lazy loading: ${JSON.stringify(validation.violations)}`).toHaveLength(0);
    expect(validation.passed, 'Lazy loading should pass hook validation').toBe(true);
    
    console.log('✅ Lazy loading tests completed successfully');
  });

  test('should handle performance stress scenarios without hook violations', async ({ page }) => {
    console.log('🧪 Testing performance stress scenarios...');
    
    // Create performance stress
    await page.evaluate(() => {
      // Add CPU stress
      let stressCounter = 0;
      const stressCPU = () => {
        for (let i = 0; i < 10000; i++) {
          stressCounter += Math.sin(i) * Math.cos(i);
        }
        if (stressCounter < 1000000) {
          setTimeout(stressCPU, 1);
        }
      };
      stressCPU();
      
      // Add memory stress
      const memoryStress: number[][] = [];
      for (let i = 0; i < 1000; i++) {
        memoryStress.push(new Array(1000).fill(Math.random()));
      }
      (window as unknown as { memoryStress?: number[][] }).memoryStress = memoryStress;
    });
    
    // Navigate under stress
    const tabs = ['dashboard', 'transactions', 'insights', 'reports'];
    
    for (let cycle = 0; cycle < 3; cycle++) {
      console.log(`Stress test cycle ${cycle + 1}/3`);
      
      for (const tab of tabs) {
        await page.goto(`/?tab=${tab}`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(200);
      }
    }
    
    // Clean up stress
    await page.evaluate(() => {
      delete (window as unknown as { memoryStress?: number[][] }).memoryStress;
    });
    
    await page.waitForTimeout(1000);
    
    const validation = await monitor.validateHookIntegrity();
    
    expect(validation.violations, `Hook violations under performance stress: ${JSON.stringify(validation.violations)}`).toHaveLength(0);
    expect(validation.passed, 'Performance stress should pass hook validation').toBe(true);
    
    console.log('✅ Performance stress tests completed successfully');
  });

  test('should handle error recovery scenarios without hook violations', async ({ page }) => {
    console.log('🧪 Testing error recovery scenarios...');
    
    // Test navigation to potentially problematic routes
    const problematicRoutes = [
      '/?tab=nonexistent',
      '/?tab=dashboard&invalid=true',
      '/?tab=',
      '/invalid-route'
    ];
    
    for (const route of problematicRoutes) {
      console.log(`Testing problematic route: ${route}`);
      
      try {
        await page.goto(route);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);
      } catch (error) {
        console.log(`Expected error for ${route}:`, (error as Error).message);
      }
      
      // Recover to valid route
      await page.goto('/?tab=dashboard');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(300);
    }
    
    const validation = await monitor.validateHookIntegrity();
    
    // For error recovery, we only care about hook violations, not general errors
    expect(validation.violations, `Hook violations during error recovery: ${JSON.stringify(validation.violations)}`).toHaveLength(0);
    expect(validation.passed, 'Error recovery should pass hook validation').toBe(true);
    
    console.log('✅ Error recovery tests completed successfully');
  });

  test('should validate performance metrics are within acceptable ranges', async ({ page }) => {
    console.log('🧪 Validating performance metrics...');
    
    const tabs = ['dashboard', 'accounts', 'transactions', 'insights'];
    
    // Perform measured navigation
    for (const tab of tabs) {
      await page.goto(`/?tab=${tab}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(300);
    }
    
    const performanceMetrics = monitor.getPerformanceMetrics();
    const memoryMetrics = monitor.getMemoryMetrics();
    
    console.log('Performance Metrics:', performanceMetrics);
    console.log('Memory Metrics:', memoryMetrics);
    
    // Validate performance
    expect(performanceMetrics.averageNavigationTime, 'Average navigation time should be reasonable').toBeLessThan(3000);
    expect(performanceMetrics.maxNavigationTime, 'Max navigation time should be acceptable').toBeLessThan(5000);
    
    // Validate memory usage (if available)
    if (memoryMetrics.maxMemoryUsage > 0) {
      expect(memoryMetrics.maxMemoryUsage, 'Memory usage should be reasonable').toBeLessThan(200 * 1024 * 1024); // 200MB
    }
    
    // Validate no hook violations
    const validation = await monitor.validateHookIntegrity();
    expect(validation.violations, `Hook violations during performance validation: ${JSON.stringify(validation.violations)}`).toHaveLength(0);
    
    console.log('✅ Performance metrics validation completed successfully');
  });

  test('should generate comprehensive test report', async ({ page }) => {
    console.log('🧪 Generating comprehensive test report...');
    
    // Perform a comprehensive test sequence
    const tabs = ['dashboard', 'accounts', 'transactions', 'insights', 'reports'];
    
    // Standard navigation
    for (const tab of tabs) {
      await page.goto(`/?tab=${tab}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(200);
    }
    
    // Mobile navigation
    await page.setViewportSize({ width: 375, height: 667 });
    for (const tab of tabs.slice(0, 3)) {
      await page.goto(`/?tab=${tab}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(200);
    }
    
    // Back to desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    
    // Rapid navigation
    for (let i = 0; i < 10; i++) {
      const tab = tabs[i % tabs.length];
      await page.goto(`/?tab=${tab}`);
      await page.waitForTimeout(100);
    }
    
    // Final settlement
    await page.waitForTimeout(2000);
    
    // Generate final report
    const report = monitor.generateReport();
    const validation = await monitor.validateHookIntegrity();
    
    console.log('📊 COMPREHENSIVE TEST REPORT:');
    console.log(report);
    
    // Final validation
    expect(validation.violations, `Final hook validation failed: ${JSON.stringify(validation.violations)}`).toHaveLength(0);
    expect(validation.passed, 'Comprehensive test should pass all hook validations').toBe(true);
    
    console.log('✅ Comprehensive test report generated successfully');
  });
});
*/
