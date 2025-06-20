---
name: '🧹 Agent 8: Refactor-Linter'
about: Clean up code with ESLint and remove dead code
title: '[Agent 8] Run linter fixes & clean dead code'
labels: agent-8, cleanup, linting
assignees: ''
---

# 🧹 Agent 8: Refactor-Linter Task

## Overview

Final cleanup pass to run ESLint auto-fixes, remove unused code, and add lint rules to prevent future issues.

## Tasks

- [ ] Run comprehensive ESLint fixes:

  ```bash
  # Auto-fix all fixable issues
  npx eslint src --fix --ext .ts,.tsx

  # Run Prettier formatting
  npx prettier --write "src/**/*.{ts,tsx,css}"
  ```

- [ ] Remove unused imports:

  ```bash
  # Use ts-prune to find unused exports
  npx ts-prune

  # Remove unused imports with eslint
  npx eslint src --fix --rule 'no-unused-vars: error'
  ```

- [ ] Update ESLint configuration:

  ```javascript
  // Add to eslint.config.js
  {
    rules: {
      // Forbid direct toFixed usage
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.property.name="toFixed"]',
          message: 'Use formatScore, formatCurrency, or formatPercentage from utils/format.ts instead'
        }
      ],
      // Ensure consistent imports
      'import/order': ['error', {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
        'newlines-between': 'always'
      }],
      // Remove unused variables
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }]
    }
  }
  ```

- [ ] Clean up after refactor:

  - [ ] Remove deprecated GlassCard component
  - [ ] Delete unused transaction list variants
  - [ ] Remove old formatting utilities if replaced
  - [ ] Clean up duplicate mock data files

- [ ] TypeScript strict checks:

  ```bash
  # Check for any type errors
  npx tsc --noEmit

  # Find implicit any types
  npx tsc --noImplicitAny
  ```

- [ ] Bundle size analysis:

  ```bash
  # Analyze bundle after cleanup
  npm run build
  npx vite-bundle-visualizer
  ```

- [ ] Dead code removal targets:
  - [ ] Unused component variants
  - [ ] Duplicate utility functions
  - [ ] Old migration files
  - [ ] Commented-out code blocks
  - [ ] Unused CSS classes

## Validation Checklist

- [ ] No ESLint errors
- [ ] No TypeScript errors
- [ ] No unused imports
- [ ] No .toFixed() in production code
- [ ] Bundle size not increased
- [ ] All tests passing
- [ ] Build completes successfully

## Definition of Done

- [ ] Zero linting errors
- [ ] All auto-fixable issues resolved
- [ ] Dead code removed
- [ ] New lint rules preventing regressions
- [ ] Clean build with no warnings
- [ ] Documentation updated if needed
