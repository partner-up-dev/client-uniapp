<script lang="ts">
export default {
  name: "Cell",
  options: BasicComponentOptions,
};
</script>
<script setup lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
import { CellProps, CellEmits } from "./cell";

const props = defineProps(CellProps);
const emit = defineEmits(CellEmits);
</script>

<template>
  <view :class="['cell', `is-${size}`, `is-${type}`]" @click="emit('click')">
    <!-- Horizontal type: horizontal layout -->
    <template v-if="type === 'horizontal'">
      <view class="cell__left">
        <view v-if="prefixIcon" class="cell__icon">
          <text :class="['i', prefixIcon]"></text>
        </view>
        <view class="cell__main">
          <view class="cell__title">
            <slot name="title">
              {{ title }}
            </slot>
          </view>
          <view v-if="subtitle" class="cell__subtitle">
            <slot name="subtitle">
              {{ subtitle }}
            </slot>
          </view>
        </view>
      </view>
      <view class="cell__right">
        <view class="cell__value">
          <slot name="value">
            {{ value }}
          </slot>
        </view>
        <view v-if="suffixIcon" class="cell__icon">
          <text :class="['i', suffixIcon]"></text>
        </view>
      </view>
    </template>

    <!-- Vertical type: vertical layout -->
    <template v-else-if="type === 'vertical'">
      <view class="cell__header">
        <view class="cell__header-left">
          <view v-if="prefixIcon" class="cell__icon">
            <text :class="['i', prefixIcon]"></text>
          </view>
          <view class="cell__title">
            <slot name="title">
              {{ title }}
            </slot>
          </view>
        </view>
        <view v-if="suffixIcon" class="cell__icon">
          <text :class="['i', suffixIcon]"></text>
        </view>
      </view>
      <view class="cell__content">
        <view class="cell__value">
          <slot name="value">
            {{ value }}
          </slot>
        </view>
      </view>
    </template>
  </view>
</template>

<style lang="scss" scoped src="./cell.scss"></style>
