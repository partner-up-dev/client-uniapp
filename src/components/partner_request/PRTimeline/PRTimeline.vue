<template>
  <view class="pr-timeline">
    <text class="section-title">{{ dt("title") }}</text>
    <view class="pr-timeline__container">
      <PRTimelineItem
        :type="PRStatus.Draft"
        :state="getItemState(PRStatus.Draft)"
      />
      <PRTimelineItem
        :type="PRStatus.Joinable"
        :state="getItemState(PRStatus.Joinable)"
      />
      <PRTimelineItem
        :type="PRStatus.Ready"
        :state="getItemState(PRStatus.Ready)"
      />
      <PRTimelineItem
        :type="PRStatus.Performing"
        :state="getItemState(PRStatus.Performing)"
      />
      <PRTimelineItem
        :type="PRStatus.Settling"
        :state="getItemState(PRStatus.Settling)"
      />
    </view>
  </view>
</template>

<script lang="ts">
export default {
  name: "PRTimeline",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
import { prTimelineProps } from "./PRTimeline";
import PRTimelineItem from "../PRTimelineItem/PRTimelineItem.vue";
import { useTranslate } from "@/locale/use";
import { PRStatus, PRStatusOrder } from "@/business/partner_request";

const props = defineProps(prTimelineProps);

const { dt } = useTranslate("partner_request.timeline");

// Get state for a specific status
const getItemState = (status: PRStatus): "future" | "current" | "past" => {
  const currentOrder = PRStatusOrder[props.currentStatus!];
  const statusOrder = PRStatusOrder[status];

  if (statusOrder < currentOrder) {
    return "past";
  } else if (statusOrder === currentOrder) {
    return "current";
  } else {
    return "future";
  }
};
</script>

<style lang="scss" scoped src="./PRTimeline.scss"></style>
