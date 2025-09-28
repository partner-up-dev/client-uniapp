<template>
  <view class="pr-type-filter">
    <PUCheckboxGroup
      :model-value="innerValue"
      inline
      shape="square"
      @update:modelValue="onGroupUpdate"
      @change="onGroupChange"
      class="pr-type-filter__group"
    >
      <PUCheckbox
        v-for="type in types"
        :key="type"
        :model-value="type"
        type="Bar"
        shape="square"
        class="pr-type-filter__item"
      >
        <text>{{ format(type) }}</text>
      </PUCheckbox>
    </PUCheckboxGroup>
  </view>
</template>

<script lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
export default {
  name: "PRTypeFilter",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import { prTypeFilterProps, prTypeFilterEmits, ALL_PR_TYPES } from "./PRTypeFilter";
import { PRType } from "@/business/partner_request";
import PUCheckbox from "@/components/common/PUCheckbox/PUCheckbox.vue";
import PUCheckboxGroup from "@/components/common/PUCheckboxGroup/PUCheckboxGroup.vue";
import { formatPRType as format } from "@/components/partner_request/PRCard/PRCard";

const props = defineProps(prTypeFilterProps);
const emit = defineEmits(prTypeFilterEmits);

const types = ALL_PR_TYPES;

// 防御性复制，避免直接修改父值
const innerValue = computed<PRType[]>(() => props.modelValue || []);

function onGroupUpdate(value: Array<string | number | boolean>) {
  // group 中的值由每个复选框的 model-value 决定，这里都是 PRType（string）
  emit("update:modelValue", value as PRType[]);
}

function onGroupChange() {
  emit("change");
}
</script>

<style lang="scss" scoped src="./PRTypeFilter.scss"></style>
