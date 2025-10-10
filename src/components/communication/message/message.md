# Message 消息组件

## Rationale

在聊天场景中需要展示不同类型的消息（文本、图片、时间戳、系统提示等），并对齐到发送者或接收者一侧，支持展示头像、用户名、发送时间以及消息气泡内的富文本（表情/链接）。

## Goals

- 提供统一的消息渲染入口
- 支持左右两侧布局（self / other）
- 支持头像、昵称、时间、消息内容渲染

## Key Concepts

- Message: 消息

## Specification

### 视觉

- 消息的创建者为当前用户时，靠右显示，否则靠左
- 消息内容的最小宽度是其父组件的 50%, 最大宽度是父组件的 70%
- 消息类型为纯文本时，使用气泡样式渲染内容；且为我发送时，气泡背景颜色为 PrimaryContainer

### 组成

- 发送者头像
- 发送时间
- 消息内容

## Implementation

### Props

- `message` (`Message`, required)
