<script lang="ts">
export default {
  name: "RouteItem",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
import { computed, watch } from "vue";
import { routeItemProps, routeItemEmits } from "./routeItem";
import { RouteItem as RouteItemModel } from "@/business/base/route";
import RouteItemDatetime from "../routeItemDatetime/routeItemDatetime.vue";

const props = defineProps(routeItemProps);
defineEmits(routeItemEmits);

const { location, loading } = RouteItemModel.use(props.item!);

watch(
  () => props.item,
  (val) => {
    if (!val) return;
    // RouteItem.use 内部持有 ref，不需要额外处理
  }
);

const isDefault = computed(() => props.layout === "default");
const isCol = computed(() => props.layout === "2rows");

const address = computed(
  () => location.value?.friendly_address ?? (loading.value ? "…" : "")
);

const indicatorClass = computed(() => {
  return {
    start: props.type === "start",
    waypoint: props.type === "waypoint",
    end: props.type === "end",
  };
});
</script>

<template>
  <view class="ri">
    <!-- type indicator -->
    <view class="indicator" :class="indicatorClass">
      <view v-if="showDash && type === 'start'" class="h-1"></view>
      <view
        v-if="showDash && ['end', 'waypoint'].includes(type)"
        class="connector connector-prev"
      />
      <view class="circle" />
      <view
        v-if="showDash && ['start', 'waypoint'].includes(type)"
        class="connector connector-next"
      />
      <view v-if="showDash && type === 'end'" class="h-2"></view>
    </view>

    <!-- content -->
    <view class="content" :class="{ 'content--col': isCol }">
      <text class="address">{{
        address || (type === "start" ? "起点" : type === "end" ? "终点" : "")
      }}</text>
      <RouteItemDatetime
        v-if="showDatetime"
        :datetime="item!.datetime"
        :placeholder="true"
      />
    </view>
  </view>
</template>

<style lang="scss" scoped src="./routeItem.scss"></style>
