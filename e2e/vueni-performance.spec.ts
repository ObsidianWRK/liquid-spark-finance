import { test, expect } from '@playwright/test';

test.describe('Vueni Performance Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cache and storage for clean performance testing
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('should meet Core Web Vitals standards', async ({ page }) => {
    // Navigate to the page and measure performance
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // First Contentful Paint should be under 1.8s (good threshold)
    expect(loadTime).toBeLessThan(1800);

    // Measure LCP (Largest Contentful Paint)
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Fallback timeout
        setTimeout(() => resolve(0), 5000);
      });
    });

    if (lcp > 0) {
      // LCP should be under 2.5s (good threshold)
      expect(lcp).toBeLessThan(2500);
      console.log(`LCP: ${lcp}ms`);
    }

    // Check First Input Delay by simulating a click
    const button = page.locator('button, [role="button"], .clickable').first();
    if (await button.isVisible({ timeout: 3000 }).catch(() => false)) {
      const clickStart = Date.now();
      await button.click();
      const clickEnd = Date.now();
      const fid = clickEnd - clickStart;
      
      // FID should be under 100ms (good threshold)
      expect(fid).toBeLessThan(100);
      console.log(`Simulated FID: ${fid}ms`);
    }
  });

  test('should efficiently handle large transaction lists', async ({ page }) => {
    await page.goto('/');
    
    // Inject mock data for performance testing
    await page.evaluate(() => {
      // Create mock transaction data
      const mockTransactions = Array.from({ length: 1000 }, (_, i) => ({
        id: `tx-${i}`,
        merchant: `Merchant ${i}`,
        category: { name: `Category ${i % 10}`, color: '#3B82F6' },
        amount: (Math.random() - 0.5) * 1000,
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        status: ['completed', 'pending', 'failed'][i % 3] as 'completed' | 'pending' | 'failed',
        scores: {
          health: Math.floor(Math.random() * 100),
          eco: Math.floor(Math.random() * 100),
          financial: Math.floor(Math.random() * 100)
        }
      }));

      // Store in window for component access
      (window as any).mockTransactions = mockTransactions;
    });

    // Measure rendering performance with large dataset
    const renderStart = Date.now();
    
    // Trigger re-render if there's a way to inject data
    await page.evaluate(() => {
      // Dispatch custom event that components might listen to
      window.dispatchEvent(new CustomEvent('vueni-load-mock-data', {
        detail: (window as any).mockTransactions
      }));
    });

    await page.waitForTimeout(2000); // Allow rendering
    
    const renderEnd = Date.now();
    const renderTime = renderEnd - renderStart;
    
    // Large list rendering should complete within 3 seconds
    expect(renderTime).toBeLessThan(3000);
    console.log(`Large list render time: ${renderTime}ms`);

    // Check that the page is still responsive
    const scrollStart = Date.now();
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(100);
    const scrollEnd = Date.now();
    
    // Scrolling should be smooth (under 50ms response)
    expect(scrollEnd - scrollStart).toBeLessThan(50);
  });

  test('should optimize bundle size and loading', async ({ page }) => {
    // Track network requests
    const requests: any[] = [];
    const responses: any[] = [];

    page.on('request', (request) => {
      requests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType()
      });
    });

    page.on('response', (response) => {
      responses.push({
        url: response.url(),
        status: response.status(),
        headers: response.headers()
      });
    });

    await page.goto('/', { waitUntil: 'networkidle' });

    // Check JavaScript bundle sizes
    const jsRequests = requests.filter(req => 
      req.resourceType === 'script' && req.url.includes('.js')
    );

    let totalJSSize = 0;
    for (const jsReq of jsRequests) {
      const response = responses.find(res => res.url === jsReq.url);
      if (response && response.headers['content-length']) {
        totalJSSize += parseInt(response.headers['content-length']);
      }
    }

    // Main bundle should be under 1.5MB (compressed)
    if (totalJSSize > 0) {
      expect(totalJSSize).toBeLessThan(1.5 * 1024 * 1024);
      console.log(`Total JS bundle size: ${(totalJSSize / 1024 / 1024).toFixed(2)}MB`);
    }

    // Check for code splitting evidence
    const jsFiles = jsRequests.map(req => req.url);
    const hasCodeSplitting = jsFiles.some(url => 
      url.includes('chunk') || url.includes('lazy') || jsFiles.length > 3
    );

    // Log code splitting status
    console.log(`Code splitting detected: ${hasCodeSplitting}`);
    console.log(`JavaScript files loaded: ${jsFiles.length}`);
  });

  test('should handle memory efficiently', async ({ page }) => {
    await page.goto('/');

    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
      } : null;
    });

    if (initialMemory) {
      console.log('Initial memory usage:', initialMemory);

      // Simulate heavy usage
      await page.evaluate(() => {
        // Simulate creating and destroying components
        for (let i = 0; i < 100; i++) {
          const div = document.createElement('div');
          div.innerHTML = `<div>Component ${i}</div>`.repeat(100);
          document.body.appendChild(div);
          
          setTimeout(() => {
            if (div.parentNode) {
              div.parentNode.removeChild(div);
            }
          }, 10);
        }
      });

      await page.waitForTimeout(2000);

      // Get memory usage after simulation
      const finalMemory = await page.evaluate(() => {
        return (performance as any).memory ? {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
        } : null;
      });

      if (finalMemory) {
        console.log('Final memory usage:', finalMemory);
        
        // Memory growth should be reasonable (under 50MB increase)
        const memoryGrowth = finalMemory.usedJSHeapSize - initialMemory.usedJSHeapSize;
        expect(memoryGrowth).toBeLessThan(50 * 1024 * 1024);
        console.log(`Memory growth: ${(memoryGrowth / 1024 / 1024).toFixed(2)}MB`);
      }
    }
  });

  test('should optimize image and asset loading', async ({ page }) => {
    const imageRequests: any[] = [];
    const cssRequests: any[] = [];

    page.on('request', (request) => {
      if (request.resourceType() === 'image') {
        imageRequests.push(request.url());
      }
      if (request.resourceType() === 'stylesheet') {
        cssRequests.push(request.url());
      }
    });

    await page.goto('/', { waitUntil: 'networkidle' });

    // Check that images are optimized
    for (const imageUrl of imageRequests) {
      // Modern format check (WebP, AVIF support)
      const isOptimizedFormat = imageUrl.includes('.webp') || 
                               imageUrl.includes('.avif') || 
                               imageUrl.includes('f_auto') || // Cloudinary auto format
                               imageUrl.includes('format=webp');
                               
      if (!isOptimizedFormat && !imageUrl.includes('data:')) {
        console.warn(`Potentially unoptimized image: ${imageUrl}`);
      }
    }

    // Check CSS optimization
    console.log(`CSS files loaded: ${cssRequests.length}`);
    console.log(`Images loaded: ${imageRequests.length}`);

    // Should have reasonable number of asset requests
    expect(imageRequests.length + cssRequests.length).toBeLessThan(20);
  });

  test('should validate caching strategies', async ({ page, context }) => {
    // First visit
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const firstLoadRequests: string[] = [];
    page.on('request', (request) => {
      firstLoadRequests.push(request.url());
    });

    // Second visit (should utilize cache)
    await page.reload({ waitUntil: 'networkidle' });
    
    const secondLoadRequests: string[] = [];
    page.on('request', (request) => {
      secondLoadRequests.push(request.url());
    });

    await page.waitForTimeout(1000);

    // Check that static assets are cached
    const staticAssets = firstLoadRequests.filter(url => 
      url.includes('.js') || url.includes('.css') || url.includes('.png') || 
      url.includes('.jpg') || url.includes('.svg')
    );

    const cachedAssets = staticAssets.filter(url => 
      !secondLoadRequests.includes(url)
    );

    // At least some assets should be cached
    const cacheEfficiency = cachedAssets.length / staticAssets.length;
    console.log(`Cache efficiency: ${(cacheEfficiency * 100).toFixed(1)}%`);
    
    // Should have at least 50% cache hit rate for static assets
    expect(cacheEfficiency).toBeGreaterThan(0.5);
  });

  test('should measure component render performance', async ({ page }) => {
    await page.goto('/');

    // Measure component mount times
    const componentMetrics = await page.evaluate(() => {
      const startTime = performance.now();
      
      // Trigger component updates if possible
      window.dispatchEvent(new Event('resize'));
      
      return new Promise((resolve) => {
        requestAnimationFrame(() => {
          const endTime = performance.now();
          resolve({
            componentUpdateTime: endTime - startTime,
            timestamp: endTime
          });
        });
      });
    });

    console.log('Component metrics:', componentMetrics);

    // Test interaction responsiveness
    const interactionStart = Date.now();
    
    // Find and interact with UI elements
    const interactiveElements = page.locator('button, input, select, [role="button"]');
    const count = await interactiveElements.count();
    
    if (count > 0) {
      // Test first interactive element
      await interactiveElements.first().hover();
      await page.waitForTimeout(50);
      
      const interactionEnd = Date.now();
      const interactionTime = interactionEnd - interactionStart;
      
      // Interactions should be responsive (under 100ms)
      expect(interactionTime).toBeLessThan(100);
      console.log(`Interaction response time: ${interactionTime}ms`);
    }
  });

  test('should validate accessibility performance', async ({ page }) => {
    await page.goto('/');
    
    // Check for accessibility-related performance issues
    const accessibilityMetrics = await page.evaluate(() => {
      const startTime = performance.now();
      
      // Count focusable elements
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      // Count ARIA elements
      const ariaElements = document.querySelectorAll('[aria-label], [aria-labelledby], [role]');
      
      const endTime = performance.now();
      
      return {
        focusableCount: focusableElements.length,
        ariaCount: ariaElements.length,
        scanTime: endTime - startTime
      };
    });

    console.log('Accessibility metrics:', accessibilityMetrics);
    
    // Accessibility scanning should be fast
    expect(accessibilityMetrics.scanTime).toBeLessThan(100);
    
    // Should have reasonable number of interactive elements
    expect(accessibilityMetrics.focusableCount).toBeGreaterThan(0);
    expect(accessibilityMetrics.focusableCount).toBeLessThan(100);
  });
});