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
 * Validate the form using the provided schema
 * @returns Promise with validation result
 */
async function validate<T = any>(): Promise<FormValidationResult<T>> {
  formErrors.value = {};

  const schema = props.schema;

  if (!schema || typeof schema.safeParse !== "function") {
    console.error("PUForm: Invalid schema provided");
    return {
      success: false,
      errors: { _form: "Invalid schema configuration" },
    };
  }

  // Collect form data from slots (this is a simplified implementation)
  // In a real scenario, you'd collect data from v-model bindings
  // For now, we assume the parent component manages the data and passes it to validate
  const formDataCollector = ref<any>({});
  provide("puFormDataCollector", formDataCollector);

  // This method should be called with form data from the parent
  // For better API, we'll accept formData as parameter
  return validateFormData(formDataCollector.value);
}

/**
 * Validate form data against schema
 */
function validateFormData<T = any>(): Promise<FormValidationResult<T>> {
  formErrors.value = {};

  const schema = props.schema;

  if (!schema || typeof schema.validate !== "function") {
    return Promise.resolve({
      success: false,
      errors: { _form: "Invalid schema configuration" },
    });
  }

  return schema.validate().then((result) => {
    if (result.success) {
      return {
        success: true,
        validatedForm: result.output as T,
      };
    }

    // Parse valibot issues into field errors
    const errors: Record<string, string> = {};

    if (result.issues && Array.isArray(result.issues)) {
      result.issues.forEach((issue: v.BaseIssue<unknown>) => {
        if (issue.path) {
          const pathKey = issue.path
            .map((p) => p.key)
            .filter((k) => k !== undefined)
            .join(".");

          if (pathKey) {
            errors[pathKey] = issue.message;
          }
        } else {
          errors._form = issue.message;
        }
      });
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
  validate: () => validateFormData(),
});
</script>

<template>
  <view class="pu-form">
    <slot></slot>
  </view>
</template>

<style lang="scss" scoped src="./PUForm.scss"></style>
