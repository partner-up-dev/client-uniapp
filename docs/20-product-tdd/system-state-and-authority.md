# System state and authority

## Auth token

- Authority: src/store/account/index.ts owns access_token
- Derived headers: authHeaders getter builds Authorization header
- Update path: HTTPApiClient updates token from response headers

## Locale messages

- Authority: src/locale/index.ts and JSONC bundles under src/locale/{locale}
- Domain/global text: useTranslate from src/locale
- Local text: useI18n with localMessages in the component or page

## Navigation

- Authority: PAGE_ID and TABBAR_PAGE_ID in src/data/enum.ts
- Path map: PAGE_PATH in src/data/mapper.ts
- Router wrapper: navigate in src/utils/vendor.ts

## Storage keys

- Authority: LOCAL_STORAGE_KEY enum in src/data/enum.ts

## Notification message state

- Authority: src/store/communication/message.ts for messages, history, and unreads
