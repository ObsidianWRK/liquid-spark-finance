# iOS 26-Style Bottom Navigation Bar Design Specification

## Overview

This specification defines the iOS 26-style bottom navigation bar for the Liquid Spark Finance web application. The design follows Apple's iOS 26 Human Interface Guidelines while maintaining web-native compatibility and accessibility standards.

## 1. Dimensions & Layout

### 1.1 Height Specifications

| Orientation | Height | Use Case |
|-------------|--------|----------|
| **Portrait** | 68px | Standard mobile portrait mode |
| **Landscape** | 56px | Mobile landscape mode |
| **Side-rail** | Variable | Desktop/tablet ≥960px width |

### 1.2 Responsive Breakpoints

```typescript
// Navigation Layout Breakpoints
const navigationBreakpoints = {
  bottomNav: '(max-width: 959px)',           // Mobile bottom navigation
  sideRail: '(min-width: 960px)',            // Desktop side rail
  compactLandscape: '(max-height: 500px)',   // Landscape detection
  safeArea: 'env(safe-area-inset-bottom)'    // iOS safe area
};
```

### 1.3 Safe Area Handling

```css
.navigation-bottom {
  padding-bottom: max(env(safe-area-inset-bottom), 8px);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

## 2. Visual States

### 2.1 Navigation Item States

#### Default State
```css
.nav-item-default {
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  transform: scale(1);
  opacity: 1;
}
```

#### Pressed State
```css
.nav-item-pressed {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
  transform: scale(0.95);
  transition: all 150ms cubic-bezier(0.4, 0.0, 0.2, 1.0);
}
```

#### Selected State
```css
.nav-item-selected {
  background: rgba(255, 255, 255, 0.12);
  color: #FFFFFF;
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.nav-item-selected .nav-icon {
  transform: scale(1.1);
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}
```

#### Disabled State
```css
.nav-item-disabled {
  background: transparent;
  color: rgba(255, 255, 255, 0.3);
  pointer-events: none;
  opacity: 0.5;
}
```

## 3. Liquid Glass Effect

### 3.1 Color Tokens

```typescript
// Liquid Glass Background System
const liquidGlassTokens = {
  background: {
    primary: 'rgba(0, 0, 0, 0.42)',           // Main nav background
    secondary: 'rgba(0, 0, 0, 0.32)',         // Hover state
    tertiary: 'rgba(0, 0, 0, 0.28)',          // Pressed state
  },
  
  highlight: {
    primary: 'rgba(255, 255, 255, 0.55)',     // Main highlight
    secondary: 'rgba(255, 255, 255, 0.35)',   // Subtle highlight
    accent: 'rgba(255, 255, 255, 0.25)',      // Border highlight
  },
  
  border: {
    top: 'rgba(255, 255, 255, 0.2)',          // Top border
    item: 'rgba(255, 255, 255, 0.08)',        // Item borders
  },
  
  backdrop: {
    blur: 'blur(24px)',                       // Backdrop blur
    saturate: 'saturate(180%)',               // Color saturation
    contrast: 'contrast(120%)',               // Contrast enhancement
  }
};
```

### 3.2 Backdrop Filter Implementation

```css
.liquid-glass-nav {
  background: rgba(0, 0, 0, 0.42);
  backdrop-filter: blur(24px) saturate(180%) contrast(120%);
  -webkit-backdrop-filter: blur(24px) saturate(180%) contrast(120%);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  
  /* Fallback for unsupported browsers */
  @supports not (backdrop-filter: blur(24px)) {
    background: rgba(0, 0, 0, 0.85);
  }
}
```

## 4. Typography Specifications

### 4.1 Font System

```typescript
const navigationTypography = {
  fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
  
  label: {
    fontSize: '12px',        // 0.75rem
    fontWeight: 500,         // Medium
    lineHeight: 1.2,         // Tight
    letterSpacing: '0.01em', // Slight tracking
  },
  
  badge: {
    fontSize: '10px',        // 0.625rem
    fontWeight: 600,         // Semibold
    lineHeight: 1.0,         // None
  }
};
```

### 4.2 Text Rendering

```css
.nav-label {
  font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: 0.01em;
  text-align: center;
  
  /* Optimize text rendering */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
```

## 5. Touch Targets & Accessibility

### 5.1 Touch Target Specifications

```typescript
const touchTargets = {
  minimum: {
    width: 44,    // WCAG 2.5.5 minimum
    height: 44,   // WCAG 2.5.5 minimum
  },
  
  recommended: {
    width: 56,    // iOS comfortable touch
    height: 56,   // iOS comfortable touch
  },
  
  padding: {
    horizontal: 12,  // Internal padding
    vertical: 8,     // Internal padding
  }
};
```

### 5.2 ARIA Implementation

```html
<nav 
  role="navigation" 
  aria-label="Bottom navigation"
  class="navigation-bottom"
>
  <button
    role="tab"
    aria-selected="true"
    aria-label="Navigate to Dashboard"
    aria-current="page"
    class="nav-item nav-item-selected"
  >
    <IconComponent aria-hidden="true" />
    <span class="nav-label">Dashboard</span>
  </button>
</nav>
```

### 5.3 Keyboard Navigation

```css
.nav-item:focus-visible {
  outline: 2px solid #007AFF;
  outline-offset: 2px;
  border-radius: 12px;
}

.nav-item:focus-visible:not(:focus) {
  outline: none;
}
```

## 6. Motion & Animation Specifications

### 6.1 Animation Tokens

```typescript
const animationTokens = {
  duration: {
    fast: '150ms',      // Quick interactions
    standard: '250ms',  // Standard transitions
    slow: '400ms',      // Complex animations
  },
  
  easing: {
    standard: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',  // Standard ease
    ios: 'cubic-bezier(0.4, 0.0, 0.2, 1.0)',          // iOS-style ease
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',  // Bounce effect
  },
  
  transform: {
    scale: {
      pressed: 'scale(0.95)',
      selected: 'scale(1.05)',
      icon: 'scale(1.1)',
    }
  }
};
```

### 6.2 Transition Implementation

```css
.nav-item {
  transition-property: transform, background-color, color, box-shadow;
  transition-duration: 250ms;
  transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1.0);
  will-change: transform;
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .nav-item {
    transition: none;
    animation: none;
  }
}
```

### 6.3 Ripple Effect

```css
@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 0.6;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

.nav-item::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%) scale(0);
  animation: ripple 600ms ease-out;
}
```

## 7. Responsive Behavior

### 7.1 Orientation Changes

```typescript
const orientationRules = {
  portrait: {
    height: '68px',
    iconSize: '20px',
    labelDisplay: 'block',
    maxItems: 5,
  },
  
  landscape: {
    height: '56px',
    iconSize: '18px',
    labelDisplay: 'none', // Hide labels in landscape
    maxItems: 6,
  },
  
  sideRail: {
    width: '280px',
    height: '100vh',
    iconSize: '24px',
    labelDisplay: 'block',
    maxItems: 8,
  }
};
```

### 7.2 Breakpoint Transitions

```css
/* Mobile Portrait */
@media (max-width: 959px) and (orientation: portrait) {
  .navigation-bottom {
    height: 68px;
    bottom: 0;
    left: 0;
    right: 0;
  }
  
  .nav-item {
    min-width: 56px;
    min-height: 56px;
  }
  
  .nav-label {
    display: block;
  }
}

/* Mobile Landscape */
@media (max-width: 959px) and (orientation: landscape) {
  .navigation-bottom {
    height: 56px;
  }
  
  .nav-label {
    display: none;
  }
  
  .nav-icon {
    font-size: 18px;
  }
}

/* Desktop/Tablet Side Rail */
@media (min-width: 960px) {
  .navigation-bottom {
    display: none;
  }
  
  .navigation-rail {
    display: flex;
    flex-direction: column;
    width: 280px;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
  }
}
```

## 8. Badge & Notification System

### 8.1 Badge Specifications

```css
.nav-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  min-width: 16px;
  height: 16px;
  background: #FF453A;
  color: white;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  
  /* Ensure badge is visible */
  z-index: 10;
}

.nav-badge:empty {
  width: 8px;
  height: 8px;
  min-width: 8px;
  padding: 0;
}
```

## 9. Performance Considerations

### 9.1 Hardware Acceleration

```css
.navigation-bottom {
  /* Enable hardware acceleration */
  transform: translateZ(0);
  will-change: transform;
}

.nav-item {
  /* Optimize animations */
  transform: translateZ(0);
  will-change: transform, background-color;
}
```

### 9.2 Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  .navigation-bottom,
  .nav-item {
    animation: none !important;
    transition: none !important;
  }
  
  .nav-item:hover,
  .nav-item:focus {
    transform: none !important;
  }
}
```

## 10. Implementation Checklist

### 10.1 Core Requirements

- [ ] Implement 68px portrait / 56px landscape heights
- [ ] Add proper safe area handling
- [ ] Implement liquid glass backdrop effect
- [ ] Add all four visual states (default, pressed, selected, disabled)
- [ ] Ensure 44px minimum touch targets
- [ ] Add proper ARIA labels and roles
- [ ] Implement keyboard navigation
- [ ] Add reduced motion support

### 10.2 Enhanced Features

- [ ] Implement ripple animation on tap
- [ ] Add badge notification system
- [ ] Implement smooth orientation transitions
- [ ] Add haptic feedback simulation
- [ ] Implement side rail for desktop
- [ ] Add high contrast mode support
- [ ] Implement proper focus management

### 10.3 Testing Requirements

- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Test landscape/portrait transitions
- [ ] Test keyboard navigation
- [ ] Test with screen readers
- [ ] Test with reduced motion
- [ ] Test with high contrast mode
- [ ] Test safe area handling on notched devices

## 11. Browser Compatibility

### 11.1 Supported Browsers

- **iOS Safari**: 14.0+ (full support)
- **Chrome**: 90+ (full support)
- **Firefox**: 88+ (full support)
- **Edge**: 90+ (full support)
- **Samsung Internet**: 14.0+ (full support)

### 11.2 Fallback Behavior

```css
/* Backdrop filter fallback */
@supports not (backdrop-filter: blur(24px)) {
  .liquid-glass-nav {
    background: rgba(0, 0, 0, 0.85);
  }
}

/* Safe area fallback */
@supports not (padding: env(safe-area-inset-bottom)) {
  .navigation-bottom {
    padding-bottom: 8px;
  }
}
```

## 12. Design Tokens Export

```typescript
export const bottomNavigationTokens = {
  dimensions: {
    height: {
      portrait: '68px',
      landscape: '56px',
    },
    touchTarget: {
      minimum: '44px',
      recommended: '56px',
    },
  },
  
  colors: {
    background: 'rgba(0, 0, 0, 0.42)',
    highlight: 'rgba(255, 255, 255, 0.55)',
    border: 'rgba(255, 255, 255, 0.2)',
    text: {
      default: 'rgba(255, 255, 255, 0.7)',
      selected: '#FFFFFF',
      disabled: 'rgba(255, 255, 255, 0.3)',
    },
  },
  
  effects: {
    backdropBlur: 'blur(24px)',
    backdropSaturate: 'saturate(180%)',
    backdropContrast: 'contrast(120%)',
  },
  
  animation: {
    duration: '250ms',
    easing: 'cubic-bezier(0.4, 0.0, 0.2, 1.0)',
  },
  
  typography: {
    fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: 1.2,
  },
} as const;
```

---

**Version**: 1.0  
**Created**: 2025-06-20  
**Author**: iOS 26 Design System  
**Review**: Required before implementation  

This specification provides complete guidance for implementing an iOS 26-style bottom navigation bar that is web-native compatible, accessible, and performant across all modern browsers and devices.