<template>
  <view class="pr-route">
    <!-- Route preview -->
    <PUMap height="180px" :elements="[props.route]" />

    <!-- Datetime summary -->
    <!-- TODO -->
    <view class="setoff-date" v-if="setOffDate">
      <text class="date">{{ setOffDate }}</text>
      <text class="label">出发</text>
    </view>

    <!-- Route list -->
    <view class="route-list">
      <RouteItem
        v-for="(item, index) in props.route.items"
        :key="index"
        :item="item"
        :type="getRouteItemType(index, props.route.items.length)"
        layout="2rows"
        :show-datetime="true"
      />
    </view>
  </view>
</template>

<script lang="ts">
export default {
  name: "PRRoute",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
import { PRRouteProps } from "./PRRoute";
import { PUMap } from "@partner-up-dev/design/uniapp";
import RouteItem from "@/components/common/routeItem/routeItem.vue";
import { computed, ref } from "vue";

// Props
const props = defineProps(PRRouteProps);
if (!props.route) throw new Error("PRRoute: route is required");

const getRouteItemType = (index: number, total: number) => {
  if (index === 0) return "start";
  if (index === total - 1) return "end";
  return "waypoint";
};

// computed
const setOffDate = computed(
  (): string | undefined => props.route!.startItem.datetime.dateString
);
</script>

<style scoped lang="scss" src="./PRRoute.scss"></style>
