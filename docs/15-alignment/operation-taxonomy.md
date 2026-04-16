# Operation Taxonomy

Operation words in this layer are verification contracts. If a verb does not imply how the result will be checked, it is too weak for alignment-heavy work.

## Selection Rule

- Pick the narrowest operation class that explains the intended state transition.
- Write the requested mutation as `From -> To` before editing.
- If more than one class applies, use the class with the larger durable owner blast radius.
- If product behavior changes, update PRD before implementation.
- If cross-unit contracts change, update Product TDD before implementation.
- If runtime or release behavior changes, update Deployment docs before implementation.

## Operation Classes

| ID | Operation | Use When | Required Verification |
| --- | --- | --- | --- |
| ALN-OP-COPY | copy or localization update | User-facing words change without behavior changes. | Changed keys or text are reachable; no logic, route, state, or contract edits are included. |
| ALN-OP-STYLE | visual style update | Layout, spacing, color, typography, or token use changes. | Affected surfaces still render and behavior/state authority is unchanged. |
| ALN-OP-ADDRESS | route or address update | Page ID, route path, tabbar path, surface ID, or navigation target changes. | `pages.json`, `PAGE_ID`, `PAGE_PATH`, tabbar config, and navigation callsites remain consistent. |
| ALN-OP-SURFACE | surface behavior update | User-visible page or component behavior changes without redefining product rules. | Affected surface is exercised and linked PRD claims remain true. |
| ALN-OP-STATE | state authority update | Ownership, persistence, lifecycle, or propagation of state changes. | Store/business/page boundaries are explicit and Product TDD authority is current. |
| ALN-OP-CONTRACT | cross-unit contract update | Interfaces between page, component, store, business model, API, or runtime change. | Contract owner is updated and callers are checked. |
| ALN-OP-PRODUCT | product rule or workflow update | A user-visible rule, invariant, claim, workflow, or scope changes. | PRD is updated first and realization pointers are reviewed. |
| ALN-OP-RUNTIME | runtime or deployment update | Environment, build, release, migration, platform capability, or rollback behavior changes. | Deployment owner is updated and rollback or sanity check is named. |
| ALN-OP-REFACTOR | local refactor | Structure or naming changes while observable behavior stays equivalent. | Callers still compile or test; no product, state, or contract behavior changes. |
| ALN-OP-EXTRACT | extraction or seam creation | A helper, component, contract, or module is split out to reduce coupling. | New seam is named, callers are migrated, and equivalence is checked. |

## Weak Verbs To Avoid

- improve
- clean up
- adjust
- optimize
- align
- fix

Use one of these only after translating it into a concrete operation class and verification contract.
