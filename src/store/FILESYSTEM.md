# src/store Filesystem

This document maps the store directory structure.

## Root

- `index.ts` — Pinia store instance creation and configuration

## Store modules

### account/

- `index.ts` — Main account store for user session and authentication

### api/

- `index.ts` — Module index
- `account.ts` — Account API token caching store
- `aliyun.ts` — Aliyun STS credentials store

### base/

- `index.ts` — Module index
- `location.ts` — Location entity caching store
- `requirement.ts` — Requirement entity caching store

### communication/

- `index.ts` — Module index
- `chat.ts` — Chat state and unread counts store
- `message.ts` — Message history and unread state store

### migration/

- `index.ts` — Data migration management store
- `funcs.ts` — Migration function definitions

### partner_request/

- `index.ts` — Partner request draft store
- `partner.ts` — Partner role entity caching store
- `split_the_bill/` — Split bill sub-module
  - `split_bill.ts` — Split bill entity caching store

### setting/

- `index.ts` — App settings and preferences store
