<script lang="ts">
import { TABBAR_PAGE_ID } from "@/data/enum";
import { syncTabBarIndex } from "@/utils/tabbar";
import { DEFAULT_ACCOUNT_WALLPAPER } from "@/data/const";

const MY_PAGE_ID = TABBAR_PAGE_ID.ME;

export default {
  name: MY_PAGE_ID,
};
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { useTranslate } from "@/locale/use";
import { AccountBaseProfile, Account } from "@/business/account/base";
import SafeAreaInset from "@/components/common/safeAreaInset.vue";
import Avatar from "@/components/common/avatar/avatar.vue";
import Cell from "@/components/common/cell/cell.vue";
import PUButton from "@/components/common/PUButton/PUButton.vue";
import dayjs from "dayjs";

const { dt } = useTranslate("me");
const { baseProfile } = AccountBaseProfile.use();

// 登录状态
const isLoggedIn = computed(() => {
  return !!baseProfile.value;
});

// 计算属性
const userNickname = computed(() => {
  return baseProfile.value?.nickname || dt("user.placeholder_nickname");
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
    height: isLoggedIn.value ? "50vh" : "22vh",
    backgroundImage:
      (isLoggedIn.value
        ? "linear-gradient(to top, var(--background-color), transparent),"
        : "") + `url(${userWallpaper.value})`,
  };
});

// 方法
function onHelpClick() {
  console.log("帮助");
  // TODO: 导航到帮助页面或显示帮助信息
}

function onLoginClick() {
  console.log("登录");
  // TODO: 实现登录逻辑
  Account.login(true);
}

function onEditProfileClick() {
  console.log("编辑资料");
  // TODO: 导航到编辑资料页面
}

function onLogoutClick() {
  console.log("登出");
  // TODO: 实现登出逻辑
}

function onMyPartnerRequestsClick() {
  console.log("我的搭子请求");
  // TODO: 导航到我的搭子请求页面
}

// 生命周期
onLoad(() => {
  // 页面加载时的逻辑
});

onShow(() => {
  // 页面显示时的逻辑
  syncTabBarIndex(MY_PAGE_ID);
});
</script>

<template>
  <view class="page-bg"></view>
  <view class="me-page">
    <!-- 状态栏占位 -->

    <!-- 未登录状态 -->
    <view class="me-page__main">
      <SafeAreaInset position="top" />

      <text class="me-page__welcome" v-if="!isLoggedIn">
        {{ dt("welcome") }}
      </text>

      <!-- SimpleProfile 背景图片 -->
      <view class="profile-metadata" :style="simpleProfileStyle">
        <view class="flex flex-row justify-between items-center space-p-x-med">
          <Avatar :src="userAvatar" size="xLarge" radius="none" />

          <view class="flex flex-col items-end">
            <text class="joined-at">
              {{ joinedDate }} {{ dt("user.joined_at") }}
            </text>
            <text class="nickname">
              {{ userNickname }}
            </text>
          </view>
        </view>
      </view>

      <view class="me-page__content">
        <!-- 我的搭子请求 -->
        <Cell
          :type="'default'"
          :title="dt('my_partner_requests.title')"
          :subtitle="dt('my_partner_requests.subtitle')"
          :show-arrow="true"
          size="medium"
          @click="onMyPartnerRequestsClick"
        />

        <!-- 操作按钮区域 -->
        <view class="me-page__operations">
          <PUButton
            v-if="isLoggedIn"
            :text="dt('actions.edit_profile')"
            prefix-icon="i-mdi-pencil-outline"
            theme="Surface"
            type="WithText"
            size="Small"
            @click="onEditProfileClick"
          />
          <PUButton
            v-if="isLoggedIn"
            :text="dt('actions.logout')"
            prefix-icon="i-mdi-logout"
            theme="Surface"
            type="WithText"
            size="Small"
            @click="onLogoutClick"
          />
          <PUButton
            v-if="!isLoggedIn"
            :text="dt('actions.login')"
            prefix-icon="i-mdi-login"
            theme="PrimaryContainer"
            type="WithText"
            size="Small"
            @click="onLoginClick"
          />
          <PUButton
            :text="dt('actions.help')"
            prefix-icon="i-mdi-help-circle-outline"
            theme="Surface"
            :type="isLoggedIn ? 'WithText' : 'OnlyIcon'"
            size="Small"
            @click="onHelpClick"
          />
        </view>
      </view>
    </view>

    <!-- TabBar 安全区域插入 -->
    <SafeAreaInset position="tabBar" />
    <!-- 底部安全区域插入 -->
    <SafeAreaInset position="bottom" />
  </view>
</template>

<style scoped lang="scss" src="./me.scss"></style>
