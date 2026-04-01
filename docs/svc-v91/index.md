# SVC v9.1 in this repo

This index explains how Sustainable Vibe Coding v9.1 is mapped and governed in this repository.

## Layer mapping

- `tasks/` in SVC v9.1 maps to root `tasks/` in this repo
- PRD layer maps to `docs/10-prd/`
- Alignment layer maps to `docs/15-alignment/`
- Product TDD layer maps to `docs/20-product-tdd/`
- Unit TDD layer maps to `docs/30-unit-tdd/`
- Deployment layer maps to `docs/40-deployment/`

## Local operating rules

- Mode A (Exploration): work only in `tasks/`; do not edit PRD, TDD, or production code
- Mode B (Solidification): restate scope/invariants, await confirmation, then promote stable truths
- Mode C (Execution): restate scope/invariants, await confirmation, then implement tests/code
- Legacy task roots `tasks/legacy/plan/` and `tasks/legacy/explore-plan/` are read-only archives

## Restatement checklist

- target
- target path or anchor
- state or context
- operation
- scope (in and out)
- invariants
- likely affected files
- uncertainty

## Current governance artifacts

- `../svc-v91/drift-register.md` (authoritative drift ledger)
- `../15-alignment/README.md` (alignment pack entry)
- `../../tasks/README.md` (task lifecycle)
- `../../tasks/MIGRATION-MAP.md` (legacy migration map)

## Promotion rule

Promote from task docs only when the truth is stable, costly to rediscover, not better enforced in code/tests/CI, and has a clear durable owner.

## References

- `../_svc_v91.md`
- `../../tasks/svc-v9/PLAN.md` (historical baseline)
- `../../tasks/README.md`
