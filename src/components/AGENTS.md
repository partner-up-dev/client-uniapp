# Components Agent Notes

This folder contains reusable UI components grouped by domain (e.g., `common/`, `partner_request/`).

## Quick start

**When editing components, read in this order:**

1. This file (AGENTS.md) — overview and quick reference
2. [Shared conventions](../../docs/.agents/shared-conventions.md) — common development rules
3. [Vue patterns](../../docs/.agents/vue-patterns.md) — component structure and patterns
4. [Styling guide](../../docs/.agents/styling/index.md) — styling conventions
5. [Component doc template](../../docs/.agents/component-doc-template.md) — doc format and rules

## Structure

Each component usually lives in its own folder:

- `<compName>.vue` — main component
- `<compName>.ts` — props/emits/types/helpers
- `<compName>.scss` — styles
- `<compName>.md` — component documentation

If a component name conflicts with a built-in element name, prefix it with `PU`.

## Vue component template

Use the standard pattern:

- default export with `name` and `options` (use `BasicComponentOptions` when applicable)
- `defineProps()` and `defineEmits()` from the component’s `.ts` module
- `defineModel()` for v-model when needed
- styles loaded via `style lang="scss" scoped src="./compName.scss"`

See shared docs for styling, i18n, and other cross-cutting conventions.
