<template>
  <view :class="rootClass" @click="handleClick">
    <!-- Label -->
    <view v-if="label || $slots.label" :class="labelClass" :style="labelStyle">
      <text
        v-if="isRequired && markerSide === 'before'"
        class="pu-input__required pu-input__required--left"
      >
        *
      </text>

      <view v-if="prefixIcon || $slots.prefix" class="pu-input__prefix">
        <text
          v-if="prefixIcon && !$slots.prefix"
          :class="[prefixIcon, 'pu-input__icon']"
          @click="onClickPrefixIcon"
        />
        <slot v-else name="prefix" />
      </view>

      <view class="pu-input__label-inner">
        <text v-if="label && !$slots.label">{{ label }}</text>
        <slot v-else-if="$slots.label" name="label" />
      </view>

      <text
        v-if="isRequired && markerSide === 'after'"
        class="pu-input__required"
      >
        *
      </text>
    </view>

    <!-- Body -->
    <view class="pu-input__body">
      <view class="pu-input__value">
        <!-- Prefix icon (without label) -->
        <view
          v-if="(prefixIcon || $slots.prefix) && !label"
          class="pu-input__prefix"
        >
          <text
            v-if="prefixIcon && !$slots.prefix"
            :class="[prefixIcon, 'pu-input__icon']"
            @click="onClickPrefixIcon"
          />
          <slot v-else name="prefix" />
        </view>

        <!-- Input -->
        <input
          :class="inputClass"
          :type="type"
          :password="showPassword && !isPwdVisible"
          v-model="inputValue"
          :placeholder="placeholder"
          :disabled="disabled || readonly"
          :maxlength="maxlength"
          :focus="focused"
          :confirm-type="confirmType"
          :confirm-hold="confirmHold"
          :cursor="cursor"
          :cursor-spacing="cursorSpacing"
          :placeholder-style="placeholderStyle"
          :selection-start="selectionStart"
          :selection-end="selectionEnd"
          :adjust-position="adjustPosition"
          :hold-keyboard="holdKeyboard"
          :always-embed="alwaysEmbed"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @confirm="handleConfirm"
          @keyboardheightchange="handleKeyboardHeightChange"
        />

        <!-- Suffix -->
        <view
          v-if="
            showClear ||
            showPassword ||
            showWordCount ||
            suffixIcon ||
            $slots.suffix
          "
          class="pu-input__suffix"
        >
          <!-- Clear button -->
          <text
            v-if="showClear"
            class="i-mdi-close-circle pu-input__clear"
            @click="handleClear"
          />

          <!-- Password toggle -->
          <text
            v-if="showPassword"
            :class="[
              isPwdVisible ? 'i-mdi-eye' : 'i-mdi-eye-off',
              'pu-input__icon',
            ]"
            @click="togglePwdVisible"
          />

          <!-- Word count -->
          <view v-if="showWordCount" class="pu-input__count">
            <text
              :class="[
                inputValue && String(inputValue).length > 0
                  ? 'pu-input__count-current'
                  : '',
                String(inputValue).length > maxlength ? 'is-error' : '',
              ]"
            >
              {{ String(inputValue).length }}
            </text>
            /{{ maxlength }}
          </view>

          <!-- Suffix icon -->
          <text
            v-if="suffixIcon && !$slots.suffix"
            :class="[suffixIcon, 'pu-input__icon']"
            @click="onClickSuffixIcon"
          />
          <slot v-else name="suffix" />
        </view>
      </view>

      <!-- Error message -->
      <view v-if="displayErrorMessage" class="pu-input__error-message">
        {{ displayErrorMessage }}
      </view>
    </view>
  </view>
</template>

<script lang="ts">
export default {
  name: "pu-input",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { computed, ref, watch, useSlots } from "vue";
import { BasicComponentOptions } from "@/utils/vue";
import { puInputProps, puInputEmits } from "./PUInput";

const props = defineProps(puInputProps);
const emit = defineEmits(puInputEmits);
const slots = useSlots();

// ==================== State ====================

const inputValue = ref<string | number>(props.modelValue);
const isPwdVisible = ref(false);
const focused = ref(props.focus);
const focusing = ref(false);
const clearing = ref(false);

// ==================== Computed ====================

const isRequired = computed(() => {
  return props.required || props.rules.some((rule) => rule.required);
});

const showClear = computed(() => {
  const { disabled, readonly, clearable, clearTrigger } = props;
  if (!clearable || disabled || readonly || !inputValue.value) {
    return false;
  }
  return (
    clearTrigger === "always" || (clearTrigger === "focus" && focusing.value)
  );
});

const showWordCount = computed(() => {
  const { disabled, readonly, maxlength, showWordLimit } = props;
  return Boolean(!disabled && !readonly && maxlength > -1 && showWordLimit);
});

const displayErrorMessage = computed(() => {
  return props.errorMessage || "";
});

const rootClass = computed(() => {
  return [
    "pu-input",
    props.label || slots.label ? "is-cell" : "",
    props.center ? "is-center" : "",
    props.size ? `is-${props.size}` : "",
    props.error ? "is-error" : "",
    props.disabled ? "is-disabled" : "",
    inputValue.value && String(inputValue.value).length > 0 ? "is-not-empty" : "",
    props.noBorder ? "is-no-border" : "",
  ].join(" ");
});

const labelClass = computed(() => {
  return `pu-input__label ${props.customLabelClass}`;
});

const inputClass = computed(() => {
  return [
    "pu-input__inner",
    props.prefixIcon ? "pu-input__inner--prefix" : "",
    showWordCount.value ? "pu-input__inner--count" : "",
    props.alignRight ? "is-align-right" : "",
    props.customInputClass,
  ].join(" ");
});

const labelStyle = computed(() => {
  return props.labelWidth
    ? `min-width: ${props.labelWidth}; max-width: ${props.labelWidth}`
    : "";
});

// ==================== Methods ====================

function formatValue(value: string | number) {
  const { maxlength } = props;
  if (maxlength !== -1 && String(value).length > maxlength) {
    return value.toString().slice(0, maxlength);
  }
  return value;
}

function togglePwdVisible() {
  isPwdVisible.value = !isPwdVisible.value;
}

async function handleClear() {
  focusing.value = false;
  inputValue.value = "";

  if (props.focusWhenClear) {
    clearing.value = true;
    focused.value = false;
  }

  await new Promise((resolve) => setTimeout(resolve, 20));

  if (props.focusWhenClear) {
    focused.value = true;
    focusing.value = true;
  }

  emit("update:modelValue", inputValue.value);
  emit("clear");
}

async function handleBlur(event: any) {
  // Wait for clear to complete
  await new Promise((resolve) => setTimeout(resolve, 150));

  if (clearing.value) {
    clearing.value = false;
    return;
  }

  focusing.value = false;
  emit("blur", {
    value: inputValue.value,
    cursor: event.detail.cursor || 0,
  });
}

function handleFocus(event: any) {
  focusing.value = true;
  emit("focus", {
    value: inputValue.value,
    height: event.detail.height || 0,
  });
}

function handleInput(event: any) {
  const value = event.detail.value;
  inputValue.value = value;
  emit("update:modelValue", value);
  emit("input", { value });
}

function handleConfirm(event: any) {
  emit("confirm", {
    value: event.detail.value || inputValue.value,
  });
}

function handleKeyboardHeightChange(event: any) {
  emit("keyboardheightchange", {
    height: event.detail.height,
    duration: event.detail.duration,
  });
}

function onClickPrefixIcon() {
  emit("clickPrefixIcon");
}

function onClickSuffixIcon() {
  emit("clickSuffixIcon");
}

function handleClick() {
  emit("click");
}

// ==================== Watchers ====================

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== inputValue.value) {
      inputValue.value = formatValue(newVal);
    }
  }
);

watch(
  () => props.focus,
  (newVal) => {
    focused.value = newVal;
  }
);

// Initialize
inputValue.value = formatValue(props.modelValue);
</script>

<style lang="scss" scoped src="./PUInput.scss"></style>
