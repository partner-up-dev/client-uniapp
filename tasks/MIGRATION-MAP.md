# Legacy task migration map

This map records the completed migration from legacy task roots into root `tasks/`.

## Migration status

- Source removed: `docs/task/`
- Source removed: `docs/plan/`
- Source removed: `docs/explore-plan/`
- Destination root: `tasks/`
- Legacy archive: `tasks/legacy/plan/` and `tasks/legacy/explore-plan/`

## Legacy plan archive (`tasks/legacy/plan/`)

- `tasks/legacy/plan/i18n-refactor-2026-01-20` (status: completed historical record)
- `tasks/legacy/plan/locale-jsonc-migration-2026-01-21` (status: completed for global JSONC; follow-up migration deferred)
- `tasks/legacy/plan/locale-reorganization-2026-01-20` (status: completed for structure; translations intentionally partial)
- `tasks/legacy/plan/vue-i18n-v11-migration` (status: deferred historical plan)
- `tasks/legacy/plan/locale-messages-pattern-2026-01-20` (status: archived stub)

## Legacy exploration archive (`tasks/legacy/explore-plan/`)

- `tasks/legacy/explore-plan/business-layer-2026-01-18` (status: archived placeholder; RESULT-only)
- `tasks/legacy/explore-plan/pages-2026-01-18` (status: archived placeholder; RESULT-only)
- `tasks/legacy/explore-plan/store-layer-2026-01-18` (status: archived placeholder; RESULT-only)
- `tasks/legacy/explore-plan/svc-v91-governance-2026-03-31` (status: historical snapshot; superseded by `docs/svc-v91/drift-register.md`)

## Operating rule

- New work must be created directly under `tasks/`
- Re-open legacy work by creating `tasks/<task>/PLAN.md` and linking back to the legacy folder
- Keep legacy folders read-only except for explicit historical correction notes
