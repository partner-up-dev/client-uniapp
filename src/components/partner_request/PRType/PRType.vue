<script lang="ts">
export default {
  name: "PRType",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
import { prTypeProps, prTypeEmits } from "./PRType";
import { PUTag } from "@partner-up-dev/design/uniapp";

const props = defineProps(prTypeProps);
const emit = defineEmits(prTypeEmits);

if (props.pr === undefined) {
  throw new Error("props PR is required");
}
</script>

<template>
  <PUTag :text="props.pr.typeText" size="xSmall" theme="Surface" />
</template>

<style lang="scss" scoped src="./PRType.scss"></style>
