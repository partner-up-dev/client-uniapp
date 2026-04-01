# SVC v9.1 Implementation Plan

> Historical baseline snapshot (2026-03-31).
> Gap statements in this file describe pre-implementation state and are not current repository truth.
> For current status, use `docs/svc-v91/index.md` and `docs/svc-v91/drift-register.md`.

## 0. Objective

Implement Sustainable Vibe Coding (SVC) v9.1 in this repository as a selective memory system, with minimum ceremony and maximum practical value.

Primary outcomes:

- keep product truth, technical truth, and volatile task reasoning clearly separated
- enforce the dynamic execution protocol (Mode A/B/C) so ambiguity is handled without polluting durable docs or code
- require pre-execution restatement for reference-sensitive or logic-altering changes
- reduce human-agent drift from ambiguous references and stale docs
- preserve only expensive-to-rediscover truths in durable docs
- keep implementation truth in code, tests, CI, and runtime checks

Planning date: 2026-03-31

## 1. Exploration Summary (Evidence)

This plan is based on repository exploration plus sub-agent audits.

### 1.1 Existing durable documentation baseline

Current durable guidance is strong at architecture/navigation level:

- root governance: AGENTS.md, ARCHITECTURE.md, FILESYSTEM.md
- subsystem triplets: src/business, src/pages, src/store each has AGENTS.md / ARCHITECTURE.md / FILESYSTEM.md
- agent guidance library: docs/.agents/*
- topic docs: docs/business.md, docs/partner.md, docs/style.md, docs/troubleshooting.md, docs/unocss.md, docs/array-class-support.md, docs/valibot-extend.md

### 1.2 Existing volatile planning baseline

Current task-like documentation is split across tasks, tasks/legacy/plan, and tasks/legacy/explore-plan.

Observed patterns:

- tasks only contains this plan and no lifecycle templates yet
- tasks/legacy/plan contains a mix of PLAN+RESULT pairs and PLAN-only tasks
- tasks/legacy/plan includes at least one empty stub folder with no artifacts
- tasks/legacy/explore-plan contains multiple empty folders with no trace of exploration

This confirms that volatility already exists, but lifecycle discipline is inconsistent and not anchored to the v9.1 task-first rule.

### 1.3 Governance and protocol gaps (v9.1)

- AGENTS.md lacks the dynamic execution protocol (Mode A/B/C) and the pre-execution restatement checklist
- the repo does not define how the v9.1 tasks/ sandbox maps to tasks, so Mode A has no explicit home
- the AGENTS instruction to update docs immediately conflicts with Mode A, which forbids durable doc changes during exploration
- i18n guidance is internally inconsistent (useI18n vs useTranslate) across AGENTS, pages docs, and docs/.agents

### 1.4 Gaps versus SVC v9.1 layers

Layer-level gaps:

- PRD layer: missing as a coherent, explicit source of product what/why
- Product TDD layer: missing as stable cross-unit technical truth
- Unit TDD layer: implicit knowledge exists in code/comments/tests, but no explicit hard-unit design memory
- Deployment layer: no non-trivial runtime/rollback/release memory set
- Task layer: exists but fragmented and inconsistently closed
- Alignment substrate: partially present via conventions, but drift remains (stale references and mixed i18n guidance)

### 1.5 High-risk units to prioritize

From direct code exploration, the first units that justify durable technical memory are:

- src/business/http-api.ts
  - cross-cutting auth header injection, status handling, 401 retry/login, operation_id reporting
- src/business/db-api.ts
  - fresh-builder auth semantics, environment assumptions, table schema behavior
- src/store/communication/message.ts
  - message history/unread state transitions, recursive counting, deprecated flow retained
- src/locale/index.ts + docs around i18n usage
  - active mismatch between documented direction and in-code usage migration status

## 2. Repo-Specific Target Model

Adopt the SVC v9.1 folder model under docs/ with minimal first-wave scope:

- docs/10-prd/
- docs/15-alignment/
- docs/20-product-tdd/
- docs/30-unit-tdd/
- docs/40-deployment/
- tasks/

Execution protocol policy:

- Mode A (Exploration): only work inside tasks, do not change PRD/TDD/production code
- Mode B (Solidification): restate scope/invariants, then promote stable truths into PRD or Product TDD
- Mode C (Execution): restate scope/invariants, then implement tests and code changes

Task layer policy:

- tasks becomes canonical volatile execution space for new work (this repo's mapping for v9.1 tasks/)
- tasks/legacy/plan is treated as legacy task archive and migrated incrementally

## 3. Adoption Strategy (Minimal First)

Do not perform a big-bang migration.

Use a five-wave rollout:

1. establish structure and governance (including Mode A/B/C protocol)
2. normalize task lifecycle
3. write minimal cross-unit truth
4. pilot Unit TDD on hard units
5. add lightweight operational/deployment memory and integrity checks

## 4. Phased Plan

## Phase 0 - Foundation and Operating Contract

Goal: establish SVC v9.1 skeleton and local operating contract with minimal overhead.

Actions:

- create durable layer folders under docs/
- create tasks/README.md with lifecycle states and closure rules
- update root AGENTS.md with the v9.1 dynamic execution protocol (Mode A/B/C) and the reference-sensitive pre-execution restatement checklist:
  - target
  - target path/anchor
  - state/context
  - operation
  - scope
  - invariants
  - likely affected files
  - uncertainty
- document how Mode A interacts with the existing "update docs immediately" rule (allow task-only capture during exploration)
- define tasks as the canonical Mode A sandbox (this repo's mapping of v9.1 tasks/)
- define promotion and demotion rules in one index doc so contributors know when to promote task knowledge

Deliverables:

- docs/svc-v91/index.md (or equivalent top-level explainer)
- tasks/README.md
- root AGENTS.md update

Exit criteria:

- new SVC folders exist
- AGENTS.md explicitly points to SVC operating model
- no mandatory process added beyond what solves current drift

## Phase 1 - Task Layer Normalization

Goal: make volatile docs reliable and auditable.

Actions:

- define a task template in tasks/templates/
  - PLAN.md template
  - RESULT.md template
  - promotion-review checklist
- require every active task folder to contain status and owner
- triage tasks/legacy/plan and tasks/legacy/explore-plan into explicit states (active, completed-needs-result, archived-empty, cancelled)
- backfill high-priority incomplete historical task folders:
  - tasks/legacy/plan/vue-i18n-v11-migration (missing RESULT)
  - tasks/legacy/plan/locale-messages-pattern-2026-01-20 (empty stub)
  - tasks/legacy/explore-plan/* (empty folders need archive notes)
- resolve ambiguous completion state in legacy plans (PLAN checklists vs RESULT narrative)
- add a simple migration map from tasks/legacy/plan/*to tasks/* for ongoing work

Deliverables:

- tasks/templates/PLAN.template.md
- tasks/templates/RESULT.template.md
- tasks/MIGRATION-MAP.md

Exit criteria:

- every active task has PLAN + explicit state
- every completed task has RESULT + promotion review
- no empty active task directories

## Phase 2 - PRD Layer Bootstrap

Goal: make product what/why explicit without over-documenting implementation.

Actions:

- create docs/10-prd/ minimal set:
  - index.md
  - product-pressures.md
  - product-claims.md
  - workflows.md
  - rules-and-invariants.md
  - scope-and-open-questions.md
  - glossary.md
- seed initial content from existing product-facing knowledge in code/docs
- keep implementation details out of PRD

Deliverables:

- first complete PRD baseline under docs/10-prd/

Exit criteria:

- canonical product semantics live in one place
- ambiguous terms currently spread across docs are resolved in glossary

## Phase 3 - Product TDD Baseline

Goal: preserve cross-unit technical truths that code alone does not communicate cheaply.

Actions:

- create docs/20-product-tdd/ minimal set:
  - index.md
  - unit-topology.md
  - system-state-and-authority.md
  - cross-unit-contracts.md
  - claim-realization-matrix.md
- explicitly capture high-value cross-unit contracts first:
  - auth token authority and update path
  - HTTP/DB client boundary and shared assumptions
  - i18n authority (global vs local messages)
  - navigation/page-id/page-path authority

Deliverables:

- docs/20-product-tdd/* baseline files

Exit criteria:

- at least 3 cross-unit contracts are written and reviewed
- each contract references executable guardrails where available

## Phase 4 - Unit TDD Pilots (Hard Units Only)

Goal: dissolve local complexity where regressions are costly.

Pilot units (in order):

1. HTTPApiClient
2. DBApiClient
3. Notification Message Store

Actions per pilot:

- create docs/30-unit-tdd/<unit>/ with:
  - README.md
  - invariants.md
  - authority-and-state.md
  - interaction-and-failure.md
  - change-hazards.md
  - verification.md
- add or update tests where invariants are currently unguarded
- keep docs short and contract-focused

Deliverables:

- docs/30-unit-tdd/http-api-client/*
- docs/30-unit-tdd/db-api-client/*
- docs/30-unit-tdd/notification-message-store/*

Exit criteria:

- each pilot has explicit invariants and verification evidence
- each pilot identifies at least one forbidden shortcut / change hazard

## Phase 5 - Alignment Substrate (Pressure-Driven)

Goal: reduce repeated human-agent drift in reference-sensitive changes.

Actions:

- create docs/15-alignment/ minimal pack:
  - README.md
  - change-request-template.md
- ensure the change-request template captures Mode A/B/C selection and restatement fields
- add operation taxonomy only if drift persists after template adoption
- add medium-specific maps only for hot surfaces first:
  - page regions frequently edited (home, me, partner_request flows, chat)
- introduce stable anchors incrementally where ambiguity is high

Deliverables:

- docs/15-alignment/README.md
- docs/15-alignment/change-request-template.md
- optional: ui-map.yaml for selected hot surfaces

Exit criteria:

- reference-sensitive requests are consistently restated in canonical format
- scope/invariant violations decrease in review feedback

## Phase 6 - Deployment Layer and Integrity Automation

Goal: preserve non-trivial runtime truths and prevent docs drift.

Actions:

- create docs/40-deployment/ minimal set:
  - index.md
  - topology.md
  - runtime-authority.md
  - release-and-migration.md
  - operational-hazards.md
- add a docs integrity check script (lightweight):
  - verify internal file links resolve
  - verify required task artifacts exist for active tasks
  - flag stale references to removed files
- run integrity checks in CI or pre-merge workflow

Deliverables:

- docs/40-deployment/* baseline
- scripts/check-docs-integrity.(ts|js)

Exit criteria:

- deployment assumptions are written and reviewed
- docs drift checks run automatically

## 5. File-Level Backlog (Initial)

## 5.1 Create now (first rollout)

- docs/svc-v91/index.md
- tasks/README.md
- tasks/templates/PLAN.template.md
- tasks/templates/RESULT.template.md
- tasks/MIGRATION-MAP.md
- docs/10-prd/index.md
- docs/10-prd/product-pressures.md
- docs/10-prd/product-claims.md
- docs/10-prd/workflows.md
- docs/10-prd/rules-and-invariants.md
- docs/10-prd/scope-and-open-questions.md
- docs/10-prd/glossary.md
- docs/20-product-tdd/index.md
- docs/20-product-tdd/unit-topology.md
- docs/20-product-tdd/system-state-and-authority.md
- docs/20-product-tdd/cross-unit-contracts.md
- docs/20-product-tdd/claim-realization-matrix.md
- docs/15-alignment/README.md
- docs/15-alignment/change-request-template.md

## 5.2 Create during pilot wave

- docs/30-unit-tdd/http-api-client/*
- docs/30-unit-tdd/db-api-client/*
- docs/30-unit-tdd/notification-message-store/*
- docs/40-deployment/index.md
- docs/40-deployment/topology.md
- docs/40-deployment/runtime-authority.md
- docs/40-deployment/release-and-migration.md
- docs/40-deployment/operational-hazards.md

## 5.3 Update existing files

- AGENTS.md (add v9.1 execution protocol, restatement checklist, task-first rule)
- docs/.agents/shared-conventions.md (align i18n conventions and references)
- docs/.agents/vue-patterns.md (align i18n conventions)
- src/pages/AGENTS.md (align i18n guidance and references)
- src/pages/ARCHITECTURE.md (align i18n guidance)
- src/locale/AGENTS.md (align i18n guidance)
- tasks/legacy/plan/* selected active folders (status/closure hygiene)

## 6. Governance Rules

## 6.1 Promotion rule

Promote from task docs only when all or most are true:

- stable across multiple tasks
- costly to rediscover
- not better enforced in code/tests/CI
- clear durable owner layer exists

## 6.2 Demotion rule

If a durable document no longer answers expensive questions, simplify, merge, or delete.

## 6.3 No-duplication rule

- product/domain glossary lives in PRD, not alignment docs
- implementation truth remains in executable guardrails where possible

## 6.4 Mode discipline rule

- Mode A work stays in tasks only
- Mode B requires pre-execution restatement and confirmation before promoting to durable docs
- Mode C requires pre-execution restatement and confirmation before code/test changes

## 7. Metrics and Checkpoints

Track these metrics for rollout health:

- active tasks with PLAN + RESULT completeness ratio
- Mode A compliance rate (explorations captured in tasks)
- pre-execution restatement compliance for reference-sensitive requests
- stale reference count (broken doc links, removed file pointers)
- cross-unit contract coverage count in Product TDD
- hard-unit invariant coverage count (Unit TDD + tests)
- number of regressions tied to scope/invariant drift in review feedback

Checkpoint cadence:

- weekly during first month
- bi-weekly after baseline stabilizes

## 8. Risks and Mitigations

Risk: document bloat and second-system behavior.
Mitigation: enforce promotion test and demotion rule.

Risk: writing docs without executable guardrails.
Mitigation: each Product/Unit TDD section must list existing tests/checks and missing checks.

Risk: alignment docs duplicate PRD semantics.
Mitigation: keep alignment focused on addressing, operation taxonomy, and scope control only.

Risk: Mode A bypass leads to premature durable-doc or code changes.
Mitigation: enforce AGENTS protocol gating and require task-first capture for exploration.

Risk: partial migration leaves contributors confused.
Mitigation: keep tasks/MIGRATION-MAP.md current and mark legacy areas explicitly.

## 9. Definition of Done for SVC v9.1 Adoption (Initial)

Initial adoption is complete when all are true:

- SVC layer folders exist with minimal baseline documents
- root AGENTS.md includes the Mode A/B/C execution protocol and restatement checklist
- task-first rule is explicit and Mode A exploration happens only in tasks/
- task lifecycle is standardized for all new tasks under tasks/
- at least one Product TDD baseline and three Unit TDD pilots are complete
- docs integrity checks run automatically
- legacy tasks/legacy/plan usage is either migrated or clearly marked as archive-only

## 10. Deferred Scope (Explicitly Not in First Wave)

- full historical backfill of all old tasks into SVC layers
- Unit TDD for every component/page/store module
- full UI map for all pages before hot-surface pressure justifies it
- broad rewrite of all topic docs before layer model stabilizes

## 11. Immediate Next Actions (Execution Order)

1. approve this plan and lock adoption scope for first wave (including Mode A/B/C protocol)
2. update AGENTS.md with the v9.1 execution protocol and restatement checklist
3. create tasks templates and migration map, then triage tasks/legacy/plan and tasks/legacy/explore-plan
4. bootstrap docs/10-prd and docs/20-product-tdd minimal files
5. start Unit TDD pilot for HTTPApiClient and pair with guardrail tests
6. run first docs integrity audit and fix stale references (including i18n guidance conflicts)
