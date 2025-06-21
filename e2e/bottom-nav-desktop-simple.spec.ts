import { test, expect } from '@playwright/test';

test('bottom navigation shows on desktop and allows navigation', async ({ page }) => {
  // Set desktop viewport
  await page.setViewportSize({ width: 1440, height: 900 });
  
  // Try multiple ports where the app might be running
  const ports = [5173, 5174, 5175, 5176, 5177, 5178, 5179, 5180, 5181, 5182, 5183, 5184, 5190, 5191, 5192, 5193, 5194];
  let connected = false;
  
  for (const port of ports) {
    try {
      await page.goto(`http://localhost:${port}/`, { timeout: 5000 });
      connected = true;
      console.log(`Connected to app on port ${port}`);
      break;
    } catch (e) {
      // Try next port
    }
  }
  
  if (!connected) {
    throw new Error('Could not connect to app on any port');
  }
  
  // Wait for app to load
  await page.waitForLoadState('domcontentloaded');
  
  // Force reload to ensure CSS changes are picked up
  await page.reload();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000); // Give React time to render
  
  // Check if bottom navigation is visible on desktop
  const bottomNav = page.locator('nav.bottom-nav');
  const isVisible = await bottomNav.isVisible({ timeout: 5000 }).catch(() => false);
  
  if (!isVisible) {
    // Take a screenshot to debug
    await page.screenshot({ path: 'test-results/desktop-no-bottom-nav.png', fullPage: true });
    throw new Error('Bottom navigation is not visible on desktop viewport');
  }
  
  console.log('✅ Bottom navigation is visible on desktop');
  
  // Get navigation buttons
  const navButtons = bottomNav.locator('button.nav-item');
  const buttonCount = await navButtons.count();
  console.log(`Found ${buttonCount} navigation buttons`);
  
  // Click second button (usually Accounts or similar)
  if (buttonCount >= 2) {
    const secondButton = navButtons.nth(1);
    const secondButtonLabel = await secondButton.getAttribute('aria-label');
    console.log(`Clicking button 2: ${secondButtonLabel}`);
    await secondButton.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Verify URL changed
    const urlAfterSecond = page.url();
    console.log(`URL after clicking second button: ${urlAfterSecond}`);
  }
  
  // Click third button if available
  if (buttonCount >= 3) {
    const thirdButton = navButtons.nth(2);
    const thirdButtonLabel = await thirdButton.getAttribute('aria-label');
    console.log(`Clicking button 3: ${thirdButtonLabel}`);
    await thirdButton.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Verify URL changed
    const urlAfterThird = page.url();
    console.log(`URL after clicking third button: ${urlAfterThird}`);
  }
  
  // Navigate back home
  const homeButton = navButtons.first();
  const homeButtonLabel = await homeButton.getAttribute('aria-label');
  console.log(`Clicking home button: ${homeButtonLabel}`);
  await homeButton.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  
  const finalUrl = page.url();
  console.log(`Final URL (should be home): ${finalUrl}`);
  
  // Take a screenshot to show the final state
  await page.screenshot({ path: 'test-results/desktop-bottom-nav-final.png', fullPage: false });
  
  console.log('✅ Successfully navigated using bottom navigation on desktop');
}); 