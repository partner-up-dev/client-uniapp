# Profile 页面

## 概述

用户资料页面用于展示其他用户的公开信息，包括头像、昵称、加入时间等基本资料，并提供与该用户互动的入口（如私信）。

## 页面位置

- 路径: `pages/account/profile/profile`
- 类型: 普通页面
- 模块: `account`

## 功能特性

### 1. 用户信息展示

- **背景壁纸**: 展示用户设置的个人壁纸图片，若未设置则显示默认壁纸，带有渐变遮罩效果
- **头像**: 展示用户的头像（xLarge 尺寸，无圆角）
- **用户昵称**: 显示用户的昵称
- **加入时间**: 显示用户注册/加入平台的日期

### 2. 交互操作

#### 发送私信

- 位置: 操作按钮区域右侧
- 样式: 绿色主题按钮（PrimaryContainer）
- 功能: 点击后导航到与该用户的聊天页面或创建新的聊天会话

## 页面参数

通过 URL query 参数接收：

```typescript
{
  id: string;  // 用户 ID（必需）
}
```

示例：`/pages/account/profile/profile?id=user123`

## 数据模型

### 核心数据

使用 `business/account/base.ts` 的 `AccountBaseProfile` 类:

```typescript
{
  id: string;
  created_at: Date;
  nickname: string;
  bio: string | null;
  wallpaper: string | null;
  avatar: string | null;
  age_range: number | null;
  gender: string | null;
  mbti: string | null;
}
```

### 数据加载

- 通过 `AccountBaseProfile.use(accountId)` 获取指定用户的资料
- 自动加载和缓存用户数据
- 提供 loading 状态

## 组件复用

- `common/safeAreaInset`: 处理顶部状态栏和底部安全区域
- `common/avatar`: 展示用户头像，xLarge 尺寸，无圆角
- `common/PUButton`: 私信按钮

## 样式设计

### 布局结构

```text
┌─────────────────────────────┐
│      Status Bar (Safe)      │
├─────────────────────────────┤
│                             │
│      Wallpaper Image        │
│      (with gradient)        │
│                             │
│  [Avatar]     2025-10-16 加入│
│               用户昵称       │
└─────────────────────────────┘
│                             │
│                 [💬 私信]   │
│                             │
├─────────────────────────────┤
│     Bottom Safe Area        │
└─────────────────────────────┘
```

### 设计要点

1. **壁纸区域**: 429px 固定高度，支持图片背景，覆盖渐变遮罩从透明到页面背景色
2. **用户信息卡片**: 位于壁纸底部，左右间距 16px
3. **头像**: xLarge 尺寸 (60px)，无圆角
4. **用户信息**: 右对齐，包含加入日期（label-small）和昵称（title-large）
5. **操作按钮**: 右对齐，使用 PrimaryContainer 主题的小尺寸按钮

### 背景渐变

使用 CSS 渐变实现壁纸与页面背景的平滑过渡：

```css
background-image: linear-gradient(
  to bottom, 
  rgba(255, 255, 255, 0) 70%, 
  var(--background-color) 96%
), url(${wallpaperUrl});
```

## 生命周期

### onLoad

- 接收页面参数（用户 ID）
- 使用 Valibot 验证参数格式
- 触发用户资料加载

## 国际化

使用 `account` 模块的翻译：

主要翻译键：

- `profile_metadata.created_at.suffix`: "加入"文本
- `profile_metadata.nickname.placeholder`: 默认昵称占位符
- `profile.operation.chat_with_me`: 私信按钮文本（"评论"）

## TODO

- [ ] 实现导航到聊天页面的逻辑
- [ ] 添加更多用户信息展示（bio、个人特征等）
- [ ] 实现用户关注/取消关注功能
- [ ] 添加举报/拉黑功能入口
- [ ] 支持查看用户发布的搭子请求

## 相关页面

- 聊天页面 (`pages/communication/chat`)
- 我的页面 (`pages/me/me`)

## 测试要点

1. 验证页面参数正确解析
2. 验证用户信息正确加载和展示
3. 验证默认头像和昵称的 fallback 逻辑
4. 验证壁纸图片加载和渐变效果
5. 验证安全区域处理在不同设备上的表现
6. 验证私信按钮点击响应
7. 验证加入日期格式化正确
8. 验证 loading 状态处理
