# Deployment & Development Setup Guide

## Overview

This comprehensive guide covers development environment setup, build processes, deployment strategies, and production configuration for the Vueni application.

## Development Environment Setup

### Prerequisites

#### System Requirements

- **Node.js**: v18.0.0 or higher ([Install with nvm](https://github.com/nvm-sh/nvm))
- **npm**: v8.0.0 or higher (comes with Node.js)
- **Git**: Latest version
- **VS Code**: Recommended IDE with extensions

#### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-playwright.playwright",
    "vitest.explorer"
  ]
}
```

### Local Development Setup

#### 1. Clone and Setup Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/vueni.git
cd vueni

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Start development server
npm run dev
```

#### 2. Environment Configuration

Create `.env.local` file:

```bash
# Development Configuration
VITE_APP_NAME="Vueni"
VITE_APP_VERSION="1.0.0"
VITE_APP_ENV="development"

# API Configuration
VITE_API_BASE_URL="http://localhost:3001"
VITE_MOCK_API="true"

# Feature Flags
VITE_ENABLE_AI_FEATURES="true"
VITE_ENABLE_ADVANCED_ANALYTICS="true"
VITE_ENABLE_EXPERIMENTAL_FEATURES="false"

# Security
VITE_ENCRYPTION_KEY="dev-key-change-in-production"
VITE_RATE_LIMIT_ENABLED="false"

# External APIs
VITE_EXCHANGE_RATE_API_KEY="your-api-key"
VITE_ANALYTICS_ID="your-analytics-id"

# Performance Monitoring
VITE_SENTRY_DSN="your-sentry-dsn"
VITE_PERFORMANCE_MONITORING="true"
```

#### 3. Development Scripts

```json
{
  "scripts": {
    "dev": "vite --host",
    "dev:https": "vite --https --host",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "build:staging": "vite build --mode staging",
    "preview": "vite preview",
    "lint": "eslint . --ext .ts,.tsx --fix",
    "lint:check": "eslint . --ext .ts,.tsx",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "analyze": "npm run build && npx vite-bundle-analyzer dist/stats.html"
  }
}
```

### Database Setup (Future Enhancement)

#### PostgreSQL Setup

```bash
# Install PostgreSQL (macOS)
brew install postgresql@14
brew services start postgresql@14

# Create database
createdb vueni_dev

# Run migrations (when implemented)
npm run db:migrate
npm run db:seed
```

#### Environment Variables for Database

```bash
# Add to .env.local when database is implemented
DATABASE_URL="postgresql://user:password@localhost:5432/vueni_dev"
REDIS_URL="redis://localhost:6379"
```

## Build Configuration

### Vite Configuration

```typescript
// vite.config.ts
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
      }),
    ],

    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@services': resolve(__dirname, 'src/services'),
        '@hooks': resolve(__dirname, 'src/hooks'),
        '@types': resolve(__dirname, 'src/types'),
      },
    },

    build: {
      target: 'es2020',
      outDir: 'dist',
      sourcemap: mode !== 'production',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
            charts: ['recharts'],
            utils: ['date-fns', 'clsx', 'tailwind-merge'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },

    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
    },

    server: {
      port: 5173,
      host: true,
      open: true,
      cors: true,
    },

    preview: {
      port: 4173,
      host: true,
    },

    define: {
      __APP_VERSION__: JSON.stringify(env.npm_package_version),
      __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    },
  };
});
```

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "allowJs": false,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,

    /* Path mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@utils/*": ["./src/utils/*"],
      "@services/*": ["./src/services/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@types/*": ["./src/types/*"]
    }
  },
  "include": ["src", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}
```

### ESLint Configuration

```javascript
// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import security from 'eslint-plugin-security';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      security: security,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      ...security.configs.recommended.rules,

      // Custom rules
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/prefer-const': 'error',
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    },
  }
);
```

## Deployment Strategies

### 1. Vercel Deployment (Recommended)

#### Setup Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### Vercel Configuration (`vercel.json`)

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "env": {
    "VITE_APP_ENV": "production",
    "VITE_MOCK_API": "false"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.exchangerate-api.com; frame-ancestors 'none';"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/calculator/:path*",
      "destination": "/calculators/:path*",
      "permanent": true
    }
  ],
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ]
}
```

### 2. Netlify Deployment

#### Netlify Configuration (`netlify.toml`)

```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.exchangerate-api.com; frame-ancestors 'none';"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 3. Docker Deployment

#### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Add security headers
COPY nginx-security.conf /etc/nginx/conf.d/security.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration (`nginx.conf`)

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    server {
        listen 80;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;

        # Security headers
        include /etc/nginx/conf.d/security.conf;

        # Handle React Router
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location /assets/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # API proxy (if needed)
        location /api/ {
            proxy_pass http://backend:3001/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

#### Docker Compose (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '80:80'
    environment:
      - NODE_ENV=production
    restart: unless-stopped

  # Future: Database service
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: vueni
      POSTGRES_USER: app_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  # Future: Redis cache
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### 4. AWS S3 + CloudFront Deployment

#### S3 Deployment Script

```bash
#!/bin/bash

# Build application
npm run build

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "index.html" \
  --exclude "service-worker.js"

# Upload index.html without cache
aws s3 cp dist/index.html s3://your-bucket-name/index.html \
  --cache-control "public, max-age=0, must-revalidate"

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

#### CloudFormation Template (partial)

```yaml
Resources:
  S3Bucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub '${AWS::StackName}-app'
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true

  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Origins:
          - DomainName: !GetAtt S3Bucket.RegionalDomainName
            Id: S3Origin
            S3OriginConfig:
              OriginAccessIdentity: !Sub 'origin-access-identity/cloudfront/${OriginAccessIdentity}'
        DefaultCacheBehavior:
          TargetOriginId: S3Origin
          ViewerProtocolPolicy: redirect-to-https
          CachePolicyId: 4135ea2d-6df8-44a3-9df3-4b5a84be39ad # Managed-CachingOptimized
        CustomErrorResponses:
          - ErrorCode: 404
            ResponseCode: 200
            ResponsePagePath: /index.html
        PriceClass: PriceClass_100
        Enabled: true
```

## Environment-Specific Configurations

### Development Environment

```typescript
// src/config/development.ts
export const config = {
  API_BASE_URL: 'http://localhost:3001',
  ENABLE_MOCK_DATA: true,
  LOG_LEVEL: 'debug',
  ENABLE_DEV_TOOLS: true,
  RATE_LIMITING: false,
  ANALYTICS_ENABLED: false,
  ERROR_REPORTING: false,
  FEATURE_FLAGS: {
    AI_FEATURES: true,
    ADVANCED_ANALYTICS: true,
    EXPERIMENTAL_FEATURES: true,
    BETA_CALCULATORS: true,
  },
};
```

### Staging Environment

```typescript
// src/config/staging.ts
export const config = {
  API_BASE_URL: 'https://staging-api.vueni.com',
  ENABLE_MOCK_DATA: false,
  LOG_LEVEL: 'info',
  ENABLE_DEV_TOOLS: false,
  RATE_LIMITING: true,
  ANALYTICS_ENABLED: true,
  ERROR_REPORTING: true,
  FEATURE_FLAGS: {
    AI_FEATURES: true,
    ADVANCED_ANALYTICS: true,
    EXPERIMENTAL_FEATURES: false,
    BETA_CALCULATORS: true,
  },
};
```

### Production Environment

```typescript
// src/config/production.ts
export const config = {
  API_BASE_URL: 'https://api.vueni.com',
  ENABLE_MOCK_DATA: false,
  LOG_LEVEL: 'error',
  ENABLE_DEV_TOOLS: false,
  RATE_LIMITING: true,
  ANALYTICS_ENABLED: true,
  ERROR_REPORTING: true,
  FEATURE_FLAGS: {
    AI_FEATURES: true,
    ADVANCED_ANALYTICS: true,
    EXPERIMENTAL_FEATURES: false,
    BETA_CALCULATORS: false,
  },
};
```

## Performance Optimization

### Bundle Analysis and Optimization

```bash
# Analyze bundle size
npm run analyze

# Check for unused dependencies
npx depcheck

# Audit for vulnerabilities
npm audit

# Update dependencies
npx npm-check-updates -u
```

### Performance Monitoring Setup

```typescript
// src/utils/performance.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export const initPerformanceMonitoring = () => {
  if (process.env.NODE_ENV === 'production') {
    getCLS(sendToAnalytics);
    getFID(sendToAnalytics);
    getFCP(sendToAnalytics);
    getLCP(sendToAnalytics);
    getTTFB(sendToAnalytics);
  }
};

const sendToAnalytics = (metric: any) => {
  // Send to your analytics service
  if (window.gtag) {
    window.gtag('event', metric.name, {
      custom_parameter_1: metric.value,
      custom_parameter_2: metric.id,
    });
  }
};
```

### Service Worker for Caching

```typescript
// public/sw.js
const CACHE_NAME = 'vueni-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request);
    })
  );
});
```

## Monitoring and Observability

### Error Tracking with Sentry

```typescript
// src/utils/monitoring.ts
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export const initMonitoring = () => {
  Sentry.init({
    dsn: process.env.VITE_SENTRY_DSN,
    environment: process.env.VITE_APP_ENV,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
    beforeSend: (event) => {
      // Filter out development errors
      if (process.env.NODE_ENV === 'development') {
        return null;
      }
      return event;
    },
  });
};

export const logError = (error: Error, context?: any) => {
  Sentry.captureException(error, {
    contexts: { additional: context },
  });
};
```

### Analytics Setup

```typescript
// src/utils/analytics.ts
export const initAnalytics = () => {
  if (process.env.VITE_ANALYTICS_ID && process.env.NODE_ENV === 'production') {
    // Google Analytics 4
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.VITE_ANALYTICS_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', process.env.VITE_ANALYTICS_ID);
  }
};

export const trackEvent = (
  action: string,
  category: string,
  label?: string
) => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
    });
  }
};
```

## Security Configuration

### Content Security Policy

```typescript
// src/utils/security.ts
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:'],
  'font-src': ["'self'", 'data:'],
  'connect-src': ["'self'", 'https://api.exchangerate-api.com'],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
};
```

### Environment Variable Validation

```typescript
// src/utils/env.ts
import { z } from 'zod';

const envSchema = z.object({
  VITE_APP_ENV: z.enum(['development', 'staging', 'production']),
  VITE_API_BASE_URL: z.string().url(),
  VITE_ENCRYPTION_KEY: z.string().min(16),
  VITE_ANALYTICS_ID: z.string().optional(),
  VITE_SENTRY_DSN: z.string().url().optional(),
});

export const validateEnv = () => {
  try {
    return envSchema.parse(import.meta.env);
  } catch (error) {
    console.error('Environment validation failed:', error);
    throw new Error('Invalid environment configuration');
  }
};
```

## Continuous Integration/Continuous Deployment

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:coverage

      - name: Run E2E tests
        run: npm run test:e2e

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          VITE_APP_ENV: production
          VITE_API_BASE_URL: ${{ secrets.PRODUCTION_API_URL }}
          VITE_ENCRYPTION_KEY: ${{ secrets.ENCRYPTION_KEY }}

      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Troubleshooting Guide

### Common Development Issues

#### 1. Build Failures

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run type-check

# Verify environment variables
npm run env:check
```

#### 2. Performance Issues

```bash
# Analyze bundle size
npm run analyze

# Check for memory leaks
npm run dev -- --inspect

# Profile component renders
npm run dev -- --profile
```

#### 3. Test Failures

```bash
# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test -- TransactionList.test.tsx

# Update snapshots
npm run test -- --updateSnapshot
```

### Production Issues

#### 1. High Memory Usage

```bash
# Monitor Node.js memory
node --max-old-space-size=4096 dist/server.js

# Enable heap dumps
node --heapsnapshot-signal=SIGUSR2 dist/server.js
```

#### 2. Slow Load Times

```typescript
// Check bundle analysis
import { lazy } from 'react';

// Implement code splitting
const Calculator = lazy(() => import('./Calculator'));

// Add performance monitoring
performance.mark('component-start');
// ... component render
performance.mark('component-end');
performance.measure('component-render', 'component-start', 'component-end');
```

## Maintenance and Updates

### Regular Maintenance Tasks

#### Weekly

- [ ] Check for security vulnerabilities (`npm audit`)
- [ ] Review performance metrics
- [ ] Update dependencies (`npm update`)
- [ ] Run full test suite

#### Monthly

- [ ] Major dependency updates (`npx npm-check-updates`)
- [ ] Performance optimization review
- [ ] Security audit and review
- [ ] Documentation updates

#### Quarterly

- [ ] Technology stack review
- [ ] Architecture assessment
- [ ] Dependency cleanup
- [ ] Security penetration testing

### Update Procedures

#### Dependency Updates

```bash
# Check for outdated packages
npm outdated

# Update all dependencies
npx npm-check-updates -u
npm install

# Test after updates
npm run test:all
npm run build
```

#### Version Management

```json
{
  "version": "1.0.0",
  "scripts": {
    "version:patch": "npm version patch && git push --tags",
    "version:minor": "npm version minor && git push --tags",
    "version:major": "npm version major && git push --tags"
  }
}
```

This comprehensive deployment guide provides everything needed to set up, build, deploy, and maintain the Vueni application across different environments and platforms.
