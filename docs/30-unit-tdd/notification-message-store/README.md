# Notification message store

Location: src/store/communication/message.ts

Purpose: manage message state, history lists, and unread counts for chats and notifications.

## Owner Boundary

- Owns cached messages, history message id lists, unread counts, and read rollback behavior.
- Does not own chat/thread metadata; it collaborates with `src/store/communication/chat.ts`.
- Does not own notification page UI or tabbar rendering.

## Product TDD Links

- [../../20-product-tdd/cross-unit-contracts.md](../../20-product-tdd/cross-unit-contracts.md)
- [../../20-product-tdd/system-state-and-authority.md](../../20-product-tdd/system-state-and-authority.md)
