# Navigation Quick Start Guide

## 5-Minute Integration

### Step 1: Basic Setup

```bash
# Dependencies should already be installed
npm install react-router-dom lucide-react framer-motion
```

### Step 2: Add to Your App

```tsx
// App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdaptiveNavigation } from '@/navigation';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-white">
        {/* 🎯 One line - handles all navigation variants */}
        <AdaptiveNavigation />

        {/* Your app content with proper spacing */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/insights" element={<Insights />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
```

### Step 3: Add Required CSS

```css
/* Add to your global CSS */
.main-content {
  /* Mobile: Account for bottom nav */
  padding-bottom: calc(4rem + env(safe-area-inset-bottom));
}

@media (min-width: 640px) and (max-width: 1023px) {
  /* Tablet: Account for nav rail */
  .main-content {
    margin-left: 5rem;
    padding-bottom: 0;
  }
}

@media (min-width: 1024px) {
  /* Desktop: Account for sidebar + topbar */
  .main-content {
    margin-left: 18rem;
    margin-top: 3rem;
    padding-bottom: 0;
  }
}
```

### Step 4: Test All Breakpoints

```bash
# Run the app and resize your browser window
npm run dev

# Test with device simulation in browser dev tools:
# - Mobile: 390x844 (iPhone)
# - Tablet: 820x1180 (iPad)
# - Desktop: 1440x900 (Laptop)
```

## ✅ You're Done!

The navigation will automatically:

- Show bottom nav on mobile
- Show navigation rail on tablet
- Show sidebar + topbar on desktop
- Handle all transitions smoothly

## Common Customizations

### Add a New Route

```typescript
// src/navigation/routeConfig.ts
import { Calculator } from 'lucide-react';

export const mainRoutes: Route[] = [
  // ... existing routes
  {
    id: 'calculators',
    label: 'Calculators',
    path: '/calculators',
    icon: Calculator,
    hideInBottomNav: true, // Optional: hide from mobile
  },
];
```

### Custom Breakpoint Behavior

```tsx
import { useBreakpoint } from '@/navigation';

function MyComponent() {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  return (
    <div>
      {isMobile && <MobileOnlyComponent />}
      {isTablet && <TabletOptimizedComponent />}
      {isDesktop && <DesktopFeaturesComponent />}
    </div>
  );
}
```

### Badge Notifications

```tsx
// Show badge counts on navigation items
const routes = mainRoutes.map((route) => ({
  ...route,
  badgeCount: route.badgeKey ? badges[route.badgeKey] : undefined,
}));
```

## Need Help?

- **Full Documentation**: See `implementation-report.md`
- **Technical Reference**: See `docs/navigation-technical-reference.md`
- **Original Guide**: See `docs/navigation-system.md`
- **Tests**: Check `src/navigation/__tests__/` for examples

## Performance Tips

1. **Lazy Load Routes**: Use React.lazy() for route components
2. **Optimize Images**: Use WebP format for better performance
3. **Monitor Bundle**: Keep navigation chunk under 20KB gzipped
4. **Test on Device**: Always test on real mobile devices

## Browser Support

✅ **Fully Supported**: Chrome 88+, Firefox 87+, Safari 14+, Edge 88+  
⚠️ **Graceful Degradation**: Older browsers get solid backgrounds instead of glass effects

---

_That's it! Your navigation system is now responsive and production-ready._
