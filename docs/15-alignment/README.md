# Alignment layer

This layer reduces coordination drift for reference-sensitive work by giving humans and agents a shared address system.

## When to use

- The request references UI regions, flows, or files that are easy to mis-target
- The change is logic-altering or touches cross-unit boundaries
- Review feedback repeatedly points to wrong target/scope selection

## Alignment pack assets

- `change-request-template.md`: canonical pre-execution restatement form
- `surface-glossary.md`: stable terms for addressing and discussion
- `ui-surface-map.md`: medium-native map of page IDs, routes, and key anchors
- `operation-taxonomy.md`: operation classes and required guardrails

## Workflow

1. Pick Mode A/B/C.
2. Fill the change request template with explicit scope/invariants.
3. Use surface IDs from `ui-surface-map.md` and terms from `surface-glossary.md`.
4. Classify the operation using `operation-taxonomy.md`.
5. Execute only after approval for Mode B/C.

## Rules

- Keep alignment docs address-based and compact
- Do not duplicate PRD semantics or Product/Unit TDD contracts
- Keep references current; if an anchor changes, update the map in the same task
