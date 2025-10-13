<script lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
import { cardProps, cardEmits } from "./card";

export default {
  name: "Card",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import { useOptionalVModel } from "@/composables/props";

const props = defineProps(cardProps);
const emit = defineEmits(cardEmits);

const isExpandable = computed(() => props.type === "expandable");

const expand = useOptionalVModel<boolean>({
  props,
  emit,
  modelName: "expand",
});

const showContent = computed(() => !isExpandable.value || expand.value);

const iconClass = computed(() => {
  if (isExpandable.value) {
    if (!props.reverse) {
      return expand.value ? "i-mdi-chevron-up" : "i-mdi-chevron-down";
    } else {
      return expand.value ? "i-mdi-chevron-down" : "i-mdi-chevron-up";
    }
  } else {
    return props.icon;
  }
});

const rootClass = computed(() => {
  return {
    card: true,
    "card--reverse": props.reverse,
  };
});

function onToggleClick() {
  expand.value = !expand.value;
}
</script>

<template>
  <view :class="rootClass">
    <view class="card__header">
      <view class="card__header-left">
        <slot name="title">
          <text class="card__title">{{ title }}</text>
        </slot>
      </view>
      <view class="card__header-right">
        <slot name="header-right"> </slot>
        <view class="card__icon" v-if="iconClass">
          <text :class="iconClass" @click.stop="onToggleClick"></text>
        </view>
      </view>
    </view>
    <text v-show="showContent" class="card__content">
      <slot name="content">
        <text class="card__description">{{ description }}</text>
      </slot>
    </text>
  </view>
</template>

<style lang="scss" scoped src="./card.scss"></style>
