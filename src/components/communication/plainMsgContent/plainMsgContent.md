# plainMsgContent

Plain text message bubble used by `communication/message`.

Props:

- `message: { id, text }` (required) - message payload.
- `isMe: boolean` - whether the message was sent by current user. Defaults to `false`.

Styling:

- Messages from others use `var(--pu-color-surface-container-lowest)` and set top-left corner to 0.
- Messages from self use `var(--pu-color-surface-container-high)` (project token) and regular rounded corners.
