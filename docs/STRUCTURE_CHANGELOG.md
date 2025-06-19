# Documentation Structure Changelog

## 2025-06-19 – Initial repository rationalization

• Created new structured hierarchy under `docs/`:
  - `guides/`
  - `reports/`
  - `changelogs/`
  - `architecture/`
  - `api/`
  - `procedures/`
• Standardized Markdown filenames to kebab-case with type prefixes.
• Moved 46 legacy Markdown files out of repository root (and other scattered locations) preserving Git history with `git mv`.
• Added `target_structure.yaml`, `file_inventory.json`, `file_tags.json`, `potential_dupes.json`, and `migration_plan.md` to document the process.
• Ensured `.github/ISSUE_TEMPLATE/*` and `playwright-report/` artefacts remain untouched.
• All moved Markdown files pass `markdownlint` default rules (no broken links, proper headings). 