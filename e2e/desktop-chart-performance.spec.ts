/**
 * Desktop Chart Performance Tests
 * 
 * Focused on performance metrics, animation frame rates, and load time validation
 * for chart components on desktop viewports
 */

import { test, expect, Page } from '@playwright/test';

// Performance thresholds
const PERFORMANCE_THRESHOLDS = {
  LOAD_TIME_MAX: 5000, // 5 seconds
  ANIMATION_DURATION_MAX: 1500, // 1.5 seconds with overhead
  FPS_MIN: 30, // Minimum 30 FPS
  MEMORY_LEAK_THRESHOLD: 50 * 1024 * 1024, // 50MB
  PAINT_TIME_MAX: 100, // 100ms for first paint
  INTERACTIVE_TIME_MAX: 2000 // 2 seconds to interactive
};

interface FrameMetrics {
  fps: number;
  frames: number;
  avgFrameTime: number;
  frameTimeVariance: number;
  droppedFrames: number;
}

// Large dataset for performance testing
const LARGE_CHART_DATA = Array.from({ length: 1000 }, (_, i) => ({
  date: new Date(2023, 0, 1 + i).toISOString().split('T')[0],
  value: Math.random() * 100000 + 50000,
  spending: Math.random() * 5000 + 2000,
  income: Math.random() * 3000 + 5000,
  investments: Math.random() * 10000 + 5000
}));

// Performance monitoring helper
async function measurePerformanceMetrics(page: Page, action: () => Promise<void>) {
  // Start performance monitoring
  await page.evaluate(() => {
    performance.mark('test-start');
    // Monitor memory usage
    if ('memory' in performance) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).initialMemory = (performance as any).memory.usedJSHeapSize;
    }
  });

  const startTime = Date.now();
  await action();
  const endTime = Date.now();

  // Collect performance metrics
  const metrics = await page.evaluate(() => {
    performance.mark('test-end');
    performance.measure('test-duration', 'test-start', 'test-end');
    
    const measure = performance.getEntriesByName('test-duration')[0];
    const paintMetrics = performance.getEntriesByType('paint');
    const navigationMetrics = performance.getEntriesByType('navigation')[0];
    
    return {
      duration: measure.duration,
      firstPaint: paintMetrics.find(m => m.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paintMetrics.find(m => m.name === 'first-contentful-paint')?.startTime || 0,
      domInteractive: navigationMetrics?.domInteractive || 0,
      loadComplete: navigationMetrics?.loadEventEnd || 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      memoryUsage: 'memory' in performance ? (performance as any).memory.usedJSHeapSize : 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      initialMemory: (window as any).initialMemory || 0
    };
  });

  return {
    ...metrics,
    totalTime: endTime - startTime,
    memoryDelta: metrics.memoryUsage - metrics.initialMemory
  };
}

// Animation frame monitoring
async function monitorAnimationFrameRate(page: Page, duration = 2000): Promise<FrameMetrics> {
  return await page.evaluate((duration) => {
    return new Promise<FrameMetrics>((resolve) => {
      const frames: number[] = [];
      let startTime = performance.now();
      
      function recordFrame() {
        frames.push(performance.now());
        
        if (performance.now() - startTime < duration) {
          requestAnimationFrame(recordFrame);
        } else {
          // Calculate FPS
          const totalTime = frames[frames.length - 1] - frames[0];
          const fps = (frames.length / totalTime) * 1000;
          
          // Calculate frame time consistency
          const frameTimes = frames.slice(1).map((time, i) => time - frames[i]);
          const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
          const frameTimeVariance = frameTimes.reduce((sum, time) => sum + Math.pow(time - avgFrameTime, 2), 0) / frameTimes.length;
          
          resolve({
            fps,
            frames: frames.length,
            avgFrameTime,
            frameTimeVariance,
            droppedFrames: frameTimes.filter(time => time > 16.67 * 2).length // Frames taking more than 2 frame periods
          });
        }
      }
      
      requestAnimationFrame(recordFrame);
    });
  }, duration);
}

// Create performance test page
async function createPerformanceTestPage(page: Page, chartType: string, data: unknown[], enableAnimations = true) {
  await page.goto('/');
  
  await page.evaluate(({ chartType, data, enableAnimations }: any) => {
    // Create container
    const container = document.createElement('div');
    container.id = 'perf-test-container';
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
    
    // Create React component
    const script = document.createElement('script');
    script.type = 'module';
    script.textContent = `
      import React from 'react';
      import { createRoot } from 'react-dom/client';
      import { GraphBase } from '/src/components/charts/index.ts';
      
      const PerfTestChart = () => {
        return React.createElement(GraphBase, {
          type: '${chartType}',
          data: ${JSON.stringify(data)},
          title: 'Performance Test Chart',
          subtitle: 'Testing with ${data.length} data points',
          timeControls: {
            show: true,
            options: ['1W', '1M', '3M', '6M', '1Y', 'ALL'],
            defaultRange: '1M'
          },
          dimensions: {
            height: 600,
            responsive: true
          },
          animation: {
            enable: ${enableAnimations},
            duration: 800
          },
          tooltip: { show: true },
          grid: { show: true, horizontal: true, vertical: false },
          accessibility: {
            keyboardNavigation: true,
            screenReaderSupport: true
          }
        });
      };
      
      const root = createRoot(document.getElementById('perf-test-container'));
      root.render(React.createElement(PerfTestChart));
    `;
    
    document.head.appendChild(script);
  }, { chartType, data, enableAnimations });
  
  // Wait for chart to render
  await page.waitForSelector('.chart-component', { timeout: 15000 });
  await page.waitForTimeout(1000);
}

test.describe('Desktop Chart Performance Tests', () => {
  
  test.describe('Load Time Performance', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
    });

    test('Chart loads within performance threshold', async ({ page }) => {
      const metrics = await measurePerformanceMetrics(page, async () => {
        await createPerformanceTestPage(page, 'line', LARGE_CHART_DATA.slice(0, 100));
      });
      
      // Validate load time
      expect(metrics.totalTime).toBeLessThan(PERFORMANCE_THRESHOLDS.LOAD_TIME_MAX);
      
      // Validate first paint
      expect(metrics.firstPaint).toBeLessThan(PERFORMANCE_THRESHOLDS.PAINT_TIME_MAX);
      
      // Validate interactive time
      expect(metrics.domInteractive).toBeLessThan(PERFORMANCE_THRESHOLDS.INTERACTIVE_TIME_MAX);
      
      console.log('Load Performance Metrics:', {
        loadTime: `${metrics.totalTime}ms`,
        firstPaint: `${metrics.firstPaint}ms`,
        interactive: `${metrics.domInteractive}ms`,
        memoryDelta: `${(metrics.memoryDelta / 1024 / 1024).toFixed(2)}MB`
      });
    });

    test('Large dataset handling (1000+ points)', async ({ page }) => {
      const metrics = await measurePerformanceMetrics(page, async () => {
        await createPerformanceTestPage(page, 'line', LARGE_CHART_DATA);
      });
      
      // Should still load within reasonable time for large datasets
      expect(metrics.totalTime).toBeLessThan(PERFORMANCE_THRESHOLDS.LOAD_TIME_MAX * 2);
      
      // Memory usage should be reasonable
      expect(metrics.memoryDelta).toBeLessThan(PERFORMANCE_THRESHOLDS.MEMORY_LEAK_THRESHOLD);
      
      // Chart should be responsive
      const chartSvg = page.locator('svg');
      await expect(chartSvg).toBeVisible();
      
      console.log('Large Dataset Performance:', {
        dataPoints: LARGE_CHART_DATA.length,
        loadTime: `${metrics.totalTime}ms`,
        memoryUsage: `${(metrics.memoryDelta / 1024 / 1024).toFixed(2)}MB`
      });
    });

    test('Multiple chart types load performance comparison', async ({ page }) => {
      const chartTypes = ['line', 'area', 'bar', 'stackedBar'];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const performanceResults: { [key: string]: any } = {};
      
      for (const chartType of chartTypes) {
        const metrics = await measurePerformanceMetrics(page, async () => {
          await createPerformanceTestPage(page, chartType, LARGE_CHART_DATA.slice(0, 200));
        });
        
        performanceResults[chartType] = {
          loadTime: metrics.totalTime,
          memoryUsage: metrics.memoryDelta,
          firstPaint: metrics.firstPaint
        };
        
        // Each chart type should load within threshold
        expect(metrics.totalTime).toBeLessThan(PERFORMANCE_THRESHOLDS.LOAD_TIME_MAX);
        
        // Clear the page for next test
        await page.evaluate(() => {
          const container = document.getElementById('perf-test-container');
          if (container) container.remove();
        });
      }
      
      console.log('Chart Type Performance Comparison:', performanceResults);
    });
  });

  test.describe('Animation Performance', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
    });

    test('60fps animation target', async ({ page }) => {
      await createPerformanceTestPage(page, 'line', LARGE_CHART_DATA.slice(0, 100), true);
      
      // Trigger animation by changing time range
      const timeButton = page.locator('[role="tab"]', { hasText: '3M' });
      
      // Monitor frame rate during animation
      const animationPromise = monitorAnimationFrameRate(page, 1200);
      await timeButton.click();
      
      const frameMetrics = await animationPromise;
      
      // Should maintain reasonable frame rate
      expect(frameMetrics.fps).toBeGreaterThan(PERFORMANCE_THRESHOLDS.FPS_MIN);
      
      // Should not have too many dropped frames
      expect(frameMetrics.droppedFrames).toBeLessThan(frameMetrics.frames * 0.1); // Less than 10% dropped
      
      console.log('Animation Performance:', {
        fps: frameMetrics.fps.toFixed(1),
        avgFrameTime: `${frameMetrics.avgFrameTime.toFixed(2)}ms`,
        droppedFrames: frameMetrics.droppedFrames,
        consistency: frameMetrics.frameTimeVariance.toFixed(2)
      });
    });

    test('Animation with reduced motion', async ({ page }) => {
      // Enable reduced motion
      await page.emulateMedia({ reducedMotion: 'reduce' });
      
      const metrics = await measurePerformanceMetrics(page, async () => {
        await createPerformanceTestPage(page, 'line', LARGE_CHART_DATA.slice(0, 100), false);
        
        // Change time range
        const timeButton = page.locator('[role="tab"]', { hasText: '6M' });
        await timeButton.click();
        await page.waitForTimeout(100); // Minimal wait for reduced motion
      });
      
      // Should complete faster with reduced motion
      expect(metrics.duration).toBeLessThan(500); // Much faster without animations
      
      // Chart should still update correctly
      const selectedButton = page.locator('[role="tab"][aria-selected="true"]', { hasText: '6M' });
      await expect(selectedButton).toBeVisible();
    });

    test('Hover animation performance', async ({ page }) => {
      await createPerformanceTestPage(page, 'line', LARGE_CHART_DATA.slice(0, 200));
      
      const chartArea = page.locator('.recharts-wrapper');
      
      // Monitor performance during hover interactions
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const frameMetrics: any = await page.evaluate(async () => {
        const frames: number[] = [];
        let frameCount = 0;
        
        const recordFrame = () => {
          frames.push(performance.now());
          frameCount++;
          if (frameCount < 60) { // Record for ~1 second at 60fps
            requestAnimationFrame(recordFrame);
          }
        };
        
        requestAnimationFrame(recordFrame);
        
        // Simulate hover events
        const chartElement = document.querySelector('.recharts-wrapper') as HTMLElement;
        if (chartElement) {
          const rect = chartElement.getBoundingClientRect();
          
          // Simulate multiple hover positions
          for (let i = 0; i < 10; i++) {
            const x = rect.left + (rect.width / 10) * i;
            const y = rect.top + rect.height / 2;
            
            const mouseEvent = new MouseEvent('mousemove', {
              clientX: x,
              clientY: y,
              bubbles: true
            });
            chartElement.dispatchEvent(mouseEvent);
            
            await new Promise(resolve => setTimeout(resolve, 50));
          }
        }
        
        // Wait for frame collection to complete
        await new Promise(resolve => setTimeout(resolve, 1100));
        
        // Calculate metrics
        const totalTime = frames[frames.length - 1] - frames[0];
        const fps = (frames.length / totalTime) * 1000;
        
        return { fps, frames: frames.length };
      });
      
      // Should maintain good frame rate during hover
      expect(frameMetrics.fps).toBeGreaterThan(25); // Slightly lower threshold for hover
    });
  });

  test.describe('Memory Usage and Cleanup', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
    });

    test('Memory usage remains stable', async ({ page }) => {
      const initialMemory = await page.evaluate(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return 'memory' in performance ? (performance as any).memory.usedJSHeapSize : 0;
      });
      
      // Create and destroy multiple charts
      for (let i = 0; i < 5; i++) {
        await createPerformanceTestPage(page, 'line', LARGE_CHART_DATA.slice(0, 100));
        
        // Interact with chart
        const timeButton = page.locator('[role="tab"]', { hasText: '3M' });
        await timeButton.click();
        await page.waitForTimeout(200);
        
        // Remove chart
        await page.evaluate(() => {
          const container = document.getElementById('perf-test-container');
          if (container) container.remove();
        });
        
        // Force garbage collection if available
        await page.evaluate(() => {
          if ('gc' in window) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).gc();
          }
        });
      }
      
      const finalMemory = await page.evaluate(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return 'memory' in performance ? (performance as any).memory.usedJSHeapSize : 0;
      });
      
      const memoryDelta = finalMemory - initialMemory;
      
      // Memory should not increase significantly
      expect(memoryDelta).toBeLessThan(PERFORMANCE_THRESHOLDS.MEMORY_LEAK_THRESHOLD);
      
      console.log('Memory Usage Test:', {
        initial: `${(initialMemory / 1024 / 1024).toFixed(2)}MB`,
        final: `${(finalMemory / 1024 / 1024).toFixed(2)}MB`,
        delta: `${(memoryDelta / 1024 / 1024).toFixed(2)}MB`
      });
    });

    test('Event listener cleanup', async ({ page }) => {
      await createPerformanceTestPage(page, 'line', LARGE_CHART_DATA.slice(0, 50));
      
      // Count initial event listeners
      const initialListeners = await page.evaluate(() => {
        const events = ['mousemove', 'mouseenter', 'mouseleave', 'click', 'keydown'];
        let count = 0;
        
        events.forEach(eventType => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const listeners = (document as any).getEventListeners?.(document.body)?.[eventType] || [];
          count += listeners.length;
        });
        
        return count;
      });
      
      // Remove chart
      await page.evaluate(() => {
        const container = document.getElementById('perf-test-container');
        if (container) container.remove();
      });
      
      // Check event listeners after cleanup
      const finalListeners = await page.evaluate(() => {
        const events = ['mousemove', 'mouseenter', 'mouseleave', 'click', 'keydown'];
        let count = 0;
        
        events.forEach(eventType => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const listeners = (document as any).getEventListeners?.(document.body)?.[eventType] || [];
          count += listeners.length;
        });
        
        return count;
      });
      
      // Event listeners should be cleaned up
      expect(finalListeners).toBeLessThanOrEqual(initialListeners);
    });
  });

  test.describe('Responsive Performance', () => {
    test('Performance across different desktop sizes', async ({ page }) => {
      const viewports = [
        { width: 1280, height: 720, name: 'HD' },
        { width: 1920, height: 1080, name: 'Full HD' },
        { width: 2560, height: 1440, name: 'QHD' }
      ];
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const performanceResults: { [key: string]: any } = {};
      
      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        
        const metrics = await measurePerformanceMetrics(page, async () => {
          await createPerformanceTestPage(page, 'line', LARGE_CHART_DATA.slice(0, 150));
        });
        
        performanceResults[viewport.name] = {
          loadTime: metrics.totalTime,
          memoryUsage: metrics.memoryDelta,
          firstPaint: metrics.firstPaint
        };
        
        // Should perform well at all resolutions
        expect(metrics.totalTime).toBeLessThan(PERFORMANCE_THRESHOLDS.LOAD_TIME_MAX);
        
        // Clear for next test
        await page.evaluate(() => {
          const container = document.getElementById('perf-test-container');
          if (container) container.remove();
        });
      }
      
      console.log('Viewport Performance Results:', performanceResults);
    });

    test('Resize performance', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await createPerformanceTestPage(page, 'line', LARGE_CHART_DATA.slice(0, 100));
      
      // Monitor performance during resize
      const resizeMetrics = await measurePerformanceMetrics(page, async () => {
        // Simulate multiple resizes
        const sizes = [
          { width: 1440, height: 900 },
          { width: 1280, height: 720 },
          { width: 1600, height: 900 },
          { width: 1920, height: 1080 }
        ];
        
        for (const size of sizes) {
          await page.setViewportSize(size);
          await page.waitForTimeout(100); // Allow resize to process
        }
      });
      
      // Resize operations should be fast
      expect(resizeMetrics.duration).toBeLessThan(1000); // 1 second for all resizes
      
      // Chart should still be visible and functional
      const chartSvg = page.locator('svg');
      await expect(chartSvg).toBeVisible();
    });
  });
});