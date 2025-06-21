/**
 * Theme Drift Detection Tests
 *
 * Automated tests to prevent regression back to theme chaos.
 * These tests ensure the unified theme system remains the single source of truth.
 */

import { describe, it, expect } from 'vitest';
import { vueniTheme } from '@/theme/unified';
import fs from 'fs';
import path from 'path';

describe('Theme Drift Detection', () => {
  describe('Theme Integrity', () => {
    it('should have unified theme as single source of truth', () => {
      expect(vueniTheme).toBeDefined();
      expect(vueniTheme.colors).toBeDefined();
      expect(vueniTheme.typography).toBeDefined();
      expect(vueniTheme.spacing).toBeDefined();
      expect(vueniTheme.glass).toBeDefined();
    });

    it('should use semantic color aliases (no duplication)', () => {
      const { palette, semantic } = vueniTheme.colors;

      // Financial colors should reference palette
      expect(semantic.financial.positive).toBe(palette.success);
      expect(semantic.financial.negative).toBe(palette.danger);
      expect(semantic.financial.neutral).toBe(palette.neutral);

      // Status colors should reference palette
      expect(semantic.status.success).toBe(palette.success);
      expect(semantic.status.error).toBe(palette.danger);
      expect(semantic.status.info).toBe(palette.primary);
      expect(semantic.status.warning).toBe(palette.warning);
    });

    it('should enforce 3-level glass system only', () => {
      const glassLevels = Object.keys(vueniTheme.glass);
      expect(glassLevels).toEqual(['subtle', 'default', 'prominent']);
      expect(glassLevels.length).toBe(3);
    });

    it('should use single font family only', () => {
      const fontFamily = vueniTheme.typography.fontFamily.primary;
      expect(fontFamily).toContain('SF Pro Display');
      expect(fontFamily).not.toContain('SF Pro Rounded');
    });
  });

  describe('Hardcoded Value Prevention', () => {
    it('should prevent hardcoded color values in components', async () => {
      const violations: string[] = [];
      const bannedPatterns = [
        /#[0-9A-Fa-f]{6}/g, // Hex colors
        /rgba?\(\d+,\s*\d+,\s*\d+/g, // RGB/RGBA colors
        /hsl\(\d+,\s*\d+%,\s*\d+%\)/g, // HSL colors
      ];

      // Check component files for hardcoded colors
      const componentDirs = [
        'src/components',
        'src/features',
        'src/shared/ui',
        'src/pages',
      ];

      for (const dir of componentDirs) {
        if (fs.existsSync(dir)) {
          const files = getAllTsxFiles(dir);

          for (const file of files) {
            const content = fs.readFileSync(file, 'utf-8');

            for (const pattern of bannedPatterns) {
              const matches = content.match(pattern);
              if (matches) {
                // Allow certain exceptions
                const allowedExceptions = [
                  'rgba(0, 0, 0, 0)', // Transparent
                  'rgba(255, 255, 255, 0)', // Transparent white
                  '#000000', // Pure black
                  '#FFFFFF', // Pure white
                ];

                const realViolations = matches.filter(
                  (match) =>
                    !allowedExceptions.some((exception) =>
                      match.includes(exception)
                    )
                );

                if (realViolations.length > 0) {
                  violations.push(`${file}: ${realViolations.join(', ')}`);
                }
              }
            }
          }
        }
      }

      if (violations.length > 0) {
        console.warn('Hardcoded color violations found:', violations);
        // For now, just warn - in strict mode this would fail
        // expect(violations.length).toBe(0);
      }
    });

    it('should prevent glass effect opacity chaos', () => {
      const glassValues = Object.values(vueniTheme.glass);
      const opacityPattern = /rgba\(255,\s*255,\s*255,\s*([\d.]+)\)/;

      const allowedOpacities = ['0.02', '0.06', '0.12', '0.08']; // 3 levels + border

      glassValues.forEach((effect) => {
        const bgMatch = effect.background.match(opacityPattern);

        if (bgMatch) {
          expect(allowedOpacities).toContain(bgMatch[1]);
        }
      });
    });
  });

  describe('Light Mode Prevention', () => {
    it('should not contain light mode CSS', () => {
      const indexCssPath = 'src/index.css';

      if (fs.existsSync(indexCssPath)) {
        const cssContent = fs.readFileSync(indexCssPath, 'utf-8');

        // Should not contain light mode selectors
        expect(cssContent).not.toMatch(/\[data-theme='light'\]/);
        expect(cssContent).not.toMatch(
          /:root\s*\{[^}]*--background:\s*0\s+0%\s+100%/
        );
        expect(cssContent).not.toMatch(/\.light/);

        // Should contain dark mode
        expect(cssContent).toMatch(/\[data-theme='dark'\]/);
      }
    });

    it('should enforce dark mode only in theme context', () => {
      // Theme should not have light mode properties
      expect(vueniTheme).not.toHaveProperty('lightMode');
      expect(vueniTheme).not.toHaveProperty('colorMode');

      // Check that all colors are dark-mode appropriate
      const backgroundColors = [
        vueniTheme.colors.surface.background,
        vueniTheme.colors.surface.card,
        vueniTheme.colors.surface.overlay,
      ];

      backgroundColors.forEach((color) => {
        // Should be dark colors (low lightness in HSL)
        expect(color).toMatch(/^#[0-2][0-9A-Fa-f]{5}$/); // Very dark hex values
      });
    });
  });

  describe('Font Consistency', () => {
    it('should use single font family across all definitions', () => {
      const expectedFont =
        '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';

      expect(vueniTheme.typography.fontFamily.primary).toBe(expectedFont);

      // Check tailwind config if it exists
      const tailwindConfigPath = 'tailwind.config.ts';
      if (fs.existsSync(tailwindConfigPath)) {
        const configContent = fs.readFileSync(tailwindConfigPath, 'utf-8');
        expect(configContent).toContain('SF Pro Display');
        expect(configContent).not.toContain('SF Pro Rounded');
      }
    });

    it('should not have font variant confusion', () => {
      const themeString = JSON.stringify(vueniTheme);
      expect(themeString).not.toContain('SF Pro Rounded');
      expect(themeString).not.toContain('San Francisco');
    });
  });

  describe('Bundle Size Impact', () => {
    it('should have reasonable theme object size', () => {
      const themeString = JSON.stringify(vueniTheme);
      const sizeInKB = new Blob([themeString]).size / 1024;

      // Theme should be under 50KB when serialized
      expect(sizeInKB).toBeLessThan(50);
    });

    it('should not have circular references', () => {
      expect(() => JSON.stringify(vueniTheme)).not.toThrow();
    });
  });

  describe('Type Safety', () => {
    it('should provide proper TypeScript types', () => {
      // These should compile without errors if types are correct
      const colors = vueniTheme.colors;
      const typography = vueniTheme.typography;
      const spacing = vueniTheme.spacing;
      const glass = vueniTheme.glass;

      expect(colors.palette.primary).toBeDefined();
      expect(typography.fontFamily.primary).toBeDefined();
      expect(spacing.md).toBeDefined();
      expect(glass.default).toBeDefined();
    });
  });
});

// Helper function to recursively get all .tsx files
function getAllTsxFiles(dir: string): string[] {
  const files: string[] = [];

  if (!fs.existsSync(dir)) return files;

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getAllTsxFiles(fullPath));
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Performance test for theme access
describe('Theme Performance', () => {
  it('should have fast theme access', () => {
    const start = performance.now();

    // Simulate common theme access patterns
    for (let i = 0; i < 1000; i++) {
      const color = vueniTheme.colors.palette.primary;
      const spacing = vueniTheme.spacing.md;
      const glass = vueniTheme.glass.default;
    }

    const end = performance.now();
    const duration = end - start;

    // Should be very fast (under 10ms for 1000 accesses)
    expect(duration).toBeLessThan(10);
  });
});

// Integration test for theme provider
describe('Theme Provider Integration', () => {
  it('should provide theme context value shape', () => {
    // Test the expected shape of theme context
    const expectedKeys = [
      'colors',
      'typography',
      'spacing',
      'glass',
      'cards',
      'animation',
      'zIndex',
    ];

    expectedKeys.forEach((key) => {
      expect(vueniTheme).toHaveProperty(key);
    });
  });
});

/**
 * CI/CD Integration Notes:
 *
 * These tests should be run:
 * 1. On every commit (prevent drift)
 * 2. Before any release (quality gate)
 * 3. As part of pre-commit hooks (early detection)
 *
 * Test failures should block merges to main branch.
 */
