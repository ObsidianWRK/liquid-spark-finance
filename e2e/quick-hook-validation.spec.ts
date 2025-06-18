import { test, expect } from '@playwright/test';
import { HookValidationMonitor, commonTestScenarios } from './hook-validation-config';

test.describe('Quick Hook Validation', () => {
  test('should quickly validate basic navigation without hook violations', async ({ page }) => {
    console.log('🚀 Starting quick hook validation test...');
    
    const monitor = new HookValidationMonitor(page);
    const hookViolations: string[] = [];
    
    // Monitor for hook violations
    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('rendered more hooks')) {
        hookViolations.push(msg.text());
        console.error('🚨 HOOK VIOLATION DETECTED:', msg.text());
      }
    });
    
    // Quick navigation test
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    console.log('✅ Initial page load - OK');
    
    // Test basic navigation sequence
    const basicTabs = ['dashboard', 'accounts', 'transactions', 'insights'];
    
    for (const tab of basicTabs) {
      console.log(`🔄 Testing navigation to: ${tab}`);
      await page.goto(`/?tab=${tab}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(300);
    }
    
    console.log('✅ Basic navigation sequence - OK');
    
    // Test mobile viewport change
    console.log('📱 Testing mobile viewport...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/?tab=dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await page.goto('/?tab=transactions');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(300);
    
    console.log('✅ Mobile viewport test - OK');
    
    // Back to desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(200);
    
    // Test rapid navigation
    console.log('⚡ Testing rapid navigation...');
    for (let i = 0; i < 5; i++) {
      const tab = basicTabs[i % basicTabs.length];
      await page.goto(`/?tab=${tab}`);
      await page.waitForTimeout(100);
    }
    
    // Final settlement
    await page.waitForTimeout(2000);
    console.log('✅ Rapid navigation test - OK');
    
    // Generate final report
    const validation = await monitor.validateHookIntegrity();
    const report = monitor.generateReport();
    
    console.log('📊 QUICK VALIDATION REPORT:');
    console.log(report);
    
    // Assert no hook violations
    expect(hookViolations, `Hook violations detected: ${JSON.stringify(hookViolations)}`).toHaveLength(0);
    expect(validation.violations, `Monitor detected violations: ${JSON.stringify(validation.violations)}`).toHaveLength(0);
    expect(validation.passed, 'Quick validation should pass').toBe(true);
    
    console.log('🎉 Quick hook validation completed successfully!');
  });
  
  test('should reproduce specific hook violation scenario', async ({ page }) => {
    console.log('🔬 Attempting to reproduce hook violation scenario...');
    
    let specificHookError = '';
    
    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('rendered more hooks than during the previous render')) {
        specificHookError = msg.text();
        console.error('🎯 SPECIFIC HOOK VIOLATION REPRODUCED:', msg.text());
      }
    });
    
    // Reproduce the exact problematic scenario
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to insights (commonly problematic)
    await page.goto('/?tab=insights');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Mobile viewport change during navigation
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/?tab=dashboard');
    await page.waitForTimeout(200);
    
    // Back to desktop quickly
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/?tab=transactions');
    await page.waitForTimeout(200);
    
    // Rapid navigation
    await page.goto('/?tab=insights');
    await page.waitForTimeout(100);
    await page.goto('/?tab=dashboard');
    await page.waitForTimeout(100);
    
    // Final check
    await page.waitForTimeout(2000);
    
    if (specificHookError) {
      console.error('❌ Hook violation reproduced:', specificHookError);
      // This test should fail if we reproduce the error
      throw new Error(`Hook violation reproduced: ${specificHookError}`);
    } else {
      console.log('✅ No hook violations detected - scenario appears to be fixed!');
      expect(specificHookError).toBe('');
    }
  });
});