<script lang="ts">
export default {
  name: "TripPurposePicker",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
import {
  tripPurposePickerProps,
  tripPurposePickerEmits,
  TRIP_PURPOSE_ICONS,
  TRIP_PURPOSES,
} from "./tripPurposePicker";
import { useTranslate } from "@/locale/use";
import PUScrollView from "@/components/common/PUScrollView/PUScrollView.vue";
import type { TripPurpose } from "@/business/partner_request/trip";

const { dt: domain_t } = useTranslate("base.trip_purpose_picker");

const props = defineProps(tripPurposePickerProps);
const emit = defineEmits(tripPurposePickerEmits);

/**
 * 处理目的选择
 */
function onPurposeSelect(purpose: TripPurpose) {
  emit("update:modelValue", purpose);
  emit("select", purpose);
  emit("complete");
}
</script>

<template>
  <view
    class="trip-purpose-picker"
    :class="props.customClass"
    :style="props.customStyle"
  >
    <PUScrollView
      direction="x"
      :edge-fade="props.edgeFade"
      custom-class="trip-purpose-picker__scroll"
    >
      <view
        v-for="purpose in TRIP_PURPOSES"
        :key="purpose"
        @click="onPurposeSelect(purpose)"
        :class="[
          'trip-purpose-picker__card trip-purpose-picker__item',
          props.modelValue === purpose ? 'is-selected' : '',
        ]"
      >
        <text
          :class="[TRIP_PURPOSE_ICONS[purpose], 'trip-purpose-picker__icon']"
        ></text>
        <view class="trip-purpose-picker__text">
          {{ domain_t(`purpose_text.${purpose}`) }}
        </view>
      </view>
    </PUScrollView>
  </view>
</template>

<style lang="scss" scoped src="./tripPurposePicker.scss"></style>
