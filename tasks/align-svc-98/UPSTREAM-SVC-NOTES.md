# Upstream SVC Notes

Date of upstream inspection: 2026-04-06

## Source inspected

- Local clone path: `F:/CODING/svc`
- Remote: `https://github.com/xiaoland/svc.git`
- Local/remote `main` commit inspected: `c5a120d`
- Authority decision recorded in this task on 2026-04-07:
  - upstream `xiaoland/svc` `main` HEAD is the authoritative baseline for this migration

## Version consistency note

### What the upstream repo says

- `README.md` still says:
  - "Current framework baseline in this repo: v9.5"
- `CHANGELOG.md` latest entry is:
  - `9.5.0` on `2026-04-04`
- But `src/index.md` says:
  - `Sustainable Vibe Coding Framework v9.7`
  - `Last edit on: 2026-04-06T20:39+08:00`

### What could be verified

- `git ls-remote --tags https://github.com/xiaoland/svc.git`
  - returned no tags
- `git ls-remote --heads https://github.com/xiaoland/svc.git`
  - returned only `main`
- No version tag was discoverable during exploration.

### Working conclusion

- The authoritative upstream baseline for this task is `main` HEAD at commit `c5a120d`.
- By source-first rule, `src/index.md` and related source docs outrank the lagging `README.md` and `CHANGELOG.md`.
- In practice, that means this migration should align to the source model currently described upstream, whose front page reads as `v9.7`.

## Core upstream deltas beyond this repo's v9.1 mapping

### 1. Front door changed from mode-first to typed-input-first

Upstream now routes requests by:

- `Intent`
- `Constraint`
- `Reality`
- `Artifact`

Mode remains a second axis:

- `Explore`
- `Solidify`
- `Execute`
- `Diagnose`

This is materially different from the repo's current v9.1-style "Mode A/B/C first" framing.

### 2. `docs/00-meta/` becomes the reusable meta-engine owner

Upstream minimal filesystem expects:

- `docs/00-meta/input-intent.md`
- `docs/00-meta/input-constraint.md`
- `docs/00-meta/input-reality.md`
- `docs/00-meta/input-artifact.md`
- `docs/00-meta/mode-a-explore.md`
- `docs/00-meta/mode-b-solidify.md`
- `docs/00-meta/mode-c-execute.md`
- `docs/00-meta/mode-d-diagnose.md`
- `docs/00-meta/concepts.md`

The current repo has no `docs/00-meta/`.

### 3. Tasks upgraded from status templates to MVT packets

Upstream `tasks` guidance expects every non-trivial task to include:

- Objective & Hypothesis
- Guardrails Touched
- Verification

Optional exploration fields exist, but MVT is the minimum viable default.

The current repo still standardizes around status-heavy `PLAN.md` / `RESULT.md` templates.

### 4. PRD structure changed

Upstream PRD expects one-way derivation:

- `_drivers/`
- `behavior/`
- `domain-structure/`
- `glossary.md`

The current repo PRD is still flat:

- `product-pressures.md`
- `product-claims.md`
- `workflows.md`
- `rules-and-invariants.md`
- `scope-and-open-questions.md`
- `glossary.md`

### 5. Alignment evolved from pack to substrate

Upstream v9.7 expects `15-alignment/` to be an optional substrate, not merely a document pack.

Key concepts extracted from source:

- seven coordination primitives:
  - object
  - address
  - operation
  - boundary / invariants
  - state / context
  - evidence
  - protocol
- calculable maps over static maps
- declarative `From -> To` state diffs
- operation verbs bound to verification contracts
- pre-execution impact handshake owned by meta-engine, not by alignment itself

### 6. Local `AGENTS.md` became more important

Upstream promotes local `src/**/AGENTS.md` as the owner for:

- tactical hazards
- recurrence tripwires
- fragile local seams

The current repo uses some local AGENTS files, but coverage is uneven and the docs still lean heavily on `docs/.agents/*`.

## Upstream migration guidance relevant to this repo

From upstream `src/sections/migration-guidance.md`:

- `v9.1 -> v9.2`
  - add closest-to-target consumption logic
  - move tactical component memory nearer to code
- `v9.2 -> v9.3`
  - create `docs/00-meta`
  - add `mode-d-diagnose`
- `v9.3 -> v9.4`
  - restructure PRD into `_drivers/`, `behavior/`, `domain-structure/`
- `v9.4 -> v9.5`
  - typed input classification replaces mode-only front door
  - task notes become MVT packets
- `v9.6 -> v9.7`
  - alignment pack -> alignment substrate
  - add seven primitives and impact handshake

## Implication for this repo

The repo is not dealing with a small delta.

It still needs to absorb at least the verified upstream changes from:

- v9.2
- v9.3
- v9.4
- v9.5
- v9.7

before it can credibly claim alignment with upstream `main` HEAD.
