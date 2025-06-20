# iOS 26-Style Bottom Navigation Bar Design Specification

## Overview

A pixel-perfect, web-native implementation of iOS 26 Human Interface Guidelines bottom navigation bar with Liquid Glass aesthetics, responsive behavior, and comprehensive accessibility support.

## Core Design Principles

- **100% Web-Native**: No native APIs, works in all modern browsers
- **Liquid Glass Aesthetic**: Translucent materials with depth and blur
- **Universal Safe Areas**: Respects device insets on all platforms
- **Performance First**: CSS transforms for 60fps animations
- **Accessibility First**: WCAG 2.1 AA compliant

## Dimensions & Layout

### Base Heights

- **Portrait Mode**: 68px (excluding safe area)
- **Landscape Mode**: 56px (excluding safe area)
- **Side Rail (≥960px)**: Transforms to vertical rail, 80px width
- **Hit Target**: Minimum 44px × 44px (WCAG 2.5.5)

### Safe Area Handling

```css
/* Bottom inset for home indicator */
padding-bottom: env(safe-area-inset-bottom, 0);

/* Fallback for non-iOS browsers */
padding-bottom: max(env(safe-area-inset-bottom, 0), 16px);
```

### Responsive Breakpoints

- **Mobile**: < 640px (bottom bar)
- **Tablet**: 640px - 959px (bottom bar with larger targets)
- **Desktop**: ≥ 960px (side rail or hidden)

## Visual Design

### Liquid Glass Effect

```css
.liquid-glass-nav {
  /* Primary glass effect */
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);

  /* Translucent background */
  background-color: rgba(255, 255, 255, 0.1);

  /* Subtle border */
  border-top: 1px solid rgba(255, 255, 255, 0.2);

  /* Depth shadow */
  box-shadow:
    0 -1px 3px rgba(0, 0, 0, 0.05),
    0 -1px 2px rgba(0, 0, 0, 0.04);
}

/* Reduced transparency fallback */
@media (prefers-reduced-transparency: reduce) {
  .liquid-glass-nav {
    backdrop-filter: none;
    background-color: rgba(0, 0, 0, 0.95);
  }
}
```

### Color Tokens

```typescript
const colorTokens = {
  // Glass surfaces
  glassBackground: 'rgba(255, 255, 255, 0.1)',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
  glassActiveBackground: 'rgba(255, 255, 255, 0.15)',

  // Text & Icons
  textPrimary: 'rgba(255, 255, 255, 1)',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textDisabled: 'rgba(255, 255, 255, 0.3)',

  // Accent colors
  accentBlue: '#007AFF',
  accentRed: '#FF3B30',

  // Dark mode (default)
  darkBackground: '#000000',
  darkSurface: '#1C1C1E',
};
```

## Scroll Behavior

### Hide/Reveal Logic

```typescript
interface ScrollConfig {
  hideThreshold: 48; // px - minimum scroll distance
  hideVelocity: 0.5; // px/ms - minimum velocity to trigger hide
  showVelocity: -0.3; // px/ms - minimum velocity to trigger show
  debounce: 16; // ms - ~60fps
  alwaysShowTop: 100; // px - always visible near top
}
```

### Animation Timing

- **Hide Animation**: 300ms ease-out
- **Show Animation**: 250ms ease-out
- **Transform**: translateY() for GPU acceleration
- **Will-change**: transform (during scroll only)

## Component States

### Tab States

1. **Default**: 70% opacity, no background
2. **Hover**: 90% opacity, 5% white background
3. **Active**: 100% opacity, 10% white background, scale(1.05)
4. **Pressed**: scale(0.95) transform
5. **Disabled**: 30% opacity, no interactions

### Focus States

- **Keyboard Focus**: 2px blue ring with 4px offset
- **Tab Order**: Left to right, then FAB
- **Skip Links**: Hidden but focusable

## Floating Action Button (FAB)

### Positioning

- **Bottom Nav**: Detached 24px above nav
- **Side Rail**: Bottom right corner
- **Size**: 56px diameter
- **Shadow**: 0 4px 12px rgba(0, 0, 0, 0.15)

### Variants

1. **Primary**: Solid color with shadow
2. **Secondary**: Glass effect matching nav

## Tab Configuration

### Layout Rules

- **Maximum Tabs**: 5 (mobile), 7 (tablet)
- **Minimum Width**: 64px per tab
- **Icon Size**: 24px × 24px
- **Label Font**: System font, 10px (mobile), 12px (tablet)
- **Spacing**: 4px between icon and label

### Badge System

- **Position**: Top-right of icon (-4px, -4px)
- **Size**: 16px diameter minimum
- **Font**: 10px bold
- **Max Count**: "99+" for values > 99

## Accessibility Requirements

### ARIA Attributes

```html
<nav role="navigation" aria-label="Main navigation">
  <div role="tablist" aria-orientation="horizontal">
    <button
      role="tab"
      aria-selected="true"
      aria-controls="panel-id"
      aria-label="Home"
      tabindex="0"
    >
      <!-- Tab content -->
    </button>
  </div>
</nav>
```

### Keyboard Navigation

- **Tab**: Navigate between tabs
- **Arrow Keys**: Move focus within tablist
- **Enter/Space**: Activate focused tab
- **Escape**: Close any open menus
- **Alt+N**: Focus navigation (custom shortcut)

### Screen Reader Support

- Announce navigation changes
- Provide context for badges
- Include usage instructions
- Support landmark navigation

## Platform Optimizations

### iOS Safari

- Respect safe areas
- Handle viewport-fit=cover
- Support standalone mode
- Optimize for notch/Dynamic Island

### Android Chrome

- Handle gesture navigation
- Support immersive mode
- Optimize for various aspect ratios

### Desktop PWA

- Transform to side rail
- Support keyboard shortcuts
- Hover states for mouse
- Larger hit targets

## Performance Targets

### Core Web Vitals

- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1
- **Animation FPS**: 60fps

### Bundle Size

- **CSS**: < 5KB (minified + gzipped)
- **JavaScript**: < 10KB (minified + gzipped)
- **Total Impact**: < 15KB

## Testing Matrix

### Devices

1. iPhone 15 Pro (Dynamic Island)
2. iPhone SE (Classic layout)
3. iPad Pro (Stage Manager)
4. Pixel 7 (Android 13)
5. Desktop Chrome/Safari/Firefox

### Scenarios

- Portrait/Landscape orientation
- Virtual keyboard open/closed
- Scroll up/down patterns
- Multi-tab navigation
- Accessibility tools enabled

## Implementation Checklist

- [ ] Design tokens defined
- [ ] Base component structure
- [ ] Liquid Glass styles
- [ ] Scroll controller
- [ ] Safe area handling
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] Touch gestures
- [ ] Animation performance
- [ ] Cross-browser testing
- [ ] Documentation
- [ ] Example usage

---

**Version**: 1.0  
**Created**: 2025-06-20  
**Author**: iOS 26 Design System  
**Review**: Required before implementation

This specification provides complete guidance for implementing an iOS 26-style bottom navigation bar that is web-native compatible, accessible, and performant across all modern browsers and devices.
