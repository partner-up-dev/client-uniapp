# Interaction and failure modes

- unreadHandler consumes backend read-state and triggers new message fetches
- loadNewMessages fetches new message ids, then updates history list
- read() reports to the backend and rolls back on failure
- uni.$emit(EVENT.NEW_MESSAGE) is triggered for updated chats
