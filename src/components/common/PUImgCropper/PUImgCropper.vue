<script lang="ts">
export default {
  name: "PUImgCropper",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  nextTick,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { BasicComponentOptions } from "@/utils/vue";
import {
  puImgCropperProps,
  puImgCropperEmits,
  clamp,
  getDistance,
  getAngle,
  DEFAULT_CROPPER_SIZE,
  type PUImgCropperConfirmResult,
} from "./PUImgCropper";

const props = defineProps(puImgCropperProps);
const emit = defineEmits(puImgCropperEmits);

// ==================== 状态定义 ====================

// 容器尺寸
const container = reactive({
  width: 0,
  height: 0,
});

// 图片变换状态
const transformState = reactive({
  scale: props.scale,
  rotate: props.rotate,
  translateX: 0,
  translateY: 0,
});

// 图片原始信息
const imageInfo = reactive({
  naturalWidth: 0,
  naturalHeight: 0,
});

// 图片加载状态
const imageLoaded = ref(false);

// 手势状态
let lastTouches: any[] = [];
let gestureStart = {
  translateX: 0,
  translateY: 0,
  scale: 1,
  rotate: 0,
};

// ==================== 计算属性 ====================

const rootStyle = computed(() => {
  const w = props.width || DEFAULT_CROPPER_SIZE;
  const h = props.height || DEFAULT_CROPPER_SIZE;
  return {
    width: `${w}px`,
    height: `${h}px`,
  };
});

const cropperMaskStyle = computed(() => {
  const w = props.width || DEFAULT_CROPPER_SIZE;
  const h = props.height || DEFAULT_CROPPER_SIZE;
  return {
    width: `${w}px`,
    height: `${h}px`,
  };
});

const imageStyle = computed(() => {
  const { scale, rotate, translateX, translateY } = transformState;
  const transform = `translate(${translateX}px, ${translateY}px) translate(-50%, -50%) scale(${scale}) rotate(${rotate}deg)`;
  return {
    transform,
  };
});

// ==================== 方法 ====================

/**
 * 发射变化事件
 */
function emitChange() {
  emit("change", {
    scale: transformState.scale,
    rotate: transformState.rotate,
    translateX: transformState.translateX,
    translateY: transformState.translateY,
  });
  emit("update:scale", transformState.scale);
  emit("update:rotate", transformState.rotate);
}

/**
 * 图片加载完成处理
 */
function handleImageLoad(e: any) {
  const { width, height } = e.detail;
  imageInfo.naturalWidth = width;
  imageInfo.naturalHeight = height;
  imageLoaded.value = true;
  emit("ready");
}

/**
 * 触摸开始处理
 */
function handleTouchStart(e: any) {
  if (props.disabled) return;

  const touches = e.touches || e.changedTouches || [];
  lastTouches = Array.from(touches).slice(0, 2);

  gestureStart = {
    translateX: transformState.translateX,
    translateY: transformState.translateY,
    scale: transformState.scale,
    rotate: transformState.rotate,
  };
}

/**
 * 触摸移动处理
 */
function handleTouchMove(e: any) {
  if (props.disabled) return;

  const touches = e.touches || e.changedTouches || [];

  // 单指拖动
  if (touches.length === 1 && lastTouches.length >= 1) {
    const dx = touches[0].x - lastTouches[0].x;
    const dy = touches[0].y - lastTouches[0].y;
    transformState.translateX = gestureStart.translateX + dx;
    transformState.translateY = gestureStart.translateY + dy;
  }
  // 双指缩放和旋转
  else if (touches.length >= 2 && lastTouches.length >= 2) {
    // 缩放
    const currentDistance = getDistance(touches[0], touches[1]);
    const startDistance = getDistance(lastTouches[0], lastTouches[1]);
    const scaleDelta = currentDistance / startDistance;
    transformState.scale = clamp(
      gestureStart.scale * scaleDelta,
      props.minScale,
      props.maxScale
    );

    // 旋转
    if (props.enableRotate) {
      const currentAngle = getAngle(touches[0], touches[1]);
      const startAngle = getAngle(lastTouches[0], lastTouches[1]);
      const angleDelta = currentAngle - startAngle;
      transformState.rotate = gestureStart.rotate + angleDelta;
    }
  }

  emitChange();
}

/**
 * 触摸结束处理
 */
function handleTouchEnd() {
  lastTouches = [];
}

/**
 * 获取裁剪后的图片
 */
async function getCroppedImage(): Promise<PUImgCropperConfirmResult | null> {
  if (!imageLoaded.value) {
    console.warn("[PUImgCropper] Image not loaded yet");
    return null;
  }

  const outputWidth = props.outputWidth || props.width || DEFAULT_CROPPER_SIZE;
  const outputHeight = props.outputHeight || props.height || DEFAULT_CROPPER_SIZE;

  try {
    const instance = getCurrentInstance();
    // @ts-ignore
    const ctx = uni.createCanvasContext(props.canvasId, instance?.proxy);

    // 设置背景色（避免透明背景导致 jpg 显示问题）
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, outputWidth, outputHeight);

    ctx.save();

    // 移动到中心点
    ctx.translate(outputWidth / 2, outputHeight / 2);

    // 应用旋转
    ctx.rotate((transformState.rotate * Math.PI) / 180);

    // 应用缩放
    ctx.scale(transformState.scale, transformState.scale);

    // 应用平移
    ctx.translate(transformState.translateX, transformState.translateY);

    // 绘制图片（中心点为原点）
    // @ts-ignore
    ctx.drawImage(
      props.src,
      -outputWidth / 2,
      -outputHeight / 2,
      outputWidth,
      outputHeight
    );

    ctx.restore();
    ctx.draw(false);

    // 导出为临时文件
    const result: any = await new Promise((resolve, reject) => {
      // @ts-ignore
      uni.canvasToTempFilePath(
        {
          canvasId: props.canvasId,
          width: outputWidth,
          height: outputHeight,
          destWidth: outputWidth,
          destHeight: outputHeight,
          fileType: props.format === "png" ? "png" : "jpg",
          quality: props.format === "jpg" ? props.quality : undefined,
          success: resolve,
          fail: reject,
        },
        instance?.proxy
      );
    });

    const cropResult: PUImgCropperConfirmResult = {
      tempFilePath: result.tempFilePath,
      width: outputWidth,
      height: outputHeight,
    };

    emit("confirm", cropResult);
    return cropResult;
  } catch (error) {
    console.error("[PUImgCropper] Crop failed:", error);
    emit("error", error);
    return null;
  }
}

/**
 * 重置变换状态
 */
function reset() {
  transformState.scale = props.scale;
  transformState.rotate = props.rotate;
  transformState.translateX = 0;
  transformState.translateY = 0;
  emitChange();
}

// ==================== 生命周期 ====================

onMounted(async () => {
  await nextTick();

  // 获取容器尺寸
  const instance = getCurrentInstance();
  const query = uni.createSelectorQuery().in(instance?.proxy as any);
  query
    .select(".pu-img-cropper")
    .boundingClientRect((rect: any) => {
      if (rect) {
        container.width = rect.width || props.width || DEFAULT_CROPPER_SIZE;
        container.height = rect.height || props.height || DEFAULT_CROPPER_SIZE;
      }
    })
    .exec();
});

// ==================== 监听 ====================

watch(
  () => props.scale,
  (newScale) => {
    transformState.scale = newScale;
  }
);

watch(
  () => props.rotate,
  (newRotate) => {
    transformState.rotate = newRotate;
  }
);

// ==================== 暴露方法 ====================

defineExpose({
  getCroppedImage,
  reset,
});
</script>

<template>
  <view
    class="pu-img-cropper"
    :class="[
      props.customClass,
      {
        'pu-img-cropper--round': props.shape === 'round',
        'pu-img-cropper--disabled': props.disabled,
      },
    ]"
    :style="[rootStyle, props.customStyle]"
  >
    <!-- 操作区域 -->
    <view
      class="pu-img-cropper__stage"
      @touchstart.stop.prevent="handleTouchStart"
      @touchmove.stop.prevent="handleTouchMove"
      @touchend.stop.prevent="handleTouchEnd"
      @touchcancel.stop.prevent="handleTouchEnd"
    >
      <!-- 图片 -->
      <image
        class="pu-img-cropper__image"
        :src="props.src"
        mode="aspectFill"
        :style="imageStyle"
        @load="handleImageLoad"
      />

      <!-- 隐藏的 Canvas（用于导出） -->
      <canvas :canvas-id="props.canvasId" class="pu-img-cropper__canvas" />

      <!-- 遮罩层 -->
      <view
        v-if="props.shape === 'round'"
        class="pu-img-cropper__mask pu-img-cropper__mask--round"
        :style="cropperMaskStyle"
      />
      <view
        v-else
        class="pu-img-cropper__mask pu-img-cropper__mask--square"
        :style="cropperMaskStyle"
      />

      <!-- 网格线 -->
      <view
        v-if="props.showGrid"
        class="pu-img-cropper__grid"
        :style="cropperMaskStyle"
      >
        <view class="pu-img-cropper__grid-line pu-img-cropper__grid-line--v1" />
        <view class="pu-img-cropper__grid-line pu-img-cropper__grid-line--v2" />
        <view class="pu-img-cropper__grid-line pu-img-cropper__grid-line--h1" />
        <view class="pu-img-cropper__grid-line pu-img-cropper__grid-line--h2" />
      </view>
    </view>

    <!-- 自定义控制按钮插槽 -->
    <slot />
  </view>
</template>

<style lang="scss" scoped src="./PUImgCropper.scss"></style>
