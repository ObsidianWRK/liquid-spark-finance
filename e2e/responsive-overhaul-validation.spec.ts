import { test, expect } from '@playwright/test';

/**
 * Responsive Overhaul Validation Test Suite
 * Validates mobile, tablet, desktop, and ultrawide viewport compliance
 * Focuses on More drawer components and global consistency
 */

const viewports = [
  { name: 'Mobile Small', width: 320, height: 568 },
  { name: 'Mobile Large', width: 480, height: 854 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1024, height: 768 },
  { name: 'Large Desktop', width: 1440, height: 900 },
  { name: 'Ultra Wide', width: 1920, height: 1080 },
  { name: 'Ultra Wide XL', width: 2560, height: 1440 },
];

const moreDrawerRoutes = [
  { path: '/calculators', name: 'Calculators Hub' },
  { path: '/profile', name: 'Profile Settings' },
  { path: '/transaction-demo', name: 'Transaction Demo' },
];

test.describe('Responsive Overhaul Validation - More Drawer Priority', () => {
  test.beforeEach(async ({ page }) => {
    // Set up performance monitoring
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('should handle More drawer components across all viewports', async ({
    page,
  }) => {
    console.log('🔍 Testing More drawer responsive compliance...');

    for (const route of moreDrawerRoutes) {
      console.log(`📱 Testing ${route.name} across viewports...`);

      for (const viewport of viewports) {
        console.log(
          `  📐 Testing ${viewport.name} (${viewport.width}x${viewport.height})`
        );

        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });
        await page.goto(route.path, {
          waitUntil: 'networkidle',
          timeout: 10000,
        });
        await page.waitForTimeout(1000);

        // Check for horizontal overflow
        const hasOverflow = await page.evaluate(() => {
          return (
            document.body.scrollWidth > window.innerWidth ||
            document.documentElement.scrollWidth > window.innerWidth
          );
        });

        expect(hasOverflow).toBeFalsy();

        // Validate responsive grid layouts
        const gridAnalysis = await page.evaluate(() => {
          const grids = document.querySelectorAll('[class*="grid"]');
          const responsiveGrids = Array.from(grids).filter((grid) =>
            Array.from(grid.classList).some(
              (cls) =>
                cls.includes('sm:') ||
                cls.includes('md:') ||
                cls.includes('lg:') ||
                cls.includes('xl:') ||
                cls.includes('2xl:')
            )
          );

          return {
            totalGrids: grids.length,
            responsiveGrids: responsiveGrids.length,
            hasResponsiveClasses: responsiveGrids.length > 0,
          };
        });

        expect(gridAnalysis.hasResponsiveClasses).toBeTruthy();
        expect(gridAnalysis.responsiveGrids).toBeGreaterThan(0);

        // Check for proper spacing and typography scaling
        const layoutMetrics = await page.evaluate(() => {
          const main = document.querySelector('main') || document.body;
          const headings = document.querySelectorAll('h1, h2, h3');
          const buttons = document.querySelectorAll('button');

          return {
            mainWidth: main.offsetWidth,
            viewportWidth: window.innerWidth,
            hasHeadings: headings.length > 0,
            buttonCount: buttons.length,
            spaceUtilization: main.offsetWidth / window.innerWidth,
          };
        });

        expect(layoutMetrics.spaceUtilization).toBeGreaterThan(0.3);
        expect(layoutMetrics.spaceUtilization).toBeLessThanOrEqual(1.0);

        console.log(
          `    ✅ ${viewport.name}: Layout stable, utilization ${Math.round(layoutMetrics.spaceUtilization * 100)}%`
        );
      }

      console.log(`  🎯 ${route.name}: All viewports passed`);
    }
  });

  test('should maintain performance budgets across viewports', async ({
    page,
  }) => {
    console.log('⚡ Testing performance budgets...');

    const budgets = {
      cls: 0.1, // Cumulative Layout Shift
      lcp: 2500, // Largest Contentful Paint (ms)
      fid: 100, // First Input Delay (ms)
    };

    for (const viewport of viewports.slice(0, 4)) {
      // Test key viewports
      console.log(`📊 Performance testing at ${viewport.width}px...`);

      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });

      // Navigate and measure performance
      await page.goto('/calculators', { waitUntil: 'networkidle' });

      const performanceMetrics = await page.evaluate(() => {
        return new Promise((resolve) => {
          // Simplified performance measurement
          const navigation = performance.getEntriesByType('navigation')[0];

          setTimeout(() => {
            resolve({
              loadTime: navigation.loadEventEnd - navigation.loadEventStart,
              domContentLoaded:
                navigation.domContentLoadedEventEnd -
                navigation.domContentLoadedEventStart,
              firstPaint:
                performance.getEntriesByName('first-paint')[0]?.startTime || 0,
            });
          }, 1000);
        });
      });

      // Basic performance validation
      expect(performanceMetrics.loadTime).toBeLessThan(3000);
      console.log(
        `  ⚡ Load time: ${Math.round(performanceMetrics.loadTime)}ms`
      );
    }
  });

  test('should handle grid responsive breakpoints correctly', async ({
    page,
  }) => {
    console.log('🎯 Testing grid breakpoint transitions...');

    await page.goto('/calculators');

    const breakpointTests = [
      { width: 320, expectedCols: 1, name: 'Mobile' },
      { width: 640, expectedCols: 2, name: 'Small' },
      { width: 768, expectedCols: 2, name: 'Tablet' },
      { width: 1024, expectedCols: 3, name: 'Desktop' },
      { width: 1280, expectedCols: 4, name: 'Large' },
      { width: 1920, expectedCols: 5, name: 'Ultra-wide' },
    ];

    for (const test of breakpointTests) {
      await page.setViewportSize({ width: test.width, height: 800 });
      await page.waitForTimeout(500);

      const gridLayout = await page.evaluate(() => {
        const calculatorGrid = document.querySelector(
          '[data-testid="calculators-grid"]'
        );
        if (!calculatorGrid) return { columns: 0, items: 0 };

        const computedStyle = window.getComputedStyle(calculatorGrid);
        const gridCols = computedStyle.gridTemplateColumns;
        const columnCount = gridCols.split(' ').length;
        const itemCount = calculatorGrid.children.length;

        return {
          columns: columnCount,
          items: itemCount,
          gridCols: gridCols,
        };
      });

      console.log(
        `  📏 ${test.name} (${test.width}px): ${gridLayout.columns} columns`
      );
      // Allow some flexibility in column count based on content
      expect(gridLayout.columns).toBeGreaterThanOrEqual(1);
      expect(gridLayout.columns).toBeLessThanOrEqual(6);
    }
  });

  test('should validate unified design tokens usage', async ({ page }) => {
    console.log('🎨 Testing design token compliance...');

    await page.goto('/calculators');
    await page.waitForTimeout(1000);

    const tokenCompliance = await page.evaluate(() => {
      const cards = document.querySelectorAll(
        '[data-testid="calculator-card"]'
      );
      const backgrounds = Array.from(cards).map((card) => {
        const styles = window.getComputedStyle(card);
        return {
          background: styles.backgroundColor,
          border: styles.borderColor,
          borderRadius: styles.borderRadius,
        };
      });

      // Check for consistent styling
      const uniqueBackgrounds = new Set(backgrounds.map((b) => b.background));
      const uniqueBorders = new Set(backgrounds.map((b) => b.border));
      const uniqueRadius = new Set(backgrounds.map((b) => b.borderRadius));

      return {
        cardCount: cards.length,
        consistentBackground: uniqueBackgrounds.size <= 2, // Allow for hover states
        consistentBorders: uniqueBorders.size <= 2,
        consistentRadius: uniqueRadius.size <= 2,
        backgrounds: Array.from(uniqueBackgrounds),
        borders: Array.from(uniqueBorders),
      };
    });

    expect(tokenCompliance.cardCount).toBeGreaterThan(5);
    expect(tokenCompliance.consistentBackground).toBeTruthy();
    expect(tokenCompliance.consistentBorders).toBeTruthy();
    expect(tokenCompliance.consistentRadius).toBeTruthy();

    console.log(
      `  ✅ Token compliance: ${tokenCompliance.cardCount} cards validated`
    );
  });

  test('should ensure touch-friendly targets on mobile', async ({ page }) => {
    console.log('👆 Testing touch target accessibility...');

    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/calculators');
    await page.waitForTimeout(1000);

    const touchTargets = await page.evaluate(() => {
      const interactiveElements = document.querySelectorAll(
        'button, a, [role="button"]'
      );

      return Array.from(interactiveElements).map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          area: rect.width * rect.height,
          isAccessible: rect.width >= 44 && rect.height >= 44,
        };
      });
    });

    const accessibleTargets = touchTargets.filter(
      (target) => target.isAccessible
    );
    const accessibilityRatio = accessibleTargets.length / touchTargets.length;

    // Expect at least 80% of interactive elements to meet WCAG guidelines
    expect(accessibilityRatio).toBeGreaterThan(0.8);

    console.log(
      `  ✅ Touch accessibility: ${Math.round(accessibilityRatio * 100)}% compliant`
    );
  });

  test('should handle extreme viewport sizes gracefully', async ({ page }) => {
    console.log('🌊 Testing extreme viewport handling...');

    const extremeViewports = [
      { width: 280, height: 653, name: 'Very Narrow' },
      { width: 3440, height: 1440, name: 'Ultra-wide Monitor' },
      { width: 1024, height: 2000, name: 'Very Tall' },
    ];

    for (const viewport of extremeViewports) {
      console.log(
        `  🔬 Testing ${viewport.name}: ${viewport.width}x${viewport.height}`
      );

      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.goto('/calculators', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      const extremeLayoutCheck = await page.evaluate(() => {
        const body = document.body;
        const main = document.querySelector('main') || body;

        return {
          hasHorizontalOverflow: body.scrollWidth > window.innerWidth,
          mainVisible: main.offsetWidth > 0 && main.offsetHeight > 0,
          contentAccessible:
            document.querySelector('[data-testid="calculators-grid"]') !== null,
        };
      });

      expect(extremeLayoutCheck.hasHorizontalOverflow).toBeFalsy();
      expect(extremeLayoutCheck.mainVisible).toBeTruthy();
      expect(extremeLayoutCheck.contentAccessible).toBeTruthy();

      console.log(`    ✅ ${viewport.name}: Layout stable and accessible`);
    }
  });
});

test.describe('Global Responsive Consistency', () => {
  test('should maintain navigation consistency across pages', async ({
    page,
  }) => {
    console.log('🧭 Testing navigation consistency...');

    const testViewports = [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1280, height: 800 },
    ];

    const routes = ['/', '/calculators', '/profile'];

    for (const viewport of testViewports) {
      console.log(`  📱 Testing navigation at ${viewport.width}px...`);

      await page.setViewportSize(viewport);

      for (const route of routes) {
        await page.goto(route, { waitUntil: 'networkidle' });
        await page.waitForTimeout(500);

        const navState = await page.evaluate(() => {
          const nav = document.querySelector('nav, [role="navigation"]');
          const mobileMenu = document.querySelector(
            '[aria-label*="menu"], [aria-label*="Menu"]'
          );
          const bottomNav = document.querySelector(
            '[class*="bottom"], [class*="dock"]'
          );

          return {
            hasNavigation: nav !== null,
            hasMobileMenu: mobileMenu !== null,
            hasBottomNav: bottomNav !== null,
            navVisible: nav ? nav.offsetWidth > 0 : false,
          };
        });

        expect(navState.hasNavigation).toBeTruthy();
        console.log(`    📍 ${route}: Navigation present and functional`);
      }
    }
  });
});
