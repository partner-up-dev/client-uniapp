# SVC v9.1 drift register

Date: 2026-03-31
Scope: documentation governance and SVC v9.1 alignment
Reference baseline: `docs/_svc_v91.md`

## Drift ledger

| ID | Severity | Drift | Evidence | Impact | Repair plan | Status |
| --- | --- | --- | --- | --- | --- | --- |
| DR-001 | High | Historical snapshots were easy to misread as current truth | `tasks/svc-v9/PLAN.md`, `tasks/legacy/explore-plan/svc-v91-governance-2026-03-31/RESULT.md` | Agents can follow obsolete gap statements and reopen already-solved issues | Add historical warning banners and point to current governance index | Fixed in this refactor |
| DR-002 | High | Legacy task roots lacked explicit archive entrypoints | `tasks/legacy/plan/`, `tasks/legacy/explore-plan/` had no root README archive guard | New work could be created outside Mode A sandbox (`tasks/`) | Add archive READMEs and reinforce migration rules in task lifecycle docs | Fixed in this refactor |
| DR-003 | High | Alignment pack was underpowered for project size (template-only) | `docs/15-alignment/` had only README + one template | Reference-sensitive changes lacked stable address vocabulary and operation classes | Add surface glossary, UI surface map, and operation taxonomy | Fixed in this refactor |
| DR-004 | Medium | Multiple docs referenced non-existent style instruction file | `.github/instructions/style.instructions.md` references in docs and page governance files | Broken links reduce trust and onboarding quality | Replace stale links with existing styling docs and conventions | Fixed in this refactor |
| DR-005 | Medium | Docs integrity checks did not guard alignment pack completeness or legacy archive markers | `scripts/check-docs-integrity.js` only validated links and task artifacts | Governance regressions could reappear silently | Extend integrity checks with required alignment files and legacy README checks | Fixed in this refactor |
| DR-006 | Medium | Migration map did not clearly state supersession relationships | `tasks/MIGRATION-MAP.md` did not mark governance exploration as superseded | Reviewers could use stale references during planning | Update migration map with superseded target and read-only policy | Fixed in this refactor |
| DR-007 | High | Task layer paths diverged from SVC v9.1 canonical model | Task docs were split across `docs/task`, `docs/plan`, and `docs/explore-plan` | Mode A execution could drift and archive boundaries were unclear | Migrate all task artifacts to root `tasks/`, move history to `tasks/legacy/*`, and remove old roots | Fixed in this migration |

## Open follow-ups

- Physical relocation is complete: old `docs/plan`, `docs/explore-plan`, and `docs/task` were removed and migrated into `tasks/`.
- Add CI wiring for `pnpm docs:check` so governance drift fails early in pull requests.
