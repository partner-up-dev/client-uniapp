# Mode C: Execute

## Role

Use when the current slice of work is clear enough to implement or edit safely.

Execute can appear in any input route once ownership and verification are clear.

## Forbidden

- Do not skip nearest local `AGENTS.md` and relevant PRD/TDD/deployment checks.
- Do not keep executing when new evidence shows the problem is not understood.
- Do not change unrelated files while cleaning or refactoring.

## Read-do steps

1. Restate the exact change, protected invariants, and verification plan.
2. Load nearest local `AGENTS.md` plus governing PRD, TDD, deployment, or alignment docs.
3. If blast radius is not obviously local, pause for the impact handshake before durable mutation.
4. Implement the smallest safe change for the current slice.
5. Run appropriate checks and compare results against verification.
6. Re-enter Explore or Diagnose if unexpected behavior appears.

## Exit criteria

- The requested change for this slice is implemented.
- Verification passes or any skipped verification is justified.
- No known invariant is violated.
