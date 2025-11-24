<script lang="ts">
export default {
  name: "PUForm",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
import { puFormProps, puFormEmits } from "./PUForm";
import type { FormValidationResult, FormErrorState } from "./PUForm";
import { ref, provide, computed } from "vue";
import * as v from "valibot";

const props = defineProps(puFormProps);
const emit = defineEmits(puFormEmits);

// Reactive error state
const formErrors = ref<Record<string, string>>({});

// Provide error state to child cells
const errorState = computed<FormErrorState>(() => ({
  errors: formErrors.value,
}));

provide("puFormErrors", errorState);
provide(
  "puFormCellPadding",
  computed(() => props.cellPadding)
);

/**
 * Validate the form using the ValibotFormClass instance
 * @returns Promise with validation result
 */
function validate<T = any>(): Promise<FormValidationResult<T>> {
  formErrors.value = {};

  const schema = props.schema;

  // Check if schema is a ValibotFormClass instance with validate method
  if (!schema || typeof schema.validate !== "function") {
    console.error("PUForm: schema must be a ValibotFormClass instance with validate method");
    return Promise.resolve({
      success: false,
      errors: { _form: "Invalid schema: must be a ValibotFormClass instance" },
    });
  }

  // Call the validate method on the schema instance
  return schema.validate().then((result: { success: boolean; errors: Record<string, string[]> }) => {
    if (result.success) {
      return {
        success: true,
        validatedForm: schema as T,
      };
    }

    // Convert array of errors to single string per field for compatibility
    const errors: Record<string, string> = {};
    for (const [key, messages] of Object.entries(result.errors)) {
      errors[key] = messages.join(", ");
    }

    formErrors.value = errors;

    return {
      success: false,
      errors,
    };
  });
}

// Expose validate method
defineExpose({
  validate,
});
</script>

<template>
  <view class="pu-form">
    <slot></slot>
  </view>
</template>

<style lang="scss" scoped src="./PUForm.scss"></style>
