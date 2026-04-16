# Input route: Constraint

## Trigger

Use when product behavior stays stable, but technical, dependency, performance, API, runtime, or environment boundaries change.

## Primary owner

- `docs/20-product-tdd/` for cross-unit constraints
- `docs/30-unit-tdd/` for one-unit durable design constraints

## Forbidden

- Do not rewrite product intent to justify an implementation decision.
- Do not hide cross-unit contract changes inside task notes only.

## Read-do steps

1. Restate the constraint in technical terms.
2. Identify affected units, contracts, authority paths, and runtime surfaces.
3. Update Product TDD or Unit TDD where future drift would be expensive.
4. Define verification that proves the new contract still satisfies PRD commitments.
5. Escalate to Intent if the constraint changes a product promise.

## Exit criteria

- The technical contract or design boundary is explicit.
- Verification is explicit.
- PRD stays stable unless product renegotiation is confirmed.
