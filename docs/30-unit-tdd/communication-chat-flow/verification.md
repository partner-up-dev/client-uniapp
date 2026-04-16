# Verification

- Manual check: login populates notification chat lists by chat type.
- Manual check: chat entries show unread counts from `useChatStore` and fetch the latest preview in newest-first order.
- Manual check: chat thread initial load, pull-down refresh, and explicit refresh reload messages.
- Manual check: successful send clears input and refreshes the visible message list.
- Static check: no active imports of legacy notification message store symbols or paths remain.
- Automated tests: none documented yet.
