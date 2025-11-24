<template>
  <view class="page-bg"></view>
  <view class="explore-page">
    <!-- Safe Area Top -->
    <SafeAreaInset position="top" />
    <!-- Main content -->
    <view class="main-content">
      <!-- Header -->
      <view class="uno-flex">
        <view class="header uno-flex-1">
          <!-- Refresh Button -->
          <PUButton
            class="refresh-btn"
            theme="Surface"
            type="OnlyIcon"
            size="Large"
            prefix-icon="i-mdi-refresh"
            @click="onRefreshClick"
          />

          <!-- Filters -->
          <view class="filters">
            <!-- Fixed Filters -->
            <view class="fixed-filters">
              <!-- Geo Element Filter -->
              <PUButton
                class="pr-geo-ele-filter"
                theme="Surface"
                size="Large"
                prefix-icon="i-mdi-map"
                type="OnlyIcon"
                :toggled="currentFilter === 0"
                @click="onGeoFilterClick"
              />
              <!-- PR Type Filter -->
              <PUButton
                class="pr-type-filter"
                theme="Surface"
                size="Large"
                prefix-icon="i-mdi-bookmark-outline"
                text="搭子类型"
                :toggled="currentFilter === 1"
                @click="onPRTypeFilterClick"
              />
            </view>

            <!-- DISABLED TEMPORARILY Open Filters Button -->
            <!-- <PUButton
              class="open-filters-btn"
              theme="Surface"
              type="OnlyIcon"
              size="Large"
              prefix-icon="i-mdi-filter"
              @click="onOpenFiltersClick"
            /> -->
          </view>
        </view>
        <SafeAreaInset position="wxmp-menu" />
      </view>

      <!-- Geo Element -->
      <swiper
        class="pr-filters"
        :current="currentFilter"
        :disable-touch="true"
        :autoplay="false"
        :circular="false"
      >
        <swiper-item @touchmove.stop="true">
          <PRGeoElementFilter class="pr-filter" mapHeight="22vh" />
        </swiper-item>
        <swiper-item @touchmove.stop="true">
          <PRTypeFilter
            class="pr-filter"
            v-model="selectedPRTypes"
            @change="onPRTypesChange"
          />
        </swiper-item>
      </swiper>

      <!-- PR List -->
      <view class="pr-list">
        <PRCard
          v-for="pr in mockPartnerRequests"
          :key="pr._id"
          :partner-request="pr"
          :partners="mockPartners"
          type="Explore"
          @card-click="onCardClick"
          @join-click="onJoinClick"
          @copy-click="onCopyClick"
          @bookmark-click="onBookmarkClick"
        />
      </view>
    </view>
    <!-- TabBar Safe Area -->
    <SafeAreaInset position="tabBar" />
    <!-- Safe Area Bottom -->
    <SafeAreaInset position="bottom" />
  </view>
</template>

<script lang="ts">
import { TABBAR_PAGE_ID } from "@/data/enum";
import { syncTabBarIndex } from "@/utils/tabbar";

const MY_PAGE_ID = TABBAR_PAGE_ID.EXPLORE;

export default {
  name: MY_PAGE_ID,
};
</script>

<script setup lang="ts">
import { ref } from "vue";
import SafeAreaInset from "@/components/common/safeAreaInset.vue";
import PUButton from "@/components/common/PUButton/PUButton.vue";
import PRCard from "@/components/partner_request/PRCard/PRCard.vue";
import { PRType, PRStatus } from "@/business/partner_request";
import { PartnerRequest } from "@/business/partner_request/base";
import { AccountBaseProfile } from "@/business/account/base";
import { onShow } from "@dcloudio/uni-app";
import PRGeoElementFilter from "@/components/partner_request/PRGeoElementFilter/PRGeoElementFilter.vue";
import PRTypeFilter from "@/components/partner_request/PRTypeFilter/PRTypeFilter.vue";

// Mock data for partner requests
const mockPartnerRequests = ref<PartnerRequest[]>([
  PartnerRequest.parse({
    _id: 1,
    created_at: new Date(),
    created_by: "550e8400-e29b-41d4-a716-446655440000",
    type: PRType.RideHailing,
    status: PRStatus.Joinable,
    title: "从望京到三里屯，找网约车搭子",
    introduction: "晚上8点出发，预计9点到达，AA制分摊车费",
    chat: null,
    contract: 12345,
  }),
  PartnerRequest.parse({
    _id: 2,
    created_at: new Date(),
    created_by: "550e8400-e29b-41d4-a716-446655440001",
    type: PRType.Commute,
    status: PRStatus.Joinable,
    title: "通勤搭子：西二旗到望京",
    introduction: "每天早上8点出发，地铁+公交，欢迎加入",
    chat: null,
    contract: 12346,
  }),
  PartnerRequest.parse({
    _id: 3,
    created_at: new Date(),
    created_by: "550e8400-e29b-41d4-a716-446655440002",
    type: PRType.Travel,
    status: PRStatus.Joinable,
    title: "周末去香山爬山，找旅游搭子",
    introduction: "预计周六早上出发，带好水和零食，一起爬山聊天",
    chat: null,
    contract: 12347,
  }),
]);

// Mock partners data
const mockPartners = ref<AccountBaseProfile[]>([
  AccountBaseProfile.parse({
    id: "550e8400-e29b-41d4-a716-446655440000",
    nickname: "小明",
    avatar: "/static/icon/avatar1.png",
    gender: "male",
  }),
  AccountBaseProfile.parse({
    id: "550e8400-e29b-41d4-a716-446655440001",
    nickname: "小红",
    avatar: "/static/icon/avatar2.png",
    gender: "female",
    mbti: null,
  }),
  AccountBaseProfile.parse({
    id: "550e8400-e29b-41d4-a716-446655440002",
    nickname: "小刚",
    avatar: "/static/icon/avatar3.png",
    gender: "male",
    mbti: null,
  }),
]);

// Icon imports
const refreshIcon = "/static/icon/reset.png";
const bookmarkIcon = "/static/icon/bookmark.png";
const filterIcon = "/static/icon/filter-filled.png";

// Event handlers
const onRefreshClick = () => {
  console.log("Refresh button clicked");
  // TODO: Implement refresh functionality
};

// Swiper filter control: 0 -> GeoElement, 1 -> PRType
const currentFilter = ref<number>(0);
const selectedPRTypes = ref<PRType[]>([]);

const onPRTypeFilterClick = () => {
  currentFilter.value = 1;
};

const onGeoFilterClick = () => {
  currentFilter.value = 0;
};

const onPRTypesChange = () => {
  // Hook for when PR types change; integrate with list filtering in future
  console.log("PR types changed:", selectedPRTypes.value);
};

const onOpenFiltersClick = () => {
  console.log("Open filters button clicked");
  // TODO: Implement open filters functionality
};

// PR Card event handlers
const onCardClick = (partnerRequest: PartnerRequest) => {
  console.log("Card clicked:", partnerRequest);
  // TODO: Navigate to partner request detail page
};

const onJoinClick = (partnerRequest: PartnerRequest) => {
  console.log("Join clicked:", partnerRequest);
  // TODO: Implement join functionality
};

const onCopyClick = (partnerRequest: PartnerRequest) => {
  console.log("Copy clicked:", partnerRequest);
  // TODO: Implement copy functionality
};

const onBookmarkClick = (partnerRequest: PartnerRequest) => {
  console.log("Bookmark clicked:", partnerRequest);
  // TODO: Implement bookmark functionality
};

onShow(() => {
  syncTabBarIndex(MY_PAGE_ID);
});
</script>

<style scoped lang="scss" src="./explore.scss"></style>
