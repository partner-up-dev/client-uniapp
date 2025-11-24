# PUAccordion 手风琴/折叠面板组件

## Rationale

手风琴/折叠面板组件用于展示可折叠的内容区域，常用于FAQ、设置项、详情展示等场景。支持普通模式、手风琴模式和查看更多模式。

## Goals

- 支持普通模式：可同时展开多个面板
- 支持手风琴模式：同时只能展开一个面板
- 支持查看更多模式：用于长文本的展开/收起
- 提供灵活的自定义能力
- 支持展开前的钩子函数
- 动画流畅自然

## Specification

### Props

#### PUAccordion

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| modelValue | `string \| string[] \| boolean` | - | 绑定值，手风琴模式为 string，普通模式为 string[]，查看更多模式为 boolean |
| accordion | `boolean` | `false` | 是否开启手风琴模式 |
| viewmore | `boolean` | `false` | 是否开启查看更多模式 |
| useMoreSlot | `boolean` | `false` | 查看更多模式下，是否使用自定义展开按钮插槽 |
| lineNum | `number` | `2` | 查看更多模式下，收起时的显示行数 |
| customClass | `string` | `""` | 自定义根节点样式类 |
| customStyle | `string` | `""` | 自定义根节点样式 |
| customMoreSlotClass | `string` | `""` | 查看更多模式下的插槽外部自定义样式 |

#### PUAccordionItem

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| name | `string` | - | 折叠栏的标识符，必填 |
| title | `string` | `""` | 折叠栏的标题 |
| disabled | `boolean` | `false` | 是否禁用 |
| beforeExpand | `Function` | - | 打开前的回调函数，返回 false 或 Promise.reject 可以阻止打开 |
| customBodyClass | `string` | `""` | 自定义折叠栏内容容器样式类名 |
| customBodyStyle | `string` | `""` | 自定义折叠栏内容容器样式 |
| customClass | `string` | `""` | 自定义根节点样式类 |
| customStyle | `string` | `""` | 自定义根节点样式 |

### Events

#### PUAccordion

| 事件名 | 参数 | 说明 |
|--------|------|------|
| change | `{ value: string \| string[] \| boolean }` | 当前激活面板改变时触发 |
| update:modelValue | `value: string \| string[] \| boolean` | 当前激活面板改变时触发，用于 v-model 绑定 |

### Slots

#### PUAccordion

| 插槽名 | 参数 | 说明 |
|--------|------|------|
| default | - | 折叠面板内容，通常放置 PUAccordionItem |
| more | - | 查看更多模式下的自定义展开按钮（需设置 useMoreSlot 为 true） |

#### PUAccordionItem

| 插槽名 | 参数 | 说明 |
|--------|------|------|
| default | - | 折叠面板的内容 |
| title | `{ expanded: boolean, disabled: boolean, isFirst: boolean }` | 自定义标题内容 |

### Expose Methods

#### PUAccordion

| 方法名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| toggleAll | `options?: boolean \| { expanded?: boolean, skipDisabled?: boolean }` | `void` | 切换所有面板展开状态（仅普通模式下可用） |

#### PUAccordionItem

| 方法名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| getExpanded | - | `boolean` | 获取当前展开状态 |
| updateExpand | - | `Promise<void>` | 更新展开状态 |

## Usage

### 基础用法

```vue
<template>
  <PUAccordion v-model="activeNames">
    <PUAccordionItem name="1" title="标题1">
      内容1
    </PUAccordionItem>
    <PUAccordionItem name="2" title="标题2">
      内容2
    </PUAccordionItem>
    <PUAccordionItem name="3" title="标题3">
      内容3
    </PUAccordionItem>
  </PUAccordion>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PUAccordion from "@/components/common/PUAccordion/PUAccordion.vue";
import PUAccordionItem from "@/components/common/PUAccordion/PUAccordionItem.vue";

const activeNames = ref<string[]>(["1"]);
</script>
```

### 手风琴模式

手风琴模式下，同时只能展开一个面板。

```vue
<template>
  <PUAccordion v-model="activeName" accordion>
    <PUAccordionItem name="1" title="标题1">
      内容1
    </PUAccordionItem>
    <PUAccordionItem name="2" title="标题2">
      内容2
    </PUAccordionItem>
    <PUAccordionItem name="3" title="标题3">
      内容3
    </PUAccordionItem>
  </PUAccordion>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PUAccordion from "@/components/common/PUAccordion/PUAccordion.vue";
import PUAccordionItem from "@/components/common/PUAccordion/PUAccordionItem.vue";

const activeName = ref<string>("1");
</script>
```

### 禁用状态

```vue
<template>
  <PUAccordion v-model="activeNames">
    <PUAccordionItem name="1" title="标题1">
      内容1
    </PUAccordionItem>
    <PUAccordionItem name="2" title="标题2（禁用）" disabled>
      内容2
    </PUAccordionItem>
    <PUAccordionItem name="3" title="标题3">
      内容3
    </PUAccordionItem>
  </PUAccordion>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PUAccordion from "@/components/common/PUAccordion/PUAccordion.vue";
import PUAccordionItem from "@/components/common/PUAccordion/PUAccordionItem.vue";

const activeNames = ref<string[]>(["1"]);
</script>
```

### 自定义标题

```vue
<template>
  <PUAccordion v-model="activeNames">
    <PUAccordionItem name="1">
      <template #title="{ expanded }">
        <view class="custom-title">
          <text class="title-text">自定义标题</text>
          <text :class="`icon i-mdi-${expanded ? 'chevron-up' : 'chevron-down'}`"></text>
        </view>
      </template>
      内容1
    </PUAccordionItem>
  </PUAccordion>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PUAccordion from "@/components/common/PUAccordion/PUAccordion.vue";
import PUAccordionItem from "@/components/common/PUAccordion/PUAccordionItem.vue";

const activeNames = ref<string[]>([]);
</script>

<style scoped>
.custom-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
</style>
```

### 展开前的回调

```vue
<template>
  <PUAccordion v-model="activeNames">
    <PUAccordionItem name="1" title="标题1" :before-expand="handleBeforeExpand">
      内容1
    </PUAccordionItem>
  </PUAccordion>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PUAccordion from "@/components/common/PUAccordion/PUAccordion.vue";
import PUAccordionItem from "@/components/common/PUAccordion/PUAccordionItem.vue";
import type { AccordionItemBeforeExpand } from "@/components/common/PUAccordion/PUAccordionItem";

const activeNames = ref<string[]>([]);

const handleBeforeExpand: AccordionItemBeforeExpand = (name) => {
  return new Promise((resolve, reject) => {
    uni.showModal({
      title: "提示",
      content: "确定要展开吗？",
      success: (res) => {
        if (res.confirm) {
          resolve(true);
        } else {
          reject();
        }
      },
    });
  });
};
</script>
```

### 查看更多模式

用于展示长文本内容的展开/收起。

```vue
<template>
  <PUAccordion v-model="expanded" viewmore :line-num="3">
    这是一段很长的文本内容，在收起状态下只显示前3行。
    当用户点击展开按钮时，会显示完整内容。
    这种模式常用于文章摘要、商品描述等场景。
    可以通过 lineNum 属性控制收起时显示的行数。
  </PUAccordion>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PUAccordion from "@/components/common/PUAccordion/PUAccordion.vue";

const expanded = ref<boolean>(false);
</script>
```

### 切换所有面板

```vue
<template>
  <view>
    <view class="actions">
      <button @click="expandAll">全部展开</button>
      <button @click="collapseAll">全部收起</button>
    </view>
    <PUAccordion ref="accordionRef" v-model="activeNames">
      <PUAccordionItem name="1" title="标题1">内容1</PUAccordionItem>
      <PUAccordionItem name="2" title="标题2">内容2</PUAccordionItem>
      <PUAccordionItem name="3" title="标题3">内容3</PUAccordionItem>
    </PUAccordion>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PUAccordion from "@/components/common/PUAccordion/PUAccordion.vue";
import PUAccordionItem from "@/components/common/PUAccordion/PUAccordionItem.vue";
import type { PUAccordionExpose } from "@/components/common/PUAccordion/PUAccordion";

const activeNames = ref<string[]>([]);
const accordionRef = ref<PUAccordionExpose>();

const expandAll = () => {
  accordionRef.value?.toggleAll(true);
};

const collapseAll = () => {
  accordionRef.value?.toggleAll(false);
};
</script>
```

## Best Practices

1. **合理使用模式**：
   - 普通模式：适用于可以同时查看多个内容的场景
   - 手风琴模式：适用于需要聚焦单个内容的场景
   - 查看更多模式：适用于长文本的展开/收起场景

2. **name 属性**：必须为每个 PUAccordionItem 设置唯一的 name 属性

3. **性能优化**：大量面板时，考虑使用虚拟滚动或懒加载

4. **无障碍**：为面板提供清晰的标题，确保键盘导航可用

## Related Components

- PUTabs - 标签页组件，用于切换不同内容区域
- PUDrawer - 抽屉组件，用于显示侧边或底部弹出内容

## Notes

- 手风琴模式下，modelValue 必须是 string 类型
- 普通模式下，modelValue 必须是 string[] 类型
- 查看更多模式下，modelValue 必须是 boolean 类型
- toggleAll 方法仅在普通模式下可用
- 展开/收起动画时长为 0.3s
