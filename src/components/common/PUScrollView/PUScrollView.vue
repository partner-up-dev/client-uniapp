<script lang="ts">
export default {
  name: "PUScrollView",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import { BasicComponentOptions } from "@/utils/vue";
import { puScrollViewProps, puScrollViewEmits } from "./PUScrollView";
import { usePulldownRefresher } from "@/utils/vendor";

const props = defineProps(puScrollViewProps);
const emit = defineEmits(puScrollViewEmits);

const isHorizontal = computed(() => props.direction === "x");
const isVertical = computed(() => props.direction === "y");

// Integrate pulldown refresher if onRefresh is provided
const refreshEnabled = computed(() => !!props.onRefresh && isVertical.value);

// Create refresh handlers
const refreshHandlers = computed(() => {
  if (props.onRefresh) {
    return usePulldownRefresher(props.onRefresh);
  }
  return null;
});

const is_refreshing = computed(
  () => refreshHandlers.value?.is_refreshing.value ?? false
);

const handleRefresherPulling = (event: any) => {
  if (refreshHandlers.value) {
    refreshHandlers.value.onRefresherPulling(event);
  }
};

const handleRefresherRestored = () => {
  if (refreshHandlers.value) {
    refreshHandlers.value.onRefresherRestored();
  }
};

const handleRefresherRefresh = () => {
  if (refreshHandlers.value) {
    refreshHandlers.value.onRefresherRefresh();
  }
};

// Compute actual fade position based on edgeFade prop
const computedFadePosition = computed(() => {
  if (!props.edgeFade) return undefined;
  if (props.edgeFade === "auto") {
    // Auto mode: default to 'end' for both directions
    return "end";
  }
  return props.edgeFade;
});

const scrollViewClasses = computed(() => [
  "pu-scroll-view",
  props.customClass,
  computedFadePosition.value ? `fade-${computedFadePosition.value}` : "",
  isHorizontal.value ? "pu-scroll-view--horizontal" : "",
]);

const handleScroll = (event: any) => {
  emit("scroll", event);
};
</script>

<template>
  <scroll-view
    class="pu-scroll-view"
    :class="scrollViewClasses"
    :scroll-x="isHorizontal"
    :scroll-y="isVertical"
    :refresher-enabled="refreshEnabled"
    :refresher-triggered="is_refreshing"
    @refresherpulling="handleRefresherPulling"
    @refresherrestore="handleRefresherRestored"
    @refresherrefresh="handleRefresherRefresh"
    @scroll="handleScroll"
  >
    <slot />
  </scroll-view>
</template>

<style lang="scss" scoped src="./PUScrollView.scss"></style>
