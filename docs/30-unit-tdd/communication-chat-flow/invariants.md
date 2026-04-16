# Invariants

- `chat_unreads` is keyed by `ChatRef`; missing entries read as zero through `getChatUnread()`.
- `my_chats` contains `Chat` objects and notification tabs derive their lists from `Chat.type`.
- Latest-message previews request exactly one message in newest-first order.
- Chat thread content requests messages in display order and keeps the loaded array local to `ChatContent`.
- A successful send must be followed by a message refresh so the sent message can appear in the thread.
- No active code should import a persisted notification-message store for message history authority.
