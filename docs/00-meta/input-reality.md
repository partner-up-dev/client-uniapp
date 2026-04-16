# Input route: Reality

## Trigger

Use for bugs, anomalies, crashes, corrupt state, failed checks, stale docs, or any mismatch between expected and observed reality.

## Primary owner

- `tasks/` for evidence and hypothesis ranking
- nearest local `AGENTS.md` for recurrence tripwires after the cause is proven

## Forbidden

- No evidence, no modification.
- Do not jump from symptom directly to fix.
- Do not use documentation as a substitute for executable guardrails when tests or code checks are better.

## Read-do steps

1. Capture the symptom, timeline, affected surface, and direct evidence.
2. Define blast radius and likely authority owner.
3. Rank hypotheses by evidence quality.
4. Validate the likely cause before editing code or durable truth.
5. Add a recurrence tripwire when future agents could repeat the mistake.
6. Promote stable lessons to Deployment, Product TDD, or Unit TDD only when justified.

## Exit criteria

- The likely cause is evidence-backed.
- Verification or recurrence protection is explicit.
- Durable updates, if any, have the correct owner.
