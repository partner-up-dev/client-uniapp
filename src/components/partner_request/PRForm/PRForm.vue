<script lang="ts">
export default {
  name: "PRForm",
};
</script>

<script setup lang="ts" generic="T extends PRType">
import { useTranslate } from "@/locale";
import PuAccordion from "@partner-up-dev/design-uniapp/components/puAccordion/puAccordion.vue";
import PuAccordionItem from "@partner-up-dev/design-uniapp/components/puAccordion/puAccordionItem.vue";
import PuForm from "@partner-up-dev/design-uniapp/components/puForm/puForm.vue";
import PRMetadataForm from "@/components/partner_request/PRMetadataForm/PRMetadataForm.vue";
import PRCommuteForm from "@/components/partner_request/commute/PRCommuteForm/PRCommuteForm.vue";
import PRRideHailingForm from "@/components/partner_request/ride_hailing/PRRideHailingForm/PRRideHailingForm.vue";
import PartnersEditor from "@/components/partner_request/partnersEditor/partnersEditor.vue";
import type { CommutePRForm } from "@/business/partner_request/commute";
import type { RideHailingPRForm } from "@/business/partner_request/ride_hailing";
import { PartnerRequest } from "@/business/partner_request/base";
import { PRType } from "@/business/partner_request";
import { WXMP_SUBMESSAGE_TID } from "@/data/const";

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
  published: () => true,
});

const { dt } = useTranslate("partner_request");

const collapse = ref<string[]>(["route", "tripPreference"]);
const saving = ref(false);
const publishing = ref(false);

// refs
// @ts-ignore
const puFormRef = ref<InstanceType<typeof PuForm> | null>(null);

// watches
watch(
  () => props.type,
  (newType) => {
    emit("update:modelValue", createFormByType(newType));
  },
  { immediate: true },
);

async function save(): Promise<void> {
  saving.value = true;
  return puFormRef.value
    ?.validate()
    .then((result) => {
      if (result.success) {
        if (props.modelValue._id) {
          return props.modelValue.update().then((pr) => {
            emit("update:modelValue", pr);
            return Promise.resolve();
          });
        } else {
          return props.modelValue.create().then((pr) => {
            emit("update:modelValue", pr);
            return Promise.resolve();
          });
        }
      } else {
        return Promise.reject();
      }
    })
    .finally(() => {
      saving.value = false;
    });
}

function publish(): Promise<void> {
  return save()
    .then(
      () =>
        new Promise((resolve) => {
          uni.requestSubscribeMessage({
            tmplIds: [
              WXMP_SUBMESSAGE_TID.newPartnerApplication,
              WXMP_SUBMESSAGE_TID.newMessage,
            ],
            complete: resolve,
          });
        }),
    )
    .then(() => {
      publishing.value = true;
      PartnerRequest.publish(props.modelValue._id!).then(() => {
        emit("published");
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
  publishing,
});
</script>

<template>
  <view class="pr-editor">
    <PuForm ref="puFormRef" :schema="modelValue">
      <PuAccordion v-model="collapse" ref="metadataCollapseRef">
        <PuAccordionItem
          name="metadata"
          :title="dt('editor.common_editor.title')"
        >
          <PRMetadataForm ref="metadataFormRef" :form="modelValue" />
        </PuAccordionItem>
        <PuAccordionItem
          name="partners"
          :title="dt('editor.partners_editor.title')"
        >
          <PartnersEditor
            class="space-p-sm"
            v-model="modelValue.partners"
            :pr-type="props.type"
          />
        </PuAccordionItem>
        <PRRideHailingForm
          v-if="props.type === PRType.RideHailing"
          ref="rideHailingFormRef"
          :form="props.modelValue as RideHailingPRForm"
        />
        <PRCommuteForm
          v-if="props.type === PRType.Commute"
          ref="commuteDatetimeFormRef"
          :form="props.modelValue as CommutePRForm"
        />
      </PuAccordion>
    </PuForm>
  </view>
</template>

<style lang="scss" scoped src="./PRForm.scss"></style>
