# Chat 聊天页面

## Rationale

用户需要一个专门的页面来查看特定聊天的消息记录，并能够发送新消息进行交流。该页面需要清晰地展示消息历史，提供便捷的消息输入方式，并支持刷新和加载更多历史消息。

## Goals

- 显示指定聊天的消息列表
- 允许用户发送纯文本消息
- 支持下拉刷新加载更多历史消息
- 提供刷新按钮手动刷新消息
- 清晰的头部导航（返回、标题、操作按钮）
- 适配安全区域（状态栏、底部、微信小程序菜单按钮）

## Key Concepts

- **Chat**: 聊天会话，包含标题、成员等信息
- **Message**: 消息，包含内容、发送者、时间等信息
- **ChatContent**: 聊天内容组件，负责渲染消息列表
- **Pull-to-refresh**: 下拉刷新机制，加载更多历史消息

## Specification

### 视觉设计

#### 布局结构

1. **Header（头部）**
   - 背景色：`$pu-color-secondary` (#85976e)
   - 文字颜色：`$pu-color-on-secondary` (白色)
   - 左侧：返回按钮 + 聊天标题
   - 右侧：刷新按钮 + 更多按钮
   - 内边距：`$pu-spacing-sm` `$pu-spacing-md`

2. **Content（内容区）**
   - 背景色：`$pu-color-surface` (#f9faef)
   - 使用 `ChatContent` 组件展示消息列表
   - 支持滚动和下拉刷新

3. **Footer（底部输入区）**
   - 背景色：`$pu-color-surface-container` (#eeefe3)
   - 包含：消息输入框 + 发送按钮
   - 内边距：`$pu-spacing-sm` `$pu-spacing-md`

#### 组件样式

- **返回按钮**: 使用 `i-mdi-arrow-left` 图标
- **刷新按钮**: 使用 `i-mdi-refresh` 图标
- **更多按钮**: 使用 `i-mdi-dots-vertical` 图标
- **发送按钮**: 使用 `i-mdi-send` 图标
- **消息输入框**:
  - 边框：1px solid `$pu-color-outline`
  - 圆角：`$pu-radius-medium`
  - 最大长度：120 字符
  - 最小高度：28px，最大高度：120px（自动增高）

### 交互行为

1. **页面加载**
   - 从 URL 参数获取 `chatId`
   - 加载聊天信息（标题等）
   - 自动加载最新消息列表

2. **发送消息**
   - 用户在输入框输入文本
   - 发送按钮仅在输入内容符合要求时可用（1-120字符）
   - 点击发送按钮调用 `Message.send()` API
   - 发送成功后清空输入框并刷新消息列表

3. **刷新消息**
   - **方式1**: 点击头部刷新按钮
   - **方式2**: 下拉 ChatContent 区域触发下拉刷新
   - 两种方式都会重新获取消息列表

4. **返回**
   - 点击返回按钮返回上一页面

5. **更多操作**
   - 点击更多按钮（待实现具体功能）

### 安全区域处理

- 顶部状态栏安全区域：使用 `safeAreaInset position="top"`
- 微信小程序菜单按钮：使用 `safeAreaInset position="wxmp-menu"`
- 底部安全区域：使用 `safeAreaInset position="bottom"`

## Implementation

### 页面参数

通过 URL 参数传递：

- `id` (必需): 聊天会话 ID（`ChatRef`）

示例：`/pages/chat/chat?id=123`

### 核心功能

1. **加载聊天数据**: `loadChatData()`
   - 使用 `Chat.get(chatId)` 获取聊天信息
   - 更新页面标题

2. **发送消息**: `onSendButtonClick()`
   - 验证消息内容长度（1-120字符）
   - 调用 `Message.send(chatId, content)`
   - 发送成功后刷新消息列表

3. **刷新消息**: `onRefreshButtonClick()`
   - 调用 `ChatContent` 组件的 `getMessages()` 方法

4. **下拉刷新**: 使用 `usePulldownRefresher` composable
   - 监听下拉事件
   - 触发时重新加载消息

### 依赖组件

- `ChatContent`: 聊天内容组件（`components/communication/ChatContent`）
- `safeAreaInset`: 安全区域组件（`components/common/safeAreaInset`）

### 状态管理

- `chat`: 当前聊天对象
- `messageContent`: 消息输入框内容
- `isSending`: 是否正在发送消息
- `isLoadingChat`: 是否正在加载聊天信息
- `is_refreshing`: 是否正在下拉刷新

### 计算属性

- `chatId`: 聊天 ID（从页面参数提取）
- `chatTitle`: 聊天标题（从 chat 对象获取，默认"聊天"）
- `canSend`: 是否可以发送消息（内容长度符合要求且未在发送中）

## Navigation

从 `ChatEntry` 组件跳转到此页面：

```typescript
navigate({
  page_id: PAGE_ID.CHAT,
  params: { id: chatId.toString() },
});
```

## Future Enhancements

- 支持发送图片、文件等多种消息类型
- 消息已读状态显示
- 实时消息推送（WebSocket）
- 消息搜索功能
- 聊天设置（静音、置顶等）
- 更多菜单功能（查看聊天信息、清空聊天记录等）
