# SVC v9.1 Governance Alignment Results

> Historical snapshot (2026-03-31).
> This result records pre-refactor findings and is superseded by `docs/svc-v91/drift-register.md`.

## Summary

The repository has solid technical governance and a detailed SVC v9 plan, plus a local copy of the SVC v9.1 protocol. However, AGENTS.md does not yet embed the dynamic execution protocol (Mode A/B/C) or the pre-execution restatement rule, and task-first exploration rules are not enforced at the root governance level. There are also conflicts in i18n guidance between AGENTS/ARCHITECTURE and docs/.agents/shared-conventions.

## Strengths

- Root governance docs exist and define conventions and doc-reading expectations.
- Architecture and filesystem docs provide clear technical truth and navigation.
- docs/.agents provides shared conventions and templates for agent-facing documentation.
- tasks/svc-v9/PLAN defines separation of product/technical/task truths and includes promotion/demotion rules and a proposed restatement protocol.
- docs/_svc_v91.md captures the dynamic execution protocol and task-first rule for SVC v9.1.

## Gaps and Conflicts

- AGENTS.md lacks the Dynamic Execution Protocol and Pre-Execution Restatement Rule required by v9.1.
- Task-first exploration is not enforced in governance; tasks/README.md does not exist yet, and the rule lives only in the v9 plan.
- The repo has no durable PRD/Product TDD/Unit TDD baseline yet, which blocks the Mode B solidification step from having destinations for promoted truths.
- i18n guidance conflicts between AGENTS/ARCHITECTURE (useI18n) and shared-conventions (useTranslate), which is explicitly called out as drift in the v9 plan.
- AGENTS.md mandates immediate doc updates when outdated, which can conflict with Mode A constraints that prohibit durable doc updates during exploration.
- SVC v9.1 references tasks/ at repo root, while this repo uses tasks; the mapping is not documented in AGENTS.md.

## Recommended Update Priorities

P0

- Update AGENTS.md with the Dynamic Execution Protocol (Mode A/B/C) and the Pre-Execution Restatement Rule.
- Add a task-first rule and clarify that tasks is the task sandbox for Mode A.

P1

- Resolve i18n guidance conflicts by selecting a single source of truth and updating AGENTS.md and docs/.agents/shared-conventions.md.
- Create tasks/README.md and templates to standardize task lifecycle and promotions.

P2

- Bootstrap minimal PRD and Product TDD folders to provide destinations for Mode B promotion.
- Document the tasks/ vs tasks mapping in an SVC index doc and AGENTS.md.
