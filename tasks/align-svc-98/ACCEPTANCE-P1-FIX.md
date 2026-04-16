# Acceptance P1 Fix

## Scope

Fix the acceptance blockers around communication/message authority drift.

## State Diff

- From: Product TDD and Unit TDD treated `src/store/communication/message.ts` as active message/unread authority even though active UI code uses `useChatStore`, `Chat.get_messages()`, and `Message.send()`.
- To: Product TDD and Unit TDD describe the active chat/message flow; the unused legacy message store is removed.

## Decisions

- Do not revive `src/store/communication/message.ts`; it had no active callers and imported a non-existent `useNotificationChatStore`.
- Replace `notification-message-store` Unit TDD with `communication-chat-flow` Unit TDD.
- Keep message history as backend-fetched, component-local state unless a future Product TDD change explicitly introduces a persisted message cache.

## Verification Targets

- No active references to `useNotificationMessageStore`, `useNotificationChatStore`, `notification-message-store`, or `src/store/communication/message.ts`.
- Product TDD communication contracts point to `src/store/communication/chat.ts`, `src/business/communication/chat.ts`, and `src/business/communication/message.ts`.
- Alignment surface anchors point to active page/component/store/business addresses.
