<script lang="ts">
export default {
  name: "PRDraftPicker",
  options: BasicComponentOptions,
};
</script>

<script lang="ts" setup>
import { BasicComponentOptions } from "@/utils/vue";
import { PartnerRequest } from "@/business/partner_request/base";
import PRCard from "../PRCard/PRCard.vue";
import { PRDraftPickerEmits, PRDraftPickerProps } from "./types";
import Placeholder from "@/components/common/placeholder.vue";
import PUScrollView from "@/components/common/PUScrollView/PUScrollView.vue";
import { useTranslate } from "@/locale/use";

const { dt } = useTranslate("partner_request.draft_picker");
const props = defineProps(PRDraftPickerProps);
const emit = defineEmits(PRDraftPickerEmits);

const { draftPRs, refresh } = PartnerRequest.useDraftPRs();
</script>

<template>
  <view :class="['pr-draft-picker', props.customClass]">
    <PUScrollView
      class="draft-list"
      direction="y"
      :edge-fade="props.fade ? 'auto' : undefined"
      :on-refresh="refresh"
    >
      <PRCard
        class="draft-item"
        v-for="(draft_id, index) in draftPRs"
        :key="`draft-${index}`"
        @tap="emit('select', draft_id)"
        type="Draft"
        :pr-id="draft_id"
      />
      <Placeholder :text="dt('placeholder.no_drafts')" v-if="!draftPRs.length" />
    </PUScrollView>
  </view>
</template>

<style lang="scss" scoped src="./PRDraftPicker.scss"></style>
