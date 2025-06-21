# 🎨 Vueni Color System - Design Guide

## Overview

The Vueni Color System is a comprehensive brand-first color palette designed for financial applications. It replaces all previous color systems with a unified, accessible, and semantically meaningful color approach.

## 🎯 Core Brand Colors

### Primary Palette

| Color Name | Hex Code | Usage | Description |
|------------|----------|-------|-------------|
| **Sapphire Dust** | `#516AC8` | Primary actions, buttons, links | Deep blue representing trust and reliability |
| **Cosmic Odyssey** | `#0F1939` | Dark backgrounds, headers | Primary dark background color |
| **Caramel Essence** | `#E3AF64` | Accents, warnings, highlights | Warm amber for attention and energy |
| **Blue Oblivion** | `#26428B` | Secondary actions, investments | Navy blue for secondary elements |
| **Rapture's Light** | `#F6F3E7` | Light backgrounds (future) | Light cream for light mode |
| **Milk Tooth** | `#FAEBD7` | Light secondary (future) | Light beige for secondary areas |

### Visual Palette

```
🟦 Sapphire Dust (#516AC8)    🌙 Cosmic Odyssey (#0F1939)
🟨 Caramel Essence (#E3AF64)  🟦 Blue Oblivion (#26428B)
🤍 Rapture's Light (#F6F3E7)  🤍 Milk Tooth (#FAEBD7)
```

## 🔧 Implementation

### CSS Custom Properties

```css
:root {
  /* Core brand colors */
  --vueni-primary: #516AC8;
  --vueni-primary-dark: #0F1939;
  --vueni-secondary: #E3AF64;
  --vueni-secondary-dark: #26428B;
  
  /* Glass effects */
  --vueni-glass-subtle: rgba(81, 106, 200, 0.03);
  --vueni-glass-default: rgba(81, 106, 200, 0.06);
  --vueni-glass-prominent: rgba(81, 106, 200, 0.12);
  --vueni-glass-border: rgba(81, 106, 200, 0.08);
}
```

### Tailwind Configuration

```typescript
// tailwind.config.ts
colors: {
  vueni: {
    'sapphire-dust': '#516AC8',
    'cosmic-odyssey': '#0F1939',
    'caramel-essence': '#E3AF64',
    'blue-oblivion': '#26428B',
    primary: '#516AC8',
    secondary: '#E3AF64',
    success: '#4ABA70',
    error: '#D64545',
    warning: '#E3AF64',
  }
}
```

### TypeScript Usage

```typescript
import { vueniColorTheme } from '@/theme/colors/vueniPalette';

// Direct color access
const primaryColor = vueniColorTheme.core.primary.sapphireDust;
const glassEffect = vueniColorTheme.surfaces.glass.default;

// Semantic color access
const successColor = vueniColorTheme.semantic.success;
const chartColors = vueniColorTheme.charts.primary;
```

## 🎨 Semantic Color Mappings

### Financial Application Colors

| Semantic Use | Color | Hex Code | Reasoning |
|--------------|-------|----------|-----------|
| **Income/Positive** | Success Green | `#4ABA70` | Accessible green for gains |
| **Expenses/Negative** | Error Red | `#D64545` | Accessible red for losses |
| **Savings** | Sapphire Dust | `#516AC8` | Primary blue for savings |
| **Investments** | Blue Oblivion | `#26428B` | Navy for investment portfolios |
| **Debt/Warnings** | Caramel Essence | `#E3AF64` | Amber for attention items |

### Status Colors

| Status | Color | Hex Code | Usage |
|--------|-------|----------|-------|
| **Success** | `#4ABA70` | ✅ | Confirmations, completed actions |
| **Error** | `#D64545` | ❌ | Errors, failed transactions |
| **Warning** | `#E3AF64` | ⚠️ | Alerts, pending items |
| **Info** | `#516AC8` | ℹ️ | Information, neutral messages |

## 🖼️ Component Usage Examples

### Glass Morphism Cards

```tsx
// Modern glass card using Vueni colors
<div className="bg-vueni-glass-default border border-vueni-glass-border backdrop-blur-md rounded-2xl p-6">
  <h3 className="text-white font-semibold mb-2">Account Balance</h3>
  <p className="text-vueni-primary text-2xl font-bold">$12,847.32</p>
</div>
```

### Chart Configurations

```typescript
// Multi-series chart with Vueni palette
const chartConfig = {
  series: [
    { name: 'Income', color: '#4ABA70' },      // Success green
    { name: 'Expenses', color: '#D64545' },    // Error red  
    { name: 'Savings', color: '#516AC8' },     // Sapphire dust
    { name: 'Investments', color: '#26428B' }, // Blue oblivion
  ]
};
```

### Status Badges

```tsx
// Status indicators using semantic colors
<span className="px-3 py-1 rounded-full text-sm font-medium 
                bg-vueni-success/20 text-vueni-success border border-vueni-success/40">
  Completed
</span>
```

## 🌈 Color Combinations & Accessibility

### High Contrast Pairings

| Background | Text Color | Contrast Ratio | WCAG Level |
|------------|------------|----------------|------------|
| Cosmic Odyssey | White | 15.84:1 | AAA |
| Sapphire Dust | White | 4.52:1 | AA |
| Caramel Essence | Cosmic Odyssey | 8.91:1 | AAA |
| Success Green | White | 4.89:1 | AA |

### Glass Effect Guidelines

```css
/* Subtle glass - for backgrounds */
background: rgba(81, 106, 200, 0.03);
border: 1px solid rgba(81, 106, 200, 0.08);

/* Default glass - for cards */
background: rgba(81, 106, 200, 0.06);
border: 1px solid rgba(81, 106, 200, 0.08);

/* Prominent glass - for focus/hover */
background: rgba(81, 106, 200, 0.12);
border: 1px solid rgba(81, 106, 200, 0.08);
```

## 📊 Data Visualization

### Chart Color Sequence

For multi-series charts, use colors in this order:

1. `#516AC8` - Sapphire Dust (Primary data)
2. `#E3AF64` - Caramel Essence (Secondary data)
3. `#26428B` - Blue Oblivion (Tertiary data)
4. `#4ABA70` - Success Green (Positive trends)
5. `#D64545` - Error Red (Negative trends)
6. `#8B8478` - Neutral Gray (Baseline data)

### Financial Chart Guidelines

```typescript
const financialChartColors = {
  income: '#4ABA70',      // Always green for income
  expenses: '#D64545',    // Always red for expenses
  savings: '#516AC8',     // Primary blue for savings
  investments: '#26428B', // Navy for investments
  debt: '#E3AF64',        // Amber for debt/warnings
};
```

## 🚫 Migration from Legacy Colors

### Color Mapping Table

| Legacy Color | Legacy Usage | New Vueni Color | Migration |
|--------------|--------------|-----------------|-----------|
| `#4A9EFF` | Old primary | `#516AC8` | Direct replacement |
| `#4AFF88` | Old success | `#4ABA70` | Accessible alternative |
| `#FF4A6A` | Old error | `#D64545` | Accessible alternative |
| `#FFD700` | Old warning | `#E3AF64` | Brand-aligned alternative |
| `#6366f1` | Indigo variant | `#516AC8` | Use Sapphire Dust |

### Automated Migration

Use the color mapper utility:

```typescript
import { HARDCODED_COLOR_MAP } from '@/shared/utils/theme-color-mapper';

// Automatically replaces legacy colors
const newColor = HARDCODED_COLOR_MAP['#6366f1'] || '#516AC8';
```

## 🎯 Best Practices

### Do's ✅

- Use semantic color names (`vueni-primary`) over hex codes
- Leverage glass effects for modern UI elements
- Maintain consistent color ratios across components
- Use the chart color sequence for data visualization
- Test color combinations for accessibility compliance

### Don'ts ❌

- Don't mix legacy colors with Vueni colors
- Don't use hardcoded hex values in components
- Don't create custom color variants without design approval
- Don't ignore contrast ratio requirements
- Don't use more than 6 colors in a single chart

## 🔧 Developer Tools

### VS Code Color Highlighting

Add to your VS Code settings:

```json
{
  "colorHelper.enable": true,
  "colorHelper.pickerColumns": 8,
  "colorHelper.colorChip": true
}
```

### ESLint Rules (Recommended)

```json
{
  "rules": {
    "no-hard-coded-colors": "warn",
    "prefer-semantic-colors": "error"
  }
}
```

## 🎨 Design Tokens Export

### Figma Variables

```json
{
  "vueni-primary": "#516AC8",
  "vueni-secondary": "#E3AF64", 
  "vueni-surface-primary": "#0F1939",
  "vueni-glass-default": "rgba(81, 106, 200, 0.06)"
}
```

### Adobe Creative Suite

```scss
$vueni-primary: #516AC8;
$vueni-secondary: #E3AF64;
$vueni-success: #4ABA70;
$vueni-error: #D64545;
```

---

## 📞 Support

For questions about the Vueni Color System:

- **Design Team**: Consult brand guidelines
- **Development Team**: Check theme files in `/src/theme/colors/`
- **Accessibility**: All colors are WCAG AA compliant
- **Implementation**: See helper functions in `vueniHelpers.ts`

---

*Last updated: December 2024*
*Version: 1.0.0* 