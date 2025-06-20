# Hook Validation Testing Guide

## Overview

This comprehensive testing infrastructure is designed to detect and prevent React hook violations, specifically the "rendered more hooks than during the previous render" error. The system provides multiple layers of validation and monitoring to ensure robust hook usage throughout the application.

## Problem Statement

The application was experiencing intermittent "rendered more hooks than during the previous render" errors, particularly during:

- Navigation between tabs (dashboard, accounts, transactions, insights, reports, wrapped, profile)
- Viewport changes (mobile to desktop transitions)
- Component mount/unmount cycles
- Rapid navigation sequences

## Solution Architecture

### 1. Hook Validation Monitor (`hook-validation-config.ts`)

A comprehensive monitoring system that:

- Captures console errors and warnings
- Monitors performance metrics
- Tracks memory usage
- Detects specific hook violation patterns
- Generates detailed reports

### 2. Test Suite Structure

#### Core Test Files:

- `hook-violations.spec.ts` - Basic hook violation detection
- `navigation-hook-validation.spec.ts` - Navigation-specific hook testing
- `performance-hook-validation.spec.ts` - Performance stress testing
- `comprehensive-hook-validation.spec.ts` - Complete validation suite

#### Test Categories:

**Basic Hook Validation:**

- Initial page load validation
- Tab navigation validation
- URL parameter changes
- Page refresh scenarios

**Navigation Testing:**

- Sequential navigation between all tabs
- Rapid navigation stress tests
- Back/forward browser navigation
- Mobile viewport navigation
- Concurrent navigation events

**Performance Testing:**

- High-frequency navigation (100+ rapid navigations)
- Memory stress scenarios
- CPU stress testing
- Network throttling
- Resource cleanup validation

**Error Recovery:**

- Invalid route handling
- Error boundary scenarios
- Corrupted data recovery
- Network failure recovery

## Test Execution

### Basic Hook Validation

```bash
# Run all hook validation tests
npm run test:hook-validation

# Run specific test suites
npm run test:hook-violations
npm run test:navigation-hooks
npm run test:performance-hooks
npm run test:comprehensive-hooks
```

### Debug Mode

```bash
# Run with UI for debugging
npm run test:hook-validation:ui

# Run with browser visible
npm run test:hook-validation:headed

# Run with step-by-step debugging
npm run test:hook-validation:debug
```

### Mobile Testing

```bash
# Test mobile-specific scenarios
npm run test:hook-validation:mobile
```

### All Hook Tests

```bash
# Run all hook-related tests across projects
npm run test:hook-validation:all
```

## Configuration

### Environment Variables

- `HOOK_VALIDATION_MODE=true` - Enables enhanced hook validation settings
- Automatically configures:
  - Extended timeouts
  - Enhanced browser logging
  - Sequential test execution
  - Detailed tracing

### Playwright Configuration

The configuration includes specialized projects:

- `hook-validation-chrome` - Desktop Chrome with enhanced debugging
- `hook-validation-mobile` - Mobile testing with hook validation
- Standard projects exclude hook validation tests to avoid interference

## Test Scenarios

### 1. Navigation Validation

Tests all possible navigation patterns:

- Dashboard ↔ Accounts ↔ Transactions ↔ Insights ↔ Reports ↔ Wrapped ↔ Profile
- URL parameter changes
- Browser back/forward navigation
- Rapid navigation sequences

### 2. Component Lifecycle

Validates hook usage during:

- Component mounting
- Component unmounting
- Lazy loading (Wrapped component)
- Error boundary activation
- Performance mode transitions

### 3. Viewport Changes

Tests hook consistency across:

- Desktop (1920x1080, 1366x768)
- Tablet (768x1024, 1024x768)
- Mobile (375x667, 320x568)
- Orientation changes
- Real-time viewport transitions

### 4. Stress Testing

Performance validation under:

- High CPU usage
- Memory pressure
- Network throttling
- Concurrent user interactions
- Resource cleanup scenarios

## Hook Violation Detection

### Monitored Patterns:

- "rendered more hooks than during the previous render"
- "rendered fewer hooks than expected"
- "Invalid hook call"
- "Hook was called outside of React component"
- "Cannot update a component while rendering a different component"

### Detection Methods:

1. **Console Monitoring** - Captures all console errors/warnings
2. **Page Error Monitoring** - Catches unhandled page errors
3. **Performance Monitoring** - Tracks navigation and render times
4. **Memory Monitoring** - Detects memory leaks and high usage

## Reporting

### Test Reports Include:

- **Hook Violations Count** - Exact number and details
- **Hook Warnings** - Potential issues
- **Performance Metrics** - Navigation times, memory usage
- **Test Coverage** - Scenarios tested
- **Screenshots** - Visual evidence of failures
- **Video Recording** - Full test execution for failures

### Report Format:

```
# Hook Validation Report

## Hook Violations: 0 ✅
## Hook Warnings: 2 ⚠️
- Warning: Component did not update as expected

## Performance Metrics
- Average Navigation Time: 245ms
- Max Navigation Time: 890ms
- Total Navigations: 42

## Memory Metrics
- Max Memory Usage: 45MB
- Average Memory Usage: 32MB

## Summary
- ✅ Hook Violations: PASS
- ✅ Performance: PASS
- ✅ Memory: PASS
```

## Best Practices

### 1. Consistent Hook Order

Ensure hooks are always called in the same order:

```typescript
// ✅ Good - Consistent hook order
const Component = () => {
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Effect logic
  }, []);

  return <div>{content}</div>;
};

// ❌ Bad - Conditional hooks
const Component = ({ condition }) => {
  if (condition) {
    const [state, setState] = useState(initialState); // Conditional hook
  }

  return <div>{content}</div>;
};
```

### 2. Early Returns After Hooks

All hooks must be declared before any conditional returns:

```typescript
// ✅ Good - Hooks before early returns
const Component = () => {
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  // Early returns after hooks
  if (!data) {
    return <div>Loading...</div>;
  }

  return <div>{content}</div>;
};

// ❌ Bad - Early return before hooks
const Component = () => {
  if (!data) {
    return <div>Loading...</div>; // Early return
  }

  const [state, setState] = useState(initialState); // Hook after return

  return <div>{content}</div>;
};
```

### 3. Proper Error Boundaries

Use error boundaries to prevent hook violations during error states:

```typescript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

## Troubleshooting

### Common Issues:

1. **Hook Violations During Navigation**

   - Check for conditional hook usage
   - Verify hook order consistency
   - Ensure proper cleanup in useEffect

2. **Performance Degradation**

   - Review useEffect dependencies
   - Check for memory leaks
   - Optimize re-renders with useMemo/useCallback

3. **Mobile-Specific Issues**
   - Test viewport changes
   - Verify touch event handling
   - Check performance mode triggers

### Debug Commands:

```bash
# Debug specific navigation
npm run test:hook-validation:debug -- --grep "navigation"

# Debug mobile issues
npm run test:hook-validation:mobile -- --headed

# Debug performance issues
npm run test:performance-hooks -- --headed
```

## Continuous Integration

### CI/CD Integration:

```yaml
# Add to your CI pipeline
- name: Run Hook Validation Tests
  run: npm run test:hook-validation
  env:
    HOOK_VALIDATION_MODE: true

- name: Upload Test Results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: hook-validation-results
    path: test-results/
```

### Pre-commit Hooks:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:hook-violations"
    }
  }
}
```

## Monitoring in Production

### Error Tracking:

```typescript
// Add to your error monitoring service
window.addEventListener('error', (event) => {
  if (event.error.message.includes('rendered more hooks')) {
    // Report hook violation to monitoring service
    errorMonitoring.reportError('HOOK_VIOLATION', event.error);
  }
});
```

### Performance Monitoring:

```typescript
// Track navigation performance
const trackNavigation = (from, to) => {
  const startTime = performance.now();

  // After navigation completes
  const endTime = performance.now();
  const duration = endTime - startTime;

  if (duration > 1000) {
    console.warn('Slow navigation detected:', from, to, duration);
  }
};
```

## Conclusion

This comprehensive hook validation system provides:

- **Early Detection** - Catches hook violations before production
- **Comprehensive Coverage** - Tests all navigation and interaction patterns
- **Performance Monitoring** - Ensures optimal application performance
- **Detailed Reporting** - Provides actionable insights for fixes
- **CI/CD Integration** - Automated validation in development pipeline

The system is designed to be both thorough and practical, providing the tools needed to maintain robust React hook usage throughout the application lifecycle.
