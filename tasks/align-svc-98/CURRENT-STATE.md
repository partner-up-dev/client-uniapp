# Current State Inventory

Date of exploration: 2026-04-06

## Workspace overview

- Root governance files present:
  - `AGENTS.md`
  - `ARCHITECTURE.md`
  - `FILESYSTEM.md`
- Folder-level governance files present:
  - `src/business/{AGENTS,ARCHITECTURE,FILESYSTEM}.md`
  - `src/pages/{AGENTS,ARCHITECTURE,FILESYSTEM}.md`
  - `src/store/{AGENTS,ARCHITECTURE,FILESYSTEM}.md`
  - `src/components/AGENTS.md`
  - `src/locale/AGENTS.md`
- Key top-level directories:
  - `docs/`
  - `tasks/`
  - `src/`
  - `tests/`
  - `.github/`
  - `scripts/`

## Quantitative inventory

- `docs/`: 61 files, 61 markdown files
- `tasks/`: 28 files, 28 markdown files
- `src/`: 422 files, 68 markdown files, 40 JSONC files
- Layer counts:
  - `docs/10-prd`: 7 files
  - `docs/15-alignment`: 5 files
  - `docs/20-product-tdd`: 5 files
  - `docs/30-unit-tdd`: 18 files
  - `docs/40-deployment`: 5 files
  - `docs/.agents`: 10 files
  - `tasks/legacy`: 17 files
  - `src/pages`: 33 files
  - `src/components`: 236 files

## Current SVC mapping in the repo

- The repo currently self-describes as aligned to SVC v9.1:
  - historical reference file: `docs/_svc_v91.md`
  - repo mapping index: `docs/svc-v91/index.md`
  - drift ledger: `docs/svc-v91/drift-register.md`
- Root `AGENTS.md` implements:
  - Mode A / B / C
  - pre-execution restatement checklist
  - task-first exploration rule
- Root `AGENTS.md` does not implement the later upstream front door:
  - typed input classification (`Intent | Constraint | Reality | Artifact`)
  - `Mode D: Diagnose`
  - `docs/00-meta/` as the meta-engine owner

## Actual code topology confirmed from source

### Boot and global wiring

- `src/main.ts`
  - creates the app
  - installs Pinia and `pinia-plugin-unistorage`
  - installs i18n
- `src/App.vue`
  - calls `Account.login(false)` in `onLaunch`
  - sets global background style
- `src/pages.json`
  - declares tabbar pages and runtime routes

### Cross-unit authority points checked directly

- `src/business/http-api.ts`
  - injects auth headers from the account store
  - updates token from response headers
  - retries on `401`
  - lazy-parses bodies via `Body.parsed`
- `src/business/db-api.ts`
  - re-creates PostgREST builders per request
  - refreshes auth headers on each operation
  - throws if `VITE_PGRST_URL` is missing
- `src/store/communication/message.ts`
  - is older-style code and still contains deprecated logic paths
  - manages message cache, history, and unread counts
- `src/locale/index.ts`
  - resolves locale from `uni.getLocale()`
  - only selects `zh-Hans` or `en-US`
  - exposes `t`, `tm`, and `useTranslate()`
- `src/data/enum.ts` + `src/data/mapper.ts` + `src/utils/vendor.ts`
  - own `PAGE_ID`, `PAGE_PATH`, and `navigate()`
  - drive tabbar-vs-normal routing behavior

## Documentation shape currently in use

### Durable docs

- `docs/10-prd/`
  - present, but flat
  - currently contains inferred summaries, not a one-way derivation structure
- `docs/15-alignment/`
  - present
  - still organized as a static pack of assets rather than the later upstream substrate model
- `docs/20-product-tdd/`
  - present
  - useful baseline, but skeletal
- `docs/30-unit-tdd/`
  - present for three pilot units
  - useful but intentionally thin
- `docs/40-deployment/`
  - present
  - lightweight operational baseline

### Meta / conventions docs outside SVC layers

- `docs/.agents/`
  - shared coding conventions and styling docs
  - acts as a project conventions library
  - does not match upstream `docs/00-meta/` semantics
- `.github/instructions/`
  - additional coding/doc instructions

### Tasks layer

- Canonical root exists: `tasks/`
- Current templates are still `PLAN.md` / `RESULT.md` status-oriented templates
- Legacy task archives remain under:
  - `tasks/legacy/plan/`
  - `tasks/legacy/explore-plan/`

## Evidence-backed drift already confirmed

### Broken governance tooling

- `package.json` contains:
  - `docs:check = node scripts/check-docs-integrity.js`
- Actual filesystem:
  - `scripts/check-docs-integrity.js` is missing
- Command evidence:
  - `pnpm docs:check` fails with `MODULE_NOT_FOUND`

### Structural drift in docs

- `docs/15-alignment/ui-surface-map.md`
  - references `src/custom-tab-bar/index.vue`
  - actual tree only has `index.js`, `index.json`, `index.wxml`, `index.wxss`
- `src/pages/FILESYSTEM.md`
  - treats `partner_request/create_start` as part of the active page flow
  - actual `src/pages.json` does not register `create_start`
- `src/utils/README.md`
  - contains broken relative links to `.github/instructions/...`
- `src/components/common/cell/cell.md`
  - links to missing `../PUForm/PUForm.md`

### Duplicate or obviously stale artifacts

- `src/components/AGENTS.md.new`
  - duplicate candidate with encoding corruption
- `src/components/AGENTS.doc.md`
  - component-doc template guidance outside the main SVC layer model
- `.depreacted/`
  - empty misspelled directory
- `docs/business.md`
  - 51-byte stub
- `docs/prompt-snippets.md`
  - two-line snippet file, not integrated into the current workflow
- `todo.md`
  - root backlog note, likely tactical and not SVC-owned
- `debug.log`
  - root log artifact

## PRD maturity assessment

- Current `docs/10-prd/` files are short and serviceable as a bootstrap.
- They do not yet implement the upstream one-way derivation shape:
  - `_drivers/`
  - `behavior/`
  - `domain-structure/`
- `docs/10-prd/index.md` still points back to old topic docs:
  - `docs/partner.md`
  - `docs/business.md`

## High-value docs that likely deserve migration, not deletion

- `docs/array-class-support.md`
- `docs/valibot-extend.md`
- `docs/style.md`
- `docs/unocss.md`
- `docs/partner.md`
- `docs/.agents/*`

These look like real knowledge assets, but some are misplaced relative to later SVC ownership.
