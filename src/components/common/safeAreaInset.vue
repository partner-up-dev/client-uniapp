<script lang="ts">
export default {
  name: "SafeAreaInset",
  options: BasicComponentOptions,
};
</script>
<script setup lang="ts">
import { getSafeArea, getMenuButtonRect } from "@/utils/vendor";
import { makeNumberPX } from "@/utils/style";
import { BasicComponentOptions } from "@/utils/vue";
import { type PropType } from "vue";

defineProps({
  position: {
    type: String as PropType<"top" | "bottom" | "wxmp-menu" | "tabBar">,
    default: "bottom",
  },
});

const safeArea = getSafeArea();
const menuButton = getMenuButtonRect();
</script>

<template>
  <!-- #ifndef MP-ALIPAY -->
  <view
    v-if="position === 'top'"
    class="flex-shrink-0"
    :style="{ height: makeNumberPX(safeArea.top) }"
  ></view>
  <view
    v-else-if="position === 'bottom'"
    class="flex-shrink-0"
    :style="{ height: makeNumberPX(safeArea.bottom) }"
  ></view>
  <view
    v-else-if="position === 'wxmp-menu'"
    class="flex-shrink-0"
    :style="{
      height: makeNumberPX(menuButton.height),
      width: makeNumberPX(menuButton.width),
    }"
  ></view>
  <view v-else-if="position === 'tabBar'" :style="{ height: '55px' }"></view>
  <!-- #endif -->
</template>

<style lang="scss" scoped></style>
