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
          <template v-if="Iam !== 'partner'">
            <PUButton
              theme="Surface"
              type="OnlyIcon"
              size="Large"
              prefix-icon="i-mdi-content-copy"
              @click="onForkClick"
            />
            <PUButton
              theme="Surface"
              size="Large"
              prefix-icon="i-mdi-bookmark-outline"
              :text="dt('header.favorite')"
              @click="onBookmarkClick"
            />
          </template>
          <template v-else>
            <PUButton
              theme="Surface"
              type="OnlyIcon"
              size="Large"
              prefix-icon="i-mdi-chat-outline"
              :dot="hasUnread"
            />
            <PUButton
              theme="Surface"
              type="OnlyIcon"
              size="Large"
              prefix-icon="i-mdi-share-variant-outline"
            />
            <PUButton
              theme="Surface"
              type="OnlyIcon"
              size="Large"
              prefix-icon="i-mdi-dots-vertical"
            />
          </template>
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
      <view
        class="content"
        :style="{ display: drawerExpanded ? 'flex' : 'none' }"
      >
        <template v-if="Iam === 'passby'">
          <PRApplyForm
            :PRId="props?.id || 0"
            :externalOps="true"
            ref="PRApplyFormRef"
          />
        </template>
        <template v-if="Iam === 'applicant'">
          <!-- SubApplications -->
          <view class="flex flex-col gap-sm">
            <view>
              <view class="section-title">
                {{ dt("sub_applications.title") }}
              </view>
              <view class="section-subtitle">
                {{ dt("sub_applications.submitted_at") }}
                <text class="space-m-r-xs">
                  {{ dayjs(myApplication?.created_at).format("MM月DD日 HH:mm") }}
                </text>
              </view>
            </view>
            <SubApplication
              v-for="(subApplication, index) in myApplication?.sub_applications"
              :key="index"
              :sub-application="subApplication"
            />
          </view>
          <!-- Application Chat -->
          <view
            class="flex flex-col gap-sm overflow-y-scroll"
            style="min-height: 160px"
          >
            <view class="section-title">
              {{ dt("application_chat.title") }}
            </view>
            <ChatContent
              class="flex-1 radius-med space-p-x-med space-p-y-sm"
              :chatId="123"
              mode="flex"
            />
            <!-- TODO: replace with pr.chat -->
          </view>
          <!-- EClose Reason (If has) -->
          <view class="flex flex-col gap-sm" v-if="myApplication?.eclose_reason">
            <view class="section-title">
              {{ dt(`application_eclose.title_${myApplication?.status}`) }}
            </view>
            <view class="font-label-large color-surface-on">
              {{ myApplication?.eclose_reason }}
            </view>
          </view>
        </template>
        <template v-if="Iam === 'partner'">
          <PRTimeline :current-status="PRStatus.Joinable" />
        </template>
      </view>
      <view class="operations">
        <template v-if="Iam !== 'partner'">
          <PUButton
            v-if="drawerExpanded && Iam === 'passby'"
            theme="SurfaceOutlined"
            :text="dt('drawer.add_role')"
            @click="onAddRoleClick"
          />
          <PUButton
            class="apply-btn"
            :theme="Iam === 'passby' ? 'Primary' : 'SurfaceOutlined'"
            :text="applyBtnText"
            :disabled="Iam === 'applicant'"
            @click="onApplyClick"
          />
        </template>
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
import { computed, getCurrentInstance, onMounted, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import type { TouchEvent } from "@uni-helper/uni-app-types";
import * as v from "valibot";

import { PartnerRequest } from "@/business/partner_request/base";
import { PRStatus } from "@/business/partner_request";
import { PartnerApplication } from "@/business/partner_request/application";
import { Route, RouteItemDatetime } from "@/business/base/route";

import ChatContent from "@/components/communication/ChatContent/ChatContent.vue";
import SafeArea from "@/components/common/safeArea/safeArea.vue";
import SafeAreaInset from "@/components/common/safeAreaInset.vue";
import pageBack from "@/components/common/pageBack/pageBack.vue";
import PUButton from "@/components/common/PUButton/PUButton.vue";
import PUTag from "@/components/common/PUTag/PUTag.vue";

import Partner from "@/components/partner_request/Partner/Partner.vue";
import PRApplyForm from "@/components/partner_request/PRApplyForm/PRApplyForm.vue";
import PRRoute from "@/components/partner_request/PRRoute/PRRoute.vue";
import PRTimeline from "@/components/partner_request/PRTimeline/PRTimeline.vue";

import { useTranslate } from "@/locale/use";
import { getWindowInfo } from "@/utils/vendor";
import { makeNumberPX } from "@/utils/style";
import SubApplication from "@/components/partner_request/SubApplication/SubApplication.vue";
import dayjs from "dayjs";

const { dt, t } = useTranslate("partner_request.detail");

const propsSchema = v.object({
  id: v.pipe(
    v.string(),
    v.transform((value) => parseInt(value))
  ),
  role: v.picklist(["passby", "applicant", "partner"]),
});
const props = ref<v.InferOutput<typeof propsSchema>>();

const { partners, bindPRId } = PartnerRequest.usePartners(props.value?.id); // TEST need to verify reactivity
bindPRId(() => props.value?.id);

const Iam = computed(() => props.value?.role);

const hasUnread = true; // TODO: Replace with real data

const myApplication = ref<PartnerApplication>();

const applyBtnText = computed(() => {
  if (Iam.value === "passby") {
    return drawerExpanded.value ? dt("drawer.submit_apply") : dt("drawer.apply");
  } else if (Iam.value === "applicant") {
    const applicationStatus = myApplication.value?.status;
    if (applicationStatus === "pending") {
      return dt("drawer.application_approving");
    } else if (applicationStatus === "rejected") {
      return dt("drawer.application_rejected");
    }
  }
  return "";
});

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

const onTimelineAction = (status: PRStatus, actionKey: string) => {
  // Handle timeline actions
  console.log("Timeline action:", status, actionKey);
  // TODO: Implement actual action handling
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
  if (props.value?.role === "applicant" && props.value.id) {
    PartnerApplication.get_mine(props.value.id).then((applications) => {
      myApplication.value = applications[0] || null;
    });
  }
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
