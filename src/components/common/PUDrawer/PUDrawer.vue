<template>
  <view
    v-show="visible"
    class="pu-drawer-scrim"
    @click="visible = false"
    @touchmove="noop"
  ></view>
  <view
    class="pu-drawer"
    :style="{ bottom: computedBottom, height: props.height }"
  >
    <slot name="full" />
    <view class="default" v-if="!fullCustom">
      <view class="drawer-header">
        <text class="drawer-title">{{ props.title }}</text>
        <view role="button" class="drawer-close" @click="visible = false">
          <text class="i-mdi-close"></text>
        </view>
      </view>
      <view class="drawer-content">
        <slot />
      </view>
    </view>
    <SafeAreaInset position="bottom" />
  </view>
</template>

<script lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
import SafeAreaInset from "../safeAreaInset.vue";
export default {
  name: "PUDrawer",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import { useOptionalVModel } from "@/composables/props";
import { puDrawerProps, puDrawerEmits } from "./PUDrawer";
// #ifdef H5
import { useLockScroll } from "@/composables/useLockScroll";
// #endif

const props = defineProps(puDrawerProps);
const emit = defineEmits(puDrawerEmits);

const visible = useOptionalVModel<boolean>({ props, emit, modelName: "visible" });

const computedBottom = computed(() => (visible.value ? "0" : `-${props.height}`));

// 防止滚动穿透
// #ifdef H5
useLockScroll(() => visible.value && props.lockScroll);
// #endif

// 阻止触摸移动事件传播
function noop() {}
</script>

<style lang="scss" scoped src="./PUDrawer.scss"></style>
