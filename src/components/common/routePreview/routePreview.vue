<script lang="ts">
export default {
  name: "RoutePreview",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
import { routePreviewProps, routePreviewEmits } from "./routePreview";
import { Route } from "@/business/base/route";
import { watch } from "vue";

const props = defineProps(routePreviewProps);
const emit = defineEmits(routePreviewEmits);

if (!props.route) throw new Error("route is required");

const { locations, _route } = Route.use(props.route);

watch(
  () => props.route,
  (newRoute) => {
    if (!newRoute) throw new Error("route is required");
    _route.value = newRoute;
  }
);
</script>

<template>
  <view class="route-preview">
    <!-- 起点路线项 -->
    <view class="route-item">
      <view class="type-indicator indicator-type-start"> </view>
      <text class="address">{{ locations?.[0]?.friendly_address || "起点" }}</text>
    </view>

    <!-- 终点路线项 -->
    <view class="route-item">
      <view class="type-indicator indicator-type-end"> </view>
      <text class="address">{{
        locations?.[locations.length - 1]?.friendly_address || "终点"
      }}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped src="./routePreview.scss"></style>
