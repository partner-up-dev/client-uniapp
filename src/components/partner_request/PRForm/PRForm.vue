<script lang="ts">
export default {
  name: "PRForm",
};
</script>

<script setup lang="ts" generic="T extends PRType">
import { useTranslate } from "@/locale/use";
import PUAccordion from "@/components/common/PUAccordion/PUAccordion.vue";
import PUAccordionItem from "@/components/common/PUAccordion/PUAccordionItem.vue";
import PUForm from "@/components/common/PUForm/PUForm.vue";
import PRMetadataForm from "@/components/partner_request/PRMetadataForm/PRMetadataForm.vue";
import PRCommuteForm from "@/components/partner_request/commute/PRCommuteForm/PRCommuteForm.vue";
import PRRideHailingForm from "@/components/partner_request/ride_hailing/PRRideHailingForm/PRRideHailingForm.vue";
import type { PartnerRequestForm } from "@/business/partner_request/form";
import type { CommutePRForm } from "@/business/partner_request/commute";
import type { RideHailingPRForm } from "@/business/partner_request/ride_hailing";

// composables
import { ref, watch } from "vue";

// props
import { createFormByType, type GetFormTypeByPRType } from "./PRForm";
import { PRType } from "@/business/partner_request";

interface PRFormProps<T extends PRType> {
  modelValue: GetFormTypeByPRType<T>;
  type: T;
  showSaveToDraft?: boolean;
  showConfirm?: boolean;
}

const props = withDefaults(defineProps<PRFormProps<T>>(), {
  showSaveToDraft: true,
  showConfirm: true,
});

// emits
const emit = defineEmits({
  confirm: (partnerRequestId: number) => true,
  "update:modelValue": (value: GetFormTypeByPRType<T>) => true,
});

const { dt } = useTranslate("partner_request");

const collapse = ref<string[]>(["route", "tripPreference"]);

// refs
const puFormRef = ref<InstanceType<typeof PUForm> | null>(null);
const metadataCollapseRef = ref<InstanceType<typeof PUAccordion> | null>(null);
const metadataFormRef = ref<InstanceType<typeof PRMetadataForm> | null>(null);
const commuteDatetimeFormRef = ref<InstanceType<typeof PRCommuteForm> | null>(
  null
);
const rideHailingFormRef = ref<InstanceType<typeof PRRideHailingForm> | null>(
  null
);

// watches
watch(
  () => props.type,
  (newType) => {
    emit("update:modelValue", createFormByType(newType));
  },
  { immediate: true }
);

// expose
defineExpose({
  validate: () => puFormRef.value?.validate(),
});
</script>

<template>
  <view class="pr-editor">
    <PUForm ref="puFormRef" :schema="modelValue">
      <PUAccordion v-model="collapse" ref="metadataCollapseRef">
        <PUAccordionItem
          name="metadata"
          :title="dt('editor.common_editor.title')"
        >
          <PRMetadataForm ref="metadataFormRef" :form="modelValue" />
        </PUAccordionItem>
        <PRRideHailingForm
          v-if="props.type === PRType.RideHailing"
          ref="rideHailingFormRef"
          :form="(props.modelValue as RideHailingPRForm)"
        />
        <PRCommuteForm
          v-if="props.type === PRType.Commute"
          ref="commuteDatetimeFormRef"
          :form="(props.modelValue as CommutePRForm)"
        />
      </PUAccordion>
    </PUForm>
  </view>
</template>

<style lang="scss" scoped src="./PRForm.scss"></style>
