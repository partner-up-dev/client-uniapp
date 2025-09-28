<template>
  <view class="partners">
    <view class="avatars">
      <!-- 显示的头像 -->
      <view
        v-for="(accountId, index) in props.partners"
        :key="accountId"
        class="avatar"
        :style="{ zIndex: props.partners.length - index }"
      >
        <Avatar :src="avatarSrc(accountId)" size="small" />
      </view>

      <view v-if="props.joinable" class="joinable-indicator" :style="{ zIndex: 0 }">
        <text class="text">+{{ props.leftJoinable }}</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
export default {
  name: "Partners",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { reactive } from "vue";
import Avatar from "@/components/common/avatar/avatar.vue";
import { partnersProps, partnersEmits } from "./partners";
import { BasicComponentOptions } from "@/utils/vue";
import { AccountBaseProfile } from "@/business/account";
import type { AccountRef } from "@/business/account";

const props = defineProps(partnersProps);
const emit = defineEmits(partnersEmits);

// 头像缓存
const avatarCache = reactive<Record<AccountRef, string | undefined>>({});

// 获取头像源
const avatarSrc = (accountId: AccountRef): string | undefined => {
  if (avatarCache[accountId] !== undefined) {
    return avatarCache[accountId];
  }

  // 异步获取头像
  AccountBaseProfile.get(accountId)
    .then((profile) => {
      avatarCache[accountId] = profile.avatar || undefined;
    })
    .catch(() => {
      avatarCache[accountId] = undefined;
    });

  return undefined; // 初始返回 undefined，待异步加载完成
};
</script>

<style lang="scss" scoped src="./partners.scss"></style>
