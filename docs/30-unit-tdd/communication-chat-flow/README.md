# Communication chat flow

Location: `src/business/communication/chat.ts`, `src/business/communication/message.ts`, `src/store/communication/chat.ts`, `src/components/communication/ChatEntry/`, `src/components/communication/ChatContent/`, `src/pages/communication/chat.vue`, `src/pages/notification/notification.vue`

Purpose: preserve the active chat list, unread count, latest-message preview, message retrieval, and send refresh behavior.

## Owner Boundary

- `src/store/communication/chat.ts` owns the active local chat list and unread counts.
- `Chat.get_messages()` owns message retrieval for history and latest-message previews.
- `Message.send()` owns plain-text message submission.
- Components/pages own only local presentation state such as loaded message arrays and preview refs.
- There is no active persisted message-cache store authority.

## Product TDD Links

- [../../20-product-tdd/cross-unit-contracts.md](../../20-product-tdd/cross-unit-contracts.md)
- [../../20-product-tdd/system-state-and-authority.md](../../20-product-tdd/system-state-and-authority.md)
