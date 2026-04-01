# Task lifecycle

tasks is the canonical sandbox for volatile work (Mode A).

## Required artifacts

- PLAN.md for every task, with status, owner, mode, and restatement fields
- RESULT.md for completed or cancelled tasks
- Use the templates under tasks/templates, including the promotion checklist

## Status values

- Draft
- Active
- Blocked
- Completed
- Cancelled
- Archived

## Lifecycle rules

- Mode A work stays in tasks only
- Use Mode B to promote stable truths into PRD or Product TDD
- Use Mode C for code changes after restatement and confirmation
- Completed tasks must include a promotion review in RESULT.md

## Legacy locations

tasks/legacy/plan and tasks/legacy/explore-plan are legacy archives. New tasks must live in tasks.

## Legacy guardrails

- Treat `tasks/legacy/plan/` and `tasks/legacy/explore-plan/` as read-only history
- Do not create new task folders in legacy roots
- Re-open legacy work by creating a new `tasks/<task>/PLAN.md` and linking back
- Keep archive notices in `tasks/legacy/plan/README.md` and `tasks/legacy/explore-plan/README.md`
