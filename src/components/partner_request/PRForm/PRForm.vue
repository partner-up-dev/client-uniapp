<script setup lang="ts">
import { useTranslate } from "@/locale/use";
import PUAccordion from "@/components/common/PUAccordion/PUAccordion.vue";
import PUAccordionItem from "@/components/common/PUAccordion/PUAccordionItem.vue";
import Cell from "@/components/common/cell/cell.vue";
import PUInput from "@/components/common/PUInput/PUInput.vue";
import PUTextarea from "@/components/common/PUTextarea/PUTextarea.vue";
import RouteEditor from "@/components/base/routeEditor/routeEditor.vue";
import TripPreferenceForm from "@/components/partner_request/trip/tripPreferenceForm/tripPreferenceForm.vue";
import { PartnerRequest } from "@/business/partner_request/base";
import { PartnerRequestForm } from "@/business/partner_request/form";

// composables
import { reactive, ref, watch, computed } from "vue";

// props
import { prFormProps, prFormEmits } from "./PRForm";
import { PRType } from "@/business/partner_request";
const props = defineProps(prFormProps);

// emits
const emit = defineEmits(prFormEmits);

const { dt } = useTranslate("partner_request");
const { dt: commonEditorDt } = useTranslate("partner_request.common_editor");

// reactive data
const form = reactive({
  title: props.modelValue.title || "",
  introduction: props.modelValue.introduction || "",
});

const collapse = reactive<{
  metadata: string[];
  route?: string[];
  tripPreference?: string[];
}>({
  metadata: ["metadata"],
  route: ["route"],
  tripPreference: ["tripPreference"],
});

// refs
const metadataCollapseRef = ref<InstanceType<typeof PUAccordion> | null>(null);
const routeEditorRef = ref<InstanceType<typeof RouteEditor> | null>(null);
const tripPreferenceFormRef = ref<InstanceType<typeof TripPreferenceForm> | null>(
  null
);

// 字段长度限制
const maxlength = {
  title: PartnerRequest.TITLE_MAXLENGTH,
  introduction: PartnerRequest.INTRODUCTION_MAXLENGTH,
};

// computed
const shouldShowRoute = computed(() =>
  [PRType.Commute, PRType.RideHailing].includes(props.type)
);
const shouldShowTripPreference = computed(() =>
  [PRType.RideHailing].includes(props.type)
);

// functions
const validate = (): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Validate base form using PartnerRequestForm's validate method
      await props.modelValue.validate();

      // Validate route if needed
      if (shouldShowRoute.value && routeEditorRef.value) {
        const routeValidation = await routeEditorRef.value.validate();
        if (!routeValidation.valid) {
          throw new Error(routeValidation.errors.join("; "));
        }
      }

      // Validate trip preference if needed
      if (shouldShowTripPreference.value && tripPreferenceFormRef.value) {
        const tripPrefValidation = await tripPreferenceFormRef.value.validate();
        if (!tripPrefValidation.valid) {
          throw new Error(tripPrefValidation.errors.join("; "));
        }
      }

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

// expose
defineExpose({
  validate,
});

// watchers
watch(
  () => props.modelValue,
  (newForm) => {
    form.title = newForm.title || "";
    form.introduction = newForm.introduction || "";
  },
  { deep: true }
);
</script>

<template>
  <view class="pr-editor">
    <PUAccordion v-model="collapse.metadata" ref="metadataCollapseRef">
      <PUAccordionItem name="metadata" :title="dt('editor.common_editor.title')">
        <Cell :title="commonEditorDt('title.title')">
          <template #value>
            <PUInput
              id="title-editor"
              v-model="form.title"
              :placeholder="commonEditorDt('title.placeholder')"
              :maxlength="maxlength.title"
              show-word-limit
              no-border
            />
          </template>
        </Cell>
        <Cell :title="commonEditorDt('introduction.title')">
          <template #value>
            <PUTextarea
              id="introduction-editor"
              v-model="form.introduction"
              :placeholder="commonEditorDt('introduction.placeholder')"
              :show-confirm-bar="false"
              :maxlength="maxlength.introduction"
              show-count
              auto-height
            />
          </template>
        </Cell>
      </PUAccordionItem>
    </PUAccordion>

    <!-- Route Editor for ride_hailing and commute types -->
    <PUAccordion v-if="shouldShowRoute" v-model="collapse.route">
      <PUAccordionItem name="route" :title="dt('editor.route.title')">
        <RouteEditor
          ref="routeEditorRef"
          :modelValue="props.modelValue.route"
          type="normal"
        />
      </PUAccordionItem>
    </PUAccordion>

    <!-- Trip Preference Editor for ride_hailing and commute types -->
    <PUAccordion
      v-if="shouldShowTripPreference"
      v-model="collapse.tripPreference"
    >
      <PUAccordionItem
        name="tripPreference"
        :title="dt('editor.trip_preference.title')"
      >
        <TripPreferenceForm
          ref="tripPreferenceFormRef"
          :modelValue="props.modelValue.trip_preference"
        />
      </PUAccordionItem>
    </PUAccordion>
  </view>
</template>

<style lang="scss" scoped src="./PRForm.scss"></style>
