<script lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
import { cardProps, cardEmits } from "./card";

export default {
  name: "Card",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
const props = defineProps(cardProps);
const emit = defineEmits(cardEmits);

function onCardClick() {
  emit("click", props.name!);
}
</script>

<template>
  <view
    class="uno-bg-surface-container uno-w-[275px] uno-h-full space-p-sm space-p-l-med space-p-r-med uno-box-border uno-flex uno-flex-col uno-gap-sm uno-flex-shrink-0"
    @click="onCardClick"
  >
    <view class="uno-flex uno-items-center uno-justify-between uno-w-full">
      <text class="font-body-large uno-text-surface-on uno-tracking-[0.08px]">
        {{ title }}
      </text>
      <view class="uno-flex uno-items-center uno-justify-center">
        <text
          class="font-title-large uno-text-surface-on i-mdi-chevron-right"
        ></text>
      </view>
    </view>
    <text class="font-label-large uno-text-surface-on">
      {{ description }}
    </text>
  </view>
</template>

<style lang="scss" scoped src="./card.scss"></style>
