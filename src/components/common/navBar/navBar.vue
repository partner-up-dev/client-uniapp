<script lang="ts">
export default {
  name: "NavBar",
  options: {
    styleIsolation: "isolated",
  },
};
</script>

<script setup lang="ts">
import { navBarProps, navBarEmits } from "./navBar";
import safeAreaInset from "@/components/common/safeAreaInset.vue";
import pageBack from "@/components/common/pageBack/pageBack.vue";

const props = defineProps(navBarProps);
const emit = defineEmits(navBarEmits);

function onRefreshClick() {
  emit("refresh");
}

function onMoreClick() {
  emit("more");
}
</script>

<template>
  <view class="nav-bar__container">
    <safeAreaInset position="top" />

    <!-- Header -->
    <view class="nav-bar">
      <view class="nav-bar__left">
        <!-- 返回按钮 -->
        <pageBack size="Small" icon="i-mdi-arrow-left" />
        <!-- 标题 -->
        <text class="nav-bar__title">{{ title }}</text>
      </view>

      <view class="nav-bar__right">
        <!-- 刷新按钮 -->
        <view
          v-if="showRefresh"
          class="nav-bar__icon-button"
          @click="onRefreshClick"
        >
          <text class="i-mdi-refresh nav-bar__icon"></text>
        </view>
        <!-- 更多按钮 -->
        <view v-if="showMore" class="nav-bar__icon-button" @click="onMoreClick">
          <text class="i-mdi-dots-vertical nav-bar__icon"></text>
        </view>
        <safeAreaInset position="wxmp-menu" />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped src="./navBar.scss"></style>
