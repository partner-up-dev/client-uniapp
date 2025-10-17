<script lang="ts">
export default {
  name: "PUImg",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { BasicComponentOptions } from "@/utils/vue";
import { puImgProps, puImgEmits } from "./PUImg";
import { kebabCase } from "@/utils";

const props = defineProps(puImgProps);
const emit = defineEmits(puImgEmits);

const isLoading = ref(true);
const isError = ref(false);

const hasSrc = computed(() => Boolean(props.src));

function resetState() {
  isLoading.value = true;
  isError.value = false;
}

watch(
  () => props.src,
  () => {
    resetState();
  }
);

function onLoad(e: any) {
  isLoading.value = false;
  isError.value = false;
  emit("load", e);
}

function onError(e: any) {
  isLoading.value = false;
  isError.value = true;
  emit("error", e);
}

const rootStyle = computed(() => {
  const style: Record<string, string> = {};
  // Precedence: size > width/height
  if (props.size) {
    // When size is specified, rely on CSS class to set both width & height
    // Do not apply inline width/height so theme tokens control the value
  } else {
    if (props.width)
      style.width =
        typeof props.width === "number" ? `${props.width}px` : props.width;
    if (props.height)
      style.height =
        typeof props.height === "number" ? `${props.height}px` : props.height;
  }
  return style;
});

onMounted(() => {
  if (!hasSrc.value) {
    isLoading.value = false;
    isError.value = true;
  }
});
</script>

<template>
  <view
    class="pu-img"
    :class="[props.customClass, props.size ? `pu-img--${props.size}` : '']"
    :style="rootStyle"
  >
    <image
      class="pu-img__image"
      :class="[
        props.customImage,
        `pu-img__image--r-${kebabCase(props.radius)}`,
        {
          'is-hidden':
            (props.showError && isError) || (props.showLoading && isLoading),
        },
      ]"
      :src="props.src"
      :mode="props.mode"
      :lazy-load="props.lazyLoad"
      @load="onLoad"
      @error="onError"
    />

    <view
      v-if="props.showLoading && isLoading && hasSrc"
      class="pu-img__placeholder is-loading"
    >
      <slot name="loading">
        <view class="pu-img__spinner" />
      </slot>
    </view>

    <view v-if="props.showError && isError" class="pu-img__placeholder is-error">
      <slot name="error">
        <view class="pu-img__error-icon" />
      </slot>
    </view>
  </view>
</template>

<style lang="scss" scoped src="./PUImg.scss"></style>
