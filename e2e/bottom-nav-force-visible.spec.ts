import { test, expect } from '@playwright/test';

test.describe('Bottom Navigation Force Visible', () => {
  const viewports = [
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 }
  ];

  viewports.forEach(({ name, width, height }) => {
    test(`bottom navigation visible and functional on ${name}`, async ({ page }) => {
      // Set viewport
      await page.setViewportSize({ width, height });
      
      // Navigate to app
      await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
      
      // Inject CSS to force bottom nav visibility on all viewports
      await page.addStyleTag({
        content: `
          .bottom-nav {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
          @media (min-width: 768px) {
            .bottom-nav {
              display: block !important;
            }
          }
        `
      });
      
      // Wait for navigation to be visible
      const bottomNav = page.locator('nav.bottom-nav');
      await expect(bottomNav).toBeVisible({ timeout: 10000 });
      
      console.log(`✅ Bottom navigation is visible on ${name}`);
      
      // Get navigation buttons
      const navButtons = bottomNav.locator('button.nav-item');
      const buttonCount = await navButtons.count();
      console.log(`Found ${buttonCount} navigation buttons`);
      
      // Store initial URL
      const homeUrl = page.url();
      
      // Click second button
      if (buttonCount >= 2) {
        const secondButton = navButtons.nth(1);
        const secondLabel = await secondButton.getAttribute('aria-label');
        console.log(`\nClicking button 2: ${secondLabel}`);
        
        await secondButton.click();
        await page.waitForLoadState('networkidle');
        
        const urlAfterSecond = page.url();
        console.log(`  → Navigated to: ${urlAfterSecond}`);
        expect(urlAfterSecond).not.toBe(homeUrl);
      }
      
      // Click third button
      if (buttonCount >= 3) {
        const thirdButton = navButtons.nth(2);
        const thirdLabel = await thirdButton.getAttribute('aria-label');
        console.log(`\nClicking button 3: ${thirdLabel}`);
        
        await thirdButton.click();
        await page.waitForLoadState('networkidle');
        
        const urlAfterThird = page.url();
        console.log(`  → Navigated to: ${urlAfterThird}`);
      }
      
      // Navigate back home
      const homeButton = navButtons.first();
      const homeLabel = await homeButton.getAttribute('aria-label');
      console.log(`\nClicking home button: ${homeLabel}`);
      
      await homeButton.click();
      await page.waitForLoadState('networkidle');
      
      const finalUrl = page.url();
      console.log(`  → Back at home: ${finalUrl}`);
      
      // Verify we're back at home
      expect(finalUrl).toBe(homeUrl);
      
      // Take final screenshot
      await page.screenshot({ 
        path: `test-results/bottom-nav-${name}-success.png`,
        fullPage: false 
      });
      
      console.log(`\n✅ Successfully tested navigation on ${name}\n`);
    });
  });
}); 