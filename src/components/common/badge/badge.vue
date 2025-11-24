<script lang="ts">
export default {
  name: "Badge",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { computed, type CSSProperties } from "vue";
import { BasicComponentOptions } from "@/utils/vue";
import { badgeProps } from "./badge";

const props = defineProps(badgeProps);

function isDef<T>(val: T | undefined | null): val is T {
  return val !== undefined && val !== null && val !== "";
}

function addUnit(value?: string | number) {
  if (value === undefined || value === null || value === "") return undefined;
  return typeof value === "number" ? `${value}px` : `${value}`;
}

const content = computed(() => {
  const { modelValue, max, isDot } = props as any;
  if (isDot) return "";
  let value: any = modelValue as any;
  if (
    value !== undefined &&
    value !== null &&
    max !== undefined &&
    typeof value === "number" &&
    !Number.isNaN(value) &&
    !Number.isNaN(max as any)
  ) {
    value = (max as number) < value ? `${max}+` : value;
  }
  return value as any;
});

const contentStyle = computed(() => {
  const style: CSSProperties = {};
  if (isDef(props.bgColor)) {
    style.backgroundColor = props.bgColor as string;
  }
  if (isDef(props.top)) style.top = addUnit(props.top)!;
  if (isDef(props.right)) style.right = addUnit(props.right)!;
  // bottom/left are accepted for compatibility but not applied by default,
  // to keep behavior aligned with original wd-badge (top/right only)
  return style;
});

const shouldShowBadge = computed(() => {
  const val = content.value as any;
  return !props.hidden && (val || (val === 0 && props.showZero) || props.isDot);
});
</script>

<template>
  <view :class="['badge', props.customClass]" :style="props.customStyle">
    <slot />
    <view
      v-if="shouldShowBadge"
      :class="[
        'badge__content',
        'is-fixed',
        props.type ? `badge__content--${props.type}` : '',
        props.isDot ? 'is-dot' : '',
      ]"
      :style="contentStyle"
    >
      {{ content }}
    </view>
  </view>
</template>

<style lang="scss" scoped src="./badge.scss"></style>
