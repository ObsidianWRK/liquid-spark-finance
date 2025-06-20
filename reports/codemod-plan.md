# Refactoring Codemod Plan

**Agent:** CodemodForge
**Date:** $(date)

This document outlines the steps to execute the file structure refactoring. It serves as a plan for the **MoverShaker** agent.

---

### Part 1: File Consolidation (`CONSOLIDATE_SHARED`)

**Objective:** Move all scattered shared code into a unified `src/shared` directory.

```bash
# Move utils, hooks, types, lib, config
git mv src/utils/* src/shared/utils/
git mv src/hooks/* src/shared/hooks/
git mv src/types/* src/shared/types/
git mv src/lib/* src/shared/lib/
git mv src/config/* src/shared/config/

# Move global styles
git mv src/styles/* src/app/styles/

# Move generic UI components
git mv src/components/ui/* src/shared/ui/
```

### Part 2: Reorganize Components to Features (`REORGANIZE_COMPONENTS_TO_FEATURES`)

**Objective:** Move domain-specific components into their respective feature folders.

```bash
git mv src/components/accounts/* src/features/accounts/components/
git mv src/components/budget/* src/features/budget/components/
git mv src/components/credit/* src/features/credit/components/
git mv src/components/dashboard/* src/features/dashboard/components/
git mv src/components/insights/* src/features/insights/components/
git mv src/components/investments/* src/features/investments/components/
git mv src/components/planning/* src/features/planning/components/
git mv src/components/savings/* src/features/savings/components/
git mv src/components/transactions/* src/features/transactions/components/
```

### Part 3: Reorganize Services to Features (`REORGANIZE_SERVICES_TO_FEATURES`)

**Objective:** Move service files into the feature they exclusively serve.

```bash
# These are examples; a full analysis is needed during execution.
git mv src/services/accountService.ts src/features/accounts/api/
git mv src/services/budgetService.ts src/features/budget/api/
git mv src/services/creditScoreService.ts src/features/credit/api/
# ... and so on for other services.
```

### Part 4: Decommission Directories (`DECOMMISSION_DOMAINS` and Cleanup)

**Objective:** Remove now-empty or redundant directories.

```bash
# Remove original, now empty, directories
git rm -r src/utils src/hooks src/types src/lib src/config src/styles src/components/ui
git rm -r src/components/accounts src/components/budget src/components/credit src/components/dashboard src/components/insights src/components/investments src/components/planning src/components/savings src/components/transactions
git rm -r src/domains
```

### Part 5: Codemods for Import Path Updates

**Objective:** Automatically update all import/export paths in `.ts`, `.tsx`, and `.js` files.

This will be performed by the **ImportFixer** agent. The logic will be a series of find-and-replace operations on file contents.

**Path Mapping Rules:**

- `from 'src/utils/` -> `from 'src/shared/utils/`
- `from '~/utils/` -> `from '~/shared/utils/`
- `from 'src/hooks/` -> `from 'src/shared/hooks/`
- `from '~/hooks/` -> `from '~/shared/hooks/`
- `from 'src/types/` -> `from 'src/shared/types/`
- `from '~/types/` -> `from '~/shared/types/`
- `from 'src/lib/` -> `from 'src/shared/lib/`
- `from '~/lib/` -> `from '~/shared/lib/`
- `from 'src/components/ui/` -> `from 'src/shared/ui/`
- `from '~/components/ui/` -> `from '~/shared/ui/`
- `from 'src/components/accounts/` -> `from 'src/features/accounts/components/`
- `from '~/components/accounts/` -> `from '~/features/accounts/components/`
- ... and so on for every moved directory.

### Part 6: Configuration Updates

**Objective:** Update all workspace configuration files with new paths and aliases.

The **ConfigGuardian** agent will be responsible for updating these files:

- `tsconfig.json` (paths and aliases)
- `vite.config.ts` (aliases)
- `playwright.config.ts` (test directories)
- `jest.config.js` (if present)
- `.eslintrc.js` (import rules)

---

This plan is reversible by reversing the `git mv` and `git rm` commands. The import paths would need to be reverted using the same mapping rules.
