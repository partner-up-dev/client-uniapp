<script lang="ts">
export default {
  name: "TripPreferenceForm",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
import { useTranslate } from "@/locale/use";
import { ref, computed, watch } from "vue";
import { useOptionalVModel } from "@/composables/props";
import { TripPreference } from "@/business/partner_request/trip";
import type { TripPurpose } from "@/business/partner_request/trip";
import {
  tripPreferenceFormProps,
  tripPreferenceFormEmits,
} from "./tripPreferenceForm";
import Cell from "@/components/common/cell/cell.vue";
import { PUInput, PUDrawer } from "@partner-up-dev/design-uniapp";
import TripPurposePicker from "@/components/partner_request/trip/tripPurposePicker/tripPurposePicker.vue";

const props = defineProps(tripPreferenceFormProps);
const emit = defineEmits(tripPreferenceFormEmits);

const { dt } = useTranslate("partner_request.trip.preference_editor");
const { dt: tripPurposeDt } = useTranslate("base.trip_purpose_picker");

// Use useOptionalVModel to handle undefined modelValue
const tripPreference = useOptionalVModel({
  props,
  emit,
  modelName: "modelValue",
  defaultValue: new TripPreference({}),
});

// 行李数量（个）
const luggageNumber = ref<number | undefined>(
  tripPreference.value.luggage ? tripPreference.value.luggage / 20 : undefined
);

// 航班号
const flightNumber = ref<string>(tripPreference.value.flight || "");

// 列车号
const railwayNumber = ref<string>(tripPreference.value.railway || "");

// 出行目的
const purposeText = computed(() => {
  if (!tripPreference.value.purpose) {
    return dt("purpose.placeholder");
  }
  return tripPurposeDt(`purpose_text.${tripPreference.value.purpose}`);
});

// Drawer visibility
const showPurposeDrawer = ref(false);

// Methods
function handlePurposeClick() {
  showPurposeDrawer.value = true;
}

function handlePurposeSelect(purpose: TripPurpose) {
  tripPreference.value.purpose = purpose;
  showPurposeDrawer.value = false;
  emit("change");
}

// Watch for external changes
watch(
  () => tripPreference.value,
  (newValue) => {
    luggageNumber.value = newValue.luggage ? newValue.luggage / 20 : undefined;
    flightNumber.value = newValue.flight || "";
    railwayNumber.value = newValue.railway || "";
  }
);

// Validation
function validate(): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];

  // Validate luggage number is integer if provided
  if (
    luggageNumber.value !== undefined &&
    !Number.isInteger(luggageNumber.value)
  ) {
    errors.push("行李数量必须是整数");
  }

  if (luggageNumber.value !== undefined && luggageNumber.value < 0) {
    errors.push("行李数量不能为负数");
  }

  return Promise.resolve({
    valid: errors.length === 0,
    errors,
  });
}

defineExpose({
  validate,
});
</script>

<template>
  <view class="trip-preference-form">
    <Cell
      :title="dt('purpose.title')"
      :value="purposeText"
      is-link
      @click="handlePurposeClick"
    />

    <Cell :title="dt('luggage.prefix')">
      <template #value>
        <view class="luggage-input">
          <PUInput
            v-model="luggageNumber"
            :placeholder="dt('luggage.placeholder')"
            type="number"
            inputmode="numeric"
            no-border
          />
          <text class="luggage-unit">{{ dt("luggage.unit") }}</text>
        </view>
      </template>
    </Cell>

    <Cell
      v-if="
        tripPreference.purpose === 'airport_dropoff' ||
        tripPreference.purpose === 'airport_pickup'
      "
      :title="dt('flight.placeholder')"
    >
      <template #value>
        <PUInput
          v-model="flightNumber"
          :placeholder="dt('flight.placeholder')"
          no-border
        />
      </template>
    </Cell>

    <Cell
      v-if="
        tripPreference.purpose === 'railway_dropoff' ||
        tripPreference.purpose === 'railway_pickup'
      "
      :title="dt('train.placeholder')"
    >
      <template #value>
        <PUInput
          v-model="railwayNumber"
          :placeholder="dt('train.placeholder')"
          no-border
        />
      </template>
    </Cell>

    <!-- Purpose Picker Drawer -->
    <PUDrawer
      v-model:visible="showPurposeDrawer"
      :title="dt('purpose.title')"
      height="30vh"
    >
      <TripPurposePicker
        style="height: 110px"
        :model-value="tripPreference.purpose"
        @select="handlePurposeSelect"
      />
    </PUDrawer>
  </view>
</template>

<style lang="scss" scoped src="./tripPreferenceForm.scss"></style>
