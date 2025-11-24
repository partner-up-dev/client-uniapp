<script lang="ts">
export default {
  name: "PRMetadataForm",
};
</script>

<script setup lang="ts">
import {
  prMetadataFormProps,
  prMetadataFormEmits,
  domain_t,
} from "./PRMetadataForm";
import Cell from "@/components/common/cell/cell.vue";
import PUInput from "@/components/common/PUInput/PUInput.vue";
import PUTextarea from "@/components/common/PUTextarea/PUTextarea.vue";
import { PartnerRequest } from "@/business/partner_request/base";

const props = defineProps(prMetadataFormProps);
const emit = defineEmits(prMetadataFormEmits);

// methods
function onFormChange(key: string) {
  emit("change", key);
}
</script>

<template>
  <view class="pr-metadata-form">
    <Cell :title="domain_t('title.title')" type="vertical" formProp="title">
      <template #value>
        <PUInput
          id="title-editor"
          v-model="form.title"
          :placeholder="domain_t('title.placeholder')"
          :maxlength="PartnerRequest.TITLE_MAXLENGTH"
          show-word-limit
          no-border
          @update:model-value="onFormChange('title')"
        />
      </template>
    </Cell>
    <Cell
      :title="domain_t('introduction.title')"
      type="vertical"
      formProp="introduction"
    >
      <template #value>
        <PUTextarea
          id="introduction-editor"
          v-model="form.introduction"
          :placeholder="domain_t('introduction.placeholder')"
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
