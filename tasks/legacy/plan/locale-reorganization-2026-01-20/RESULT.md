# Locale Reorganization Results

Status: Completed for structure; translations remain incomplete by design.

## Summary

- Added a Python automation script to reorganize locale domains and enforce the split-bill rename.
- Extracted `common` and `communication` domains into dedicated files and aggregated `explore` under a new `page` domain.
- Moved approval/contract/clause keys into `partner_request` via an aggregator wrapper.
- Simplified main locale entry files to use the new domain aggregators.

## Files Added

- scripts/reorg-locales.py
- src/locale/zh-Hans/common.ts
- src/locale/zh-Hans/communication.ts
- src/locale/zh-Hans/page.ts
- src/locale/zh-Hans/partner_request.ts
- src/locale/zh-Hans/base.ts
- src/locale/zh-Hans/account.ts
- src/locale/zh-Hans/onboarding.ts
- src/locale/zh-Hans/split_bill.ts
- src/locale/en-US/common.ts
- src/locale/en-US/page.ts
- src/locale/en-US/base.ts
- src/locale/en-US/account.ts
- src/locale/en-US/onboarding.ts
- src/locale/en-US/partner_request.ts
- src/locale/en-US/split_bill.ts
- src/locale/en-US/communication.ts

## Files Updated

- src/locale/zh-Hans.ts
- src/locale/en-US.ts

## Key Behaviors

- `common` aggregates all residual top-level keys (pages/api/storage/feed/editor/account_picker/home/me).
- `communication` aggregates chat/message/notification.
- `page` aggregates explore.
- `partner_request` now includes approval/contract/legal/clause keys from the root.
- `split_the_bill` folder renamed to `split_bill`.

## Notes

- Missing translations are acceptable; `en-US` domain files use empty objects where needed.
- Run the script again after future locale edits to re-sync domain files.
