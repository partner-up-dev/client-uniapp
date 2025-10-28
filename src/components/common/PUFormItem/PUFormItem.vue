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

  const errors = formErrors.value.errors;

  // If includeSub is enabled, collect all errors for this prop and its sub-fields
  if (props.includeSub) {
    const prefix = props.prop + ".";
    const relatedErrors: string[] = [];

    // Collect exact match error
    if (errors[props.prop]) {
      relatedErrors.push(errors[props.prop]);
    }

    // Collect sub-field errors
    for (const key in errors) {
      if (key.startsWith(prefix)) {
        relatedErrors.push(errors[key]);
      }
    }

    return relatedErrors.length > 0 ? relatedErrors.join("; ") : undefined;
  }

  // Default behavior: only return exact match error
  return errors[props.prop];
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
