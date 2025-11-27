<script lang="ts">
/**
 * @name 出行方式（交通方式）选择器
 * @description 用于选择出行时的交通工具
 */
export default {
  name: "TransportationPicker",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
import {
  transportationPickerProps,
  transportationPickerEmits,
  TRANSPORTATION_OPTIONS,
  TRANSPORTATION_ICONS,
} from "./transportationPicker";
import type { Transportation } from "@/business/partner_request/trip";
import { useTranslate } from "@/locale/use";
import { PUScrollView } from "@partner-up-dev/design/uniapp";

const { dt } = useTranslate("base.transportation_picker");
const props = defineProps(transportationPickerProps);
const emit = defineEmits(transportationPickerEmits);

// ==================== 方法 ====================

/**
 * 处理交通方式选择
 */
function handleSelect(transportation: Transportation) {
  emit("update:modelValue", transportation);
  emit("select", transportation);
  emit("complete");
}
</script>

<template>
  <PUScrollView
    direction="x"
    :edge-fade="fade ? 'auto' : undefined"
    :class="['transportation-picker']"
  >
    <view
      v-for="(transportation, index) in TRANSPORTATION_OPTIONS"
      :key="index"
      :class="[
        'transportation-picker__item',
        'transportation-card',
        modelValue === transportation ? 'is-selected' : '',
      ]"
      @click="handleSelect(transportation)"
    >
      <text
        :class="[
          'transportation-card__icon',
          TRANSPORTATION_ICONS[transportation],
        ]"
      ></text>
      <view class="transportation-card__text">
        {{ dt(`name.${transportation}`) }}
      </view>
    </view>
  </PUScrollView>
</template>

<style lang="scss" scoped src="./transportationPicker.scss"></style>
