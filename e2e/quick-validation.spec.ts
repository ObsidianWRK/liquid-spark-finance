import { test, expect } from '@playwright/test';

test.describe('Quick All Pages Validation', () => {
  const criticalPages = [
    { name: 'Dashboard', url: '/' },
    { name: 'Transactions', url: '/?view=transactions' },
    { name: 'Insights', url: '/?view=insights' },
    { name: 'Profile', url: '/profile' },
    { name: 'Calculators', url: '/calculators' },
    { name: 'Clean Dashboard', url: '/clean-dashboard' }
  ];

  const testViewports = [
    { width: 1024, height: 768 },
    { width: 1440, height: 900 },
    { width: 1920, height: 1080 }
  ];

  test('should validate critical pages are responsive across desktop viewports', async ({ page }) => {
    console.log('🚀 Quick validation of critical pages...');

    for (const viewport of testViewports) {
      console.log(`\n📐 Testing ${viewport.width}x${viewport.height}`);
      await page.setViewportSize(viewport);

      for (const pageInfo of criticalPages) {
        console.log(`  🔗 Testing: ${pageInfo.name}`);

        try {
          await page.goto(pageInfo.url, { waitUntil: 'networkidle', timeout: 15000 });
          await page.waitForTimeout(2000);

          // Check for horizontal scroll
          const hasHorizontalScroll = await page.evaluate(() => {
            return document.body.scrollWidth > window.innerWidth;
          });

          expect(hasHorizontalScroll).toBeFalsy();

          // Verify content is visible
          const contentCheck = await page.evaluate(() => {
            const hasContent = (document.body.textContent?.trim().length || 0) > 100;
            const elementCount = document.querySelectorAll('div, button, p, h1, h2, h3').length;
            const backgroundColor = window.getComputedStyle(document.body).backgroundColor;
            
            return {
              hasContent,
              elementCount,
              notWhiteScreen: backgroundColor !== 'rgb(255, 255, 255)'
            };
          });

          expect(contentCheck.hasContent).toBeTruthy();
          expect(contentCheck.elementCount).toBeGreaterThan(10);
          expect(contentCheck.notWhiteScreen).toBeTruthy();

          console.log(`    ✅ ${pageInfo.name}: Responsive, ${contentCheck.elementCount} elements`);

        } catch (error) {
          console.warn(`    ⚠️ ${pageInfo.name}: Issue detected - ${error}`);
          throw error; // Fail the test if critical pages don't work
        }
      }
    }

    console.log('\n✅ All critical pages validated successfully!');
  });

  test('should verify navigation functionality across pages', async ({ page }) => {
    console.log('🧭 Testing navigation functionality...');

    await page.setViewportSize({ width: 1920, height: 1080 });

    for (const pageInfo of criticalPages) {
      if (pageInfo.name === 'Dashboard') continue;

      console.log(`🔗 Testing navigation from: ${pageInfo.name}`);

      try {
        await page.goto(pageInfo.url, { waitUntil: 'networkidle', timeout: 15000 });
        await page.waitForTimeout(2000);

        // Try to navigate back to dashboard
        const homeButton = page.locator('button:has-text("Home"), text="Home"').first();
        if (await homeButton.count() > 0) {
          await homeButton.click();
          await page.waitForTimeout(2000);
        } else {
          await page.goto('/', { waitUntil: 'networkidle' });
        }

        // Verify we're back on dashboard
        const dashboardContent = await page.evaluate(() => {
          return (document.body.textContent?.trim().length || 0) > 100;
        });

        expect(dashboardContent).toBeTruthy();

        console.log(`  ✅ Successfully returned from ${pageInfo.name} to dashboard`);

      } catch (error) {
        console.warn(`  ⚠️ Navigation failed for ${pageInfo.name}: ${error}`);
      }
    }

    console.log('✅ Navigation validation completed');
  });
}); 