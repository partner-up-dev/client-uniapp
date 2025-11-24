<script lang="ts">
import { BasicComponentOptions } from "@/utils/vue";

export default {
  name: "Snackbar",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { snackbarProps, snackbarEmits } from "./snackbar";

const props = defineProps(snackbarProps);
const emit = defineEmits(snackbarEmits);
</script>

<template>
  <view
    class="uno-bg-primary-container space-p-sm uno-flex uno-items-center uno-justify-between"
    @click="emit('click')"
  >
    <text class="font-body-large uno-text-surface-on uno-tracking-[0.08px]">
      {{ props.title }}
    </text>
    <view
      class="uno-w-[24px] uno-h-[24px] uno-flex uno-items-center uno-justify-center"
    >
      <text
        class="font-title-large uno-text-surface-on i-mdi-chevron-right"
      ></text>
    </view>
  </view>
</template>

<style lang="scss" scoped src="./snackbar.scss"></style>
