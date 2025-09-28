<script lang="ts">
/**
 * Add `flex:1` to your slot content.
 */
export default {
  name: "SafeArea",
  options: BasicComponentOptions,
};
</script>
<script setup lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
import { type PropType, computed } from "vue";
import SafeAreaInset from "../safeAreaInset.vue";
import { makeStringProp } from "@/utils/props";
import { makeNumberPX } from "@/utils/style";
import { getMenuButtonRect } from "@/utils/vendor";

const props = defineProps({
  position: makeStringProp<"wxmp-menu">("wxmp-menu"),
});

const paddingRight = computed(() => {
  if (props.position === "wxmp-menu") {
    return makeNumberPX(getMenuButtonRect().right);
  }
});
</script>

<template>
  <view class="safe-area" :style="{ paddingRight }">
    <slot></slot>
    <SafeAreaInset :position="props.position" />
  </view>
</template>

<style lang="scss" scoped>
.safe-area {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
