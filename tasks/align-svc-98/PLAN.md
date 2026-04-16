# Align PartnerUp Uniapp to Upstream SVC main HEAD

Status: Active
Owner: Codex
Date: 2026-04-07
Mode: A

## Restatement (required for Mode B and Mode C)

Target: SVC alignment and legacy documentation cleanup planning against upstream `xiaoland/svc` `main` HEAD
Target path or anchor: `tasks/align-svc-98/`
State or context: The repo is partially aligned to a repo-local SVC v9.1 interpretation, but the user has now fixed the authority source to upstream `xiaoland/svc` `main` HEAD. The repo still contains stale governance artifacts, duplicate docs, missing guardrails, and historical leftovers.
Operation: Reframe the exploration artifacts around the locked authority baseline, remove the earlier baseline ambiguity from this task, and produce a formal migration and cleanup sequence.
Scope (in): `tasks/align-svc-98/` notes, repository/document inventory, upstream SVC notes, gap analysis, legacy cleanup candidates, migration proposal, evidence from safe read-only commands
Scope (out): PRD/TDD/production-code edits outside `tasks/`, deletion of existing docs, code refactors, CI/workflow changes, destructive cleanup
Invariants: Do not mutate durable docs or source code outside `tasks/` during exploration; preserve historical evidence even when calling it stale; do not reintroduce `scripts/check-docs-integrity.js` or a permanent equivalent into the target-state plan; update task governance only through current `tasks/README.md` and `tasks/templates/*`, not outdated historical task records
Likely affected files: `tasks/align-svc-98/PLAN.md`, `tasks/align-svc-98/CURRENT-STATE.md`, `tasks/align-svc-98/UPSTREAM-SVC-NOTES.md`, `tasks/align-svc-98/GAP-ANALYSIS.md`, `tasks/align-svc-98/LEGACY-CLEANUP-CANDIDATES.md`, `tasks/align-svc-98/MIGRATION-PROPOSAL.md`
Uncertainty: The upstream repo is internally version-inconsistent (`README.md`/`CHANGELOG.md` lag behind `src/index.md`), so this task should treat `main` HEAD as authoritative by source-first rule rather than by release labeling.

## MVT Core

- Objective & Hypothesis: Build an evidence-backed migration workspace before any durable cleanup or governance rewrite. Hypothesis: the repo's biggest risks are not missing documents, but stale routing, outdated SVC front-door logic, broken governance claims, and historical leftovers that blur durable ownership.
- Guardrails Touched:
  - Keep all exploration-only edits inside `tasks/align-svc-98/`.
  - Treat upstream SVC `main` HEAD as the locked authority baseline for this migration.
  - Remove `docs:check` / `scripts/check-docs-integrity.js` from future-state planning rather than replacing them with another permanent governance script by default.
  - Separate "valuable but misplaced" docs from "safe to remove" leftovers.
- Verification:
  - This task folder contains inventory, upstream reference notes, gap analysis, a cleanup candidate list, and a formal migration proposal.
  - Every major gap is tied to concrete repository evidence.
  - The plan identifies the sequence needed before Mode B or Mode C.

## Objectives

- Map the current code and documentation topology with enough fidelity to support a real migration.
- Distinguish current durable SVC layers from historical snapshots and stray docs.
- Lock the upstream SVC baseline that is actually available today and separate source authority from release-label drift.
- Produce a prioritized migration and cleanup backlog.
- Produce a formal migration proposal and execution order.

## Out of scope

- Directly updating `AGENTS.md`, `docs/`, `src/`, `.github/`, or scripts in this task.
- Physically deleting legacy files or directories.
- Reclassifying product semantics without later Mode B confirmation.

## Plan

1. Lock authority to upstream `xiaoland/svc` `main` HEAD and revise this task's framing accordingly.
2. Preserve the repo inventory and upstream deltas as source-backed evidence.
3. Compare the repo's current governance and doc layout against the locked baseline.
4. Separate valuable docs, stale docs, duplicate docs, and broken guardrails.
5. Produce the formal migration proposal and cleanup execution order for the next phase.
