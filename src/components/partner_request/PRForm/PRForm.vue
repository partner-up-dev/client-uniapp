<script setup lang="ts">
import { useTranslate } from "@/locale/use";
import PUAccordion from "@/components/common/PUAccordion/PUAccordion.vue";
import PUAccordionItem from "@/components/common/PUAccordion/PUAccordionItem.vue";
import Cell from "@/components/common/cell/cell.vue";
import PUInput from "@/components/common/PUInput/PUInput.vue";
import PUTextarea from "@/components/common/PUTextarea/PUTextarea.vue";
import RouteEditor from "@/components/base/routeEditor/routeEditor.vue";
import TripPreferenceForm from "@/components/partner_request/trip/tripPreferenceForm/tripPreferenceForm.vue";
import { PartnerRequest, PartnerRequestForm } from "@/business/partner_request/base";
import { PRType } from "@/business/partner_request";

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
  route: props.type === PRType.RideHailing || props.type === PRType.Commute ? ["route"] : undefined,
  tripPreference: props.type === PRType.RideHailing || props.type === PRType.Commute ? ["tripPreference"] : undefined,
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
const shouldShowRoute = computed(() => 
  props.type === PRType.RideHailing || props.type === PRType.Commute
);

const shouldShowTripPreference = computed(() => 
  props.type === PRType.RideHailing || props.type === PRType.Commute
);

// functions
const handleTitleInput = (value: string | number) => {
  form.title = String(value);
  emit("confirm", 0); // TODO: implement proper save logic
};

const handleIntroductionInput = (value: string) => {
  form.introduction = value;
  emit("confirm", 0); // TODO: implement proper save logic
};

const handleRouteChange = () => {
  if (props.route) {
    emit("update:route", props.route);
  }
};

const handleTripPreferenceChange = () => {
  if (props.tripPreference) {
    emit("update:tripPreference", props.tripPreference);
  }
};

// validation
const validate = (): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Validate base form using PartnerRequestForm's validate method
      const baseFormInstance = PartnerRequestForm.parse({
        title: form.title || null,
        introduction: form.introduction || null,
      });
      await baseFormInstance.validate();
      
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
    <PUAccordion v-if="shouldShowRoute && props.route" v-model="collapse.route">
      <PUAccordionItem name="route" :title="dt('editor.route.title')">
        <RouteEditor
          ref="routeEditorRef"
          v-model="props.route"
          type="normal"
          @change="handleRouteChange"
        />
      </PUAccordionItem>
    </PUAccordion>

    <!-- Trip Preference Editor for ride_hailing and commute types -->
    <PUAccordion v-if="shouldShowTripPreference && props.tripPreference" v-model="collapse.tripPreference">
      <PUAccordionItem name="tripPreference" :title="dt('editor.trip_preference.title')">
        <TripPreferenceForm
          ref="tripPreferenceFormRef"
          v-model="props.tripPreference"
          @change="handleTripPreferenceChange"
        />
      </PUAccordionItem>
    </PUAccordion>
  </view>
</template>

<style lang="scss" scoped src="./PRForm.scss"></style>
