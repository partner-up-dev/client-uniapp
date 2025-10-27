<script lang="ts">
export default {
  name: "PRRideHailingForm",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
import {
  rideHailingFormProps,
  rideHailingFormEmits,
  domain_t,
  type RideHailingFormExpose,
} from "./PRRideHailingForm";
import { ref } from "vue";
import PUAccordion from "@/components/common/PUAccordion/PUAccordion.vue";
import PUAccordionItem from "@/components/common/PUAccordion/PUAccordionItem.vue";
import TripPreferenceForm from "@/components/partner_request/trip/tripPreferenceForm/tripPreferenceForm.vue";
import RouteEditor from "@/components/base/routeEditor/routeEditor.vue";

const props = defineProps(rideHailingFormProps);
const emit = defineEmits(rideHailingFormEmits);

// data
const activeNames = ref<string[]>(["route", "tripPreference"]);
const errorMessage = ref<string>("");

// refs
const routeEditorRef = ref<InstanceType<typeof RouteEditor> | null>(null);
const tripPreferenceFormRef = ref<InstanceType<typeof TripPreferenceForm> | null>(
  null
);

// methods
function onFormChange(key: string) {
  emit("change", key);
}

function validate(): Promise<{ valid: boolean; message?: string }> {
  return new Promise(async (resolve) => {
    // Validate route if available
    if (routeEditorRef.value) {
      const routeValidation = await routeEditorRef.value.validate();
      if (!routeValidation.valid) {
        errorMessage.value = routeValidation.errors.join("; ");
        resolve({ valid: false, message: errorMessage.value });
        return;
      }
    }

    // Validate trip preference if available
    if (tripPreferenceFormRef.value) {
      const tripPrefValidation = await tripPreferenceFormRef.value.validate();
      if (!tripPrefValidation.valid) {
        errorMessage.value = tripPrefValidation.errors.join("; ");
        resolve({ valid: false, message: errorMessage.value });
        return;
      }
    }

    errorMessage.value = "";
    resolve({ valid: true });
  });
}

defineExpose<RideHailingFormExpose>({
  validate,
});
</script>

<template>
  <view class="ride-hailing-form">
    <PUAccordion v-model="activeNames">
      <PUAccordionItem name="route" :title="domain_t('route.title')">
        <view class="space-p-y-med">
          <RouteEditor
            ref="routeEditorRef"
            :modelValue="props.form.route"
            type="normal"
          />
        </view>
      </PUAccordionItem>

      <PUAccordionItem
        name="tripPreference"
        :title="domain_t('trip_preference.title')"
      >
        <TripPreferenceForm
          ref="tripPreferenceFormRef"
          :modelValue="props.form.trip_preference"
          @change="onFormChange('trip_preference')"
        />
      </PUAccordionItem>
    </PUAccordion>

    <!-- Error message -->
    <view v-if="errorMessage" class="ride-hailing-form__error">
      {{ errorMessage }}
    </view>
  </view>
</template>

<style lang="scss" scoped src="./PRRideHailingForm.scss"></style>
