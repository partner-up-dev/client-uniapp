# ChatContent 聊天内容组件

## Rationale

在聊天界面中需要渲染指定聊天的所有消息列表，按时间顺序从上到下垂直排列，最新消息在底部。

## Goals

- 渲染指定聊天的消息列表
- 消息垂直排列（最新在底部）
- 复用现有的 message 组件进行消息渲染

## Key Concepts

- Chat: 聊天
- Message: 消息

## Specification

### 视觉

- 背景色使用 `$pu-color-surface` (#f9faef)
- 消息从上到下垂直排列，消息间距 8px
- 最新的消息显示在底部
- 每条消息使用 message 组件进行渲染，保持现有组件的设计
- 对方消息左对齐，我的消息右对齐
- 消息容器最大宽度由 message 组件控制（70%），最小宽度（50%）
- 具体的视觉样式（头像、时间戳、气泡样式等）由 message 组件负责

### 行为

- 接收 chatId 参数，获取对应聊天的消息列表
- 从消息存储中获取历史消息ID列表
- 根据消息ID获取具体的消息数据
- 使用 message 组件渲染每条消息

## Implementation

### Props

- `chatId` (`ChatRef`, required): 聊天会话ID

### Methods

- `getMessages()`: 获取聊天消息列表
- `scrollToBottom()`: 滚动到最新消息（底部）

### Watches

- `props.chatId`: 当聊天ID变化时，重新获取消息列表
