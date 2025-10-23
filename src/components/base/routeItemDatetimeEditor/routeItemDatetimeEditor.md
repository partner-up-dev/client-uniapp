# RouteItemDatetimeEditor 路线节点时间编辑器

路线节点时间编辑器组件，用于编辑路线节点的时间信息，包括日期时间和时间误差。

## 功能特性

- 日期时间选择
- 时间误差配置（可提前/可推迟）
- 表单验证
- 取消/确认操作

## 使用示例

```vue
<script setup lang="ts">
import { ref } from "vue";
import RouteItemDatetimeEditor from "@/components/base/routeItemDatetimeEditor/routeItemDatetimeEditor.vue";
import { RouteItemDatetime } from "@/business/base/route";

const datetime = ref(RouteItemDatetime.parse({
  datetime: new Date(),
  time: null,
  bring_ahead: 0,
  put_off: 0,
}));

const onConfirm = (data: RouteItemDatetime) => {
  console.log("确认时间:", data);
};

const onCancel = () => {
  console.log("取消编辑");
};
</script>

<template>
  <RouteItemDatetimeEditor
    :model-value="datetime"
    :min-datetime="Date.now()"
    @confirm="onConfirm"
    @cancel="onCancel"
  />
</template>
```

## Props

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| modelValue | RouteItemDatetime | 是 | - | 路线节点时间数据 |
| minDatetime | number | 否 | Date.now() | 最小可选时间（时间戳，单位：毫秒） |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| change | (datetime: RouteItemDatetime) | 值变化时触发 |
| confirm | (datetime: RouteItemDatetime) | 点击确认按钮时触发 |
| cancel | () | 点击取消按钮时触发 |

## Expose

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| save | - | - | 保存并验证表单 |

## 注意事项

- 组件内部维护独立状态，点击取消可撤销更改
- 仅在点击确认按钮且验证通过后才会触发 confirm 事件
- 时间必须晚于 minDatetime 设定的最小时间
