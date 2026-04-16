# Formal Migration Proposal

Date: 2026-04-07
Authority baseline: upstream `xiaoland/svc` `main` HEAD, commit `c5a120d`

## Fixed decisions

- Upstream authority:
  - `xiaoland/svc` `main` HEAD is the only authority for this migration.
- Source-first precedence:
  - upstream `src/` documentation outranks upstream `README.md` and `CHANGELOG.md` when they disagree.
- Governance tooling constraint:
  - remove `scripts/check-docs-integrity.js` references from durable repo state
  - do not introduce a new permanent replacement by default
  - if temporary audit tooling is needed during migration, keep it under this task or another task-local workspace only
- Task governance scope update recorded on 2026-04-13:
  - update current task templates and task-layer entry guidance
  - do not maintain outdated historical task records while doing so
  - leave `tasks/MIGRATION-MAP.md` unchanged unless a later cleanup pass reopens archive mapping

## Target state

The target state is not "more docs". It is "correct owners, less drift, and fewer fake guardrails."

### 1. Root front door

`AGENTS.md` should become a typed-input-first front door:

- input types:
  - `Intent`
  - `Constraint`
  - `Reality`
  - `Artifact`
- mode overlay:
  - `Explore`
  - `Solidify`
  - `Execute`
  - `Diagnose`
- local-doc consumption rule:
  - recurse into nearest subtree `AGENTS.md`

### 2. Meta engine

Add `docs/00-meta/` as the durable owner for:

- input route docs
- mode SOPs
- concept dictionary
- reusable handshake / protocol rules

### 3. PRD

Restructure `docs/10-prd/` into:

- `index.md`
- `glossary.md`
- `_drivers/`
- `behavior/`
- `domain-structure/`

This is a structural migration, not a wording pass.

### 4. Alignment

Keep `docs/15-alignment/`, but rewrite it as an alignment substrate:

- retain useful assets
- revalidate every anchor
- separate coordination grammar from durable truth ownership

### 5. Product / Unit / Deployment TDD layers

Keep the existing `20/30/40` directories, but revalidate them against the new owners:

- `20-product-tdd/` for cross-unit contracts and authority
- `30-unit-tdd/` only where local design memory is worth preserving
- `40-deployment/` only for real runtime/ops truth

### 6. Local conventions

Split current conventions by owner:

- SVC-core workflow guidance -> `docs/00-meta/`
- project-wide coding conventions -> keep in `docs/.agents/` if still repo-specific
- tactical local hazards -> subtree `AGENTS.md`

### 7. Tasks

Task governance should be updated only at the current entry/template level:

- `tasks/README.md`
- `tasks/templates/PLAN.template.md`
- `tasks/templates/RESULT.template.md`
- `tasks/templates/PROMOTION-CHECKLIST.md`

Historical task records stay as historical records and should not be maintained as current truth.

### 8. Historical material

Historical SVC transition artifacts should stop acting as current truth:

- `docs/_svc_v91.md`
- `docs/svc-v91/*`
- old SVC migration tasks

Keep them only as temporary migration references or explicit archives.

## Execution order

The sequence below is designed to reduce blast radius and avoid rewriting the same docs twice.

### Phase 1: Remove false governance signals

Goal:

- eliminate broken claims before introducing new structure

Work:

- remove `docs:check` and `check-docs-integrity.js` references from:
  - `package.json`
  - historical result notes that still present them as active guardrails
  - any current governance docs that imply the script exists
- mark historical references as historical if they must be preserved

Reason for order:

- as long as fake guardrails remain, every later doc claim is less trustworthy

### Phase 2: Install the new front door

Goal:

- align root operating model with upstream `main` HEAD

Work:

- rewrite root `AGENTS.md`
- create `docs/00-meta/`
- move route/mode/concept ownership into `docs/00-meta/`

Likely affected durable files:

- `AGENTS.md`
- `FILESYSTEM.md`
- new `docs/00-meta/*`

### Phase 3: Rework current task templates

Goal:

- make new tasks use typed-input routing and MVT anchors without editing historical task records

Work:

- update `tasks/README.md`
- update `tasks/templates/PLAN.template.md`
- update `tasks/templates/RESULT.template.md`
- update `tasks/templates/PROMOTION-CHECKLIST.md`

Out of scope:

- historical task records
- `tasks/legacy/**`
- old SVC migration task folders
- archive mapping changes unless separately requested

### Phase 4: Rebuild PRD structure

Goal:

- move from flat bootstrap PRD to upstream one-way derivation PRD

Work:

- create `_drivers/`, `behavior/`, `domain-structure/`
- migrate content from:
  - current `docs/10-prd/*`
  - `docs/partner.md`
  - any still-relevant product semantics outside PRD
- retire empty or low-value leftovers such as `docs/business.md`

Reason for order:

- PRD is the product owner layer and should stabilize before technical owner layers are rewritten deeply

### Phase 5: Rewrite alignment as substrate

Goal:

- keep useful coordination assets while aligning them with the upstream model

Work:

- rewrite `docs/15-alignment/README.md`
- rewrite change request template
- revalidate `ui-surface-map.md`
- keep only calculable / accurate anchors

Specific fixes already known:

- replace the stale `src/custom-tab-bar/index.vue` anchor
- revisit all page-flow anchors involving `create_start`

### Phase 6: Revalidate Product TDD / Unit TDD / Deployment

Goal:

- make existing `20/30/40` docs match the reworked owners instead of the old v9.1 story

Work:

- update `docs/20-product-tdd/*`
- decide whether `docs/30-unit-tdd/*` pilots stay, move, expand, or shrink
- update `docs/40-deployment/*` without adding fake automation claims

Reason for order:

- these layers should inherit the new owner boundaries from phases 2 to 5

### Phase 7: Clean subtree governance and conventions

Goal:

- reduce overlap between `docs/.agents/*`, subtree docs, and durable layers

Work:

- audit `docs/.agents/*`
- keep only project-specific conventions there
- push tactical hazards into subtree `AGENTS.md`
- correct inaccurate subtree docs such as:
  - `src/pages/FILESYSTEM.md`
  - `src/utils/README.md`
  - broken component doc links

### Phase 8: Archive or delete historical leftovers

Goal:

- remove stale or duplicate material once superseded

Candidates:

- `docs/_svc_v91.md`
- `docs/svc-v91/*`
- `src/components/AGENTS.md.new`
- `.depreacted/`
- `debug.log`
- `docs/prompt-snippets.md`
- `todo.md`

Rule:

- only delete after the replacement owner is already in place

### Phase 9: Final manual verification sweep

Goal:

- verify the migration without relying on a permanent repo-level integrity script

Verification methods:

- targeted `rg`-based reference audits
- manual link checks for changed docs
- docs-vs-filesystem spot checks
- command sanity checks where relevant

## Recommended cleanup priorities

### Priority A: must be fixed early

- broken `docs:check` references
- root AGENTS front-door mismatch
- missing `docs/00-meta/`
- inaccurate high-level maps and anchors

### Priority B: migrate after owner structure exists

- flat `docs/10-prd/`
- old alignment-pack framing
- overlapping `docs/.agents/*` content
- historical v9.1 docs acting as current truth

### Priority C: safe late cleanup

- duplicate drafts
- stubs
- empty or misspelled directories
- tactical leftovers in root

## Risks and controls

### Risk: rewriting too much at once

Control:

- phase the migration by durable owner, not by folder count

### Risk: deleting useful knowledge as "legacy"

Control:

- use the cleanup candidate list to distinguish "misplaced but valuable" from "disposable"

### Risk: replacing one fake governance mechanism with another

Control:

- do not introduce a new permanent doc-integrity script unless later pressure proves it necessary

### Risk: keeping historical docs alive as shadow truth

Control:

- explicitly mark historical material as archive or delete it after supersession

## Ready-for-Solidify outputs from this task

This task can now feed a later Mode B / Mode C pass with:

- locked authority baseline
- inventory of current durable and legacy surfaces
- explicit migration order
- cleanup candidate classification
- constraints against reintroducing fake governance tooling
