# RouteItemLocationEditor

路线节点地点编辑器组件。

## 功能

- 编辑地点名称（friendly_address）
- 选择详细地址（通过腾讯地图插件）
- 验证地点数据完整性
- 保存地点到服务器并返回地点引用ID

## 使用示例

### 基础用法

```vue
<template>
  <RouteItemLocationEditor
    v-model="locationRef"
    @confirm="onLocationConfirmed"
    @cancel="onCancel"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import RouteItemLocationEditor from "@/components/base/routeItemLocationEditor/routeItemLocationEditor.vue";
import type { Location, LocationRef } from "@/business/base/route";

const locationRef = ref<LocationRef>("");

function onLocationConfirmed(location: Location) {
  console.log("Location confirmed:", location);
  // location._id 即为保存后的 LocationRef
}

function onCancel() {
  console.log("Cancelled");
}
</script>
```

### 使用 ref 调用组件方法

```vue
<template>
  <RouteItemLocationEditor
    ref="editorRef"
    v-model="locationRef"
  />
  <button @click="saveLocation">手动保存</button>
</template>

<script setup lang="ts">
import { ref } from "vue";
import RouteItemLocationEditor from "@/components/base/routeItemLocationEditor/routeItemLocationEditor.vue";
import type { Location, LocationRef } from "@/business/base/route";

const locationRef = ref<LocationRef>("");
const editorRef = ref<InstanceType<typeof RouteItemLocationEditor>>();

function saveLocation() {
  editorRef.value?.save();
}

function getCurrentLocation() {
  const location = editorRef.value?.getLocation();
  console.log("Current location:", location);
}
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `LocationRef` (string) | `""` | v-model绑定的地点引用ID |
| autoSave | `boolean` | `true` | 是否在确认时自动保存（暂未实现） |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | `(locationRef: LocationRef)` | v-model更新事件，在地点成功保存后触发 |
| change | `(location: Location)` | 地点数据变更时触发（选择地址后） |
| confirm | `(location: Location)` | 确认保存地点时触发 |
| cancel | `()` | 取消操作时触发 |

## Expose Methods

| 方法名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| getLocation | - | `Location` | 获取当前编辑的地点对象 |
| save | - | `void` | 保存地点（同点击确认按钮） |

## 数据模型

### Location

```typescript
{
  address: string[];           // 地址数组（省、市、区、详细地址）
  friendly_address: string;    // 地点名称
  lat: number;                 // 纬度
  lng: number;                 // 经度
  _id?: string;               // 地点引用ID（保存后生成）
}
```

## 注意事项

1. **v-model 绑定**: 组件绑定的是 `LocationRef`（字符串ID），而不是完整的 `Location` 对象。这样做可以：
   - 防止在确认之前外部值发生变更
   - 便于撤销更改
   - 完整的 `Location` 对象可以通过 `change`、`confirm` 事件或 `getLocation()` 方法获取

2. **地点选择**: 使用腾讯地图插件选择地点，确保在 `pages.json` 中正确配置插件

3. **验证规则**:
   - 地点名称（friendly_address）: 必填，最大长度50个字符
   - 详细地址（address）: 必填
   - 经纬度: 必须有效（不能为0或undefined）

4. **保存流程**:
   - 验证数据完整性
   - 如果地点没有 `_id`，调用 API 保存到服务器
   - 服务器返回 `_id` 后，更新 v-model 绑定值
   - 触发 `confirm` 事件

## 依赖

- `@/components/base/locationPicker/usePickLocation` - 地点选择功能
- `@/components/common/cell` - 单元格组件
- `@/components/common/PUInput` - 输入框组件
- `@/components/common/PUButton` - 按钮组件
- `@/business/base/route` - Location 数据模型

## 国际化

组件文本使用 `base.route_item_location_editor` 命名空间，包含以下键：

- `field.friendly_address.title` - 地点名称标题
- `field.friendly_address.subtitle` - 地点名称副标题
- `field.friendly_address.placeholder` - 地点名称占位符
- `field.address.title` - 详细地址标题
- `field.address.placeholder` - 详细地址占位符
- `button.choose_location` - 选择地点按钮
- `button.cancel` - 取消按钮
- `button.confirm` - 确认按钮
- `toast.save_success` - 保存成功提示
- `toast.save_failed` - 保存失败提示
