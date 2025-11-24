<script lang="ts">
export default {
  name: "ScaffoldLayout",
  options: {
    styleIsolation: "isolated",
  },
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import { scaffoldLayoutProps, scaffoldLayoutEmits } from "./scaffoldLayout";
import NavBar from "@/components/common/navBar/navBar.vue";
import { getWindowHeight } from "@/utils/vendor";
import { makeNumberPX } from "@/utils/style";

const props = defineProps(scaffoldLayoutProps);
const emit = defineEmits(scaffoldLayoutEmits);

const windowHeight = getWindowHeight();
const layoutHeight = computed(() => makeNumberPX(windowHeight));
</script>

<template>
  <view class="scaffold-layout" :style="{ height: layoutHeight }">
    <!-- Header -->
    <slot name="header">
      <NavBar />
    </slot>

    <!-- Content -->
    <view class="scaffold-layout__content">
      <slot></slot>
    </view>

    <!-- Footer -->
    <view v-if="showFooter">
      <slot name="footer"></slot>
    </view>
  </view>
</template>

<style lang="scss" scoped src="./scaffoldLayout.scss"></style>
