# Vueni Logo Right-Click Download Assets - File Map

## 📍 Current Logo Location

```
src/components/LiquidGlassTopMenuBar.tsx:166
├── Currently just text "Vueni" in button
├── No dedicated VueniLogo component yet
└── Using gradient text styling

src/index.html:6
└── References /vueni-icon.svg (needs creation)
```

## 🎯 Target Architecture

### Brand Assets Structure

```
public/branding/
├── vueni-logo.svg          # ≤4KB optimized SVG
├── brand-guidelines.pdf    # ≤2MB style guide
└── LLM.txt                # ≤1KB branding prompt
```

### Component Structure

```
src/shared/ui/
├── VueniLogo.tsx           # New logo component
├── ContextMenu.tsx         # Reusable context menu
└── BrandDownloadMenu.tsx   # Specific brand menu

src/shared/hooks/
└── useDownload.ts          # Type-safe download hook
```

### Test Coverage

```
e2e/
└── logo-download.spec.ts   # Playwright E2E tests

src/shared/ui/__tests__/
├── VueniLogo.test.tsx
├── ContextMenu.test.tsx
└── useDownload.test.ts
```

## 🔧 Implementation Dependencies

### Required Packages

- `file-saver` - For download functionality
- `@radix-ui/react-context-menu` - A11y compliant context menu
- `@types/file-saver` - TypeScript types

### Theme Integration

- Uses `src/theme/unified.ts` design tokens
- Inherits glass morphism from VueniDesignSystem
- Consistent with dark-mode only approach

## 📊 Impact Analysis

- Zero breaking changes to existing navigation
- Maintains current LiquidGlassTopMenuBar.tsx API
- Adds new brand asset download capability
- Mobile-responsive with long-press support
