<script lang="ts">
export default {
  name: "plainMsgContent",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import { BasicComponentOptions } from "@/utils/vue";
import { plainMsgContentProps, plainMsgContentEmits } from "./plainMsgContent";

const props = defineProps(plainMsgContentProps);
const emit = defineEmits(plainMsgContentEmits);

const containerClass = computed(() => ({
  "plain-msg": true,
  "plain-msg--mine": props.byMe,
}));
</script>

<template>
  <view :class="containerClass">
    <text class="plain-msg__text">{{ content }}</text>
  </view>
</template>

<style lang="scss" scoped src="./plainMsgContent.scss"></style>
