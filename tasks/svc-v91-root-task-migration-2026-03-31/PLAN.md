# SVC v9.1 root tasks migration

Status: Completed
Owner: Copilot
Date: 2026-03-31
Mode: B

## Restatement (required for Mode B and Mode C)

Target: task layer root alignment with SVC v9.1
Target path or anchor: tasks/, docs/svc-v91, AGENTS.md, scripts/check-docs-integrity.js
State or context: historical task docs were split across docs/task, docs/plan, docs/explore-plan
Operation: migrate all task docs to root tasks/, update references, remove legacy docs task roots
Scope (in): task docs, governance docs, integrity script, path references
Scope (out): product/domain implementation code
Invariants: keep historical artifacts intact, preserve PLAN/RESULT records, keep docs layers under docs/
Likely affected files: tasks/**/*, docs/svc-v91/*, AGENTS.md, FILESYSTEM.md, scripts/check-docs-integrity.js
Uncertainty: none

## Objectives

- Eliminate legacy task roots under docs/
- Make root tasks/ the only execution and archive task layer
- Ensure link integrity and automation checks pass

## Out of scope

- Rewriting historical task conclusions
- Any production code refactors

## Plan

1. Move docs/task to tasks.
2. Move docs/plan and docs/explore-plan to tasks/legacy.
3. Update governance references and migration map.
4. Update docs integrity checker to validate root tasks.
5. Run docs:check.
