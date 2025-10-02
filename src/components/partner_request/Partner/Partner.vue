<template>
  <view
    class="partner"
    :class="[
      stateClass,
      typeClass,
      { 'is-played': isPlayingByOther, 'is-you': isPlayingByYou },
    ]"
  >
    <!-- Header: always visible -->
    <view class="header" :class="[typeClass]">
      <view class="left">
        <view class="id">
          <text class="id-text">{{ idText }}</text>
        </view>
        <text class="role-name">{{ roleName }}</text>
      </view>

      <view class="right">
        <template v-if="type === 'Default'">
          <view class="player" v-if="isPlaying">
            <Account v-if="isPlayingByOther" size="xSmall" />
            <text class="text">{{ dt("status.playing") || tPlayed }}</text>
          </view>
          <view class="player" v-else-if="isPlayingByYou">
            <text class="text">{{
              dt("status.playing_by_you") || tPlayedByYou
            }}</text>
          </view>
          <view class="player" v-else>
            <text class="text">{{ dt("status.free") || tWaiting }}</text>
          </view>
        </template>

        <view
          v-if="type === 'Default'"
          role="button"
          class="chevron"
          @click.stop="onToggleClick"
        >
          <text :class="chevronIcon"></text>
        </view>
        <PUButton
          v-else-if="type === 'Editor'"
          theme="Surface"
          type="OnlyIcon"
          size="Small"
          prefix-icon="i-mdi-delete-outline"
          @click.stop="onDeleteClick"
        />
      </view>
    </view>

    <view v-if="expand || type === 'Editor'" class="content">
      <text class="rule">{{ roleRule }}</text>

      <PUTextarea
        v-if="type === 'Editor'"
        v-model="rationale"
        :placeholder="dt('rationale_editor.placeholder')"
        :height="28"
        :focusHeight="56"
      />
    </view>
  </view>
</template>

<script lang="ts">
export default {
  name: "Partner",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { BasicComponentOptions } from "@/utils/vue";
import { useOptionalVModel } from "@/composables/props";
import { partnerProps, partnerEmits } from "./Partner";
import { useTranslate } from "@/locale/use";
import Account from "@/components/account/account/account.vue";
import { PartnerRole } from "@/business/partner_request/partner";
import { useAccountStore } from "@/store/account";
import { PartnerSubApplication } from "@/business/partner_request/application";
import PUTextarea from "@/components/common/PUTextarea/PUTextarea.vue";
import PUButton from "@/components/common/PUButton/PUButton.vue";

const props = defineProps(partnerProps);
const emit = defineEmits(partnerEmits);

const { dt } = useTranslate("partner_request.partner");
const { partnerRole } = PartnerRole.use(props.partner.role);
const role = computed((): PartnerRole | undefined => {
  if (props.partnerRole) return props.partnerRole;
  return partnerRole.value;
});

const idText = computed(() => `#${props.partner._id}`);
const roleName = computed(() => role.value?.name ?? "角色名称");
const roleRule = computed(() => role.value?.rule ?? "角色的权利与义务明细");

const accountStore = useAccountStore();
const isPlayingByYou = computed(
  () => !!props.partner.player && accountStore.isMe(props.partner.player)
);
const isPlayingByOther = computed(
  () => !!props.partner.player && !isPlayingByYou.value
);
const isPlaying = computed(() => !!props.partner.player);

const typeClass = computed(() =>
  props.type === "Editor" ? "type-editor" : "type-default"
);

const chevronIcon = computed(() =>
  expand.value ? "i-mdi-chevron-up" : "i-mdi-chevron-down"
);

// Localized fallbacks
const tPlayed = "扮演";
const tWaiting = "等待扮演";
const tPlayedByYou = "由你扮演";

const rationale = ref("");

// Make expand v-model optional via composable
const expand = useOptionalVModel<boolean>({
  props,
  emit,
  modelName: "expand",
});

const stateClass = computed(() =>
  expand.value ? "partner--expand" : "partner--fold"
);

// Handlers
const onToggleClick = () => {
  expand.value = !expand.value;
};

const onDeleteClick = () => {
  emit("delete", props.partner);
};

// Methods

function getForm(): PartnerSubApplication {
  return new PartnerSubApplication({
    role: props.partner.role,
    rationale: rationale.value.trim() || null,
  });
}

defineExpose({ getForm });
</script>

<style lang="scss" scoped src="./Partner.scss"></style>
