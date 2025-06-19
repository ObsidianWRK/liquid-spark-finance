import { test, expect } from '@playwright/test';

test.describe('🛡️ Final Analytics Bulletproof Verification', () => {
  const DESTRUCTURING_ERROR_PATTERNS = [
    'Right side of assignment cannot be destructured',
    'Cannot read property',
    'Cannot read properties of undefined',
    'Cannot read properties of null',
    'TypeError: Cannot destructure',
    'undefined is not an object',
    'null is not an object',
    'Cannot access before initialization'
  ];

  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage first
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('✅ Analytics tab loads without destructuring crashes', async ({ page }) => {
    const consoleErrors: string[] = [];
    const jsErrors: string[] = [];
    
    // Capture all console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Capture JavaScript errors
    page.on('pageerror', error => {
      jsErrors.push(error.message);
    });

    // Navigate directly to analytics tab
    await page.goto('/?tab=analytics');
    
    // Wait for analytics dashboard to load
    await page.waitForSelector('h1:has-text("Financial Analytics Dashboard")', { timeout: 15000 });
    
    // Wait for charts to render
    await page.waitForTimeout(3000);
    
    // Verify dashboard content is visible
    await expect(page.locator('h1:has-text("Financial Analytics Dashboard")')).toBeVisible();
    
    // Verify at least one chart is rendered
    const chartCount = await page.locator('.recharts-wrapper').count();
    expect(chartCount).toBeGreaterThan(0);
    
    // Check for any destructuring-specific errors
    const allErrors = [...consoleErrors, ...jsErrors];
    const destructuringErrors = allErrors.filter(error =>
      DESTRUCTURING_ERROR_PATTERNS.some(pattern => 
        error.toLowerCase().includes(pattern.toLowerCase())
      )
    );

    // ✅ ZERO TOLERANCE for destructuring errors
    if (destructuringErrors.length > 0) {
      console.log('Found destructuring errors:', destructuringErrors);
    }
    expect(destructuringErrors).toHaveLength(0);
    
    // Log success
    console.log('✅ Analytics tab loaded successfully without destructuring crashes');
    console.log(`📊 Charts rendered: ${chartCount}`);
    console.log(`🚫 Total errors found: ${allErrors.length}`);
    console.log(`🛡️ Destructuring errors: ${destructuringErrors.length}`);
  });

  test('✅ Chart switching works without crashes', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    // Navigate to analytics
    await page.goto('/?tab=analytics');
    await page.waitForSelector('h1:has-text("Financial Analytics Dashboard")', { timeout: 15000 });
    
    // Test switching between different chart types
    const chartTypes = ['Net Worth', 'Cash Flow', 'Spending', 'Portfolio'];
    
    for (const chartType of chartTypes) {
      console.log(`Testing chart: ${chartType}`);
      
      // Click the chart type button
      await page.click(`button:has-text("${chartType}")`);
      
      // Wait for chart to render
      await page.waitForTimeout(1000);
      
      // Verify chart is still visible
      const chartExists = await page.locator('.recharts-wrapper').count() > 0;
      expect(chartExists).toBe(true);
    }
    
    // Check for destructuring errors during chart switching
    const destructuringErrors = errors.filter(error =>
      DESTRUCTURING_ERROR_PATTERNS.some(pattern => 
        error.toLowerCase().includes(pattern.toLowerCase())
      )
    );
    
    expect(destructuringErrors).toHaveLength(0);
    console.log('✅ Chart switching completed without errors');
  });

  test('✅ Timeframe changes work without crashes', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    // Navigate to analytics
    await page.goto('/?tab=analytics');
    await page.waitForSelector('h1:has-text("Financial Analytics Dashboard")', { timeout: 15000 });
    
    // Test different timeframes
    const timeframes = ['1M', '3M', '6M', '1Y'];
    
    for (const timeframe of timeframes) {
      console.log(`Testing timeframe: ${timeframe}`);
      
      // Click the timeframe button
      await page.click(`button:has-text("${timeframe}")`);
      
      // Wait for data to refresh
      await page.waitForTimeout(1500);
      
      // Verify charts are still rendered
      const chartCount = await page.locator('.recharts-wrapper').count();
      expect(chartCount).toBeGreaterThan(0);
    }
    
    // Check for destructuring errors during timeframe changes
    const destructuringErrors = errors.filter(error =>
      DESTRUCTURING_ERROR_PATTERNS.some(pattern => 
        error.toLowerCase().includes(pattern.toLowerCase())
      )
    );
    
    expect(destructuringErrors).toHaveLength(0);
    console.log('✅ Timeframe changes completed without errors');
  });

  test('✅ Rapid navigation stress test', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    // Rapid navigation between different tabs including analytics
    const tabs = ['dashboard', 'accounts', 'analytics', 'insights', 'budget'];
    
    for (let cycle = 0; cycle < 3; cycle++) {
      for (const tab of tabs) {
        console.log(`Cycle ${cycle + 1}: Navigating to ${tab}`);
        
        await page.goto(`/?tab=${tab}`);
        
        if (tab === 'analytics') {
          await page.waitForSelector('h1:has-text("Financial Analytics Dashboard")', { timeout: 10000 });
          
          // Verify charts are rendered
          const chartCount = await page.locator('.recharts-wrapper').count();
          expect(chartCount).toBeGreaterThan(0);
        }
        
        await page.waitForTimeout(500);
      }
    }
    
    // Check for destructuring errors during rapid navigation
    const destructuringErrors = errors.filter(error =>
      DESTRUCTURING_ERROR_PATTERNS.some(pattern => 
        error.toLowerCase().includes(pattern.toLowerCase())
      )
    );
    
    expect(destructuringErrors).toHaveLength(0);
    console.log('✅ Rapid navigation stress test completed without errors');
  });
}); 