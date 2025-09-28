<template>
  <view class="page-bg" />
  <view class="pr-detail-page">
    <!-- Safe Area Top -->
    <SafeAreaInset position="top" />

    <!-- Header -->
    <SafeArea position="wxmp-menu">
      <view class="header">
        <pageBack size="large" />
        <view class="ops">
          <PUButton
            class="fork-btn"
            theme="Surface"
            type="OnlyIcon"
            size="Large"
            prefix-icon="i-mdi-content-copy"
            @click="onForkClick"
          />
          <PUButton
            class="bookmark-btn"
            theme="Surface"
            size="Large"
            prefix-icon="i-mdi-bookmark-outline"
            :text="dt('header.favorite')"
            @click="onBookmarkClick"
          />
        </view>
      </view>
    </SafeArea>

    <!-- Scrollable Content -->
    <view class="content">
      <!-- Partners -->
      <view class="section partners">
        <text class="section-title">{{ dt("partners.title") }}</text>
        <view class="roles">
          <!-- Partner item 1 -->
          <view class="role-card">
            <view class="meta">
              <text class="mono id">#1</text>
              <text class="name">打车</text>
            </view>
            <view class="right">
              <view class="player">
                <view class="avatar" />
                <text class="player-name">蓝汁酱</text>
                <text class="hint">{{ dt("partners.status.playing") }}</text>
              </view>
              <view class="chevron" />
            </view>
          </view>
          <!-- Partner item 2 -->
          <view class="role-card">
            <view class="meta">
              <text class="mono id">#2</text>
              <text class="name">乘客</text>
            </view>
            <view class="right">
              <text class="hint">{{ dt("partners.status.free") }}</text>
              <view class="chevron" />
            </view>
          </view>
        </view>
      </view>

      <!-- Route -->
      <view class="section route">
        <text class="section-title">{{ dt("route.title") }}</text>
        <view class="map-preview">
          <!-- Placeholder for map preview image -->
        </view>

        <!-- Datetime summary -->
        <view class="date-and-type">
          <text class="date">2025.09.03</text>
          <text>出发</text>
        </view>

        <!-- Simple route list (placeholder) -->
        <view class="route-list">
          <view class="route-item">
            <view class="type-indicator start" />
            <view class="content">
              <text class="address">广东外语外贸大学南校区3号门</text>
              <view class="meta">
                <text class="time mono">23:16 ~ HH:MM</text>
                <text class="sep">·</text>
                <text class="hint">不可提前</text>
              </view>
            </view>
          </view>

          <view class="route-item">
            <view class="type-indicator waypoint" />
            <text class="address">大学城北站（E口）</text>
          </view>

          <view class="route-item">
            <view class="type-indicator end" />
            <view class="content">
              <text class="address">广州白云机场T3航站楼</text>
              <view class="meta">
                <text class="time mono">00:56 ~ HH:MM</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="drawer-placeholder"></view>

    <!-- Home Indicator & Safe Bottom -->
    <SafeAreaInset position="bottom" />

    <!-- Drawer (metadata + operations) -->
    <view class="drawer">
      <view class="page-metadata">
        <view class="tags">
          <PUTag :text="t('partner_request.status.joinable')" />
          <PUTag :text="t('partner_request.type.ride_hailing')" />
        </view>
        <view class="identifier">
          <text class="id font-mono">#128</text>
          <text class="title">搭子请求</text>
        </view>
        <view class="summary">
          <text class="title">广外南 - 白云机场</text>
          <text class="description">赶时间，不要拖</text>
        </view>
      </view>
      <view class="operations">
        <PUButton
          class="apply-btn"
          theme="Primary"
          :text="dt('drawer.apply')"
          @click="onApplyClick"
        />
      </view>
    </view>
  </view>
</template>

<script lang="ts">
export default {
  name: "PRDetail",
};
</script>

<script setup lang="ts">
import SafeAreaInset from "@/components/common/safeAreaInset.vue";
import PUButton from "@/components/common/PUButton/PUButton.vue";
import PUTag from "@/components/common/PUTag/PUTag.vue";
import pageBack from "@/components/common/pageBack/pageBack.vue";
import { useTranslate } from "@/locale/use";
import { ref } from "vue";
import * as v from "valibot";
import { onLoad } from "@dcloudio/uni-app";
import SafeArea from "@/components/common/safeArea/safeArea.vue";

const { dt, t } = useTranslate("partner_request.detail");

// Refs

const propsSchema = v.object({
  id: v.pipe(
    v.string(),
    v.transform((value) => parseInt(value))
  ),
});
const props = ref<v.InferOutput<typeof propsSchema>>();

// Handlers
const onForkClick = () => {};
const onBookmarkClick = () => {};
const onApplyClick = () => {};

// Lifecycle

onLoad((query) => {
  props.value = v.parse(propsSchema, query);
});
</script>

<style scoped lang="scss" src="./detail.scss"></style>
