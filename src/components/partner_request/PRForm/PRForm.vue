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
    // Basic validation: check if title and introduction meet minimum requirements
    if (form.title && form.title.length >= 3 && form.title.length <= maxlength.title) {
      resolve();
    } else if (form.introduction && form.introduction.length >= 3 && form.introduction.length <= maxlength.introduction) {
      resolve();
    } else if (!form.title && !form.introduction) {
      reject(new Error("请填写标题或简介"));
    } else {
      reject(new Error("标题或简介长度不符合要求"));
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
