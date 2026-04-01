# Surface glossary

Canonical terms for reference-sensitive changes.

- Surface: A user-visible area with stable behavior boundaries (page, tab, form, timeline, panel).
- Surface ID: A stable address token used in alignment docs (for example `surface.pr.detail`).
- Flow: An ordered interaction path crossing one or more surfaces.
- Anchor: A concrete implementation entrypoint used for targeting (page ID, route path, module file).
- Contract anchor: The cross-unit contract entry that must remain true while changing a surface.
- Hot surface: A surface with frequent edits or high regression risk.
- Scope-in: What the current change is explicitly allowed to modify.
- Scope-out: What must not be modified during the current change.
- Invariant: A behavior that must remain true before and after the change.
- Drift: A mismatch between declared governance truth and current repository reality.
