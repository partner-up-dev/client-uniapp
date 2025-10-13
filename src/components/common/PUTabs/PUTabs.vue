<template>
  <scroll-view :scroll-x="true" :class="rootClasses" :style="props.customStyle">
    <view
      v-for="(tab, index) in props.tabs"
      :key="index"
      :class="[
        'pu-tabs__item',
        index === props.modelValue ? 'active' : 'deactive',
        props.size,
        index > 0 ? 'space-m-l-med' : '',
      ]"
      @click="onClick(index)"
    >
      <PUTab
        :text="tab.text"
        :showDot="index === props.modelValue ? false : tab.showDot"
        :size="props.size"
      />
    </view>
  </scroll-view>
</template>

<script lang="ts">
export default {
  name: "PUTabs",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import { BasicComponentOptions } from "@/utils/vue";
import { puTabsProps, puTabsEmits } from "./PUTabs";
import PUTab from "../PUTab/PUTab.vue";

const props = defineProps(puTabsProps);
const emit = defineEmits(puTabsEmits);

const rootClasses = computed(() => {
  const classes = ["pu-tabs"];
  if (props.customClass) classes.push(props.customClass);
  return classes;
});

function onClick(index: number) {
  if (index === props.modelValue) return;
  emit("update:modelValue", index);
  emit("change", index);
}
</script>

<style scoped lang="scss" src="./PUTabs.scss"></style>
