# PUPicker 选择器组件

选择器组件，基于 uni-app 原生 picker 组件封装，支持单列和多列选择，可用于日期、城市、年龄等场景的选择。

## 功能特性

- 基于 uni-app 原生 picker 组件
- 支持单列和多列选择
- 支持自定义展示格式
- 支持级联选择（通过 columnChange 回调）
- 支持清空功能
- 支持禁用和只读状态
- 支持自定义触发器
- 支持确认前校验

## 基础用法

### 单列选择

```vue
<template>
  <PUPicker
    v-model="value"
    label="选择城市"
    :columns="cities"
    placeholder="请选择城市"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import PUPicker from "@/components/common/PUPicker/PUPicker.vue";

const value = ref("");
const cities = ["北京", "上海", "广州", "深圳", "杭州"];
</script>
```

### 多列选择

```vue
<template>
  <PUPicker
    v-model="value"
    label="选择时间"
    :columns="timeColumns"
    placeholder="请选择时间"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import PUPicker from "@/components/common/PUPicker/PUPicker.vue";

const value = ref([]);
const timeColumns = [
  Array.from({ length: 24 }, (_, i) => `${i}时`),
  Array.from({ length: 60 }, (_, i) => `${i}分`),
];
</script>
```

### 对象数组

```vue
<template>
  <PUPicker
    v-model="value"
    label="选择用户"
    :columns="users"
    value-key="id"
    label-key="name"
    placeholder="请选择用户"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import PUPicker from "@/components/common/PUPicker/PUPicker.vue";
import type { PickerColumnItem } from "@/components/common/PUPicker/PUPicker";

const value = ref("");
const users: PickerColumnItem[] = [
  { id: "1", name: "张三" },
  { id: "2", name: "李四" },
  { id: "3", name: "王五" },
];
</script>
```

## 高级用法

### 自定义展示格式

```vue
<template>
  <PUPicker
    v-model="value"
    label="选择日期"
    :columns="dateColumns"
    :display-format="formatDate"
    placeholder="请选择日期"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import PUPicker from "@/components/common/PUPicker/PUPicker.vue";
import type { PickerColumnItem, PickerDisplayFormat } from "@/components/common/PUPicker/PUPicker";

const value = ref([]);
const dateColumns = [
  Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `${i + 1}月` })),
  Array.from({ length: 31 }, (_, i) => ({ value: i + 1, label: `${i + 1}日` })),
];

const formatDate: PickerDisplayFormat = (items) => {
  if (Array.isArray(items) && items.length === 2) {
    return `${items[0].label}${items[1].label}`;
  }
  return "";
};
</script>
```

### 级联选择

```vue
<template>
  <PUPicker
    v-model="value"
    label="选择地区"
    :columns="areaColumns"
    :column-change="handleColumnChange"
    placeholder="请选择地区"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import PUPicker from "@/components/common/PUPicker/PUPicker.vue";
import type { PickerColumnChange, PickerColumns } from "@/components/common/PUPicker/PUPicker";

const value = ref([]);
const areaColumns = ref<PickerColumns>([
  [
    { value: "110000", label: "北京市" },
    { value: "120000", label: "天津市" },
  ],
  [], // 第二列初始为空
]);

const cityMap = {
  "110000": [
    { value: "110100", label: "市辖区" },
  ],
  "120000": [
    { value: "120100", label: "市辖区" },
  ],
};

const handleColumnChange: PickerColumnChange = ({ selectedItems, columnIndex, resolve }) => {
  // 当选择第一列（省份）时，更新第二列（城市）
  if (columnIndex === 0) {
    const provinceCode = selectedItems[0].value as string;
    const cities = cityMap[provinceCode] || [];
    resolve([areaColumns.value[0], cities]);
  }
};
</script>
```

```vue
<template>
  <PUPicker
    v-model="value"
    label="选择数量"
    :columns="quantities"
    :before-confirm="handleBeforeConfirm"
    placeholder="请选择数量"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import PUPicker from "@/components/common/PUPicker/PUPicker.vue";
import type { PickerBeforeConfirm } from "@/components/common/PUPicker/PUPicker";

const value = ref("");
const quantities = Array.from({ length: 10 }, (_, i) => i + 1);

### 确认前校验

```vue
<template>
  <PUPicker
    v-model="value"
    label="选择数量"
    :columns="quantities"
    :before-confirm="handleBeforeConfirm"
    placeholder="请选择数量"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import PUPicker from "@/components/common/PUPicker/PUPicker.vue";
import type { PickerBeforeConfirm } from "@/components/common/PUPicker/PUPicker";

const value = ref("");
const quantities = Array.from({ length: 10 }, (_, i) => i + 1);

const handleBeforeConfirm: PickerBeforeConfirm = (value, resolve) => {
  if (Number(value) > 5) {
    uni.showToast({
      title: "数量不能超过5",
      icon: "none",
    });
    resolve(false);
  } else {
    resolve(true);
  }
};
</script>
```

### 自定义触发器

```vue
<template>
  <PUPicker v-model="value" :columns="items">
    <view class="custom-trigger">
      <text>{{ value || "请选择" }}</text>
      <text class="i-mdi-menu-down"></text>
    </view>
  </PUPicker>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PUPicker from "@/components/common/PUPicker/PUPicker.vue";

const value = ref("");
const items = ["选项1", "选项2", "选项3"];
</script>

<style scoped>
.custom-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
}
</style>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 选中值，单列为 `string \| number`，多列为数组 | `PickerValue` | `""` |
| columns | 选择器数据 | `PickerColumns` | `[]` |
| valueKey | 选项值对应的键名 | `string` | `"value"` |
| labelKey | 选项标签对应的键名 | `string` | `"label"` |
| label | 选择器左侧文案 | `string` | `""` |
| placeholder | 选择器占位符 | `string` | `""` |
| disabled | 是否禁用 | `boolean` | `false` |
| readonly | 是否只读 | `boolean` | `false` |
| clearable | 是否显示清空按钮 | `boolean` | `false` |
| required | 是否必填 | `boolean` | `false` |
| error | 是否显示错误状态 | `boolean` | `false` |
| size | 尺寸 | `"small" \| "medium" \| "large"` | `"medium"` |
| labelWidth | 左侧标题宽度 | `string` | `"33%"` |
| alignRight | 是否右对齐 | `boolean` | `false` |
| beforeConfirm | 确定前校验函数 | `PickerBeforeConfirm` | - |
| displayFormat | 自定义展示文案的格式化函数 | `PickerDisplayFormat` | - |
| columnChange | 列变更回调（仅多列选择器） | `PickerColumnChange` | - |
| customClass | 自定义根节点样式类 | `string` | `""` |
| customStyle | 自定义根节点样式 | `string` | `""` |
| customLabelClass | 自定义 label 样式类 | `string` | `""` |
| customValueClass | 自定义 value 样式类 | `string` | `""` |
| markerSide | 必填标记位置 | `"before" \| "after"` | `"before"` |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 选中值变化时触发 | `value: PickerValue` |
| confirm | 点击确认按钮时触发 | `event: PickerConfirmEvent` |
| cancel | 点击取消按钮时触发 | - |
| clear | 点击清空按钮时触发 | - |
| change | 选中项变化时触发 | `event: { value: PickerValue }` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 自定义触发器内容 |

## 类型定义

```typescript
// 选择器列项
interface PickerColumnItem {
  value: string | number;
  label: string;
  disabled?: boolean;
  children?: PickerColumnItem[];
  [key: string]: any;
}

// 选择器列类型
type PickerColumn = (string | number | PickerColumnItem)[];

// 选择器列数组
type PickerColumns = PickerColumn | PickerColumn[];

// 选择器值类型
type PickerValue = string | number | (string | number)[];

// 展示格式化函数
type PickerDisplayFormat = (
  items: PickerColumnItem | PickerColumnItem[],
  config: { valueKey: string; labelKey: string }
) => string;

// 确认前回调函数
type PickerBeforeConfirm = (
  value: PickerValue,
  resolve: (isPass: boolean) => void
) => void;

// 列变更回调函数
type PickerColumnChange = (options: {
  selectedIndex: number[];
  selectedItems: PickerColumnItem[];
  columnIndex: number;
  resolve: (columns: PickerColumns) => void;
}) => void;

// 确认事件参数
interface PickerConfirmEvent {
  value: PickerValue;
  selectedItems: PickerColumnItem | PickerColumnItem[];
}
```

## 注意事项

1. **原生组件**：本组件基于 uni-app 原生 `picker` 组件，弹出层样式和行为由系统控制
2. **数据格式**：`columns` 支持字符串/数字数组或对象数组，如果为二维数组则为多列选择器
3. **值绑定**：单列选择器的 `modelValue` 为 `string | number`，多列为数组
4. **级联选择**：使用 `columnChange` 回调实现级联选择，需在回调中调用 `resolve` 更新列数据
5. **自定义展示**：使用 `displayFormat` 自定义选中值的展示格式
6. **确认校验**：使用 `beforeConfirm` 在确认前进行校验，调用 `resolve(false)` 可阻止确认
