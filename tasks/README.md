# Task layer

`tasks/` is the volatile workspace for planning, exploration, diagnostics, and temporary artifacts.

Task notes are procedural and non-authoritative. Promote stable knowledge into PRD, TDD, Deployment, local `AGENTS.md`, or Alignment only after it passes the promotion test.

## Current task protocol

Use the typed input route from root `AGENTS.md` before choosing a mode:

- `Intent`: product behavior, scope, policy, or strategy
- `Constraint`: technical or environment boundary change with stable product behavior
- `Reality`: bug, anomaly, failed check, or mismatch between expected and observed state
- `Artifact`: bounded one-off deliverable

Then choose the active mode for the current slice:

- `Explore`
- `Solidify`
- `Execute`
- `Diagnose`

Input type decides durable ownership. Mode decides working posture.

## Minimum viable task anchors

Every non-trivial task must include:

- Objective & Hypothesis
- Guardrails Touched
- Verification

These anchors are required because they keep task work bounded without turning task notes into durable architecture.

## Required artifacts

- Use `tasks/templates/PLAN.template.md` for new non-trivial tasks.
- Use `tasks/templates/RESULT.template.md` for completed or cancelled tasks.
- Use `tasks/templates/PROMOTION-CHECKLIST.md` before promoting any task finding into durable docs.

Small single-step changes may skip a task folder when the request is local, low-risk, and already clear.

## Lifecycle status values

- Draft
- Active
- Blocked
- Completed
- Cancelled
- Archived

## Lifecycle rules

- Keep uncertain reasoning in `tasks/`.
- Do not treat task findings as current product or architecture truth.
- Do not edit PRD/TDD/Deployment from vague prompts; explore first.
- Reality work starts with evidence; no evidence, no modification.
- Completed or cancelled tasks should record verification and promotion review in `RESULT.md`.

## Legacy archives

These roots are historical archives:

- `tasks/legacy/plan/`
- `tasks/legacy/explore-plan/`
- old SVC migration folders such as `tasks/svc-v9/` and `tasks/svc-v91-*`

Rules:

- Do not create new work in legacy roots.
- Do not maintain historical task conclusions as current governance.
- Re-open legacy work by creating a new `tasks/<task>/PLAN.md` and linking back to the old record.
