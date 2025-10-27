<script lang="ts">
export default {
  name: "PUFormItem",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
import { puFormItemProps, puFormItemEmits } from "./PUFormItem";
import { inject, computed } from "vue";
import type { FormErrorState } from "@/components/common/PUForm/PUForm";

const props = defineProps(puFormItemProps);
const emit = defineEmits(puFormItemEmits);

// Inject form context if inside PUForm
const formErrors = inject<{ value: FormErrorState } | undefined>(
  "puFormErrors",
  undefined
);

// Compute error message for this field
const errorMessage = computed(() => {
  if (!props.prop || !formErrors?.value?.errors) {
    return undefined;
  }
  return formErrors.value.errors[props.prop];
});
</script>

<template>
  <view class="pu-form-item">
    <slot></slot>
    <view v-if="errorMessage" class="pu-form-item__error">
      {{ errorMessage }}
    </view>
  </view>
</template>

<style lang="scss" scoped src="./PUFormItem.scss"></style>
