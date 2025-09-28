<script lang="ts">
export default {
  name: "ImgCropper",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { clamp, imgCropperEmits, imgCropperProps } from "./imgCropper";

const props = defineProps(imgCropperProps);
const emit = defineEmits(imgCropperEmits);

// container size
const rootRef = ref();
const stageRef = ref();
const container = reactive({ width: 0, height: 0 });

// image transform state
const state = reactive({
  scale: props.scale,
  rotate: props.rotate,
  tx: 0,
  ty: 0,
});

const imageInfo = reactive({
  naturalWidth: 0,
  naturalHeight: 0,
});

const imageLoaded = ref(false);

function emitChange() {
  emit("change", {
    scale: state.scale,
    rotate: state.rotate,
    translateX: state.tx,
    translateY: state.ty,
  });
}

const rootStyle = computed(() => {
  const w = props.width || 300;
  const h = props.height || 300;
  return {
    width: `${w}px`,
    height: `${h}px`,
    ...((props.customStyle as any) || {}),
  } as any;
});

const cropperMaskStyle = computed(() => {
  const w = props.width || 300;
  const h = props.height || 300;
  const size = { width: `${w}px`, height: `${h}px` };
  return size as any;
});

const imageStyle = computed(() => {
  const transform = `translate(${state.tx}px, ${state.ty}px) translate(-50%, -50%) scale(${state.scale}) rotate(${state.rotate}deg)`;
  return {
    transform,
  } as any;
});

function onImageLoad(e: any) {
  const { width, height } = e.detail;
  imageInfo.naturalWidth = width;
  imageInfo.naturalHeight = height;
  imageLoaded.value = true;
  emit("ready");
}

// gestures
let lastTouches: any[] = [];
let start = { tx: 0, ty: 0, scale: 1, rotate: 0 } as any;

function getDistance(a: any, b: any) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}
function getAngle(a: any, b: any) {
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
}

function onTouchStart(e: any) {
  if (props.disabled) return;
  const touches = e.touches || e.changedTouches || [];
  lastTouches = touches.slice(0, 2);
  start.tx = state.tx;
  start.ty = state.ty;
  start.scale = state.scale;
  start.rotate = state.rotate;
}

function onTouchMove(e: any) {
  if (props.disabled) return;
  const touches = e.touches || e.changedTouches || [];
  if (touches.length === 1 && lastTouches.length >= 1) {
    const dx = touches[0].x - lastTouches[0].x;
    const dy = touches[0].y - lastTouches[0].y;
    state.tx = start.tx + dx;
    state.ty = start.ty + dy;
  } else if (touches.length >= 2 && lastTouches.length >= 2) {
    const d0 = getDistance(lastTouches[0], lastTouches[1]);
    const d1 = getDistance(touches[0], touches[1]);
    const scaleDelta = d1 / d0;
    state.scale = clamp(start.scale * scaleDelta, props.minScale, props.maxScale);

    if (props.enableRotate) {
      const a0 = getAngle(lastTouches[0], lastTouches[1]);
      const a1 = getAngle(touches[0], touches[1]);
      const da = a1 - a0;
      state.rotate = start.rotate + da;
    }
  }
  emitChange();
}

function onTouchEnd() {
  lastTouches = [];
}

// methods
async function getCroppedImage(): Promise<{
  tempFilePath: string;
  width: number;
  height: number;
} | null> {
  if (!imageLoaded.value) return null;
  const w = props.outputWidth || props.width || 300;
  const h = props.outputHeight || props.height || 300;

  try {
    // WeChat canvas usage
    // @ts-ignore
    const ctx = uni.createCanvasContext(props.canvasId, getCurrentInstance()?.proxy);
    // fill black mask background to avoid transparency for jpg
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    // move to center
    ctx.translate(w / 2, h / 2);
    // apply rotation
    ctx.rotate((state.rotate * Math.PI) / 180);
    // apply scale
    ctx.scale(state.scale, state.scale);
    // apply translation
    ctx.translate(state.tx, state.ty);

    // draw image with center origin offset
    // @ts-ignore
    ctx.drawImage(props.src, -w / 2, -h / 2, w, h);
    ctx.restore();
    ctx.draw(false);

    const res: any = await new Promise((resolve, reject) => {
      // @ts-ignore
      uni.canvasToTempFilePath(
        {
          canvasId: props.canvasId,
          width: w,
          height: h,
          destWidth: w,
          destHeight: h,
          fileType: props.format === "png" ? "png" : "jpg",
          quality: props.format === "jpg" ? props.quality : undefined,
          success: resolve,
          fail: reject,
        },
        // @ts-ignore
        getCurrentInstance()?.proxy
      );
    });

    const result = {
      tempFilePath: res.tempFilePath,
      width: w,
      height: h,
    };
    emit("confirm", result);
    return result;
  } catch (err) {
    emit("error", err);
    return null;
  }
}

function reset() {
  state.scale = props.scale;
  state.rotate = props.rotate;
  state.tx = 0;
  state.ty = 0;
  emitChange();
}

defineExpose({ getCroppedImage, reset });

onMounted(async () => {
  await nextTick();
  // read container size if needed
  const query = uni.createSelectorQuery().in(getCurrentInstance()?.proxy as any);
  query
    .select(".img-cropper")
    .boundingClientRect((rect: any) => {
      container.width = rect?.width || props.width || 300;
      container.height = rect?.height || props.height || 300;
    })
    .exec();
});
</script>

<template>
  <view
    class="img-cropper"
    :class="[props.customClass, props.shape === 'round' ? 'is-round' : '']"
    :style="rootStyle"
  >
    <view
      ref="stageRef"
      class="img-cropper__stage"
      @touchstart.stop.prevent="onTouchStart"
      @touchmove.stop.prevent="onTouchMove"
      @touchend.stop.prevent="onTouchEnd"
    >
      <image
        class="img-cropper__image"
        :src="props.src"
        mode="aspectFill"
        :style="imageStyle"
        @load="onImageLoad"
      />

      <canvas
        :canvas-id="props.canvasId"
        style="position: absolute; left: -9999px; top: -9999px; width: 0; height: 0"
      />

      <view
        v-if="props.shape === 'round'"
        class="img-cropper__round-mask"
        :style="cropperMaskStyle"
      />
      <view v-else class="img-cropper__square-mask" :style="cropperMaskStyle" />

      <view v-if="props.showGrid" class="img-cropper__grid">
        <view
          style="
            position: absolute;
            left: 33.3333%;
            top: 0;
            bottom: 0;
            width: 1px;
            background: rgba(255, 255, 255, 0.35);
          "
        />
        <view
          style="
            position: absolute;
            left: 66.6666%;
            top: 0;
            bottom: 0;
            width: 1px;
            background: rgba(255, 255, 255, 0.35);
          "
        />
        <view
          style="
            position: absolute;
            top: 33.3333%;
            left: 0;
            right: 0;
            height: 1px;
            background: rgba(255, 255, 255, 0.35);
          "
        />
        <view
          style="
            position: absolute;
            top: 66.6666%;
            left: 0;
            right: 0;
            height: 1px;
            background: rgba(255, 255, 255, 0.35);
          "
        />
      </view>
    </view>

    <slot />
  </view>
</template>

<style lang="scss" scoped src="./imgCropper.scss"></style>
