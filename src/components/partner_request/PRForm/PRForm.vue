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
import type { CommutePRForm } from "@/business/partner_request/commute";
import type { RideHailingPRForm } from "@/business/partner_request/ride_hailing";
import { PartnerRequest } from "@/business/partner_request/base";
import { type PRRef, PRType } from "@/business/partner_request";
import { errorReport } from "@/utils/vendor";
import { WEIXIN_MESSAGE_SUBSRIPTION_TEMPLATE_IDS } from "@/data/const";

// composables
import { ref, watch } from "vue";

// props
import { createFormByType, type GetFormTypeByPRType } from "./PRForm";

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
  created: (pr: any) => true,
  updated: (pr: any) => true,
  published: () => true,
});

const { dt } = useTranslate("partner_request");

const collapse = ref<string[]>(["route", "tripPreference"]);
const saving = ref(false);
const publishing = ref(false);

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

async function save(): Promise<void> {
  puFormRef.value?.validate().then((result) => {
    if (result.success) {
      if (props.modelValue._id) {
        props.modelValue.update();
      } else {
        props.modelValue.create();
      }
    }
  });
}

function publish() {
  save()
    .then(() => {
      const save = props.modelValue._id
        ? props.modelValue.update
        : props.modelValue.create;
      save().then(() => {
        return new Promise((resolve, reject) => {
          uni.requestSubscribeMessage({
            tmplIds: [
              WEIXIN_MESSAGE_SUBSRIPTION_TEMPLATE_IDS.new_message,
              WEIXIN_MESSAGE_SUBSRIPTION_TEMPLATE_IDS.partner_application,
            ],
            complete: resolve,
          });
        }).then(() => {
          publishing.value = true;
          PartnerRequest.publish(props.modelValue._id!).then(() => {
            emit("published");
          });
        });
      });
    })
    .finally(() => {
      publishing.value = false;
    });
}

// expose
defineExpose({
  validate: () => puFormRef.value?.validate(),
  save,
  publish,
  saving,
  publishing,
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
