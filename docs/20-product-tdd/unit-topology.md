# Unit Topology

This topology describes technical ownership boundaries for cross-unit reasoning.

| Unit | Owns | Does Not Own | Key Anchors |
| --- | --- | --- | --- |
| App boot | app creation, plugin installation, launch login hook | domain behavior or page-specific UI | `src/main.ts`, `src/App.vue` |
| Page layer | route-level presentation, route params, lifecycle hooks, page-to-store/model orchestration | business invariants or API protocol details | `src/pages/`, `src/pages.json` |
| Component layer | reusable UI pieces, local interaction, component-level validation display | page routing authority or cross-unit state ownership | `src/components/` |
| Business layer | domain models, Valibot parsing, HTTP/DB client attachment | UI layout, route registration, Pinia persistence policy | `src/business/` |
| State layer | Pinia stores, persisted client state, cross-page cached state | product claims or backend contract ownership | `src/store/` |
| Navigation infrastructure | page ids, path mapping, tabbar switching semantics | page content or product workflow meaning | `src/data/enum.ts`, `src/data/mapper.ts`, `src/utils/vendor.ts`, `src/utils/tabbar.ts` |
| Locale infrastructure | i18n setup, locale aggregate loading, translation key typing | product copy decisions beyond current strings | `src/locale/` |
| Platform/runtime adapters | mini-program compatibility wrappers, PostgREST/fetch polyfills, vendor API wrappers | product behavior or cross-unit contracts unless exposed upward | `src/libs/`, `src/utils/vendor.ts`, `vite-plugins/` |

## Boundary Rules

- Product claims and business rules are upstream in `docs/10-prd/`.
- Cross-unit contracts and state authority are owned here in Product TDD.
- Unit-local hazards stay in `docs/30-unit-tdd/` when they are worth preserving.
- Runtime and release hazards stay in `docs/40-deployment/`.
