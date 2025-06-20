import { test, expect } from '@playwright/test';

test.describe('Responsive Design Validation', () => {
  test('should use responsive CSS classes and avoid hardcoded sizes', async ({
    page,
  }) => {
    console.log('🎨 Validating responsive design implementation...');

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Check for responsive utility classes
    const responsiveClassCheck = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const responsiveClasses = [];
      const hardcodedStyles = [];

      for (const element of elements) {
        const classList = Array.from(element.classList);
        const computedStyles = window.getComputedStyle(element);

        // Check for responsive classes
        const hasResponsiveClasses = classList.some(
          (cls) =>
            cls.includes('sm:') ||
            cls.includes('md:') ||
            cls.includes('lg:') ||
            cls.includes('xl:') ||
            cls.includes('2xl:') ||
            cls.includes('max-w-')
        );

        if (hasResponsiveClasses) {
          responsiveClasses.push({
            tag: element.tagName,
            classes: classList.filter(
              (cls) =>
                cls.includes('sm:') ||
                cls.includes('md:') ||
                cls.includes('lg:') ||
                cls.includes('xl:') ||
                cls.includes('2xl:') ||
                cls.includes('max-w-')
            ),
          });
        }

        // Check for problematic hardcoded widths
        const hasHardcodedWidth =
          element.style.width &&
          element.style.width.includes('px') &&
          !element.style.width.includes('%') &&
          parseInt(element.style.width) > 500; // Large hardcoded values

        if (hasHardcodedWidth) {
          hardcodedStyles.push({
            tag: element.tagName,
            width: element.style.width,
            classes: Array.from(classList),
          });
        }
      }

      return {
        responsiveClasses: responsiveClasses.slice(0, 10), // Sample
        hardcodedStyles,
        totalResponsiveElements: responsiveClasses.length,
      };
    });

    console.log(
      `✅ Found ${responsiveClassCheck.totalResponsiveElements} elements with responsive classes`
    );
    expect(responsiveClassCheck.totalResponsiveElements).toBeGreaterThan(5);

    console.log(
      `✅ Found ${responsiveClassCheck.hardcodedStyles.length} elements with problematic hardcoded widths`
    );
    expect(responsiveClassCheck.hardcodedStyles.length).toBeLessThan(3); // Allow some flexibility

    if (responsiveClassCheck.hardcodedStyles.length > 0) {
      console.warn(
        '⚠️ Found hardcoded styles:',
        responsiveClassCheck.hardcodedStyles
      );
    }
  });

  test('should adapt layout properly across common desktop breakpoints', async ({
    page,
  }) => {
    console.log('📱 Testing breakpoint adaptations...');

    const breakpoints = [
      { name: 'Small Desktop', width: 1024, height: 768 },
      { name: 'Medium Desktop', width: 1280, height: 800 },
      { name: 'Large Desktop', width: 1440, height: 900 },
      { name: 'XL Desktop', width: 1920, height: 1080 },
      { name: 'Ultra Wide', width: 2560, height: 1440 },
    ];

    await page.goto('/', { waitUntil: 'networkidle' });

    for (const breakpoint of breakpoints) {
      console.log(
        `📐 Testing ${breakpoint.name} (${breakpoint.width}x${breakpoint.height})`
      );

      await page.setViewportSize({
        width: breakpoint.width,
        height: breakpoint.height,
      });
      await page.waitForTimeout(1500);

      // Check layout metrics
      const layoutMetrics = await page.evaluate(() => {
        const main = document.querySelector('main');
        const body = document.body;
        const nav = document.querySelector('nav, [role="navigation"]');

        return {
          bodyWidth: body.offsetWidth,
          mainWidth: main ? main.offsetWidth : 0,
          navWidth: nav ? nav.offsetWidth : 0,
          viewportWidth: window.innerWidth,
          hasHorizontalScroll: body.scrollWidth > window.innerWidth,
          mainVisible: main
            ? main.offsetWidth > 0 && main.offsetHeight > 0
            : false,
        };
      });

      // Validate layout metrics
      expect(layoutMetrics.hasHorizontalScroll).toBeFalsy();
      expect(layoutMetrics.mainVisible).toBeTruthy();
      expect(layoutMetrics.mainWidth).toBeGreaterThan(0);
      expect(layoutMetrics.mainWidth).toBeLessThanOrEqual(breakpoint.width);

      // Check that content uses available space efficiently
      const spaceUtilization = layoutMetrics.mainWidth / breakpoint.width;
      expect(spaceUtilization).toBeGreaterThan(0.3); // Should use at least 30% of available space

      console.log(
        `✅ ${breakpoint.name}: Main content ${layoutMetrics.mainWidth}px (${Math.round(spaceUtilization * 100)}% utilization)`
      );
    }
  });

  test('should maintain navigation functionality across all desktop sizes', async ({
    page,
  }) => {
    console.log('🧭 Testing navigation consistency across sizes...');

    const sizes = [
      { width: 1024, height: 768 },
      { width: 1280, height: 800 },
      { width: 1440, height: 900 },
      { width: 1920, height: 1080 },
      { width: 2560, height: 1440 },
    ];

    for (const size of sizes) {
      console.log(`🔍 Testing navigation at ${size.width}x${size.height}`);

      await page.setViewportSize(size);
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      // Check navigation elements are present and clickable
      const navCheck = await page.evaluate(() => {
        const buttons = document.querySelectorAll(
          'button, a[href], [role="button"]'
        );
        const visibleButtons = Array.from(buttons).filter((btn) => {
          const rect = btn.getBoundingClientRect();
          const style = window.getComputedStyle(btn);
          return (
            rect.width > 0 &&
            rect.height > 0 &&
            style.visibility !== 'hidden' &&
            style.display !== 'none'
          );
        });

        return {
          totalButtons: buttons.length,
          visibleButtons: visibleButtons.length,
          minButtonSize: Math.min(
            ...visibleButtons.map((btn) => {
              const rect = btn.getBoundingClientRect();
              return Math.min(rect.width, rect.height);
            })
          ),
        };
      });

      expect(navCheck.visibleButtons).toBeGreaterThan(4); // Should have main navigation
      expect(navCheck.minButtonSize).toBeGreaterThan(30); // Buttons should be reasonably sized

      console.log(
        `✅ Navigation at ${size.width}px: ${navCheck.visibleButtons} visible buttons, min size: ${Math.round(navCheck.minButtonSize)}px`
      );
    }
  });

  test('should handle extreme viewport sizes gracefully', async ({ page }) => {
    console.log('🌊 Testing extreme viewport handling...');

    const extremeViewports = [
      { name: 'Very Wide', width: 3440, height: 1440 },
      { name: 'Ultra Wide', width: 5120, height: 1440 },
      { name: 'Narrow Desktop', width: 1024, height: 1366 },
    ];

    for (const viewport of extremeViewports) {
      console.log(
        `🔬 Testing ${viewport.name}: ${viewport.width}x${viewport.height}`
      );

      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      // Check for layout breaks
      const extremeLayoutCheck = await page.evaluate(() => {
        const main = document.querySelector('main');
        const body = document.body;

        // Check for overflow issues
        const hasHorizontalOverflow = body.scrollWidth > window.innerWidth;
        const hasVerticalOverflow = body.scrollHeight > window.innerHeight;

        // Check content distribution
        const mainRect = main ? main.getBoundingClientRect() : null;
        const contentCentered = mainRect
          ? Math.abs(
              window.innerWidth / 2 - (mainRect.left + mainRect.width / 2)
            ) <
            window.innerWidth * 0.1
          : false;

        return {
          hasHorizontalOverflow,
          hasVerticalOverflow,
          contentCentered,
          mainWidth: mainRect ? mainRect.width : 0,
          viewportWidth: window.innerWidth,
        };
      });

      expect(extremeLayoutCheck.hasHorizontalOverflow).toBeFalsy();
      expect(extremeLayoutCheck.mainWidth).toBeGreaterThan(0);
      expect(extremeLayoutCheck.mainWidth).toBeLessThanOrEqual(viewport.width);

      console.log(
        `✅ ${viewport.name}: Layout stable, content width ${extremeLayoutCheck.mainWidth}px`
      );
    }
  });
});
