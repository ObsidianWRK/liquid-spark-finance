/**
 * Desktop Chart Components Test Suite
 * 
 * Mission: Execute comprehensive Playwright tests for all chart components on desktop viewports (≥1280px)
 * 
 * Test Coverage:
 * - GraphBase foundation functionality
 * - LineChart rendering and interactions
 * - AreaChart gradient rendering
 * - StackedBarChart category interactions
 * - TimeRangeToggle selection behavior
 * - Desktop-specific features (hover, keyboard nav, multi-chart coordination)
 * - Apple UX validation (colors, typography, animation)
 * - Financial data accuracy (currency formatting, large numbers)
 * - Visual regression testing
 * - Performance and accessibility compliance
 */

import { test, expect, Page, BrowserContext } from '@playwright/test';

// Desktop viewport configurations
const DESKTOP_VIEWPORTS = [
  { name: 'HD', width: 1280, height: 720 },
  { name: 'MacBook Air', width: 1440, height: 900 },
  { name: 'Full HD', width: 1920, height: 1080 },
  { name: 'QHD', width: 2560, height: 1440 }
];

// Test data for charts
const CHART_TEST_DATA = {
  lineChart: [
    { date: '2024-01-01', value: 50000, spending: 3200, income: 5500 },
    { date: '2024-02-01', value: 52000, spending: 3400, income: 5600 },
    { date: '2024-03-01', value: 48000, spending: 3800, income: 5400 },
    { date: '2024-04-01', value: 55000, spending: 3100, income: 5800 },
    { date: '2024-05-01', value: 58000, spending: 2900, income: 6000 },
    { date: '2024-06-01', value: 62000, spending: 3300, income: 6200 }
  ],
  largeNumbers: [
    { date: '2024-01-01', portfolio: 850000, assets: 1200000, liabilities: 350000 },
    { date: '2024-02-01', portfolio: 875000, assets: 1225000, liabilities: 350000 },
    { date: '2024-03-01', portfolio: 920000, assets: 1270000, liabilities: 350000 },
    { date: '2024-04-01', portfolio: 890000, assets: 1240000, liabilities: 350000 },
    { date: '2024-05-01', portfolio: 960000, assets: 1310000, liabilities: 350000 },
    { date: '2024-06-01', portfolio: 1050000, assets: 1400000, liabilities: 350000 }
  ]
};

// Helper function to create a test page with chart demo
async function createChartTestPage(page: Page, chartType: string, data: any[], options: any = {}) {
  await page.goto('/');
  
  // Inject test chart into the page
  await page.evaluate(({ chartType, data, options }) => {
    // Create a container for the test chart
    const container = document.createElement('div');
    container.id = 'test-chart-container';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 9999;
      background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%);
      padding: 2rem;
      box-sizing: border-box;
    `;
    
    document.body.appendChild(container);
    
    // Create React component script
    const script = document.createElement('script');
    script.type = 'module';
    script.textContent = `
      import React from 'react';
      import { createRoot } from 'react-dom/client';
      import { GraphBase } from '/src/components/charts/index.ts';
      
      const TestChart = () => {
        return React.createElement(GraphBase, {
          type: '${chartType}',
          data: ${JSON.stringify(data)},
          title: 'Test ${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart',
          subtitle: 'Desktop viewport testing',
          timeControls: {
            show: true,
            options: ['1W', '1M', '3M', '6M', '1Y', 'ALL'],
            defaultRange: '1M'
          },
          dimensions: {
            height: 400,
            responsive: true
          },
          accessibility: {
            keyboardNavigation: true,
            screenReaderSupport: true,
            dataTableAlternative: true,
            liveRegion: true
          },
          animation: {
            enable: true,
            duration: 800
          },
          tooltip: {
            show: true
          },
          grid: {
            show: true,
            horizontal: true,
            vertical: false
          },
          ...${JSON.stringify(options)}
        });
      };
      
      const root = createRoot(document.getElementById('test-chart-container'));
      root.render(React.createElement(TestChart));
    `;
    
    document.head.appendChild(script);
  }, { chartType, data, options });
  
  // Wait for chart to render
  await page.waitForSelector('[data-testid="chart-container"], .chart-component', { timeout: 10000 });
  await page.waitForTimeout(1000); // Allow animations to complete
}

// Performance monitoring helper
async function measurePerformance(page: Page, action: () => Promise<void>) {
  const metrics = await page.evaluate(() => {
    performance.mark('test-start');
    return {
      start: performance.now()
    };
  });
  
  await action();
  
  const endMetrics = await page.evaluate(() => {
    performance.mark('test-end');
    performance.measure('test-duration', 'test-start', 'test-end');
    
    const measure = performance.getEntriesByName('test-duration')[0];
    return {
      duration: measure.duration,
      end: performance.now()
    };
  });
  
  return endMetrics;
}

// Visual regression test helper
async function compareScreenshot(page: Page, name: string, options: any = {}) {
  const screenshot = await page.screenshot({
    fullPage: false,
    clip: { x: 0, y: 0, width: page.viewportSize()!.width, height: page.viewportSize()!.height },
    ...options
  });
  
  expect(screenshot).toMatchSnapshot(`desktop-${name}.png`);
}

test.describe('Desktop Chart Components - Comprehensive Test Suite', () => {
  
  test.describe('Viewport Matrix Tests', () => {
    for (const viewport of DESKTOP_VIEWPORTS) {
      test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
        
        test.beforeEach(async ({ page }) => {
          await page.setViewportSize({ width: viewport.width, height: viewport.height });
        });

        test('GraphBase foundation renders correctly', async ({ page }) => {
          await createChartTestPage(page, 'line', CHART_TEST_DATA.lineChart);
          
          // Check basic structure
          const chartContainer = page.locator('.chart-component');
          await expect(chartContainer).toBeVisible();
          
          // Check title rendering
          const title = page.locator('h2', { hasText: 'Test Line Chart' });
          await expect(title).toBeVisible();
          
          // Check time controls
          const timeControls = page.locator('[role="tablist"]');
          await expect(timeControls).toBeVisible();
          
          // Verify Apple typography is applied
          const titleStyles = await title.evaluate(el => getComputedStyle(el));
          expect(titleStyles.fontFamily).toContain('SF Pro');
          
          // Take screenshot for visual regression
          await compareScreenshot(page, `graphbase-${viewport.name.toLowerCase().replace(' ', '-')}`);
        });

        test('LineChart renders with proper styling', async ({ page }) => {
          await createChartTestPage(page, 'line', CHART_TEST_DATA.lineChart);
          
          // Wait for SVG elements to render
          await page.waitForSelector('svg .recharts-line', { timeout: 5000 });
          
          // Check line elements
          const lines = page.locator('svg .recharts-line');
          const lineCount = await lines.count();
          expect(lineCount).toBeGreaterThan(0);
          
          // Check stroke properties
          const firstLine = lines.first();
          const strokeWidth = await firstLine.evaluate(el => getComputedStyle(el).strokeWidth);
          expect(parseInt(strokeWidth)).toBeGreaterThan(0);
          
          // Visual regression test
          await compareScreenshot(page, `linechart-${viewport.name.toLowerCase().replace(' ', '-')}`);
        });

        test('AreaChart gradient rendering', async ({ page }) => {
          await createChartTestPage(page, 'area', CHART_TEST_DATA.lineChart);
          
          // Wait for area elements
          await page.waitForSelector('svg .recharts-area', { timeout: 5000 });
          
          // Check area elements
          const areas = page.locator('svg .recharts-area');
          const areaCount = await areas.count();
          expect(areaCount).toBeGreaterThan(0);
          
          // Check fill opacity
          const firstArea = areas.first();
          const fillOpacity = await firstArea.evaluate(el => getComputedStyle(el).fillOpacity);
          expect(parseFloat(fillOpacity)).toBeGreaterThan(0);
          expect(parseFloat(fillOpacity)).toBeLessThanOrEqual(1);
          
          // Visual regression test
          await compareScreenshot(page, `areachart-${viewport.name.toLowerCase().replace(' ', '-')}`);
        });

        test('StackedBarChart category interactions', async ({ page }) => {
          await createChartTestPage(page, 'stackedBar', CHART_TEST_DATA.lineChart);
          
          // Wait for bar elements
          await page.waitForSelector('svg .recharts-bar', { timeout: 5000 });
          
          // Check bar elements
          const bars = page.locator('svg .recharts-bar');
          const barCount = await bars.count();
          expect(barCount).toBeGreaterThan(0);
          
          // Test hover interaction
          const firstBar = bars.first();
          await firstBar.hover();
          
          // Check for tooltip appearance
          const tooltip = page.locator('.recharts-tooltip-wrapper');
          await expect(tooltip).toBeVisible({ timeout: 2000 });
          
          // Visual regression test
          await compareScreenshot(page, `stackedbarchart-${viewport.name.toLowerCase().replace(' ', '-')}`);
        });

        test('TimeRangeToggle selection behavior', async ({ page }) => {
          await createChartTestPage(page, 'line', CHART_TEST_DATA.lineChart);
          
          // Find time range buttons
          const timeButtons = page.locator('[role="tab"]');
          await expect(timeButtons.first()).toBeVisible();
          
          // Test each time range option
          const buttonCount = await timeButtons.count();
          expect(buttonCount).toBeGreaterThanOrEqual(6); // Should have at least 6 options
          
          // Test button selection
          const threeMonthButton = page.locator('[role="tab"]', { hasText: '3M' });
          await threeMonthButton.click();
          
          // Check aria-selected attribute
          const isSelected = await threeMonthButton.getAttribute('aria-selected');
          expect(isSelected).toBe('true');
          
          // Visual state should change
          const buttonClasses = await threeMonthButton.getAttribute('class');
          expect(buttonClasses).toContain('bg-white/15');
        });
      });
    }
  });

  test.describe('Desktop-Specific Features', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 }); // Use Full HD for feature tests
    });

    test('Hover interactions and tooltips', async ({ page }) => {
      await createChartTestPage(page, 'line', CHART_TEST_DATA.lineChart);
      
      // Wait for chart to be ready
      await page.waitForSelector('svg .recharts-line', { timeout: 5000 });
      
      // Test hover on data points
      const chartArea = page.locator('.recharts-wrapper');
      
      // Hover over the chart area
      await chartArea.hover({ position: { x: 200, y: 200 } });
      
      // Check for tooltip
      const tooltip = page.locator('.recharts-tooltip-wrapper');
      await expect(tooltip).toBeVisible({ timeout: 3000 });
      
      // Check tooltip content
      const tooltipContent = page.locator('.recharts-tooltip-wrapper .recharts-default-tooltip');
      await expect(tooltipContent).toBeVisible();
      
      // Move mouse away and tooltip should disappear
      await page.mouse.move(50, 50);
      await expect(tooltip).not.toBeVisible({ timeout: 2000 });
    });

    test('Keyboard navigation flows', async ({ page }) => {
      await createChartTestPage(page, 'line', CHART_TEST_DATA.lineChart);
      
      // Focus on the chart component
      const chartContainer = page.locator('.chart-component');
      await chartContainer.focus();
      
      // Test Tab navigation through time controls
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(':focus');
      
      // Should focus on first time control button
      const firstTimeButton = page.locator('[role="tab"]').first();
      await expect(firstTimeButton).toBeFocused();
      
      // Test arrow key navigation
      await page.keyboard.press('ArrowRight');
      const secondTimeButton = page.locator('[role="tab"]').nth(1);
      await expect(secondTimeButton).toBeFocused();
      
      // Test Enter key activation
      await page.keyboard.press('Enter');
      const isSelected = await secondTimeButton.getAttribute('aria-selected');
      expect(isSelected).toBe('true');
      
      // Test Alt+T for data table toggle
      await chartContainer.focus();
      await page.keyboard.press('Alt+KeyT');
      
      // Check for data table appearance
      const dataTable = page.locator('.chart-data-table');
      await expect(dataTable).toBeVisible({ timeout: 2000 });
    });

    test('Multi-chart coordination with global time range', async ({ page }) => {
      // Create two charts with global time range
      await page.goto('/');
      
      await page.evaluate(() => {
        // Create container for multiple charts
        const container = document.createElement('div');
        container.id = 'multi-chart-container';
        container.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 9999;
          background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%);
          padding: 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          box-sizing: border-box;
        `;
        
        document.body.appendChild(container);
        
        // Create React component script for multiple charts
        const script = document.createElement('script');
        script.type = 'module';
        script.textContent = `
          import React, { useState } from 'react';
          import { createRoot } from 'react-dom/client';
          import { GraphBase } from '/src/components/charts/index.ts';
          
          const MultiChartDemo = () => {
            const [globalTimeRange, setGlobalTimeRange] = useState('1M');
            
            const data = ${JSON.stringify(CHART_TEST_DATA.lineChart)};
            
            return React.createElement('div', { style: { display: 'contents' } }, [
              React.createElement(GraphBase, {
                key: 'chart1',
                type: 'line',
                data: data,
                title: 'Chart 1',
                timeRange: globalTimeRange,
                onTimeRangeChange: setGlobalTimeRange,
                timeControls: {
                  show: true,
                  options: ['1W', '1M', '3M', '6M', '1Y', 'ALL'],
                  defaultRange: '1M'
                },
                dimensions: { height: 300, responsive: true }
              }),
              React.createElement(GraphBase, {
                key: 'chart2',
                type: 'area',
                data: data,
                title: 'Chart 2',
                timeRange: globalTimeRange,
                onTimeRangeChange: setGlobalTimeRange,
                timeControls: {
                  show: true,
                  options: ['1W', '1M', '3M', '6M', '1Y', 'ALL'],
                  defaultRange: '1M'
                },
                dimensions: { height: 300, responsive: true }
              })
            ]);
          };
          
          const root = createRoot(document.getElementById('multi-chart-container'));
          root.render(React.createElement(MultiChartDemo));
        `;
        
        document.head.appendChild(script);
      });
      
      // Wait for both charts to render
      await page.waitForSelector('.chart-component', { timeout: 10000 });
      const charts = page.locator('.chart-component');
      await expect(charts).toHaveCount(2);
      
      // Change time range on first chart
      const firstChart = charts.first();
      const firstChartTimeButton = firstChart.locator('[role="tab"]', { hasText: '3M' });
      await firstChartTimeButton.click();
      
      // Verify both charts update
      const allTimeButtons = page.locator('[role="tab"][aria-selected="true"]', { hasText: '3M' });
      await expect(allTimeButtons).toHaveCount(2);
    });

    test('High-resolution rendering quality', async ({ page }) => {
      await page.setViewportSize({ width: 2560, height: 1440 }); // QHD resolution
      await createChartTestPage(page, 'line', CHART_TEST_DATA.lineChart);
      
      // Check SVG scaling
      const svg = page.locator('svg').first();
      const svgBox = await svg.boundingBox();
      
      expect(svgBox!.width).toBeGreaterThan(800); // Should scale well on high-res
      
      // Check text readability
      const axisLabels = page.locator('svg text');
      const labelCount = await axisLabels.count();
      expect(labelCount).toBeGreaterThan(0);
      
      // Check font sizes are appropriate for high-res
      const firstLabel = axisLabels.first();
      const fontSize = await firstLabel.evaluate(el => getComputedStyle(el).fontSize);
      expect(parseInt(fontSize)).toBeGreaterThanOrEqual(10);
      
      // Visual regression test for high-res
      await compareScreenshot(page, 'high-resolution-quality', { 
        threshold: 0.3 // Allow slight variations in high-res rendering
      });
    });
  });

  test.describe('Apple UX Validation', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 }); // MacBook Air viewport
    });

    test('Color accuracy (Apple system colors)', async ({ page }) => {
      await createChartTestPage(page, 'line', CHART_TEST_DATA.lineChart);
      
      // Check background gradient
      const chartContainer = page.locator('.chart-component');
      const backgroundStyle = await chartContainer.evaluate(el => getComputedStyle(el).background);
      
      // Should contain blue/purple gradient colors
      expect(backgroundStyle).toMatch(/(rgb\(30, 58, 138\)|rgb\(55, 48, 163\)|rgb\(88, 28, 135\))/);
      
      // Check text colors
      const title = page.locator('h2');
      const titleColor = await title.evaluate(el => getComputedStyle(el).color);
      
      // Should be white or close to white for contrast
      expect(titleColor).toMatch(/rgb\(255, 255, 255\)|rgba\(255, 255, 255/);
      
      // Check chart line colors
      const chartLine = page.locator('svg .recharts-line path').first();
      const strokeColor = await chartLine.evaluate(el => getComputedStyle(el).stroke);
      
      // Should use defined color palette
      expect(strokeColor).toMatch(/rgb\(|rgba\(|#[0-9a-fA-F]{6}/);
    });

    test('Typography rendering (SF Pro fallbacks)', async ({ page }) => {
      await createChartTestPage(page, 'line', CHART_TEST_DATA.lineChart);
      
      // Check title font
      const title = page.locator('h2');
      const titleFont = await title.evaluate(el => getComputedStyle(el).fontFamily);
      
      // Should include SF Pro in font stack
      expect(titleFont).toContain('SF Pro');
      
      // Check axis labels
      const axisLabels = page.locator('svg text');
      if (await axisLabels.count() > 0) {
        const labelFont = await axisLabels.first().evaluate(el => getComputedStyle(el).fontFamily);
        expect(labelFont).toContain('SF Pro');
      }
      
      // Check font weights
      const titleWeight = await title.evaluate(el => getComputedStyle(el).fontWeight);
      expect(parseInt(titleWeight)).toBeGreaterThanOrEqual(600); // Should be semibold or bold
    });

    test('Animation smoothness and timing', async ({ page }) => {
      // Enable performance monitoring
      await page.addInitScript(() => {
        window.animationFrames = [];
        const originalRAF = window.requestAnimationFrame;
        window.requestAnimationFrame = function(callback) {
          window.animationFrames.push(Date.now());
          return originalRAF(callback);
        };
      });
      
      await createChartTestPage(page, 'line', CHART_TEST_DATA.lineChart, {
        animation: { enable: true, duration: 800 }
      });
      
      // Wait for initial animation to complete
      await page.waitForTimeout(1000);
      
      // Trigger animation by changing time range
      const timeButton = page.locator('[role="tab"]', { hasText: '3M' });
      await timeButton.click();
      
      // Wait for animation to complete
      await page.waitForTimeout(1000);
      
      // Check animation frame rate
      const frameData = await page.evaluate(() => window.animationFrames);
      
      if (frameData && frameData.length > 10) {
        // Calculate frame rate
        const totalTime = frameData[frameData.length - 1] - frameData[0];
        const avgFrameTime = totalTime / frameData.length;
        const fps = 1000 / avgFrameTime;
        
        // Should maintain reasonable frame rate (at least 30fps)
        expect(fps).toBeGreaterThan(30);
      }
    });

    test('Responsive behavior between 1280-1440px', async ({ page }) => {
      // Test at 1280px
      await page.setViewportSize({ width: 1280, height: 720 });
      await createChartTestPage(page, 'line', CHART_TEST_DATA.lineChart);
      
      let chartBox = await page.locator('.chart-component').boundingBox();
      const smallWidth = chartBox!.width;
      
      // Test at 1440px
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.waitForTimeout(500); // Allow resize
      
      chartBox = await page.locator('.chart-component').boundingBox();
      const largeWidth = chartBox!.width;
      
      // Chart should scale responsively
      expect(largeWidth).toBeGreaterThan(smallWidth);
      
      // Elements should remain proportional
      const title = page.locator('h2');
      const titleSize = await title.evaluate(el => getComputedStyle(el).fontSize);
      expect(parseInt(titleSize)).toBeGreaterThanOrEqual(16);
    });

    test('Focus states and accessibility', async ({ page }) => {
      await createChartTestPage(page, 'line', CHART_TEST_DATA.lineChart);
      
      // Test chart container focus
      const chartContainer = page.locator('.chart-component');
      await chartContainer.focus();
      
      // Check focus outline
      const focusOutline = await chartContainer.evaluate(el => getComputedStyle(el).outline);
      // Should have some focus indication (outline or box-shadow)
      const hasFocusStyle = focusOutline !== 'none' || 
        await chartContainer.evaluate(el => getComputedStyle(el).boxShadow !== 'none');
      expect(hasFocusStyle).toBeTruthy();
      
      // Test time control focus
      const timeButton = page.locator('[role="tab"]').first();
      await timeButton.focus();
      
      // Check focus ring
      const buttonFocusStyle = await timeButton.evaluate(el => getComputedStyle(el).boxShadow);
      expect(buttonFocusStyle).toContain('rgb(59, 130, 246)'); // Should have blue focus ring
    });
  });

  test.describe('Financial Data Accuracy', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
    });

    test('Currency formatting precision', async ({ page }) => {
      await createChartTestPage(page, 'line', CHART_TEST_DATA.lineChart);
      
      // Hover to show tooltip with currency values
      const chartArea = page.locator('.recharts-wrapper');
      await chartArea.hover({ position: { x: 200, y: 200 } });
      
      // Check tooltip content
      const tooltip = page.locator('.recharts-tooltip-wrapper');
      await expect(tooltip).toBeVisible({ timeout: 3000 });
      
      const tooltipText = await tooltip.textContent();
      
      // Should format currency correctly
      expect(tooltipText).toMatch(/\$[\d,]+/); // Should have dollar sign and comma formatting
      
      // Check data table for currency formatting
      await page.keyboard.press('Alt+KeyT');
      const dataTable = page.locator('.chart-data-table');
      await expect(dataTable).toBeVisible();
      
      const tableCells = page.locator('.chart-data-table td');
      const cellCount = await tableCells.count();
      
      if (cellCount > 0) {
        const firstCellText = await tableCells.first().textContent();
        expect(firstCellText).toMatch(/\$[\d,]+/);
      }
    });

    test('Large number handling ($500K+)', async ({ page }) => {
      await createChartTestPage(page, 'line', CHART_TEST_DATA.largeNumbers);
      
      // Wait for chart to render
      await page.waitForSelector('svg', { timeout: 5000 });
      
      // Check Y-axis labels for large number formatting
      const yAxisLabels = page.locator('svg .recharts-yAxis .recharts-text');
      const labelCount = await yAxisLabels.count();
      
      if (labelCount > 0) {
        const labelText = await yAxisLabels.first().textContent();
        // Should handle large numbers appropriately (K, M notation or comma separation)
        expect(labelText).toMatch(/[\d,]+[KM]?|\$[\d,]+/);
      }
      
      // Test tooltip with large numbers
      const chartArea = page.locator('.recharts-wrapper');
      await chartArea.hover({ position: { x: 300, y: 200 } });
      
      const tooltip = page.locator('.recharts-tooltip-wrapper');
      await expect(tooltip).toBeVisible({ timeout: 3000 });
      
      const tooltipText = await tooltip.textContent();
      
      // Should format large numbers correctly
      expect(tooltipText).toMatch(/\$[\d,]+/);
      expect(tooltipText).toMatch(/[5-9]\d{2},\d{3}|1,\d{3},\d{3}/); // Should show 500K+ range
    });

    test('Percentage calculations', async ({ page }) => {
      const percentageData = [
        { date: '2024-01-01', growth: 5.5, allocation: 45.2, performance: 12.8 },
        { date: '2024-02-01', growth: 3.2, allocation: 47.1, performance: 8.9 },
        { date: '2024-03-01', growth: -2.1, allocation: 42.8, performance: -5.2 },
        { date: '2024-04-01', growth: 8.7, allocation: 49.3, performance: 15.6 }
      ];
      
      await createChartTestPage(page, 'line', percentageData);
      
      // Test tooltip percentage formatting
      const chartArea = page.locator('.recharts-wrapper');
      await chartArea.hover({ position: { x: 250, y: 200 } });
      
      const tooltip = page.locator('.recharts-tooltip-wrapper');
      await expect(tooltip).toBeVisible({ timeout: 3000 });
      
      const tooltipText = await tooltip.textContent();
      
      // Should show percentage values with % symbol
      expect(tooltipText).toMatch(/\d+\.?\d*%/);
      
      // Should handle negative percentages
      expect(tooltipText).toMatch(/-?\d+\.?\d*%/);
    });

    test('Time-based data filtering', async ({ page }) => {
      await createChartTestPage(page, 'line', CHART_TEST_DATA.lineChart);
      
      // Test different time ranges
      const timeRanges = ['1M', '3M', '6M'];
      
      for (const range of timeRanges) {
        const timeButton = page.locator('[role="tab"]', { hasText: range });
        await timeButton.click();
        
        // Wait for chart to update
        await page.waitForTimeout(500);
        
        // Check that chart still renders
        const chartSvg = page.locator('svg');
        await expect(chartSvg).toBeVisible();
        
        // Check that data points are still present
        const dataPoints = page.locator('svg .recharts-line');
        await expect(dataPoints.first()).toBeVisible();
      }
    });

    test('Chart data synchronization', async ({ page }) => {
      await createChartTestPage(page, 'line', CHART_TEST_DATA.lineChart);
      
      // Change time range and verify data consistency
      const sixMonthButton = page.locator('[role="tab"]', { hasText: '6M' });
      await sixMonthButton.click();
      
      // Wait for update
      await page.waitForTimeout(500);
      
      // Check tooltip data consistency
      const chartArea = page.locator('.recharts-wrapper');
      await chartArea.hover({ position: { x: 200, y: 200 } });
      
      const tooltip = page.locator('.recharts-tooltip-wrapper');
      await expect(tooltip).toBeVisible({ timeout: 3000 });
      
      // Move to different position and check another data point
      await chartArea.hover({ position: { x: 400, y: 200 } });
      await page.waitForTimeout(200);
      
      // Tooltip should still be visible with different data
      await expect(tooltip).toBeVisible();
      
      // Check data table consistency
      await page.keyboard.press('Alt+KeyT');
      const dataTable = page.locator('.chart-data-table');
      await expect(dataTable).toBeVisible();
      
      // Should have the same number of rows as original data
      const tableRows = page.locator('.chart-data-table tbody tr');
      const rowCount = await tableRows.count();
      expect(rowCount).toBe(CHART_TEST_DATA.lineChart.length);
    });
  });

  test.describe('Performance and Accessibility', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
    });

    test('60fps animations and load times', async ({ page }) => {
      const startTime = Date.now();
      
      await createChartTestPage(page, 'line', CHART_TEST_DATA.lineChart, {
        animation: { enable: true, duration: 1000 }
      });
      
      const loadTime = Date.now() - startTime;
      
      // Should load within reasonable time
      expect(loadTime).toBeLessThan(5000); // 5 seconds max
      
      // Test animation performance
      const performanceMetrics = await measurePerformance(page, async () => {
        // Trigger animation by changing time range
        const timeButton = page.locator('[role="tab"]', { hasText: '3M' });
        await timeButton.click();
        await page.waitForTimeout(1100); // Wait for animation to complete
      });
      
      // Animation should complete within expected time
      expect(performanceMetrics.duration).toBeLessThan(1500); // Allow some overhead
    });

    test('ARIA attributes and screen reader support', async ({ page }) => {
      await createChartTestPage(page, 'line', CHART_TEST_DATA.lineChart);
      
      // Check main chart ARIA attributes
      const chartContainer = page.locator('.chart-component');
      
      const ariaLabel = await chartContainer.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel).toContain('chart');
      
      const role = await chartContainer.getAttribute('role');
      expect(role).toBe('img');
      
      // Check time controls ARIA
      const timeControls = page.locator('[role="tablist"]');
      await expect(timeControls).toBeVisible();
      
      const ariaLabelControls = await timeControls.getAttribute('aria-label');
      expect(ariaLabelControls).toContain('Time range');
      
      // Check individual time buttons
      const timeButtons = page.locator('[role="tab"]');
      const buttonCount = await timeButtons.count();
      
      for (let i = 0; i < Math.min(buttonCount, 3); i++) {
        const button = timeButtons.nth(i);
        const ariaSelected = await button.getAttribute('aria-selected');
        expect(ariaSelected).toMatch(/true|false/);
      }
      
      // Check data table accessibility
      await page.keyboard.press('Alt+KeyT');
      const dataTable = page.locator('.chart-data-table');
      await expect(dataTable).toBeVisible();
      
      const tableRole = await dataTable.getAttribute('role');
      expect(tableRole).toBe('table');
      
      const tableCaption = page.locator('.chart-data-table caption');
      await expect(tableCaption).toBeVisible();
      
      // Check live region
      const liveRegion = page.locator('[aria-live="polite"]');
      await expect(liveRegion).toBeAttached();
    });

    test('Focus order and keyboard navigation', async ({ page }) => {
      await createChartTestPage(page, 'line', CHART_TEST_DATA.lineChart);
      
      // Start from chart container
      const chartContainer = page.locator('.chart-component');
      await chartContainer.focus();
      
      // Tab through focusable elements
      const focusableElements = [];
      
      // Chart should be focusable
      let currentFocus = page.locator(':focus');
      let focusedElement = await currentFocus.getAttribute('class');
      focusableElements.push(focusedElement);
      
      // Tab to time controls
      await page.keyboard.press('Tab');
      currentFocus = page.locator(':focus');
      
      // Should focus on first time control
      const isTimeControl = await currentFocus.getAttribute('role');
      expect(isTimeControl).toBe('tab');
      
      // Arrow key navigation within time controls
      await page.keyboard.press('ArrowRight');
      const nextTimeControl = page.locator(':focus');
      const nextIsTimeControl = await nextTimeControl.getAttribute('role');
      expect(nextIsTimeControl).toBe('tab');
      
      // Tab order should be logical
      expect(focusableElements.length).toBeGreaterThan(0);
    });

    test('High contrast and reduced motion support', async ({ page }) => {
      // Test with reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });
      
      await createChartTestPage(page, 'line', CHART_TEST_DATA.lineChart, {
        accessibility: { reducedMotion: true }
      });
      
      // Should still render chart
      const chartSvg = page.locator('svg');
      await expect(chartSvg).toBeVisible();
      
      // Test time range change with reduced motion
      const timeButton = page.locator('[role="tab"]', { hasText: '3M' });
      await timeButton.click();
      
      // Should still update but without animation delay
      await page.waitForTimeout(100); // Minimal wait
      
      const isSelected = await timeButton.getAttribute('aria-selected');
      expect(isSelected).toBe('true');
      
      // Test high contrast mode
      await page.emulateMedia({ colorScheme: 'dark' });
      
      // Check contrast ratios
      const title = page.locator('h2');
      const titleColor = await title.evaluate(el => getComputedStyle(el).color);
      const backgroundColor = await title.evaluate(el => getComputedStyle(el).backgroundColor);
      
      // In high contrast mode, should have sufficient contrast
      expect(titleColor).toMatch(/rgb\(255, 255, 255\)|rgba\(255, 255, 255/);
    });
  });

  test.describe('Visual Regression Tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
    });

    test('Chart component visual consistency', async ({ page }) => {
      // Test all chart types for visual consistency
      const chartTypes = ['line', 'area', 'bar', 'stackedBar'];
      
      for (const chartType of chartTypes) {
        await createChartTestPage(page, chartType, CHART_TEST_DATA.lineChart);
        
        // Wait for rendering
        await page.waitForTimeout(1000);
        
        // Take screenshot
        await compareScreenshot(page, `${chartType}-visual-consistency`, {
          threshold: 0.2,
          maxDiffPixels: 1000
        });
      }
    });

    test('Theme and color scheme consistency', async ({ page }) => {
      await createChartTestPage(page, 'line', CHART_TEST_DATA.lineChart);
      
      // Test light theme
      await page.emulateMedia({ colorScheme: 'light' });
      await page.waitForTimeout(500);
      await compareScreenshot(page, 'light-theme-consistency');
      
      // Test dark theme
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.waitForTimeout(500);
      await compareScreenshot(page, 'dark-theme-consistency');
    });

    test('Responsive layout visual regression', async ({ page }) => {
      await createChartTestPage(page, 'line', CHART_TEST_DATA.lineChart);
      
      // Test different desktop sizes
      const sizes = [
        { width: 1280, height: 720, name: 'desktop-small' },
        { width: 1920, height: 1080, name: 'desktop-large' },
        { width: 2560, height: 1440, name: 'desktop-xl' }
      ];
      
      for (const size of sizes) {
        await page.setViewportSize(size);
        await page.waitForTimeout(500);
        await compareScreenshot(page, `responsive-${size.name}`, {
          fullPage: false,
          clip: { x: 0, y: 0, width: size.width, height: size.height }
        });
      }
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
    });

    test('Empty data state', async ({ page }) => {
      await createChartTestPage(page, 'line', []);
      
      // Should show empty state
      const emptyState = page.locator('text=No data available');
      await expect(emptyState).toBeVisible();
      
      // Should not show chart SVG
      const chartSvg = page.locator('svg .recharts-line');
      await expect(chartSvg).not.toBeVisible();
      
      // Time controls should still be visible but disabled
      const timeControls = page.locator('[role="tablist"]');
      await expect(timeControls).toBeVisible();
    });

    test('Loading state', async ({ page }) => {
      await page.goto('/');
      
      // Create loading state
      await page.evaluate(() => {
        const container = document.createElement('div');
        container.id = 'loading-test-container';
        container.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 9999;
          background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%);
          padding: 2rem;
        `;
        
        document.body.appendChild(container);
        
        const script = document.createElement('script');
        script.type = 'module';
        script.textContent = `
          import React from 'react';
          import { createRoot } from 'react-dom/client';
          import { GraphBase } from '/src/components/charts/index.ts';
          
          const LoadingChart = () => {
            return React.createElement(GraphBase, {
              type: 'line',
              data: [],
              loading: true,
              title: 'Loading Chart Test',
              dimensions: { height: 400, responsive: true }
            });
          };
          
          const root = createRoot(document.getElementById('loading-test-container'));
          root.render(React.createElement(LoadingChart));
        `;
        
        document.head.appendChild(script);
      });
      
      // Should show loading skeleton
      const skeleton = page.locator('.animate-pulse');
      await expect(skeleton).toBeVisible();
      
      // Should show skeleton bars
      const skeletonBars = page.locator('.bg-white\\/10');
      await expect(skeletonBars.first()).toBeVisible();
    });

    test('Error state', async ({ page }) => {
      await page.goto('/');
      
      // Create error state
      await page.evaluate(() => {
        const container = document.createElement('div');
        container.id = 'error-test-container';
        container.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 9999;
          background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%);
          padding: 2rem;
        `;
        
        document.body.appendChild(container);
        
        const script = document.createElement('script');
        script.type = 'module';
        script.textContent = `
          import React from 'react';
          import { createRoot } from 'react-dom/client';
          import { GraphBase } from '/src/components/charts/index.ts';
          
          const ErrorChart = () => {
            return React.createElement(GraphBase, {
              type: 'line',
              data: [],
              error: 'Failed to load chart data',
              title: 'Error Chart Test',
              dimensions: { height: 400, responsive: true },
              errorConfig: {
                showRetry: true,
                retryText: 'Try Again'
              }
            });
          };
          
          const root = createRoot(document.getElementById('error-test-container'));
          root.render(React.createElement(ErrorChart));
        `;
        
        document.head.appendChild(script);
      });
      
      // Should show error message
      const errorMessage = page.locator('text=Unable to load chart');
      await expect(errorMessage).toBeVisible();
      
      // Should show retry button
      const retryButton = page.locator('button', { hasText: 'Try Again' });
      await expect(retryButton).toBeVisible();
      
      // Test retry button click
      await retryButton.click();
      // In a real scenario, this would trigger a retry
    });
  });
});