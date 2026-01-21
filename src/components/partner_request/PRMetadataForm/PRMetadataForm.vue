<script lang="ts">
export default {
  name: "PRMetadataForm",
};
</script>

<script setup lang="ts">
import {
  prMetadataFormProps,
  prMetadataFormEmits,
  localMessages,
} from "./PRMetadataForm";
import Cell from "@/components/common/cell/cell.vue";
import PuInput from "@partner-up-dev/design-uniapp/components/puInput/puInput.vue";
import PuTextarea from "@partner-up-dev/design-uniapp/components/puTextarea/puTextarea.vue";
import { PartnerRequest } from "@/business/partner_request/base";
import { useI18n } from "vue-i18n";

const props = defineProps(prMetadataFormProps);
const emit = defineEmits(prMetadataFormEmits);
const { t: lt } = useI18n({ inheritLocale: true, messages: localMessages });

// methods
function onFormChange(key: string) {
  emit("change", key);
}
</script>

<template>
  <view class="pr-metadata-form">
    <Cell :title="lt('title.title')" type="vertical" formProp="title">
      <template #value>
        <PuInput
          id="title-editor"
          v-model="form.title"
          :placeholder="lt('title.placeholder')"
          :maxlength="PartnerRequest.TITLE_MAXLENGTH"
          show-word-limit
          no-border
          @update:model-value="onFormChange('title')"
        />
      </template>
    </Cell>
    <Cell
      :title="lt('introduction.title')"
      type="vertical"
      formProp="introduction"
    >
      <template #value>
        <PuTextarea
          id="introduction-editor"
          v-model="form.introduction"
          :placeholder="lt('introduction.placeholder')"
          :show-confirm-bar="false"
          :maxlength="PartnerRequest.INTRODUCTION_MAXLENGTH"
          theme="surface"
          show-count
          :height="60"
          @update:model-value="onFormChange('introduction')"
        />
      </template>
    </Cell>
  </view>
</template>

<style lang="scss" scoped>
// No styles needed currently
</style>
