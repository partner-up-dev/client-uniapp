# SVC v9.1 drift review and governance refactor

Status: Completed
Owner: Copilot
Date: 2026-03-31
Mode: B

## Restatement (required for Mode B and Mode C)

Target: Documentation governance alignment with SVC v9.1
Target path or anchor: docs/svc-v91, docs/15-alignment, tasks, legacy task roots, docs references
State or context: Layer scaffolding exists, but drift risks remain (historical snapshots, thin alignment pack, stale refs)
Operation: Audit drifts, record them durably, refactor doc navigation and guardrails
Scope (in): Documentation and docs integrity checks only
Scope (out): Product logic, runtime behavior, TypeScript/Vue business code
Invariants: Keep SVC layer boundaries; keep tasks as Mode A sandbox; do not alter product semantics
Likely affected files: docs/svc-v91/*, docs/15-alignment/*, tasks/*, tasks/legacy/plan/README.md, tasks/legacy/explore-plan/README.md, docs/.agents/*, src/pages/*.md, scripts/check-docs-integrity.js
Uncertainty: Whether to physically migrate legacy folders now or keep read-only archive policy

## Objectives

- Produce a current drift ledger against docs/_svc_v91.md
- Strengthen alignment pack for a large repository
- Reduce future drift by fixing stale references and adding integrity checks

## Out of scope

- Rewriting historical task content beyond warning banners
- Implementing code/test logic changes

## Plan

1. Audit alignment gaps and evidence.
2. Write drift register and remediation plan.
3. Refactor alignment docs and legacy archive entrypoints.
4. Fix stale doc links and add integrity guardrails.
5. Validate with docs integrity check and record results.
