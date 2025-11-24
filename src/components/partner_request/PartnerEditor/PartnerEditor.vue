<template>
  <view class="partner-editor">
    <view class="left">
      <view v-if="hasRole" class="play-button" @click="onPlayButtonClick">
        <text :class="playIconClass"></text>
      </view>
      <view class="role" @click="onRoleTextClick">
        <text class="text">{{ leftPrefix }}</text>
        <text class="role-name">{{ rightText }}</text>
      </view>
    </view>

    <view class="right">
      <view class="remove-button" @click="onRemoveClick">
        <text class="i-mdi-close"></text>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
export default {
  name: "PartnerEditor",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import { BasicComponentOptions } from "@/utils/vue";
import { useOptionalVModel } from "@/composables/props";
import { partnerEditorProps, partnerEditorEmits } from "./PartnerEditor";
import { useTranslate } from "@/locale/use";
import { PartnerRole } from "@/business/partner_request/partner";
import { useAccountStore } from "@/store/account";

const props = defineProps(partnerEditorProps);
const emit = defineEmits(partnerEditorEmits);

const { dt } = useTranslate("partner_request.partner_editor");
const accountStore = useAccountStore();

// V-models
const role = useOptionalVModel<number | null>({
  props,
  emit,
  modelName: "role",
});

const player = useOptionalVModel<string | null>({
  props,
  emit,
  modelName: "player",
});

// Get role information
const { partnerRole, bindId: bindRoleId } = PartnerRole.use(
  props.role ?? undefined
);
bindRoleId(() => props.role);

// Computed properties
const hasRole = computed(() => props.role !== null);

const isPlayingByMe = computed(() => {
  return props.player !== null && accountStore.isMe(props.player);
});

const leftPrefix = computed(() => {
  if (isPlayingByMe.value) {
    return dt("you_will_play");
  }
  return dt("need_one");
});

const rightText = computed(() => {
  if (!hasRole.value) {
    return dt("click_to_select");
  }
  return partnerRole.value?.name ?? "";
});

const playIconClass = computed(() => {
  return isPlayingByMe.value
    ? "i-mdi-hand-front-right"
    : "i-mdi-hand-front-right-outline";
});

// Event handlers
const onRoleTextClick = () => {
  emit("selectRole");
};

const onPlayButtonClick = () => {
  if (isPlayingByMe.value) {
    player.value = null;
  } else {
    player.value = accountStore.myId ?? null;
  }
};

const onRemoveClick = () => {
  emit("remove");
};
</script>

<style lang="scss" scoped src="./PartnerEditor.scss"></style>
