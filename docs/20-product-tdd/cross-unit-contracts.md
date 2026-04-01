# Cross-unit contracts

## Auth token propagation

- HTTPApiClient reads authHeaders from the account store on every request
- HTTPApiClient updates the account store token from response Authorization headers
- DBApiClient creates fresh builders with updated auth headers on every operation
- Any change to token parsing must keep Authorization and authorization header compatibility

## HTTP and DB boundaries

- HTTPApiClient targets the main backend API via VITE_BACKEND_MAIN_URL
- DBApiClient targets PostgREST via VITE_PGRST_URL
- Both clients share the same account auth headers but do not share request logic

## i18n authority

- Global bundles live in src/locale/{locale}/*.jsonc and are loaded in src/locale/index.ts
- useTranslate provides domain-prefix translation (snakeCase of domain)
- Local messages use useI18n with localMessages next to the component or page

## Navigation authority

- PAGE_ID values must map to PAGE_PATH entries
- navigate chooses switchTab vs navigateTo based on TABBAR_PAGE_ID
- Adding a new page requires updating PAGE_ID and PAGE_PATH in sync
