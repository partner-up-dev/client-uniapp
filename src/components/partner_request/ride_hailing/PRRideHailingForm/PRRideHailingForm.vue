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
  localMessages,
  type RideHailingFormExpose,
} from "./PRRideHailingForm";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import PuAccordion from "@partner-up-dev/design-uniapp/components/puAccordion/puAccordion.vue";
import PuAccordionItem from "@partner-up-dev/design-uniapp/components/puAccordion/puAccordionItem.vue";
import PuFormItem from "@partner-up-dev/design-uniapp/components/puFormItem/puFormItem.vue";
import TripPreferenceForm from "@/components/partner_request/trip/tripPreferenceForm/tripPreferenceForm.vue";
import RouteEditor from "@/components/base/routeEditor/routeEditor.vue";

const props = defineProps(rideHailingFormProps);
const emit = defineEmits(rideHailingFormEmits);
const { t: lt } = useI18n({ inheritLocale: true, messages: localMessages });

// data
const activeNames = ref<string[]>(["route", "tripPreference"]);
const errorMessage = ref<string>("");

// refs
const routeEditorRef = ref<InstanceType<typeof RouteEditor> | null>(null);
const tripPreferenceFormRef = ref<InstanceType<typeof TripPreferenceForm> | null>(
  null,
);

// methods
function onFormChange(key: string) {
  emit("change", key);
}
</script>

<template>
  <view class="ride-hailing-form">
    <PuAccordion v-model="activeNames">
      <PuAccordionItem name="route" :title="lt('route.title')">
        <view class="space-p-y-med">
          <PuFormItem prop="route" :includeSub="true">
            <RouteEditor
              ref="routeEditorRef"
              :modelValue="props.form.route"
              type="normal"
            />
          </PuFormItem>
        </view>
      </PuAccordionItem>

      <PuAccordionItem name="tripPreference" :title="lt('trip_preference.title')">
        <TripPreferenceForm
          ref="tripPreferenceFormRef"
          :modelValue="props.form.trip_preference"
          @change="onFormChange('trip_preference')"
        />
      </PuAccordionItem>
    </PuAccordion>

    <!-- Error message -->
    <view v-if="errorMessage" class="ride-hailing-form__error">
      {{ errorMessage }}
    </view>
  </view>
</template>

<style lang="scss" scoped src="./PRRideHailingForm.scss"></style>
