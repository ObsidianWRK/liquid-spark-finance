import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig as defineVitestConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
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
  server: {
    port: 3000,
    host: true
  },
  preview: {
    port: 3000,
    host: true
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
})