<template>
  <view class="pr-card" @click="onCardClick">
    <!-- 元数据区域 -->
    <view class="metadata">
      <!-- 参与者头像和类型 -->
      <view class="partners-and-type">
        <!-- 参与者头像 -->
        <Partners :partners="partners" :joinable="joinable" />

        <!-- PR类型 -->
        <view class="pr-type">
          <text class="type-text">{{ formattedType }}</text>
        </view>
      </view>

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

    <!-- 操作区域 -->
    <view class="operations">
      <!-- 复制按钮 -->
      <PUButton
        theme="Surface"
        type="OnlyIcon"
        size="Small"
        prefix-icon="i-mdi-content-copy"
        @click.stop="onCopyClick"
      />

      <!-- 收藏按钮 -->
      <PUButton
        theme="Surface"
        type="OnlyIcon"
        size="Small"
        prefix-icon="i-mdi-bookmark-outline"
        @click.stop="onBookmarkClick"
      />

      <!-- 加入按钮 -->
      <PUButton
        theme="PrimaryContainer"
        type="WithText"
        size="Small"
        text="加入"
        prefix-icon="i-mdi-plus"
        @click.stop="onJoinClick"
      />
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
import PUButton from "@/components/common/PUButton/PUButton.vue";
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
import { navigate } from "@/utils/vendor";
import { PAGE_ID } from "@/data/enum";

const props = defineProps(prCardProps);
const emit = defineEmits(prCardEmits);

// Refs
const joinable = computed(() => {
  return partnerRequest.value.status === PRStatus.Joinable;
});

const partnerRequest = computed(() => {
  // 如果没有传入数据，使用模拟数据
  return props.partnerRequest || generateMockPartnerRequest();
});

const partners = computed(() => {
  return generateMockPartners(); // TODO: 替换为真实数据
});

// 格式化类型文本
const formattedType = computed(() => {
  return formatPRType(partnerRequest.value.type);
});

// 事件处理
const onCardClick = () => {
  emit("cardClick", partnerRequest.value);
  navigate({
    page_id: PAGE_ID.PR_DETAIL,
    params: { id: partnerRequest.value._id.toString() },
  });
};

const onJoinClick = () => {
  emit("joinClick", partnerRequest.value);
};

const onCopyClick = () => {
  emit("copyClick", partnerRequest.value);
};

const onBookmarkClick = () => {
  emit("bookmarkClick", partnerRequest.value);
};
</script>

<style lang="scss" scoped src="./PRCard.scss"></style>
