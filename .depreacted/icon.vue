<script setup lang="ts">
import { computed } from "vue";
import designPreset from "@/styles/presets/design";

interface Props {
  name: string;
  iconFamily?: string;
  size?: string | number;
}

const props = defineProps<Props>();

const iconFamily = computed(() => props.iconFamily || "mdi");
const iconClass = computed(() => `i-${iconFamily.value}-${props.name}`);

// Try to read icon size tokens from the design preset. If unavailable, fall back to the
// provided string directly (so both token names and raw CSS values like "20px" work).
const iconSizesMap: Record<string, string> =
  (designPreset as any)?.theme?.iconSizes || {};

const style = computed(() => {
  if (props.size === undefined || props.size === null) return undefined;
  if (typeof props.size === "number") return { fontSize: `${props.size}px` };

  // props.size is a string — treat it as a design token name first
  const tokenValue = iconSizesMap[props.size as string];
  const sizeValue = tokenValue ?? props.size;
  return { fontSize: sizeValue };
});
</script>

<template>
  <view class="uno-flex uno-items-center uno-justify-center">
    <text
      :class="['font-title-large uno-text-surface-on', iconClass]"
      :style="style"
    ></text>
  </view>
</template>

<style scoped lang="scss">
/* Minimal styling - relies on existing utility classes in the project */
</style>
