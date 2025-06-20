# Dependency Pruning Report — Tree-Shaking Optimization

## Overview

Analysis of bundle dependencies to identify tree-shaking opportunities and reduce vendor chunk sizes.

## Current Dependency Analysis

### ✅ Well-Optimized Libraries

- **date-fns**: 3.6.0
  - Only importing specific functions (`format`, `isToday`, `isYesterday`)
  - Already optimized for tree-shaking
  - Usage: 3 files, minimal import footprint

### ❌ Optimization Opportunities

#### 1. **React Router Dom**

- Current: Full library import in multiple files
- Optimization: Use specific imports only where needed
- Estimated savings: ~15KB

#### 2. **Radix UI Components**

- Current: Individual component imports (good)
- Already optimized for tree-shaking
- No action needed

#### 3. **Recharts**

- Current: Bundled as vendor-charts (436KB)
- Optimization: Lazy loading implemented
- Target: Reduce to ≤300KB through selective loading

## Recommended Actions

### Phase 1: Import Optimization

```bash
# Replace broad imports with specific ones
find src -name "*.tsx" -exec grep -l "import.*from 'react-router-dom'" {} \;
```

### Phase 2: Dynamic Imports for Heavy Features

- Charts (Recharts) ✅ Implemented
- Complex calculators ✅ Implemented
- Analytics visualizations (Next target)

### Phase 3: Bundle Analysis

```bash
npm run build:analyze
# Review dist/assets/ for largest chunks
# Target: No single chunk >250KB except vendor-react
```

## Tree-Shaking Configuration

### Vite Config Optimization

```typescript
// Already implemented in vite.config.ts
build: {
  rollupOptions: {
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false
    }
  }
}
```

### ESM Package Verification

- ✅ date-fns: Pure ESM, excellent tree-shaking
- ✅ Radix UI: Optimized for tree-shaking
- ✅ Recharts: ESM compatible
- ✅ React Router: ESM ready

## Bundle Size Targets

| Category      | Current | Target | Status         |
| ------------- | ------- | ------ | -------------- |
| vendor-react  | 314KB   | 300KB  | ⚠️ Monitor     |
| vendor-charts | 436KB   | ≤300KB | 🎯 In Progress |
| vendor-ui     | 103KB   | ≤100KB | ✅ Good        |
| vendor-router | 31KB    | ≤30KB  | ✅ Good        |
| vendor-utils  | 20KB    | ≤20KB  | ✅ Excellent   |

## Implementation Status

### ✅ Completed

1. **Calculator code splitting**: Individual lazy-loaded chunks
2. **Vendor chunk separation**: Strategic 5-chunk split
3. **Date-fns optimization**: Already using selective imports

### 🎯 In Progress

1. **Chart lazy loading**: LazyChartWrapper implemented
2. **Bundle size monitoring**: Automated via npm scripts

### 📋 Next Steps

1. Apply lazy loading to all chart instances
2. Monitor vendor-charts bundle size reduction
3. Implement dynamic imports for analytics features
4. Set up bundle size CI monitoring

## Performance Impact

### Expected Improvements

- **Initial bundle reduction**: ~150KB (charts become on-demand)
- **Cache efficiency**: Better vendor chunk splitting
- **Runtime performance**: Lazy loading reduces parse time
- **Mobile experience**: Faster TTI on slow connections

### Measurement Plan

- Lighthouse CI integration for automated monitoring
- Bundle size regression protection
- Core Web Vitals tracking in production

## Rollback Strategy

If tree-shaking causes issues:

1. Revert to previous imports via git
2. Disable aggressive tree-shaking in Vite config
3. Re-evaluate import patterns

---

_Generated: 2025-06-20_  
_Target: vendor-charts ≤ 300KB_
