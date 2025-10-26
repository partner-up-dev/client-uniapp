<script lang="ts">
export default {
  name: "PUFormItem",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
import { puFormItemProps, puFormItemEmits } from "./PUFormItem";
import Cell from "@/components/common/cell/cell.vue";

const props = defineProps(puFormItemProps);
const emit = defineEmits(puFormItemEmits);

const onCellClick = () => {
  emit("click");
};
</script>

<template>
  <Cell
    :type="type"
    :title="label"
    :prefix-icon="prefixIcon"
    :suffix-icon="suffixIcon"
    :size="size"
    :form-prop="prop"
    @click="onCellClick"
  >
    <template #title>
      <view class="pu-form-item__label">
        <text v-if="required" class="pu-form-item__required">*</text>
        <text>{{ label }}</text>
      </view>
    </template>
    <template #value>
      <slot></slot>
    </template>
  </Cell>
</template>

<style lang="scss" scoped src="./PUFormItem.scss"></style>
