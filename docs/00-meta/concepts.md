# Concepts

Load this file only when framework boundary language is unclear.

## Input type

- Owned by layer: `docs/00-meta/`
- Definition: the kind of perturbation entering the system.
- Values: `Intent`, `Constraint`, `Reality`, `Artifact`.
- Why it exists: it decides durable ownership before mode selection.

## Mode

- Owned by layer: `docs/00-meta/`
- Definition: the current working posture.
- Values: `Explore`, `Solidify`, `Execute`, `Diagnose`.
- Why it exists: it decides how to work now, not where truth belongs.

## Durable owner

- Owned by layer: `docs/00-meta/`
- Definition: the layer responsible for preserving a stable truth.
- Examples: PRD for product truth, Product TDD for cross-unit contracts, Deployment for runtime truths.

## Alignment substrate

- Owned by layer: `docs/15-alignment/`
- Definition: a coordination grammar for reference-sensitive or non-local work.
- Why it exists: it turns fuzzy intent into object, address, operation, invariant, state, evidence, and protocol fields.

## Impact handshake

- Owned by layer: `docs/00-meta/`
- Definition: a pre-mutation restatement for non-local or durable changes.
- Fields: address/object, from -> to state diff, blast radius, invariants, verification.

## Promotion

- Owned by layer: `docs/00-meta/`
- Definition: moving a stable truth from task space into a durable owner.
- Gate: stable across tasks, expensive to rediscover, not better enforced mechanically, clear owner.
