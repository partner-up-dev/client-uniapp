<template>
  <view
    :class="`pu-checkbox-group ${shape === 'button' && inline ? 'is-button' : ''} ${customClass}`"
    :style="customStyle"
  >
    <slot />
  </view>
</template>

<script lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
export default {
  name: "PUCheckboxGroup",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { watch, provide } from "vue";
import { puCheckboxGroupProps, PUCHECKBOX_GROUP_KEY } from "./PUCheckboxGroup";

const props = defineProps(puCheckboxGroupProps);
const emit = defineEmits(["change", "update:modelValue"]);

// provide group context for children checkboxes
provide(PUCHECKBOX_GROUP_KEY, {
  props,
  changeSelectState,
});

// validations and reactive guards (lightweight)
watch(
  () => props.modelValue,
  (newValue) => {
    if (new Set(newValue).size !== newValue.length) {
      console.error("PUCheckboxGroup's bound value includes duplicate entries");
    }
    if (newValue.length < props.min) {
      console.error("PUCheckboxGroup's bound value length can't be less than min");
    }
    if (props.max !== 0 && newValue.length > props.max) {
      console.error("PUCheckboxGroup's bound value length can't exceed max");
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => props.shape,
  (newValue) => {
    const types = ["circle", "square", "button"];
    if (newValue && types.indexOf(newValue) === -1) {
      console.error(`shape must be one of ${types.toString()}`);
    }
  },
  { immediate: true }
);

function changeSelectState(value: string | number | boolean) {
  const temp = [...props.modelValue];
  const idx = temp.indexOf(value);
  if (idx > -1) {
    // enforce min constraint
    if (temp.length <= props.min) return;
    temp.splice(idx, 1);
  } else {
    // guard by max
    if (props.max !== 0 && temp.length >= props.max) return;
    temp.push(value);
  }
  emit("update:modelValue", temp);
  emit("change", { value: temp });
}
</script>

<style lang="scss" scoped src="./PUCheckboxGroup.scss"></style>
