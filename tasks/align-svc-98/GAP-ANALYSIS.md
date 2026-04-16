# Gap Analysis

Status date: 2026-04-06
Reference baseline used for comparison: upstream SVC `main` HEAD at commit `c5a120d` (source docs describe `v9.7`)

## Executive view

The repo is not "slightly behind" SVC. It is carrying a functioning but older v9.1-style adoption layer plus a set of historical and tactical docs that have grown around it. The migration problem is therefore structural, not cosmetic.

## Priority gaps

| Area | Current repo state | Upstream expectation | Severity | Notes |
| --- | --- | --- | --- | --- |
| Root front door | Mode A/B/C and restatement exist in `AGENTS.md` | typed input classification + mode overlay + negotiation triggers | High | Current repo is still mode-first |
| Meta engine | no `docs/00-meta/` | `docs/00-meta/` owns route docs, mode SOPs, concepts | High | Biggest missing durable owner |
| PRD structure | flat bootstrap files in `docs/10-prd/` | `_drivers/`, `behavior/`, `domain-structure/`, `glossary.md` | High | Current PRD is still pre-v9.4 |
| Tasks protocol | `PLAN.template.md` / `RESULT.template.md` status style | MVT task packet with optional scaffold | High | Current tasks model is older and heavier |
| Alignment | static pack with useful assets | substrate model with seven primitives and handshake relationship | Medium-High | Existing files are useful, but model is old |
| Governance tooling | `docs:check` declared but broken | broken references must be removed; verification may use manual or task-local temporary tooling | High | Permanent `check-docs-integrity` reintroduction is out of bounds |
| Local tactical docs | partial subtree AGENTS coverage + `docs/.agents/*` | local AGENTS near fragile seams, meta docs separate | Medium | Needs owner cleanup, not blind deletion |
| Historical snapshots | `docs/_svc_v91.md`, `docs/svc-v91/*`, old task folders still shape thinking | historical material should not pose as current source of truth | Medium-High | Current repo still depends on some of them |
| Broken docs | known stale anchors and broken links | integrity should be mechanically checkable | Medium | Multiple concrete defects already confirmed |
| Legacy leftovers | duplicates, stubs, temp docs, empty folders | task and durable spaces should stay clean | Medium | Easy cleanup wins exist |

## Detailed observations

### 1. Root AGENTS is now behind upstream SVC semantics

What exists now:

- repo overview
- Mode A / B / C
- pre-execution restatement
- task-first exploration

What is missing against upstream:

- input-type routing
- explicit owner cheat sheet
- `Mode D: Diagnose`
- `docs/00-meta/` read path
- clearer split between route ownership and current working posture

Implication:

- the repo's current front door can still function, but it no longer matches upstream SVC's primary mental model.

### 2. The repo skipped the `docs/00-meta/` layer entirely

What exists now:

- `docs/.agents/*`
- `.github/instructions/*`
- root `AGENTS.md`

What upstream expects:

- a dedicated meta-engine layer for route protocols, mode SOPs, and framework concepts

Implication:

- reusable framework-level workflow rules are currently scattered between root AGENTS, task templates, docs snapshots, and convention docs.

### 3. PRD exists, but still as a bootstrap snapshot

Strengths:

- there is already a PRD directory
- current files capture some real product semantics

Gaps:

- no `_drivers/`
- no `behavior/`
- no `domain-structure/`
- current `index.md` still depends on old topic docs, including a nearly empty `docs/business.md`

Implication:

- PRD needs restructuring, not just wording cleanup.

### 4. Alignment is partly useful and partly stale

Useful parts:

- `surface-glossary.md`
- `ui-surface-map.md`
- `operation-taxonomy.md`
- change request template

Problems:

- stale anchor to `src/custom-tab-bar/index.vue`
- current model is still "alignment pack" era
- impact handshake ownership is not split the upstream way

Implication:

- keep the assets, but rewrite their governing story and revalidate every anchor.

### 5. Task governance needs redesign, not just more folders

What exists now:

- canonical `tasks/`
- legacy archives
- repo-level templates

Gaps:

- templates are still v9.1-flavored and status-heavy
- MVT is not the default repo-native task grammar
- historical task artifacts still dominate SVC reasoning

Implication:

- the migration should update the task operating contract before using tasks as proof of alignment.

### 6. Broken automation makes current governance claims unreliable

Evidence:

- `pnpm docs:check` fails because `scripts/check-docs-integrity.js` is missing
- old task results claim that this script existed and passed

Implication:

- this repo currently has no trustworthy automated doc-integrity guardrail even though several docs claim otherwise.

### 7. Documentation accuracy is uneven even inside documented areas

Confirmed mismatches:

- `ui-surface-map.md` points to a non-existent Vue tabbar entrypoint
- `src/pages/FILESYSTEM.md` documents `create_start` as active flow page, but `pages.json` does not register it
- `src/utils/README.md` has broken relative links
- `cell.md` links to a missing component doc

Implication:

- part of the cleanup work should be accuracy repair, not only structure migration.

## Recommended migration sequence

### Stage 0: Lock baseline and constraints

- Treat `xiaoland/svc` `main` HEAD as authoritative.
- Treat `scripts/check-docs-integrity.js` and `docs:check` as cleanup targets, not restoration targets.
- Use temporary task-local scripts only when needed during migration.

### Stage 1: Restore trustworthy governance primitives

- remove broken `docs:check` / `check-docs-integrity` references from durable docs and tooling
- decide the future of `docs/_svc_v91.md` and `docs/svc-v91/*`
- define the new root AGENTS front door and `docs/00-meta/`

### Stage 2: Rebuild durable owners

- restructure `docs/10-prd/`
- decide what remains in `docs/.agents/`
- align `docs/15-alignment/`, `docs/20-product-tdd/`, `docs/30-unit-tdd/`, `docs/40-deployment/`

### Stage 3: Clean historical and stray artifacts

- archive, delete, or migrate duplicate docs and leftovers
- repair broken links and stale anchors
- revisit local subtree docs for accuracy

### Stage 4: Re-run verification

- manual link audits
- task-local temporary audits if needed
- link checks
- targeted docs-vs-filesystem spot checks

## Proposed defaults before Mode B

- `docs/.agents/*` should be kept only where they remain project-specific convention docs; SVC-core workflow ownership should move to `docs/00-meta/` or local subtree AGENTS.
- `docs/svc-v91/*` and `docs/_svc_v91.md` should be treated as historical transition material, not as current governance.
- Permanent repo-level doc-integrity scripts should not be part of the target state unless later pressure proves they are necessary.
