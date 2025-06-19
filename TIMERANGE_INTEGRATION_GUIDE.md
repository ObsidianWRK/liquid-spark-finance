# TimeRange Integration Guide

This guide shows how to use the new Apple-style TimeRange toggle component with global state management in Liquid Spark Finance.

## Components Overview

### 1. TimeRangeToggle
Basic Apple-style segmented control with full accessibility features.

### 2. TimeRangeToggleRadix  
Enhanced version using Radix UI for superior accessibility and screen reader support.

### 3. TimeRangeContext
Global state management with localStorage persistence and data filtering utilities.

### 4. useTimeRange Hook
Optimized hook for consuming time range context with additional utilities.

## Quick Start

### 1. Basic Setup with Provider

```tsx
import React from 'react';
import { TimeRangeProvider } from '@/context/TimeRangeContext';
import { GraphBase } from '@/components/charts';

function App() {
  return (
    <TimeRangeProvider
      defaultRange="1M"
      persistSelection={true}
      cacheFiltering={true}
    >
      <Dashboard />
    </TimeRangeProvider>
  );
}
```

### 2. Chart with Global Time Range

```tsx
import { GraphBase } from '@/components/charts';

function FinancialChart({ data }) {
  return (
    <GraphBase
      data={data}
      type="line"
      title="Financial Overview"
      useGlobalTimeRange={true} // Enable global context
      timeControls={{
        show: true,
        options: ['1W', '1M', '3M', '6M', '1Y', 'ALL'],
        defaultRange: '1M'
      }}
      series={[
        { dataKey: 'income', label: 'Income', color: '#32D74B' },
        { dataKey: 'spending', label: 'Spending', color: '#FF453A' },
        { dataKey: 'savings', label: 'Savings', color: '#0A84FF' }
      ]}
    />
  );
}
```

### 3. Standalone TimeRange Toggle

```tsx
import { TimeRangeToggleRadix } from '@/components/charts';
import { useTimeRange } from '@/hooks/useTimeRange';

function MyComponent() {
  const { selectedRange, setTimeRange } = useTimeRange();

  return (
    <TimeRangeToggleRadix
      value={selectedRange}
      onChange={setTimeRange}
      size="md"
      showLabels={false}
      aria-label="Time range selection"
    />
  );
}
```

### 4. Multiple Charts Sharing Time Range

```tsx
function Dashboard({ data }) {
  return (
    <div className="space-y-6">
      {/* Main chart with controls */}
      <GraphBase
        data={data}
        type="line"
        title="Overview"
        useGlobalTimeRange={true}
        timeControls={{ show: true, options: ['1W', '1M', '3M', '6M', '1Y', 'ALL'] }}
        series={[
          { dataKey: 'income', label: 'Income', color: '#32D74B' },
          { dataKey: 'spending', label: 'Spending', color: '#FF453A' }
        ]}
      />
      
      {/* Secondary charts without controls - they automatically sync */}
      <div className="grid grid-cols-2 gap-4">
        <GraphBase
          data={data}
          type="area"
          title="Income Trend"
          useGlobalTimeRange={true}
          timeControls={{ show: false }} // No controls on secondary charts
          series={[{ dataKey: 'income', label: 'Income', color: '#32D74B' }]}
        />
        
        <GraphBase
          data={data}
          type="bar"
          title="Spending Analysis"
          useGlobalTimeRange={true}
          timeControls={{ show: false }}
          series={[{ dataKey: 'spending', label: 'Spending', color: '#FF453A' }]}
        />
      </div>
    </div>
  );
}
```

### 5. Advanced Hook Usage

```tsx
import { useTimeRange, useTimeRangeFilter } from '@/hooks/useTimeRange';

function AdvancedComponent({ rawData }) {
  // Get optimized context with caching and validation
  const { 
    selectedRange, 
    setTimeRange, 
    rangeLabel,
    isInRange 
  } = useTimeRange({
    stabilizeCallbacks: true,
    memoizeData: true,
    enableCache: true,
    validateDates: true
  });

  // Filter data automatically with memoization
  const filteredData = useTimeRangeFilter(rawData, 'date', 'iso');

  // Manual filtering example
  const customFilteredData = rawData.filter(item => 
    isInRange(item.timestamp)
  );

  return (
    <div>
      <h2>Showing {rangeLabel}: {filteredData.length} items</h2>
      {/* Your component content */}
    </div>
  );
}
```

## Component Props

### TimeRangeToggleRadix Props

```tsx
interface TimeRangeToggleRadixProps {
  value: TimeRangeOption;
  onChange: (value: TimeRangeOption) => void;
  options?: TimeRangeOption[];
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
  showLabels?: boolean;
}
```

### GraphBase Props (Enhanced)

```tsx
interface GraphBaseProps {
  // ... existing props ...
  useGlobalTimeRange?: boolean; // NEW: Use global context
  // ... rest of props ...
}
```

### UseTimeRange Options

```tsx
interface UseTimeRangeOptions {
  stabilizeCallbacks?: boolean;   // Prevent unnecessary re-renders
  memoizeData?: boolean;          // Cache filtered data
  enableCache?: boolean;          // Enable filtering cache
  validateDates?: boolean;        // Validate date inputs
  fallbackRange?: TimeRangeOption; // Fallback for invalid ranges
  debounceMs?: number;            // Debounce range changes
  skipInitialRender?: boolean;    // Skip first render
}
```

## Accessibility Features

### Keyboard Navigation
- **Arrow Keys**: Navigate between options
- **Enter/Space**: Select option
- **Home/End**: Jump to first/last option
- **Tab**: Move to/from component

### Screen Reader Support
- Full ARIA labeling
- Live announcements for changes
- Proper role and state attributes
- Descriptive labels for each option

### Touch Support
- 44px minimum touch targets (iOS guidelines)
- Touch-friendly spacing
- Active state feedback

## Performance Optimizations

### Automatic Optimizations
- React.memo on all components
- Stable callback references
- Memoized data filtering
- Efficient re-render prevention

### Cache Management
- 5-minute filter cache by default
- Automatic cache cleanup
- Manual cache clearing available

### Large Dataset Handling
- Virtualization support for 1000+ data points
- Progressive loading
- Memory-efficient filtering

## Design Tokens

The components use Apple Human Interface Guidelines design tokens:

```tsx
// Colors (automatically adapts to dark/light theme)
SystemBlue: '#007AFF' / '#0A84FF'
SystemGreen: '#30D158' / '#32D74B'
SystemRed: '#FF3B30' / '#FF453A'

// Typography
Font Family: 'SF Pro Display' with system fallbacks
Font Sizes: 11px - 20px (various component levels)
Font Weights: 400 (regular) to 600 (semibold)

// Spacing
Apple Spacing Scale: 4px - 32px
Touch Targets: 44px minimum (iOS guidelines)

// Animation
Duration: 200ms (fast) - 800ms (slow)
Easing: Apple-calibrated cubic-bezier curves
```

## Migration Guide

### From Local Time Controls
```tsx
// Before: Local time control
<GraphBase
  timeRange={localRange}
  onTimeRangeChange={setLocalRange}
  timeControls={{ show: true }}
/>

// After: Global time control
<TimeRangeProvider>
  <GraphBase
    useGlobalTimeRange={true}
    timeControls={{ show: true }}
  />
</TimeRangeProvider>
```

### Backward Compatibility
All existing GraphBase components work unchanged. The new features are opt-in via the `useGlobalTimeRange` prop.

## Common Patterns

### Dashboard with Multiple Charts
```tsx
function FinancialDashboard() {
  return (
    <TimeRangeProvider defaultRange="3M">
      <div className="space-y-6">
        {/* Master chart with controls */}
        <GraphBase
          title="Portfolio Overview"
          useGlobalTimeRange={true}
          timeControls={{ show: true }}
          data={portfolioData}
        />
        
        {/* Synchronized child charts */}
        {assetClasses.map(asset => (
          <GraphBase
            key={asset.id}
            title={asset.name}
            useGlobalTimeRange={true}
            timeControls={{ show: false }}
            data={asset.data}
          />
        ))}
      </div>
    </TimeRangeProvider>
  );
}
```

### Custom Time Range Controls
```tsx
function CustomControls() {
  const { selectedRange, setTimeRange } = useTimeRange();
  
  return (
    <div className="flex space-x-2">
      <TimeRangeToggleRadix
        value={selectedRange}
        onChange={setTimeRange}
        options={['1W', '1M', '3M']} // Custom options
        size="sm"
      />
      <button onClick={() => setTimeRange('ALL')}>
        Show All
      </button>
    </div>
  );
}
```

## Demo Component

To see all features in action, check out the `TimeRangeDemo` component:

```tsx
import TimeRangeDemo from '@/components/charts/TimeRangeDemo';

// Use in your app to see the full integration
<TimeRangeDemo />
```

This component demonstrates:
- Standalone time range toggles
- Global context integration
- Multiple synchronized charts
- Performance optimizations
- Accessibility features

## Support

For questions or issues:
1. Check component TypeScript definitions
2. Review demo component for examples
3. Test with screen readers for accessibility
4. Monitor performance with large datasets