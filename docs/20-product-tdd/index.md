# Product TDD Index

This layer owns cross-unit technical contracts needed to realize PRD claims.

It does not own product intent, unit-local implementation memory, runtime topology, or task evidence.

## Inputs

- Product behavior: [../10-prd/behavior/claims.md](../10-prd/behavior/claims.md)
- Product rules: [../10-prd/behavior/rules-and-invariants.md](../10-prd/behavior/rules-and-invariants.md)
- Alignment addresses when targeting is ambiguous: [../15-alignment/ui-surface-map.md](../15-alignment/ui-surface-map.md)

## Files

- [unit-topology.md](unit-topology.md): repo-level technical units and ownership boundaries
- [system-state-and-authority.md](system-state-and-authority.md): cross-unit state authorities and derived readers
- [cross-unit-contracts.md](cross-unit-contracts.md): contracts between pages, components, stores, business models, API clients, and platform wrappers
- [claim-realization-matrix.md](claim-realization-matrix.md): PRD claim realization anchors and verification gaps

## Update Rules

- Update PRD first when user-visible behavior, claims, workflows, or product invariants change.
- Update Product TDD when a change crosses unit boundaries or changes technical authority.
- Push unit-local rationale into `docs/30-unit-tdd/` only when local design memory is worth preserving.
- Push runtime, build, environment, or rollback truth into `docs/40-deployment/`.
- Prefer code and tests over prose when a contract can be enforced cheaply.
