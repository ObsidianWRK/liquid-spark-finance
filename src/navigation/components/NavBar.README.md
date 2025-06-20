# NavBar Component

A high-performance, accessible React navigation bar component built with TypeScript, designed for modern web applications.

## Features

### Core Functionality
- ✅ **TypeScript Support**: Comprehensive interfaces for type safety
- ✅ **Responsive Design**: Adapts to mobile, tablet, and desktop viewports
- ✅ **Accessibility**: WCAG 2.1 compliant with proper ARIA attributes
- ✅ **Performance Optimized**: Uses CSS transforms and avoids repaints
- ✅ **Scroll Controller**: Hide/reveal on scroll with smooth animations
- ✅ **Orientation Support**: Handles device orientation changes
- ✅ **Badge Notifications**: Display notification counts on tabs
- ✅ **Floating Action Button**: Optional detached FAB support

### Technical Highlights
- Uses `useMemo` and `useCallback` to prevent unnecessary re-renders
- Debounced scroll event handling for smooth performance
- Passive scroll listeners to avoid blocking main thread
- CSS transforms instead of layout-triggering properties
- Automatic cleanup of event listeners to prevent memory leaks
- Touch target sizes meet WCAG requirements (48px minimum)

## Installation

The component is already integrated into the navigation system. Import it from the navigation module:

```tsx
import { NavBar, type Tab, type NavBarProps } from '@/navigation';
```

## Basic Usage

```tsx
import React, { useState } from 'react';
import { Home, CreditCard, Receipt, Plus } from 'lucide-react';
import { NavBar, type Tab } from '@/navigation';

const MyApp = () => {
  const [activeTab, setActiveTab] = useState('home');

  const tabs: Tab[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      action: () => setActiveTab('home'),
      isActive: activeTab === 'home',
    },
    {
      id: 'accounts',
      label: 'Accounts',
      icon: CreditCard,
      action: () => setActiveTab('accounts'),
      isActive: activeTab === 'accounts',
      badgeCount: 3, // Show notification badge
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: Receipt,
      action: () => setActiveTab('transactions'),
      isActive: activeTab === 'transactions',
    },
  ];

  const fab = {
    icon: Plus,
    action: () => console.log('Add new item'),
    ariaLabel: 'Add new transaction',
  };

  return (
    <div>
      {/* Your app content */}
      <NavBar
        tabs={tabs}
        fab={fab}
        scrollController={true}
        onActiveTabChange={setActiveTab}
      />
    </div>
  );
};
```

## API Reference

### NavBarProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `Tab[]` | Required | Array of navigation tabs |
| `fab` | `FABConfig` | Optional | Floating action button configuration |
| `scrollController` | `boolean` | `false` | Enable scroll-based hide/reveal |
| `className` | `string` | Optional | Additional CSS classes |
| `position` | `'top' \| 'bottom'` | `'bottom'` | Position of the navbar |
| `showLabels` | `boolean` | `true` | Whether to show tab labels |
| `maxTabs` | `number` | `5` | Maximum tabs before overflow |
| `onActiveTabChange` | `(tabId: string) => void` | Optional | Called when active tab changes |

### Tab Interface

```tsx
interface Tab {
  id: string;                    // Unique identifier
  label: string;                 // Display label
  icon: React.ComponentType;     // Icon component (Lucide React)
  action: () => void;            // Function to call when pressed
  isActive?: boolean;            // Whether tab is currently active
  badgeCount?: number;           // Notification badge count
  hideOnMobile?: boolean;        // Hide on mobile devices
  ariaLabel?: string;            // Custom accessibility label
}
```

### FAB Configuration

```tsx
interface FABConfig {
  icon: React.ComponentType;     // FAB icon component
  action: () => void;            // Function to call when pressed
  ariaLabel?: string;            // Accessibility label
  variant?: 'primary' | 'secondary'; // Visual variant
}
```

## Advanced Usage

### With React Router

```tsx
import { useNavigate, useLocation } from 'react-router-dom';

const AppNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs: Tab[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      action: () => navigate('/'),
      isActive: location.pathname === '/',
    },
    {
      id: 'accounts',
      label: 'Accounts',
      icon: CreditCard,
      action: () => navigate('/accounts'),
      isActive: location.pathname === '/accounts',
    },
  ];

  return <NavBar tabs={tabs} scrollController />;
};
```

### With State Management

```tsx
import { useAppSelector, useAppDispatch } from '@/store';
import { setActiveTab } from '@/store/navigationSlice';

const StatefulNavigation = () => {
  const dispatch = useAppDispatch();
  const { activeTab, notifications } = useAppSelector(state => state.navigation);

  const tabs: Tab[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      action: () => dispatch(setActiveTab('home')),
      isActive: activeTab === 'home',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      action: () => dispatch(setActiveTab('notifications')),
      isActive: activeTab === 'notifications',
      badgeCount: notifications.unread,
    },
  ];

  return <NavBar tabs={tabs} onActiveTabChange={(id) => dispatch(setActiveTab(id))} />;
};
```

### Custom Styling

```tsx
const CustomNavBar = () => {
  return (
    <NavBar
      tabs={tabs}
      className="bg-gradient-to-r from-blue-600 to-purple-600"
      scrollController
      position="top"
    />
  );
};
```

## Responsive Behavior

The component automatically adapts to different screen sizes:

- **Mobile (< 768px)**: 
  - Shows maximum of 5 tabs
  - Filters out tabs with `hideOnMobile: true`
  - Adjusts spacing for portrait/landscape orientation
  - Includes safe area insets for modern phones

- **Tablet (768px - 1023px)**:
  - Shows all provided tabs
  - Larger touch targets and spacing
  - Optimized for touch interaction

- **Desktop (> 1024px)**:
  - Full feature set available
  - Hover states and animations
  - Keyboard navigation support

## Accessibility Features

### ARIA Support
- Proper `role="navigation"` on container
- `aria-label` for navigation context
- `aria-current="page"` for active tabs
- `aria-hidden="true"` on decorative icons
- Custom `aria-label` support for complex actions

### Keyboard Navigation
- All interactive elements are focusable
- Visible focus indicators
- Proper tab order

### Touch Targets
- Minimum 48px touch targets (WCAG 2.5.5)
- Comfortable spacing between elements
- Touch-friendly gestures

### High Contrast Support
- Respects system color preferences
- Sufficient color contrast ratios
- Clear visual hierarchy

## Performance Considerations

### Optimizations
- Uses `React.memo` where appropriate
- Debounced scroll event handling (16ms)
- Passive event listeners
- CSS transforms for animations
- Conditional rendering based on breakpoints

### Memory Management
- Automatic cleanup of event listeners
- Timeout clearing on unmount
- Efficient re-render prevention

### Animation Performance
- Hardware-accelerated CSS transforms
- `transform-gpu` class for better performance
- Reduced motion support for accessibility

## Browser Support

- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Mobile browsers (iOS Safari 14+, Chrome Mobile 90+)
- Supports devices with safe area insets (iPhone X+)

## Testing

The component includes comprehensive tests:

```bash
# Run tests
npm test NavBar.test.tsx

# Run tests with coverage
npm test -- --coverage NavBar.test.tsx
```

## Troubleshooting

### Common Issues

1. **Navbar not showing on mobile**
   - Check that you're not accidentally hiding it with CSS
   - Ensure proper z-index values
   - Verify responsive breakpoint detection

2. **Scroll controller not working**
   - Ensure `scrollController={true}` is set
   - Check for CSS that might interfere with transforms
   - Verify scroll events are not prevented elsewhere

3. **Icons not displaying**
   - Ensure Lucide React icons are properly imported
   - Check that icon components accept `className` prop
   - Verify icon components are passed correctly to tabs

4. **Performance issues**
   - Check for unnecessary re-renders with React DevTools
   - Ensure tab actions are memoized
   - Verify scroll event listeners are properly debounced

### Debug Mode

Add debug logging by setting `localStorage.setItem('navbarDebug', 'true')` in your browser console.

## Examples

See `NavBarDemo.tsx` for a complete working example with all features demonstrated.

## Contributing

When contributing to the NavBar component:

1. Maintain TypeScript strict mode compliance
2. Add tests for new features
3. Update documentation for API changes
4. Test across different devices and screen sizes
5. Verify accessibility with screen readers
6. Check performance impact with React DevTools Profiler