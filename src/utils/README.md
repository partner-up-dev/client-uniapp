# Utils

This directory contains shared utility modules and UniApp/platform wrappers.

Not every utility here is pure. Modules such as `vendor.ts`, `tabbar.ts`, and `log.ts` intentionally call UniApp, Weixin, or storage APIs.

## Files

- `index.ts` — barrel exports for common utilities
- `enum.ts` — enum helpers such as `enumToPickerOptions()` and `isInEnum()`
- `format.ts` — formatting helpers
- `function.ts` — debounce, throttle, and function guards
- `log.ts` — logging wrapper with Weixin realtime logging support
- `mime.ts` — MIME helpers
- `object.ts` — object/path/nullability helpers
- `props.ts` — Vue prop builder helpers
- `retry.ts` — retry helper
- `string.ts` — string and query helpers
- `style.ts` — shared style types and px conversion
- `tabbar.ts` — custom tabbar state helpers
- `time.ts` — date/time formatting helpers
- `vendor.ts` — UniApp API wrapper and navigation helper
- `vue.ts` — Vue component options helpers
- `lbs/` — Tencent LBS integration helpers and types

## Authority Boundaries

- Navigation ids and paths are owned by `../data/enum.ts` and `../data/mapper.ts`.
- `vendor.ts` owns the `navigate()` wrapper and chooses `switchTab` vs `navigateTo`.
- `tabbar.ts` owns helper calls into the custom tabbar instance, but tabbar route data also depends on `../custom-tab-bar/index.js` and `../pages.json`.
- Generic helpers should stay side-effect-light unless the module is explicitly a platform wrapper.

## Import Guidance

- Prefer `@/utils` for shared pure helpers that are exported from `index.ts`.
- Import module-specific side-effect helpers directly, for example `@/utils/vendor`, `@/utils/tabbar`, or `@/utils/log`.
- Keep new helpers small enough to understand from code; only add README detail when behavior is non-obvious.

## Maintenance Rules

- New route/navigation behavior must be reflected in `../../docs/20-product-tdd/cross-unit-contracts.md` if it crosses units.
- Runtime/platform hazards belong in `../../docs/40-deployment/operational-hazards.md`.
- Avoid documenting planned utilities here before they exist.
- Add exports to `index.ts` only for helpers intended as stable shared imports.

## Related Docs

- [Coding instructions](../../.github/instructions/coding.instructions.md)
- [TypeScript instructions](../../.github/instructions/typescript.instructions.md)
- [Product TDD navigation contract](../../docs/20-product-tdd/cross-unit-contracts.md)
- [Alignment UI surface map](../../docs/15-alignment/ui-surface-map.md)
