# Scroll Controller Implementation

This directory contains a comprehensive scroll controller system for managing navigation bar visibility based on scroll behavior. The implementation is performance-optimized and provides clean APIs for React integration.

## Features

✅ **Core Requirements Met:**

- Throttled requestAnimationFrame listener for optimal performance
- Hide navigation on 48px downward scroll with velocity > 0
- Reveal navigation on upward scroll
- Virtual keyboard awareness using visualViewport API
- Safe area padding synchronization
- Performance optimized (no scroll jank)
- Clean API for NavBar component integration

✅ **Additional Features:**

- Respects reduced motion preferences
- Cross-browser compatible
- TypeScript definitions included
- Memory management and cleanup
- Performance monitoring hooks
- Context-based global state management
- Debug overlay for development

## Architecture

```
src/navigation/
├── utils/
│   └── scroll-controller.ts       # Core ScrollController class
├── hooks/
│   └── useScrollController.ts     # React hooks for integration
├── context/
│   └── ScrollControllerContext.tsx # Global state management
├── examples/
│   └── ScrollControllerDemo.tsx   # Demonstration component
└── types/
    └── scroll-controller.d.ts     # TypeScript definitions
```

## Quick Start

### 1. Basic Hook Usage

```tsx
import { useNavigationVisibility } from '@/navigation';

const MyNavBar = () => {
  const { isVisible, transform, shouldAnimate } = useNavigationVisibility({
    hideThreshold: 48,
    showThreshold: 4,
    velocityThreshold: 0.1,
  });

  return (
    <nav
      className={shouldAnimate ? 'transition-transform duration-300' : ''}
      style={{ transform }}
    >
      {/* Navigation content */}
    </nav>
  );
};
```

### 2. Global Context Setup

```tsx
// App.tsx
import { ScrollControllerProvider } from '@/navigation';

function App() {
  return (
    <ScrollControllerProvider
      options={{
        hideThreshold: 48,
        velocityThreshold: 0.1,
        respectReducedMotion: true,
      }}
    >
      <YourApp />
    </ScrollControllerProvider>
  );
}

// Any component
import { useNavigationState, useScrollActions } from '@/navigation';

const NavBar = () => {
  const { isVisible, transform } = useNavigationState();
  const { showNavigation, hideNavigation } = useScrollActions();

  return <nav style={{ transform }}>{/* Navigation content */}</nav>;
};
```

### 3. Direct Controller Usage

```tsx
import { createScrollController } from '@/navigation';

// Create controller instance
const controller = createScrollController(
  {
    hideThreshold: 48,
    showThreshold: 4,
    velocityThreshold: 0.1,
  },
  {
    onVisibilityChange: (isVisible) => {
      console.log('Navigation visibility:', isVisible);
    },
  }
);

// Use controller methods
controller.setVisibility(false, true); // Force hide
controller.updateOptions({ hideThreshold: 60 });

// Cleanup when done
controller.destroy();
```

## Configuration Options

| Option                           | Type    | Default | Description                                       |
| -------------------------------- | ------- | ------- | ------------------------------------------------- |
| `hideThreshold`                  | number  | 48      | Scroll distance (px) before hiding navigation     |
| `showThreshold`                  | number  | 4       | Distance from top (px) to always show navigation  |
| `velocityThreshold`              | number  | 0.1     | Minimum scroll velocity (px/ms) to trigger hide   |
| `debounceMs`                     | number  | 150     | Debounce time for scroll state updates            |
| `respectReducedMotion`           | boolean | true    | Disable animations if user prefers reduced motion |
| `enableVirtualKeyboardDetection` | boolean | true    | Detect and handle virtual keyboards               |
| `enableSafeAreaDetection`        | boolean | true    | Handle safe area insets (iOS)                     |

## Performance Characteristics

- **60 FPS**: Maintains smooth 60fps performance during scroll
- **Memory Efficient**: Automatic cleanup and minimal memory footprint
- **Throttled Updates**: Uses requestAnimationFrame for optimal rendering
- **Reduced Motion**: Respects accessibility preferences
- **Cross-browser**: Compatible with all modern browsers

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 14+
- ✅ Edge 79+
- ✅ iOS Safari 14+
- ✅ Android Chrome 60+

### Visual Viewport API Support

- ✅ Chrome 61+
- ✅ Firefox 91+
- ✅ Safari 13+
- 🔄 Fallback implementation for older browsers

## Integration Examples

### Enhanced TopBar Component

The `TopBar` component has been enhanced to use the scroll controller:

```tsx
// src/navigation/components/TopBar.tsx
import { useNavigationState } from '../context/ScrollControllerContext';

const TopBar = () => {
  const navigationState = useNavigationState();

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        navigationState.shouldAnimate && 'transition-transform duration-300'
      )}
      style={{
        transform: navigationState.transform,
        paddingTop: `${navigationState.safeAreaTop}px`,
      }}
      aria-hidden={!navigationState.isVisible}
    >
      {/* Header content */}
    </header>
  );
};
```

### Virtual Keyboard Detection

```tsx
import { useVirtualKeyboard } from '@/navigation';

const MyComponent = () => {
  const { isVisible, height } = useVirtualKeyboard();

  return (
    <div
      style={{
        paddingBottom: isVisible ? `${height}px` : '0px',
      }}
    >
      {/* Content that adjusts for virtual keyboard */}
    </div>
  );
};
```

### Performance Monitoring

```tsx
import { useScrollPerformance } from '@/navigation';

const PerformanceMonitor = () => {
  const { fps, isSmooth, isOptimal } = useScrollPerformance();

  return (
    <div>
      <div>FPS: {fps}</div>
      <div>Smooth: {isSmooth ? 'Yes' : 'No'}</div>
      <div>Optimal: {isOptimal ? 'Yes' : 'No'}</div>
    </div>
  );
};
```

## Development & Debugging

Enable the debug overlay in development:

```tsx
import { ScrollControllerDebugger } from '@/navigation';

// Add to your app during development
<ScrollControllerDebugger
  enabled={process.env.NODE_ENV === 'development'}
  position="top-right"
/>;
```

## Testing

The scroll controller includes comprehensive test coverage:

```bash
# Run scroll controller tests
npm test -- src/navigation/__tests__/scroll-controller.test.ts

# Run performance tests
npm test -- src/navigation/__tests__/scroll-performance.test.ts
```

## API Reference

### Core Classes

- `ScrollController` - Main controller class
- `UseScrollControllerOptions` - Configuration interface
- `ScrollState` - Current scroll state data
- `NavigationVisibilityState` - Navigation visibility data

### React Hooks

- `useScrollController()` - Full scroll controller integration
- `useNavigationVisibility()` - Simple navigation visibility
- `useVirtualKeyboard()` - Virtual keyboard detection
- `useScrollPerformance()` - Performance monitoring

### Context Providers

- `ScrollControllerProvider` - Global state provider
- `useScrollControllerContext()` - Access global state
- `useNavigationState()` - Navigation state only
- `useScrollActions()` - Navigation control actions

### Utility Functions

- `createScrollController()` - Create controller instance
- `getNavigationTransform()` - Calculate transform values
- `detectVirtualKeyboard()` - Check virtual keyboard state

## Migration Guide

If migrating from the existing `useMenuBarReveal` hook:

```tsx
// Old approach
import { useMenuBarReveal } from '@/hooks/useMenuBarReveal';
const { visible, translateY } = useMenuBarReveal();

// New approach
import { useNavigationVisibility } from '@/navigation';
const { isVisible, transform } = useNavigationVisibility();
```

## Contributing

When contributing to the scroll controller:

1. Maintain 60fps performance
2. Add TypeScript definitions for new features
3. Include comprehensive tests
4. Update documentation
5. Test across different devices and browsers
6. Ensure accessibility compliance
