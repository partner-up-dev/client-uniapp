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

        <view role="button" class="chevron" @click.stop="onToggleClick">
          <text :class="chevronIcon"></text>
        </view>
      </view>
    </view>

    <view v-if="expand" class="content">
      <text class="rule">{{ roleRule }}</text>
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
import { computed, ref, watch, onMounted } from "vue";
import { BasicComponentOptions } from "@/utils/vue";
import { useOptionalVModel } from "@/composables/props";
import { partnerProps, partnerEmits } from "./Partner";
import { useTranslate } from "@/locale/use";
import Account from "@/components/account/account/account.vue";
import { PartnerRole } from "@/business/partner_request/partner";
import { useAccountStore } from "@/store/account";

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
const roleRule = computed(
  () => role.value?.description ?? "角色的权利与义务明细"
);

const accountStore = useAccountStore();
const isPlayingByYou = computed(
  () => !!props.partner.player && accountStore.isMe(props.partner.player)
);
const isPlayingByOther = computed(
  () => !!props.partner.player && !isPlayingByYou.value
);
const isPlaying = computed(() => !!props.partner.player);

const typeClass = computed(() => "type-default");

const chevronIcon = computed(() =>
  expand.value ? "i-mdi-chevron-up" : "i-mdi-chevron-down"
);

// Localized fallbacks
const tPlayed = "扮演";
const tWaiting = "等待扮演";
const tPlayedByYou = "由你扮演";

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
</script>

<style lang="scss" scoped src="./Partner.scss"></style>
