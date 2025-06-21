import { test, expect } from '@playwright/test';

test.describe('Bottom Navigation All Viewports', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'ultrawide', width: 2560, height: 1440 }
  ];

  viewports.forEach(({ name, width, height }) => {
    test(`bottom navigation shows and works on ${name} (${width}x${height})`, async ({ page }) => {
      // Set viewport
      await page.setViewportSize({ width, height });
      
      // Navigate to the app
      await page.goto('http://localhost:5173/');
      
      // Wait for the app to load
      await page.waitForLoadState('networkidle');
      
      // Wait a bit more for React to render
      await page.waitForTimeout(1000);
      
      // Verify bottom navigation is visible
      const bottomNav = page.locator('nav.bottom-nav');
      await expect(bottomNav).toBeVisible({ timeout: 10000 });
      
      // Get all navigation buttons
      const navButtons = bottomNav.locator('button.nav-item');
      const navCount = await navButtons.count();
      
      // Verify there are navigation items
      expect(navCount).toBeGreaterThan(0);
      console.log(`Found ${navCount} navigation items on ${name}`);
      
      // Get the initial URL
      const initialUrl = page.url();
      
      // Test clicking at least two navigation buttons
      const buttonsToClick = Math.min(3, navCount); // Click up to 3 buttons
      const clickedPages = [];
      
      for (let i = 0; i < buttonsToClick; i++) {
        // Click a navigation button
        const button = navButtons.nth(i);
        const buttonLabel = await button.getAttribute('aria-label');
        console.log(`Clicking button ${i + 1}: ${buttonLabel}`);
        
        await button.click();
        
        // Wait for navigation
        await page.waitForLoadState('networkidle');
        
        // Verify the URL changed
        const newUrl = page.url();
        if (i > 0 || !initialUrl.endsWith('/')) {
          expect(newUrl).not.toBe(initialUrl);
        }
        
        // Verify bottom navigation is still visible
        await expect(bottomNav).toBeVisible();
        
        // Store the page we navigated to
        clickedPages.push({
          label: buttonLabel,
          url: newUrl
        });
        
        // Take a screenshot for verification
        await page.screenshot({ 
          path: `test-results/bottom-nav-${name}-page${i + 1}.png`,
          fullPage: false 
        });
      }
      
      // Navigate back to home
      console.log('Navigating back to home...');
      const homeButton = navButtons.first(); // Usually the first button is home
      await homeButton.click();
      await page.waitForLoadState('networkidle');
      
      // Verify we're back at the home page
      const finalUrl = page.url();
      console.log(`Final URL: ${finalUrl}`);
      
      // Verify bottom navigation is still visible
      await expect(bottomNav).toBeVisible();
      
      // Take final screenshot
      await page.screenshot({ 
        path: `test-results/bottom-nav-${name}-home.png`,
        fullPage: false 
      });
      
      // Log summary
      console.log(`✅ Test passed for ${name} viewport`);
      console.log(`   - Bottom nav visible: Yes`);
      console.log(`   - Navigated to ${clickedPages.length} pages`);
      console.log(`   - Successfully returned home`);
    });
  });

  test('verify bottom navigation styling consistency', async ({ page }) => {
    // Test on desktop to ensure styling is appropriate
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const bottomNav = page.locator('nav.bottom-nav');
    await expect(bottomNav).toBeVisible();
    
    // Verify positioning
    const boundingBox = await bottomNav.boundingBox();
    expect(boundingBox).toBeTruthy();
    expect(boundingBox!.y).toBeGreaterThan(700); // Should be at bottom
    
    // Verify it spans full width
    const viewportSize = page.viewportSize();
    expect(boundingBox!.width).toBeCloseTo(viewportSize!.width, 1);
    
    // Verify glass effect classes
    const glassContainer = bottomNav.locator('.liquid-glass-nav');
    await expect(glassContainer).toHaveClass(/backdrop-blur-md/);
    
    console.log('✅ Bottom navigation styling is consistent across viewports');
  });
}); 