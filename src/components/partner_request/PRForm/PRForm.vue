<script setup lang="ts">
import { useTranslate } from "@/locale/use";
import PUAccordion from "@/components/common/PUAccordion/PUAccordion.vue";
import PUAccordionItem from "@/components/common/PUAccordion/PUAccordionItem.vue";
import Cell from "@/components/common/cell/cell.vue";
import PUInput from "@/components/common/PUInput/PUInput.vue";
import PUTextarea from "@/components/common/PUTextarea/PUTextarea.vue";
import { PartnerRequest } from "@/business/partner_request/base";

// composables
import { reactive, ref, watch } from "vue";

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

const collapse = reactive<{ metadata: string[] }>({
  metadata: ["metadata"],
});

// refs
const metadataCollapseRef = ref<InstanceType<typeof PUAccordion> | null>(null);

// 字段长度限制
const maxlength = {
  title: PartnerRequest.TITLE_MAXLENGTH,
  introduction: PartnerRequest.INTRODUCTION_MAXLENGTH,
};

// functions
const handleTitleInput = (value: string | number) => {
  form.title = String(value);
  emit("confirm", 0); // TODO: implement proper save logic
};

const handleIntroductionInput = (value: string) => {
  form.introduction = value;
  emit("confirm", 0); // TODO: implement proper save logic
};

// validation
const validate = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const errors: string[] = [];
    
    // Validate title if provided
    if (form.title !== null && form.title !== "") {
      if (form.title.length < 3 || form.title.length > 12) {
        errors.push("标题长度必须在 3-12 个字符之间");
      }
    }
    
    // Validate introduction if provided
    if (form.introduction !== null && form.introduction !== "") {
      if (form.introduction.length < 3 || form.introduction.length > maxlength.introduction) {
        errors.push("简介长度必须在 3-60 个字符之间");
      }
    }
    
    // At least one field must be provided
    if ((form.title === null || form.title === "") && (form.introduction === null || form.introduction === "")) {
      errors.push("请填写标题或简介");
    }
    
    if (errors.length > 0) {
      reject(new Error(errors.join("; ")));
    } else {
      resolve();
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
  </view>
</template>

<style lang="scss" scoped src="./PRForm.scss"></style>
