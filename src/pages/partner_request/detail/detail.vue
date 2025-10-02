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
      <!-- Route -->
      <view class="section route">
        <text class="section-title">{{ dt("route.title") }}</text>
        <PRRoute :route="mockRoute" />
      </view>

      <!-- Partners -->
      <view class="section partners">
        <text class="section-title">{{ dt("partners.title") }}</text>
        <view class="roles">
          <Partner
            v-for="(partner, index) in partners"
            :key="index"
            :partner="partner"
          />
        </view>
      </view>

      <view class="drawer-placeholder"></view>
    </view>

    <view class="drawer-placeholder"></view>

    <!-- Home Indicator & Safe Bottom -->
    <SafeAreaInset position="bottom" />

    <!-- Drawer (metadata + operations) -->
    <view
      class="drawer"
      id="pr-drawer"
      :class="{ expanded: drawerExpanded }"
      :style="drawerStyle"
      @transitionend="drawerTransitioning = false"
    >
      <view
        class="page-metadata"
        @touchstart.stop="onHandleTouchStart"
        @touchmove.stop="onHandleTouchMove"
        @touchend.stop="onHandleTouchEnd"
        @touchcancel.stop="onHandleTouchEnd"
      >
        <view class="tags">
          <PUTag :text="t('partner_request.status.joinable')" />
          <PUTag :text="t('partner_request.type.ride_hailing')" />
        </view>
        <view class="identifier">
          <text class="id">#128</text>
          <text class="title">搭子请求</text>
        </view>
        <view class="summary">
          <text class="title">广外南 - 白云机场</text>
          <text class="description">赶时间，不要拖</text>
        </view>
      </view>
      <view
        :style="drawerTransitioning ? { flex: 1 } : { flex: 0 }"
        v-if="!drawerExpanded"
      ></view>
      <view class="content" v-show="drawerExpanded">
        <PRApplyForm
          :PRId="props?.id || 0"
          :externalOps="true"
          ref="PRApplyFormRef"
        />
      </view>
      <view class="operations">
        <PUButton
          v-if="drawerExpanded"
          theme="SurfaceOutlined"
          :text="dt('drawer.add_role')"
          @click="onAddRoleClick"
        />
        <PUButton
          class="apply-btn"
          theme="Primary"
          :text="drawerExpanded ? dt('drawer.submit_apply') : dt('drawer.apply')"
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
import Partner from "@/components/partner_request/Partner/Partner.vue";
import { useTranslate } from "@/locale/use";
import { computed, getCurrentInstance, onMounted, ref } from "vue";
import * as v from "valibot";
import { onLoad } from "@dcloudio/uni-app";
import SafeArea from "@/components/common/safeArea/safeArea.vue";
import { PartnerRequest } from "@/business/partner_request/base";
import PRRoute from "@/components/partner_request/PRRoute/PRRoute.vue";
import { Route, RouteItemDatetime } from "@/business/base/route";
import { getWindowInfo } from "@/utils/vendor";
import { makeNumberPX } from "@/utils/style";
import PRApplyForm from "@/components/partner_request/PRApplyForm/PRApplyForm.vue";
import type { TouchEvent } from "@uni-helper/uni-app-types";

const { dt, t } = useTranslate("partner_request.detail");

const propsSchema = v.object({
  id: v.pipe(
    v.string(),
    v.transform((value) => parseInt(value))
  ),
});
const props = ref<v.InferOutput<typeof propsSchema>>();

const { partners, bindPRId } = PartnerRequest.usePartners(props.value?.id); // TEST need to verify reactivity
bindPRId(() => props.value?.id);

// TODO: Replace with real route data when API is ready
const mockRoute = new Route([
  {
    datetime: new RouteItemDatetime({
      datetime: new Date("2024-09-24 23:15:00"),
      time: null,
      bring_ahead: null,
      put_off: null,
    }),
    location: "a128acc5d8153c97bb771fccb5efe990",
  },
  {
    datetime: new RouteItemDatetime({
      datetime: null,
      time: null,
      bring_ahead: null,
      put_off: null,
    }),
    location: "1c18c2e3b8dc6f0ffb83b68810bbb29d",
  },
]);
// Handlers
const onForkClick = () => {};
const onBookmarkClick = () => {};
const onApplyClick = () => {
  if (!drawerExpanded.value) {
    expandDrawer();
  } else {
    PRApplyFormRef.value?.submit();
  }
};
const onAddRoleClick = () => {
  PRApplyFormRef.value?.toggleRoleDrawer();
};

// Drawer state
const windowInfo = getWindowInfo();
const HEADER_HEIGHT_PX = 60; // matches header height

const drawerExpanded = ref(false);
const drawerTransitioning = ref(false);
const drawerTopCollapsed = ref<number | null>(null); // Measured collapsed top (px) of the drawer after first render
const SWIPE_THRESHOLD_PX = 30; // min distance to trigger toggle

let touchStartY = 0;
let lastTouchY = 0;

const drawerStyle = computed(() => {
  const expandedTop = HEADER_HEIGHT_PX + windowInfo.safeAreaInsets.top;
  if (drawerExpanded.value) {
    return { top: makeNumberPX(expandedTop) };
  }
  if (drawerTopCollapsed.value != null) {
    return { top: makeNumberPX(drawerTopCollapsed.value) };
  }
  return {};
});

function expandDrawer() {
  drawerExpanded.value = true;
  drawerTransitioning.value = true;
}

function collapseDrawer() {
  drawerExpanded.value = false;
  drawerTransitioning.value = true;
}

const onHandleTouchStart = (e: TouchEvent) => {
  const y = e.touches[0].clientY ?? e.changedTouches[0].clientY ?? 0;
  touchStartY = y;
  lastTouchY = y;
};

const onHandleTouchMove = (e: TouchEvent) => {
  // No smooth dragging required; just record last Y
  const y = e.touches[0].clientY ?? e.changedTouches[0].clientY ?? 0;
  lastTouchY = y;
};

const onHandleTouchEnd = () => {
  const delta = lastTouchY - touchStartY;
  if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return; // ignore tiny drags
  if (delta > 0) {
    // drag down -> collapse
    collapseDrawer();
  } else {
    // drag up -> expand
    expandDrawer();
  }
};

const PRApplyFormRef = ref<InstanceType<typeof PRApplyForm> | null>(null);

// Lifecycle

onLoad((query) => {
  props.value = v.parse(propsSchema, query);
});

// Measure the collapsed top after initial render to support `transition: top`
const instance = getCurrentInstance();
function measureDrawerCollapsedTop() {
  return new Promise<void>((resolve) => {
    // Use a small delay to ensure layout is ready
    setTimeout(() => {
      const q = uni.createSelectorQuery();
      if (instance?.proxy) q.in(instance.proxy as any);
      q.select("#pr-drawer")
        .boundingClientRect((rect) => {
          const r = rect as any;
          if (r && typeof r.top === "number") {
            drawerTopCollapsed.value = r.top as number;
          }
          resolve();
        })
        .exec();
    }, 0);
  });
}

onMounted(() => {
  // Ensure we measure while collapsed
  drawerExpanded.value = false;
  measureDrawerCollapsedTop();
});
</script>

<style scoped lang="scss" src="./detail.scss"></style>
