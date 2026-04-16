# Alignment Substrate

This directory owns coordination grammar for reference-sensitive work. It is not a product, technical, runtime, or evidence truth layer.

Use it only when the normal MVT task frame is not enough to constrain target, mutation, verification, or blast radius.

## Admission Rule

Load this layer when one or more of these risks are present:

- references or visual names are unstable
- object boundaries are interpreted differently
- operation verbs hide different side effects
- state or context changes whether a reference is valid
- evidence is missing or too weak for a credible blast-radius estimate

Do not load this layer just because a task touches docs. If PRD, TDD, deployment docs, tests, or code already preserve the truth cheaply, use those owners directly.

## What This Layer Owns

- shared object and address conventions for coordination
- calculable surface maps derived from stable code anchors
- operation vocabulary bound to verification contracts
- request structure for boundary, state/context, evidence, and protocol before risky mutation

## What This Layer Does Not Own

- product why or business rules; use `docs/10-prd/`
- cross-unit technical contracts; use `docs/20-product-tdd/`
- unit-local design memory; use `docs/30-unit-tdd/`
- runtime topology or deployment truth; use `docs/40-deployment/`
- reusable execution SOPs and Impact Handshake triggers; use `docs/00-meta/`
- task evidence, experiment notes, or temporary scripts; use `tasks/`

## Files

- [change-request-template.md](change-request-template.md): substrate-complete request template for alignment-heavy work
- [surface-glossary.md](surface-glossary.md): coordination terms used by this layer
- [ui-surface-map.md](ui-surface-map.md): calculable page and surface addresses for high-frequency UI targets
- [operation-taxonomy.md](operation-taxonomy.md): operation vocabulary and verification contracts

## Workflow

1. Classify the input route in `docs/00-meta/`.
2. Use the task MVT frame first.
3. Expand into substrate fields only if MVT cannot safely bound the mutation.
4. Choose surface IDs from `ui-surface-map.md` and operation vocabulary from `operation-taxonomy.md`.
5. Fill `change-request-template.md` for boundary-crossing or high-risk work.
6. Execute against the owning durable layer, not against alignment docs as truth.
7. Record evidence in the task workspace and promote only stable knowledge.

## Maintenance Rules

- Keep maps address-focused and derived from stable code anchors.
- Update this layer in the same task when a surface, route, or anchor changes.
- Do not add hand-maintained screenshots, static UI trees, or product semantics here.
- Do not preserve stale anchors for history; move historical notes into task evidence if needed.
