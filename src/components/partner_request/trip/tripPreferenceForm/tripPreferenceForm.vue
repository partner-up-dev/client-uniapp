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
import { tripPreferenceFormProps, tripPreferenceFormEmits } from "./tripPreferenceForm";
import Cell from "@/components/common/cell/cell.vue";
import PUInput from "@/components/common/PUInput/PUInput.vue";

const props = defineProps(tripPreferenceFormProps);
const emit = defineEmits(tripPreferenceFormEmits);

const { dt } = useTranslate("partner_request.trip.preference_editor");

// 行李数量（个）
const luggageNumber = ref<number | undefined>(
  props.modelValue.luggage ? props.modelValue.luggage / 20 : undefined
);

// 航班号
const flightNumber = ref<string>(props.modelValue.flight || "");

// 列车号
const railwayNumber = ref<string>(props.modelValue.railway || "");

// 出行目的
const purposeText = computed(() => {
  if (!props.modelValue.purpose) {
    return dt("purpose.placeholder");
  }
  // Use base trip purpose translations
  const { t } = useTranslate("base.trip_purpose_picker");
  return t(`purpose_text.${props.modelValue.purpose}`);
});

// Methods
function handlePurposeClick() {
  // TODO: Open trip purpose picker
  // For now, this is a placeholder
  console.log("Open trip purpose picker");
}

function handleLuggageInput(value: string | number) {
  const num = typeof value === "string" ? parseFloat(value) : value;
  luggageNumber.value = isNaN(num) ? undefined : num;
  
  // Convert luggage count to volume (20L per piece)
  const updatedValue = new props.modelValue.constructor({
    ...props.modelValue,
    luggage: luggageNumber.value ? luggageNumber.value * 20 : null,
  });
  emit("update:modelValue", updatedValue);
  emit("change");
}

function handleFlightInput(value: string) {
  flightNumber.value = value;
  const updatedValue = new props.modelValue.constructor({
    ...props.modelValue,
    flight: value || null,
  });
  emit("update:modelValue", updatedValue);
  emit("change");
}

function handleRailwayInput(value: string) {
  railwayNumber.value = value;
  const updatedValue = new props.modelValue.constructor({
    ...props.modelValue,
    railway: value || null,
  });
  emit("update:modelValue", updatedValue);
  emit("change");
}

// Watch for external changes
watch(
  () => props.modelValue,
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
  if (luggageNumber.value !== undefined && !Number.isInteger(luggageNumber.value)) {
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
    <Cell :title="dt('purpose.title')" :value="purposeText" is-link @click="handlePurposeClick" />

    <Cell :title="dt('luggage.prefix')">
      <template #value>
        <view class="luggage-input">
          <PUInput
            v-model="luggageNumber"
            :placeholder="dt('luggage.placeholder')"
            type="number"
            inputmode="numeric"
            no-border
            @update:modelValue="handleLuggageInput"
          />
          <text class="luggage-unit">{{ dt("luggage.unit") }}</text>
        </view>
      </template>
    </Cell>

    <Cell
      v-if="modelValue.purpose === 'airport_dropoff' || modelValue.purpose === 'airport_pickup'"
      :title="dt('flight.placeholder')"
    >
      <template #value>
        <PUInput
          v-model="flightNumber"
          :placeholder="dt('flight.placeholder')"
          no-border
          @update:modelValue="handleFlightInput"
        />
      </template>
    </Cell>

    <Cell
      v-if="modelValue.purpose === 'railway_dropoff' || modelValue.purpose === 'railway_pickup'"
      :title="dt('train.placeholder')"
    >
      <template #value>
        <PUInput
          v-model="railwayNumber"
          :placeholder="dt('train.placeholder')"
          no-border
          @update:modelValue="handleRailwayInput"
        />
      </template>
    </Cell>
  </view>
</template>

<style lang="scss" scoped src="./tripPreferenceForm.scss"></style>
