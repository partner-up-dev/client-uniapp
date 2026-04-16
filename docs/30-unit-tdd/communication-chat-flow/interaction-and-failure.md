# Interaction and failure modes

- Login success starts an asynchronous `Chat.get_mine()` load; chat list failures are logged and do not block login resolution.
- Notification tabs filter `useChatStore().my_chats` by `ChatType`.
- Each chat entry loads chat metadata, optional partner request data, and one latest message preview.
- Chat content loads a page of messages from the backend and refreshes after pull-down or explicit send success.
- Send failures report through the chat page error path and should not clear the draft input as successful.
- There is no active new-message event propagation contract in the current flow.
