# 🛡️ Viewport Guardian

**Cross-browser safe area support and viewport utilities for modern web applications**

Viewport Guardian provides comprehensive viewport management with polyfills and utilities for cross-browser safe area support, virtual keyboard detection, orientation handling, and responsive design.

## Features

- ✅ **Safe Area Insets Polyfill** - Works on iOS, Android, and desktop browsers
- ✅ **Visual Viewport API Integration** - Real-time viewport dimension tracking
- ✅ **Virtual Keyboard Detection** - Automatic detection and handling of on-screen keyboards
- ✅ **Orientation Change Resilience** - Robust orientation change detection with fallbacks
- ✅ **Feature Detection** - Comprehensive browser capability detection
- ✅ **React Hooks** - Performance-optimized hooks for React components
- ✅ **CSS Utilities** - Ready-to-use CSS classes for viewport-aware styling
- ✅ **Cross-browser Support** - Chrome, Safari, Firefox, Edge compatibility

## Quick Start

### 1. Automatic Initialization (Recommended)

The Viewport Guardian automatically initializes when your React app starts:

```tsx
// App.tsx
import { initializeForReactApp } from '@/shared/utils/viewport-init';

function App() {
  useEffect(() => {
    initializeForReactApp(); // This is already set up!
  }, []);

  return <YourApp />;
}
```

### 2. Using React Hooks

```tsx
import { useViewport, useSafeArea, useVirtualKeyboard } from '@/shared/hooks';

function MyComponent() {
  const viewport = useViewport();
  const safeArea = useSafeArea();
  const keyboard = useVirtualKeyboard();

  return (
    <div className="safe-all">
      <p>Viewport: {viewport.width}x{viewport.height}</p>
      <p>Safe Area Top: {safeArea.top}px</p>
      <p>Keyboard: {keyboard.isOpen ? 'Open' : 'Closed'}</p>
    </div>
  );
}
```

### 3. Using CSS Utilities

```tsx
function SafeAreaDemo() {
  return (
    <div className="h-screen-safe safe-all">
      {/* Full height with safe areas */}
      <header className="top-nav-safe">
        {/* Top navigation with safe area support */}
      </header>
      
      <main className="keyboard-aware">
        {/* Content that adjusts for virtual keyboard */}
      </main>
      
      <footer className="bottom-nav-safe">
        {/* Bottom navigation with safe area support */}
      </footer>
    </div>
  );
}
```

## React Hooks API

### `useViewport()`

Complete viewport state management:

```tsx
const viewport = useViewport();

// Available properties:
viewport.width          // Current viewport width
viewport.height         // Current viewport height
viewport.safeArea       // Safe area insets
viewport.orientation    // Orientation information
viewport.isKeyboardOpen // Virtual keyboard status
viewport.isMobile       // Device type detection
viewport.capabilities   // Browser capabilities
```

### `useSafeArea()`

Safe area insets with automatic polyfills:

```tsx
const safeArea = useSafeArea();

// Available properties:
safeArea.top    // Top safe area inset (px)
safeArea.right  // Right safe area inset (px)
safeArea.bottom // Bottom safe area inset (px)
safeArea.left   // Left safe area inset (px)
```

### `useVirtualKeyboard()`

Virtual keyboard detection:

```tsx
const keyboard = useVirtualKeyboard();

// Available properties:
keyboard.isOpen  // Boolean: is virtual keyboard open
keyboard.height  // Number: keyboard height in pixels
```

### `useOrientation()`

Orientation change handling:

```tsx
const orientation = useOrientation();

// Available properties:
orientation.type        // 'portrait' | 'landscape'
orientation.angle       // 0 | 90 | 180 | 270
orientation.isLocked    // Boolean: is orientation locked
orientation.isPrimary   // Boolean: is natural orientation
orientation.isPortrait  // Boolean convenience property
orientation.isLandscape // Boolean convenience property
```

### `useResponsiveBreakpoint()`

Responsive breakpoint detection:

```tsx
const breakpoint = useResponsiveBreakpoint();

// Available properties:
breakpoint.breakpoint // 'mobile' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
breakpoint.isMobile   // Boolean
breakpoint.isTablet   // Boolean
breakpoint.isDesktop  // Boolean
breakpoint.width      // Current width
```

## CSS Utilities

### Safe Area Classes

```css
/* Padding utilities */
.safe-top     /* padding-top: env(safe-area-inset-top) */
.safe-bottom  /* padding-bottom: env(safe-area-inset-bottom) */
.safe-left    /* padding-left: env(safe-area-inset-left) */
.safe-right   /* padding-right: env(safe-area-inset-right) */
.safe-all     /* All safe area padding */

/* Margin utilities */
.safe-m-top    /* margin-top: env(safe-area-inset-top) */
.safe-m-bottom /* margin-bottom: env(safe-area-inset-bottom) */
/* ... etc */
```

### Viewport Height Classes

```css
.h-screen-safe   /* Full height minus safe areas */
.h-screen-large  /* Large viewport height (100lvh) */
.h-screen-small  /* Small viewport height (100svh) */
```

### Virtual Keyboard Classes

```css
.keyboard-aware         /* Adjusts padding for keyboard */
.hide-on-keyboard      /* Hides when keyboard is open */
.show-on-keyboard      /* Shows only when keyboard is open */
```

### Navigation Classes

```css
.bottom-nav-safe  /* Bottom nav with safe area */
.top-nav-safe     /* Top nav with safe area */
.content-with-nav /* Content area with nav spacing */
```

### Glass Effect Classes

```css
.glass-effect          /* Cross-browser glass effect */
.glass-effect-enhanced /* Enhanced glass with modern features */
```

## Browser Support

| Feature | Chrome | Safari | Firefox | Edge | iOS Safari | Android |
|---------|---------|---------|---------|------|------------|---------|
| Safe Area Polyfills | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Visual Viewport API | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Virtual Keyboard Detection | ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ |
| Orientation API | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Modern CSS Units (dvh) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

✅ Full Support • ⚠️ Partial Support • ❌ Polyfilled

## Advanced Usage

### Manual Initialization

```tsx
import { initializeViewportGuardianCustom } from '@/shared/utils/viewport-init';

// Custom initialization
initializeViewportGuardianCustom({
  debug: true,                 // Enable debug logging
  applyCSSClasses: true,       // Apply feature detection CSS classes
  setupDynamicUpdates: true,   // Enable real-time class updates
});
```

### Feature Detection

```tsx
import { getFeatureSupport, getBrowserInfo } from '@/shared/utils/viewport-guardian';

const features = getFeatureSupport();
const browser = getBrowserInfo();

if (features.cssEnvSupport) {
  // Native safe area support available
} else {
  // Using polyfills
}

if (browser.supportsModernCSS) {
  // Can use modern CSS features
}
```

### Debug Information

```tsx
import { getViewportDebugInfo } from '@/shared/utils/viewport-guardian';

// Get comprehensive debug info
const debugInfo = getViewportDebugInfo();
console.log('Viewport Debug:', debugInfo);

// In development, use keyboard shortcut: Ctrl/Cmd + Shift + V
// Or call: window.viewportDebug()
```

### Custom CSS Properties

The system automatically sets these CSS custom properties:

```css
:root {
  --safe-area-inset-top: 44px;
  --safe-area-inset-bottom: 34px;
  --safe-area-inset-left: 0px;
  --safe-area-inset-right: 0px;
  --viewport-width: 390px;
  --viewport-height: 844px;
  --keyboard-height: 0px;
  --keyboard-open: 0;
}
```

### Event Listeners

```tsx
import { 
  addViewportChangeListener, 
  addOrientationChangeListener 
} from '@/shared/utils/viewport-guardian';

// Listen for viewport changes
const removeViewportListener = addViewportChangeListener((event) => {
  console.log('Viewport changed:', event.state);
});

// Listen for orientation changes
const removeOrientationListener = addOrientationChangeListener((event) => {
  console.log('Orientation changed:', event.current.type);
});

// Clean up listeners
removeViewportListener();
removeOrientationListener();
```

## Performance Considerations

- **Debounced Updates**: All viewport change events are debounced for performance
- **RequestAnimationFrame**: Dimension updates use RAF for smooth rendering
- **Cached Feature Detection**: Feature tests are cached to avoid repeated DOM queries
- **Memory Management**: Automatic cleanup of event listeners and timers

## Troubleshooting

### Safe Areas Not Working

1. Ensure you're using `env()` with fallbacks:
   ```css
   padding-top: env(safe-area-inset-top, var(--safe-area-inset-top, 0px));
   ```

2. Check if polyfills are initialized:
   ```tsx
   import { getInitializationStatus } from '@/shared/utils/viewport-init';
   console.log(getInitializationStatus());
   ```

### Virtual Keyboard Not Detected

1. Ensure you're on a mobile device or using device emulation
2. Check Visual Viewport API support:
   ```tsx
   const features = getFeatureSupport();
   console.log('Visual Viewport API:', features.visualViewportAPI);
   ```

### Orientation Changes Not Working

1. Test with actual device rotation (not just browser resize)
2. Check orientation API support:
   ```tsx
   const features = getFeatureSupport();
   console.log('Screen Orientation API:', features.screenOrientationAPI);
   ```

## Demo Component

A complete demo component is available at:
`src/components/viewport/ViewportGuardianDemo.tsx`

This shows real-time viewport information and demonstrates all features.

## Migration from Existing Code

Replace existing safe area implementations:

```css
/* Old */
padding-top: env(safe-area-inset-top, 44px);

/* New */
@import 'viewport-guardian.css';
/* Use classes: */
<div className="safe-top">
```

Replace manual viewport detection:

```tsx
// Old
const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

// New
const { isMobile } = useDeviceType();
```

## License

This Viewport Guardian system is part of the Liquid Spark Finance application and follows the same licensing terms.