# Vueni Finance – Documentation

The comprehensive documentation for this repository has been reorganized under the `docs/` directory.

See **docs/README.md** for an entry-point and full index.

# Vueni Financial Intelligence Platform

## ✨ New Feature: Interactive Logo with Brand Asset Downloads

The Vueni logo now includes an intelligent right-click context menu system that provides instant access to official brand assets:

### 🎯 Quick Start
Right-click the Vueni logo in the navigation bar to access:
- **SVG Logo** - Scalable vector format (4KB)
- **Brand Guidelines** - Complete visual standards (PDF, 2MB)  
- **LLM Instructions** - AI branding guidelines (TXT, 1KB)
- **Brand Portal** - Extended resources and templates

### 📱 Cross-Platform Support
- **Desktop**: Right-click context menu
- **Mobile**: Long-press interaction
- **Keyboard**: Tab + Enter navigation
- **Screen Readers**: Full ARIA support

### 🔧 Developer Usage

```tsx
import { VueniLogo } from '@/shared/ui/VueniLogo';

<VueniLogo 
  size="lg" 
  variant="text-only"
  onClick={() => navigate('/')}
  onDownloadComplete={(filename) => console.log(`Downloaded: ${filename}`)}
/>
```

For complete documentation, see [docs/branding.md](./docs/branding.md).

---

## 🏦 About Vueni

**Intelligence you can bank on** - Vueni is a comprehensive financial intelligence platform that combines AI-powered insights with intuitive user experience design.

## 🧪 Testing

### Brand Asset Downloads
```bash
# E2E tests for logo functionality
npx playwright test logo-download.spec.ts

# Unit tests for logo component
npm test -- VueniLogo.test.tsx
``` 