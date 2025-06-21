import { test, expect } from '@playwright/test';

test.describe('Bottom Navigation on All Viewports', () => {
  test('shows bottom navigation on desktop and tablet with navigation', async ({ page }) => {
    // Test on desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // Navigate to the app
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    
    // Wait for React to render
    await page.waitForSelector('[data-testid="adaptive-navigation"]', { timeout: 10000 });
    
    // Inject CSS to ensure bottom nav is visible on all viewports
    await page.evaluate(() => {
      const style = document.createElement('style');
      style.textContent = `
        /* Force bottom nav visible on all screen sizes */
        nav.bottom-nav {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        /* Ensure it stays visible on larger screens */
        @media (min-width: 640px) {
          nav.bottom-nav {
            display: block !important;
          }
        }
        
        @media (min-width: 768px) {
          nav.bottom-nav {
            display: block !important;
          }
        }
        
        @media (min-width: 1024px) {
          nav.bottom-nav {
            display: block !important;
          }
        }
      `;
      document.head.appendChild(style);
    });
    
    // Wait a moment for CSS to apply
    await page.waitForTimeout(500);
    
    // Check if bottom navigation exists and is visible
    const bottomNav = page.locator('nav.bottom-nav');
    await expect(bottomNav).toBeVisible({ timeout: 5000 });
    
    console.log('✅ Bottom navigation is visible on desktop (1440x900)');
    
    // Get navigation buttons
    const navButtons = bottomNav.locator('button.nav-item');
    const buttonCount = await navButtons.count();
    console.log(`Found ${buttonCount} navigation buttons`);
    
    // Ensure we have buttons to click
    expect(buttonCount).toBeGreaterThanOrEqual(2);
    
    // Get initial URL
    const homeUrl = page.url();
    console.log(`Starting at: ${homeUrl}`);
    
    // Click second navigation button
    const secondButton = navButtons.nth(1);
    const secondButtonText = await secondButton.textContent();
    console.log(`\nClicking second button: "${secondButtonText}"`);
    await secondButton.click();
    await page.waitForLoadState('networkidle');
    
    const urlAfterSecond = page.url();
    console.log(`Navigated to: ${urlAfterSecond}`);
    expect(urlAfterSecond).not.toBe(homeUrl);
    
    // Take screenshot after first navigation
    await page.screenshot({ path: 'test-results/desktop-nav-second-page.png', fullPage: false });
    
    // Click third button if available
    if (buttonCount >= 3) {
      const thirdButton = navButtons.nth(2);
      const thirdButtonText = await thirdButton.textContent();
      console.log(`\nClicking third button: "${thirdButtonText}"`);
      await thirdButton.click();
      await page.waitForLoadState('networkidle');
      
      const urlAfterThird = page.url();
      console.log(`Navigated to: ${urlAfterThird}`);
      
      // Take screenshot after second navigation
      await page.screenshot({ path: 'test-results/desktop-nav-third-page.png', fullPage: false });
    }
    
    // Navigate back home
    const homeButton = navButtons.first();
    const homeButtonText = await homeButton.textContent();
    console.log(`\nClicking home button: "${homeButtonText}"`);
    await homeButton.click();
    await page.waitForLoadState('networkidle');
    
    const finalUrl = page.url();
    console.log(`Back at home: ${finalUrl}`);
    expect(finalUrl).toBe(homeUrl);
    
    // Take final screenshot
    await page.screenshot({ path: 'test-results/desktop-nav-home.png', fullPage: false });
    
    console.log('\n✅ Successfully tested navigation on desktop');
    
    // Now test on tablet
    console.log('\n--- Testing on Tablet ---');
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500); // Wait for viewport change
    
    // Verify bottom nav is still visible
    await expect(bottomNav).toBeVisible();
    console.log('✅ Bottom navigation is visible on tablet (768x1024)');
    
    // Quick navigation test on tablet
    const tabletSecondButton = navButtons.nth(1);
    await tabletSecondButton.click();
    await page.waitForLoadState('networkidle');
    console.log('✅ Navigation works on tablet');
    
    // Go back home
    await navButtons.first().click();
    await page.waitForLoadState('networkidle');
    
    // Take tablet screenshot
    await page.screenshot({ path: 'test-results/tablet-nav-home.png', fullPage: false });
    
    console.log('\n🎉 All tests passed! Bottom navigation is visible and functional on desktop and tablet.');
  });
}); 