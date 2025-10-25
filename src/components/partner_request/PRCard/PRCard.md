# PRCard 组件

## Rationale

PRCard 是用于显示搭子请求信息的卡片组件。它展示了搭子请求的基本信息、参与者头像、请求类型，并提供复制、收藏和加入等操作功能。

## Goals

- 以卡片形式展示搭子请求的核心信息
- 支持显示多个参与者头像（最多3个,超出显示数量提示）
- 提供直观的操作按钮（复制、收藏、加入）
- 响应式设计，适配不同屏幕尺寸
- 支持点击卡片和各种操作的事件回调
- 支持草稿模式（Draft），仅显示类型、创建时间、标题和概述

## Specification

### 界面设计

- 卡片布局包含元数据区域和操作区域
- **Explore/Join 类型**：
  - 元数据区域显示参与者头像、请求类型、主要信息和次要信息
  - 操作区域包含复制、收藏和加入按钮
  - 参与者头像支持重叠显示，超出3个时显示"+N"提示
- **Draft 类型**：
  - 元数据区域仅显示请求类型、创建时间、标题和概述
  - 不显示参与者头像和操作按钮

### 交互设计

- 点击卡片主体触发卡片点击事件
- 点击操作按钮触发对应的操作事件
- 支持阻止操作按钮的事件冒泡

### 功能细节

- 自动使用模拟数据（如果没有传入真实数据）
- 支持格式化搭子类型显示
- 自适应头像显示逻辑

## Implementation

### Props

| 属性名           | 类型                      | 默认值      | 必填 | 说明               |
| ---------------- | ------------------------- | ----------- | ---- | ------------------ |
| partnerRequest   | `PartnerRequest`          | -           | 否* | 搭子请求数据（与 `prId` 二选一）|
| prId             | `PRRef` (number)          | -           | 否* | 搭子请求 ID（与 `partnerRequest` 二选一）。提供后会自动加载数据 |
| partners         | `AccountBaseProfile[]`    | `[]`        | 否   | 参与者头像列表     |
| type             | `'Explore' \| 'Join' \| 'Draft'` | `'Explore'` | 否   | 卡片类型。`Draft` 类型仅显示类型、创建时间、标题和概述 |
| showJoinButton   | `boolean`                 | `true`      | 否   | 是否显示加入按钮（Draft 类型忽略此属性） |

\* **注意**：`partnerRequest` 和 `prId` 必须提供其中之一。

### Events

| 事件名        | 参数                              | 说明           |
| ------------- | --------------------------------- | -------------- |
| cardClick     | `(partnerRequest: PartnerRequest)` | 点击卡片       |
| joinClick     | `(partnerRequest: PartnerRequest)` | 点击加入按钮   |
| copyClick     | `(partnerRequest: PartnerRequest)` | 点击复制按钮   |
| bookmarkClick | `(partnerRequest: PartnerRequest)` | 点击收藏按钮   |

### Methods

#### generateMockPartnerRequest

函数签名：

```ts
function generateMockPartnerRequest(): PartnerRequest
```

用途：生成模拟的搭子请求数据
公开：是

#### generateMockPartners

函数签名：

```ts
function generateMockPartners(count: number = 3): AccountBaseProfile[]
```

用途：生成模拟的参与者数据
公开：是

#### formatPRType

函数签名：

```ts
function formatPRType(types: PRType[]): string
```

用途：格式化搭子类型显示文本
公开：是

#### getAvatarDisplayInfo

函数签名：

```ts
function getAvatarDisplayInfo(partners: AccountBaseProfile[], maxVisible: number = 3): {
  visiblePartners: AccountBaseProfile[];
  overflowCount: number;
  hasOverflow: boolean;
}
```

用途：获取参与者头像显示信息
公开：是

## 使用示例

### 通过 partnerRequest 对象使用

```vue
<template>
  <PRCard
    :partner-request="partnerRequest"
    type="Explore"
    @card-click="handleCardClick"
    @join-click="handleJoinClick"
  />
</template>
```

### 通过 prId 使用（自动加载数据）

```vue
<template>
  <PRCard
    :pr-id="123"
    type="Explore"
    @card-click="handleCardClick"
  />
</template>
```

组件会自动使用 `PartnerRequest.usePR()` 加载数据。

### Draft 类型

草稿类型仅显示搭子请求类型、创建时间、标题和概述，不显示参与者头像和操作按钮。

```vue
<template>
  <!-- 使用 partnerRequest -->
  <PRCard
    :partner-request="draftPartnerRequest"
    type="Draft"
    @card-click="handleDraftClick"
  />

  <!-- 或使用 prId -->
  <PRCard
    :pr-id="draftId"
    type="Draft"
    @card-click="handleDraftClick"
  />
</template>
```

## 其它

### 注意事项

1. 组件依赖 `PUButton` 组件，确保已正确导入
2. 头像图片路径需要是有效的静态资源路径
3. 如果没有传入真实数据，组件会自动使用模拟数据进行展示
4. 样式采用 SCSS 编写，支持响应式设计
5. 事件处理中使用了 `.stop` 修饰符防止事件冒泡
6. **Draft 类型**：创建时间使用 `getTimeLossFromNow` 格式化，显示相对时间（如"5分钟前"、"2小时前"）
7. **数据加载**：必须提供 `partnerRequest` 或 `prId` 其中之一。提供 `prId` 时，组件会使用 `PartnerRequest.usePR()` 自动加载数据

### 依赖组件

- `PUButton`: 用于操作按钮
- `@/business/partner_request`: 搭子请求业务模型
- `@/business/account`: 用户账户业务模型
