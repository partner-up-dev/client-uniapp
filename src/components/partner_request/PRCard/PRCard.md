# PRCard 组件

## Rationale

PRCard 是用于显示搭子请求信息的卡片组件。它展示了搭子请求的基本信息、参与者头像、请求类型，并提供复制、收藏和加入等操作功能。

## Goals

- 以卡片形式展示搭子请求的核心信息
- 支持显示多个参与者头像（最多3个，超出显示数量提示）
- 提供直观的操作按钮（复制、收藏、加入）
- 响应式设计，适配不同屏幕尺寸
- 支持点击卡片和各种操作的事件回调

## Specification

### 界面设计

- 卡片布局包含元数据区域和操作区域
- 元数据区域显示参与者头像、请求类型、主要信息和次要信息
- 操作区域包含复制、收藏和加入按钮
- 参与者头像支持重叠显示，超出3个时显示"+N"提示

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
| partnerRequest   | `PartnerRequest`          | -           | 是   | 搭子请求数据       |
| partners         | `AccountBaseProfile[]`    | `[]`        | 否   | 参与者头像列表     |
| type             | `'Explore' \| 'Join'`     | `'Explore'` | 否   | 卡片类型           |
| showJoinButton   | `boolean`                 | `true`      | 否   | 是否显示加入按钮   |

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

### 基本用法

```vue
<template>
  <PRCard
    :partner-request="partnerRequest"
    :partners="partners"
    @card-click="handleCardClick"
    @join-click="handleJoinClick"
    @copy-click="handleCopyClick"
    @bookmark-click="handleBookmarkClick"
  />
</template>

<script setup lang="ts">
import PRCard from '@/components/partner_request/PRCard/PRCard.vue';
import { generateMockPartnerRequest, generateMockPartners } from '@/components/partner_request/PRCard/PRCard';

// 使用模拟数据
const partnerRequest = generateMockPartnerRequest();
const partners = generateMockPartners(4); // 生成4个参与者，会显示前3个+1

const handleCardClick = (pr) => {
  console.log('点击卡片:', pr);
};

const handleJoinClick = (pr) => {
  console.log('点击加入:', pr);
};

const handleCopyClick = (pr) => {
  console.log('点击复制:', pr);
};

const handleBookmarkClick = (pr) => {
  console.log('点击收藏:', pr);
};
</script>
```

### 隐藏加入按钮

```vue
<template>
  <PRCard
    :partner-request="partnerRequest"
    :show-join-button="false"
  />
</template>
```

### 自定义类型

```vue
<template>
  <PRCard
    :partner-request="partnerRequest"
    type="Join"
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

### 依赖组件

- `PUButton`: 用于操作按钮
- `@/business/partner_request`: 搭子请求业务模型
- `@/business/account`: 用户账户业务模型
