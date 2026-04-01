# SVC v9.1 root tasks migration - Result

Status: Completed
Owner: Copilot
Date: 2026-03-31

## Summary

- Deleted legacy task roots under docs/ by migrating them into root tasks/.
- Established tasks/ as the only canonical Mode A workspace and task archive location.
- Updated governance docs and link-check automation for the new structure.

## Changes

- Moved `docs/task/*` to `tasks/*`.
- Moved `docs/plan/*` to `tasks/legacy/plan/*`.
- Moved `docs/explore-plan/*` to `tasks/legacy/explore-plan/*`.
- Removed old directories: `docs/task`, `docs/plan`, `docs/explore-plan`.
- Updated `AGENTS.md`, `docs/svc-v91/index.md`, `docs/svc-v91/drift-register.md`, `FILESYSTEM.md`, and `tasks/MIGRATION-MAP.md`.
- Updated `scripts/check-docs-integrity.js` to validate markdown links across `docs/` and `tasks/` and to validate task artifacts in root `tasks/`.

## Tests

- `pnpm docs:check` (passed)

## Promotions

- PRD updates: none
- Product TDD updates: none
- Unit TDD updates: none

## Follow-ups

- Wire `pnpm docs:check` into CI if not already enabled.
