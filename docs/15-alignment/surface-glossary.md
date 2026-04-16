# Surface Glossary

These terms are coordination terms, not product glossary terms.

## Coordination Primitives

- Object: the kind of thing being discussed, such as a surface, route, component, store, contract, or workflow.
- Address: the stable location of the object in code, docs, route maps, or UI surfaces.
- Operation: the intended state transition, selected from `operation-taxonomy.md`.
- Boundary: the allowed edge of the change.
- Invariant: behavior or contract that must remain true before and after the change.
- State / Context: the condition under which the address and mutation are valid.
- Evidence: objective proof that justifies the mutation and bounds the blast radius.
- Protocol: the human-agent synchronization step before risky execution.

## Addressing Terms

- Surface: a user-visible area with stable behavior boundaries, such as a page, tab, form, timeline, or panel.
- Surface ID: a stable address token used in alignment docs, for example `surface.pr.detail`.
- Anchor: a concrete implementation entrypoint used for targeting, such as a page file, enum member, route path, or store module.
- Contract anchor: a cross-unit contract entry that must remain true while changing a surface.
- Calculable map: an address map that can be checked against code or structured config.
- Static map: a hand-maintained description that cannot be cheaply verified; avoid using this as the primary alignment surface.
- Non-routable source: a source file or folder that exists but is not registered as a navigable page or durable surface.

## Scope Terms

- Scope-in: what the current change is explicitly allowed to modify.
- Scope-out: what must not be modified during the current change.
- Blast radius: likely downstream files, modules, surfaces, or durable owners affected by the change.
- Drift: a mismatch between declared coordination truth and current repository reality.
