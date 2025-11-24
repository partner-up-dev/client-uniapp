<template>
  <view :class="rootClasses" :style="customStyle">
    <text class="text">{{ props.text }}</text>
  </view>
</template>

<script lang="ts">
export default {
  name: "PUTag",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import { BasicComponentOptions } from "@/utils/vue";
import { kebabCase } from "@/utils";
import { puTagProps, puTagEmits } from "./PUTag";

const props = defineProps(puTagProps);
// no emits for now, kept for symmetry
// const emit = defineEmits(puTagEmits);

const rootClasses = computed(() => {
  const classes = ["pu-tag"] as string[];
  // shape
  if (props.rounded) classes.push("rounded");
  if (props.outlined) classes.push("outlined");

  // theme
  classes.push(kebabCase(props.theme));

  // size
  classes.push(kebabCase(props.size));

  // allow external custom class
  if (props.customClass) classes.push(props.customClass);
  return classes;
});
</script>

<style scoped lang="scss" src="./PUTag.scss"></style>
