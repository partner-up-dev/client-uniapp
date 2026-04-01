# Release and migration

## Build commands

- pnpm dev:mp-weixin
- pnpm dev:mp-alipay
- pnpm dev:h5
- pnpm build:mp-weixin
- pnpm build:mp-alipay

## Verification

- pnpm type-check
- pnpm test:h5
- pnpm test:mp-weixin

## Migration notes

- Update pages.json and data/enum.ts together when adding new pages
- Keep locale JSONC bundles in sync across zh-Hans and en-US
