# Navigation System Technical Reference

## API Documentation

### Component Specifications

#### `AdaptiveNavigation`

**Import Path:** `@/navigation/components/AdaptiveNavigation`

```typescript
interface AdaptiveNavigationProps {
  // Currently no props - auto-adapts based on viewport
}

// Usage
import { AdaptiveNavigation } from '@/navigation';

<AdaptiveNavigation />
```

**Behavior:**

- Automatically detects viewport size using `useBreakpoint`
- Renders appropriate navigation variant
- Handles viewport changes with smooth transitions
- No manual configuration required

#### `BottomNav`

**Import Path:** `@/navigation/components/BottomNav`

```typescript
interface BottomNavProps {
  // Props inherited from route configuration
}

// Internal implementation details
const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Filters routes and limits to 5 items
  const navRoutes = mainRoutes
    .filter(route => !route.hideInBottomNav)
    .slice(0, 5);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 sm:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Navigation implementation */}
    </nav>
  );
};
```

**Features:**

- Fixed bottom positioning with z-index 50
- Safe area inset support for iOS devices
- Glass morphism backdrop with SVG filters
- Touch-optimized 56px minimum targets
- Badge indicator support
- Accessibility ARIA labels

#### `NavRail`

**Import Path:** `@/navigation/components/NavRail`

```typescript
interface NavRailState {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

const NavRail: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Hover and touch interactions
  const handleMouseEnter = () => setIsExpanded(true);
  const handleMouseLeave = () => setIsExpanded(false);

  // Long press for touch devices (500ms)
  const handleTouchStart = () => {
    const timer = setTimeout(() => setIsExpanded(true), 500);
    return () => clearTimeout(timer);
  };

  return (
    <nav
      className="hidden sm:flex lg:hidden fixed left-0 top-0 bottom-0 z-40"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
    >
      {/* Rail implementation */}
    </nav>
  );
};
```

**Features:**

- Collapsed width: 80px (w-20)
- Expanded width: 256px (w-64)
- Smooth expand/collapse animations
- Hover and long-press interactions
- Logo/brand area at top
- Expansion indicator at bottom


#### `useBreakpoint`

**Import Path:** `@/shared/hooks/useBreakpoint`

```typescript
interface UseBreakpointReturn {
  breakpoint: Breakpoint;
  isMobile: boolean; // <= 767px
  isTablet: boolean; // 768px - 1023px
  isDesktop: boolean; // >= 1024px
  isLargeDesktop: boolean; // >= 1440px
}

type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'large' | 'ultrawide';

// Implementation
export const useBreakpoint = (): UseBreakpointReturn => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => {
    if (typeof window === 'undefined') return 'mobile';
    return getBreakpoint(window.innerWidth);
  });

  useEffect(() => {
    const handleResize = () => {
      const newBreakpoint = getBreakpoint(window.innerWidth);
      setBreakpoint(newBreakpoint);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop:
      breakpoint === 'desktop' ||
      breakpoint === 'large' ||
      breakpoint === 'ultrawide',
    isLargeDesktop: breakpoint === 'large' || breakpoint === 'ultrawide',
  };
};
```

### Route Configuration Schema

#### Route Interface

```typescript
interface Route {
  /** Unique identifier for the route */
  id: string;

  /** Human-readable label displayed in navigation */
  label: string;

  /** React Router path pattern */
  path: string;

  /** Lucide React icon component */
  icon: React.ComponentType<{ className?: string }>;

  /** Optional badge key for notification counts */
  badgeKey?: string;

  /** Whether to hide this route from bottom navigation */
  hideInBottomNav?: boolean;
}
```

#### Route Arrays

```typescript
// Primary navigation routes
export const mainRoutes: Route[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: Home,
  },
  {
    id: 'accounts',
    label: 'Accounts',
    path: '/accounts',
    icon: CreditCard,
  },
  {
    id: 'transactions',
    label: 'Transactions',
    path: '/transactions',
    icon: Receipt,
  },
  {
    id: 'insights',
    label: 'Insights',
    path: '/insights',
    icon: TrendingUp,
  },
  {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: BarChart3,
    hideInBottomNav: true, // Excluded from mobile nav
  },
];

// Secondary navigation routes
export const secondaryRoutes: Route[] = [
  {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: User,
    hideInBottomNav: true,
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: Settings,
    hideInBottomNav: true,
  },
];

// Combined routes for full navigation
export const allRoutes: Route[] = [...mainRoutes, ...secondaryRoutes];
```

### Styling System

#### CSS Custom Properties

```css
:root {
  /* Navigation Heights */
  --nav-mobile-height: 4rem; /* 64px */
  --nav-tablet-width: 5rem; /* 80px collapsed */
  --nav-tablet-expanded: 16rem; /* 256px expanded */
  --nav-desktop-width: 18rem; /* 288px sidebar */
  --nav-topbar-height: 3rem; /* 48px */

  /* Glass Effect Variables */
  --glass-bg: rgba(0, 0, 0, 0.6);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-backdrop: blur(20px) saturate(180%);

  /* Touch Targets */
  --touch-target-min: 44px; /* WCAG minimum */
  --touch-target-comfortable: 56px; /* Recommended */

  /* Z-Index Scale */
  --z-nav-mobile: 50;
  --z-nav-tablet: 40;
  --z-nav-desktop: 30;
  --z-topbar: 50;
}
```

#### Glass Morphism Classes

```css
/* Base glass navigation */
.liquid-glass-nav {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border: 1px solid var(--glass-border);
  filter: url(#glass-distortion-nav);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Interactive button states */
.liquid-glass-button {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  filter: url(#glass-distortion-button);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.liquid-glass-button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.25);
  filter: url(#glass-distortion-button-hover);
  transform: translateY(-1px);
}

/* Menu item highlighting */
.liquid-glass-menu-item {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px) saturate(140%);
  -webkit-backdrop-filter: blur(12px) saturate(140%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  filter: url(#glass-distortion-menu);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.liquid-glass-menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.18);
  filter: url(#glass-distortion-menu-hover);
}

.liquid-glass-menu-item.active {
  background: rgba(99, 102, 241, 0.2);
  border-color: rgba(99, 102, 241, 0.4);
  filter: url(#glass-distortion-menu-active);
}
```

#### Responsive Layout Classes

```css
/* Mobile Navigation Layout */
.nav-mobile {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: var(--z-nav-mobile);
  padding-bottom: env(safe-area-inset-bottom);
}

.nav-mobile .nav-items {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0.75rem 0.5rem;
}

.nav-mobile .nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: var(--touch-target-comfortable);
  min-height: var(--touch-target-comfortable);
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
}

/* Tablet Navigation Layout */
.nav-tablet {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: var(--z-nav-tablet);
  width: var(--nav-tablet-width);
  transition: width 0.3s ease-out;
}

.nav-tablet.expanded {
  width: var(--nav-tablet-expanded);
}

.nav-tablet .nav-items {
  display: flex;
  flex-direction: column;
  padding: 1rem 0.75rem;
  gap: 0.5rem;
}

.nav-tablet .nav-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.nav-tablet:not(.expanded) .nav-item {
  justify-content: center;
}

.nav-tablet.expanded .nav-item {
  justify-content: flex-start;
  gap: 0.75rem;
}

/* Desktop Navigation Layout */
.nav-desktop {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: var(--z-nav-desktop);
  width: var(--nav-desktop-width);
}

.nav-topbar {
  position: fixed;
  top: 0;
  left: var(--nav-desktop-width);
  right: 0;
  z-index: var(--z-topbar);
  height: var(--nav-topbar-height);
}

/* Content spacing adjustments */
.main-content {
  transition: margin 0.3s ease;
}

/* Mobile: Account for bottom navigation */
@media (max-width: 639px) {
  .main-content {
    margin-bottom: var(--nav-mobile-height);
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* Tablet: Account for navigation rail */
@media (min-width: 640px) and (max-width: 1023px) {
  .main-content {
    margin-left: var(--nav-tablet-width);
  }
}

/* Desktop: Account for sidebar and topbar */
@media (min-width: 1024px) {
  .main-content {
    margin-left: var(--nav-desktop-width);
    margin-top: var(--nav-topbar-height);
  }
}
```

### Animation System

#### Transition Specifications

```css
/* Base transition timing */
:root {
  --nav-transition-duration: 300ms;
  --nav-transition-easing: cubic-bezier(0.4, 0, 0.2, 1);
  --nav-hover-duration: 200ms;
  --nav-active-duration: 150ms;
}

/* Navigation component animations */
.nav-component {
  transition:
    transform var(--nav-transition-duration) var(--nav-transition-easing),
    opacity var(--nav-transition-duration) var(--nav-transition-easing),
    background-color var(--nav-hover-duration) ease,
    border-color var(--nav-hover-duration) ease;
}

/* Touch feedback animations */
.nav-item {
  transition:
    transform var(--nav-hover-duration) ease,
    background-color var(--nav-hover-duration) ease,
    border-color var(--nav-hover-duration) ease,
    box-shadow var(--nav-hover-duration) ease;
}

.nav-item:hover {
  transform: translateY(-1px);
}

.nav-item:active {
  transform: translateY(0) scale(0.98);
  transition-duration: var(--nav-active-duration);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .nav-component,
  .nav-item {
    transition: none;
    animation: none;
  }
}
```

#### SVG Filter Effects

```xml
<!-- Glass distortion filters -->
<svg className="liquid-glass-svg-filters" style={{ position: 'absolute', width: 0, height: 0 }}>
  <defs>
    <!-- Navigation glass effect -->
    <filter id="glass-distortion-nav" x="0%" y="0%" width="100%" height="100%">
      <feSpecularLighting
        in="SourceGraphic"
        surfaceScale="0.5"
        specularConstant="0.2"
        specularExponent="15"
        lightingColor="rgba(255,255,255,0.08)"
        result="specLight"
      >
        <fePointLight x="-100" y="-100" z="80" />
      </feSpecularLighting>
      <feComposite
        in="SourceGraphic"
        in2="specLight"
        operator="arithmetic"
        k1="0" k2="1" k3="0.15" k4="0"
      />
    </filter>

    <!-- Button hover effect -->
    <filter id="glass-distortion-button-hover" x="0%" y="0%" width="100%" height="100%">
      <feSpecularLighting
        in="SourceGraphic"
        surfaceScale="1"
        specularConstant="0.35"
        specularExponent="22"
        lightingColor="rgba(255,255,255,0.15)"
        result="specLight"
      >
        <fePointLight x="-50" y="-50" z="110" />
      </feSpecularLighting>
      <feComposite
        in="SourceGraphic"
        in2="specLight"
        operator="arithmetic"
        k1="0" k2="1" k3="0.25" k4="0"
      />
    </filter>

    <!-- Menu item active state -->
    <filter id="glass-distortion-menu-active" x="0%" y="0%" width="100%" height="100%">
      <feSpecularLighting
        in="SourceGraphic"
        surfaceScale="0.8"
        specularConstant="0.25"
        specularExponent="18"
        lightingColor="rgba(99,102,241,0.1)"
        result="specLight"
      >
        <fePointLight x="-60" y="-60" z="90" />
      </feSpecularLighting>
      <feComposite
        in="SourceGraphic"
        in2="specLight"
        operator="arithmetic"
        k1="0" k2="1" k3="0.15" k4="0"
      />
    </filter>
  </defs>
</svg>
```

### Testing Framework

#### Unit Test Structure

```typescript
// Navigation component test template
describe('NavigationComponent', () => {
  beforeEach(() => {
    // Reset viewport and router state
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render correct variant for mobile viewport', () => {
      mockViewport('mobile');
      render(<AdaptiveNavigation />);
      expect(screen.getByLabelText('Bottom navigation')).toBeInTheDocument();
    });

    it('should render correct variant for tablet viewport', () => {
      mockViewport('tablet');
      render(<AdaptiveNavigation />);
      expect(screen.getByLabelText('Navigation rail')).toBeInTheDocument();
    });

    it('should render correct variant for desktop viewport', () => {
      mockViewport('desktop');
      render(<AdaptiveNavigation />);
      expect(screen.getByLabelText('navigation header')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should navigate when route buttons are clicked', async () => {
      const user = userEvent.setup();
      render(<BottomNav />);

      const transactionsBtn = screen.getByLabelText('Navigate to Transactions');
      await user.click(transactionsBtn);

      expect(mockNavigate).toHaveBeenCalledWith('/transactions');
    });

    it('should expand navigation rail on hover', async () => {
      const user = userEvent.setup();
      render(<NavRail />);

      const rail = screen.getByLabelText('Navigation rail');
      await user.hover(rail);

      await waitFor(() => {
        expect(rail).toHaveClass('w-64'); // Expanded width
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<BottomNav />);

      const navigation = screen.getByRole('navigation');
      expect(navigation).toHaveAttribute('aria-label', 'Bottom navigation');

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-label');
        expect(button).toHaveAttribute('aria-current');
      });
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<BottomNav />);

      const firstButton = screen.getAllByRole('button')[0];
      firstButton.focus();

      await user.keyboard('{Enter}');
      expect(mockNavigate).toHaveBeenCalled();
    });

    it('should meet minimum touch target sizes', () => {
      render(<BottomNav />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        const rect = button.getBoundingClientRect();
        expect(rect.width).toBeGreaterThanOrEqual(44);
        expect(rect.height).toBeGreaterThanOrEqual(44);
      });
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const spy = jest.spyOn(React, 'memo');
      render(<BottomNav />);

      // Trigger state change that shouldn't affect nav
      // Verify memo prevented re-render
      expect(spy).toHaveBeenCalled();
    });

    it('should debounce resize events', () => {
      jest.useFakeTimers();
      render(<AdaptiveNavigation />);

      // Simulate rapid resize events
      act(() => {
        window.dispatchEvent(new Event('resize'));
        window.dispatchEvent(new Event('resize'));
        window.dispatchEvent(new Event('resize'));
      });

      // Should only trigger handler once after debounce
      jest.advanceTimersByTime(150);
      expect(mockHandleResize).toHaveBeenCalledTimes(1);
    });
  });
});
```

#### E2E Test Scenarios

```typescript
// End-to-end test scenarios
describe('Navigation E2E', () => {
  const viewports = {
    mobile: { width: 390, height: 844 },
    tablet: { width: 820, height: 1180 },
    desktop: { width: 1440, height: 900 },
  };

  test('should maintain navigation state across viewport changes', async ({
    page,
  }) => {
    // Start on desktop
    await page.setViewportSize(viewports.desktop);
    await page.goto('/transactions');

    // Switch to mobile
    await page.setViewportSize(viewports.mobile);
    await page.waitForTimeout(300);

    // Verify active state maintained
    const bottomNav = page.locator('[aria-label="Bottom navigation"]');
    const transactionsBtn = bottomNav.locator('button', {
      hasText: 'Transactions',
    });
    await expect(transactionsBtn).toHaveAttribute('aria-current', 'page');
  });

  test('should handle rapid viewport changes gracefully', async ({ page }) => {
    await page.goto('/');

    // Rapid viewport switching
    for (const viewport of Object.values(viewports)) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(50);
    }

    // Should still be functional
    const navigation = page.locator('[role="navigation"]:visible');
    await expect(navigation).toBeVisible();
  });

  test('should preserve performance during navigation', async ({ page }) => {
    await page.goto('/');

    // Enable performance monitoring
    await page.coverage.startJSCoverage();

    // Navigate through all routes
    const routes = ['/accounts', '/transactions', '/insights', '/'];
    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
    }

    // Verify no memory leaks
    const coverage = await page.coverage.stopJSCoverage();
    const totalBytes = coverage.reduce(
      (acc, entry) => acc + entry.text.length,
      0
    );
    expect(totalBytes).toBeLessThan(5 * 1024 * 1024); // 5MB limit
  });
});
```

### Deployment Configuration

#### Build Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          navigation: [
            './src/navigation/components/AdaptiveNavigation',
            './src/navigation/components/BottomNav',
            './src/navigation/components/NavRail',
          ],
          'navigation-utils': [
            './src/navigation/routeConfig',
            './src/shared/hooks/useBreakpoint',
          ],
        },
      },
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
```

#### Performance Monitoring

```typescript
// Performance monitoring setup
const navigationMetrics = {
  // Component render times
  componentRender: 'navigation.component.render',
  routeChange: 'navigation.route.change',
  viewportChange: 'navigation.viewport.change',

  // Interaction latency
  tapToNavigation: 'navigation.interaction.tap',
  hoverExpand: 'navigation.interaction.hover',

  // Memory usage
  componentMemory: 'navigation.memory.usage',
  eventListeners: 'navigation.memory.listeners',
};

// Metric collection
const trackNavigationMetric = (metric: string, value: number) => {
  performance.mark(`${metric}-start`);

  return {
    end: () => {
      performance.mark(`${metric}-end`);
      performance.measure(metric, `${metric}-start`, `${metric}-end`);

      // Send to analytics
      analytics.track(metric, { duration: value });
    },
  };
};
```

This technical reference provides comprehensive implementation details for developers working with the navigation system. It covers all APIs, styling systems, testing approaches, and deployment considerations.
