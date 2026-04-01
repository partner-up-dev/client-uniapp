# Unit topology

## Primary layers

- UI layer: pages and components under src/pages and src/components
- Business layer: domain models and API clients under src/business
- State layer: Pinia stores under src/store
- Infrastructure: locale, utils, data enums, and libs under src/locale, src/utils, src/data, src/libs

## Cross-cutting utilities

- Navigation: src/data/enum.ts, src/data/mapper.ts, src/utils/vendor.ts
- i18n: src/locale/index.ts and JSONC bundles under src/locale
- API access: src/business/http-api.ts and src/business/db-api.ts
