import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig as defineVitestConfig } from 'vitest/config'
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".mjs", ".js", ".jsx", ".tsx", ".ts", ".json"]
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: mode === 'development',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Phase 3: Advanced chunk optimization
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'vendor';
            if (id.includes('@radix-ui')) return 'ui';
            if (id.includes('recharts')) return 'charts';
            if (id.includes('crypto-js')) return 'crypto';
            if (id.includes('react-router')) return 'routing';
            return 'vendor';
          }
          
          // Application chunks
          if (id.includes('/insights/')) return 'insights';
          if (id.includes('/calculators/')) return 'calculators';
          if (id.includes('/components/ui/UniversalCard')) return 'universal-card';
          if (id.includes('/performance/')) return 'performance';
          if (id.includes('/transactions/Optimized')) return 'optimized-transactions';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 1000
  },
  // Server config removed for Vercel compatibility
  // Vercel handles hosting automatically
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
    // Fix crypto-js browser compatibility - process polyfills
    'process.env': JSON.stringify({}),
    'process.browser': true,
    'process.version': JSON.stringify(''),
    'process.platform': JSON.stringify('browser'),
    'process.nextTick': JSON.stringify('setTimeout'),
    'global': 'globalThis',
    // Security flags for production
    '__VUENI_SECURITY_ENABLED__': mode === 'production',
    '__VUENI_DEBUG_ENABLED__': mode === 'development'
  },
  // Security optimizations
  server: {
    headers: mode === 'production' ? {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    } : {}
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.ts',
        'dist/',
        'e2e/',
        'docs/',
        '*.config.js',
        '*.config.ts'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        },
        // Critical components require higher coverage
        'src/utils/calculators.ts': {
          branches: 95,
          functions: 100,
          lines: 95,
          statements: 95
        },
        'src/utils/security.ts': {
          branches: 90,
          functions: 95,
          lines: 90,
          statements: 90
        },
        'src/utils/crypto.ts': {
          branches: 90,
          functions: 95,
          lines: 90,
          statements: 90
        }
      }
    },
    // Performance testing configuration
    benchmark: {
      include: ['src/**/*.bench.{js,ts}'],
      exclude: ['node_modules/', 'dist/']
    }
  }
}))
