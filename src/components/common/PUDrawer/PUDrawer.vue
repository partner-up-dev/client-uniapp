<template>
  <view v-show="visible" class="pu-drawer-scrim" @click="visible = false"></view>
  <view
    class="pu-drawer"
    :style="{ bottom: computedBottom, height: props.height }"
  >
    <view class="drawer-header">
      <text class="drawer-title">{{ props.title }}</text>
      <view role="button" class="drawer-close" @click="visible = false">
        <text class="i-mdi-close"></text>
      </view>
    </view>
    <view class="drawer-content">
      <slot />
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

const props = defineProps(puDrawerProps);
const emit = defineEmits(puDrawerEmits);

const visible = useOptionalVModel<boolean>({ props, emit, modelName: "visible" });

const computedBottom = computed(() => (visible.value ? "0" : `-${props.height}`));
</script>

<style lang="scss" scoped src="./PUDrawer.scss"></style>
