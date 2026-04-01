# Operation taxonomy

Operation classes for scope and guardrail selection.

## Operation classes

- ALN-OP-01 Copy/Text only
  - Typical mode: C
  - Scope: wording/localization updates without behavior changes
  - Required guardrail: no logic or contract edits
- ALN-OP-02 Visual style only
  - Typical mode: C
  - Scope: layout, spacing, colors, typography, tokens
  - Required guardrail: no behavior/state authority change
- ALN-OP-03 Navigation/addressing change
  - Typical mode: B or C
  - Scope: page ID/path, route mapping, tab routing behavior
  - Required guardrail: keep PAGE_ID/PAGE_PATH consistency
- ALN-OP-04 State authority change
  - Typical mode: B
  - Scope: ownership of state, token propagation, lifecycle ownership
  - Required guardrail: update Product TDD authority docs before code
- ALN-OP-05 Cross-unit contract change
  - Typical mode: B
  - Scope: interfaces crossing page/store/business/runtime boundaries
  - Required guardrail: update Product TDD contracts and verification links
- ALN-OP-06 Product rule change
  - Typical mode: B
  - Scope: user-visible rule/invariant/workflow updates
  - Required guardrail: update PRD before implementation
- ALN-OP-07 Local refactor (no behavior)
  - Typical mode: C
  - Scope: naming/structure cleanup with no semantic change
  - Required guardrail: invariants unchanged, tests still pass
- ALN-OP-08 Runtime/deployment change
  - Typical mode: B or C
  - Scope: release, migration, operational hazards, runtime topology
  - Required guardrail: update deployment docs and rollback plan

## Selection rule

- If operation class is ALN-OP-04/05/06/08, default to Mode B first.
- If request is ambiguous, start in Mode A and convert after restatement.
- Always record operation class in change-request-template.md.
