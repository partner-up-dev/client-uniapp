# Legacy Cleanup Candidates

This file separates cleanup candidates by action type so later execution does not lump valuable docs together with disposable leftovers.

## Likely delete or archive

These items currently look like historical residue rather than durable project memory.

| Path | Reason | Suggested action |
| --- | --- | --- |
| `.depreacted/` | empty misspelled directory | delete if no external tooling depends on it |
| `src/components/AGENTS.md.new` | duplicate draft with mojibake / encoding corruption | delete after confirming `src/components/AGENTS.md` is the keeper |
| `debug.log` | runtime log artifact at repo root | delete and add guardrail to ignore/regenerate outside repo if needed |
| `docs/prompt-snippets.md` | tiny tactical note, not integrated into current workflow | archive into task history or delete |
| `todo.md` | tactical backlog note in repo root, not under `tasks/` | migrate meaningful items into task backlog or archive/delete |

## Likely rewrite or relocate

These items seem to contain real knowledge, but not in the right owner/layer.

| Path | Current issue | Suggested action |
| --- | --- | --- |
| `docs/_svc_v91.md` | old framework snapshot still used as a live baseline | archive or supersede after new baseline is written |
| `docs/svc-v91/index.md` | repo mapping index tied to v9.1 framing | replace with newer alignment index or archive |
| `docs/svc-v91/drift-register.md` | useful historical evidence, but tied to old baseline | preserve as historical record, stop treating as current truth |
| `docs/.agents/*` | project conventions library outside newer upstream owner model | split into `docs/00-meta/`, local subtree AGENTS, or keep as project-specific conventions with explicit owner |
| `src/components/AGENTS.doc.md` | component doc template guidance outside main SVC layers | either keep as explicit project convention asset or move to a better-owned conventions location |
| `docs/partner.md` | real product/domain semantics living outside PRD | migrate into restructured `docs/10-prd/` |
| `docs/style.md` | real styling guidance outside SVC durable-owner map | keep or relocate as project conventions doc |
| `docs/unocss.md` | real technical/styling note outside clear owner | keep or relocate with styling conventions |
| `docs/array-class-support.md` | real unit-level business helper note outside Unit TDD/local AGENTS | likely re-home under `docs/30-unit-tdd/` or local business docs |
| `docs/valibot-extend.md` | real technical note outside clear owner | likely re-home under `docs/30-unit-tdd/` or local business docs |

## Likely keep, but repair accuracy

| Path | Problem | Repair needed |
| --- | --- | --- |
| `docs/15-alignment/ui-surface-map.md` | stale anchor to `src/custom-tab-bar/index.vue` | update to actual tabbar files or recalculate anchor strategy |
| `src/pages/FILESYSTEM.md` | documents `create_start` as active page while `pages.json` omits it | decide whether page should be restored or the doc should be corrected |
| `src/utils/README.md` | broken relative links | fix links |
| `src/components/common/cell/cell.md` | broken doc link to missing `PUForm` doc | repair or remove broken reference |
| `package.json` + governance docs | `docs:check` claims a missing script | remove broken references; do not replace with a permanent repo-level integrity script by default |

## Historical task material

These are not obvious deletion targets, but they should stop posing as current guidance.

| Path | Suggested action |
| --- | --- |
| `tasks/svc-v9/` | keep as historical baseline only |
| `tasks/svc-v91-doc-governance-refactor-2026-03-31/` | keep as historical task evidence |
| `tasks/svc-v91-root-task-migration-2026-03-31/` | keep as historical task evidence |
| `tasks/legacy/plan/*` | keep read-only unless explicitly superseded |
| `tasks/legacy/explore-plan/*` | keep read-only unless explicitly superseded |

## Cleanup order recommendation

1. Repair broken governance claims and broken links first.
2. Resolve duplicate and obviously disposable leftovers.
3. Re-home valuable but misplaced docs into the right durable owners.
4. Only after migration succeeds, archive or delete the old SVC v9.1 mapping docs.
