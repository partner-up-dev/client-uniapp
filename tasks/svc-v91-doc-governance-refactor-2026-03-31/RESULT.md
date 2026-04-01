# SVC v9.1 drift review and governance refactor - Result

Status: Completed
Owner: Copilot
Date: 2026-03-31

## Summary

- Audited repo documentation against `docs/_svc_v91.md` and produced a durable drift ledger.
- Refactored the alignment layer into a usable pack (template + glossary + surface map + operation taxonomy).
- Added legacy archive entrypoint READMEs and historical snapshot warnings to prevent stale-plan misuse.
- Fixed stale references to non-existent style instruction files.
- Extended docs integrity checks to enforce alignment pack completeness and legacy archive notices.

## Changes

- Added `docs/svc-v91/drift-register.md`.
- Updated `docs/svc-v91/index.md` with current governance artifact links.
- Updated `docs/15-alignment/README.md` and `docs/15-alignment/change-request-template.md`.
- Added `docs/15-alignment/surface-glossary.md`.
- Added `docs/15-alignment/ui-surface-map.md`.
- Added `docs/15-alignment/operation-taxonomy.md`.
- Added `tasks/legacy/plan/README.md` and `tasks/legacy/explore-plan/README.md`.
- Updated `tasks/README.md` and `tasks/MIGRATION-MAP.md`.
- Added historical warnings in `tasks/svc-v9/PLAN.md` and `tasks/legacy/explore-plan/svc-v91-governance-2026-03-31/RESULT.md`.
- Fixed stale style guidance links in:
  - `docs/.agents/shared-conventions.md`
  - `docs/.agents/styling/references.md`
  - `src/pages/AGENTS.md`
  - `src/pages/ARCHITECTURE.md`
  - `.github/chatmodes/new-comp.chatmode.md`
- Updated `scripts/check-docs-integrity.js` with alignment/legacy checks.

## Tests

- `pnpm docs:check` (passed)

## Promotions

- PRD updates: none
- Product TDD updates: none
- Unit TDD updates: none

## Follow-ups

- Physical migration completed in `tasks/svc-v91-root-task-migration-2026-03-31`.
- Wire `pnpm docs:check` into CI if not already enforced.
