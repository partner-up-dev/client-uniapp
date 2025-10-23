# PUImgCropper 图片裁剪器

图片裁剪组件，支持手势缩放、旋转、平移操作。

## 基础用法

```vue
<template>
  <view>
    <PUImgCropper
      ref="cropperRef"
      :src="imageSrc"
      :width="300"
      :height="300"
      @ready="handleReady"
      @confirm="handleConfirm"
    />
    
    <button @click="handleCrop">确认裁剪</button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const cropperRef = ref();
const imageSrc = ref('https://example.com/image.jpg');

const handleReady = () => {
  console.log('Image loaded');
};

const handleConfirm = (result) => {
  console.log('Cropped image:', result.tempFilePath);
};

const handleCrop = async () => {
  const result = await cropperRef.value?.getCroppedImage();
  if (result) {
    console.log('Success:', result);
  }
};
</script>
```

## 圆形裁剪

```vue
<PUImgCropper
  :src="imageSrc"
  shape="round"
  :width="200"
  :height="200"
/>
```

## 允许旋转

```vue
<PUImgCropper
  :src="imageSrc"
  enable-rotate
  :rotate="45"
/>
```

## 自定义控制按钮

```vue
<PUImgCropper ref="cropperRef" :src="imageSrc">
  <view class="controls">
    <button @click="cropperRef?.reset()">重置</button>
    <button @click="handleCrop">裁剪</button>
  </view>
</PUImgCropper>
```

## 隐藏网格线

```vue
<PUImgCropper
  :src="imageSrc"
  :show-grid="false"
/>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| src | 图片源地址 | `string` | `''` |
| width | 裁剪区域宽度（px） | `number` | `300` |
| height | 裁剪区域高度（px） | `number` | `300` |
| shape | 裁剪框形状 | `'square' \| 'round'` | `'square'` |
| scale | 图片初始缩放比例 | `number` | `1` |
| minScale | 最小缩放比例 | `number` | `0.3` |
| maxScale | 最大缩放比例 | `number` | `5` |
| enableRotate | 是否允许双指旋转 | `boolean` | `false` |
| rotate | 图片初始旋转角度（度） | `number` | `0` |
| outputWidth | 输出图片宽度（px） | `number` | 同 `width` |
| outputHeight | 输出图片高度（px） | `number` | 同 `height` |
| quality | 输出图片质量（0~1） | `number` | `0.92` |
| format | 输出图片格式 | `'jpg' \| 'png'` | `'jpg'` |
| showGrid | 是否显示网格线 | `boolean` | `true` |
| disabled | 是否禁用手势操作 | `boolean` | `false` |
| canvasId | Canvas ID（需保证唯一） | `string` | `'pu-img-cropper-canvas'` |
| customStyle | 自定义根节点样式 | `string` | `''` |
| customClass | 自定义根节点样式类 | `string` | `''` |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| ready | 图片加载完成 | `()` |
| change | 变换状态变化 | `(detail: PUImgCropperChangeDetail)` |
| confirm | 裁剪确认 | `(result: PUImgCropperConfirmResult)` |
| error | 裁剪错误 | `(error: any)` |
| update:scale | 缩放比例变化 | `(scale: number)` |
| update:rotate | 旋转角度变化 | `(rotate: number)` |

## Methods

| 方法名 | 说明 | 参数 | 返回值 |
| --- | --- | --- | --- |
| getCroppedImage | 获取裁剪后的图片 | `()` | `Promise<PUImgCropperConfirmResult \| null>` |
| reset | 重置变换状态 | `()` | `void` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 自定义控制按钮区域 |

## 类型定义

```typescript
/**
 * 裁剪框形状类型
 */
type PUImgCropperShape = "square" | "round";

/**
 * 输出图片格式
 */
type PUImgCropperFormat = "jpg" | "png";

/**
 * 变换状态变化详情
 */
interface PUImgCropperChangeDetail {
  scale: number;
  rotate: number;
  translateX: number;
  translateY: number;
}

/**
 * 裁剪确认结果
 */
interface PUImgCropperConfirmResult {
  tempFilePath: string;
  width: number;
  height: number;
}
```

## 手势操作

- **单指拖动**：平移图片
- **双指捏合**：缩放图片
- **双指旋转**：旋转图片（需设置 `enableRotate`）

## 注意事项

1. **Canvas ID 唯一性**：如果页面中有多个裁剪器实例，需要为每个实例设置不同的 `canvasId`。
2. **图片格式**：`quality` 参数仅对 `jpg` 格式有效，`png` 格式不支持质量设置。
3. **小程序限制**：组件使用了小程序的 Canvas API，仅支持小程序平台。
4. **输出尺寸**：如果不设置 `outputWidth` 和 `outputHeight`，将使用 `width` 和 `height` 作为输出尺寸。

## 样式自定义

组件支持通过 `customClass` 和 `customStyle` 自定义样式。

```vue
<PUImgCropper
  :src="imageSrc"
  custom-class="my-cropper"
  custom-style="border-radius: 16px;"
/>
```

## 完整示例

```vue
<template>
  <view class="page">
    <PUImgCropper
      ref="cropperRef"
      v-model:scale="scale"
      v-model:rotate="rotate"
      :src="imageSrc"
      :width="350"
      :height="350"
      shape="round"
      enable-rotate
      @ready="handleReady"
      @change="handleChange"
      @confirm="handleConfirm"
      @error="handleError"
    >
      <view class="controls">
        <button @click="handleReset">重置</button>
        <button @click="handleRotateLeft">左旋</button>
        <button @click="handleRotateRight">右旋</button>
        <button @click="handleCrop" type="primary">裁剪</button>
      </view>
    </PUImgCropper>
    
    <view v-if="croppedImage" class="preview">
      <image :src="croppedImage" mode="aspectFit" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { PUImgCropperChangeDetail, PUImgCropperConfirmResult } from '@/components/common/PUImgCropper/PUImgCropper';

const cropperRef = ref();
const imageSrc = ref('https://example.com/avatar.jpg');
const scale = ref(1);
const rotate = ref(0);
const croppedImage = ref('');

const handleReady = () => {
  console.log('Image ready to crop');
};

const handleChange = (detail: PUImgCropperChangeDetail) => {
  console.log('Transform changed:', detail);
};

const handleConfirm = (result: PUImgCropperConfirmResult) => {
  croppedImage.value = result.tempFilePath;
  console.log('Crop confirmed:', result);
};

const handleError = (error: any) => {
  console.error('Crop error:', error);
  uni.showToast({
    title: '裁剪失败',
    icon: 'none',
  });
};

const handleReset = () => {
  cropperRef.value?.reset();
};

const handleRotateLeft = () => {
  rotate.value -= 90;
};

const handleRotateRight = () => {
  rotate.value += 90;
};

const handleCrop = async () => {
  const result = await cropperRef.value?.getCroppedImage();
  if (result) {
    console.log('Cropped successfully:', result);
  }
};
</script>

<style lang="scss" scoped>
.page {
  padding: 20px;
}

.controls {
  display: flex;
  gap: 12px;
  padding: 16px;
  justify-content: center;
}

.preview {
  margin-top: 20px;
  
  image {
    width: 100%;
    height: 300px;
  }
}
</style>
```
