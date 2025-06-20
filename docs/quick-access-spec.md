# Quick Access Rail - Design Specification

## 🎯 Design Goals

Replace the current 4-column grid with a **responsive, Apple-grade horizontal rail** that's:

- **Clear & Compact**: Optimized for quick account scanning
- **Responsive**: Horizontal scroll (mobile/tablet) → 2-col grid (desktop ≥ lg)
- **Consistent**: Uses UnifiedCard design system exclusively

## 📏 Design Specifications

### **Card Dimensions**

- **Width**: `min(160px, 28vw)` with `max-w-72`
- **Height**: Auto-fit content (no fixed height)
- **Spacing**: 4×4pt grid system
- **Inner Padding**: 12px (`p-3`)
- **Border Radius**: 8px (`rounded-2xl`)

### **Visual Design**

- **Background**: `bg-white/[0.02]` (dark-mode only)
- **Border**: `border-white/[0.08]` with pastel accent based on account type
- **Typography**:
  - Title: `text-sm font-medium text-white`
  - Balance: `text-lg font-bold text-white`
  - Subtitle: `text-xs text-white/60`

### **Account Type Color Mapping**

```typescript
const accountTypeColors = {
  checking: 'border-l-blue-400',
  savings: 'border-l-green-400',
  credit: 'border-l-orange-400',
  investment: 'border-l-purple-400',
  loan: 'border-l-red-400',
};
```

## 📱 Responsive Behavior

### **Mobile/Tablet (< lg)**

- Horizontal scrolling rail
- Snap-scroll behavior (`snap-x snap-mandatory`)
- Touch-friendly swipe gestures
- Cards: `snap-start` with `16px` gap

### **Desktop (≥ lg)**

- 2-column grid layout
- `grid-cols-2 gap-4`
- Maximum 8 cards visible (4 rows × 2 cols)
- Overflow handling with "View All" button

### **Keyboard Navigation**

- Arrow keys cycle through cards
- Enter/Space to expand card
- Tab navigation for accessibility

## 🎨 Card Content Structure

```typescript
interface QuickAccessCardProps {
  account: AccountCardDTO;
  variant: 'rail' | 'grid';
  onSelect?: (accountId: string) => void;
}
```

### **Card Layout**

1. **Header**: Account icon + type badge
2. **Title**: Account name (truncated with tooltip)
3. **Balance**: Primary balance with trend indicator
4. **Footer**: Institution name + last 4 digits

## ⚡ Performance Requirements

- Rail renders in ≤ 1s
- Smooth 60fps scroll performance
- Lazy-load account icons
- Memoized card components
- Virtual scrolling for 20+ accounts

## 🧪 Testing Requirements

- **Mobile**: Swipe left/right, snap behavior
- **Desktop**: Grid layout, keyboard navigation
- **Accessibility**: Screen reader support, focus management
- **Cross-browser**: Chrome, Firefox, Safari, Edge

## 📊 Success Metrics

- Lighthouse Performance ≥ 92 on mobile
- Zero layout shift (CLS = 0)
- Accessibility score ≥ 95
- 100% backwards compatibility with existing data flows
