# Verification

- Manual check: unread counts decrement on read and roll back on failure
- Manual check: history_messages newest-first ordering preserves lastMessage
- Manual check: if deprecated `unreadHandler` is touched, verify thread recursion and event emission separately
- Automated tests: none documented yet
