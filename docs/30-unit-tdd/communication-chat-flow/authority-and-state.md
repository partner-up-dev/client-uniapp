# Authority and state

- `useChatStore` owns `my_chats` and `chat_unreads`.
- `Account.V2WXMPLogin()` loads `Chat.get_mine()` after login and stores the result through `useChatStore().setMyChats()`.
- `ChatEntry` reads `useChatStore().getChatUnread(chatId)` for unread badges.
- `ChatEntry` fetches its latest preview through `Chat.get_messages(chatId, 0, 1, true)`.
- `ChatContent` owns its loaded `Message[]` as component-local state and refreshes it through `Chat.get_messages()`.
- `chat.vue` sends plain text through `Message.send()` and asks `ChatContent` to refresh after send.
