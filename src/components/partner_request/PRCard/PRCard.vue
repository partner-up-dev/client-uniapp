<template>
  <view class="pr-card" @click="onCardClick">
    <!-- 元数据区域 -->
    <view class="metadata">
      <!-- Draft 类型：仅显示类型和创建时间 -->
      <template v-if="props.type === 'Draft'">
        <!-- PR类型和创建时间 -->
        <view class="type-and-time">
          <view class="pr-type">
            <text class="type-text">{{ formattedType }}</text>
          </view>
          <view class="creation-time">
            <text class="time-text">{{ formattedCreationTime }}</text>
          </view>
        </view>
      </template>

      <!-- Explore/Join 类型：显示参与者头像和类型 -->
      <template v-else>
        <view class="partners-and-type">
          <!-- 参与者头像 -->
          <Partners :partners="partners" :joinable="joinable" />

          <!-- PR类型 -->
          <view class="pr-type">
            <text class="type-text">{{ formattedType }}</text>
          </view>
        </view>
      </template>

      <!-- 主要信息 -->
      <view class="primary-info">
        <text class="primary-text">{{
          partnerRequest.title || "搭子请求主要内容概览"
        }}</text>
      </view>

      <!-- 次要信息 -->
      <view class="secondary-info">
        <text class="secondary-text">{{
          partnerRequest.introduction || "搭子请求次要内容概览"
        }}</text>
      </view>
    </view>

    <!-- 操作区域 - Draft 类型不显示 -->
    <view v-if="props.type !== 'Draft'" class="operations">
      <!-- 复制按钮 -->
      <PuButton theme="Surface" type="OnlyIcon" size="Small" prefix-icon="i-mdi-content-copy"
        @click.stop="onCopyClick" />

      <!-- 收藏按钮 -->
      <PuButton theme="Surface" type="OnlyIcon" size="Small" prefix-icon="i-mdi-bookmark-outline"
        @click.stop="onBookmarkClick" />

      <!-- 加入按钮 -->
      <PuButton theme="PrimaryContainer" type="WithText" size="Small" text="加入" prefix-icon="i-mdi-plus"
        @click.stop="onJoinClick" />
    </view>
  </view>
</template>

<script lang="ts">
export default {
  name: "PRCard",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import PuButton from "@partner-up-dev/design-uniapp/components/puButton/puButton.vue";
import Partners from "@/components/partner_request/partners/partners.vue";
import {
  prCardProps,
  prCardEmits,
  formatPRType,
  generateMockPartnerRequest,
  generateMockPartners,
} from "./PRCard";
import { BasicComponentOptions } from "@/utils/vue";
import { PRStatus } from "@/business/partner_request";
import { PartnerRequest } from "@/business/partner_request/base";
import { navigate } from "@/utils/vendor";
import { PAGE_ID } from "@/data/enum";
import { getTimeLossFromNow } from "@/utils/time";

const props = defineProps(prCardProps);
const emit = defineEmits(prCardEmits);

// 验证至少提供一个必需的 prop
if (!props.partnerRequest && !props.prId) {
  throw new Error("PRCard: 必须提供 partnerRequest 或 prId 其中之一");
}

// 使用 usePR composable 处理数据加载
const { pr, bindPR, bindPRId } = PartnerRequest.use(
  props.prId,
  props.partnerRequest
);
bindPR(() => props.partnerRequest);
bindPRId(() => props.prId);

// Refs
const joinable = computed(() => {
  return pr.value?.status === PRStatus.Joinable;
});

const partnerRequest = computed(() => {
  return pr.value || generateMockPartnerRequest();
});

const partners = computed(() => {
  return generateMockPartners(); // TODO: 替换为真实数据
});

// 格式化类型文本
const formattedType = computed(() => {
  return formatPRType(partnerRequest.value.type);
});

// 格式化创建时间（用于 Draft 类型）
const formattedCreationTime = computed(() => {
  if (!partnerRequest.value.created_at) return "";
  const timestamp = Math.floor(partnerRequest.value.created_at.getTime() / 1000);
  return getTimeLossFromNow(timestamp);
});

// 事件处理
const onCardClick = () => {
  if (!pr.value) return;
  emit("cardClick", pr.value);
  navigate({
    page_id: PAGE_ID.PR_DETAIL,
    params: { id: pr.value._id.toString() },
  });
};

const onJoinClick = () => {
  if (!pr.value) return;
  emit("joinClick", pr.value);
};

const onCopyClick = () => {
  if (!pr.value) return;
  emit("copyClick", pr.value);
};

const onBookmarkClick = () => {
  if (!pr.value) return;
  emit("bookmarkClick", pr.value);
};
</script>

<style lang="scss" scoped src="./PRCard.scss"></style>
