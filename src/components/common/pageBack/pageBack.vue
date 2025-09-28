<script lang="ts">
export default {
  name: "PageBack",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
import { pageBackProps } from "./pageBack";

const props = defineProps(pageBackProps);

function onClick() {
  uni.navigateBack();
}
</script>

<template>
  <view class="page-back" :class="props.size" @click="onClick">
    <text class="icon i-mdi-arrow-top-left" />
  </view>
</template>

<style lang="scss" scoped src="./pageBack.scss"></style>
