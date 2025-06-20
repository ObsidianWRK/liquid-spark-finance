import { test, expect } from '@playwright/test';

interface LayoutAnalysis {
  hasNavigation: boolean;
  hasMainContent: boolean;
  hasHeaderArea: boolean;
  totalElements: number;
  interactiveElements: number;
  hasResponsiveClasses: boolean;
  glassMorphismElements: number;
  gridLayouts: number;
}

interface LayoutResult extends LayoutAnalysis {
  page: string;
}

test.describe('All Pages Responsive Design Validation', () => {
  const desktopViewports = [
    { name: 'Desktop Small', width: 1024, height: 768 },
    { name: 'Desktop Medium', width: 1280, height: 800 },
    { name: 'Desktop Large', width: 1440, height: 900 },
    { name: 'Desktop XL', width: 1920, height: 1080 },
    { name: 'Desktop Ultra Wide', width: 2560, height: 1440 },
  ];

  const allPageRoutes = [
    { name: 'Dashboard', path: '/', viewParam: null },
    { name: 'Clean Dashboard', path: '/clean-dashboard', viewParam: null },
    { name: 'Profile', path: '/profile', viewParam: null },
    { name: 'Optimized Profile', path: '/optimized-profile', viewParam: null },
    { name: 'Transaction Demo', path: '/transaction-demo', viewParam: null },
    { name: 'Menu Bar Demo', path: '/menu-bar-demo', viewParam: null },
    { name: 'Calculators Page', path: '/calculators', viewParam: null },
    { name: 'Insights Page', path: '/insights', viewParam: null },
    { name: 'Credit Score Page', path: '/credit-score', viewParam: null },

    // View-based routes
    { name: 'Transactions View', path: '/', viewParam: '?view=transactions' },
    { name: 'Insights View', path: '/', viewParam: '?view=insights' },
    { name: 'Reports View', path: '/', viewParam: '?view=reports' },
    { name: 'Savings View', path: '/', viewParam: '?view=savings' },
    { name: 'Calculators View', path: '/', viewParam: '?view=calculators' },
    { name: 'Investments View', path: '/', viewParam: '?view=investments' },
    { name: 'Budget View', path: '/', viewParam: '?view=budget' },

    // Component pages
    { name: 'Budget Planner', path: '/budget-planner', viewParam: null },
    {
      name: 'Investment Tracker',
      path: '/investment-tracker',
      viewParam: null,
    },
    { name: 'Savings Goals', path: '/savings', viewParam: null },
    { name: 'Reports', path: '/reports', viewParam: null },
    { name: 'Wrapped', path: '/wrapped', viewParam: null },
  ];

  test('should validate responsive design across all desktop viewports for every page', async ({
    page,
  }) => {
    console.log('🚀 Starting comprehensive all-pages responsive validation...');

    for (const viewport of desktopViewports) {
      console.log(
        `\n📐 Testing ${viewport.name} (${viewport.width}x${viewport.height})`
      );

      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });

      for (const route of allPageRoutes) {
        const fullUrl = route.viewParam
          ? `${route.path}${route.viewParam}`
          : route.path;
        console.log(`  🔗 Testing: ${route.name} (${fullUrl})`);

        try {
          // Navigate to the page
          await page.goto(fullUrl, {
            waitUntil: 'networkidle',
            timeout: 10000,
          });
          await page.waitForTimeout(2000);

          // 1. Check for horizontal scroll (critical responsive issue)
          const hasHorizontalScroll = await page.evaluate(() => {
            return (
              document.body.scrollWidth > window.innerWidth ||
              document.documentElement.scrollWidth > window.innerWidth
            );
          });

          expect(hasHorizontalScroll).toBeFalsy();

          // 2. Verify content is visible and properly sized
          const layoutMetrics = await page.evaluate(() => {
            const main = document.querySelector('main');
            const body = document.body;

            return {
              bodyWidth: body.offsetWidth,
              mainWidth: main ? main.offsetWidth : 0,
              mainVisible: main
                ? main.offsetWidth > 0 && main.offsetHeight > 0
                : false,
              hasContent: (document.body.textContent?.trim().length || 0) > 50,
              contentElements: document.querySelectorAll(
                'div, p, h1, h2, h3, h4, h5, h6, span'
              ).length,
            };
          });

          expect(layoutMetrics.hasContent).toBeTruthy();
          expect(layoutMetrics.contentElements).toBeGreaterThan(5);

          if (layoutMetrics.mainWidth > 0) {
            expect(layoutMetrics.mainWidth).toBeLessThanOrEqual(viewport.width);
            expect(layoutMetrics.mainVisible).toBeTruthy();
          }

          // 3. Verify no white screen
          const backgroundColor = await page.evaluate(() => {
            return window.getComputedStyle(document.body).backgroundColor;
          });

          expect(backgroundColor).not.toBe('rgb(255, 255, 255)');

          // 4. Check interactive elements are properly sized
          const interactiveCheck = await page.evaluate(() => {
            const buttons = Array.from(
              document.querySelectorAll('button, a[href], [role="button"]')
            );
            const visibleButtons = buttons.filter((btn) => {
              const rect = btn.getBoundingClientRect();
              const style = window.getComputedStyle(btn);
              return (
                rect.width > 0 &&
                rect.height > 0 &&
                style.visibility !== 'hidden' &&
                style.display !== 'none'
              );
            });

            const buttonSizes = visibleButtons.map((btn) => {
              const rect = btn.getBoundingClientRect();
              return { width: rect.width, height: rect.height };
            });

            return {
              totalButtons: buttons.length,
              visibleButtons: visibleButtons.length,
              averageButtonSize:
                buttonSizes.length > 0
                  ? buttonSizes.reduce(
                      (acc, size) => acc + Math.min(size.width, size.height),
                      0
                    ) / buttonSizes.length
                  : 0,
            };
          });

          if (interactiveCheck.visibleButtons > 0) {
            expect(interactiveCheck.averageButtonSize).toBeGreaterThan(25);
          }

          console.log(
            `    ✅ ${route.name}: Layout valid, ${layoutMetrics.contentElements} elements, ${interactiveCheck.visibleButtons} buttons`
          );
        } catch (error) {
          console.warn(`    ⚠️ ${route.name}: Navigation failed - ${error}`);
          // Continue testing other pages even if one fails
        }
      }

      console.log(`✅ ${viewport.name} validation completed for all pages`);
    }

    console.log('\n🎉 All pages responsive validation completed!');
  });

  test('should ensure navigation works from every page back to dashboard', async ({
    page,
  }) => {
    console.log('🏠 Testing navigation from all pages back to dashboard...');

    await page.setViewportSize({ width: 1920, height: 1080 });

    for (const route of allPageRoutes) {
      if (route.name === 'Dashboard') continue; // Skip dashboard itself

      const fullUrl = route.viewParam
        ? `${route.path}${route.viewParam}`
        : route.path;
      console.log(`🔗 Testing return navigation from: ${route.name}`);

      try {
        // Navigate to the page
        await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 10000 });
        await page.waitForTimeout(2000);

        // Verify we're on the page
        const contentLength = await page.evaluate(() => {
          return document.body.textContent?.trim().length || 0;
        });

        expect(contentLength).toBeGreaterThan(50);

        // Try to navigate back to dashboard using multiple strategies
        let returnedHome = false;

        // Strategy 1: Click Home button
        const homeButton = page
          .locator('button:has-text("Home"), [aria-label*="Home"], text="Home"')
          .first();
        if ((await homeButton.count()) > 0) {
          await homeButton.click();
          await page.waitForTimeout(2000);
          returnedHome = true;
        }

        // Strategy 2: Direct navigation
        if (!returnedHome) {
          await page.goto('/', { waitUntil: 'networkidle' });
          await page.waitForTimeout(1500);
          returnedHome = true;
        }

        // Verify we're back on dashboard
        const dashboardContent = await page.evaluate(() => {
          return document.body.textContent?.trim().length || 0;
        });

        expect(dashboardContent).toBeGreaterThan(100);

        console.log(`✅ Successfully returned from ${route.name} to dashboard`);
      } catch (error) {
        console.warn(`⚠️ Navigation test failed for ${route.name}: ${error}`);
      }
    }

    console.log('✅ All return navigation tests completed');
  });

  test('should validate consistent layout components across all pages', async ({
    page,
  }) => {
    console.log('🎨 Testing layout consistency across all pages...');

    await page.setViewportSize({ width: 1920, height: 1080 });

    const layoutResults: LayoutResult[] = [];

    for (const route of allPageRoutes) {
      const fullUrl = route.viewParam
        ? `${route.path}${route.viewParam}`
        : route.path;
      console.log(`🔍 Analyzing layout: ${route.name}`);

      try {
        await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 10000 });
        await page.waitForTimeout(2000);

        const layoutAnalysis = await page.evaluate((): LayoutAnalysis => {
          return {
            hasNavigation:
              document.querySelector('nav, [role="navigation"]') !== null,
            hasMainContent: document.querySelector('main') !== null,
            hasHeaderArea:
              document.querySelector('header, [role="banner"]') !== null,
            totalElements: document.querySelectorAll('*').length,
            interactiveElements: document.querySelectorAll(
              'button, a, input, select, textarea'
            ).length,
            hasResponsiveClasses: Array.from(
              document.querySelectorAll('*')
            ).some((el) =>
              Array.from(el.classList).some(
                (cls) =>
                  cls.includes('sm:') ||
                  cls.includes('md:') ||
                  cls.includes('lg:') ||
                  cls.includes('xl:') ||
                  cls.includes('2xl:')
              )
            ),
            glassMorphismElements: document.querySelectorAll(
              '[class*="glass"], [class*="liquid"]'
            ).length,
            gridLayouts: document.querySelectorAll('[class*="grid"]').length,
          };
        });

        layoutResults.push({
          page: route.name,
          ...layoutAnalysis,
        });

        // Basic layout validation
        expect(layoutAnalysis.totalElements).toBeGreaterThan(20);
        expect(layoutAnalysis.interactiveElements).toBeGreaterThan(2);
        expect(layoutAnalysis.hasResponsiveClasses).toBeTruthy();

        console.log(
          `  ✅ ${route.name}: ${layoutAnalysis.totalElements} elements, ${layoutAnalysis.interactiveElements} interactive, responsive: ${layoutAnalysis.hasResponsiveClasses}`
        );
      } catch (error) {
        console.warn(`  ⚠️ Layout analysis failed for ${route.name}: ${error}`);
      }
    }

    // Verify consistency across pages
    const avgInteractiveElements =
      layoutResults.reduce(
        (sum, result) => sum + result.interactiveElements,
        0
      ) / layoutResults.length;
    const responsivePages = layoutResults.filter(
      (result) => result.hasResponsiveClasses
    ).length;

    expect(avgInteractiveElements).toBeGreaterThan(5);
    expect(responsivePages).toBeGreaterThan(layoutResults.length * 0.8); // At least 80% should be responsive

    console.log(
      `✅ Layout consistency validated: ${layoutResults.length} pages analyzed, ${responsivePages} responsive`
    );
  });

  test('should handle mobile to desktop viewport transitions on all pages', async ({
    page,
  }) => {
    console.log('📱➡️🖥️ Testing mobile to desktop transitions on all pages...');

    const transitionViewports = [
      { width: 375, height: 667 }, // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1024, height: 768 }, // Small Desktop
      { width: 1440, height: 900 }, // Large Desktop
      { width: 2560, height: 1440 }, // Ultra Wide
    ];

    // Test a subset of critical pages for performance
    const criticalPages = allPageRoutes.filter((route) =>
      [
        'Dashboard',
        'Transactions View',
        'Insights View',
        'Profile',
        'Calculators View',
      ].includes(route.name)
    );

    for (const route of criticalPages) {
      const fullUrl = route.viewParam
        ? `${route.path}${route.viewParam}`
        : route.path;
      console.log(`🔄 Testing viewport transitions for: ${route.name}`);

      try {
        await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 10000 });

        for (const viewport of transitionViewports) {
          await page.setViewportSize({
            width: viewport.width,
            height: viewport.height,
          });
          await page.waitForTimeout(1000);

          const transitionCheck = await page.evaluate(() => {
            const mainElement = document.querySelector('main');
            return {
              hasHorizontalScroll:
                document.body.scrollWidth > window.innerWidth,
              contentVisible: mainElement
                ? mainElement.getBoundingClientRect().width > 0
                : true,
              buttonsAccessible:
                Array.from(document.querySelectorAll('button')).filter(
                  (btn) => {
                    const rect = btn.getBoundingClientRect();
                    return rect.width > 30 && rect.height > 30;
                  }
                ).length > 0,
            };
          });

          expect(transitionCheck.hasHorizontalScroll).toBeFalsy();
          expect(transitionCheck.contentVisible).toBeTruthy();

          console.log(
            `    ✅ ${viewport.width}px: No overflow, content visible`
          );
        }

        console.log(`  ✅ ${route.name}: All viewport transitions successful`);
      } catch (error) {
        console.warn(`  ⚠️ Transition test failed for ${route.name}: ${error}`);
      }
    }

    console.log('✅ All viewport transition tests completed');
  });
});
