# ChatEntry 聊天条目

## Goals

- 提供聊天入口
- 显示聊天标题和PR类型标签
- 显示最新消息发送者、内容和时间
- 显示未读消息数量

## Key Concepts

- Chat: 聊天；在 `business/communication/chat.ts` 中查看其数据模型和方法。

## Specification

### 交互行为

- 点击，导航到该聊天的聊天页

### UI结构

- 第一行：flex space-between
  - 第一栏：聊天标题、搭子请求类型标签（如果是搭子请求群聊）
  - 第二栏：最新消息时间（`HH:MM`）
- 第二行：flex space-between
  - 第一栏：
    - 第一行：最新消息发送者头像与昵称
    - 第二行：最新消息内容
  - 第二栏：未读消息数量（>0时）

## Implementation

- 聊天标题、聊天类型等数据都在 `Chat` 类实例中，使用 `Chat.get(props.chatId)`
- 通过 `useChatStore().getChatUnread` 获取未读消息数量
- 通过 `Chat.get_messages` 获取最新消息
- 发送者头像与昵称复用 `account/account` 组件
- 搭子请求类型标签复用 `common/PUTag` 组件

### Props

- `chatId` (`ChatRef`, required): 聊天ID
