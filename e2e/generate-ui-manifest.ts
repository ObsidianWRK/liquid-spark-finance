import { chromium, FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Playwright globalSetup
 * Crawls the application starting at the root route and builds a manifest of all
 * interactive elements (anchor, button, tab, or element with an onclick attr).
 * The resulting JSON is written to the project root as `ui-map.json` and is
 * used by `e2e/all-interactions.spec.ts` to drive exhaustive UI interaction tests.
 */
export default async function globalSetup(_: FullConfig) {
  // Base URL will usually come from the shared `use.baseURL` setting.
  const baseURL = process.env.BASE_URL || 'http://localhost:5173';

  // Launch a headless Chromium instance for fast crawling.
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Track where we've been and where we still need to visit – root first.
  const visited = new Set<string>();
  const queue: string[] = ['/'];

  type ManifestEntry = {
    selector: string;
    type: 'a' | 'button' | 'tab' | 'onclick';
    originPage: string;
    expectUrlChange: boolean;
  };
  const manifest: ManifestEntry[] = [];

  while (queue.length) {
    const currentPath = queue.shift() as string;
    if (visited.has(currentPath)) continue;
    visited.add(currentPath);

    try {
      await page.goto(`${baseURL}${currentPath}`, { waitUntil: 'domcontentloaded' });
    } catch (err) {
      // If navigation fails, skip this route and continue.
       
      console.warn(`[playwright-audit] Failed to load ${currentPath}:`, err);
      continue;
    }

    // Grab interactive DOM elements on the page.
    const entries: ManifestEntry[] = await page.evaluate(() => {
      function buildSelector(el: Element): string | null {
        // Prefer id
        if (el.id) return `#${el.id}`;
        // Fallback: text content (first 40 characters) for stability with Playwright's text selector.
        const text = el.textContent?.trim();
        if (text) return `text=${text.substring(0, 40)}`;
        return null;
      }

      const elements = Array.from(document.querySelectorAll('a, button, [role="tab"], [onclick]'));
      return elements
        .map((el) => {
          const tag = el.tagName.toLowerCase();
          const selector = buildSelector(el);
          if (!selector) return null;

          let type: ManifestEntry['type'] = tag as ManifestEntry['type'];
          if (el.getAttribute('role') === 'tab') type = 'tab';
          if (el.hasAttribute('onclick')) type = 'onclick';

          const hrefAttr = (el as HTMLAnchorElement).getAttribute?.('href');
          const expectUrlChange = !!hrefAttr && hrefAttr !== '#' && !hrefAttr?.startsWith('javascript:');

          return { selector, type, originPage: window.location.pathname, expectUrlChange } as ManifestEntry;
        })
        .filter(Boolean) as ManifestEntry[];
    });

    // Append to manifest and queue up new routes found via anchors.
    for (const entry of entries) {
      manifest.push(entry);

      // If the element is a link to same-origin path, queue it for crawling.
      const href = (await page.locator(entry.selector).getAttribute('href')) || undefined;
      if (href && href.startsWith('/') && !visited.has(href) && !queue.includes(href)) {
        queue.push(href);
      }
    }
  }

  await browser.close();

  // Persist manifest to the repository root so the spec file can import it.
  const outPath = path.resolve(process.cwd(), 'ui-map.json');
  fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));
  console.log(`🗺️  UI interaction map generated with ${manifest.length} entries -> ${outPath}`);
} 