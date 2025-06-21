# Safe Deletion Plan - Liquid Spark Finance

## Summary
This plan identifies 192 orphaned files (35% of codebase) that can be safely deleted to improve maintainability and build performance.

## Phase 1: Zero-Risk Deletions (59 files)
These files have 0 imports and 0 imported_by - completely safe to delete.

### Config Files to Keep (Despite Being Marked Orphaned)
```bash
# DO NOT DELETE - These are essential config files
# - eslint.config.js
# - playwright.config.js  
# - playwright.bottom-nav.config.ts
# - postcss.config.js
```

### Utility Scripts (Safe to Delete)
```bash
rm accessibility-audit.js
rm bundle-analyzer.js
```

### Orphaned Components (Safe to Delete)
```bash
# Navigation components (replaced)
rm src/components/Navigation.tsx
rm src/components/QuickActions.tsx

# AI components (unused)
rm src/components/ai/ChatDrawer.tsx
rm src/components/ai/FinancialAIChat.tsx

# Example/Demo components  
rm src/components/examples/EnhancedEcoScore.tsx
rm src/components/viewport/ViewportGuardianDemo.tsx
rm src/components/wrapped/WrappedPage.tsx

# Family features (unused)
rm src/components/family/FamilyManagement.tsx

# Error boundary (keep for now - important for React)
# rm src/components/shared/ErrorBoundary.tsx

# Account components (alternative implementations)
rm src/features/accounts/components/AccountSkeleton.tsx
rm src/features/accounts/components/AccountsOverview.tsx
rm src/features/accounts/components/CleanAccountCard.tsx
rm src/features/accounts/components/CompactAccountCard.tsx
rm src/features/accounts/components/AccountLinking.tsx

# Credit components (unused)
rm src/features/credit/components/CreditEducation.tsx
rm src/features/credit/components/CreditFactors.tsx
rm src/features/credit/components/CreditTips.tsx
rm src/features/credit/components/ScoreHistory.tsx
rm src/features/credit/components/CreditScoreCard.tsx

# Empty index files
rm src/features/index.ts
rm src/context/index.ts
rm src/features/dashboard/components/health/index.ts

# Unused insight components
rm src/features/insights/components/EcoScore.tsx
rm src/features/insights/components/HealthScore.tsx
rm src/features/insights/components/MetricCard.tsx
rm src/features/insights/components/RefactoredEcoCard.tsx
```

## Phase 2: Medium-Risk Deletions (Complex Orphaned Files)
These files have imports but are still orphaned - review before deletion.

### Files to Review Manually
```bash
# Check if these are actually used via dynamic imports
src/shared/index.ts  # 13 imports - may be a barrel export file
src/shared/components/ui/sidebar.tsx  # 7 imports
src/shared/ui/sidebar.tsx  # 7 imports  
src/pages/CleanDashboard.tsx  # 6 imports
```

## Phase 3: Low-Risk Deletions (Files Not in Bundle)
103 files not in production bundle but marked as active - investigate further.

## Batch Deletion Commands

### Phase 1A: Utility Scripts
```bash
rm accessibility-audit.js bundle-analyzer.js
```

### Phase 1B: AI Components
```bash
rm -rf src/components/ai/
```

### Phase 1C: Family Components  
```bash
rm -rf src/components/family/
```

### Phase 1D: Example Components
```bash
rm -rf src/components/examples/
rm src/components/viewport/ViewportGuardianDemo.tsx
rm src/components/wrapped/WrappedPage.tsx
```

### Phase 1E: Unused Account Components
```bash
rm src/features/accounts/components/AccountSkeleton.tsx
rm src/features/accounts/components/AccountsOverview.tsx  
rm src/features/accounts/components/CleanAccountCard.tsx
rm src/features/accounts/components/CompactAccountCard.tsx
rm src/features/accounts/components/AccountLinking.tsx
```

### Phase 1F: Unused Credit Components
```bash
rm src/features/credit/components/CreditEducation.tsx
rm src/features/credit/components/CreditFactors.tsx
rm src/features/credit/components/CreditTips.tsx
rm src/features/credit/components/ScoreHistory.tsx
rm src/features/credit/components/CreditScoreCard.tsx
```

### Phase 1G: Empty Index Files
```bash
rm src/features/index.ts
rm src/context/index.ts
rm src/features/dashboard/components/health/index.ts
```

### Phase 1H: Unused Insight Components
```bash
rm src/features/insights/components/EcoScore.tsx
rm src/features/insights/components/HealthScore.tsx
rm src/features/insights/components/MetricCard.tsx
rm src/features/insights/components/RefactoredEcoCard.tsx
```

## Validation Steps

After each phase:

1. **Run Tests**
   ```bash
   npm test
   npm run test:e2e
   ```

2. **Check Build**
   ```bash  
   npm run build
   ```

3. **Verify App Functionality**
   ```bash
   npm run dev
   # Test major user flows
   ```

4. **Update Bundle Analysis**
   ```bash
   npm run analyze:bundle
   ```

## Expected Results

- **Files Removed**: ~59 files (Phase 1)
- **Size Savings**: ~118KB minimum  
- **Build Performance**: Faster builds with fewer files to process
- **Maintainability**: 35% fewer files to maintain
- **Bundle Size**: Potential reduction in final bundle size

## Rollback Plan

If issues are discovered:

1. **Git Reset**: All deletions should be in separate commits for easy rollback
2. **Individual File Restore**: `git checkout HEAD~1 -- path/to/file.tsx`
3. **Full Phase Rollback**: `git reset --hard HEAD~1`

## Notes

- Keep ErrorBoundary.tsx even though orphaned - important for React error handling
- Config files marked as orphaned should NOT be deleted
- Test thoroughly after each phase before proceeding
- Consider running this cleanup on a feature branch first