import { defineConfig, devices } from '@playwright/test';

/**
 * Enhanced Playwright configuration for Hook Validation Testing
 * Optimized for detecting React hook violations and performance issues
 */
export default defineConfig({
  testDir: './e2e',
  
  /* Hook validation tests benefit from sequential execution to avoid interference */
  fullyParallel: process.env.HOOK_VALIDATION_MODE ? false : true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry hook validation tests to ensure consistency */
  retries: process.env.CI ? 2 : 0,
  
  /* Sequential execution for hook validation tests */
  workers: process.env.CI ? 1 : (process.env.HOOK_VALIDATION_MODE ? 1 : undefined),
  
  /* Enhanced reporting for hook validation */
  reporter: [
    ['html', { 
      open: process.env.CI ? 'never' : 'on-failure',
      outputFolder: 'playwright-report'
    }],
    ['json', { outputFile: 'test-results/test-results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['line']
  ],
  
  /* Global timeout for hook validation tests */
  globalTimeout: process.env.HOOK_VALIDATION_MODE ? 15 * 60 * 1000 : 10 * 60 * 1000, // 15 min for hook validation
  
  /* Test timeout */
  timeout: process.env.HOOK_VALIDATION_MODE ? 2 * 60 * 1000 : 30 * 1000, // 2 min for hook validation tests
  
  /* Expect timeout */
  expect: {
    timeout: process.env.HOOK_VALIDATION_MODE ? 30 * 1000 : 10 * 1000, // 30s for hook validation
  },
  
  /* Shared settings optimized for hook validation */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:8080',

    /* Enhanced tracing for hook validation */
    trace: process.env.HOOK_VALIDATION_MODE ? 'on' : 'on-first-retry',
    
    /* Always take screenshots for hook validation failures */
    screenshot: process.env.HOOK_VALIDATION_MODE ? 'only-on-failure' : 'only-on-failure',
    
    /* Enhanced video recording for hook validation */
    video: process.env.HOOK_VALIDATION_MODE ? 'retain-on-failure' : 'retain-on-failure',
    
    /* Increased action timeout for hook validation */
    actionTimeout: process.env.HOOK_VALIDATION_MODE ? 30 * 1000 : 10 * 1000,
    
    /* Enhanced navigation timeout */
    navigationTimeout: process.env.HOOK_VALIDATION_MODE ? 45 * 1000 : 30 * 1000,
    
    /* Viewport for consistency */
    viewport: { width: 1280, height: 720 },
    
    /* Ignore HTTPS errors for local development */
    ignoreHTTPSErrors: true,
    
    /* Enhanced browser context for hook validation */
    contextOptions: {
      /* Enable strict mode for better error detection */
      strictSelectors: true,
    },
    
    /* Browser launch options for better hook validation */
    launchOptions: {
      /* Enable more detailed logging */
      args: process.env.HOOK_VALIDATION_MODE ? [
        '--disable-web-security',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection',
        '--enable-logging',
        '--log-level=0',
        '--v=1'
      ] : []
    }
  },

  /* Configure projects for major browsers and hook validation */
  projects: [
    /* Hook Validation Project - Chrome with enhanced debugging */
    {
      name: 'hook-validation-chrome',
      testMatch: ['**/hook-*.spec.ts', '**/comprehensive-hook-validation.spec.ts'],
      use: { 
        ...devices['Desktop Chrome'],
        /* Enhanced Chrome args for React DevTools compatibility and debugging */
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=TranslateUI',
            '--disable-ipc-flooding-protection',
            '--enable-logging',
            '--log-level=0',
            '--v=1',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding'
          ]
        },
        /* Enable React DevTools detection */
        contextOptions: {
          strictSelectors: true,
        }
      },
    },

    /* Standard browser testing */
    {
      name: 'chromium',
      testIgnore: ['**/hook-*.spec.ts', '**/comprehensive-hook-validation.spec.ts'],
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      testIgnore: ['**/hook-*.spec.ts', '**/comprehensive-hook-validation.spec.ts'],
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      testIgnore: ['**/hook-*.spec.ts', '**/comprehensive-hook-validation.spec.ts'],
      use: { ...devices['Desktop Safari'] },
    },

    /* Mobile testing with hook validation */
    {
      name: 'hook-validation-mobile',
      testMatch: ['**/navigation-hook-validation.spec.ts', '**/performance-hook-validation.spec.ts'],
      use: { 
        ...devices['Pixel 5'],
        /* Mobile-specific settings for hook validation */
        launchOptions: {
          args: [
            '--disable-web-security',
            '--enable-logging',
            '--log-level=0'
          ]
        }
      },
    },

    /* Standard mobile testing */
    {
      name: 'Mobile Chrome',
      testIgnore: ['**/hook-*.spec.ts', '**/comprehensive-hook-validation.spec.ts'],
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      testIgnore: ['**/hook-*.spec.ts', '**/comprehensive-hook-validation.spec.ts'],
      use: { ...devices['iPhone 12'] },
    },

    /* Cross-browser hook validation (optional) */
    // {
    //   name: 'hook-validation-firefox',
    //   testMatch: ['**/hook-violations.spec.ts'],
    //   use: { 
    //     ...devices['Desktop Firefox'],
    //     launchOptions: {
    //       args: ['--disable-web-security']
    //     }
    //   },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    port: 8080,
    reuseExistingServer: !process.env.CI,
    timeout: 180 * 1000, // Increase timeout to 3 minutes
    stdout: 'pipe',
    stderr: 'pipe',
  },
}); 