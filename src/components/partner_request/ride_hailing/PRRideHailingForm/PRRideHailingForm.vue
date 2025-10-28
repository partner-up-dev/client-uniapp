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
import PUFormItem from "@/components/common/PUFormItem/PUFormItem.vue";
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
</script>

<template>
  <view class="ride-hailing-form">
    <PUAccordion v-model="activeNames">
      <PUAccordionItem name="route" :title="domain_t('route.title')">
        <view class="space-p-y-med">
          <PUFormItem prop="route" :includeSub="true">
            <RouteEditor
              ref="routeEditorRef"
              :modelValue="props.form.route"
              type="normal"
            />
          </PUFormItem>
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
