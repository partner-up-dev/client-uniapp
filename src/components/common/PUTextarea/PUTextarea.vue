<template>
  <view
    class="pu-textarea"
    :class="{
      'is-disabled': disabled,
      'is-readonly': readonly,
      'is-focused': isFocused,
    }"
    :style="rootStyle"
  >
    <view class="field">
      <textarea
        class="inner"
        :class="{
          focused: isFocused,
        }"
        placeholder-class="pu-textarea-placeholder"
        :value="modelValue"
        :placeholder="placeholder"
        :maxlength="normalizedMaxlength"
        :auto-height="autoHeight"
        :disabled="disabled"
        :readonly="readonly"
        :focus="focus"
        :confirm-type="confirmType"
        :show-confirm-bar="showConfirmBar"
        :hold-keyboard="holdKeyboard"
        :cursor-spacing="cursorSpacing"
        :adjust-position="adjustPosition"
        :fixed="fixed"
        :disable-default-padding="disableDefaultPadding"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput"
        @confirm="onConfirm"
        @linechange="onLinechange"
      />

      <!-- 计数器 -->
      <view v-if="showCount && normalizedMaxlength > -1" class="count">
        <text class="font-label-large">{{ countText }}</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
export default {
  name: "PUTextarea",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import { BasicComponentOptions } from "@/utils/vue";
import { puTextareaProps, puTextareaEmits } from "./PUTextarea";
import { useOptionalVModel } from "@/composables/props";

const props = defineProps(puTextareaProps);
const emit = defineEmits(puTextareaEmits);

const isFocused = ref(false);
const modelValue = useOptionalVModel<string>({
  props,
  emit,
  modelName: "modelValue",
});

const normalizedMaxlength = computed(() => {
  const n = Number(props.maxlength);
  return Number.isNaN(n) ? -1 : n;
});

const countText = computed(
  () => `${modelValue.value.length}/${normalizedMaxlength.value}`
);

const rootStyle = computed(() => {
  const base: Record<string, string> = {};
  base["--pu-textarea-min-height"] = `${props.height}px`;
  base["--pu-textarea-min-height-focus"] = `${
    props.focusHeight ?? props.height
  }px`;
  // merge custom style (string) onto root if provided
  if (props.customStyle) base["cssText" as any] = props.customStyle as any;
  return base;
});

function onFocus(e: any) {
  isFocused.value = true;
  emit("focus", e);
}
function onBlur(e: any) {
  isFocused.value = false;
  emit("blur", e);
}
function onInput(e: any) {
  // e.detail.value is the current value in uni-app
  const v = (e?.detail?.value ?? "") as string;
  modelValue.value = v;
  emit("input", v);
}
function onConfirm(e: any) {
  emit("confirm", e);
}
function onLinechange(e: any) {
  emit("linechange", e);
}
</script>

<style lang="scss" scoped src="./PUTextarea.scss"></style>
<style lang="scss">
@use "@/styles/main.scss" as *;

.pu-textarea-placeholder {
  @include pu-font("label-large");
}
</style>
