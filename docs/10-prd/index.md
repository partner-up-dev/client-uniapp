# PRD index

This PRD owns product intent, observable behavior, and business language for PartnerUp Uniapp.

Implementation structure, API details, state ownership, and runtime mechanics belong to TDD or Deployment layers, not PRD.

## Derivation rule

PRD follows one-way derivation:

- Drivers -> Behavior -> Domain Structure

`_drivers/` is upstream. `behavior/` defines product commitments. `domain-structure/` stabilizes business semantics derived from drivers and behavior; it must not create new upstream obligations.

## Files

- [glossary.md](glossary.md): canonical business terms
- [_drivers/market-and-user-pressures.md](_drivers/market-and-user-pressures.md): user and market pressure signals
- [_drivers/business-and-service-objectives.md](_drivers/business-and-service-objectives.md): service objectives and success rationale
- [_drivers/hard-constraints.md](_drivers/hard-constraints.md): platform and product constraints
- [_drivers/operational-realities.md](_drivers/operational-realities.md): current operational realities affecting product truth
- [behavior/claims.md](behavior/claims.md): durable product claims and evaluation dimensions
- [behavior/capabilities.md](behavior/capabilities.md): product capabilities and non-goals
- [behavior/workflows.md](behavior/workflows.md): observable user workflows
- [behavior/rules-and-invariants.md](behavior/rules-and-invariants.md): product rules and invariants
- [behavior/scope.md](behavior/scope.md): in-scope areas, out-of-scope areas, and open questions
- [domain-structure/derived-boundaries.md](domain-structure/derived-boundaries.md): derived business domain boundaries
- [domain-structure/cross-domain-interactions.md](domain-structure/cross-domain-interactions.md): semantic interactions between domains

## Migration note

This structure supersedes the previous flat PRD files and old partner topic note.

Product semantics from those files are migrated into `glossary.md`, `behavior/*`, and `domain-structure/*`.
