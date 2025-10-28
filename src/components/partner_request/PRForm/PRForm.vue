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
import { PartnerRequest } from "@/business/partner_request/base";
import { type PRRef, PRType } from "@/business/partner_request";
import { errorReport } from "@/utils/vendor";
import { WEIXIN_MESSAGE_SUBSRIPTION_TEMPLATE_IDS } from "@/data/const";

// composables
import { ref, watch } from "vue";

// props
import {
  createFormByType,
  type GetFormTypeByPRType,
  prFormProps,
  prFormEmits,
} from "./PRForm";

interface PRFormProps<T extends PRType> {
  modelValue: GetFormTypeByPRType<T>;
  type: T;
  showSaveToDraft?: boolean;
  showConfirm?: boolean;
  id?: PRRef;
}

const props = withDefaults(defineProps<PRFormProps<T>>(), {
  showSaveToDraft: true,
  showConfirm: true,
});

// emits
const emit = defineEmits({
  confirm: (partnerRequestId: number) => true,
  "update:modelValue": (value: GetFormTypeByPRType<T>) => true,
  "update:id": (id: PRRef) => true,
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

// methods
async function create(): Promise<void> {
  if (props.type === PRType.Undefined) {
    errorReport(dt("create.invalid_form_type"));
    throw new Error("Invalid form type");
  }

  saving.value = true;
  try {
    const form = props.modelValue as any;
    let pr: any;

    if (props.type === PRType.Commute) {
      pr = await (form as CommutePRForm).create();
    } else if (props.type === PRType.RideHailing) {
      pr = await (form as RideHailingPRForm).create();
    } else {
      throw new Error("Unsupported PR type");
    }

    emit("update:id", pr._id);
    emit("created", pr);
  } finally {
    saving.value = false;
  }
}

async function update(): Promise<void> {
  if (!props.id) {
    errorReport(dt("update.invalid_id"));
    throw new Error("Invalid id");
  }

  saving.value = true;
  try {
    const form = props.modelValue as any;
    let pr: any;

    if (props.type === PRType.Commute) {
      pr = await (form as CommutePRForm).update();
    } else if (props.type === PRType.RideHailing) {
      pr = await (form as RideHailingPRForm).update();
    } else {
      throw new Error("Unsupported PR type");
    }

    emit("updated", pr);
  } finally {
    saving.value = false;
  }
}

async function save(): Promise<void> {
  puFormRef.value?.validate().then((result) => {
    if (result.success) {
      return;
    }

    if (props.id) {
      update();
    } else {
      create();
    }
  });
}

async function publish(retry: number = 0): Promise<void> {
  const result = await puFormRef.value?.validate();

  if (!result?.success) {
    return;
  }

  try {
    // 先保存
    if (props.id) {
      await update();
    } else {
      if (retry >= 1) {
        // 防止死循环
        return;
      }
      await create();
      await publish(retry + 1);
      return;
    }

    // 请求订阅消息
    await new Promise<void>((resolve) => {
      uni.requestSubscribeMessage({
        tmplIds: [
          WEIXIN_MESSAGE_SUBSRIPTION_TEMPLATE_IDS.new_message,
          WEIXIN_MESSAGE_SUBSRIPTION_TEMPLATE_IDS.partner_application,
        ],
        complete() {
          resolve();
        },
      });
    });

    // 发布
    if (props.id) {
      publishing.value = true;
      await PartnerRequest.publish(props.id);
      emit("published");
    } else {
      errorReport(dt("publish.invalid_id"));
    }
  } finally {
    publishing.value = false;
  }
}

// expose
defineExpose({
  validate: () => puFormRef.value?.validate(),
  save,
  create,
  update,
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
