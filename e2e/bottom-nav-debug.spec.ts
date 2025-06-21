import { test, expect } from '@playwright/test';

test('debug navigation on desktop', async ({ page }) => {
  // Set desktop viewport
  await page.setViewportSize({ width: 1440, height: 900 });
  
  // Try multiple ports
  const ports = [5173, 5174, 5175, 5176, 5177, 5178];
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
  await page.waitForTimeout(3000); // Give React plenty of time to render
  
  // Debug: Check what navigation elements are in the DOM
  console.log('\n=== Debugging Navigation Elements ===');
  
  // Check for adaptive navigation wrapper
  const adaptiveNav = await page.locator('[data-testid="adaptive-navigation"]').count();
  console.log(`Adaptive navigation found: ${adaptiveNav > 0 ? 'YES' : 'NO'}`);
  
  // Check for bottom nav
  const bottomNav = await page.locator('nav.bottom-nav').count();
  console.log(`Bottom navigation found: ${bottomNav > 0 ? 'YES' : 'NO'}`);
  
  // Check if bottom nav has display: none
  if (bottomNav > 0) {
    const isHidden = await page.locator('nav.bottom-nav').evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0';
    });
    console.log(`Bottom navigation hidden by CSS: ${isHidden ? 'YES' : 'NO'}`);
  }
  
  // Check for any nav elements
  const anyNavs = await page.locator('nav').count();
  console.log(`Total nav elements found: ${anyNavs}`);
  
  // List all nav elements
  const navElements = await page.locator('nav').all();
  for (let i = 0; i < navElements.length; i++) {
    const className = await navElements[i].getAttribute('class');
    const ariaLabel = await navElements[i].getAttribute('aria-label');
    console.log(`  Nav ${i + 1}: class="${className}" aria-label="${ariaLabel}"`);
  }
  
  // Check for TopBar
  const topBar = await page.locator('.top-bar, [data-testid="top-bar"]').count();
  console.log(`TopBar found: ${topBar > 0 ? 'YES' : 'NO'}`);
  
  // Check for NavRail
  const navRail = await page.locator('.nav-rail, [data-testid="nav-rail"]').count();
  console.log(`NavRail found: ${navRail > 0 ? 'YES' : 'NO'}`);
  
  // Take a screenshot with annotations
  await page.screenshot({ path: 'test-results/desktop-navigation-debug.png', fullPage: true });
  
  console.log('\n=== End Debug ===\n');
}); 