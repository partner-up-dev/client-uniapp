<script lang="ts">
import { PAGE_ID } from "@/data/enum";
import { navigate } from "@/utils/vendor";
import { Chat } from "@/business/communication/chat";
import PageBack from "@/components/common/pageBack/pageBack.vue";

const PROFILE_PAGE_ID = PAGE_ID.PROFILE;

export default {
  name: PROFILE_PAGE_ID,
};
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { useTranslate } from "@/locale/use";
import { AccountBaseProfile } from "@/business/account/base";
import SafeAreaInset from "@/components/common/safeAreaInset.vue";
import Avatar from "@/components/common/avatar/avatar.vue";
import PUButton from "@/components/common/PUButton/PUButton.vue";
import dayjs from "dayjs";
import { DEFAULT_ACCOUNT_WALLPAPER } from "@/data/const";
import * as v from "valibot";

const { dt } = useTranslate("account");

// 页面参数 Schema
const propsSchema = v.object({
  id: v.pipe(
    v.string(),
    v.transform((value) => value)
  ),
});

// 页面参数
const pageProps = ref<v.InferOutput<typeof propsSchema>>();

// 用户资料
const { baseProfile, loading } = AccountBaseProfile.use(pageProps.value?.id);

// 计算属性
const userNickname = computed(() => {
  return (
    baseProfile.value?.nickname || dt("profile_metadata.nickname.placeholder")
  );
});

const userAvatar = computed(() => {
  return baseProfile.value?.avatar || undefined;
});

const userWallpaper = computed((): string => {
  return baseProfile.value?.wallpaper || DEFAULT_ACCOUNT_WALLPAPER;
});

const joinedDate = computed(() => {
  if (!baseProfile.value?.created_at) return "";
  return dayjs(baseProfile.value.created_at).format("YYYY-MM-DD");
});

const simpleProfileStyle = computed(() => {
  return {
    backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0) 70%, var(--background-color) 96%), url(${userWallpaper.value})`,
  };
});

// 方法
function onDirectMessageClick() {
  Chat.getDMWith(pageProps.value!.id).then((dmChat) => {
    navigate({
      page_id: PAGE_ID.CHAT,
      params: {
        id: String(dmChat._id),
      },
    });
  });
}

// 生命周期
onLoad((query) => {
  pageProps.value = v.parse(propsSchema, query);
});
</script>

<template>
  <view class="page-bg"></view>
  <view class="profile-page">
    <view class="header">
      <SafeAreaInset position="top" />
      <PageBack size="Medium" icon="i-mdi-arrow-left" class="back-button" />
    </view>
    <view class="profile-page__main">
      <!-- 用户资料卡片 -->
      <view class="simple-profile" :style="simpleProfileStyle">
        <view class="simple-profile__content">
          <Avatar :src="userAvatar" size="xLarge" radius="none" />

          <view class="simple-profile__info">
            <text class="joined-at">
              {{ joinedDate }} {{ dt("profile_metadata.created_at.suffix") }}
            </text>
            <text class="nickname">
              {{ userNickname }}
            </text>
          </view>
        </view>
      </view>

      <!-- 操作按钮区域 -->
      <view class="profile-page__operations">
        <PUButton
          :text="dt('profile.operation.chat_with_me')"
          prefix-icon="i-mdi-message-text-outline"
          theme="PrimaryContainer"
          type="WithText"
          size="Small"
          @click="onDirectMessageClick"
        />
      </view>
    </view>

    <!-- 底部安全区域插入 -->
    <SafeAreaInset position="bottom" />
  </view>
</template>

<style scoped lang="scss" src="./profile.scss"></style>
