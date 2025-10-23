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
      <PUAccordionItem name="metadata" :title="dt('form.metadata')">
        <Cell :title="dt('form.title')">
          <template #value>
            <PUInput
              id="title-editor"
              v-model="form.title"
              :placeholder="dt('form.placeholder.title')"
              :maxlength="maxlength.title"
              show-word-limit
              no-border
              @update:modelValue="handleTitleInput"
            />
          </template>
        </Cell>
        <Cell :title="dt('form.introduction')">
          <template #value>
            <PUTextarea
              id="introduction-editor"
              v-model="form.introduction"
              :placeholder="dt('form.placeholder.introduction')"
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
