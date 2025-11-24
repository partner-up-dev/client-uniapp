# RouteEditor 组件

## Rationale

路线编辑器组件，用于创建和编辑出行路线。支持两种展示模式：普通编辑器（垂直列表布局）和沉浸式编辑器（卡片式布局）。提供完整的路线规划和编辑功能，包括地点选择、时间设置、途经点管理等。

## Goals

提供一个专业且灵活的路线编辑组件，支持：

- **双模式展示**：普通模式（适合表单场景）和沉浸式模式（适合专注编辑场景）
- **地点管理**：起点、终点、途经点的添加、编辑、删除
- **时间编辑**：支持出发时间、到达时间及时间弹性设置
- **地图集成**：集成腾讯地图插件进行地点选择和路线导航
- **数据验证**：支持基础和严格两种验证模式
- **灵活配置**：可禁用时间编辑、设置最大节点数等

## Specification

组件基于新的业务模型（`@/business/base/route`）实现，使用 Composition API，移除了对 wot-design-uni 的依赖，采用项目内部的 PU 系列组件。

### 两种模式对比

| 特性 | Normal 模式 | Immersive 模式 |
|------|------------|---------------|
| 布局 | 垂直列表，带侧边操作按钮 | 卡片式布局 |
| 适用场景 | 表单内嵌编辑 | 专注的全屏编辑 |
| 时间编辑器 | 始终使用内置编辑器 | 可选使用外部编辑器 |
| 视觉风格 | 紧凑 | 宽松、大字体 |

### 地图插件集成

- 使用腾讯地图小程序插件选择地点
- 支持路线规划和导航功能
- 自动处理地点数据的保存和关联

## Implementation

基于 Vue 3 Composition API 实现，集成腾讯地图插件和业务模型，使用组合式函数管理路线数据。

### Props

| 属性名 | 类型 | 默认值 | 必填 | 说明 |
|--------|------|--------|------|------|
| modelValue | `Route` | - | 是 | 路线数据（业务模型对象） |
| type | `'normal' \| 'immersive'` | `'normal'` | 否 | 编辑器类型 |
| max | `number` | `6` | 否 | 最大路线节点数（包括起点和终点） |
| disableDatetime | `boolean` | `false` | 否 | 是否禁用时间编辑 |
| ruleMode | `'basic' \| 'strict'` | `'basic'` | 否 | 验证规则模式：basic（基础验证：地点必填、时间顺序）/ strict（严格验证：基础+出发时间必填） |
| useDepDatetimeEditor | `boolean` | `true` | 否 | 是否使用内置的出发时间编辑器（仅 immersive 类型有效） |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | `(value: Route)` | v-model 更新事件 |
| change | `()` | 路线数据变更事件 |
| complete | `()` | 完成事件（所有必要数据已填写完毕，仅 immersive 类型触发） |
| edit_dep_time | `()` | 编辑出发时间事件（仅 immersive 类型且 useDepDatetimeEditor=false 时触发） |

### Slots

无插槽。

### Methods

| 方法名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| validate | `()` | `Promise<{ valid: boolean; errors: string[] }>` | 验证路线数据的有效性 |

### Watches

- `props.modelValue`: 监听外部路线数据变化并同步到内部状态
- `props.disableDatetime`: 监听时间编辑开关，自动清除或设置默认时间

## 使用示例

### 基础用法（Normal 模式）

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Route, RouteItem, RouteItemDatetime } from '@/business/base/route';
import RouteEditor from '@/components/base/routeEditor/routeEditor.vue';

const route = ref(new Route([
  RouteItem.parse({
    datetime: RouteItemDatetime.parse({
      datetime: new Date(),
      bring_ahead: 5,
      put_off: 5,
    }),
    location: '',
  }),
  RouteItem.parse({
    datetime: RouteItemDatetime.parse({
      datetime: null,
      bring_ahead: null,
      put_off: null,
    }),
    location: '',
  }),
]));

const handleRouteChange = () => {
  console.log('Route changed:', route.value);
};
</script>

<template>
  <RouteEditor
    v-model="route"
    type="normal"
    :max="6"
    rule-mode="strict"
    @change="handleRouteChange"
  />
</template>
```

### 沉浸式模式

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Route } from '@/business/base/route';
import RouteEditor from '@/components/base/routeEditor/routeEditor.vue';

const route = ref(/* ... */);

const handleComplete = () => {
  console.log('All required data filled!');
};

const handleEditDepTime = () => {
  // 使用外部时间编辑器
  console.log('Open external datetime editor');
};
</script>

<template>
  <RouteEditor
    v-model="route"
    type="immersive"
    :use-dep-datetime-editor="false"
    @complete="handleComplete"
    @edit_dep_time="handleEditDepTime"
  />
</template>
```

### 程序化验证

```vue
<script setup lang="ts">
import { ref } from 'vue';
import RouteEditor from '@/components/base/routeEditor/routeEditor.vue';

const routeEditorRef = ref();

const validateRoute = async () => {
  const result = await routeEditorRef.value.validate();
  if (result.valid) {
    console.log('Validation passed!');
  } else {
    console.error('Validation errors:', result.errors);
  }
};
</script>

<template>
  <RouteEditor ref="routeEditorRef" v-model="route" />
  <button @click="validateRoute">验证路线</button>
</template>
```

## 其它

### 依赖组件

- `RouteItemDatetimeEditor`: 时间编辑器（需要更新以移除 wd-* 依赖）
- `RouteItemLocationEditor`: 地点编辑器（需要更新以移除 wd-* 依赖）
- `PUButton`: 按钮组件
- `PUDrawer`: 抽屉组件

### 业务模型

使用 `@/business/base/route` 中的业务模型：

- `Route`: 路线类
- `RouteItem`: 路线项类
- `RouteItemDatetime`: 路线项时间类
- `Location`: 地点类

### 外部依赖

- 腾讯地图小程序插件（chooseLocation、routePlan）
- 需要在 `app.json` 中配置插件权限

### 注意事项

1. **业务模型迁移**：组件已从旧的类型定义（`@/types/partner_request/trip`）迁移到新的业务模型（`@/business/base/route`）
2. **插件配置**：使用前需确保小程序已配置腾讯地图插件
3. **权限要求**：需要位置权限
4. **子组件更新**：`RouteItemDatetimeEditor` 和 `RouteItemLocationEditor` 仍使用 wot-design-uni 组件，需要后续迁移
5. **兼容性**：支持微信小程序平台

### 待优化项

- [ ] 完善地点加载逻辑（当前简化处理）
- [ ] 更新子组件以移除 wd-* 依赖
- [ ] 添加拖拽排序功能
- [ ] 支持路线优化建议
- [ ] 添加单元测试
