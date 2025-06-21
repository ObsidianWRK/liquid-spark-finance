# Vueni Adaptive Navigation System

## Overview

The Vueni Adaptive Navigation System provides a seamless, responsive navigation experience that automatically adapts to different viewport sizes:

- **Mobile** (<640px): Bottom navigation bar with glass-blur backdrop
- **Tablet** (640px-1024px): Collapsible navigation rail
- **Desktop** (≥1024px): Sidebar layout

## Architecture

```
src/navigation/
├── components/
│   ├── AdaptiveNavigation.tsx    # Main wrapper component
│   ├── BottomNav.tsx            # Mobile bottom navigation
│   ├── NavRail.tsx              # Tablet navigation rail
│   ├── Sidebar.tsx              # Desktop sidebar
│   └── MotionWrapper.tsx        # Animation wrapper
├── routeConfig.ts               # Canonical route definitions
└── index.ts                     # Exports
```

## Usage

### Basic Implementation

```tsx
import { AdaptiveNavigation } from '@/navigation';

function App() {
  return (
    <div className="app">
      <AdaptiveNavigation />
      <main>{/* Your app content */}</main>
    </div>
  );
}
```

### Using Individual Components

```tsx
import {
  BottomNav,
  NavRail,
  Sidebar,
  useBreakpoint,
} from '@/navigation';

function CustomNavigation() {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  return (
    <>
      {isMobile && <BottomNav />}
      {isTablet && <NavRail />}
      {isDesktop && (
        <>
          <Sidebar />
        </>
      )}
    </>
  );
}
```

## Route Configuration

Routes are defined in `src/navigation/routeConfig.ts`:

```typescript
export const mainRoutes: Route[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: Home,
  },
  {
    id: 'transactions',
    label: 'Transactions',
    path: '/transactions',
    icon: Receipt,
    badgeKey: 'unread_transactions', // Optional badge
  },
  {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: BarChart3,
    hideInBottomNav: true, // Exclude from mobile nav
  },
];
```

### Route → Breakpoint Behavior Matrix

| Route ID | Label | Mobile (<768px) | Tablet (768-1023px) | Desktop (≥1024px) | Badge Support |
|----------|-------|------------------|---------------------|-------------------|---------------|
| `dashboard` | Dashboard | ✅ Bottom Nav | ✅ Nav Rail | ✅ Sidebar | ❌ |
| `accounts` | Accounts | ✅ Bottom Nav | ✅ Nav Rail | ✅ Sidebar | ❌ |
| `transactions` | Transactions | ✅ Bottom Nav | ✅ Nav Rail | ✅ Sidebar | ❌ |
| `insights` | Insights | ✅ Bottom Nav | ✅ Nav Rail | ✅ Sidebar | ❌ |
| `calculators` | Calculators | ❌ Hidden | ✅ Nav Rail | ✅ Sidebar | ❌ |
| `budget-planner` | Budget Planner | ❌ Hidden | ✅ Nav Rail | ✅ Sidebar | ❌ |
| `investment-tracker` | Investment Tracker | ❌ Hidden | ✅ Nav Rail | ✅ Sidebar | ❌ |
| `credit` | Credit Score | ❌ Hidden | ✅ Nav Rail | ✅ Sidebar | ❌ |
| `savings` | Savings Goals | ❌ Hidden | ✅ Nav Rail | ✅ Sidebar | ❌ |
| `reports` | Reports | ❌ Hidden | ✅ Nav Rail | ✅ Sidebar | ❌ |
| `profile` | Profile | ❌ Hidden | ❌ Hidden | ✅ Sidebar | ❌ |
| `settings` | Settings | ❌ Hidden | ❌ Hidden | ✅ Sidebar | ❌ |

**Navigation Strategy:**
- **Mobile**: Limited to 4 primary routes (Dashboard, Accounts, Transactions, Insights) to maintain touch-friendly spacing
- **Tablet**: Nav rail expands on hover to show all main routes and their labels
- **Desktop**: Sidebar shows all routes with full labels and supports keyboard navigation

### Route Properties

| Property           | Type         | Description                 |
| ------------------ | ------------ | --------------------------- |
| `id`               | `string`     | Unique identifier           |
| `label`            | `string`     | Display label               |
| `path`             | `string`     | React Router path           |
| `icon`             | `LucideIcon` | Lucide React icon component |
| `badgeKey?`        | `string`     | Optional badge identifier   |
| `hideInBottomNav?` | `boolean`    | Hide from mobile navigation |

## Breakpoint System

The navigation uses the unified breakpoint system from `@/theme/breakpoints`:

```typescript
const breakpoints = {
  mobile: { max: 767 }, // Phones
  tablet: { min: 768, max: 1023 }, // Tablets
  desktop: { min: 1024, max: 1439 }, // Desktop
  large: { min: 1440, max: 1919 }, // Large desktop
  ultrawide: { min: 1920 }, // Ultra-wide
};
```

### useBreakpoint Hook

```typescript
import { useBreakpoint } from '@/navigation';

function MyComponent() {
  const { breakpoint, isMobile, isTablet, isDesktop } = useBreakpoint();

  return (
    <div>
      Current breakpoint: {breakpoint}
      {isMobile && <MobileComponent />}
      {isTablet && <TabletComponent />}
      {isDesktop && <DesktopComponent />}
    </div>
  );
}
```

## Navigation Variants

### Mobile Navigation (BottomNav)

**Features:**

- Fixed bottom positioning with safe-area insets
- Glass-blur backdrop effect
- Maximum 5 navigation items
- Touch-optimized 56px minimum targets
- Icon + label layout

**CSS Classes:**

```css
.liquid-glass-nav {
  backdrop-filter: blur(12px);
  background: rgba(0, 0, 0, 0.42);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}
```

### Tablet Navigation (NavRail)

**Features:**

- Left-edge navigation rail
- Collapses to 80px (icons only)
- Expands to 256px on hover/long-press
- Smooth animations with spring physics
- Badge support

**Interaction:**

- **Hover**: Expands rail to show labels
- **Long Press** (touch): 500ms hold to expand
- **Focus**: Keyboard accessible

### Desktop Navigation (Sidebar Layout)

**Features:**

- **Sidebar**: 288px wide, permanently visible
- Grouped navigation sections
- Scrollable content area
- Professional layout

**Layout:**

```css
.sidebar {
  width: 18rem; /* 288px */
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
}

```

## Animations

The system uses Framer Motion for smooth transitions:

```typescript
// Animation variants
const variants = {
  bottom: { y: [100, 0], opacity: [0, 1] },
  rail: { x: [-80, 0], opacity: [0, 1] },
  sidebar: { x: [-288, 0], opacity: [0, 1] },
};
```

**Motion Preferences:**

- Respects `prefers-reduced-motion`
- Spring physics for natural feel
- Optimized for 60fps performance

## Accessibility

### ARIA Labels

```tsx
<nav role="navigation" aria-label="Bottom navigation">
  <button aria-label="Navigate to Dashboard" aria-current="page">
    Dashboard
  </button>
</nav>
```

### Keyboard Navigation

- Tab order follows logical sequence
- Enter/Space activates navigation items
- Escape closes expanded states
- Focus indicators clearly visible

### Touch Targets

- Minimum 44x44px (WCAG 2.5.5)
- Comfortable 56px on mobile
- Touch-manipulation CSS for responsiveness

## Testing

### Unit Tests

```bash
npm test -- navigation
```

### E2E Tests

```bash
npm run test:e2e -- adaptive-navigation.spec.ts
```

**Test Coverage:**

- ✅ Breakpoint detection
- ✅ Component rendering
- ✅ Navigation interactions
- ✅ Viewport transitions
- ✅ Accessibility compliance
- ✅ Touch target sizes

## Migration Guide


### From Navigation.tsx

**Before:**

```tsx
import Navigation from '@/components/Navigation';

<Navigation activeTab={tab} onTabChange={setTab} />;
```

**After:**
Navigation state is now handled automatically by React Router location.

### Route Updates

Update route definitions in `routeConfig.ts`:

```typescript
// Add new routes
export const mainRoutes: Route[] = [
  // ... existing routes
  {
    id: 'new-feature',
    label: 'New Feature',
    path: '/new-feature',
    icon: NewFeatureIcon,
  },
];
```

## Performance

### Bundle Impact

- **Core navigation**: ~15KB gzipped
- **Framer Motion**: ~35KB gzipped (shared)
- **Total overhead**: ~50KB gzipped

### Optimization

- Tree-shaking for unused components
- Lazy loading for motion library
- Memoized calculations
- Debounced resize events

## Design Tokens

### Glass Effect

```css
:root {
  --glass-bg: rgba(0, 0, 0, 0.42);
  --glass-border: rgba(255, 255, 255, 0.2);
  --glass-backdrop: blur(12px) saturate(180%);
}
```

### Spacing

```css
:root {
  --nav-mobile-height: 4rem;
  --nav-tablet-width: 5rem; /* collapsed */
  --nav-tablet-expanded: 16rem;
  --nav-desktop-width: 18rem;
}
```

## Browser Support

- **Modern browsers**: Full support with animations
- **Legacy browsers**: Graceful degradation without animations
- **Touch devices**: Optimized interactions
- **Keyboard users**: Full accessibility support

## Troubleshooting

### Navigation not showing

1. Check viewport size matches expected breakpoint
2. Verify CSS classes are applied correctly
3. Ensure React Router is properly configured

### Animations not working

1. Check `prefers-reduced-motion` setting
2. Verify Framer Motion is installed
3. Test without animation wrappers

### Touch targets too small

1. Verify CSS `touch-manipulation` is applied
2. Check minimum size calculations
3. Test on actual devices

## Contributing

1. Follow existing component patterns
2. Add comprehensive tests
3. Update documentation
4. Test across all breakpoints
5. Verify accessibility compliance

## Roadmap

- [ ] Voice navigation support
- [ ] Gesture-based navigation
- [ ] Context-aware routing
- [ ] Advanced animation presets
- [ ] Theme customization API
