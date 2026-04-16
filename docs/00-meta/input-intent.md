# Input route: Intent

## Trigger

Use when the business wants new behavior, scope, policy, product rule, or strategy.

## Primary owner

- `docs/10-prd/`

## Forbidden

- Do not encode mechanism, topology, transport, or local interface details in PRD.
- Do not skip impact review against existing product claims and workflows.

## Read-do steps

1. Restate the intended user-visible behavior and success signal.
2. Inspect relevant PRD drivers, behavior, scope, and glossary entries.
3. Update PRD before downstream technical realization.
4. Add Product TDD or Unit TDD realization pointers only after product truth is stable.

## Exit criteria

- PRD reflects the new or revised product truth.
- Impact on existing claims, workflows, and terms is explicit.
- Technical implications are routed to the correct owner if needed.
