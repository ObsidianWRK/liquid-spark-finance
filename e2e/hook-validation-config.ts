import { expect, Page, Locator } from '@playwright/test';

// Hook violation detection utilities
export class HookValidationMonitor {
  private page: Page;
  private errors: string[] = [];
  private hookCounts: Map<string, number> = new Map();

  constructor(page: Page) {
    this.page = page;
  }

  // Monitor console for React hook errors
  async startMonitoring(): Promise<void> {
    this.page.on('console', (message) => {
      const text = message.text();
      if (text.includes('rendered more hooks') || 
          text.includes('hook') && text.includes('error') ||
          text.includes('useEffect') && text.includes('error') ||
          text.includes('useState') && text.includes('error')) {
        this.errors.push(text);
        console.error('Hook validation error detected:', text);
      }
    });

    this.page.on('pageerror', (error) => {
      if (error.message.includes('hook')) {
        this.errors.push(error.message);
        console.error('Page error related to hooks:', error.message);
      }
    });
  }

  // Check for hook violations
  getErrors(): string[] {
    return [...this.errors];
  }

  hasHookViolations(): boolean {
    return this.errors.length > 0;
  }

  // Reset monitoring
  reset(): void {
    this.errors = [];
    this.hookCounts.clear();
  }

  // Get performance metrics
  async getPerformanceMetrics() {
    return await this.page.evaluate(() => {
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: navigationTiming.loadEventEnd - navigationTiming.loadEventStart,
        domContentLoaded: navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart,
        firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
      };
    });
  }
}

// Navigation test utilities
export class NavigationTester {
  private page: Page;
  private monitor: HookValidationMonitor;

  constructor(page: Page, monitor: HookValidationMonitor) {
    this.page = page;
    this.monitor = monitor;
  }

  // Test navigation between tabs
  async navigateToTab(tabName: string): Promise<void> {
    const tabButton = this.page.locator(`[data-testid="nav-${tabName}"], button:has-text("${tabName}"), a:has-text("${tabName}")`).first();
    
    await expect(tabButton).toBeVisible();
    await tabButton.click();
    
    // Wait for navigation to complete
    await this.page.waitForTimeout(500);
    
    // Check for hook violations after navigation
    if (this.monitor.hasHookViolations()) {
      throw new Error(`Hook violations detected after navigating to ${tabName}: ${this.monitor.getErrors().join(', ')}`);
    }
  }

  // Test rapid navigation
  async testRapidNavigation(tabs: string[]): Promise<void> {
    for (const tab of tabs) {
      await this.navigateToTab(tab);
      await this.page.waitForTimeout(100); // Brief pause between navigations
    }
  }

  // Test URL parameter changes
  async testUrlParameterNavigation(tab: string): Promise<void> {
    await this.page.goto(`/?tab=${tab}`);
    await this.page.waitForLoadState('networkidle');
    
    if (this.monitor.hasHookViolations()) {
      throw new Error(`Hook violations detected with URL parameter navigation to ${tab}: ${this.monitor.getErrors().join(', ')}`);
    }
  }
}

// Component validation utilities
export class ComponentValidator {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Validate component is rendered and functional
  async validateComponent(selector: string, componentName: string): Promise<void> {
    const component = this.page.locator(selector);
    await expect(component).toBeVisible({ timeout: 10000 });
    
    // Check if component is interactive
    const isInteractive = await component.isEnabled();
    if (!isInteractive) {
      console.warn(`Component ${componentName} is not interactive`);
    }
  }

  // Check for React dev tools markers
  async hasReactComponents(): Promise<boolean> {
    return await this.page.evaluate(() => {
      // Check for React fiber nodes or dev tools
      const hasReactFiber = document.querySelector('[data-reactroot]') !== null;
      const hasReactDevTools = (window as unknown as { __REACT_DEVTOOLS_GLOBAL_HOOK__?: unknown }).__REACT_DEVTOOLS_GLOBAL_HOOK__ !== undefined;
      return hasReactFiber || hasReactDevTools;
    });
  }

  // Validate specific UI elements exist
  async validateUIElements(elements: { selector: string; name: string }[]): Promise<void> {
    for (const element of elements) {
      await expect(this.page.locator(element.selector)).toBeVisible({ 
        timeout: 5000 
      });
    }
  }
}

// Memory and performance testing
export class PerformanceTester {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Memory pressure test
  async memoryPressureTest(): Promise<void> {
    await this.page.evaluate(() => {
      // Create memory pressure
      const arrays = [];
      for (let i = 0; i < 100; i++) {
        arrays.push(new Array(10000).fill(Math.random()));
      }
      
      // Force garbage collection if available
      const windowWithGC = window as unknown as { gc?: () => void };
      if (windowWithGC.gc) {
        windowWithGC.gc();
      }
    });
  }

  // CPU stress test
  async cpuStressTest(): Promise<void> {
    await this.page.evaluate(() => {
      // CPU intensive operation
      const start = Date.now();
      let cpuWork = 0;
      while (Date.now() - start < 1000) {
        cpuWork += Math.random() * Math.random();
      }
    });
  }

  // Network throttling simulation
  async simulateSlowNetwork(): Promise<void> {
    await this.page.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
      await route.continue();
    });
  }
}

// Test configuration
export const TEST_CONFIG = {
  tabs: ['dashboard', 'accounts', 'transactions', 'insights', 'reports', 'wrapped', 'profile'],
  selectors: {
    navigation: '[data-testid="navigation"]',
    mainContent: 'main',
    errorBoundary: '[data-testid="error-boundary"]',
    loading: '[data-testid="loading"]'
  },
  timeouts: {
    navigation: 5000,
    component: 10000,
    api: 15000
  }
};