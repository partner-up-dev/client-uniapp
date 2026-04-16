# Phase 6-8 Result

Status: Completed
Owner: Codex
Date: 2026-04-13

## Scope

Input route: Constraint + Reality + Artifact
Mode: Execute

Objective:

- Revalidate Product TDD, Unit TDD, and Deployment owners after PRD and Alignment restructuring.
- Clean subtree governance and convention docs that created stale or overlapping authority.
- Remove historical leftovers once replacement owners were in place.

Guardrails:

- Do not maintain outdated historical task records as current truth.
- Do not introduce permanent `docs:check` or `scripts/check-docs-integrity.js` governance.
- Keep `FILESYSTEM.md` documents file-level; route/address contracts belong to Alignment and Product TDD.
- Preserve legacy backlog themes task-locally before deleting the root mixed TODO.

## Phase 6 Outcome

Updated Product TDD:

- `docs/20-product-tdd/index.md`
- `docs/20-product-tdd/claim-realization-matrix.md`
- `docs/20-product-tdd/cross-unit-contracts.md`
- `docs/20-product-tdd/system-state-and-authority.md`
- `docs/20-product-tdd/unit-topology.md`

Updated Unit TDD:

- added `docs/30-unit-tdd/index.md`
- added Product TDD owner links to existing unit READMEs
- downgraded deprecated `unreadHandler` from active notification-message-store contract language

Updated Deployment:

- `docs/40-deployment/index.md`
- `docs/40-deployment/topology.md`
- `docs/40-deployment/runtime-authority.md`
- `docs/40-deployment/release-and-migration.md`
- `docs/40-deployment/operational-hazards.md`

Runtime env correction:

- `VITE_SUPABASE_SERVER_URL` is now documented as a current runtime variable because `src/business/oss/index.ts` uses it.
- `VITE_SUPABASE_ANYONYMOUS_KEY` and `VITE_BACKEND_MAIN_API_VERSION` remain declared but not proven as required by current runtime paths.

## Phase 7 Outcome

Updated subtree/convention docs:

- `src/pages/FILESYSTEM.md` now marks `create_start` as non-routable source and stops carrying route contract tables.
- `src/utils/README.md` was rewritten as a concise utility owner map with correct links.
- `docs/.agents/component-doc-template.md` now has an owner guard preventing PRD/alignment/Product TDD duplication.
- `src/components/AGENTS.doc.md` is now a pointer to the canonical component doc template instead of a duplicate template.
- `src/components/common/cell/cell.md` no longer links to a missing PUForm doc.
- `.github/instructions/vue.instructions.md` now references `src/pages.json` and `src/utils/vendor.ts` precisely.
- `docs/.agents/styling/utilities.md` and `partnerRequestSpecificContentEditor.scss` stale paths were corrected.

## Phase 8 Outcome

Deleted tracked leftovers:

- `docs/_svc_v91.md`
- `docs/svc-v91/index.md`
- `docs/svc-v91/drift-register.md`
- `docs/prompt-snippets.md`
- `src/components/AGENTS.md.new`
- `todo.md`

Removed ignored or empty local leftovers:

- `debug.log`
- `.depreacted/`
- empty `docs/svc-v91/` directory

Preserved:

- old SVC task folders under `tasks/` as archive records only

Updated current references:

- `AGENTS.md`
- `FILESYSTEM.md`
- `tasks/MIGRATION-MAP.md`

## Verification

- Markdown local links passed across current docs and selected subtree guidance.
- Route authority check passed for 9 active surfaces; `create_start` remains non-routable.
- Current non-historical references to deleted SVC docs, prompt snippets, stale tabbar Vue anchor, `PR_CREATE_START`, `docs:check`, and `check-docs-integrity` were checked with `rg`.
- Historical `tasks/svc-v9` and `tasks/svc-v91-*` folders stayed untouched.
- `package.json` still has no `docs:check` script.
- `git diff --check` passed.

## Residual Risks

- No type-check or test suite was run because these phases changed docs and ignored local leftovers only.
- Deleted root `todo.md` preserved themes, not every checkbox; future actionable work should be reopened as current tasks.
