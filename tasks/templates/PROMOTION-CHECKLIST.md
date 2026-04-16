# Promotion review checklist

Use this checklist before promoting task knowledge into durable docs.

## Promotion gate

- Is the truth stable across tasks?
- Is it expensive to rediscover?
- Is it not better enforced by code, tests, lint rules, CI, or runtime checks?
- Does it have a clear durable owner?
- Is the wording scoped and non-duplicative?

## Destination map

- Product what and why: `docs/10-prd/`
- Cross-unit technical truth: `docs/20-product-tdd/`
- Unit-local durable design memory: `docs/30-unit-tdd/`
- Runtime and operational truth: `docs/40-deployment/`
- Reference-sensitive coordination grammar: `docs/15-alignment/`
- Reusable route, mode, or concept protocol: `docs/00-meta/`
- Tactical local hazard or recurrence tripwire: nearest local `AGENTS.md`
- Temporary finding or one-off artifact: keep in `tasks/`

## Anti-promotions

- Do not promote guesses.
- Do not promote facts that are easier to read directly from code.
- Do not duplicate product semantics into alignment or TDD docs.
- Do not create durable docs to compensate for missing executable checks.
