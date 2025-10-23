# PUInput 组件

输入框组件,用于用户输入文本、数字等信息。

## 基本用法

```vue
<template>
  <PUInput v-model="value" placeholder="请输入内容" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import PUInput from "@/components/common/PUInput/PUInput.vue";

const value = ref("");
</script>
```

## 带标签

```vue
<PUInput v-model="value" label="用户名" placeholder="请输入用户名" />
```

## 禁用和只读

```vue
<PUInput v-model="value" disabled placeholder="禁用状态" />
<PUInput v-model="value" readonly placeholder="只读状态" />
```

## 可清空

```vue
<PUInput v-model="value" clearable placeholder="可清空" />
```

## 密码输入

```vue
<PUInput v-model="value" show-password placeholder="请输入密码" />
```

## 字数限制

```vue
<PUInput v-model="value" :maxlength="20" show-word-limit placeholder="最多20个字" />
```

## 不同类型

```vue
<PUInput v-model="value" type="text" placeholder="文本" />
<PUInput v-model="value" type="number" placeholder="数字" />
<PUInput v-model="value" type="digit" placeholder="数字键盘" />
<PUInput v-model="value" type="tel" placeholder="电话" />
```

## 图标

```vue
<PUInput v-model="value" prefix-icon="i-mdi-account" placeholder="前置图标" />
<PUInput v-model="value" suffix-icon="i-mdi-check" placeholder="后置图标" />
```

## 插槽

```vue
<PUInput v-model="value">
  <template #prefix>
    <text class="i-mdi-magnify"></text>
  </template>
  <template #suffix>
    <text>元</text>
  </template>
</PUInput>
```

## 必填标记

```vue
<PUInput v-model="value" label="姓名" required />
<PUInput v-model="value" label="年龄" required marker-side="after" />
```

## 尺寸

```vue
<PUInput v-model="value" placeholder="默认尺寸" />
<PUInput v-model="value" size="large" placeholder="大号" />
```

## 对齐方式

```vue
<PUInput v-model="value" label="金额" align-right placeholder="右对齐" />
```

## 错误状态

```vue
<PUInput v-model="value" error error-message="输入内容有误" />
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue / v-model | 输入框的值 | `string \| number` | `""` |
| type | 输入框类型 | `InputType` | `"text"` |
| placeholder | 占位文本 | `string` | `""` |
| label | 标签文本 | `string` | `""` |
| labelWidth | 标签宽度 | `string` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| readonly | 是否只读 | `boolean` | `false` |
| clearable | 是否显示清空按钮 | `boolean` | `false` |
| clearTrigger | 清空按钮显示时机 | `"focus" \| "always"` | `"focus"` |
| showPassword | 是否显示密码切换按钮 | `boolean` | `false` |
| showWordLimit | 是否显示字数统计 | `boolean` | `false` |
| maxlength | 最大输入长度 | `number` | `-1` |
| prefixIcon | 前置图标类名 | `string` | `""` |
| suffixIcon | 后置图标类名 | `string` | `""` |
| required | 是否必填 | `boolean` | `false` |
| markerSide | 必填标记位置 | `"before" \| "after"` | `"before"` |
| size | 输入框尺寸 | `"large" \| ""` | `""` |
| center | 标签是否垂直居中 | `boolean` | `false` |
| alignRight | 输入内容是否右对齐 | `boolean` | `false` |
| noBorder | 是否隐藏底部边框 | `boolean` | `false` |
| error | 是否为错误状态 | `boolean` | `false` |
| errorMessage | 错误提示文本 | `string` | `""` |
| focus | 是否自动获取焦点 | `boolean` | `false` |
| confirmType | 键盘右下角按钮类型 | `InputConfirmType` | `"done"` |
| confirmHold | 点击键盘按钮时是否保持键盘不收起 | `boolean` | `false` |
| cursor | 光标位置 | `number` | `-1` |
| cursorSpacing | 光标与键盘距离 | `number` | `0` |
| selectionStart | 选择文本开始位置 | `number` | `-1` |
| selectionEnd | 选择文本结束位置 | `number` | `-1` |
| adjustPosition | 键盘弹起时是否自动上推页面 | `boolean` | `true` |
| holdKeyboard | focus 时是否保持键盘 | `boolean` | `false` |
| alwaysEmbed | 强制 input 处于同层状态 | `boolean` | `false` |
| placeholderStyle | placeholder 样式 | `string` | `""` |
| placeholderClass | placeholder 类名 | `string` | `""` |
| focusWhenClear | 清空时是否聚焦 | `boolean` | `true` |
| customInputClass | 自定义输入框类名 | `string` | `""` |
| customLabelClass | 自定义标签类名 | `string` | `""` |
| rules | 表单验证规则 | `FormItemRule[]` | `[]` |
| prop | 表单项属性名 | `string` | `""` |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 输入框值变化时触发 | `value: string \| number` |
| input | 输入时触发 | `{ value: string \| number }` |
| focus | 聚焦时触发 | `{ value: string \| number, height: number }` |
| blur | 失焦时触发 | `{ value: string \| number, cursor: number }` |
| clear | 点击清空按钮时触发 | - |
| confirm | 点击键盘完成按钮时触发 | `{ value: string \| number }` |
| keyboardheightchange | 键盘高度变化时触发 | `{ height: number, duration: number }` |
| clickPrefixIcon | 点击前置图标时触发 | - |
| clickSuffixIcon | 点击后置图标时触发 | - |
| click | 点击输入框时触发 | - |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| prefix | 自定义前置内容 |
| suffix | 自定义后置内容 |
| label | 自定义标签内容 |

## 类型定义

```typescript
type InputType =
  | "text"
  | "number"
  | "digit"
  | "idcard"
  | "safe-password"
  | "nickname"
  | "tel";

type InputConfirmType = "send" | "search" | "next" | "go" | "done";

type InputClearTrigger = "focus" | "always";

interface FormItemRule {
  required?: boolean;
  message?: string;
  validator?: (value: any) => boolean | Promise<boolean>;
}
```

## 注意事项

1. 在小程序中,某些平台的 `input` 组件是原生组件,层级较高,可能会遮挡其他元素
2. `maxlength` 设为 `-1` 表示不限制长度
3. `password` 和 `showPassword` 配合使用可实现密码显示切换
4. 清空按钮的显示时机由 `clearTrigger` 控制:
   - `focus`: 聚焦时显示
   - `always`: 始终显示(有值时)
5. 使用 `rules` 进行表单验证时,需要配合表单组件使用
