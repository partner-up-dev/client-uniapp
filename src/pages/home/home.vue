<script lang="ts">
import { PAGE_ID, TABBAR_PAGE_ID } from "@/data/enum";
import { PRL1Type } from "@/business/partner_request";
import { navigate } from "@/utils/vendor";
import { syncTabBarIndex } from "@/utils/tabbar";

const MY_PAGE_ID = TABBAR_PAGE_ID.HOME;

export default {
  name: MY_PAGE_ID,
};
</script>

<script setup lang="ts">
import { useTranslate } from "@/locale";
import { computed, ref } from "vue";
import { AccountBaseProfile } from "@/business/account/base";
import { onLoad, onShow } from "@dcloudio/uni-app";
import SafeAreaInset from "@/components/common/safeAreaInset.vue";
import Snackbar from "@/components/common/snackbar/snackbar.vue";
import PRTypePicker from "@/components/partner_request/PRTypePicker/PRTypePicker.vue";

const { dt } = useTranslate("home");
const { baseProfile } = AccountBaseProfile.use();

// 响应式数据
// const need_new_user_onboarding = ref(false);

// 计算属性
const greetingPeriod = computed(() => {
  const hour = new Date().getHours();
  if (hour >= 7 && hour < 11) return "morning";
  if (hour >= 11 && hour < 13) return "noon";
  if (hour >= 13 && hour < 18) return "afternoon";
  return "evening";
});

const isOngoingPR = computed((): boolean => {
  // TODO: 实际逻辑应该检查用户是否有进行中的搭子请求
  // 这里可以检查 store 中的搭子请求状态
  return true; // 临时设为 false，避免在没有数据时显示
});

const userNickname = computed(() => {
  return baseProfile.value?.nickname || dt("welcome.nickname");
});

// 方法
function onCheckJoinablePRClick() {
  // TODO: 导航到我的搭子请求页面
  console.log("查看正在进行的搭子请求");
}

function onExploreClick() {
  navigate({ page_id: PAGE_ID.EXPLORE });
}

function onPartnerTypeSelect(type: PRL1Type) {
  navigate({
    path: `/pages/partner_request/create_${type}/create_${type}`,
  });
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
  <view class="uno-bg-surface uno-min-h-screen uno-box-border space-p-x-med">
    <!-- 状态栏占位 -->
    <SafeAreaInset position="top" />

    <!-- 主要内容 -->
    <view class="uno-flex uno-flex-col uno-gap-lg uno-pt-[64px] uno-pb-[34px]">
      <!-- 问候语区域 -->
      <view
        class="uno-flex uno-items-center uno-justify-between font-headline-large"
      >
        <view class="uno-flex uno-items-center uno-gap-sm">
          <text class="uno-text-surface-on">{{
            dt(`welcome.greet.${greetingPeriod}`)
          }}</text>
          <text class="uno-text-tertiary">{{ userNickname }}</text>
        </view>
        <view class="uno-text-center flex-1">👋</view>
      </view>

      <!-- 搭子请求主区域 -->
      <view class="uno-flex uno-flex-col uno-gap-sm">
        <view class="uno-text-[32px] font-headline-large uno-text-surface-on">{{
          dt("cpr.title")
        }}</view>

        <!-- 正在寻找搭子的提示条 -->
        <Snackbar
          v-if="isOngoingPR"
          :title="dt('cpr.waiting.title')"
          @click="onCheckJoinablePRClick"
        />

        <!-- 搭子类型卡片列表 -->
        <PRTypePicker
          mode="horizontal-card"
          option-mode="l1"
          @select="onPartnerTypeSelect"
        />
      </view>

      <!-- 发现搭子区域 -->
      <view
        class="uno-flex uno-items-center uno-justify-between uno-w-full"
        @click="onExploreClick"
      >
        <text class="font-headline-large uno-text-surface-on">{{
          dt("prd.title")
        }}</text>
        <view class="uno-flex uno-items-center uno-justify-center">
          <text
            class="font-headline-large uno-text-secondary i-mdi-arrow-forward"
          ></text>
        </view>
      </view>
    </view>

    <!-- 底部安全区域 -->
    <SafeAreaInset position="bottom" />
  </view>
</template>

<style lang="scss" scoped>
// 使用 UnoCSS 进行大部分样式控制，这里只保留必要的样式调整
</style>
