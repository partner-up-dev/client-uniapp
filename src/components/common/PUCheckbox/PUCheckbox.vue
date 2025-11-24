<template>
  <view
    :class="`
      pu-checkbox
      ${shapeClass}
      ${isChecked ? 'is-checked' : ''}
      ${isInline ? 'is-inline' : ''}
      ${isDisabled ? 'is-disabled' : ''}
      ${sizeClass}
      ${typeClass}
      ${customClass}
    `"
    :style="rootStyle"
    @click="toggle"
  >
    <!-- Default 类型：当 shape!==button 时展示选择框图形 -->
    <template v-if="props.type === 'Default'">
      <view
        v-if="innerShape !== 'button'"
        :class="`pu-checkbox__shape ${
          innerShape === 'square' ? 'is-square' : ''
        } ${customShapeClass}`"
        :style="
          isChecked && !isDisabled && checkedColor ? 'color:' + checkedColor : ''
        "
      >
        <text class="pu-checkbox__check i-mdi-check-bold"></text>
      </view>

      <!-- label 区域（button 模式下充当按钮外观） -->
      <view
        :class="`pu-checkbox__label ${customLabelClass}`"
        :style="
          isChecked && innerShape === 'button' && !isDisabled && checkedColor
            ? 'color:' + checkedColor
            : ''
        "
      >
        <text
          v-if="innerShape === 'button' && isChecked"
          class="pu-checkbox__btn-check i-mdi-check-bold"
        ></text>
        <view
          class="pu-checkbox__txt"
          :style="maxWidth ? 'max-width:' + maxWidth : ''"
        >
          <slot />
        </view>
      </view>
    </template>

    <!-- Bar 类型：整行可点，左方 20px 方框，右侧文本 -->
    <template v-else>
      <view class="pu-checkbox__bar">
        <view class="pu-checkbox__bar-shape">
          <text class="pu-checkbox__bar-check i-mdi-check-bold"></text>
        </view>
        <view class="pu-checkbox__bar-label">
          <view
            class="pu-checkbox__txt"
            :style="maxWidth ? 'max-width:' + maxWidth : ''"
          >
            <slot />
          </view>
        </view>
      </view>
    </template>
  </view>
</template>

<script lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
export default {
  name: "PUCheckbox",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { computed, inject } from "vue";
import {
  puCheckboxProps,
  puCheckboxEmits,
  type PUCheckboxExpose,
} from "./PUCheckbox";
import {
  PUCHECKBOX_GROUP_KEY,
  type PUCheckboxGroupProvide,
} from "../PUCheckboxGroup/PUCheckboxGroup";

const props = defineProps(puCheckboxProps);
const emit = defineEmits(puCheckboxEmits);

defineExpose<PUCheckboxExpose>({ toggle });

const checkboxGroup = inject<PUCheckboxGroupProvide | null>(
  PUCHECKBOX_GROUP_KEY,
  null
);

const isChecked = computed(() => {
  if (checkboxGroup) {
    return checkboxGroup.props.modelValue.indexOf(props.modelValue) > -1;
  }
  return props.modelValue === props.trueValue;
});

const isDisabled = computed(() => {
  if (!checkboxGroup) return !!props.disabled;
  const { max, min, modelValue, disabled } = checkboxGroup.props;
  if (
    (max && modelValue.length >= max && !isChecked.value) ||
    (min && modelValue.length <= min && isChecked.value)
  ) {
    return true;
  }
  return !!(props.disabled || disabled);
});

const innerShape = computed(
  () => props.shape || (checkboxGroup && checkboxGroup.props.shape) || "circle"
);
const isInline = computed(() =>
  checkboxGroup ? !!checkboxGroup.props.inline : !!props.inline
);
const sizeClass = computed(() => {
  const size = props.size || (checkboxGroup && checkboxGroup.props.size);
  return size ? `is-${size}` : "";
});
const shapeClass = computed(() =>
  innerShape.value === "button" ? "is-button" : ""
);

// type class for BEM
const typeClass = computed(() =>
  props.type ? `is-${props.type.toLowerCase()}` : ""
);

// root style: bar 类型需要将 checkedColor 应用为描边与勾选背景色
const rootStyle = computed(() => {
  if (props.type !== "Bar") return props.customStyle;
  // Bar 的容器背景在设计里是 surface-container；保持由外层控制，此处仅透传 customStyle
  return props.customStyle;
});

function toggle() {
  if (isDisabled.value) return;
  if (checkboxGroup) {
    emit("change", { value: !isChecked.value });
    checkboxGroup.changeSelectState(props.modelValue as any);
    return;
  }
  const newVal = isChecked.value ? props.falseValue : props.trueValue;
  emit("update:modelValue", newVal);
  emit("change", { value: newVal });
}
</script>

<style lang="scss" scoped src="./PUCheckbox.scss"></style>
