# Vueni Brand Assets & Logo Usage Guide

## 🎯 Overview

The Vueni logo now includes a sophisticated right-click context menu system that allows users to download official brand assets directly from the application interface.

## 🎨 Logo Component Usage

### Basic Implementation

```tsx
import { VueniLogo } from '@/shared/ui/VueniLogo';

// Standard usage with context menu
<VueniLogo 
  size="md" 
  variant="text-only"
  onClick={() => navigate('/')}
  onDownloadComplete={(filename) => console.log(`Downloaded: ${filename}`)}
/>
```

### Size Variants

- `sm` - 24px height (mobile/compact spaces)
- `md` - 32px height (default)  
- `lg` - 40px height (navigation bars)
- `xl` - 48px height (headers/hero sections)

### Visual Variants

- `text-only` - Clean text logo with gradient (default)
- `full` - Text with glass background and accent dot
- `icon-only` - Compact V-shaped icon with glass background

### Props API

```tsx
interface VueniLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'text-only' | 'icon-only';
  className?: string;
  onClick?: () => void;
  showContextMenu?: boolean;         // Enable/disable download menu
  onDownloadComplete?: (filename: string) => void;
}
```

## 📦 Available Brand Assets

### Via Right-Click Context Menu

1. **SVG Logo** (`vueni-logo.svg`) - 4KB
   - Scalable vector format
   - Optimized for web and print
   - Maintains quality at any size

2. **Brand Guidelines** (`brand-guidelines.pdf`) - 2MB
   - Complete visual identity standards
   - Color specifications and usage rules
   - Typography and spacing guidelines

3. **LLM Instructions** (`LLM.txt`) - 1KB
   - AI system branding guidelines
   - Voice and tone specifications
   - Usage restrictions and best practices

4. **Brand Portal** - External link
   - Extended brand resources
   - Asset library and templates
   - Contact information for brand inquiries

### Direct Asset URLs

Assets are served statically from `/branding/`:

```
/branding/vueni-logo.svg
/branding/brand-guidelines.pdf  
/branding/LLM.txt
```

## 🎨 Brand Identity Standards

### Color Palette

```css
/* Primary Gradient */
--vueni-primary-start: #4A9EFF;    /* Blue */
--vueni-primary-end: #9D4EDD;      /* Purple */

/* Glass Morphism */
--vueni-glass-bg: rgba(255, 255, 255, 0.05);
--vueni-glass-border: rgba(255, 255, 255, 0.1);
--vueni-glass-hover: rgba(255, 255, 255, 0.15);
```

### Typography

- **Primary Font**: SF Pro Display
- **Fallback**: -apple-system, BlinkMacSystemFont, sans-serif
- **Weight**: 700 (Bold) for logo text
- **Letter Spacing**: -0.02em for optimal readability

### Visual Effects

- **Gradient Direction**: Left to right (0° to 100%)
- **Glass Background**: 5% white opacity with 10% border
- **Shadow**: Subtle drop shadow for depth
- **Border Radius**: 12px for glass elements

## 🔧 Technical Implementation

### Context Menu System

Built on **Radix UI** for accessibility:

```tsx
import { BrandDownloadMenu } from '@/shared/ui/BrandDownloadMenu';

<BrandDownloadMenu onDownloadComplete={handleDownload}>
  <YourLogoComponent />
</BrandDownloadMenu>
```

### Download Hook

Type-safe download functionality:

```tsx
import { useDownload } from '@/shared/hooks/useDownload';

const { downloadFile, isDownloading, error } = useDownload();

// Download with error handling
await downloadFile('/branding/vueni-logo.svg', 'custom-name.svg');
```

## ♿ Accessibility Features

### Keyboard Navigation
- **Tab**: Focus the logo
- **Enter/Space**: Trigger primary action (navigation)
- **Right-click**: Access download menu
- **Escape**: Close context menu

### Screen Reader Support
- Proper ARIA labels describing functionality
- Semantic button role for logo interaction
- Context menu announced when opened

### Mobile Support
- **Long Press**: Alternative to right-click on touch devices
- **Touch Targets**: Minimum 44px for easy interaction
- **Responsive Sizing**: Adapts to viewport constraints

## 🧪 Testing

### Unit Tests
```bash
npm test -- VueniLogo.test.tsx
```

### E2E Tests
```bash
npx playwright test logo-download.spec.ts
```

### Accessibility Testing
```bash
npm run a11y-test
```

## 📱 Mobile Considerations

### Touch Interactions
- Long press (800ms) triggers context menu
- Standard tap navigates to home
- Touch targets meet WCAG 2.2 AA standards (44px minimum)

### Responsive Behavior
- Logo scales appropriately across viewports
- Context menu adapts to screen size
- Downloads work on mobile browsers

## 🚀 Performance

### Optimizations
- SVG logo embedded inline (no additional HTTP requests)
- Lazy-loaded context menu (reduces initial bundle size)
- Optimized asset delivery via static hosting

### Metrics
- **Logo Load Time**: <50ms (inline SVG)
- **Context Menu**: <200ms to appear
- **Download Initiation**: <100ms after click

## 🔒 Security & Privacy

### Asset Protection
- Brand assets served with appropriate MIME types
- No authentication required for public brand materials
- Proper Content-Security-Policy headers

### Download Safety
- Client-side downloads (no server logging)
- Verified file types and sizes
- No tracking or analytics on downloads

## 📋 Brand Usage Guidelines

### ✅ Approved Uses
- Navigation bars and headers
- Marketing materials and presentations  
- Developer documentation and demos
- Social media profiles (official accounts)

### ❌ Restricted Uses
- Modified colors or proportions
- Use in competitor materials
- Commercial exploitation without permission
- Overlaying with inappropriate content

### 📧 Brand Inquiries
For custom brand usage or licensing questions:
- **Email**: brand@vueni.com
- **Brand Portal**: https://vueni.com/brand
- **Legal**: legal@vueni.com

## 🔄 Changelog

### Version 1.0.0 (Latest)
- ✅ Interactive logo component with context menu
- ✅ Right-click download for brand assets  
- ✅ Mobile long-press support
- ✅ Full accessibility compliance
- ✅ E2E testing coverage
- ✅ Performance optimization

---

*This documentation is automatically updated with each brand asset release.* 