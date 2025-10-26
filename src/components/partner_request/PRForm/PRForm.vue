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
const props = defineProps(prFormProps);

// emits
const emit = defineEmits(prFormEmits);

const { dt } = useTranslate("partner_request");
const { dt: commonEditorDt } = useTranslate("partner_request.common_editor");

// reactive data
const form = reactive({
  title: props.baseForm.title || "",
  introduction: props.baseForm.introduction || "",
});

const collapse = reactive<{ metadata: string[]; route?: string[]; tripPreference?: string[] }>({
  metadata: ["metadata"],
  route: props.baseForm.route ? ["route"] : undefined,
  tripPreference: props.baseForm.trip_preference ? ["tripPreference"] : undefined,
});

// refs
const metadataCollapseRef = ref<InstanceType<typeof PUAccordion> | null>(null);
const routeEditorRef = ref<InstanceType<typeof RouteEditor> | null>(null);
const tripPreferenceFormRef = ref<InstanceType<typeof TripPreferenceForm> | null>(null);

// 字段长度限制
const maxlength = {
  title: PartnerRequest.TITLE_MAXLENGTH,
  introduction: PartnerRequest.INTRODUCTION_MAXLENGTH,
};

// computed
const shouldShowRoute = computed(() => props.baseForm.route !== undefined);
const shouldShowTripPreference = computed(() => props.baseForm.trip_preference !== undefined);

// functions
const handleTitleInput = (value: string | number) => {
  form.title = String(value);
  const updatedForm = PartnerRequestForm.parse({
    ...props.baseForm,
    title: form.title || null,
  });
  emit("update:baseForm", updatedForm);
};

const handleIntroductionInput = (value: string) => {
  form.introduction = value;
  const updatedForm = PartnerRequestForm.parse({
    ...props.baseForm,
    introduction: form.introduction || null,
  });
  emit("update:baseForm", updatedForm);
};

const handleRouteChange = (value: any) => {
  const updatedForm = PartnerRequestForm.parse({
    ...props.baseForm,
    route: value,
  });
  emit("update:baseForm", updatedForm);
};

const handleTripPreferenceChange = (value: any) => {
  const updatedForm = PartnerRequestForm.parse({
    ...props.baseForm,
    trip_preference: value,
  });
  emit("update:baseForm", updatedForm);
};

// validation
const validate = (): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Validate base form using PartnerRequestForm's validate method
      await props.baseForm.validate();
      
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
  () => props.baseForm,
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
              @update:modelValue="handleTitleInput"
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
              @update:modelValue="handleIntroductionInput"
            />
          </template>
        </Cell>
      </PUAccordionItem>
    </PUAccordion>

    <!-- Route Editor for ride_hailing and commute types -->
    <PUAccordion v-if="shouldShowRoute && props.baseForm.route" v-model="collapse.route">
      <PUAccordionItem name="route" :title="dt('editor.route.title')">
        <RouteEditor
          ref="routeEditorRef"
          :modelValue="props.baseForm.route"
          type="normal"
          @update:modelValue="handleRouteChange"
        />
      </PUAccordionItem>
    </PUAccordion>

    <!-- Trip Preference Editor for ride_hailing and commute types -->
    <PUAccordion v-if="shouldShowTripPreference && props.baseForm.trip_preference" v-model="collapse.tripPreference">
      <PUAccordionItem name="tripPreference" :title="dt('editor.trip_preference.title')">
        <TripPreferenceForm
          ref="tripPreferenceFormRef"
          :modelValue="props.baseForm.trip_preference"
          @update:modelValue="handleTripPreferenceChange"
        />
      </PUAccordionItem>
    </PUAccordion>
  </view>
</template>

<style lang="scss" scoped src="./PRForm.scss"></style>
