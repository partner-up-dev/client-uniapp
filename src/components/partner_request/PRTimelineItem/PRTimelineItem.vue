<template>
  <view :class="cardClasses">
    <!-- Header Section -->
    <view class="pr-ti__header" @click="expand = !expand">
      <text class="pr-ti__title">{{ content.title }}</text>
      <view class="pr-ti__expand-icon">
        <text v-if="expand" class="i-mdi-chevron-up"></text>
        <text v-else class="i-mdi-chevron-down"></text>
      </view>
    </view>

    <view v-if="expand" class="pr-ti__content">
      <view class="pr-ti__description">{{ content.description }}</view>
      <view class="pr-ti__actions">
        <!-- Type:Draft -->
        <template v-if="type === PRStatus.Draft">
          <PUButton
            :theme="isCurrent ? 'PrimaryContainer' : 'Plain'"
            type="Bar"
            :text="dt('actions.edit')"
            suffix-icon="i-mdi-chevron-right"
          />
          <PUButton theme="Plain" type="Bar" :text="dt('actions.delete')" />
        </template>
        <!-- Type:Joinable -->
        <template v-if="type === PRStatus.Joinable">
          <PUButton
            :theme="isCurrent ? 'PrimaryContainer' : 'Plain'"
            type="Bar"
            :text="dt('actions.approve_applications')"
            suffix-icon="i-mdi-chevron-right"
          />
          <PUButton theme="Plain" type="Bar" :text="dt('actions.ready')" />
          <PUButton theme="Plain" type="Bar" :text="dt('actions.share')" />
        </template>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
export default {
  name: "PRTimelineItem",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import { BasicComponentOptions } from "@/utils/vue";
import { prTimelineItemProps, prTimelineItemEmits } from "./PRTimelineItem";
import { useTranslate } from "@/locale/use";
import { useOptionalVModel } from "@/composables/props";
import { PRStatus } from "@/business/partner_request";
import PUButton from "@/components/common/PUButton/PUButton.vue";

const props = defineProps(prTimelineItemProps);
const emit = defineEmits(prTimelineItemEmits);

// Local state
const expand = useOptionalVModel<boolean>({
  props,
  emit,
  modelName: "expand",
  defaultValue: false,
});

// Locale
const { dt } = useTranslate(`partner_request.timeline_item.${props.type}`);

// Set expand to true when state is current
if (props.state === "current" && !expand.value) {
  expand.value = true;
}

// Computed properties
const content = computed(() => {
  return {
    title: dt(`title`, `Timeline Item ${props.type}`),
    description: dt(`description`, `Description for ${props.type} status`),
  };
});

const cardClasses = computed(() => {
  const classes = ["pr-ti"];
  const isTerminalStatus = [
    PRStatus.Cancelled,
    PRStatus.Merged,
    PRStatus.Closed,
  ].includes(props.type);
  if (props.state === "current" && !isTerminalStatus) {
    classes.push(`pr-ti--${props.state}`);
  } else if (props.state !== "current") {
    classes.push(`pr-ti--${props.state}`);
  }
  if (expand.value) classes.push("pr-ti--expanded");
  return classes;
});

const isCurrent = computed(() => props.state === "current");
</script>

<style lang="scss" scoped src="./PRTimelineItem.scss"></style>
